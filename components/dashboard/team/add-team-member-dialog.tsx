"use client";

import { useState, useTransition, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Upload, X } from "lucide-react";
import { addTeamMember } from "@/utils/team-actions";
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/cloudinary-upload";
import { toast } from "sonner";
import Image from "next/image";

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("partner");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPublicId, setPhotoPublicId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    toast.loading('Uploading photo...', { id: 'upload-photo' });

    const result = await uploadToCloudinary(file);

    toast.dismiss('upload-photo');
    setIsUploading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setPhotoUrl(result.url!);
      setPhotoPublicId(result.publicId!);
      toast.success('Photo uploaded successfully!');
    }
  };

  const handleRemovePhoto = async () => {
    if (photoPublicId) {
      toast.loading('Removing photo...', { id: 'remove-photo' });
      await deleteFromCloudinary(photoPublicId);
      toast.dismiss('remove-photo');
    }
    setPhotoUrl("");
    setPhotoPublicId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success('Photo removed');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (photoUrl) {
      formData.set('photo_url', photoUrl);
    }

    startTransition(async () => {
      const result = await addTeamMember(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Team member added successfully!");
        setOpen(false);
        (e.target as HTMLFormElement).reset();
        setPhotoUrl("");
        setPhotoPublicId("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main">
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                name="role"
                placeholder="Senior Partner"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                name="department"
                placeholder="Litigation"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                name="category"
                value={category}
                onValueChange={setCategory}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="associate">Associate</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="trainee">Trainee</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="category" value={category} />
            </div>

            {/* ✅ Photo Upload with Cloudinary */}
            <div className="grid gap-2">
              <Label>Profile Photo</Label>

              {photoUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <Image
                    src={photoUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    disabled={isPending || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isPending || isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending || isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {photoUrl ? "Change Photo" : "Upload Photo"}
                    </>
                  )}
                </Button>
              </div>

              <input type="hidden" name="photo_url" value={photoUrl} />

              <p className="text-sm text-muted-foreground">
                Max size: 10MB. Photo will be optimized automatically.
              </p>
            </div>

            {/* ✅ vCard & PDF URLs (Direct Links) */}
            <div className="grid gap-2">
              <Label htmlFor="vcard_url">vCard URL (Contact Card)</Label>
              <Input
                id="vcard_url"
                name="vcard_url"
                type="url"
                placeholder="https://example.com/contact.vcf"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Direct link to .vcf file for adding contact to phone
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio_pdf_url">Biography PDF URL</Label>
              <Input
                id="bio_pdf_url"
                name="bio_pdf_url"
                type="url"
                placeholder="https://example.com/bio.pdf"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Direct link to PDF for viewing/downloading
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                placeholder="0"
                defaultValue="0"
                disabled={isPending}
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending || isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || isUploading} 
              className="bg-main"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}