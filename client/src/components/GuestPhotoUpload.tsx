import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, Check, X, ImagePlus, User, MessageCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

interface SelectedImage {
  file: File;
  preview: string;
}

export default function GuestPhotoUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [formData, setFormData] = useState({
    caption: "",
    guestName: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (images: SelectedImage[]) => {
      setUploading(true);
      setUploadProgress(0);

      const uploadedResults: { url: string; preview: string }[] = [];
      const totalFiles = images.length;

      try {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageUrl = await uploadImageToCloudinary(image.file, (progress) => {
            const overallProgress = Math.floor(((i + progress / 100) / totalFiles) * 100);
            setUploadProgress(overallProgress);
          });

          uploadedResults.push({ 
            url: imageUrl, 
            preview: image.preview 
          });

          // Update progress after each successful upload
          const currentProgress = Math.floor(((i + 1) / totalFiles) * 100);
          setUploadProgress(currentProgress);
        }

        // Now send all images to the API
        const promises = uploadedResults.map(img => 
          apiRequest("POST", "/api/guest-photos", {
            url: img.url,
            caption: formData.caption,
            guestName: formData.guestName,
          })
        );
        
        return await Promise.all(promises);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guest-photos"] });
      toast({
        title: "🎉 Upload thành công!",
        description: `${selectedImages.length} ảnh của bạn đang chờ duyệt và sẽ sớm xuất hiện trong gallery.`,
      });
      setShowSuccess(true);
      setFormData({ caption: "", guestName: "" });
      setSelectedImages([]);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      toast({
        title: "❌ Có lỗi xảy ra",
        description: "Không thể upload ảnh. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast({
        title: "❌ File không hợp lệ",
        description: "Vui lòng chỉ chọn file hình ảnh (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "❌ File quá lớn",
        description: `${oversizedFiles.length} file vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.`,
        variant: "destructive",
      });
      return;
    }

    const totalAfterSelection = selectedImages.length + files.length;
    if (totalAfterSelection > 10) {
      toast({
        title: "❌ Quá nhiều ảnh",
        description: `Bạn đã chọn ${selectedImages.length} ảnh. Chỉ có thể upload tối đa 10 ảnh cùng lúc.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const newImages: SelectedImage[] = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedImages(prev => [...prev, ...newImages]);
      
      toast({
        title: "✅ Đã thêm ảnh!",
        description: `Đã thêm ${newImages.length} ảnh. Bạn có thể xem preview và xóa ảnh không mong muốn trước khi gửi.`,
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể xử lý ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    console.log("Removing image at index:", index);
    console.log("Current images:", selectedImages);
    
    setSelectedImages(prev => {
      const newImages = [...prev];
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    
    toast({
      title: "🗑️ Đã xóa ảnh",
      description: "Ảnh đã được xóa khỏi danh sách.",
    });
  };

  const clearAllImages = () => {
    // Revoke all object URLs
    selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setSelectedImages([]);
    toast({
      title: "🗑️ Đã xóa tất cả ảnh",
      description: "Tất cả ảnh đã chọn đã được xóa.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length === 0) {
      toast({
        title: "📸 Thiếu ảnh",
        description: "Vui lòng chọn ít nhất 1 ảnh để upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.guestName.trim()) {
      toast({
        title: "👤 Thiếu tên",
        description: "Vui lòng cho chúng tôi biết tên của bạn",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(selectedImages);
  };

  return (
    <section 
      id="guest-photos" 
      data-testid="section-guest-photo-upload" 
      className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chia Sẻ Khoảnh Khắc
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload những bức ảnh đẹp nhất của bạn từ buổi tiệc và cùng nhau tạo nên bộ sưu tập kỷ niệm đáng nhớ
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4 pt-8 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <ImagePlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Upload Ảnh Của Bạn
                </CardTitle>
                <CardDescription className="text-base">
                  Ảnh của bạn sẽ được kiểm duyệt trước khi xuất hiện trong gallery kỷ niệm
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
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
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 10,
                          delay: 0.2 
                        }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full mb-6"
                      >
                        <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                        Thành Công!
                      </h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        Cảm ơn bạn đã chia sẻ những khoảnh khắc đẹp
                      </p>
                      <Button 
                        onClick={() => setShowSuccess(false)}
                        variant="outline"
                        className="rounded-full"
                      >
                        Upload thêm ảnh
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      {/* Upload Section */}
                      <div className="space-y-4">
                        <Label htmlFor="photo-upload" className="text-base font-semibold">
                          Chọn Ảnh Của Bạn *
                        </Label>
                        
                        <div 
                          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
                            ${uploading 
                              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/10'
                            }`}
                          onClick={() => !uploading && fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                          
                          {uploading ? (
                            <div className="space-y-4">
                              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                              <div className="space-y-2">
                                <p className="font-medium text-blue-600">Đang upload ảnh...</p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {uploadProgress}% • Đang xử lý {selectedImages.length} ảnh
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto">
                                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg mb-2">
                                  Kéo thả ảnh hoặc click để chọn
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  Hỗ trợ JPEG, PNG, WebP • Tối đa 5MB/ảnh • Tối đa 10 ảnh
                                </p>
                                {selectedImages.length > 0 && (
                                  <p className="text-green-600 font-medium mt-2">
                                    ✅ Đã chọn {selectedImages.length} ảnh
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image Previews */}
                      {selectedImages.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">
                              {selectedImages.length} ảnh đã chọn
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={clearAllImages}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa tất cả
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedImages.map((img, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <img
                                  src={img.preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log("Delete button clicked for index:", index);
                                    removeImage(index);
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center truncate">
                                  {img.file.name}
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Form Fields */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label htmlFor="guestName" className="text-base font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Tên Của Bạn *
                          </Label>
                          <Input
                            data-testid="input-guest-name"
                            id="guestName"
                            placeholder="Nhập tên của bạn..."
                            value={formData.guestName}
                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                            className="rounded-xl h-12 border-2 focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="caption" className="text-base font-semibold flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Chú Thích (Tuỳ chọn)
                          </Label>
                          <Textarea
                            data-testid="textarea-caption"
                            id="caption"
                            placeholder="Mô tả về khoảnh khắc này..."
                            value={formData.caption}
                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                            rows={3}
                            className="rounded-xl border-2 focus:border-blue-500 transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          data-testid="button-submit-photo"
                          type="submit"
                          className="w-full h-14 rounded-xl text-lg font-semibold gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={uploadMutation.isPending || selectedImages.length === 0 || uploading}
                          size="lg"
                        >
                          {uploading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang upload {uploadProgress}%
                            </>
                          ) : uploadMutation.isPending ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              Gửi {selectedImages.length} Ảnh
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl px-6 py-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">💡</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-blue-900 dark:text-blue-100">Mẹo nhỏ</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Bạn có thể xem preview và xóa ảnh không mong muốn trước khi gửi. Tất cả ảnh sẽ có cùng tên và chú thích.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}