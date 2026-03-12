import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { useAllDeviceModels } from "@/hooks/useDevices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

const AdminInventory = () => {
  const { inventory, isLoading, addInventory, updateInventory, deleteInventory } = useInventory();
  const { data: devices } = useAllDeviceModels();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    skin_id: "",
    device_id: "",
    stock_quantity: 0,
    low_stock_threshold: 10,
  });

  const handleAdd = () => {
    addInventory.mutate(
      {
        skin_id: formData.skin_id,
        device_id: formData.device_id || null,
        stock_quantity: formData.stock_quantity,
        low_stock_threshold: formData.low_stock_threshold,
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          setFormData({
            skin_id: "",
            device_id: "",
            stock_quantity: 0,
            low_stock_threshold: 10,
          });
        },
      }
    );
  };

  const handleEdit = () => {
    if (!selectedItem) return;
    updateInventory.mutate(
      {
        id: selectedItem.id,
        stock_quantity: formData.stock_quantity,
        low_stock_threshold: formData.low_stock_threshold,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedItem(null);
        },
      }
    );
  };

  const openEditDialog = (item: any) => {
    setSelectedItem(item);
    setFormData({
      skin_id: item.skin_id,
      device_id: item.device_id || "",
      stock_quantity: item.stock_quantity,
      low_stock_threshold: item.low_stock_threshold,
    });
    setIsEditDialogOpen(true);
  };

  const getStockBadge = (quantity: number, threshold: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (quantity <= threshold) {
      return <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-transparent">Low Stock</Badge>;
    }
    return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">In Stock</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Package className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage stock levels for all skin-device combinations
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="skin_id">Skin ID</Label>
                <Input
                  id="skin_id"
                  value={formData.skin_id}
                  onChange={(e) =>
                    setFormData({ ...formData, skin_id: e.target.value })
                  }
                  placeholder="e.g., carbon-fiber-black"
                />
              </div>
              <div>
                <Label htmlFor="device_id">Device</Label>
                <Select
                  value={formData.device_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, device_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices?.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_quantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                <Input
                  id="low_stock_threshold"
                  type="number"
                  value={formData.low_stock_threshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      low_stock_threshold: parseInt(e.target.value) || 10,
                    })
                  }
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skin ID</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.skin_id}</TableCell>
                  <TableCell>{item.device_models?.name || "N/A"}</TableCell>
                  <TableCell>{item.stock_quantity}</TableCell>
                  <TableCell>{item.low_stock_threshold}</TableCell>
                  <TableCell>
                    {getStockBadge(item.stock_quantity, item.low_stock_threshold)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteInventory.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Skin ID</Label>
              <Input value={formData.skin_id} disabled />
            </div>
            <div>
              <Label htmlFor="edit_stock">Stock Quantity</Label>
              <Input
                id="edit_stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock_quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit_threshold">Low Stock Threshold</Label>
              <Input
                id="edit_threshold"
                type="number"
                value={formData.low_stock_threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    low_stock_threshold: parseInt(e.target.value) || 10,
                  })
                }
              />
            </div>
            <Button onClick={handleEdit} className="w-full">
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
