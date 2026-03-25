// components/dashboard/job-listing/job-listing-dialogs.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { JobListingForm } from "./job-listing-form";
import { JobListing, addJobListing, updateJobListing } from "@/utils/job-listing-actions";

// ✅ Add Dialog
export function AddJobListingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main">
          <Plus className="mr-2 h-4 w-4" />
          Add Job Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Job Listing</DialogTitle>
          <DialogDescription>
            Create a new job opening. Fill in all the required information.
          </DialogDescription>
        </DialogHeader>

        <JobListingForm
          onSubmit={addJobListing}
          submitLabel="Add Job Listing"
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// ✅ Edit Dialog
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
  const handleUpdate = async (formData: FormData) => {
    return await updateJobListing(job.id, formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Listing</DialogTitle>
          <DialogDescription>
            Update the job listing information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <JobListingForm
          initialData={job}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}