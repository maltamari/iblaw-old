// components/dashboard/team/edit-team-member-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamMember, updateTeamMember } from "@/utils/team-actions";
import { TeamMemberForm } from "./team-member-form";

type EditTeamMemberDialogProps = {
  member: TeamMember;
  open: boolean;
  onClose: () => void;
};

export function EditTeamMemberDialog({ member, open, onClose }: EditTeamMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update the team member information. Click save when you&apos;re done.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <TeamMemberForm
          initialData={member}
          onSubmit={(formData) => updateTeamMember(member.id, formData)}
          submitLabel="Save Changes"
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}