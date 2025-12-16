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
import { deleteTeamMember } from "@/utils/team-actions";
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
import { EditTeamMemberDialog } from "./edit-team-member-dialog";
import { TeamMember } from "@/utils/team-actions";

// ألوان مختلفة لكل category
const categoryStyles = {
  partner: {
    bg: "bg-blue-100",
    text: "text-blue-800"
  },
  associate: {
    bg: "bg-green-100",
    text: "text-green-800"
  },
  management: {
    bg: "bg-purple-100",
    text: "text-purple-800"
  },
  trainee: {
    bg: "bg-orange-100",
    text: "text-orange-800"
  },
};

export function TeamMembersTable({ members }: { members: TeamMember[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ترتيب الأعضاء أبجدياً حسب الاسم
  const sortedMembers = [...members].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteTeamMember(deleteId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Team member deleted successfully");
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              sortedMembers.map((member, index) => {
                const categoryStyle = categoryStyles[member.category as keyof typeof categoryStyles] || categoryStyles.partner;
                
                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.name}
                      {!member.slug && (
                        <span className="ml-2 text-xs text-red-600 font-normal">
                          (No slug - click edit to generate)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                        {member.category.charAt(0).toUpperCase() + member.category.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditMember(member)}
                          className="hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(member.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
              This action cannot be undone. This will permanently delete the team member.
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
      {editMember && (
        <EditTeamMemberDialog
          member={editMember}
          open={!!editMember}
          onClose={() => setEditMember(null)}
        />
      )}
    </>
  );
}