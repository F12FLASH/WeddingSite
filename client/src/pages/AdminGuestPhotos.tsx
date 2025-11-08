import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Trash2, Image, Search, Eye, Filter, Download, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestPhoto } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminGuestPhotos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewPhoto, setPreviewPhoto] = useState<GuestPhoto | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const photosPerPage = 12;

  const { data: photos = [], isLoading } = useQuery<GuestPhoto[]>({
    queryKey: ["/api/guest-photos"],
  });

  // Sort by newest first
  const sortedPhotos = [...photos].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredPhotos = sortedPhotos.filter(photo => {
    const matchesSearch = (photo.guestName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                         (photo.caption?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "approved" && photo.approved) ||
                         (statusFilter === "pending" && !photo.approved);
    const matchesTab = activeTab === "all" || 
                      (activeTab === "approved" && photo.approved) ||
                      (activeTab === "pending" && !photo.approved);
    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * photosPerPage,
    currentPage * photosPerPage
  );

  // Clamp currentPage when filteredPhotos changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const stats = {
    total: photos.length,
    approved: photos.filter(p => p.approved).length,
    pending: photos.filter(p => !p.approved).length,
  };

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const isAllCurrentPageSelected = paginatedPhotos.length > 0 && 
    paginatedPhotos.every(photo => selectedPhotos.includes(photo.id));

  const toggleAllPhotos = () => {
    const currentPageIds = paginatedPhotos.map(p => p.id);
    if (isAllCurrentPageSelected) {
      setSelectedPhotos(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedPhotos(prev => {
        const newSelections = currentPageIds.filter(id => !prev.includes(id));
        return [...prev, ...newSelections];
      });
    }
  };

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      return await apiRequest("PATCH", `/api/guest-photos/${id}/approve`, { approved });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/guest-photos"] });
      toast({ 
        title: variables.approved ? "✅ Đã phê duyệt" : "🔄 Đã hủy duyệt",
        description: `Ảnh đã được ${variables.approved ? 'phê duyệt' : 'hủy duyệt'}`,
      });
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
      return await apiRequest("DELETE", `/api/guest-photos/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guest-photos"] });
      toast({ 
        title: "🗑️ Đã xóa ảnh",
        description: "Ảnh đã được xóa thành công",
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

  const bulkApproveMutation = useMutation({
    mutationFn: async (approved: boolean) => {
      const promises = selectedPhotos.map(id =>
        apiRequest("PATCH", `/api/guest-photos/${id}/approve`, { approved })
      );
      return await Promise.all(promises);
    },
    onSuccess: (_, approved) => {
      queryClient.invalidateQueries({ queryKey: ["/api/guest-photos"] });
      toast({
        title: approved ? "✅ Đã duyệt hàng loạt" : "🔄 Đã hủy duyệt hàng loạt",
        description: `${selectedPhotos.length} ảnh đã được ${approved ? 'phê duyệt' : 'hủy duyệt'}`,
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
        description: "Không thể cập nhật ảnh",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async () => {
      const promises = selectedPhotos.map(id =>
        apiRequest("DELETE", `/api/guest-photos/${id}`, undefined)
      );
      return await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guest-photos"] });
      toast({
        title: "🗑️ Đã xóa hàng loạt",
        description: `${selectedPhotos.length} ảnh đã được xóa`,
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

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Đang tải ảnh...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div data-testid="page-admin-guest-photos" className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📸 Quản Lý Ảnh Khách Mời
            </h1>
            <p className="text-muted-foreground">Quản lý và phê duyệt ảnh do khách mời tải lên</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="stat-total" className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Tổng Ảnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tất cả ảnh đã upload</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-approved" className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Đã Duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{approvalRate}% tổng số</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-pending" className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Chờ Duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.pending}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Cần xem xét</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Tỷ Lệ Duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {approvalRate}%
              </div>
              <Progress value={approvalRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="input-search"
                  placeholder="Tìm kiếm theo tên khách mời hoặc chú thích..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger data-testid="select-status-filter" className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Lọc trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex gap-2">
                  Tất cả
                  <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex gap-2">
                  Đã duyệt
                  <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">{stats.approved}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex gap-2">
                  Chờ duyệt
                  <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700">{stats.pending}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {selectedPhotos.length} ảnh đã được chọn
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Áp dụng thao tác hàng loạt cho các ảnh đã chọn
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => bulkApproveMutation.mutate(true)}
                      disabled={bulkApproveMutation.isPending}
                    >
                      <Check className="w-4 h-4" />
                      Duyệt Tất Cả
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Phê duyệt tất cả ảnh đã chọn</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      onClick={() => bulkApproveMutation.mutate(false)}
                      disabled={bulkApproveMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                      Hủy Duyệt
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Hủy phê duyệt tất cả ảnh đã chọn</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn xóa ${selectedPhotos.length} ảnh?`)) {
                          bulkDeleteMutation.mutate();
                        }
                      }}
                      disabled={bulkDeleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa Tất Cả
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Xóa vĩnh viễn tất cả ảnh đã chọn</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photos Grid */}
        <div className="space-y-4">
          {paginatedPhotos.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isAllCurrentPageSelected}
                  onCheckedChange={toggleAllPhotos}
                />
                <span className="text-sm text-muted-foreground">
                  Chọn tất cả {selectedPhotos.length > 0 && `(${selectedPhotos.length} đã chọn)`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Hiển thị {paginatedPhotos.length} của {filteredPhotos.length} ảnh
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {paginatedPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  data-testid={`photo-card-${photo.id}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${
                    selectedPhotos.includes(photo.id) 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}>
                    {/* Image Container */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <img
                        src={photo.url}
                        alt={photo.caption || "Guest photo"}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      
                      {/* Selection Overlay */}
                      <div className="absolute top-3 left-3 z-20">
                        <Checkbox
                          checked={selectedPhotos.includes(photo.id)}
                          onCheckedChange={() => togglePhotoSelection(photo.id)}
                          className="bg-white/90 backdrop-blur-sm border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3 z-20">
                        {photo.approved ? (
                          <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0">
                            Đã duyệt
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/90 backdrop-blur-sm text-white border-0">
                            Chờ duyệt
                          </Badge>
                        )}
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid={`button-preview-${photo.id}`}
                              variant="secondary"
                              size="sm"
                              onClick={() => setPreviewPhoto(photo)}
                              className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xem ảnh</TooltipContent>
                        </Tooltip>

                        {!photo.approved && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                data-testid={`button-approve-${photo.id}`}
                                size="sm"
                                onClick={() => approveMutation.mutate({ id: photo.id, approved: true })}
                                className="rounded-full bg-green-600 hover:bg-green-700 border-0"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Phê duyệt ảnh</TooltipContent>
                          </Tooltip>
                        )}

                        {photo.approved && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                data-testid={`button-unapprove-${photo.id}`}
                                variant="outline"
                                size="sm"
                                onClick={() => approveMutation.mutate({ id: photo.id, approved: false })}
                                className="rounded-full bg-orange-600 hover:bg-orange-700 border-0 text-white"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Hủy phê duyệt</TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid={`button-delete-${photo.id}`}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
                                  deleteMutation.mutate(photo.id);
                                }
                              }}
                              className="rounded-full bg-red-600 hover:bg-red-700 border-0 text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xóa ảnh</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Photo Info */}
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2 min-h-[60px]">
                        {photo.caption && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            "{photo.caption}"
                          </p>
                        )}
                        {photo.guestName && (
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            <span className="font-medium text-primary">
                              {photo.guestName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        {!photo.approved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => approveMutation.mutate({ id: photo.id, approved: true })}
                          >
                            <Check className="w-3 h-3" />
                            Duyệt
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            onClick={() => approveMutation.mutate({ id: photo.id, approved: false })}
                          >
                            <X className="w-3 h-3" />
                            Hủy
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredPhotos.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                  <Image className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy ảnh nào</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {searchTerm || statusFilter !== "all" || activeTab !== "all"
                    ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                    : "Chưa có ảnh nào được khách mời upload"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {currentPage} của {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trang Trước
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Trang Sau
              </Button>
            </div>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
          <DialogContent data-testid="dialog-photo-preview" className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Xem Chi Tiết Ảnh
              </DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về ảnh được khách mời upload
              </DialogDescription>
            </DialogHeader>
            {previewPhoto && (
              <div className="space-y-6">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={previewPhoto.url}
                    alt={previewPhoto.caption || "Guest photo"}
                    className="w-full max-h-[60vh] object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Chú thích</label>
                      <p className="mt-1 text-base">{previewPhoto.caption || "Không có chú thích"}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Người upload</label>
                      <p className="mt-1 text-base font-medium text-primary">
                        {previewPhoto.guestName || "Không xác định"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                      <div className="mt-1">
                        <Badge className={previewPhoto.approved ? "bg-green-500" : "bg-orange-500"}>
                          {previewPhoto.approved ? "Đã duyệt" : "Chờ duyệt"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Thời gian upload</label>
                      <p className="mt-1 text-base">
                        {previewPhoto.createdAt ? new Date(previewPhoto.createdAt).toLocaleString('vi-VN') : "Không xác định"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {!previewPhoto.approved ? (
                    <Button
                      className="gap-2"
                      onClick={() => {
                        approveMutation.mutate({ id: previewPhoto.id, approved: true });
                        setPreviewPhoto(null);
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Phê Duyệt Ảnh
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                      onClick={() => {
                        approveMutation.mutate({ id: previewPhoto.id, approved: false });
                        setPreviewPhoto(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                      Hủy Phê Duyệt
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="gap-2 border-red-500 text-red-600 hover:bg-red-50 ml-auto"
                    onClick={() => {
                      if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
                        deleteMutation.mutate(previewPhoto.id);
                        setPreviewPhoto(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa Ảnh
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}