import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
} from "lucide-react"

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-grey-70">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-dark-10 border-grey-08 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-grey-70">
              Update your personal information and profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  className="bg-dark-25 border-grey-08 text-white placeholder:text-grey-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className="bg-dark-25 border-grey-08 text-white placeholder:text-grey-60"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-dark-25 border-grey-08 text-white placeholder:text-grey-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Input
                id="bio"
                placeholder="Tell us about yourself"
                className="bg-dark-25 border-grey-08 text-white placeholder:text-grey-60"
              />
            </div>
            <Button className="bg-yellow-55 text-black hover:bg-yellow-60 hover:text-black">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-dark-10 border-grey-08 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-grey-70">
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Campaign Updates</Label>
                <p className="text-sm text-grey-60">
                  Get notified about campaigns you've backed
                </p>
              </div>
              <Switch />
            </div>
            <Separator className="bg-grey-08" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Marketing Emails</Label>
                <p className="text-sm text-grey-60">
                  Receive promotional emails and newsletters
                </p>
              </div>
              <Switch />
            </div>
            <Separator className="bg-grey-08" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">New Campaign Alerts</Label>
                <p className="text-sm text-grey-60">
                  Be the first to know about new campaigns
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-dark-10 border-grey-08 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              Security
              <Badge variant="secondary" className="bg-yellow-55 text-black">
                Pro
              </Badge>
            </CardTitle>
            <CardDescription className="text-grey-70">
              Manage your account security and privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-grey-08 text-white hover:bg-dark-25 hover:text-white"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-grey-08 text-white hover:bg-dark-25 hover:text-white"
            >
              Enable Two-Factor Authentication
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-grey-08 text-white hover:bg-dark-25 hover:text-white"
            >
              Download Account Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/app/settings/")({
  component: SettingsPage,
})
