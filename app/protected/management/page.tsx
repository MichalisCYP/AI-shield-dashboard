"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonitoringLevelSlider } from "@/components/monitoring-level-slider";
import { MonitoringLevelCell } from "@/components/monitoring-level-cell";
import {
  fetchProfiles,
  updateGlobalMonitoringLevel,
  updateProfileMonitoringLevel,
} from "@/lib/profiles";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Domain {
  id: number;
  name: string | null;
  domain: string | null;
  category: string | null;
}

interface Profile {
  id: string;
  username: string | null;
  monitoring_level: "high" | "low";
}
export default function ManagementPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", domain: "", category: "" });
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [approving, setApproving] = useState<number | null>(null);
  const [approvingCategory, setApprovingCategory] = useState("");

  // Monitoring level state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [monitoringError, setMonitoringError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchDomains();
      fetchProfilesData();
    }
  }, [authorized]);

  async function checkAuthorization() {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;

    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const userRole = profile?.role?.toLowerCase() || "employee";

    if (userRole !== "manager") {
      setAccessDenied(true);
      setTimeout(() => {
        window.location.href = "/protected/logs";
      }, 2000);
      return;
    }

    setAuthorized(true);
  }

  async function fetchProfilesData() {
    setMonitoringLoading(true);
    setMonitoringError(null);
    try {
      const data = await fetchProfiles();
      setProfiles(data);
    } catch (e: any) {
      setMonitoringError(e.message || "Failed to load profiles");
    } finally {
      setMonitoringLoading(false);
    }
  }

  async function fetchDomains() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      if (res.ok) setDomains(data);
      else setError(data.error || "Failed to load domains");
    } catch (e: any) {
      setError(e.message || "Failed to load domains");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setDomains((prev) => [data, ...prev]);
        setForm({ name: "", domain: "", category: "" });
      } else setError(data.error || "Failed to add domain");
    } catch (e: any) {
      setError(e.message || "Failed to add domain");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: number) {
    setRemoving(id);
    setError(null);
    try {
      const res = await fetch("/api/domains", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setDomains((prev) => prev.filter((d) => d.id !== id));
      else setError(data.error || "Failed to remove domain");
    } catch (e: any) {
      setError(e.message || "Failed to remove domain");
    } finally {
      setRemoving(null);
    }
  }

  async function handleApprove(id: number, category: string) {
    if (!category.trim()) {
      setError("Category is required");
      return;
    }
    setApproving(id);
    setError(null);
    try {
      const res = await fetch("/api/domains", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, category }),
      });
      const data = await res.json();
      if (res.ok) {
        setDomains((prev) =>
          prev.map((d) => (d.id === id ? { ...d, category } : d)),
        );
        setApprovingCategory("");
      } else {
        setError(data.error || "Failed to approve domain");
      }
    } catch (e: any) {
      setError(e.message || "Failed to approve domain");
    } finally {
      setApproving(null);
    }
  }

  async function handleDeny(id: number) {
    await handleRemove(id);
  }

  // Show access denied message
  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-md">
          <p className="font-semibold text-lg mb-2">Access Denied</p>
          <p>Only managers can access this page. Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show loading while checking authorization
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Checking authorization...</div>
      </div>
    );
  }

  const pendingDomains = domains.filter((d) => d.category === "PENDING");
  const approvedDomains = domains.filter((d) => d.category !== "PENDING");

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Management Console</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure AI Shield settings, approve domains, and manage monitoring
          levels
        </p>
      </div>

      {/* Pending Domains Card */}
      {pendingDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Domain Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Domain</th>
                    <th className="px-4 py-2 text-left">Category Input</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDomains.map((d) => (
                    <tr key={d.id}>
                      <td className="border-t px-4 py-2">{d.id}</td>
                      <td className="border-t px-4 py-2">{d.name || "-"}</td>
                      <td className="border-t px-4 py-2">{d.domain || "-"}</td>
                      <td className="border-t px-4 py-2">
                        <Input
                          value={approving === d.id ? approvingCategory : ""}
                          onChange={(e) => {
                            setApproving(d.id);
                            setApprovingCategory(e.target.value);
                          }}
                          placeholder="e.g., AI Tool"
                          className="max-w-[200px]"
                        />
                      </td>
                      <td className="border-t px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            disabled={
                              approving === d.id && !approvingCategory.trim()
                            }
                            onClick={() =>
                              handleApprove(d.id, approvingCategory)
                            }
                          >
                            {approving === d.id ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={removing === d.id}
                            onClick={() => handleDeny(d.id)}
                          >
                            {removing === d.id ? "Denying..." : "Deny"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Monitoring Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Monitoring Levels</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure monitoring strictness for all users or individual
            profiles.
            <span className="font-semibold text-foreground">
              {" "}
              Strict mode
            </span>{" "}
            monitors typed content and prevents sensitive data entry.
          </p>
        </CardHeader>
        <CardContent>
          {monitoringError && (
            <div className="text-red-500 mb-4">{monitoringError}</div>
          )}
          <MonitoringLevelSlider
            value={profiles.length > 0 ? profiles[0].monitoring_level : "low"}
            loading={monitoringLoading}
            onChange={async (level) => {
              setMonitoringLoading(true);
              setMonitoringError(null);
              try {
                await updateGlobalMonitoringLevel(level);
                await fetchProfilesData();
              } catch (e: any) {
                setMonitoringError(
                  e.message || "Failed to update global monitoring level",
                );
              } finally {
                setMonitoringLoading(false);
              }
            }}
          />
          <div className="mb-8 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Profile ID</th>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Monitoring Level</th>
                </tr>
              </thead>
              <tbody>
                {monitoringLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : profiles.length > 0 ? (
                  profiles.map((p) => (
                    <tr key={p.id}>
                      <td className="border-t px-4 py-2">{p.id}</td>
                      <td className="border-t px-4 py-2">
                        {p.username || "-"}
                      </td>
                      <td className="border-t px-4 py-2">
                        <MonitoringLevelCell
                          value={p.monitoring_level}
                          loading={monitoringLoading}
                          onChange={async (level) => {
                            setMonitoringLoading(true);
                            setMonitoringError(null);
                            try {
                              await updateProfileMonitoringLevel(p.id, level);
                              await fetchProfilesData();
                            } catch (e: any) {
                              setMonitoringError(
                                e.message ||
                                  "Failed to update monitoring level",
                              );
                            } finally {
                              setMonitoringLoading(false);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Approved Domains Card */}
      <Card>
        <CardHeader>
          <CardTitle>Approved AI Domains</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the list of approved AI tools that users can access without
            warnings
          </p>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form
            className="flex flex-col md:flex-row gap-2 mb-6"
            onSubmit={handleAdd}
          >
            <div className="flex-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={form.domain}
                onChange={(e) =>
                  setForm((f) => ({ ...f, domain: e.target.value }))
                }
                placeholder="Domain"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="Category"
              />
            </div>
            <Button
              type="submit"
              disabled={adding}
              className="self-end min-w-[100px]"
            >
              {adding ? "Adding..." : "Add"}
            </Button>
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Domain</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : approvedDomains.length > 0 ? (
                  approvedDomains.map((d) => (
                    <tr key={d.id}>
                      <td className="border-t px-4 py-2">{d.id}</td>
                      <td className="border-t px-4 py-2">{d.name || "-"}</td>
                      <td className="border-t px-4 py-2">{d.domain || "-"}</td>
                      <td className="border-t px-4 py-2">
                        {d.category || "-"}
                      </td>
                      <td className="border-t px-4 py-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={removing === d.id}
                          onClick={() => handleRemove(d.id)}
                        >
                          {removing === d.id ? "Removing..." : "Remove"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No domains found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
