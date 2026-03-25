/// utils/audit.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'download';
export type ResourceType = 'team_member' | 'job_listing' | 'application' | 'message' | 'auth';

// ✅ Type for audit log details - can contain any JSON-serializable data
export type AuditDetails = Record<string, unknown>;

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: AuditAction;
  resource_type: ResourceType;
  resource_id: string | null;
  resource_name: string | null;
  details: AuditDetails | null;  // ✅ Changed from Record<string, any>
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Log an activity to the audit log
 */
export async function logActivity({
  action,
  resourceType,
  resourceId,
  resourceName,
  details,
}: {
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  resourceName?: string;
  details?: AuditDetails;
  userOverride?: {
    id: string | null;
    email: string | null;
  };
}) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get headers for IP and User Agent
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Insert audit log
    const { error } = await supabase.from("audit_logs").insert({
      user_id: user?.id || null,
      user_email: user?.email || null,
      action,
      resource_type: resourceType,
      resource_id: resourceId || null,
      resource_name: resourceName || null,
      details: details || null,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (error) {
      console.error("Error logging activity:", error);
    }
  } catch (error) {
    console.error("Unexpected error logging activity:", error);
  }
}

/**
 * Get audit logs with optional filters
 */
export async function getAuditLogs({
  limit = 100,
  offset = 0,
  action,
  resourceType,
  userId,
}: {
  limit?: number;
  offset?: number;
  action?: AuditAction;
  resourceType?: ResourceType;
  userId?: string;
} = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("audit_logs")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) {
    query = query.eq("action", action);
  }

  if (resourceType) {
    query = query.eq("resource_type", resourceType);
  }

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching audit logs:", error);
    return { data: null, error: error.message, count: 0 };
  }

  return { data: data as AuditLog[], error: null, count: count || 0 };
}

/**
 * Get audit logs for a specific resource
 */
export async function getResourceAuditLogs(resourceType: ResourceType, resourceId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("resource_type", resourceType)
    .eq("resource_id", resourceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resource audit logs:", error);
    return { data: null, error: error.message };
  }

  return { data: data as AuditLog[], error: null };
}

/**
 * Get activity statistics
 */
export async function getActivityStats() {
  const supabase = await createClient();

  // Get total activities
  const { count: totalActivities } = await supabase
    .from("audit_logs")
    .select("*", { count: 'exact', head: true });

  // Get activities by action type
  const { data: actionStats } = await supabase
    .from("audit_logs")
    .select("action")
    .then(result => {
      const stats: Record<string, number> = {};
      result.data?.forEach(log => {
        stats[log.action] = (stats[log.action] || 0) + 1;
      });
      return { data: stats };
    });

  // Get activities by resource type
  const { data: resourceStats } = await supabase
    .from("audit_logs")
    .select("resource_type")
    .then(result => {
      const stats: Record<string, number> = {};
      result.data?.forEach(log => {
        stats[log.resource_type] = (stats[log.resource_type] || 0) + 1;
      });
      return { data: stats };
    });

  // Get recent activities (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { count: recentActivities } = await supabase
    .from("audit_logs")
    .select("*", { count: 'exact', head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  return {
    totalActivities: totalActivities || 0,
    recentActivities: recentActivities || 0,
    actionStats: actionStats || {},
    resourceStats: resourceStats || {},
  };
}