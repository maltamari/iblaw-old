// components/dashboard/team/add-team-member-dialog.tsx
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
import { addTeamMember } from "@/utils/team-actions";
import { TeamMemberForm } from "./team-member-form";

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main">
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team. Fill in all the required information.
          </DialogDescription>
        </DialogHeader>

        <TeamMemberForm
          onSubmit={addTeamMember}
          submitLabel="Add Member"
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}