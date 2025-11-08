import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Pencil, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Upload,
  X,
  CloudUpload,
  FolderOpen,
  Grid3X3,
  List,
  Star,
  Heart
} from "lucide-react";
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
  DialogDescription,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

export default function AdminGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const categories = Array.from(new Set(photos.map(photo => photo.category).filter(Boolean)));

  // Stats calculations
  const stats = {
    total: photos.length,
    categories: categories.length,
    wedding: photos.filter(p => p.category === 'wedding').length,
    engagement: photos.filter(p => p.category === 'engagement').length,
    featured: photos.filter(p => p.category === 'featured').length,
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertPhoto) => {
      return await apiRequest("POST", "/api/photos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ 
        title: "✅ Thêm ảnh thành công",
        description: "Ảnh đã được thêm vào thư viện",
        className: "bg-green-50 border-green-200 text-green-800"
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
        description: "Không thể thêm ảnh",
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress(0);
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
        description: "Thông tin ảnh đã được cập nhật",
        className: "bg-green-50 border-green-200 text-green-800"
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
        description: "Ảnh đã được xóa khỏi thư viện",
        className: "bg-blue-50 border-blue-200 text-blue-800"
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

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => apiRequest("DELETE", `/api/photos/${id}`, undefined));
      return await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ 
        title: "🗑️ Xóa hàng loạt thành công",
        description: `${selectedPhotos.length} ảnh đã được xóa`,
        className: "bg-blue-50 border-blue-200 text-blue-800"
      });
      setSelectedPhotos([]);
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "❌ Lỗi định dạng",
          description: `File ${file.name} không phải là hình ảnh`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "❌ File quá lớn",
          description: `File ${file.name} vượt quá 10MB`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const imageUrl = await uploadImageToCloudinary(file, (progress) => {
          setUploadProgress((i / validFiles.length) * 100 + (progress / validFiles.length));
        });

        // Auto-create photo entry
        await createMutation.mutateAsync({
          url: imageUrl,
          caption: file.name.split('.')[0],
          category: "gallery",
          order: photos.length + i,
        });
      }

      toast({
        title: "✅ Tải lên thành công!",
        description: `${validFiles.length} ảnh đã được thêm vào thư viện`,
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi tải lên",
        description: "Không thể tải lên ảnh",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const isAllSelected = filteredPhotos.length > 0 && 
    filteredPhotos.every(photo => selectedPhotos.includes(photo.id));

  const toggleAllPhotos = () => {
    if (isAllSelected) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(p => p.id));
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
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-6 max-w-7xl mx-auto"
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Header */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ImageIcon size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Quản Lý Thư Viện Ảnh
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Quản lý và sắp xếp ảnh đám cưới của bạn
                </p>
              </div>
            </div>
            
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <FolderOpen className="w-4 h-4 mr-1" />
              {stats.total} ảnh
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Tổng số ảnh</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Danh mục</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.categories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 border-pink-200 dark:border-pink-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Ảnh cưới</p>
                    <p className="text-lg font-bold text-pink-900 dark:text-pink-100">{stats.wedding}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Đính hôn</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">{stats.engagement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Nổi bật</p>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{stats.featured}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="🔍 Tìm kiếm ảnh theo chú thích hoặc danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border-2 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 rounded-lg border-2">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🎯 Tất cả danh mục</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border-2 rounded-lg bg-background">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="rounded-l-md rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chế độ lưới</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="rounded-r-md rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chế độ danh sách</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <Button 
              onClick={triggerFileInput}
              disabled={uploading}
              variant="outline"
              className="rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Upload className="w-4 h-4" />
                  </motion.div>
                  Đang tải...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CloudUpload className="w-4 h-4" />
                  Tải ảnh lên
                </div>
              )}
            </Button>
            
            {/* SỬA LỖI Ở ĐÂY: Di chuyển DialogTrigger ra ngoài Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setEditingPhoto(null)}
                  className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus size={18} className="mr-2" />
                  Thêm Ảnh Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {editingPhoto ? "✏️ Chỉnh Sửa Ảnh" : "🖼️ Thêm Ảnh Mới"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPhoto ? "Cập nhật thông tin ảnh" : "Thêm ảnh mới vào thư viện"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="url" className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                      URL Hình Ảnh *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        required
                        placeholder="https://example.com/photo.jpg"
                        defaultValue={editingPhoto?.url}
                        className="flex-1 border-2 focus:border-blue-500"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={triggerFileInput}
                            disabled={uploading}
                            className="border-2"
                          >
                            {uploading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Upload className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <CloudUpload className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tải ảnh lên từ thiết bị</TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {uploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">
                          Đang tải lên... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Nhập URL hoặc tải lên từ thiết bị (JPEG, PNG, WebP, tối đa 10MB)
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="caption" className="text-sm font-medium flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-green-500" />
                      Chú Thích
                    </Label>
                    <Textarea
                      id="caption"
                      name="caption"
                      rows={3}
                      placeholder="Mô tả bức ảnh này..."
                      defaultValue={editingPhoto?.caption || ""}
                      className="border-2 focus:border-green-500 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-purple-500" />
                        Danh Mục
                      </Label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="wedding, engagement, etc."
                        defaultValue={editingPhoto?.category || "gallery"}
                        className="border-2 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="order" className="text-sm font-medium flex items-center gap-2">
                        <List className="w-4 h-4 text-orange-500" />
                        Thứ Tự
                      </Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        min="0"
                        defaultValue={editingPhoto?.order || 0}
                        className="border-2 focus:border-orange-500"
                      />
                    </div>
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
                      className="rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-pink-600"
                      disabled={createMutation.isPending || updateMutation.isPending || uploading}
                    >
                      {editingPhoto ? "💾 Cập Nhật" : "📤 Thêm"} Ảnh
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedPhotos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedPhotos.length} ảnh đã chọn
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa ${selectedPhotos.length} ảnh?`)) {
                        bulkDeleteMutation.mutate(selectedPhotos);
                      }
                    }}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa Đã Chọn
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Content */}
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="animate-pulse overflow-hidden rounded-2xl border-0">
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
          <div className="space-y-4">
            {/* Selection Header */}
            {filteredPhotos.length > 0 && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Switch
                  checked={isAllSelected}
                  onCheckedChange={toggleAllPhotos}
                />
                <span className="text-sm text-muted-foreground">
                  Chọn tất cả {selectedPhotos.length > 0 && `(${selectedPhotos.length} đã chọn)`}
                </span>
              </div>
            )}

            {/* Photos Grid/List */}
            {filteredPhotos.length === 0 ? (
              <motion.div
                className="col-span-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-dashed rounded-2xl border-2">
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Không tìm thấy ảnh nào</p>
                    <p>Thử thay đổi bộ lọc hoặc thêm ảnh mới</p>
                    <Button 
                      className="mt-4 rounded-lg"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus size={18} className="mr-2" />
                      Thêm Ảnh Đầu Tiên
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit="hidden"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm rounded-2xl">
                        <div className="relative aspect-square overflow-hidden">
                          <motion.img
                            src={photo.url}
                            alt={photo.caption || "Ảnh đám cưới"}
                            className="w-full h-full object-cover cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setPreviewImage(photo.url)}
                          />
                          
                          {/* Selection Checkbox */}
                          <div className="absolute top-3 left-3 z-20">
                            <div 
                              className={`w-6 h-6 rounded border-2 cursor-pointer flex items-center justify-center ${
                                selectedPhotos.includes(photo.id) 
                                  ? 'bg-blue-500 border-blue-500 text-white' 
                                  : 'bg-white/90 border-white/80'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePhotoSelection(photo.id);
                              }}
                            >
                              {selectedPhotos.includes(photo.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  ✓
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Overlay Actions */}
                          <motion.div
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-full shadow-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                                  onClick={() => setPreviewImage(photo.url)}
                                >
                                  <Eye size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xem ảnh</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-full shadow-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                                  onClick={() => {
                                    setEditingPhoto(photo);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Pencil size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Chỉnh sửa</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-full shadow-lg bg-destructive/20 hover:bg-destructive/30 backdrop-blur-sm border-0"
                                  onClick={() => {
                                    if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
                                      deleteMutation.mutate(photo.id);
                                    }
                                  }}
                                >
                                  <Trash2 size={16} className="text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xóa ảnh</TooltipContent>
                            </Tooltip>
                          </motion.div>

                          {/* Category Badge */}
                          {photo.category && (
                            <Badge 
                              variant="secondary" 
                              className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm rounded-full px-3 py-1"
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
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* List View */
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0">
                      <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div 
                            className={`w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center ${
                              selectedPhotos.includes(photo.id) 
                                ? 'bg-blue-500 border-blue-500 text-white' 
                                : 'bg-background border-border'
                            }`}
                            onClick={() => togglePhotoSelection(photo.id)}
                          >
                            {selectedPhotos.includes(photo.id) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                ✓
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={photo.url}
                              alt={photo.caption || "Ảnh đám cưới"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {photo.caption && (
                                <p className="font-medium text-foreground truncate">
                                  {photo.caption}
                                </p>
                              )}
                              {photo.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {photo.category}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Thứ tự: {photo.order}</span>
                              <span>•</span>
                              <span>
                                {new Date(photo.createdAt!).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPreviewImage(photo.url)}
                              >
                                <Eye size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xem ảnh</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingPhoto(photo);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Chỉnh sửa</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
                                    deleteMutation.mutate(photo.id);
                                  }
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xóa ảnh</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
            <div className="relative">
              {previewImage && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
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
    </TooltipProvider>
  );
}