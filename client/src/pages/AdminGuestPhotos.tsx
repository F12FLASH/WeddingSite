import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Trash2, Image, Search, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestPhoto } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
} from "@/components/ui/dialog";

export default function AdminGuestPhotos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewPhoto, setPreviewPhoto] = useState<GuestPhoto | null>(null);

  const { data: photos = [], isLoading } = useQuery<GuestPhoto[]>({
    queryKey: ["/api/guest-photos"],
  });

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = (photo.guestName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                         (photo.caption?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "approved" && photo.approved) ||
                         (statusFilter === "pending" && !photo.approved);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: photos.length,
    approved: photos.filter(p => p.approved).length,
    pending: photos.filter(p => !p.approved).length,
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

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="page-admin-guest-photos" className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            📸 Ảnh Khách Mời Upload
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý ảnh do khách mời tải lên trong tiệc</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="stat-total">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-approved">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã Duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.approved}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-pending">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ Duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="input-search"
            placeholder="Tìm kiếm theo tên hoặc chú thích..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger data-testid="select-status-filter" className="w-48">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              data-testid={`photo-card-${photo.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square bg-muted">
                  <img
                    src={photo.url}
                    alt={photo.caption || "Guest photo"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {photo.approved ? (
                      <Badge className="bg-green-500">Đã duyệt</Badge>
                    ) : (
                      <Badge variant="secondary">Chờ duyệt</Badge>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      data-testid={`button-preview-${photo.id}`}
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewPhoto(photo)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="min-h-[60px]">
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                    {photo.guestName && (
                      <p className="text-xs font-medium text-primary mt-1">
                        - {photo.guestName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!photo.approved && (
                      <Button
                        data-testid={`button-approve-${photo.id}`}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => approveMutation.mutate({ id: photo.id, approved: true })}
                      >
                        <Check className="w-4 h-4" />
                        Duyệt
                      </Button>
                    )}
                    {photo.approved && (
                      <Button
                        data-testid={`button-unapprove-${photo.id}`}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                        onClick={() => approveMutation.mutate({ id: photo.id, approved: false })}
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </Button>
                    )}
                    <Button
                      data-testid={`button-delete-${photo.id}`}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm("Bạn có chắc muốn xóa ảnh này?")) {
                          deleteMutation.mutate(photo.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Chưa có ảnh nào được upload</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent data-testid="dialog-photo-preview" className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem Ảnh</DialogTitle>
          </DialogHeader>
          {previewPhoto && (
            <div className="space-y-4">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.caption || "Guest photo"}
                className="w-full rounded-lg"
              />
              {previewPhoto.caption && (
                <div>
                  <p className="font-medium">Chú thích:</p>
                  <p className="text-muted-foreground">{previewPhoto.caption}</p>
                </div>
              )}
              {previewPhoto.guestName && (
                <div>
                  <p className="font-medium">Người upload:</p>
                  <p className="text-muted-foreground">{previewPhoto.guestName}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Trạng thái:</p>
                <Badge className={previewPhoto.approved ? "bg-green-500" : ""}>
                  {previewPhoto.approved ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
