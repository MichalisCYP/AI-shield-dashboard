import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function LogsPage() {
  const supabase = await createClient();

  // Get current user
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

  // Build query based on role
  let logsQuery = supabase
    .from("logs")
    .select(
      `id, created_at, user_id, domain, ai_tool_name, ai_category, url, log_type, action, profiles:profiles(username)`,
    );

  // If employee, only show their own logs
  if (userRole === "employee") {
    logsQuery = logsQuery.eq("user_id", userId);
  }
  // If manager, show all logs (no filter needed)

  const { data: logs, error } = await logsQuery.order("created_at", {
    ascending: false,
  });

  // Group logs by username
  const groupedLogs: { [username: string]: any[] } = {};
  if (logs && logs.length > 0) {
    logs.forEach((log: any) => {
      const username = log.profiles?.username || "-";
      if (!groupedLogs[username]) groupedLogs[username] = [];
      groupedLogs[username].push(log);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 mb-4">
            Error loading logs: {error.message}
          </div>
        )}
        <div className="overflow-x-auto space-y-6">
          {Object.keys(groupedLogs).length > 0 ? (
            Object.entries(groupedLogs).map(([username, userLogs]) => (
              <div
                key={username}
                className="border-2 rounded-lg p-4 bg-muted/30"
              >
                <div className="font-bold text-xl mb-4 pb-2 border-b-2">
                  Username: {username}
                </div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                      <th className="px-4 py-2 text-left">User ID</th>
                      <th className="px-4 py-2 text-left">Domain</th>
                      <th className="px-4 py-2 text-left">AI Tool</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">URL</th>
                      <th className="px-4 py-2 text-left">Log Type</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLogs.map((log: any) => (
                      <tr key={log.id}>
                        <td className="border-t px-4 py-2">{log.id}</td>
                        <td className="border-t px-4 py-2">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="border-t px-4 py-2">
                          {log.user_id || "-"}
                        </td>
                        <td className="border-t px-4 py-2">
                          {log.domain || "-"}
                        </td>
                        <td className="border-t px-4 py-2">
                          {log.ai_tool_name || "-"}
                        </td>
                        <td className="border-t px-4 py-2">
                          {log.ai_category || "-"}
                        </td>
                        <td className="border-t px-4 py-2">{log.url || "-"}</td>
                        <td className="border-t px-4 py-2">
                          {log.log_type || "-"}
                        </td>
                        <td className="border-t px-4 py-2">
                          {log.action || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-center py-4">No logs found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
