import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchShops, updateShopProfitShare } from '@/lib/googleSheetsApi';
import { ShopInfo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const ProfitShareSettings: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingShopId, setEditingShopId] = useState<number | null>(null);
  const [profitShareValue, setProfitShareValue] = useState<number>(50);

  const { data: shops, isLoading } = useQuery({
    queryKey: ['/api/shops'],
    queryFn: fetchShops,
  });

  const updateProfitShareMutation = useMutation({
    mutationFn: ({ shopId, profitSharePercentage }: { shopId: number, profitSharePercentage: number }) => 
      updateShopProfitShare(shopId, profitSharePercentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shops'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agency-profit'] });
      toast({
        title: "Profit share updated",
        description: "The profit share percentage has been updated successfully.",
      });
      setEditingShopId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profit share percentage. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (shop: ShopInfo) => {
    setEditingShopId(shop.id);
    setProfitShareValue(shop.profitSharePercentage);
  };

  const handleSave = (shopId: number) => {
    updateProfitShareMutation.mutate({
      shopId,
      profitSharePercentage: profitShareValue,
    });
  };

  const handleCancel = () => {
    setEditingShopId(null);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading profit share settings...</div>;
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Profit Share Settings</h3>
        <p className="text-gray-600 mb-6">
          Set the percentage of profit that will be shared with the agency for each shop.
        </p>

        <div className="space-y-4">
          {shops?.map((shop: ShopInfo) => (
            <Card key={shop.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">{shop.name}</h4>
                    <p className="text-gray-500 text-sm">{shop.platform} • {shop.region}</p>
                  </div>
                  
                  {editingShopId === shop.id ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleSave(shop.id)}
                        disabled={updateProfitShareMutation.isPending}
                      >
                        {updateProfitShareMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(shop)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
                
                {editingShopId === shop.id ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor={`profit-share-${shop.id}`}>
                        Profit Share: {profitShareValue}%
                      </Label>
                      <Slider 
                        id={`profit-share-${shop.id}`}
                        min={0} 
                        max={100} 
                        step={1}
                        value={[profitShareValue]} 
                        onValueChange={(value) => setProfitShareValue(value[0])}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`profit-share-input-${shop.id}`}>
                        Or enter exact value:
                      </Label>
                      <Input 
                        id={`profit-share-input-${shop.id}`}
                        type="number" 
                        min={0} 
                        max={100}
                        value={profitShareValue}
                        onChange={(e) => setProfitShareValue(Number(e.target.value))}
                        className="mt-1 w-24"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-gray-700">
                      Current profit share: <span className="font-semibold">{shop.profitSharePercentage}%</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitShareSettings;
