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
import { Input } from "@/components/ui/input";
import { Eye, Download, Trash2, Search } from "lucide-react";
import { ApplicationDetailsDialog } from "./application-details-dialog";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { getSignedCVUrl } from "@/utils/application-actions";
import { toast } from "sonner";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  cover_letter: string | null;
  cv_url: string | null;
  created_at: string;
};

export function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  const [search, setSearch] = useState("");
  const [viewApplication, setViewApplication] = useState<Application | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = applications.filter((app) =>
    `${app.first_name} ${app.last_name} ${app.email} ${app.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDownloadCV = async (cvUrl: string | null, applicantName: string) => {
    if (!cvUrl) {
      toast.error("No CV available");
      return;
    }

    setDownloading(cvUrl);

    try {
      const result = await getSignedCVUrl(cvUrl);

      if (result.error || !result.data) {
        toast.error("Failed to download CV");
        return;
      }

      // Open in new tab
      window.open(result.data, "_blank");
      toast.success("CV opened in new tab");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download CV");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {applications.length} applications
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    {search
                      ? "No matching applications"
                      : "No applications yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.first_name} {app.last_name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {app.position}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{app.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewApplication(app)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {app.cv_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDownloadCV(
                                app.cv_url,
                                `${app.first_name} ${app.last_name}`
                              )
                            }
                            title="Download CV"
                            disabled={downloading === app.cv_url}
                          >
                            <Download
                              className={`h-4 w-4 ${
                                downloading === app.cv_url ? "animate-pulse" : ""
                              }`}
                            />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(app.id)}
                          title="Delete"
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
      </div>

      {/* Dialogs */}
      {viewApplication && (
        <ApplicationDetailsDialog
          application={viewApplication}
          open={!!viewApplication}
          onClose={() => setViewApplication(null)}
        />
      )}

      {deleteId && (
        <DeleteApplicationDialog
          id={deleteId}
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
        />
      )}
    </>
  );
}