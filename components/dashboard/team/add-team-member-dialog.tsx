"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { addTeamMember } from "@/utils/team-actions";
import { toast } from "sonner";

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("partner");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await addTeamMember(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Team member added successfully!");
        setOpen(false);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main">
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                name="role"
                placeholder="Senior Partner"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                name="department"
                placeholder="Litigation"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                name="category"
                value={category}
                onValueChange={setCategory}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="associate">Associate</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="trainee">Trainee</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="category" value={category} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                placeholder="0"
                defaultValue="0"
                disabled={isPending}
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-main">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}