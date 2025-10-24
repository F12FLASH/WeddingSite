import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Image, User, Calendar, Heart, Camera, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { CoupleInfo, InsertCoupleInfo } from "@shared/schema";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "your-cloudinary-cloud-name"; // Thay bằng cloud name của bạn
const CLOUDINARY_UPLOAD_PRESET = "your-upload-preset"; // Thay bằng upload preset của bạn

async function apiRequest(method: string, url: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message);
  }
  return res.json();
}

function isUnauthorizedError(error: Error) {
  return error.message === "Unauthorized";
}

// Upload image to Cloudinary
async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

export default function AdminCouple() {
  const { toast } = useToast();
  
  const { data: coupleInfo, isLoading: isLoadingData } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });

  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    ourStory: "",
    bridePhoto: "",
    groomPhoto: "",
    heroImage: "",
    brideDescription: "",
    groomDescription: "",
  });

  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = {
    bridePhoto: useRef<HTMLInputElement>(null),
    groomPhoto: useRef<HTMLInputElement>(null),
    heroImage: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (coupleInfo) {
      setFormData({
        brideName: coupleInfo.brideName || "",
        groomName: coupleInfo.groomName || "",
        weddingDate: coupleInfo.weddingDate ? new Date(coupleInfo.weddingDate).toISOString().split('T')[0] : "",
        ourStory: coupleInfo.ourStory || "",
        bridePhoto: coupleInfo.bridePhoto || "",
        groomPhoto: coupleInfo.groomPhoto || "",
        heroImage: coupleInfo.heroImage || "",
        brideDescription: coupleInfo.brideDescription || "",
        groomDescription: coupleInfo.groomDescription || "",
      });
    }
  }, [coupleInfo]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCoupleInfo) => {
      return await apiRequest("POST", "/api/couple", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/couple"] });
      toast({ 
        title: "✅ Thành công!",
        description: "Thông tin cặp đôi đã được cập nhật"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật thông tin cặp đôi",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: InsertCoupleInfo = {
      brideName: formData.brideName,
      groomName: formData.groomName,
      weddingDate: new Date(formData.weddingDate),
      ourStory: formData.ourStory,
      bridePhoto: formData.bridePhoto || null,
      groomPhoto: formData.groomPhoto || null,
      heroImage: formData.heroImage || null,
      brideDescription: formData.brideDescription || null,
      groomDescription: formData.groomDescription || null,
    };
    
    updateMutation.mutate(data);
  };

  const handleFileSelect = async (field: keyof typeof fileInputRefs, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(field);

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, [field]: imageUrl }));
      
      toast({
        title: "✅ Thành công!",
        description: `Đã tải lên ảnh ${getFieldLabel(field)} thành công`,
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: `Không thể tải lên ảnh ${getFieldLabel(field)}`,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const getFieldLabel = (field: string): string => {
    const labels: { [key: string]: string } = {
      bridePhoto: "cô dâu",
      groomPhoto: "chú rể",
      heroImage: "hình nền"
    };
    return labels[field] || field;
  };

  const handleRemoveImage = (field: keyof typeof fileInputRefs) => {
    setFormData(prev => ({ ...prev, [field]: "" }));
  };

  const triggerFileInput = (field: keyof typeof fileInputRefs) => {
    fileInputRefs[field].current?.click();
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

  // Hidden file inputs
  const renderHiddenFileInput = (field: keyof typeof fileInputRefs) => (
    <input
      type="file"
      ref={fileInputRefs[field]}
      onChange={(e) => handleFileSelect(field, e)}
      accept="image/*"
      className="hidden"
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="mb-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 
          className="text-3xl font-serif mb-2 text-foreground" 
          data-testid="heading-couple-info"
          variants={itemVariants}
        >
          👰‍♀️🤵‍♂️ Thông Tin Cô Dâu Chú Rể
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          variants={itemVariants}
        >
          Quản lý thông tin chi tiết về cô dâu chú rể và câu chuyện tình yêu
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-2 border-border/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <motion.div variants={itemVariants}>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="text-primary" size={24} fill="currentColor" />
                Chỉnh Sửa Thông Tin Cặp Đôi
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Hidden file inputs */}
            {renderHiddenFileInput('bridePhoto')}
            {renderHiddenFileInput('groomPhoto')}
            {renderHiddenFileInput('heroImage')}

            <motion.form onSubmit={handleSubmit} className="space-y-8" variants={containerVariants}>
              {/* Names Section */}
              <motion.div 
                className="grid md:grid-cols-2 gap-6 p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="space-y-3">
                  <Label htmlFor="brideName" className="text-lg font-medium flex items-center gap-2">
                    <User className="text-pink-500" size={20} />
                    Tên Cô Dâu
                  </Label>
                  <Input
                    id="brideName"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    className="h-12 text-lg border-2 focus:border-pink-500 transition-all duration-300"
                    data-testid="input-bride-name"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="groomName" className="text-lg font-medium flex items-center gap-2">
                    <User className="text-blue-500" size={20} />
                    Tên Chú Rể
                  </Label>
                  <Input
                    id="groomName"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-300"
                    data-testid="input-groom-name"
                  />
                </div>
              </motion.div>

              {/* Wedding Date */}
              <motion.div 
                className="p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Label htmlFor="weddingDate" className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Calendar className="text-primary" size={20} />
                  Ngày Cưới
                </Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                  data-testid="input-wedding-date"
                />
              </motion.div>

              {/* Descriptions */}
              <motion.div 
                className="grid md:grid-cols-2 gap-6 p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="space-y-3">
                  <Label htmlFor="brideDescription" className="text-lg font-medium flex items-center gap-2">
                    💝 Mô Tả Cô Dâu
                  </Label>
                  <Textarea
                    id="brideDescription"
                    value={formData.brideDescription}
                    onChange={(e) => setFormData({ ...formData, brideDescription: e.target.value })}
                    rows={4}
                    className="text-lg border-2 focus:border-pink-500 transition-all duration-300 resize-none"
                    placeholder="Mô tả tính cách và sở thích của cô dâu..."
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="groomDescription" className="text-lg font-medium flex items-center gap-2">
                    💼 Mô Tả Chú Rể
                  </Label>
                  <Textarea
                    id="groomDescription"
                    value={formData.groomDescription}
                    onChange={(e) => setFormData({ ...formData, groomDescription: e.target.value })}
                    rows={4}
                    className="text-lg border-2 focus:border-blue-500 transition-all duration-300 resize-none"
                    placeholder="Mô tả tính cách và sở thích của chú rể..."
                  />
                </div>
              </motion.div>

              {/* Our Story */}
              <motion.div 
                className="p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Label htmlFor="ourStory" className="text-lg font-medium flex items-center gap-2 mb-3">
                  📖 Câu Chuyện Của Chúng Tôi
                </Label>
                <Textarea
                  id="ourStory"
                  value={formData.ourStory}
                  onChange={(e) => setFormData({ ...formData, ourStory: e.target.value })}
                  rows={6}
                  className="text-lg border-2 focus:border-primary transition-all duration-300 resize-none"
                  data-testid="input-our-story"
                  placeholder="Chia sẻ câu chuyện tình yêu đặc biệt của bạn..."
                />
              </motion.div>

              {/* Image Uploads */}
              <motion.div 
                className="space-y-6 p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="text-primary" size={24} />
                  Hình Ảnh
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bride Photo */}
                  <div className="space-y-3">
                    <Label className="text-lg font-medium flex items-center gap-2">
                      👰 Ảnh Cô Dâu
                    </Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={formData.bridePhoto}
                          onChange={(e) => setFormData({ ...formData, bridePhoto: e.target.value })}
                          placeholder="URL hình ảnh hoặc tải lên từ thiết bị"
                          className="h-12 text-lg border-2 focus:border-pink-500 transition-all duration-300"
                          data-testid="input-bride-photo"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12"
                          onClick={() => triggerFileInput('bridePhoto')}
                          disabled={uploading === 'bridePhoto'}
                        >
                          {uploading === 'bridePhoto' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⏳
                            </motion.div>
                          ) : (
                            <Upload size={20} />
                          )}
                        </Button>
                      </div>
                      {formData.bridePhoto && (
                        <div className="relative group">
                          <img 
                            src={formData.bridePhoto} 
                            alt="Bride preview" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-pink-200"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage('bridePhoto')}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Groom Photo */}
                  <div className="space-y-3">
                    <Label className="text-lg font-medium flex items-center gap-2">
                      🤵 Ảnh Chú Rể
                    </Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={formData.groomPhoto}
                          onChange={(e) => setFormData({ ...formData, groomPhoto: e.target.value })}
                          placeholder="URL hình ảnh hoặc tải lên từ thiết bị"
                          className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-300"
                          data-testid="input-groom-photo"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12"
                          onClick={() => triggerFileInput('groomPhoto')}
                          disabled={uploading === 'groomPhoto'}
                        >
                          {uploading === 'groomPhoto' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⏳
                            </motion.div>
                          ) : (
                            <Upload size={20} />
                          )}
                        </Button>
                      </div>
                      {formData.groomPhoto && (
                        <div className="relative group">
                          <img 
                            src={formData.groomPhoto} 
                            alt="Groom preview" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage('groomPhoto')}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="space-y-3">
                  <Label className="text-lg font-medium flex items-center gap-2">
                    🏞️ Hình Nền Trang Chủ
                  </Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={formData.heroImage}
                        onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                        placeholder="URL hình ảnh nền hoặc tải lên từ thiết bị"
                        className="h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                        data-testid="input-hero-image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => triggerFileInput('heroImage')}
                        disabled={uploading === 'heroImage'}
                      >
                        {uploading === 'heroImage' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            ⏳
                          </motion.div>
                        ) : (
                          <Image size={20} />
                        )}
                      </Button>
                    </div>
                    {formData.heroImage && (
                      <div className="relative group">
                        <img 
                          src={formData.heroImage} 
                          alt="Hero preview" 
                          className="w-full h-48 object-cover rounded-lg border-2 border-primary/20"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage('heroImage')}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Preview Section */}
              <motion.div 
                className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/20"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  👁️ Xem Trước
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><strong>Cô dâu:</strong> {formData.brideName}</p>
                    <p><strong>Chú rể:</strong> {formData.groomName}</p>
                    <p><strong>Ngày cưới:</strong> {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('vi-VN') : 'Chưa chọn'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {formData.ourStory.length > 100 
                        ? formData.ourStory.substring(0, 100) + '...' 
                        : formData.ourStory || 'Chưa có câu chuyện...'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto min-w-48 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  data-testid="button-save-couple"
                  disabled={updateMutation.isPending}
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-2 relative z-10">
                    {updateMutation.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.div>
                    ) : (
                      <>
                        <Save size={20} />
                        Lưu Thay Đổi
                      </>
                    )}
                  </div>
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}