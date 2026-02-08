import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from './settingsStorage';
import { SETTINGS_BOUNDS } from './settingsTypes';
import { RotateCcw } from 'lucide-react';

export default function SettingsView() {
  const settings = useSettings();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Stabilization Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure connectivity check behavior and retry logic
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check Interval</CardTitle>
          <CardDescription>
            How often to perform connectivity checks (seconds)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="interval">Interval</Label>
              <Input
                id="interval"
                type="number"
                min={SETTINGS_BOUNDS.interval.min}
                max={SETTINGS_BOUNDS.interval.max}
                value={settings.interval}
                onChange={(e) => settings.updateSetting('interval', parseInt(e.target.value) || 30)}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground pt-6">
              {SETTINGS_BOUNDS.interval.min}s - {SETTINGS_BOUNDS.interval.max}s
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Timeout</CardTitle>
          <CardDescription>
            Maximum time to wait for a response (milliseconds)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="timeout">Timeout</Label>
              <Input
                id="timeout"
                type="number"
                min={SETTINGS_BOUNDS.timeout.min}
                max={SETTINGS_BOUNDS.timeout.max}
                step={100}
                value={settings.timeout}
                onChange={(e) => settings.updateSetting('timeout', parseInt(e.target.value) || 5000)}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground pt-6">
              {SETTINGS_BOUNDS.timeout.min}ms - {SETTINGS_BOUNDS.timeout.max}ms
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retry Configuration</CardTitle>
          <CardDescription>
            Exponential backoff settings for failed checks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="maxRetries">Max Retries</Label>
              <Input
                id="maxRetries"
                type="number"
                min={SETTINGS_BOUNDS.maxRetries.min}
                max={SETTINGS_BOUNDS.maxRetries.max}
                value={settings.maxRetries}
                onChange={(e) => settings.updateSetting('maxRetries', parseInt(e.target.value) || 3)}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground pt-6">
              {SETTINGS_BOUNDS.maxRetries.min} - {SETTINGS_BOUNDS.maxRetries.max}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="backoffBaseDelay">Base Delay (ms)</Label>
              <Input
                id="backoffBaseDelay"
                type="number"
                min={SETTINGS_BOUNDS.backoffBaseDelay.min}
                max={SETTINGS_BOUNDS.backoffBaseDelay.max}
                step={100}
                value={settings.backoffBaseDelay}
                onChange={(e) => settings.updateSetting('backoffBaseDelay', parseInt(e.target.value) || 1000)}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground pt-6">
              {SETTINGS_BOUNDS.backoffBaseDelay.min}ms - {SETTINGS_BOUNDS.backoffBaseDelay.max}ms
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="backoffMultiplier">Backoff Multiplier</Label>
              <Input
                id="backoffMultiplier"
                type="number"
                min={SETTINGS_BOUNDS.backoffMultiplier.min}
                max={SETTINGS_BOUNDS.backoffMultiplier.max}
                step={0.1}
                value={settings.backoffMultiplier}
                onChange={(e) => settings.updateSetting('backoffMultiplier', parseFloat(e.target.value) || 2)}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground pt-6">
              {SETTINGS_BOUNDS.backoffMultiplier.min}x - {SETTINGS_BOUNDS.backoffMultiplier.max}x
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={settings.resetSettings}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
