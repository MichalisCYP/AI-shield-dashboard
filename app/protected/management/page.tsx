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

  // Monitoring level state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [monitoringError, setMonitoringError] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
    fetchProfilesData();
  }, []);

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

  return (
    <div className="flex flex-col gap-8">
      {/* Monitoring Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring</CardTitle>
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
      {/* Domains Card */}
      <Card>
        <CardHeader>
          <CardTitle>Domains</CardTitle>
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
                ) : domains.length > 0 ? (
                  domains.map((d) => (
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
