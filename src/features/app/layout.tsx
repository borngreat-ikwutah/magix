import {
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppLayout } from "~/components/app/app-layout";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

// Sample data for the dashboard
const stats = [
  {
    title: "Total Raised",
    value: "$124,563",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2 this month",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Total Backers",
    value: "1,247",
    change: "+89 this week",
    trend: "up",
    icon: Users,
  },
  {
    title: "Success Rate",
    value: "87%",
    change: "+5% from last month",
    trend: "up",
    icon: Target,
  },
];

const recentCampaigns = [
  {
    id: 1,
    title: "Revolutionary Solar Charger",
    status: "Active",
    raised: 45600,
    goal: 50000,
    backers: 234,
    daysLeft: 12,
  },
  {
    id: 2,
    title: "Smart Home Garden Kit",
    status: "Active",
    raised: 23400,
    goal: 30000,
    backers: 156,
    daysLeft: 8,
  },
  {
    id: 3,
    title: "Eco-Friendly Water Bottle",
    status: "Funded",
    raised: 78900,
    goal: 25000,
    backers: 543,
    daysLeft: 0,
  },
];

export function DashboardPage() {
  const breadcrumbs = [{ label: "Dashboard", current: true }];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your campaigns.
            </p>
          </div>
          <Button className="bg-yellow-55 text-black hover:bg-yellow-60 hover:text-black">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="bg-dark-10 border-grey-08 text-white"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-grey-70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-grey-60 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Campaigns */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2 bg-dark-10 border-grey-08 text-white">
            <CardHeader>
              <CardTitle className="text-white">Recent Campaigns</CardTitle>
              <CardDescription className="text-grey-70">
                Your latest crowdfunding campaigns and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-grey-08 rounded-lg bg-dark-25"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">
                          {campaign.title}
                        </h3>
                        <Badge
                          variant={
                            campaign.status === "Active"
                              ? "default"
                              : campaign.status === "Funded"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-grey-60">
                        <span>{campaign.backers} backers</span>
                        {campaign.daysLeft > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {campaign.daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">
                        ${campaign.raised.toLocaleString()} / $
                        {campaign.goal.toLocaleString()}
                      </div>
                      <Progress
                        value={(campaign.raised / campaign.goal) * 100}
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-dark-10 border-grey-08 text-white">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-grey-70">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start text-white hover:bg-dark-25"
                variant="ghost"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Campaign
              </Button>
              <Button
                className="w-full justify-start text-white hover:bg-dark-25"
                variant="ghost"
              >
                <Users className="mr-2 h-4 w-4" />
                View All Backers
              </Button>
              <Button
                className="w-full justify-start text-white hover:bg-dark-25"
                variant="ghost"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics Report
              </Button>
              <Button
                className="w-full justify-start text-white hover:bg-dark-25"
                variant="ghost"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Update
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
