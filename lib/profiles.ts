import { createClient } from "@/lib/supabase/client";

export async function fetchProfiles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, monitoring_level");
  if (error) throw new Error(error.message);
  return data;
}

export async function updateGlobalMonitoringLevel(level: "high" | "low") {
  const res = await fetch("/api/profiles", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ global: true, monitoring_level: level }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || "Failed to update global monitoring level");
  return data;
}

export async function updateProfileMonitoringLevel(
  id: string,
  level: "high" | "low",
) {
  const res = await fetch("/api/profiles", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, monitoring_level: level }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || "Failed to update profile monitoring level");
  return data;
}
