import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/store/useStore'
import { Save, Key, Globe, Bell, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const { settings, updateSettings } = useStore()

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your bot settings and preferences
        </p>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Configuration</CardTitle>
          </div>
          <CardDescription>Configure external API services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">DeepSeek API Key</label>
            <Input type="password" placeholder="sk-..." />
            <p className="text-xs text-muted-foreground">
              Used for AI-powered profile generation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Proxy Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Proxy Settings</CardTitle>
          </div>
          <CardDescription>Configure proxy for account creation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Proxy URL</label>
            <Input
              placeholder="http://proxy:port"
              value={settings.proxyUrl}
              onChange={(e) => updateSettings({ proxyUrl: e.target.value })}
            />
          </div>
          <Button variant="outline">Test Proxy Connection</Button>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <CardTitle>Automation Settings</CardTitle>
          </div>
          <CardDescription>Configure automation behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">AI Profile Generation</p>
              <p className="text-sm text-muted-foreground">
                Use AI to generate realistic profiles
              </p>
            </div>
            <Badge variant={settings.useAiProfile ? 'success' : 'secondary'}>
              {settings.useAiProfile ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Auto Refresh</p>
              <p className="text-sm text-muted-foreground">
                Automatically refresh data
              </p>
            </div>
            <Badge variant={settings.autoRefresh ? 'success' : 'secondary'}>
              {settings.autoRefresh ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Desktop Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when accounts are created
              </p>
            </div>
            <Badge variant={settings.notifications ? 'success' : 'secondary'}>
              {settings.notifications ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="w-full gradient-instagram" size="lg" onClick={handleSave}>
        <Save className="mr-2 h-4 w-4" />
        Save Settings
      </Button>
    </div>
  )
}

