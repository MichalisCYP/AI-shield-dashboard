"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Log {
  id: number;
  created_at: string;
  user_id: string | null;
  domain: string | null;
  ai_tool_name: string | null;
  ai_category: string | null;
  url: string | null;
  log_type: string | null;
  action: string | null;
  metadata: any;
  profiles: { username: string }[] | { username: string } | null;
}

interface OverviewClientProps {
  logs: Log[];
}

type TimeFilter = "today" | "week" | "month" | "all";

export function OverviewClient({ logs }: OverviewClientProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const filterByTime = (logs: Log[]) => {
    const now = new Date();

    return logs.filter((log) => {
      const logDate = new Date(log.created_at);
      if (timeFilter === "today") {
        return logDate.toDateString() === now.toDateString();
      } else if (timeFilter === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logDate >= weekAgo;
      } else if (timeFilter === "month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return logDate >= monthAgo;
      }
      return true; // all
    });
  };

  const filtered = filterByTime(logs);

  // Calculate stats
  const visits = filtered.filter((l) => l.log_type === "ai_domain_visit");
  const warnings = filtered.filter(
    (l) => l.metadata?.popupTriggered === true || l.log_type === "warning",
  );
  const redirects = filtered.filter(
    (l) => l.log_type === "user_redirected" || l.action === "redirected",
  );
  const pastes = filtered.filter(
    (l) => l.log_type === "paste_detected" || l.action === "paste",
  );
  const continued = filtered.filter(
    (l) =>
      l.log_type === "user_continued_unapproved" || l.action === "continued",
  );
  const sensitiveAlerts = filtered.filter(
    (l) => l.log_type === "sensitive_data_detected",
  );

  // Compliance rate
  const totalDecisions = redirects.length + continued.length;
  const complianceRate =
    totalDecisions > 0
      ? Math.round((redirects.length / totalDecisions) * 100)
      : 100;

  // Top tools
  const toolCounts: { [key: string]: number } = {};
  visits.forEach((log) => {
    const name = log.ai_tool_name || log.domain || "Unknown";
    toolCounts[name] = (toolCounts[name] || 0) + 1;
  });
  const topTools = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxToolCount = topTools.length > 0 ? topTools[0][1] : 1;

  // Categories
  const categoryCounts: { [key: string]: number } = {};
  visits.forEach((log) => {
    const cat = log.ai_category || "Unknown";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const totalCategories = categories.reduce((sum, [, c]) => sum + c, 0) || 1;

  // Recent activity
  const recentActivity = [...filtered].slice(-10).reverse();

  const formatTime = (timestamp: string) => {
    const d = new Date(timestamp);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const typeLabels: { [key: string]: string } = {
    ai_domain_visit: "🌐 Domain Visit",
    paste_detected: "📋 Paste Detected",
    user_redirected: "🔀 Redirected",
    user_continued_unapproved: "🚫 Continued Unapproved",
    ai_input_interaction: "🎯 Input Interaction",
    sensitive_data_detected: "🚨 Sensitive Data",
  };

  const typeBadgeColors: { [key: string]: string } = {
    ai_domain_visit: "bg-blue-500",
    paste_detected: "bg-orange-500",
    user_redirected: "bg-green-500",
    user_continued_unapproved: "bg-red-500",
    ai_input_interaction: "bg-purple-500",
    sensitive_data_detected: "bg-red-700",
  };

  const categoryColors = [
    "bg-blue-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-yellow-500",
    "bg-gray-500",
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Shield Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and analyze AI usage across your organization
          </p>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🌐</div>
              <div>
                <div className="text-3xl font-bold">{visits.length}</div>
                <div className="text-sm text-muted-foreground">
                  AI Domain Visits
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <div className="text-3xl font-bold">{warnings.length}</div>
                <div className="text-sm text-muted-foreground">
                  Warnings Shown
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🔀</div>
              <div>
                <div className="text-3xl font-bold">{redirects.length}</div>
                <div className="text-sm text-muted-foreground">
                  Users Redirected
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📋</div>
              <div>
                <div className="text-3xl font-bold">{pastes.length}</div>
                <div className="text-sm text-muted-foreground">
                  Paste Events
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🚫</div>
              <div>
                <div className="text-3xl font-bold">{continued.length}</div>
                <div className="text-sm text-muted-foreground">
                  Continued Anyway
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🎯</div>
              <div>
                <div className="text-3xl font-bold">{complianceRate}%</div>
                <div className="text-sm text-muted-foreground">
                  Compliance Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🚨</div>
              <div>
                <div className="text-3xl font-bold">
                  {sensitiveAlerts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Sensitive Data Alerts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📊</div>
              <div>
                <div className="text-3xl font-bold">{filtered.length}</div>
                <div className="text-sm text-muted-foreground">
                  Total Events
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top AI Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Top AI Tools Accessed</CardTitle>
          </CardHeader>
          <CardContent>
            {topTools.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topTools.map(([name, count]) => (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(count / maxToolCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Activity by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No data yet
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map(([name, count], i) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${categoryColors[i % categoryColors.length]}`}
                      />
                      <span className="font-medium">{name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {count} ({Math.round((count / totalCategories) * 100)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">
                      {log.log_type === "ai_domain_visit"
                        ? "🌐"
                        : log.log_type === "paste_detected"
                          ? "📋"
                          : log.log_type === "user_redirected"
                            ? "🔀"
                            : log.log_type === "sensitive_data_detected"
                              ? "🚨"
                              : "📊"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.log_type === "sensitive_data_detected"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {typeLabels[log.log_type || ""] || log.log_type}
                        </Badge>
                        <span className="font-medium">
                          {log.ai_tool_name || log.domain || "Unknown"}
                        </span>
                      </div>
                      {log.domain && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {log.domain}
                        </div>
                      )}
                      {log.profiles && (
                        <div className="text-xs text-muted-foreground mt-1">
                          User:{" "}
                          {Array.isArray(log.profiles)
                            ? log.profiles[0]?.username
                            : log.profiles?.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(log.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
