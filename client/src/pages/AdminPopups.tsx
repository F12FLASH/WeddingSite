import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, Upload, Trash2, Eye } from "lucide-react";
import type { Popup } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToCloudinary } from "@/lib/imageUpload";
import { motion } from "framer-motion";

export default function AdminPopups() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingWelcome, setUploadingWelcome] = useState(false);
  const [uploadingScrollEnd, setUploadingScrollEnd] = useState(false);

  const { data: popups, isLoading } = useQuery<Popup[]>({
    queryKey: ["/api/popups"],
  });

  const welcomePopup = popups?.find((p) => p.type === "welcome");
  const scrollEndPopup = popups?.find((p) => p.type === "scroll_end");

  const createMutation = useMutation({
    mutationFn: async (data: { type: string; imageUrl: string; isActive: boolean }) =>
      await apiRequest("POST", "/api/popups", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/popups"] });
      toast({ title: "✅ Popup đã được tạo" });
    },
    onError: () => {
      toast({ title: "❌ Lỗi tạo popup", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; isActive?: boolean; imageUrl?: string }) =>
      await apiRequest("PATCH", `/api/popups/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/popups"] });
      toast({ title: "✅ Popup đã được cập nhật" });
    },
    onError: () => {
      toast({ title: "❌ Lỗi cập nhật popup", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await apiRequest("DELETE", `/api/popups/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/popups"] });
      toast({ title: "✅ Popup đã được xóa" });
    },
    onError: () => {
      toast({ title: "❌ Lỗi xóa popup", variant: "destructive" });
    },
  });

  const handleImageUpload = async (file: File, type: string) => {
    const setUploading = type === "welcome" ? setUploadingWelcome : setUploadingScrollEnd;
    
    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });

      const existingPopup = type === "welcome" ? welcomePopup : scrollEndPopup;

      if (existingPopup) {
        await updateMutation.mutateAsync({ id: existingPopup.id, imageUrl });
      } else {
        await createMutation.mutateAsync({ type, imageUrl, isActive: true });
      }
    } catch (error) {
      toast({
        title: "❌ Lỗi upload ảnh",
        description: "Vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = (popup: Popup) => {
    updateMutation.mutate({ id: popup.id, isActive: !popup.isActive });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" data-testid="heading-popup-management">
            Quản Lý Popup
          </h1>
          <p className="text-muted-foreground">
            Cài đặt hình ảnh popup hiển thị khi khách truy cập website
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Welcome Popup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="text-primary" size={20} />
                Popup Chào Mừng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị khi khách lần đầu truy cập trang web
              </p>

              {welcomePopup?.imageUrl && (
                <div className="relative group">
                  <img
                    src={welcomePopup.imageUrl}
                    alt="Welcome Popup"
                    className="w-full h-48 object-cover rounded-lg"
                    data-testid="img-welcome-popup-preview"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(welcomePopup.id)}
                      data-testid="button-delete-welcome-popup"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="welcome-upload">Upload Hình Ảnh</Label>
                <Input
                  id="welcome-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "welcome");
                  }}
                  disabled={uploadingWelcome}
                  data-testid="input-upload-welcome-popup"
                />
              </div>

              {welcomePopup && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="welcome-active">Kích hoạt</Label>
                  <Switch
                    id="welcome-active"
                    checked={welcomePopup.isActive}
                    onCheckedChange={() => toggleActive(welcomePopup)}
                    data-testid="switch-welcome-active"
                  />
                </div>
              )}

              {uploadingWelcome && (
                <p className="text-sm text-primary">Đang upload...</p>
              )}
            </CardContent>
          </Card>

          {/* Scroll End Popup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="text-primary" size={20} />
                Popup Cuối Trang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị khi khách lướt đến cuối trang web
              </p>

              {scrollEndPopup?.imageUrl && (
                <div className="relative group">
                  <img
                    src={scrollEndPopup.imageUrl}
                    alt="Scroll End Popup"
                    className="w-full h-48 object-cover rounded-lg"
                    data-testid="img-scrollend-popup-preview"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(scrollEndPopup.id)}
                      data-testid="button-delete-scrollend-popup"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="scrollend-upload">Upload Hình Ảnh</Label>
                <Input
                  id="scrollend-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "scroll_end");
                  }}
                  disabled={uploadingScrollEnd}
                  data-testid="input-upload-scrollend-popup"
                />
              </div>

              {scrollEndPopup && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="scrollend-active">Kích hoạt</Label>
                  <Switch
                    id="scrollend-active"
                    checked={scrollEndPopup.isActive}
                    onCheckedChange={() => toggleActive(scrollEndPopup)}
                    data-testid="switch-scrollend-active"
                  />
                </div>
              )}

              {uploadingScrollEnd && (
                <p className="text-sm text-primary">Đang upload...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="text-blue-500" size={20} />
              Hướng Dẫn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>✨ <strong>Popup Chào Mừng:</strong> Hiển thị 1 lần duy nhất khi khách lần đầu vào trang (lưu trong localStorage)</p>
            <p>✨ <strong>Popup Cuối Trang:</strong> Hiển thị khi khách lướt xuống hết 95% trang web</p>
            <p>💡 <strong>Tip:</strong> Sử dụng hình ảnh có kích thước phù hợp (tối đa 20MB) để tải nhanh hơn</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
