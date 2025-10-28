import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, Check, Image as ImageIcon, FileImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

export default function GuestPhotoUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    url: "",
    caption: "",
    guestName: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/guest-photos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guest-photos"] });
      toast({
        title: "✅ Upload Thành Công!",
        description: "Ảnh của bạn đang chờ được duyệt và sẽ xuất hiện trong gallery sớm.",
      });
      setShowSuccess(true);
      setFormData({ url: "", caption: "", guestName: "" });
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể upload ảnh. Vui lòng thử lại.",
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

      setFormData({ ...formData, url: imageUrl });

      toast({
        title: "✅ Tải lên thành công!",
        description: "Ảnh đã được tải lên, hãy điền thông tin và gửi",
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
    if (!formData.url.trim()) {
      toast({
        title: "⚠️ Thiếu thông tin",
        description: "Vui lòng tải ảnh lên hoặc nhập link ảnh",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate(formData);
  };

  return (
    <section id="guest-photos" data-testid="section-guest-photo-upload" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Camera className="w-12 h-12 text-primary mx-auto" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            📸 Chia Sẻ Khoảnh Khắc
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hãy upload ảnh của bạn chụp trong tiệc để chia sẻ những khoảnh khắc đáng nhớ!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Ảnh Của Bạn
              </CardTitle>
              <CardDescription>
                Ảnh của bạn sẽ được kiểm duyệt và xuất hiện trong gallery kỷ niệm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <Check className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Upload Thành Công!
                    </h3>
                    <p className="text-muted-foreground">
                      Cảm ơn bạn đã chia sẻ khoảnh khắc đẹp
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="photo-upload">Tải Ảnh Lên *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          data-testid="button-upload-from-device"
                        >
                          {uploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Đang tải {uploadProgress}%
                            </>
                          ) : (
                            <>
                              <FileImage className="w-4 h-4" />
                              Chọn Ảnh Từ Thiết Bị
                            </>
                          )}
                        </Button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        Hoặc nhập link ảnh bên dưới nếu ảnh đã được upload lên dịch vụ khác
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">Link Ảnh (Tùy chọn)</Label>
                      <Input
                        data-testid="input-photo-url"
                        id="url"
                        type="url"
                        placeholder="https://example.com/your-photo.jpg"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      />
                    </div>

                    {formData.url && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-lg overflow-hidden border"
                      >
                        <img
                          src={formData.url}
                          alt="Preview"
                          className="w-full max-h-64 object-contain bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="guestName">Tên Của Bạn</Label>
                      <Input
                        data-testid="input-guest-name"
                        id="guestName"
                        placeholder="Tên bạn..."
                        value={formData.guestName}
                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caption">Chú Thích</Label>
                      <Textarea
                        data-testid="textarea-caption"
                        id="caption"
                        placeholder="Mô tả về bức ảnh..."
                        value={formData.caption}
                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <Button
                      data-testid="button-submit-photo"
                      type="submit"
                      className="w-full gap-2"
                      size="lg"
                      disabled={uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang Upload...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Upload Ảnh
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>💡 <strong>Mẹo:</strong> Bạn có thể upload nhiều ảnh bằng cách gửi form nhiều lần</p>
          </div>
        </div>
      </div>
    </section>
  );
}
