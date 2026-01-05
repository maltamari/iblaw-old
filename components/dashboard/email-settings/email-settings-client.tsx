"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Save, RefreshCw, CheckCircle2 } from "lucide-react";

type EmailMapping = {
  id: string;
  subject_key: string;
  subject_label: string;
  email: string;
};

interface Props {
  initialMappings: EmailMapping[];
}

export function EmailSettingsClient({ initialMappings }: Props) {
  const [mappings, setMappings] = useState<EmailMapping[]>(initialMappings);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  async function updateEmail(id: string, newEmail: string) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSaving(id);
    try {
      const { error } = await supabase
        .from("subject_email_mappings")
        .update({ email: newEmail, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      // Show success feedback
      setSavedIds(prev => new Set(prev).add(id));
      setTimeout(() => {
        setSavedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);

      toast.success("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setSaving(null);
    }
  }

  const handleEmailChange = (id: string, newEmail: string) => {
    setMappings(prev =>
      prev.map(m => (m.id === id ? { ...m, email: newEmail } : m))
    );
    // Remove saved indicator when user starts typing
    setSavedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How it works</h3>
              <p className="text-sm text-blue-800">
                When a user submits a contact form with a specific subject, the message
                will be sent to both the user (confirmation) and the configured email
                address for that subject category. Update the emails below to route messages
                to the appropriate departments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Mappings */}
      <div className="space-y-4">
        {mappings.map((mapping) => (
          <Card key={mapping.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {mapping.subject_label}
                {savedIds.has(mapping.id) && (
                  <span className="flex items-center gap-2 text-sm font-normal text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Messages with this subject will be forwarded to the email below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={mapping.email}
                    onChange={(e) => handleEmailChange(mapping.id, e.target.value)}
                    placeholder="department@iblaw.com"
                    disabled={saving === mapping.id}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={() => updateEmail(mapping.id, mapping.email)}
                  disabled={saving === mapping.id || savedIds.has(mapping.id)}
                  className="bg-main hover:bg-main/90"
                >
                  {saving === mapping.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Important Note</h3>
              <p className="text-sm text-yellow-800">
                Make sure the email addresses you configure are valid and monitored regularly.
                Invalid emails will result in failed message delivery.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}