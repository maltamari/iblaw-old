// components/dashboard/messages/messages-table-with-filter.tsx
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Trash2, Filter } from "lucide-react";
import { MessageDetailsDialog } from "./message-details-dialog";
import { DeleteMessageDialog } from "./delete-message-dialog";
import { SUBJECT_OPTIONS } from "@/lib/constants";
import type { Message } from "@/lib/message";


interface Props {
  messages: Message[];
  subjectStats: Record<string, number>;
}

export function MessagesTableWithFilter({ messages, subjectStats }: Props) {
  const [search,] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [viewMessage, setViewMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter by subject first, then by search
  const filtered = messages
    .filter((msg) => {
      if (selectedSubject === "all") return true;
      return msg.subject_key === selectedSubject;
    })
    .filter((msg) =>
      `${msg.first_name} ${msg.last_name} ${msg.email} ${msg.subject}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // Get subject label from key
  const getSubjectLabel = (key?: string) => {
    if (!key) return "Other";
    const option = SUBJECT_OPTIONS.find((opt) => opt.value === key);
    return option?.label || key;
  };



  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card
            className={`cursor-pointer hover:shadow-md transition ${
              selectedSubject === "all" ? "ring-2 ring-main" : ""
            }`}
            onClick={() => setSelectedSubject("all")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                All Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>

          {SUBJECT_OPTIONS.slice(0, SUBJECT_OPTIONS.length).map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer hover:shadow-md transition ${
                selectedSubject === option.value ? "ring-2 ring-main" : ""
              }`}
              onClick={() => setSelectedSubject(option.value)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-2 min-h-10">
                  {option.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subjectStats[option.value] || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Subject Filter */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {SUBJECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground flex items-center">
            Showing {filtered.length} of {messages.length}
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
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
                    {search || selectedSubject !== "all"
                      ? "No matching messages"
                      : "No messages yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">
                      {msg.first_name} {msg.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getSubjectLabel(msg.subject_key)}
                      </Badge>
                    </TableCell>
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