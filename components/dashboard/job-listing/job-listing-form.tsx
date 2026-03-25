// components/dashboard/job-listing/job-listing-form.tsx
"use client";

import { useState, useTransition } from "react";
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
import { JobListing } from "@/utils/job-listing-actions";
import { toast } from "sonner";
import { positions } from "@/lib/careerData";

type JobListingFormProps = {
  initialData?: JobListing;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  submitLabel: string;
  onCancel: () => void;
};

// ✅ Validation helpers
const validateTitle = (title: string): boolean => {
  return title.trim().length >= 3 && title.trim().length <= 200;
};

const validateDescription = (desc: string): boolean => {
  return desc.trim().length >= 50 && desc.trim().length <= 5000;
};

export function JobListingForm({
  initialData,
  onSubmit,
  submitLabel,
  onCancel,
}: JobListingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState(initialData?.type || '"full-time" | "part-time" | "contract" | "internship"');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Client-side validation
  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    const title = formData.get("title") as string;
    if (!title || !validateTitle(title)) {
      newErrors.title = "Title must be 3-200 characters";
    }

    const description = formData.get("description") as string;
    if (!description || !validateDescription(description)) {
      newErrors.description = "Description must be 50-5000 characters";
    }

    const requirements = (formData.get("requirements") as string)
      ?.split('\n')
      .filter(r => r.trim());
    if (!requirements || requirements.length === 0) {
      newErrors.requirements = "At least one requirement is needed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // ✅ Validate
    if (!validateForm(formData)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        if (result.error) {
          toast.error(result.error);
        } else {
          const successMessage = initialData
            ? "Job listing updated successfully!"
            : "Job listing added successfully!";

          toast.success(successMessage);

          // ✅ Reset form only if adding
          if (!initialData) {
            (e.target as HTMLFormElement).reset();
            setType("full-time");
            setErrors({});
          }

          onCancel(); // Close dialog
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 py-4">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Basic Information
          </h3>
                <div className="grid gap-2">
                  <Label htmlFor="title">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="title"
                    name="title"
                    defaultValue={initialData?.title || ""}
                    required
                    disabled={isPending}
                    aria-invalid={!!errors.title}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select a job title</option>
                    {positions.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title}</p>
                  )}
                </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="department">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                name="department"
                defaultValue={initialData?.department}
                placeholder="Litigation"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                defaultValue={initialData?.location}
                placeholder="Amman, Jordan"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">
              Employment Type <span className="text-destructive">*</span>
            </Label>
            <Select
              name="type"
              value={type}
              onValueChange={setType}
              disabled={isPending}
              required
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
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Job Details
          </h3>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              placeholder="Write a detailed job description..."
              rows={6}
              required
              disabled={isPending}
              className="resize-none"
              maxLength={5000}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="requirements">
              Requirements <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              defaultValue={initialData?.requirements?.join('\n')}
              placeholder="One requirement per line&#10;Example:&#10;5+ years of experience&#10;LLB degree required&#10;Excellent communication skills"
              rows={6}
              required
              disabled={isPending}
              className="resize-none font-mono text-sm"
              aria-invalid={!!errors.requirements}
            />
            {errors.requirements && (
              <p className="text-xs text-destructive">{errors.requirements}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter each requirement on a new line
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}