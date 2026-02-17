import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from("logs")
    .select("id, created_at, user_id")
    .order("created_at", { ascending: false });

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
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">User ID</th>
              </tr>
            </thead>
            <tbody>
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id}>
                    <td className="border-t px-4 py-2">{log.id}</td>
                    <td className="border-t px-4 py-2">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="border-t px-4 py-2">{log.user_id || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
