import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Shield, AlertTriangle, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>AI Shield</span>
              </Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-6xl p-5 w-full">
          <Hero />

          <section className="px-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              The Challenge
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 border rounded-lg bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">The Risk</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Employees using unapproved or "shadow" AI tools</li>
                      <li>
                        • Accidental data leakage outside the organisation
                      </li>
                      <li>
                        • Exposure of intellectual property or personal data
                      </li>
                      <li>• Increased attack surface for data extraction</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-primary/5">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">The Solution</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Real-time detection of AI tool usage</li>
                      <li>• Contextual warnings and guidance</li>
                      <li>• Redirect to approved AI environments</li>
                      <li>• Comprehensive logging and visibility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Install Extension</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy the Chrome extension to your team's browsers
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Auto-Detect</h3>
                <p className="text-sm text-muted-foreground">
                  AI Shield monitors for AI tool interactions in real-time
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Guide Users</h3>
                <p className="text-sm text-muted-foreground">
                  Show warnings and redirect to approved alternatives
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold mb-2">Monitor & Report</h3>
                <p className="text-sm text-muted-foreground">
                  Track usage patterns and compliance in your dashboard
                </p>
              </div>
            </div>
          </section>

          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Get Started</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>AI Shield • Secure AI Usage Monitoring</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
