"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import Link from "next/link";

const AdminPage = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalCommunities: 0, // TODO: replace with actual API call
    pendingCommunities: 8, // TODO: replace with actual API call
    totalEntities: 156, // TODO: replace with actual API call
    activeUsers: 1240, // TODO: replace with actual API call
    recentActivity: 12, // TODO: replace with actual API call
    approvalRate: 85, // TODO: replace with actual API call
  };

  const recentActivities: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin panel. Here&apos;s what&apos;s happening with
            your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-tertiary border-tertiary">
            <Activity className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Communities
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              *{stats.totalCommunities}*{" "}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              *{stats.pendingCommunities}*
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Entities
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> *{stats.totalEntities}* </div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              *{stats.activeUsers.toLocaleString()}*
            </div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/communities">
                <Clock className="mr-2 h-4 w-4" />
                Review Pending Communities (*{stats.pendingCommunities}*)
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/entities">
                <Users className="mr-2 h-4 w-4" />
                Manage Entities
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertCircle className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities?.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {activity.action.includes("approved") ||
                    activity.action.includes("verified") ? (
                      <CheckCircle className="h-4 w-4 text-tertiary" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.community || activity.entity}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Platform health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-tertiary rounded-full"></div>
              <span className="text-sm">API Status: Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-tertiary rounded-full"></div>
              <span className="text-sm">Database: Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-tertiary rounded-full"></div>
              <span className="text-sm">Storage: Normal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
