import { createClient } from "@/lib/supabase/server";
import { OverviewClient } from "@/components/dashboard/overview-client";

export default async function Overview() {
  const supabase = await createClient();

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
