//message-details-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User } from "lucide-react";
import type { Message } from "@/lib/message";


export function MessageDetailsDialog({
  message,
  open,
  onClose,
}: {
  message: Message;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sender Info */}
          <div className="rounded-lg border bg-purple-50 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {message.first_name} {message.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${message.email}`} className="hover:underline">
                  {message.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(message.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
              Subject
            </h3>
            <p className="text-lg font-medium">{message.subject}</p>
          </div>

          {/* Message */}
          <div>
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
              Message
            </h3>
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between w-full gap-2 pt-4 border-t">
            <Button className="bg-main" onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}>
              <Mail className="mr-2 h-4 w-4 " />
              Reply via Email
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
