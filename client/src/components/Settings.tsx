import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings: React.FC = () => {
  return (
    <div>
      <Card className="bg-primary rounded-lg mb-6">
        <CardContent className="p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Account Settings</h3>
          <p className="text-blue-200 text-sm">Manage your profile and preferences</p>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-gray-100 border-b p-0 rounded-t-lg">
            <TabsTrigger value="profile" className="py-3 px-5 data-[state=active]:bg-white rounded-none">
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="google-sheets" className="py-3 px-5 data-[state=active]:bg-white rounded-none">
              Google Sheets Integration
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-3 px-5 data-[state=active]:bg-white rounded-none">
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" defaultValue="Admin User" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="admin@example.com" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="account-created">Account Created</Label>
                <p className="text-gray-500 mt-1">February 27, 2025</p>
              </div>
              
              <Button className="bg-primary">Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="google-sheets" className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sheet-id">Google Sheet ID</Label>
                <Input id="sheet-id" placeholder="Enter your Google Sheet ID" />
                <p className="text-xs text-gray-500 mt-1">
                  Found in your Google Sheet URL: https://docs.google.com/spreadsheets/d/[Sheet ID]/edit
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sheet-name">Sheet Name</Label>
                <Input id="sheet-name" placeholder="e.g. Sales Data" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Your Google API Key" />
              </div>
              
              <Button className="bg-primary">Connect Google Sheet</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h4 className="font-medium">Daily Sales Report</h4>
                  <p className="text-sm text-gray-500">Receive a daily summary of your sales</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h4 className="font-medium">Weekly Performance Summary</h4>
                  <p className="text-sm text-gray-500">Get insights on your weekly performance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h4 className="font-medium">Low Stock Alerts</h4>
                  <p className="text-sm text-gray-500">Be notified when products are running low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <Button className="bg-primary">Save Preferences</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
