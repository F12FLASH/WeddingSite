import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Plus, Trash2, Pencil, Eye, Download, Search, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Photo, InsertPhoto } from "@shared/schema";
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

export default function AdminGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  // Filter photos based on search and category
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.caption?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         photo.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(photos.map(photo => photo.category).filter(Boolean))];

  const createMutation = useMutation({
    mutationFn: async (data: InsertPhoto) => {
      return await apiRequest("POST", "/api/photos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ 
        title: "✅ Thêm ảnh thành công",
        description: "Ảnh đã được thêm vào thư viện"
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
        description: "Không thể thêm ảnh",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPhoto> }) => {
      return await apiRequest("PATCH", `/api/photos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ 
        title: "✅ Cập nhật ảnh thành công",
        description: "Thông tin ảnh đã được cập nhật"
      });
      setIsDialogOpen(false);
      setEditingPhoto(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật ảnh",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/photos/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ 
        title: "🗑️ Xóa ảnh thành công",
        description: "Ảnh đã được xóa khỏi thư viện"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa ảnh",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertPhoto = {
      url: formData.get("url") as string,
      caption: formData.get("caption") as string,
      category: formData.get("category") as string || "gallery",
      order: parseInt(formData.get("order") as string) || 0,
    };

    if (editingPhoto) {
      updateMutation.mutate({ id: editingPhoto.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = () => {
    toast({
      title: "📸 Tải ảnh lên",
      description: "Tính năng tải ảnh trực tiếp sẽ được kích hoạt",
    });
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
    hidden: { opacity: 0, scale: 0.8 },
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
            <h2 className="text-3xl font-serif mb-2 text-foreground">📸 Thư Viện Ảnh</h2>
            <p className="text-muted-foreground">Quản lý ảnh đám cưới của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingPhoto(null)}
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} className="mr-2" />
                Thêm Ảnh
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingPhoto ? "✏️ Chỉnh Sửa Ảnh" : "🖼️ Thêm Ảnh Mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium">URL Hình Ảnh *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      required
                      placeholder="https://example.com/photo.jpg"
                      defaultValue={editingPhoto?.url}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleImageUpload}>
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caption" className="text-sm font-medium">Chú Thích</Label>
                  <Textarea
                    id="caption"
                    name="caption"
                    rows={3}
                    placeholder="Mô tả bức ảnh này..."
                    defaultValue={editingPhoto?.caption || ""}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Danh Mục</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="engagement, wedding, etc."
                      defaultValue={editingPhoto?.category || "gallery"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-sm font-medium">Thứ Tự</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      defaultValue={editingPhoto?.order || 0}
                    />
                  </div>
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
                    {editingPhoto ? "💾 Cập Nhật" : "📤 Thêm"} Ảnh
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search and Filter */}
        <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" variants={itemVariants}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="🔍 Tìm kiếm ảnh theo chú thích hoặc danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🎯 Tất cả</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={itemVariants}>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{photos.length}</p>
              <p className="text-sm text-muted-foreground">Tổng số ảnh</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Danh mục</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Gallery Grid */}
      {isLoading ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="animate-pulse overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredPhotos.length === 0 ? (
              <motion.div
                className="col-span-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-dashed">
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Không tìm thấy ảnh nào</p>
                    <p>Thử thay đổi bộ lọc hoặc thêm ảnh mới</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit="hidden"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                    <div className="relative aspect-square overflow-hidden">
                      <motion.img
                        src={photo.url}
                        alt={photo.caption || "Ảnh đám cưới"}
                        className="w-full h-full object-cover cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setPreviewImage(photo.url)}
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
                          onClick={() => setPreviewImage(photo.url)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-full shadow-lg"
                          onClick={() => {
                            setEditingPhoto(photo);
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
                            if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
                              deleteMutation.mutate(photo.id);
                            }
                          }}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </motion.div>

                      {/* Category Badge */}
                      {photo.category && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2 bg-black/50 text-white border-0"
                        >
                          {photo.category}
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      {photo.caption && (
                        <p className="text-sm text-foreground line-clamp-2 mb-2 font-medium">
                          {photo.caption}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Thứ tự: {photo.order}</span>
                        <span>
                          {new Date(photo.createdAt!).toLocaleDateString('vi-VN')}
                        </span>
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
        <DialogContent className="max-w-4xl">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}