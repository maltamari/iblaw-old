// ==================== 📁 components/dashboard/edit-team-member-dialog.tsx (Fixed) ====================
"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2, ExternalLink } from "lucide-react";
import { TeamMember, TeamCategory, updateTeamMember } from "@/utils/team-actions";
import { toast } from "sonner";
import Link from "next/link";

type EditTeamMemberDialogProps = {
  member: TeamMember;
  open: boolean;
  onClose: () => void;
};

export function EditTeamMemberDialog({
  member,
  open,
  onClose,
}: EditTeamMemberDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<TeamCategory>(member.category);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateTeamMember(member.id, formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Team member updated successfully!");
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Edit Team Member</DialogTitle>
                <DialogDescription>
                  Update the team member information. Click save when you're done.
                </DialogDescription>
              </div>
              {member.slug && (
                <Link 
                  href={`/team/${member.slug}`} 
                  target="_blank"
                  className="text-sm text-main hover:underline flex items-center gap-1"
                >
                  View Profile <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={member.name}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-slug">Slug (URL)</Label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    defaultValue={member.slug}
                    placeholder="auto-generated-from-name"
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to auto-generate
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-role"
                  name="role"
                  defaultValue={member.role}
                  placeholder="Senior Partner"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-department">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-department"
                  name="department"
                  defaultValue={member.department}
                  placeholder="Litigation"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="category"
                    value={category}
                    onValueChange={(value) => setCategory(value as TeamCategory)}
                    disabled={isPending}
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
                  <input type="hidden" name="category" value={category} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-display_order">Display Order</Label>
                  <Input
                    id="edit-display_order"
                    name="display_order"
                    type="number"
                    defaultValue={member.display_order}
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
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={member.email || ""}
                    placeholder="name@iblaw.com"
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    defaultValue={member.phone || ""}
                    placeholder="+962 6 XXX XXXX"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Profile Details</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-biography">Biography</Label>
                <Textarea
                  id="edit-biography"
                  name="biography"
                  defaultValue={member.biography || ""}
                  placeholder="Write a detailed biography..."
                  rows={6}
                  disabled={isPending}
                  className="resize-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-education">Education</Label>
                <Textarea
                  id="edit-education"
                  name="education"
                  defaultValue={member.education?.join('\n') || ""}
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
                <Label htmlFor="edit-practice_areas">Practice Areas</Label>
                <Textarea
                  id="edit-practice_areas"
                  name="practice_areas"
                  defaultValue={member.practice_areas?.join('\n') || ""}
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
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-main">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}