"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Bell,
  Check,
  Globe,
  Languages,
  Lock,
  LogOut,
  Moon,
  Palette,
  Save,
  ShieldAlert,
  Sun,
  User,
  Wallet,
  Clock,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [isSaving, setIsSaving] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // Appearance
    theme: "system",
    colorScheme: "zinc",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    inventoryAlerts: true,

    // System
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })

  useEffect(() => {
    setIsMounted(true)
    if (theme) {
      setSettings((prev) => ({
        ...prev,
        theme: theme,
      }))
    }
  }, [theme])

  const handleSave = () => {
    setIsSaving(true)

    // Update theme if changed
    if (settings.theme !== theme) {
      setTheme(settings.theme)
    }

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    }, 1000)
  }

  const handleSwitchChange = (name) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSettingChange = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with settings categories */}
        <div className="w-full md:w-1/4">
          <Card className="sticky top-6">
            <CardContent className="p-4">
              <div className="space-y-1 py-2">
                <h3 className="text-sm font-medium text-muted-foreground">Settings</h3>
              </div>
              <Separator className="my-2" />
              <div className="space-y-1">
                {[
                  { name: "Appearance", icon: <Palette className="h-4 w-4 mr-2" />, value: "appearance" },
                  { name: "Notifications", icon: <Bell className="h-4 w-4 mr-2" />, value: "notifications" },
                  { name: "Language & Region", icon: <Globe className="h-4 w-4 mr-2" />, value: "system" },
                  { name: "Privacy & Security", icon: <ShieldAlert className="h-4 w-4 mr-2" />, value: "privacy" },
                  { name: "Account", icon: <User className="h-4 w-4 mr-2" />, value: "account" },
                ].map((item) => (
                  <Button
                    key={item.value}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => document.getElementById(item.value)?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <div className="space-y-10">
            <section id="appearance" className="space-y-6">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">Appearance</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>Customize how RoofStar POS looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme Mode</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          settings.theme === "light" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSettingChange("theme", "light")}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sun className="h-5 w-5 text-primary/60" />
                          </div>
                          <span className="font-medium">Light</span>
                          {settings.theme === "light" && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          settings.theme === "dark" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSettingChange("theme", "dark")}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Moon className="h-5 w-5 text-primary/60" />
                          </div>
                          <span className="font-medium">Dark</span>
                          {settings.theme === "dark" && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          settings.theme === "system" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSettingChange("theme", "system")}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <div className="relative">
                              <Sun className="h-5 w-5 text-primary/60" />
                              <Moon className="h-3 w-3 text-primary/60 absolute -bottom-1 -right-1" />
                            </div>
                          </div>
                          <span className="font-medium">System</span>
                          {settings.theme === "system" && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorScheme">Color Scheme</Label>
                    <Select
                      value={settings.colorScheme}
                      onValueChange={(value) => handleSettingChange("colorScheme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zinc">Default (Zinc)</SelectItem>
                        <SelectItem value="slate">Slate</SelectItem>
                        <SelectItem value="stone">Stone</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="notifications" className="space-y-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">Notifications</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={() => handleSwitchChange("emailNotifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={() => handleSwitchChange("pushNotifications")}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <Label className="text-base">Order Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                        </div>
                        <Switch
                          checked={settings.orderUpdates}
                          onCheckedChange={() => handleSwitchChange("orderUpdates")}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <Label className="text-base">Inventory Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about low stock items</p>
                        </div>
                        <Switch
                          checked={settings.inventoryAlerts}
                          onCheckedChange={() => handleSwitchChange("inventoryAlerts")}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="system" className="space-y-6">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">Language & Region</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>Customize language, currency, and formats</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="flex items-center gap-2">
                      <Languages className="h-4 w-4" /> Language
                    </Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" /> Currency
                    </Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date Format
                    </Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) => handleSettingChange("dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeFormat" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Time Format
                    </Label>
                    <Select
                      value={settings.timeFormat}
                      onValueChange={(value) => handleSettingChange("timeFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="privacy" className="space-y-6">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">Privacy & Security</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Collect Usage Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow RoofStar POS to collect anonymous usage data to improve the application
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Send Error Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically send error reports to help fix issues
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="text-destructive">
                      Delete All Personal Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage login and security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-Logout After Inactivity</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inactivity" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Inactivity Period
                    </Label>
                    <Select defaultValue="30min">
                      <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5min">5 minutes</SelectItem>
                        <SelectItem value="15min">15 minutes</SelectItem>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="60min">1 hour</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="account" className="space-y-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">Account</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <LogOut className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sign Out</h4>
                        <p className="text-sm text-muted-foreground">Sign out from all devices</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-destructive">
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="sticky bottom-0 bg-background pt-4 pb-6 mt-6 border-t">
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
