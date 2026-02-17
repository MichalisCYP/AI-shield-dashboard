import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from("logs")
    .select(
      `id, created_at, user_id, domain, ai_tool_name, ai_category, url, log_type, action, profiles:profiles(username)`,
    )
    .order("created_at", { ascending: false });

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
        <div className="overflow-x-auto">
          {Object.keys(groupedLogs).length > 0 ? (
            Object.entries(groupedLogs).map(([username, userLogs]) => (
              <div key={username} className="mb-8">
                <div className="font-semibold text-lg mb-2">
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
