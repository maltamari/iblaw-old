// ==================== 📁 components/dashboard/application-details-dialog.tsx ====================
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Briefcase, Calendar, Download } from "lucide-react";

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

export function ApplicationDetailsDialog({
  application,
  open,
  onClose,
}: {
  application: Application;
  open: boolean;
  onClose: () => void;
}) {
  const handleDownloadCV = async () => {
    if (!application.cv_url) return;
    
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    const { data } = supabase.storage.from("cvs").getPublicUrl(application.cv_url);
    
    window.open(data.publicUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Applicant Info */}
          <div className="rounded-lg border bg-blue-50 p-4">
            <h3 className="font-semibold text-lg mb-3">
              {application.first_name} {application.last_name}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${application.email}`} className="hover:underline">
                  {application.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{application.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{application.position}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Applied on{" "}
                  {new Date(application.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div>
              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}

          {/* CV */}
          {application.cv_url && (
            <div>
              <h3 className="font-semibold mb-2">CV / Resume</h3>
              <Button
                onClick={handleDownloadCV}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.location.href = `mailto:${application.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Reply via Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



