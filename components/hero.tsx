import { Shield } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-4 justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Shield
            </h1>
            <p className="text-sm text-muted-foreground">
              Chrome Extension Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="text-center max-w-3xl space-y-4">
        <h2 className="text-2xl lg:text-3xl font-semibold">
          Secure Your Organization's AI Usage
        </h2>
        <p className="text-lg text-muted-foreground">
          Monitor, guide, and protect employees from accidental data leakage
          when using AI tools. Real-time detection, contextual warnings, and
          comprehensive visibility.
        </p>
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <Shield className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full mt-4">
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-500/10 rounded">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold">Detect AI Usage</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Automatically identify when employees visit or interact with AI
            tools across known domains and embedded widgets.
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-500/10 rounded">
              <svg
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="font-semibold">Guide Users</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Provide contextual warnings and redirect employees to approved AI
            environments when unapproved tools are detected.
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-500/10 rounded">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold">Track & Analyze</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Capture comprehensive logs and insights into AI interactions,
            compliance rates, and risk patterns across your organization.
          </p>
        </div>
      </div>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
