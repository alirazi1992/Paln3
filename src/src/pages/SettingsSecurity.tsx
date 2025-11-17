import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
export function SettingsSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  return <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>

        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Change Password
          </h2>
          <div className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button variant="primary">Update Password</Button>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Two-Factor Authentication
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account by enabling
              two-factor authentication.
            </p>
            <Switch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} label="Enable Two-Factor Authentication" />
            {twoFactorEnabled && <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-900">
                  Two-factor authentication is now enabled. You'll need to enter
                  a code from your authenticator app when signing in.
                </p>
              </div>}
          </div>
        </Card>
      </div>
    </AppShell>;
}
