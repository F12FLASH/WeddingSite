import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
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

export default function AdminRegistry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistryItem | null>(null);

  const { data: items = [], isLoading } = useQuery<RegistryItem[]>({
    queryKey: ["/api/registry"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertRegistryItem) => {
      return await apiRequest("POST", "/api/registry", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      toast({ title: "Thêm món quà thành công" });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
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
      toast({ title: "Cập nhật món quà thành công" });
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
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
      toast({ title: "Xóa món quà thành công" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
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
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif mb-2 text-foreground">Danh Sách Quà Tặng</h2>
          <p className="text-muted-foreground">Quản lý danh sách mong muốn quà cưới</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus size={18} className="mr-2" />
              Thêm Món Quà
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Chỉnh Sửa Món Quà" : "Thêm Món Quà Mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Tên Món Quà</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Máy pha cà phê"
                  defaultValue={editingItem?.name}
                />
              </div>
              <div>
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Mô tả món quà..."
                  defaultValue={editingItem?.description || ""}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Giá ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="50"
                    defaultValue={editingItem?.price || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="order">Thứ Tự Hiển Thị</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingItem?.order || 0}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Hình Ảnh</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={editingItem?.imageUrl || ""}
                />
              </div>
              <div>
                <Label htmlFor="purchaseUrl">Liên Kết Mua Hàng</Label>
                <Input
                  id="purchaseUrl"
                  name="purchaseUrl"
                  type="url"
                  placeholder="https://store.com/product"
                  defaultValue={editingItem?.purchaseUrl || ""}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingItem ? "Cập Nhật" : "Thêm"} Món Quà
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Gift size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Chưa có món quà nào. Nhấp "Thêm Món Quà" để tạo mới.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="hover-elevate">
                {item.imageUrl && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {item.price && (
                    <p className="text-2xl font-bold text-primary">${item.price}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.purchaseUrl && (
                    <a
                      href={item.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Xem Sản Phẩm <ExternalLink size={14} />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
