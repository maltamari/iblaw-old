import { getAuditLogs, getActivityStats } from "@/utils/audit";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditAction, ResourceType } from "@/utils/audit";
import BackButton from "@/components/ui/backButton";

export const dynamic = "force-dynamic";

interface SearchParams {
  action?: string;
  resource?: string;
  page?: string;
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 50;
  const offset = (page - 1) * limit;

  // Type-safe action and resource
  // ✅ Convert "all" to undefined for the query
  const action = params.action && params.action !== "all" 
    ? (params.action as AuditAction) 
    : undefined;
  const resourceType = params.resource && params.resource !== "all"
    ? (params.resource as ResourceType)
    : undefined;

  const { data: logs, count } = await getAuditLogs({
    limit,
    offset,
    action,
    resourceType,
  });

  const stats = await getActivityStats();
  const totalPages = Math.ceil((count || 0) / limit);

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      create: "bg-green-100 text-green-800 hover:bg-green-200",
      update: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      delete: "bg-red-100 text-red-800 hover:bg-red-200",
      login: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      logout: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      view: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      download: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    };
    return colors[action] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  const getResourceIcon = (resource: string) => {
    const icons: Record<string, string> = {
      team_member: "👤",
      job_listing: "💼",
      application: "📄",
      message: "✉️",
      auth: "🔐",
    };
    return icons[resource] || "📋";
  };

  const buildUrl = (newPage: number) => {
    const searchParamsObj = new URLSearchParams();
    searchParamsObj.set("page", newPage.toString());
    if (params.action && params.action !== "all") {
      searchParamsObj.set("action", params.action);
    }
    if (params.resource && params.resource !== "all") {
      searchParamsObj.set("resource", params.resource);
    }
    return `/dashboard/audit-logs?${searchParamsObj.toString()}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mt-15 mb-15">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">
          Track all activities and changes in the system
        </p>
        </div>
        <BackButton/>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-3xl">
              {stats.totalActivities.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Last 7 Days</CardDescription>
            <CardTitle className="text-3xl">
              {stats.recentActivities.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Most Active Resource</CardDescription>
            <CardTitle className="text-xl">
              {Object.entries(stats.resourceStats)
                .sort((a, b) => b[1] - a[1])[0]?.[0]
                ?.replace("_", " ") || "N/A"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Most Common Action</CardDescription>
            <CardTitle className="text-xl capitalize">
              {Object.entries(stats.actionStats)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-6">
          <form method="get" className="flex gap-4 flex-wrap items-end">
            <div className="space-x-2">
              <label htmlFor="action" className="text-sm font-medium">
                Action
              </label>
              <Select name="action" defaultValue={params.action || "all"}>
                <SelectTrigger id="action" className="w-[180px]">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  {/* ✅ Use "all" instead of empty string */}
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <label htmlFor="resource" className="text-sm font-medium">
                Resource
              </label>
              <Select name="resource" defaultValue={params.resource || "all"}>
                <SelectTrigger id="resource" className="w-[180px]">
                  <SelectValue placeholder="All Resources" />
                </SelectTrigger>
                <SelectContent>
                  {/* ✅ Use "all" instead of empty string */}
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="team_member">Team Members</SelectItem>
                  <SelectItem value="job_listing">Job Listings</SelectItem>
                  <SelectItem value="application">Applications</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="bg-main">Apply Filters</Button>

            <Button variant="outline" asChild>
              <Link href="/dashboard/audit-logs">Clear Filters</Link>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm font-medium">
                          {log.user_email || "System"}
                        </div>
                        {log.user_id && (
                          <div className="text-xs text-muted-foreground">
                            {log.user_id.slice(0, 8)}...
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action.toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {getResourceIcon(log.resource_type)}
                          </span>
                          <div>
                            <div className="text-sm font-medium">
                              {log.resource_name || "N/A"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.resource_type.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {log.details ? (
                          <details className="cursor-pointer">
                            <summary className="text-sm text-primary hover:underline">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-w-md">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No details
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {log.ip_address || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No audit logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} ({count} total activities)
                  </div>
                  <div className="flex gap-2 py-10">
                    {page > 1 && (
                      <Button variant="outline" asChild>
                        <Link href={buildUrl(page - 1)}>Previous</Link>
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button className="bg-main " asChild >
                        <Link href={buildUrl(page + 1)}>Next</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}