import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchShops, fetchShopPerformance, addShop, deleteShop } from '@/lib/googleSheetsApi';
import { TimeFilter, DateRange, ShopInfo } from '@/types';
import ShopDetails from './shops/ShopDetails';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, EyeOff, Eye, Plus, Trash, ArrowLeft, Store, Globe, BarChart3, DollarSign, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ShopsManagement: React.FC = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [viewType, setViewType] = useState<'individual' | 'combined'>('individual');
  const [showNames, setShowNames] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('detailed');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<number | null>(null);
  
  const [newShop, setNewShop] = useState({
    name: '',
    platform: 'TikTok',
    region: 'US',
    profitSharePercentage: 20,
    sheetId: '',
    sheetName: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shops, isLoading: isLoadingShops } = useQuery({
    queryKey: ['/api/shops'],
    queryFn: fetchShops,
  });

  const { data: shopPerformance, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['/api/shops', selectedShopId, timeFilter, dateRange],
    queryFn: () => {
      if (selectedShopId) {
        return fetchShopPerformance(selectedShopId, timeFilter, dateRange);
      }
      return Promise.resolve(undefined);
    },
    enabled: !!selectedShopId,
  });

  const addShopMutation = useMutation({
    mutationFn: (shopData: Omit<ShopInfo, 'id'>) => addShop(shopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shops'] });
      toast({
        title: "Shop added",
        description: "The shop has been added successfully.",
      });
      setShowAddDialog(false);
      setNewShop({ 
        name: '', 
        platform: 'TikTok', 
        region: 'US', 
        profitSharePercentage: 20,
        sheetId: '',
        sheetName: ''
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not add shop. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteShopMutation = useMutation({
    mutationFn: (shopId: number) => deleteShop(shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shops'] });
      toast({
        title: "Shop removed",
        description: "The shop has been removed successfully.",
      });
      setShowDeleteDialog(false);
      setShopToDelete(null);
      if (selectedShopId === shopToDelete) {
        setSelectedShopId(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not delete shop. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleShopSelect = (shopId: number) => {
    setSelectedShopId(shopId);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
      setTimeFilter('custom');
    }
  };

  const handleAddShop = () => {
    if (!newShop.name) {
      toast({
        title: "Missing information",
        description: "Please provide a shop name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newShop.sheetId) {
      toast({
        title: "Missing information",
        description: "Please provide a Sheet ID.",
        variant: "destructive",
      });
      return;
    }

    if (!newShop.sheetName) {
      toast({
        title: "Missing information",
        description: "Please provide a Sheet Name.",
        variant: "destructive",
      });
      return;
    }
    
    addShopMutation.mutate({
      name: newShop.name,
      platform: newShop.platform,
      region: newShop.region,
      profitSharePercentage: String(newShop.profitSharePercentage), // Convert to string for the server
      sheetId: newShop.sheetId,
      sheetName: newShop.sheetName
    });
  };

  const handleDeleteShop = () => {
    if (shopToDelete !== null) {
      deleteShopMutation.mutate(shopToDelete);
    }
  };

  const formatDateRangeDisplay = () => {
    if (!dateRange.from || !dateRange.to) return 'Select dates';
    return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Shops Management</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowNames(!showNames)} 
            className="flex items-center text-primary text-sm"
          >
            {showNames ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            <span>{showNames ? 'Hide Names' : 'Show Names'}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center text-gray-600 text-sm"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Overview</span>
          </Button>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Shop</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shop</DialogTitle>
                <DialogDescription>
                  Enter the details for the new e-commerce shop.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Shop Name
                  </Label>
                  <Input 
                    id="name" 
                    value={newShop.name}
                    onChange={(e) => setNewShop({...newShop, name: e.target.value})}
                    className="col-span-3" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Platform
                  </Label>
                  <Select 
                    value={newShop.platform} 
                    onValueChange={(value) => setNewShop({...newShop, platform: value})}
                  >
                    <SelectTrigger id="platform" className="col-span-3">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TikTok">TikTok Shop</SelectItem>
                      <SelectItem value="Etsy">Etsy</SelectItem>
                      <SelectItem value="eBay">eBay</SelectItem>
                      <SelectItem value="Walmart">Walmart</SelectItem>
                      <SelectItem value="Amazon">Amazon</SelectItem>
                      <SelectItem value="OnBuy">OnBuy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">
                    Region
                  </Label>
                  <Select 
                    value={newShop.region} 
                    onValueChange={(value) => setNewShop({...newShop, region: value})}
                  >
                    <SelectTrigger id="region" className="col-span-3">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">Europe</SelectItem>
                      <SelectItem value="APAC">Asia-Pacific</SelectItem>
                      <SelectItem value="MENA">Middle East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profit-share" className="text-right">
                    Profit Share %
                  </Label>
                  <Input 
                    id="profit-share" 
                    type="number"
                    value={newShop.profitSharePercentage}
                    onChange={(e) => setNewShop({...newShop, profitSharePercentage: parseInt(e.target.value) || 0})}
                    min="0"
                    max="100"
                    className="col-span-3" 
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sheet-id" className="text-right">
                    Sheet ID
                  </Label>
                  <Input 
                    id="sheet-id" 
                    value={newShop.sheetId}
                    onChange={(e) => setNewShop({...newShop, sheetId: e.target.value})}
                    className="col-span-3" 
                    placeholder="Google Sheet ID from URL"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sheet-name" className="text-right">
                    Sheet Name
                  </Label>
                  <Input 
                    id="sheet-name" 
                    value={newShop.sheetName}
                    onChange={(e) => setNewShop({...newShop, sheetName: e.target.value})}
                    className="col-span-3" 
                    placeholder="Tab name within the sheet"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary" onClick={handleAddShop} disabled={addShopMutation.isPending}>
                  {addShopMutation.isPending ? 'Adding...' : 'Add Shop'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Shop Tabs */}
      <div className="flex mb-4 overflow-x-auto scrollbar-hidden">
        {isLoadingShops ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 mr-2 rounded-lg" />
          ))
        ) : shops?.length === 0 ? (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg w-full">
            <p className="text-gray-500">No shops added yet. Add your first shop to get started.</p>
          </div>
        ) : (
          shops?.map((shop: ShopInfo) => (
            <div key={shop.id} className="relative group">
              <Button
                className={cn(
                  "px-6 py-2 rounded-lg mr-2",
                  selectedShopId === shop.id 
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => handleShopSelect(shop.id)}
              >
                {showNames ? shop.name : `Shop ${shop.id}`}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute h-6 w-6 -top-2 -right-1 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setShopToDelete(shop.id);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Filter Options */}
      <div className="flex justify-end mb-6">
        {/* Date Range Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-blue-50 border border-blue-100 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center mr-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{formatDateRangeDisplay()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{
                from: dateRange.from || undefined,
                to: dateRange.to || undefined
              }}
              onSelect={handleDateRangeChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* View Type Selector */}
        <Button
          variant="outline"
          className={cn(
            "px-3 py-1 rounded-lg mr-2 text-sm flex items-center",
            viewType === 'individual' 
              ? "bg-blue-50 border border-blue-100 text-primary" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={() => setViewType('individual')}
        >
          <Store className="h-4 w-4 mr-1" />
          <span>Individual</span>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "px-3 py-1 rounded-lg text-sm flex items-center",
            viewType === 'combined'
              ? "bg-blue-50 border border-blue-100 text-primary"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={() => setViewType('combined')}
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          <span>Combined</span>
        </Button>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'overview' | 'detailed')} className="w-full mb-6">
        <TabsList className="border-b border-gray-200 w-full justify-start bg-transparent mb-6">
          <TabsTrigger 
            value="overview" 
            className={cn(
              "pb-2 mr-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent rounded-none",
            )}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="detailed" 
            className={cn(
              "pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent rounded-none",
            )}
          >
            Detailed Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-white rounded-lg p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Shops Overview</h3>
              {isLoadingShops ? (
                <Skeleton className="h-64 w-full" />
              ) : shops?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <Store className="h-12 w-12 text-gray-400 mb-2" />
                  <h4 className="text-lg font-medium text-gray-700">No shops yet</h4>
                  <p className="text-gray-500 text-center mt-1 mb-4">Add your first shop to start tracking analytics</p>
                  <Button className="bg-primary" onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Shop
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shops?.map((shop: ShopInfo) => (
                    <Card key={shop.id} className="bg-gray-50 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {showNames ? shop.name : `Shop ${shop.id}`}
                            </h4>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <Globe className="h-3 w-3 mr-1" />
                              <span>{shop.platform} • {shop.region}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 h-8 w-8"
                            onClick={() => {
                              setShopToDelete(shop.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600 text-sm">Profit Share:</span>
                            <span className="font-medium">{shop.profitSharePercentage}%</span>
                          </div>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 text-primary border-primary border-dashed"
                            onClick={() => {
                              setSelectedShopId(shop.id);
                              setActiveTab('detailed');
                            }}
                          >
                            View Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          {viewType === 'combined' ? (
            <Card className="bg-white rounded-lg shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Combined Store Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Revenue Card */}
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1 opacity-80">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Total Revenue</span>
                          </div>
                          <div className="text-2xl font-bold mb-2">
                            {formatCurrency(shops?.reduce((acc, shop) => acc + (shop?.revenue || 0), 0) || 0)}
                          </div>
                          <div className="flex items-center text-xs">
                            <span>Across {shops?.length || 0} stores</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Orders Card */}
                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1 opacity-80">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Total Orders</span>
                          </div>
                          <div className="text-2xl font-bold mb-2">
                            {formatNumber(shops?.reduce((acc, shop) => acc + (shop?.orders || 0), 0) || 0)}
                          </div>
                          <div className="flex items-center text-xs">
                            <span>Across {shops?.length || 0} stores</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Other metrics would go here */}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-3">Store Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase">
                          <th scope="col" className="px-4 py-3 text-left">Store</th>
                          <th scope="col" className="px-4 py-3 text-right">Revenue</th>
                          <th scope="col" className="px-4 py-3 text-right">Orders</th>
                          <th scope="col" className="px-4 py-3 text-right">ROI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {shops?.map((shop) => (
                          <tr key={shop.id} className="text-gray-800">
                            <td className="px-4 py-4 whitespace-nowrap font-medium">
                              {showNames ? shop.name : `Shop ${shop.id}`}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              {formatCurrency(shop?.revenue || 0)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              {shop?.orders || 0}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              {formatPercentage(shop?.roi || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedShopId && shopPerformance ? (
            <ShopDetails shop={shopPerformance} />
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-600">Select a shop to view detailed analytics</h3>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Shop Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Shop</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this shop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteShop}
              disabled={deleteShopMutation.isPending}
            >
              {deleteShopMutation.isPending ? 'Removing...' : 'Remove Shop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopsManagement;
