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
import { Loader2 } from "lucide-react";
import { JobListing, updateJobListing } from "@/utils/job-listing-actions";
import { toast } from "sonner";

type EditJobListingDialogProps = {
  job: JobListing;
  open: boolean;
  onClose: () => void;
};

export function EditJobListingDialog({
  job,
  open,
  onClose,
}: EditJobListingDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState(job.type);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateJobListing(job.id, formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Job listing updated successfully!");
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Job Listing</DialogTitle>
            <DialogDescription>
              Update the job listing information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Basic Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-title">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={job.title}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-department"
                    name="department"
                    defaultValue={job.department}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-location">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={job.location}
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-type">
                  Employment Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  name="type"
                  value={type}
                  onValueChange={setType}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="type" value={type} />
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Job Details</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={job.description}
                  placeholder="Write a detailed job description..."
                  rows={6}
                  required
                  disabled={isPending}
                  className="resize-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-requirements">
                  Requirements <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="edit-requirements"
                  name="requirements"
                  defaultValue={job.requirements?.join('\n') || ""}
                  placeholder="One requirement per line&#10;Example:&#10;5+ years of experience&#10;LLB degree required&#10;Excellent communication skills"
                  rows={6}
                  required
                  disabled={isPending}
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter each requirement on a new line
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