"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteJobListing } from "@/utils/job-listing-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditJobListingDialog } from "./edit-job-listing-dialog";
import { JobListing } from "@/utils/job-listing-actions";

export function JobListingsTable({ jobs }: { jobs: JobListing[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editJob, setEditJob] = useState<JobListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteJobListing(deleteId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Job listing deleted successfully");
    }

    setIsDeleting(false);
    setDeleteId(null);
  };


  const formatType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="text-center bg-muted">
              <TableHead className="w-10">#</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-10 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No job listings found
                </TableCell>
              </TableRow>
            ) : (
              sortedJobs.map((job, index) => (
                <TableRow key={job.id} >
                  <TableCell className="w-10 font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="w-80 font-medium">
                    {job.title}
                  </TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <span className=" inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#2f6894] text-white">
                      {formatType(job.type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditJob(job)}
                        className="hover:bg-[#4c7da3] hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(job.id)}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {editJob && (
        <EditJobListingDialog
          job={editJob}
          open={!!editJob}
          onClose={() => setEditJob(null)}
        />
      )}
    </>
  );
}