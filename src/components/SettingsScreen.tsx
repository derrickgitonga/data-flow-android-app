
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to the database
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated"
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* Account Section */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Username</p>
                <p className="text-sm text-muted-foreground">{user?.username}</p>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleLogout} 
              className="w-full"
            >
              Log Out
            </Button>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable push notifications</p>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={setNotifications} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select 
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <Button 
              onClick={handleSaveSettings} 
              className="w-full mt-4"
            >
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">ExpenseFlow v1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">© 2025 ExpenseFlow</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
