import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Plus, Trash2, Pencil } from "lucide-react";
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

export default function AdminGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPhoto) => {
      return await apiRequest("POST", "/api/photos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Thêm ảnh thành công" });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
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
      toast({ title: "Cập nhật ảnh thành công" });
      setIsDialogOpen(false);
      setEditingPhoto(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
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
      toast({ title: "Xóa ảnh thành công" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
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

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif mb-2 text-foreground">Thư Viện Ảnh</h2>
          <p className="text-muted-foreground">Quản lý ảnh đám cưới của bạn</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPhoto(null)}>
              <Plus size={18} className="mr-2" />
              Thêm Ảnh
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPhoto ? "Chỉnh Sửa Ảnh" : "Thêm Ảnh Mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="url">URL Hình Ảnh</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  required
                  placeholder="https://example.com/photo.jpg"
                  defaultValue={editingPhoto?.url}
                />
              </div>
              <div>
                <Label htmlFor="caption">Chú Thích (Tùy chọn)</Label>
                <Textarea
                  id="caption"
                  name="caption"
                  rows={2}
                  placeholder="Mô tả bức ảnh này..."
                  defaultValue={editingPhoto?.caption || ""}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Danh Mục</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="gallery"
                    defaultValue={editingPhoto?.category || "gallery"}
                  />
                </div>
                <div>
                  <Label htmlFor="order">Thứ Tự Hiển Thị</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingPhoto?.order || 0}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingPhoto ? "Cập Nhật" : "Thêm"} Ảnh
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Chưa có ảnh nào. Nhấp "Thêm Ảnh" để tải lên.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            photos.map((photo) => (
              <Card key={photo.id} className="group overflow-hidden hover-elevate">
                <div className="relative aspect-square">
                  <img
                    src={photo.url}
                    alt={photo.caption || "Ảnh đám cưới"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
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
                      onClick={() => deleteMutation.mutate(photo.id)}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
                {photo.caption && (
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {photo.caption}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
