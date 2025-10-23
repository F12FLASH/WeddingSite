import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Plus, Trash2, Pencil, ExternalLink, Search, Filter, DollarSign, Package, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { RegistryItem, InsertRegistryItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AdminRegistry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const { data: items = [], isLoading } = useQuery<RegistryItem[]>({
    queryKey: ["/api/registry"],
  });

  // Filter items based on search and price
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "under50" && item.price < 50) ||
                        (priceFilter === "50-100" && item.price >= 50 && item.price <= 100) ||
                        (priceFilter === "over100" && item.price > 100);
    return matchesSearch && matchesPrice;
  });

  const stats = {
    total: items.length,
    totalValue: items.reduce((sum, item) => sum + (item.price || 0), 0),
    purchased: items.filter(item => item.isPurchased).length,
    averagePrice: items.length > 0 ? Math.round(items.reduce((sum, item) => sum + (item.price || 0), 0) / items.length) : 0,
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertRegistryItem) => {
      return await apiRequest("POST", "/api/registry", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      toast({ 
        title: "✅ Thêm món quà thành công",
        description: "Món quà đã được thêm vào danh sách"
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể thêm món quà",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertRegistryItem> }) => {
      return await apiRequest("PATCH", `/api/registry/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      toast({ 
        title: "✅ Cập nhật món quà thành công",
        description: "Thông tin món quà đã được cập nhật"
      });
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật món quà",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/registry/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      toast({ 
        title: "🗑️ Xóa món quà thành công",
        description: "Món quà đã được xóa khỏi danh sách"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa món quà",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertRegistryItem = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string) || 0,
      imageUrl: formData.get("imageUrl") as string,
      purchaseUrl: formData.get("purchaseUrl") as string,
      order: parseInt(formData.get("order") as string) || 0,
      isPurchased: formData.get("isPurchased") === "on",
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-serif mb-2 text-foreground">🎁 Danh Sách Quà Tặng</h2>
            <p className="text-muted-foreground text-lg">Quản lý danh sách mong muốn quà cưới của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingItem(null)}
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} className="mr-2" />
                Thêm Món Quà
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingItem ? "✏️ Chỉnh Sửa Món Quà" : "🎁 Thêm Món Quà Mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Tên Món Quà *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Máy pha cà phê"
                      defaultValue={editingItem?.name}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">Giá ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="50"
                      defaultValue={editingItem?.price || ""}
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Mô Tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Mô tả món quà và lý do bạn muốn có nó..."
                    defaultValue={editingItem?.description || ""}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-medium">URL Hình Ảnh</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={editingItem?.imageUrl || ""}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-sm font-medium">Thứ Tự Hiển Thị</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      defaultValue={editingItem?.order || 0}
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchaseUrl" className="text-sm font-medium">Liên Kết Mua Hàng</Label>
                  <Input
                    id="purchaseUrl"
                    name="purchaseUrl"
                    type="url"
                    placeholder="https://store.com/product"
                    defaultValue={editingItem?.purchaseUrl || ""}
                    className="h-12"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPurchased"
                    name="isPurchased"
                    defaultChecked={editingItem?.isPurchased || false}
                  />
                  <Label htmlFor="isPurchased" className="text-sm font-medium">
                    Đã được mua
                  </Label>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-lg"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-lg shadow-lg"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingItem ? "💾 Cập Nhật" : "📤 Thêm"} Món Quà
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={itemVariants}>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Tổng số quà</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">${stats.totalValue}</p>
              <p className="text-sm text-muted-foreground">Tổng giá trị</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-500">{stats.purchased}</p>
              <p className="text-sm text-muted-foreground">Đã mua</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">${stats.averagePrice}</p>
              <p className="text-sm text-muted-foreground">Giá trung bình</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" variants={itemVariants}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="🔍 Tìm kiếm quà theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Tất cả giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">💰 Tất cả</SelectItem>
                <SelectItem value="under50">💵 Dưới $50</SelectItem>
                <SelectItem value="50-100">💎 $50 - $100</SelectItem>
                <SelectItem value="over100">💎💎 Trên $100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </motion.div>

      {/* Items Grid */}
      {isLoading ? (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="animate-pulse overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-10 bg-muted rounded-xl" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredItems.length === 0 ? (
              <motion.div
                className="col-span-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-dashed">
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <Gift size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Không tìm thấy món quà nào</p>
                    <p>Thử thay đổi bộ lọc hoặc thêm món quà mới</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit="hidden"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm group">
                    {/* Item Image */}
                    {item.imageUrl && (
                      <div className="relative aspect-square overflow-hidden">
                        <motion.img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Overlay Actions */}
                        <motion.div
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full shadow-lg"
                            onClick={() => {
                              setEditingItem(item);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full shadow-lg bg-destructive/20 hover:bg-destructive/30"
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa "${item.name}"?`)) {
                                deleteMutation.mutate(item.id);
                              }
                            }}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </motion.div>

                        {/* Purchased Badge */}
                        {item.isPurchased && (
                          <Badge 
                            className="absolute top-2 left-2 bg-green-500 text-white border-0 shadow-lg"
                          >
                            <Package size={12} className="mr-1" />
                            Đã mua
                          </Badge>
                        )}

                        {/* Price Badge */}
                        {item.price && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 bg-black/50 text-white border-0 backdrop-blur-sm"
                          >
                            <DollarSign size={12} className="mr-1" />
                            {item.price}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {/* Action buttons will appear on hover */}
                        </div>
                      </div>
                      
                      {item.description && (
                        <motion.p 
                          className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {item.description}
                        </motion.p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        {item.purchaseUrl ? (
                          <a
                            href={item.purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                          >
                            <ExternalLink size={14} />
                            Mua ngay
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">Không có liên kết</span>
                        )}
                        
                        <Badge variant="outline" className="text-xs">
                          Thứ tự: {item.order}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}