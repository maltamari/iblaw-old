// components/dashboard/team/add-team-member-dialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Upload, X, FileDown, FileText } from "lucide-react";
import { addTeamMember, TeamCategory } from "@/utils/team-actions";
import { uploadToCloudinary, deleteFromCloudinary, uploadVCardToCloudinary, uploadPDFToCloudinary } from "@/utils/cloudinary-upload";
import { toast } from "sonner";
import Image from "next/image";

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<TeamCategory>("partner");
  
  // Photo states
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPublicId, setPhotoPublicId] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // vCard states
  const [vcardUrl, setVcardUrl] = useState("");
  const [vcardPublicId, setVcardPublicId] = useState("");
  const [isUploadingVcard, setIsUploadingVcard] = useState(false);
  const vcardInputRef = useRef<HTMLInputElement>(null);
  
  // PDF states
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfPublicId, setPdfPublicId] = useState("");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // ✅ Handle Photo Upload
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

    setIsUploadingPhoto(true);
    toast.loading('Uploading photo...', { id: 'upload-photo' });

    const result = await uploadToCloudinary(file);

    toast.dismiss('upload-photo');
    setIsUploadingPhoto(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setPhotoUrl(result.url!);
      setPhotoPublicId(result.publicId!);
      toast.success('Photo uploaded successfully!');
    }
  };

  // ✅ Handle vCard Upload
  const handleVcardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.vcf')) {
      toast.error('Please select a vCard file (.vcf)');
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB max for vCard
      toast.error('vCard file should be less than 1MB');
      return;
    }

    setIsUploadingVcard(true);
    toast.loading('Uploading vCard...', { id: 'upload-vcard' });

    const result = await uploadVCardToCloudinary(file);

    toast.dismiss('upload-vcard');
    setIsUploadingVcard(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setVcardUrl(result.url!);
      setVcardPublicId(result.publicId!);
      toast.success('vCard uploaded successfully!');
    }
  };

  // ✅ Handle PDF Upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max for PDF
      toast.error('PDF file should be less than 5MB');
      return;
    }

    setIsUploadingPdf(true);
    toast.loading('Uploading PDF...', { id: 'upload-pdf' });

    const result = await uploadPDFToCloudinary(file);

    toast.dismiss('upload-pdf');
    setIsUploadingPdf(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setPdfUrl(result.url!);
      setPdfPublicId(result.publicId!);
      toast.success('PDF uploaded successfully!');
    }
  };

  // ✅ Remove handlers
  const handleRemovePhoto = async () => {
    if (photoPublicId) {
      await deleteFromCloudinary(photoPublicId);
    }
    setPhotoUrl("");
    setPhotoPublicId("");
    if (photoInputRef.current) photoInputRef.current.value = "";
    toast.success('Photo removed');
  };

  const handleRemoveVcard = async () => {
    if (vcardPublicId) {
      await deleteFromCloudinary(vcardPublicId);
    }
    setVcardUrl("");
    setVcardPublicId("");
    if (vcardInputRef.current) vcardInputRef.current.value = "";
    toast.success('vCard removed');
  };

  const handleRemovePdf = async () => {
    if (pdfPublicId) {
      await deleteFromCloudinary(pdfPublicId);
    }
    setPdfUrl("");
    setPdfPublicId("");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    toast.success('PDF removed');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (photoUrl) formData.set('photo_url', photoUrl);
    if (vcardUrl) formData.set('vcard_url', vcardUrl);
    if (pdfUrl) formData.set('bio_pdf_url', pdfUrl);

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
        setVcardUrl("");
        setVcardPublicId("");
        setPdfUrl("");
        setPdfPublicId("");
        setCategory("partner");
      }
    });
  };

  const isAnyUploading = isUploadingPhoto || isUploadingVcard || isUploadingPdf;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main">
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="auto-generated-from-name"
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to auto-generate
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">
                  Role 
                </Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Senior Partner"
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="department">
                  Department 
                </Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Litigation"
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="category"
                    value={category}
                    onValueChange={(value) => setCategory(value as TeamCategory)}
                    disabled={isPending}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="associate">Associate</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="trainee">Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="hidden" name="category" value={category} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="oath_year">Oath Year</Label>
                  <Input
                    id="oath_year"
                    name="oath_year"
                    type="number"
                    placeholder="0"
                    defaultValue="0"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Contact Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@iblaw.com"
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+962 6 XXX XXXX"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            {/* ✅ Files & Media Section with Cloudinary Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Files & Media</h3>
              
              <div className="grid gap-4">
                {/* Photo Upload with Preview */}
                <div className="grid gap-2">
                  <Label>Profile Photo</Label>

                  {/* Photo Preview */}
                  {photoUrl && (
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 group">
                      <Image src={photoUrl} alt="Preview" fill className="object-cover" unoptimized />
                      <Button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        disabled={isPending || isAnyUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex gap-2">
                    <Input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isPending || isAnyUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isPending || isAnyUploading}
                      className="gap-2"
                    >
                      {isUploadingPhoto ? (
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

                  {/* Hidden input for form submission */}
                  <input type="hidden" name="photo_url" value={photoUrl} />

                  <p className="text-xs text-muted-foreground">
                    Max size: 10MB. Formats: JPG, PNG, WebP. Photo will be optimized automatically.
                  </p>
                </div>

                {/* vCard Upload */}
                <div className="grid gap-2">
                  <Label>vCard File</Label>
                  
                  {vcardUrl && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileDown className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-700 flex-1">vCard uploaded</span>
                      <button
                        type="button"
                        onClick={handleRemoveVcard}
                        className="text-red-500 hover:text-red-600"
                        disabled={isPending || isAnyUploading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      ref={vcardInputRef}
                      type="file"
                      accept=".vcf"
                      onChange={handleVcardUpload}
                      className="hidden"
                      disabled={isPending || isAnyUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => vcardInputRef.current?.click()}
                      disabled={isPending || isAnyUploading}
                      className="gap-2"
                    >
                      {isUploadingVcard ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileDown className="h-4 w-4" />
                          {vcardUrl ? "Change vCard" : "Upload vCard"}
                        </>
                      )}
                    </Button>
                  </div>
                  <input type="hidden" name="vcard_url" value={vcardUrl} />
                  <p className="text-xs text-muted-foreground">
                    Max 1MB. .vcf file format only.
                  </p>
                </div>

                {/* Bio PDF Upload */}
                <div className="grid gap-2">
                  <Label>Biography PDF</Label>
                  
                  {pdfUrl && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-700 flex-1">PDF uploaded</span>
                      <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="text-red-500 hover:text-red-600"
                        disabled={isPending || isAnyUploading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      disabled={isPending || isAnyUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={isPending || isAnyUploading}
                      className="gap-2"
                    >
                      {isUploadingPdf ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          {pdfUrl ? "Change PDF" : "Upload PDF"}
                        </>
                      )}
                    </Button>
                  </div>
                  <input type="hidden" name="bio_pdf_url" value={pdfUrl} />
                  <p className="text-xs text-muted-foreground">
                    Max 5MB. PDF format only.
                  </p>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Profile Details</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                  id="biography"
                  name="biography"
                  placeholder="Write a detailed biography..."
                  rows={6}
                  disabled={isPending}
                  className="resize-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  placeholder="One qualification per line&#10;Example:&#10;LLM from University of X&#10;LLB from University of Y"
                  rows={4}
                  disabled={isPending}
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter each qualification on a new line
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="practice_areas">Practice Areas</Label>
                <Textarea
                  id="practice_areas"
                  name="practice_areas"
                  placeholder="One practice area per line&#10;Example:&#10;Intellectual Property&#10;Corporate Law&#10;Litigation"
                  rows={4}
                  disabled={isPending}
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter each practice area on a new line
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending || isAnyUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || isAnyUploading} 
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