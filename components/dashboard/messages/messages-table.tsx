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
import { Eye, Trash2, Search } from "lucide-react";
import { MessageDetailsDialog } from "./message-details-dialog";
import { DeleteMessageDialog } from "./delete-message-dialog";

type Message = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export function MessagesTable({ messages }: { messages: Message[] }) {
  const [search, setSearch] = useState("");
  const [viewMessage, setViewMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = messages.filter((msg) =>
    `${msg.first_name} ${msg.last_name} ${msg.email} ${msg.subject}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {messages.length} messages
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {search ? "No matching messages" : "No messages yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">
                      {msg.first_name} {msg.last_name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{msg.subject}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>
                      {new Date(msg.created_at).toLocaleDateString("en-US", {
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
                          onClick={() => setViewMessage(msg)}
                          title="View Message"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(msg.id)}
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
      {viewMessage && (
        <MessageDetailsDialog
          message={viewMessage}
          open={!!viewMessage}
          onClose={() => setViewMessage(null)}
        />
      )}
      
      {deleteId && (
        <DeleteMessageDialog
          id={deleteId}
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
        />
      )}
    </>
  );
}