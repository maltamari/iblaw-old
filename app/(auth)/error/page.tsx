// app/(auth)/error/page.tsx
import Link from "next/link";
import { AlertCircle } from "lucide-react";

// Whitelist of safe error messages
const SAFE_ERROR_MESSAGES: Record<string, string> = {
  verification_failed: "Email verification failed. The link may have expired or is invalid.",
  invalid_request: "Invalid request. Please try again.",
  unauthorized: "You don't have permission to access this resource.",
  session_expired: "Your session has expired. Please sign in again.",
  invalid_credentials: "Invalid email or password.",
  email_not_confirmed: "Please verify your email address before signing in.",
  too_many_requests: "Too many attempts. Please try again later.",
  server_error: "An unexpected error occurred. Please try again later.",
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; code?: string }>;
}) {
  const { message, code } = await searchParams;
  // Sanitize error message - only show whitelisted messages
  const messageKey = message || code || "server_error";
  const safeMessage = SAFE_ERROR_MESSAGES[messageKey] || DEFAULT_ERROR_MESSAGE;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-lg">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* Error Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>
          <p className="text-sm text-gray-500">
            We encountered an issue processing your request
          </p>
        </div>

        {/* Error Message */}
        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          <p className="text-sm text-destructive text-center">{safeMessage}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Link
            href="/login"
            className="block w-full text-center px-4 py-3 bg-main text-white rounded-lg hover:bg-main/90 transition-colors font-medium"
          >
            Back to Login
          </Link>

          <Link
            href="/"
            className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-gray-500 pt-4">
          If this problem persists, please{" "}
          <Link href="/contact" className="text-main underline hover:no-underline">
            contact support
          </Link>
        </p>
      </div>
    </div>
  );
}