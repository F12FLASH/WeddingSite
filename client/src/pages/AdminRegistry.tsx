import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Plus, Trash2, Pencil, ExternalLink, Search, Filter, DollarSign, Package, TrendingUp, Upload, CloudUpload, X } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

export default function AdminRegistry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: items = [], isLoading } = useQuery<RegistryItem[]>({
    queryKey: ["/api/registry"],
  });

  // Filter items based on search and price
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const price = item.price ?? 0;
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "under50" && price < 50) ||
                        (priceFilter === "50-100" && price >= 50 && price <= 100) ||
                        (priceFilter === "over100" && price > 100);
    return matchesSearch && matchesPrice;
  });

  const stats = {
    total: items.length,
    totalValue: items.reduce((sum, item) => sum + (item.price ?? 0), 0),
    purchased: items.filter(item => item.isPurchased).length,
    averagePrice: items.length > 0 ? Math.round(items.reduce((sum, item) => sum + (item.price ?? 0), 0) / items.length) : 0,
    completionRate: items.length > 0 ? Math.round((items.filter(item => item.isPurchased).length / items.length) * 100) : 0,
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
      setUploading(false);
      setUploadProgress(0);
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
      setUploading(false);
      setUploadProgress(0);
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file hình ảnh (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "❌ Lỗi",
        description: "Kích thước file không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await uploadImageToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      // Auto-fill the imageUrl field
      const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement;
      if (imageUrlInput) {
        imageUrlInput.value = imageUrl;
      }

      toast({
        title: "✅ Tải lên thành công!",
        description: "Ảnh đã được tải lên Cloudinary",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tải lên ảnh",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

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
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-sm font-medium">URL Hình Ảnh</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={editingItem?.imageUrl || ""}
                      className="h-12 flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="h-12 w-12"
                    >
                      {uploading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.div>
                      ) : (
                        <CloudUpload size={18} />
                      )}
                    </Button>
                  </div>
                  
                  {/* Upload Progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        Đang tải lên... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}

                  {/* Upload Instructions */}
                  <p className="text-xs text-muted-foreground">
                    Nhập URL hoặc tải lên từ thiết bị (JPEG, PNG, WebP, tối đa 10MB)
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
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
                    onClick={() => {
                      setIsDialogOpen(false);
                      setUploading(false);
                      setUploadProgress(0);
                    }}
                    className="rounded-lg"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-lg shadow-lg"
                    disabled={createMutation.isPending || updateMutation.isPending || uploading}
                  >
                    {editingItem ? "💾 Cập Nhật" : "📤 Thêm"} Món Quà
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6" variants={itemVariants}>
          <Card className="bg-blue-500/5 border-blue-500/20 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Tổng số quà</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">${stats.totalValue}</p>
              <p className="text-sm text-muted-foreground">Tổng giá trị</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/5 border-purple-500/20 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-500">{stats.purchased}</p>
              <p className="text-sm text-muted-foreground">Đã mua</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/5 border-orange-500/20 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">${stats.averagePrice}</p>
              <p className="text-sm text-muted-foreground">Giá trung bình</p>
            </CardContent>
          </Card>
          <Card className="bg-cyan-500/5 border-cyan-500/20 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-cyan-500">{stats.completionRate}%</p>
              <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
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
              className="pl-10 rounded-xl h-12"
            />
          </div>
          <div className="flex gap-2">
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-40 rounded-xl h-12">
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
              <Card className="animate-pulse overflow-hidden rounded-2xl">
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
                <Card className="border-dashed rounded-2xl">
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <Gift size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Không tìm thấy món quà nào</p>
                    <p>Thử thay đổi bộ lọc hoặc thêm món quà mới</p>
                    <Button 
                      className="mt-4 rounded-xl"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus size={18} className="mr-2" />
                      Thêm Món Quà Đầu Tiên
                    </Button>
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
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm group rounded-2xl">
                    {/* Item Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {item.imageUrl ? (
                        <>
                          <motion.img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setPreviewImage(item.imageUrl!)}
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
                              className="rounded-full shadow-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm"
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
                              className="rounded-full shadow-lg bg-destructive/20 hover:bg-destructive/30 backdrop-blur-sm"
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn xóa "${item.name}"?`)) {
                                  deleteMutation.mutate(item.id);
                                }
                              }}
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Gift size={48} className="opacity-30" />
                        </div>
                      )}

                      {/* Purchased Badge */}
                      {item.isPurchased && (
                        <Badge 
                          className="absolute top-3 left-3 bg-green-500 text-white border-0 shadow-lg backdrop-blur-sm rounded-full px-3 py-1"
                        >
                          <Package size={12} className="mr-1" />
                          Đã mua
                        </Badge>
                      )}

                      {/* Price Badge */}
                      {item.price && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm rounded-full px-3 py-1"
                        >
                          <DollarSign size={12} className="mr-1" />
                          {item.price}
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <CardTitle className="text-xl leading-tight font-semibold">{item.name}</CardTitle>
                        
                        {item.description && (
                          <motion.p 
                            className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {item.description}
                          </motion.p>
                        )}
                        
                        <div className="flex justify-between items-center pt-2">
                          {item.purchaseUrl ? (
                            <a
                              href={item.purchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors"
                            >
                              <ExternalLink size={14} />
                              Mua ngay
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                              Không có liên kết
                            </span>
                          )}
                          
                          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm">
                            Thứ tự: {item.order}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
          <div className="relative">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              onClick={() => setPreviewImage(null)}
            >
              <X size={20} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}