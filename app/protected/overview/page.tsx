import { createClient } from "@/lib/supabase/server";
import { OverviewClient } from "@/components/dashboard/overview-client";
import { redirect } from "next/navigation";

export default async function Overview() {
  const supabase = await createClient();

  // Get current user and check role
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (!userId) {
    redirect("/auth/login");
  }

  // Fetch user's profile to get role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const userRole = profile?.role?.toLowerCase() || "employee";

  // Only managers can access this page
  if (userRole !== "manager") {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-semibold mb-2">Access Denied</p>
          <p>Only managers can access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch logs with user profile data
  const { data: logs, error } = await supabase
    .from("logs")
    .select(
      `
      id,
      created_at,
      user_id,
      domain,
      ai_tool_name,
      ai_category,
      url,
      log_type,
      action,
      metadata,
      profiles:profiles(username)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error loading logs: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <OverviewClient logs={logs || []} />
    </div>
  );
}
