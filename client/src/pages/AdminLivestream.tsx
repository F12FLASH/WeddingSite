import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Save, ExternalLink, Calendar, MessageCircle, Upload, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { LivestreamInfo, CoupleInfo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

export default function AdminLivestream() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: livestream, isLoading } = useQuery<LivestreamInfo>({
    queryKey: ["/api/livestream"],
  });

  const { data: coupleInfo } = useQuery<CoupleInfo>({
    queryKey: ["/api/couple"],
  });

  const [formData, setFormData] = useState({
    isActive: true,
    platform: "youtube",
    streamUrl: "",
    streamTitle: "",
    streamDescription: "",
    startTime: "",
    endTime: "",
    thumbnailUrl: "",
    chatEnabled: true,
  });

  useEffect(() => {
    if (livestream) {
      setFormData({
        isActive: livestream.isActive,
        platform: livestream.platform,
        streamUrl: livestream.streamUrl,
        streamTitle: livestream.streamTitle || "",
        streamDescription: livestream.streamDescription || "",
        startTime: livestream.startTime ? new Date(livestream.startTime).toISOString().slice(0, 16) : "",
        endTime: livestream.endTime ? new Date(livestream.endTime).toISOString().slice(0, 16) : "",
        thumbnailUrl: livestream.thumbnailUrl || coupleInfo?.heroImage || "",
        chatEnabled: livestream.chatEnabled,
      });
    }
  }, [livestream, coupleInfo]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/livestream", {
        ...data,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestream"] });
      toast({ 
        title: "✅ Đã lưu",
        description: "Thông tin livestream đã được cập nhật",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật thông tin livestream",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
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

      setFormData({ ...formData, thumbnailUrl: imageUrl });

      toast({
        title: "✅ Tải lên thành công!",
        description: "Ảnh thumbnail đã được tải lên",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tải lên ảnh",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="page-admin-livestream" className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
          🎥 Quản Lý Livestream
        </h1>
        <p className="text-muted-foreground mt-1">Cài đặt trực tiếp đám cưới cho khách mời xem online</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cài Đặt Livestream</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">Kích Hoạt Livestream</Label>
                <p className="text-sm text-muted-foreground">
                  Bật/tắt tính năng xem trực tiếp trên website
                </p>
              </div>
              <Switch
                data-testid="switch-is-active"
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Nền Tảng</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger data-testid="select-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="custom">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Chọn nền tảng livestream bạn sử dụng
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streamUrl">Link Xem Trực Tiếp *</Label>
                <div className="flex gap-2">
                  <Input
                    data-testid="input-stream-url"
                    id="streamUrl"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    required
                  />
                  {formData.streamUrl && (
                    <Button
                      data-testid="button-test-link"
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(formData.streamUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamTitle">Tiêu Đề Livestream</Label>
              <Input
                data-testid="input-stream-title"
                id="streamTitle"
                placeholder="Trực Tiếp Đám Cưới..."
                value={formData.streamTitle}
                onChange={(e) => setFormData({ ...formData, streamTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamDescription">Mô Tả</Label>
              <Textarea
                data-testid="textarea-stream-description"
                id="streamDescription"
                placeholder="Thông tin về buổi livestream..."
                value={formData.streamDescription}
                onChange={(e) => setFormData({ ...formData, streamDescription: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thời Gian Bắt Đầu
                </Label>
                <Input
                  data-testid="input-start-time"
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thời Gian Kết Thúc
                </Label>
                <Input
                  data-testid="input-end-time"
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Ảnh Thumbnail</Label>
              <p className="text-xs text-muted-foreground">
                Mặc định sử dụng ảnh background đám cưới. Bạn có thể tải ảnh mới hoặc nhập URL.
              </p>
              <div className="flex gap-2">
                <Input
                  data-testid="input-thumbnail-url"
                  id="thumbnailUrl"
                  type="url"
                  placeholder={coupleInfo?.heroImage || "https://example.com/thumbnail.jpg"}
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  data-testid="button-upload-thumbnail"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên
                    </>
                  )}
                </Button>
                {formData.thumbnailUrl && formData.thumbnailUrl !== coupleInfo?.heroImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFormData({ ...formData, thumbnailUrl: coupleInfo?.heroImage || "" })}
                    data-testid="button-reset-thumbnail"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {formData.thumbnailUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full max-h-48 object-contain bg-muted"
                    data-testid="img-thumbnail-preview"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="chatEnabled" className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Cho Phép Chat
                </Label>
                <p className="text-sm text-muted-foreground">
                  Bật/tắt khả năng chat trong livestream
                </p>
              </div>
              <Switch
                data-testid="switch-chat-enabled"
                id="chatEnabled"
                checked={formData.chatEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                data-testid="button-save"
                type="submit"
                className="flex-1 gap-2"
                disabled={saveMutation.isPending}
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Đang lưu..." : "Lưu Cài Đặt"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {formData.isActive && formData.streamUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Xem Trước Livestream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              {formData.thumbnailUrl ? (
                <>
                  <img
                    src={formData.thumbnailUrl}
                    alt="Livestream preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-semibold">
                        Xem Trước Livestream
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2">
                    <Video className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Chưa có ảnh thumbnail
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div>
                <h3 className="font-semibold text-lg">
                  {formData.streamTitle || "Trực Tiếp Đám Cưới"}
                </h3>
                {formData.streamDescription && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.streamDescription}
                  </p>
                )}
              </div>

              {(formData.startTime || formData.endTime) && (
                <div className="flex gap-4 text-sm">
                  {formData.startTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        Bắt đầu: {new Date(formData.startTime).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  )}
                  {formData.endTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        Kết thúc: {new Date(formData.endTime).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              data-testid="button-view-on-site"
              variant="outline"
              onClick={() => window.open('/', '_blank')}
              className="w-full gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Xem Trên Trang Web
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
