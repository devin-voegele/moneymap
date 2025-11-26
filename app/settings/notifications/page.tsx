'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Bell, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NotificationSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyEmailEnabled: true,
    goalEmailsEnabled: true,
    subscriptionReminders: true,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setSettings({
          emailNotifications: data.emailNotifications ?? true,
          weeklyEmailEnabled: data.weeklyEmailEnabled ?? true,
          goalEmailsEnabled: data.goalEmailsEnabled ?? true,
          subscriptionReminders: data.subscriptionReminders ?? true,
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success('Settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="profile">
              <Link href="/settings/profile">Profile</Link>
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Link href="/settings/billing">Billing</Link>
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Email Notifications */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-white">Email Notifications</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Manage how you receive email updates from MoneyMap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Master Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications" className="text-white font-medium">
                      Enable Email Notifications
                    </Label>
                    <p className="text-sm text-slate-400">
                      Receive all email notifications from MoneyMap
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle('emailNotifications')}
                  />
                </div>

                {/* Weekly Summary */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyEmailEnabled" className="text-white font-medium">
                      Weekly Summary
                    </Label>
                    <p className="text-sm text-slate-400">
                      Get a weekly email with your financial overview
                    </p>
                  </div>
                  <Switch
                    id="weeklyEmailEnabled"
                    checked={settings.weeklyEmailEnabled}
                    onCheckedChange={() => handleToggle('weeklyEmailEnabled')}
                    disabled={!settings.emailNotifications}
                  />
                </div>

                {/* Goal Milestones */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="goalEmailsEnabled" className="text-white font-medium">
                      Goal Milestones
                    </Label>
                    <p className="text-sm text-slate-400">
                      Get notified when you reach 50%, 75%, and 100% of your goals
                    </p>
                  </div>
                  <Switch
                    id="goalEmailsEnabled"
                    checked={settings.goalEmailsEnabled}
                    onCheckedChange={() => handleToggle('goalEmailsEnabled')}
                    disabled={!settings.emailNotifications}
                  />
                </div>

                {/* Subscription Reminders */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="subscriptionReminders" className="text-white font-medium">
                      Subscription Reminders
                    </Label>
                    <p className="text-sm text-slate-400">
                      Get reminded 3 days before subscription renewals
                    </p>
                  </div>
                  <Switch
                    id="subscriptionReminders"
                    checked={settings.subscriptionReminders}
                    onCheckedChange={() => handleToggle('subscriptionReminders')}
                    disabled={!settings.emailNotifications}
                  />
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Bell className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium mb-1">
                      Stay on top of your finances
                    </p>
                    <p className="text-sm text-slate-300">
                      Email notifications help you track your progress, never miss a payment, 
                      and celebrate your achievements. You can customize or disable them anytime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
