import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenLine, Mail, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { connectGoogleSheets } from '@/lib/googleSheetsApi';
import { apiRequest } from '@/lib/queryClient';

const Settings: React.FC = () => {
  const [googleSheets, setGoogleSheets] = useState({
    apiKey: '',
    spreadsheetId: '',
    sheetName: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');
  const [connectionMessage, setConnectionMessage] = useState('');
  const { toast } = useToast();

  const handleConnect = async () => {
    // Validate inputs
    if (!googleSheets.apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please enter your Google API key",
        variant: "destructive",
      });
      return;
    }

    if (!googleSheets.spreadsheetId) {
      toast({
        title: "Missing Sheet ID",
        description: "Please enter your Google Sheet ID",
        variant: "destructive",
      });
      return;
    }

    if (!googleSheets.sheetName) {
      toast({
        title: "Missing Sheet Name",
        description: "Please enter the Sheet Name (tab name)",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('none');
    setConnectionMessage('');

    try {
      const result = await connectGoogleSheets({
        apiKey: googleSheets.apiKey,
        spreadsheetId: googleSheets.spreadsheetId,
        sheetName: googleSheets.sheetName
      });
      
      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage('Successfully connected to Google Sheets!');
        toast({
          title: "Connection Successful",
          description: "Your Google Sheets integration is now active.",
        });
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.message || 'Failed to connect to Google Sheets');
        toast({
          title: "Connection Failed",
          description: result.message || "Failed to connect to Google Sheets. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage('Failed to connect to Google Sheets');
      toast({
        title: "Connection Error",
        description: "Failed to connect to Google Sheets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      {/* Account Settings Header */}
      <Card className="bg-primary rounded-lg mb-6">
        <CardContent className="p-6">
          <h3 className="text-white text-xl font-semibold">Account Settings</h3>
          <p className="text-blue-200 text-sm">Manage your profile and preferences</p>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-0">
          <div className="border-b p-6 border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Profile Information</h3>
            <Button variant="outline" className="text-primary flex items-center gap-1">
              <PenLine className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Full Name */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-none mr-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="text-sm text-gray-500">Full Name</div>
                <div className="font-medium">Admin User</div>
              </div>
            </div>
            
            {/* Email Address */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-none mr-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="text-sm text-gray-500">Email Address</div>
                <div className="font-medium">admin@example.com</div>
              </div>
            </div>
            
            {/* Account Created */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-none mr-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="text-sm text-gray-500">Account Created</div>
                <div className="font-medium">February 27, 2025</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Google Sheets Integration */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-0">
          <div className="border-b p-6 border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Google Sheets Integration</h3>
            <p className="text-sm text-gray-500">Connect to your Google Sheets to import data</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sheet-id">Google Sheet ID</Label>
              <Input 
                id="sheet-id" 
                placeholder="Enter your Google Sheet ID" 
                value={googleSheets.spreadsheetId}
                onChange={(e) => setGoogleSheets({...googleSheets, spreadsheetId: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in your Google Sheet URL: https://docs.google.com/spreadsheets/d/[Sheet ID]/edit
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sheet-name">Sheet Name</Label>
              <Input 
                id="sheet-name" 
                placeholder="e.g. Sales Data" 
                value={googleSheets.sheetName}
                onChange={(e) => setGoogleSheets({...googleSheets, sheetName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key" 
                type="password" 
                placeholder="Your Google API Key" 
                value={googleSheets.apiKey}
                onChange={(e) => setGoogleSheets({...googleSheets, apiKey: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">
                You need a Google Sheets API key with access to the Google Sheets API
              </p>
            </div>
            
            {connectionStatus !== 'none' && (
              <div className={`p-4 rounded-lg ${connectionStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center">
                  {connectionStatus === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                  )}
                  <p>{connectionMessage}</p>
                </div>
              </div>
            )}
            
            <Button 
              className="bg-primary"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Google Sheet'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Preferences */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-0">
          <div className="border-b p-6 border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Manage how you receive notifications and updates</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium">Daily Sales Report</h4>
                <p className="text-sm text-gray-500">Receive a daily summary of your sales</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium">Weekly Performance Summary</h4>
                <p className="text-sm text-gray-500">Get insights on your weekly performance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h4 className="font-medium">Low Stock Alerts</h4>
                <p className="text-sm text-gray-500">Be notified when products are running low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <Button className="bg-primary mt-4">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
