import Link from "next/link";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
        {searchParams.message && (
          <p className="text-muted-foreground bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            {searchParams.message}
          </p>
        )}
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="text-sm underline hover:no-underline text-main"
          >
            Back to Login
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/" className="text-sm underline hover:no-underline text-main">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}