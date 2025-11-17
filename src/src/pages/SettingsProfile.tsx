import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { useAuth } from '../features/auth/AuthContext';
export function SettingsProfile() {
  const {
    user
  } = useAuth();
  const [isRTL, setIsRTL] = useState(false);
  const [language, setLanguage] = useState('en');
  const handleRTLToggle = (checked: boolean) => {
    setIsRTL(checked);
    document.documentElement.dir = checked ? 'rtl' : 'ltr';
  };
  return <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <Input label="Name" defaultValue={user?.name} />
            <Input label="Email" type="email" defaultValue={user?.email} />
            <Button variant="primary">Save Changes</Button>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Language & Direction
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="en">English (en-US)</option>
                <option value="fa">فارسی (fa-IR)</option>
              </select>
            </div>
            <Switch checked={isRTL} onChange={handleRTLToggle} label="Enable RTL (Right-to-Left)" />
          </div>
        </Card>
      </div>
    </AppShell>;
}
