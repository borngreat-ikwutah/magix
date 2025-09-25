import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  ArrowUpRight,
  Clock,
  Star,
  Share2,
} from "lucide-react";

// Sample featured campaigns data
const featuredCampaigns = [
  {
    id: 1,
    title: "Revolutionary Solar Charger",
    description:
      "A portable solar charger that can power any device, anywhere.",
    image: "/placeholder-campaign.jpg",
    raised: 45600,
    goal: 50000,
    backers: 234,
    daysLeft: 12,
    category: "Technology",
    creator: "Tech Innovations",
  },
  {
    id: 2,
    title: "Smart Home Garden Kit",
    description:
      "Grow fresh herbs and vegetables indoors with smart automation.",
    image: "/placeholder-campaign2.jpg",
    raised: 23400,
    goal: 30000,
    backers: 156,
    daysLeft: 8,
    category: "Home & Garden",
    creator: "Green Solutions",
  },
  {
    id: 3,
    title: "Eco-Friendly Water Bottle",
    description: "Made from recycled materials with temperature control.",
    image: "/placeholder-campaign3.jpg",
    raised: 78900,
    goal: 25000,
    backers: 543,
    daysLeft: 0,
    category: "Sustainability",
    creator: "EcoTech",
  },
];

export function AppHomePage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Magix</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing projects, back innovative ideas, and bring creative
          visions to life
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="bg-yellow-55 text-black hover:bg-yellow-60 hover:text-black"
          >
            <Plus className="mr-2 h-4 w-4" />
            Start a Campaign
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-grey-08 text-white hover:bg-dark-25 hover:text-white"
          >
            Browse Projects
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              +22% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Backers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Campaigns
            </h2>
            <p className="text-muted-foreground">
              Discover the most promising projects on our platform
            </p>
          </div>
          <Button
            variant="outline"
            className="border-grey-08 text-white hover:bg-dark-25 hover:text-white"
          >
            View All
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="overflow-hidden bg-dark-10 border-grey-08 text-white"
            >
              <div className="aspect-video bg-dark-25"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-dark-25 text-grey-70"
                  >
                    {campaign.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-grey-70 hover:text-white hover:bg-dark-25"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="line-clamp-2 text-white">
                  {campaign.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-grey-70">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${campaign.raised.toLocaleString()} raised</span>
                    <span>
                      {Math.round((campaign.raised / campaign.goal) * 100)}%
                    </span>
                  </div>
                  <Progress value={(campaign.raised / campaign.goal) * 100} />
                  <div className="flex justify-between text-xs text-grey-60">
                    <span>{campaign.backers} backers</span>
                    {campaign.daysLeft > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {campaign.daysLeft} days left
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600">
                        <Star className="h-3 w-3" />
                        Funded
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-grey-70">
                    by {campaign.creator}
                  </div>
                  <Button
                    size="sm"
                    className="bg-yellow-55 text-black hover:bg-yellow-60 hover:text-black"
                  >
                    Back Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
