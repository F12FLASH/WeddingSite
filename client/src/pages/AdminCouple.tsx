import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Image, User, Calendar, Heart, Camera, X, Sparkles, Crown, Diamond } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { CoupleInfo, InsertCoupleInfo } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

// Constants
const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: 'image/*'
} as const;

const FIELD_LABELS = {
  bridePhoto: "cô dâu",
  groomPhoto: "chú rể", 
  heroImage: "hình nền"
} as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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
  hidden: { opacity: 0, scale: 0.95 },
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
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring", 
      stiffness: 400,
      damping: 25
    }
  }
};

// Types
type FormField = keyof typeof FIELD_LABELS;
type FormData = {
  brideName: string;
  groomName: string;
  brideDescription: string;
  groomDescription: string;
  weddingDate: string;
  ourStory: string;
  bridePhoto: string;
  groomPhoto: string;
  heroImage: string;
};

export default function AdminCouple() {
  const { toast } = useToast();
  
  // Data fetching
  const { data: coupleInfo, isLoading: isLoadingData } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });

  // State management
  const [formData, setFormData] = useState<FormData>({
    brideName: "",
    groomName: "",
    brideDescription: "",
    groomDescription: "",
    weddingDate: "",
    ourStory: "",
    bridePhoto: "",
    groomPhoto: "",
    heroImage: "",
  });

  const [uploading, setUploading] = useState<FormField | null>(null);
  
  // Refs
  const fileInputRefs = {
    bridePhoto: useRef<HTMLInputElement>(null),
    groomPhoto: useRef<HTMLInputElement>(null),
    heroImage: useRef<HTMLInputElement>(null),
  };

  // Effects
  useEffect(() => {
    if (coupleInfo) {
      setFormData({
        brideName: coupleInfo.brideName || "",
        groomName: coupleInfo.groomName || "",
        brideDescription: coupleInfo.brideDescription || "",
        groomDescription: coupleInfo.groomDescription || "",
        weddingDate: coupleInfo.weddingDate ? new Date(coupleInfo.weddingDate).toISOString().split('T')[0] : "",
        ourStory: coupleInfo.ourStory || "",
        bridePhoto: coupleInfo.bridePhoto || "",
        groomPhoto: coupleInfo.groomPhoto || "",
        heroImage: coupleInfo.heroImage || "",
      });
    }
  }, [coupleInfo]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: async (data: InsertCoupleInfo) => {
      return await apiRequest("POST", "/api/couple", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/couple"] });
      showSuccessToast("🎉 Thành công!", "Thông tin cặp đôi đã được cập nhật");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      showErrorToast("❌ Lỗi", "Không thể cập nhật thông tin cặp đôi");
    },
  });

  // Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: InsertCoupleInfo = {
      brideName: formData.brideName,
      groomName: formData.groomName,
      brideDescription: formData.brideDescription || null,
      groomDescription: formData.groomDescription || null,
      weddingDate: new Date(formData.weddingDate),
      ourStory: formData.ourStory,
      bridePhoto: formData.bridePhoto || null,
      groomPhoto: formData.groomPhoto || null,
      heroImage: formData.heroImage || null,
    };
    
    updateMutation.mutate(submitData);
  };

  const handleFileSelect = async (field: FormField, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setUploading(field);

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, [field]: imageUrl }));
      showSuccessToast("✨ Thành công!", `Đã tải lên ảnh ${FIELD_LABELS[field]} thành công`);
    } catch (error) {
      showErrorToast("❌ Lỗi", `Không thể tải lên ảnh ${FIELD_LABELS[field]}`);
    } finally {
      setUploading(null);
      event.target.value = '';
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      showErrorToast("❌ Lỗi", "Vui lòng chọn file hình ảnh");
      return false;
    }

    if (file.size > IMAGE_UPLOAD_CONFIG.maxSize) {
      showErrorToast("❌ Lỗi", "Kích thước file không được vượt quá 5MB");
      return false;
    }

    return true;
  };

  const handleRemoveImage = (field: FormField) => {
    setFormData(prev => ({ ...prev, [field]: "" }));
  };

  const triggerFileInput = (field: FormField) => {
    fileInputRefs[field].current?.click();
  };

  // Helper functions
  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const getPreviewText = (text: string, maxLength: number = 120): string => {
    if (!text) return 'Chưa có câu chuyện tình yêu...';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Render helpers
  const renderHiddenFileInput = (field: FormField) => (
    <input
      type="file"
      ref={fileInputRefs[field]}
      onChange={(e) => handleFileSelect(field, e)}
      accept={IMAGE_UPLOAD_CONFIG.acceptedTypes}
      className="hidden"
    />
  );

  const renderUploadButton = (field: FormField, icon: React.ReactNode) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-12 w-12 rounded-xl border-2 transition-all duration-300"
      onClick={() => triggerFileInput(field)}
      disabled={uploading === field}
    >
      <AnimatePresence mode="wait">
        {uploading === field ? (
          <motion.div
            key="loading"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.div>
        ) : (
          <motion.div key="upload" whileHover={{ scale: 1.1 }}>
            {icon}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );

  const renderImagePreview = (field: FormField, alt: string, borderColor: string) => (
    <AnimatePresence>
      {formData[field] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative group"
        >
          <img 
            src={formData[field]} 
            alt={alt} 
            className={`w-40 h-40 object-cover rounded-2xl border-4 shadow-lg ${borderColor}`}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            onClick={() => handleRemoveImage(field)}
          >
            <X size={16} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 p-8 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        
        <motion.div variants={itemVariants} className="relative z-10">
          <div className="flex items-center gap-6">
            <motion.div 
              className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Diamond size={40} className="text-white" />
            </motion.div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-2xl">
                Thông Tin Cặp Đôi
              </h1>
              <p className="text-xl text-white/90 drop-shadow-lg font-light">
                Quản lý thông tin chi tiết về cô dâu chú rể và câu chuyện tình yêu
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Form */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Card className="border-2 border-rose-500/20 shadow-2xl overflow-hidden bg-gradient-to-br from-white/80 to-rose-50/30 dark:from-gray-900/80 dark:to-rose-950/20">
          <CardHeader className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-b border-rose-500/20 p-8">
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-lg">
                <Heart className="text-white" size={32} fill="currentColor" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Chỉnh Sửa Thông Tin Cặp Đôi
                </CardTitle>
                <p className="text-lg text-muted-foreground mt-2 font-medium">
                  Cập nhật thông tin chi tiết về cô dâu và chú rể
                </p>
              </div>
            </motion.div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Hidden file inputs */}
            {renderHiddenFileInput('bridePhoto')}
            {renderHiddenFileInput('groomPhoto')}
            {renderHiddenFileInput('heroImage')}

            <motion.form onSubmit={handleSubmit} className="space-y-8" variants={containerVariants}>
              
              {/* Names Section */}
              <FormSection title={null} className="grid md:grid-cols-2 gap-8">
                <FormField
                  label="Tên Cô Dâu"
                  icon={<User className="text-pink-600" size={24} />}
                  iconBg="from-pink-500/20 to-rose-500/20"
                  iconBorder="border-pink-500/30"
                  htmlFor="brideName"
                  className="text-pink-700 dark:text-pink-300"
                >
                  <Input
                    id="brideName"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    className="h-14 text-lg border-2 border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 rounded-xl"
                    data-testid="input-bride-name"
                    placeholder="Nhập tên cô dâu..."
                  />
                </FormField>

                <FormField
                  label="Tên Chú Rể"
                  icon={<User className="text-blue-600" size={24} />}
                  iconBg="from-blue-500/20 to-cyan-500/20"
                  iconBorder="border-blue-500/30"
                  htmlFor="groomName"
                  className="text-blue-700 dark:text-blue-300"
                >
                  <Input
                    id="groomName"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    className="h-14 text-lg border-2 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                    data-testid="input-groom-name"
                    placeholder="Nhập tên chú rể..."
                  />
                </FormField>
              </FormSection>

              {/* Descriptions Section */}
              <FormSection title={null} className="grid md:grid-cols-2 gap-8">
                <FormField
                  label="Giới Thiệu Cô Dâu"
                  icon={<Sparkles className="text-pink-600" size={24} />}
                  iconBg="from-pink-500/20 to-rose-500/20"
                  iconBorder="border-pink-500/30"
                  htmlFor="brideDescription"
                  className="text-pink-700 dark:text-pink-300"
                >
                  <Textarea
                    id="brideDescription"
                    value={formData.brideDescription}
                    onChange={(e) => setFormData({ ...formData, brideDescription: e.target.value })}
                    rows={5}
                    className="text-lg border-2 border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 rounded-xl resize-none"
                    data-testid="input-bride-description"
                    placeholder="Mô tả tính cách, sở thích, và những điều đặc biệt về cô dâu..."
                  />
                </FormField>

                <FormField
                  label="Giới Thiệu Chú Rể"
                  icon={<Crown className="text-blue-600" size={24} />}
                  iconBg="from-blue-500/20 to-cyan-500/20"
                  iconBorder="border-blue-500/30"
                  htmlFor="groomDescription"
                  className="text-blue-700 dark:text-blue-300"
                >
                  <Textarea
                    id="groomDescription"
                    value={formData.groomDescription}
                    onChange={(e) => setFormData({ ...formData, groomDescription: e.target.value })}
                    rows={5}
                    className="text-lg border-2 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl resize-none"
                    data-testid="input-groom-description"
                    placeholder="Mô tả tính cách, sở thích, và những điều đặc biệt về chú rể..."
                  />
                </FormField>
              </FormSection>

              {/* Wedding Date */}
              <FormSection title={null}>
                <FormField
                  label="Ngày Cưới"
                  icon={<Calendar className="text-rose-600" size={24} />}
                  iconBg="from-rose-500/20 to-pink-500/20"
                  iconBorder="border-rose-500/30"
                  htmlFor="weddingDate"
                  className="text-rose-700 dark:text-rose-300"
                >
                  <Input
                    id="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="h-14 text-lg border-2 border-rose-500/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all duration-300 rounded-xl"
                    data-testid="input-wedding-date"
                  />
                </FormField>
              </FormSection>

              {/* Our Story */}
              <FormSection title={null}>
                <FormField
                  label="Câu Chuyện Tình Yêu"
                  icon={<Heart className="text-rose-600" size={24} fill="currentColor" />}
                  iconBg="from-rose-500/20 to-pink-500/20"
                  iconBorder="border-rose-500/30"
                  htmlFor="ourStory"
                  className="text-rose-700 dark:text-rose-300"
                >
                  <Textarea
                    id="ourStory"
                    value={formData.ourStory}
                    onChange={(e) => setFormData({ ...formData, ourStory: e.target.value })}
                    rows={8}
                    className="text-lg border-2 border-rose-500/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all duration-300 rounded-xl resize-none leading-relaxed"
                    data-testid="input-our-story"
                    placeholder="Chia sẻ câu chuyện tình yêu đặc biệt của bạn... từ lần đầu gặp gỡ, những kỷ niệm đáng nhớ, đến quyết định kết hôn..."
                  />
                </FormField>
              </FormSection>

              {/* Image Uploads Section */}
              <FormSection 
                title="Quản Lý Hình Ảnh"
                icon={<Camera className="text-rose-600" size={28} />}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Bride Photo */}
                  <ImageUploadField
                    label="👰 Ảnh Cô Dâu"
                    field="bridePhoto"
                    value={formData.bridePhoto}
                    onChange={(value) => setFormData(prev => ({ ...prev, bridePhoto: value }))}
                    onUpload={() => triggerFileInput('bridePhoto')}
                    uploading={uploading === 'bridePhoto'}
                    uploadIcon={<Upload size={20} className="text-pink-600" />}
                    borderColor="border-pink-500/30"
                    inputTestId="input-bride-photo"
                  >
                    {renderImagePreview('bridePhoto', 'Bride preview', 'border-pink-500/30')}
                  </ImageUploadField>

                  {/* Groom Photo */}
                  <ImageUploadField
                    label="🤵 Ảnh Chú Rể"
                    field="groomPhoto"
                    value={formData.groomPhoto}
                    onChange={(value) => setFormData(prev => ({ ...prev, groomPhoto: value }))}
                    onUpload={() => triggerFileInput('groomPhoto')}
                    uploading={uploading === 'groomPhoto'}
                    uploadIcon={<Upload size={20} className="text-blue-600" />}
                    borderColor="border-blue-500/30"
                    inputTestId="input-groom-photo"
                  >
                    {renderImagePreview('groomPhoto', 'Groom preview', 'border-blue-500/30')}
                  </ImageUploadField>
                </div>

                {/* Hero Image */}
                <ImageUploadField
                  label="🏞️ Hình Nền Trang Chủ"
                  field="heroImage"
                  value={formData.heroImage}
                  onChange={(value) => setFormData(prev => ({ ...prev, heroImage: value }))}
                  onUpload={() => triggerFileInput('heroImage')}
                  uploading={uploading === 'heroImage'}
                  uploadIcon={<Image size={20} className="text-rose-600" />}
                  borderColor="border-rose-500/30"
                  inputTestId="input-hero-image"
                  isHero
                >
                  {formData.heroImage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group"
                    >
                      <img 
                        src={formData.heroImage} 
                        alt="Hero preview" 
                        className="w-full h-48 object-cover bg-muted rounded-2xl border-4 border-rose-500/30 shadow-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                        onClick={() => handleRemoveImage('heroImage')}
                      >
                        <X size={16} />
                      </Button>
                    </motion.div>
                  )}
                </ImageUploadField>
              </FormSection>

              {/* Preview Section */}
              <FormSection 
                title="Xem Trước Thông Tin"
                icon={<Sparkles className="text-rose-600" size={28} />}
                className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-2 border-dashed border-rose-500/30"
              >
                <div className="grid md:grid-cols-2 gap-6 text-base">
                  <div className="space-y-3 bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl border border-rose-500/20">
                    <p><strong className="text-pink-600">👰 Cô dâu:</strong> {formData.brideName || <span className="text-muted-foreground">Chưa nhập</span>}</p>
                    <p><strong className="text-blue-600">🤵 Chú rể:</strong> {formData.groomName || <span className="text-muted-foreground">Chưa nhập</span>}</p>
                    <p><strong className="text-rose-600">📅 Ngày cưới:</strong> {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('vi-VN') : <span className="text-muted-foreground">Chưa chọn</span>}</p>
                  </div>
                  <div className="space-y-2 bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl border border-rose-500/20">
                    <p className="text-muted-foreground font-medium">
                      {getPreviewText(formData.ourStory)}
                    </p>
                  </div>
                </div>
              </FormSection>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="flex justify-center">
                <SubmitButton 
                  isLoading={updateMutation.isPending}
                  disabled={updateMutation.isPending}
                />
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Sub-components for better organization
interface FormSectionProps {
  title: string | null;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const FormSection = ({ title, icon, children, className = "" }: FormSectionProps) => (
  <motion.div 
    className={`p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border-2 border-rose-500/20 shadow-lg ${className}`}
    variants={cardVariants}
    whileHover="hover"
  >
    {title && (
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-rose-700 dark:text-rose-300">
        <div className="p-2.5 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-xl border border-rose-500/30">
          {icon}
        </div>
        {title}
      </h3>
    )}
    {children}
  </motion.div>
);

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}

const FormField = ({ label, icon, iconBg, iconBorder, htmlFor, className = "", children }: FormFieldProps) => (
  <div className="space-y-4">
    <Label htmlFor={htmlFor} className={`text-xl font-bold flex items-center gap-3 ${className}`}>
      <div className={`p-2.5 bg-gradient-to-br ${iconBg} rounded-xl border ${iconBorder}`}>
        {icon}
      </div>
      {label}
    </Label>
    {children}
  </div>
);

interface ImageUploadFieldProps {
  label: string;
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  onUpload: () => void;
  uploading: boolean;
  uploadIcon: React.ReactNode;
  borderColor: string;
  inputTestId: string;
  isHero?: boolean;
  children?: React.ReactNode;
}

const ImageUploadField = ({ 
  label, 
  field, 
  value, 
  onChange, 
  onUpload, 
  uploading, 
  uploadIcon, 
  borderColor, 
  inputTestId,
  isHero = false,
  children 
}: ImageUploadFieldProps) => (
  <div className="space-y-4">
    <Label className="text-lg font-bold flex items-center gap-2">
      {label}
    </Label>
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`URL hình ảnh hoặc tải lên từ thiết bị`}
          className={`h-12 text-lg border-2 focus:border-rose-500 transition-all duration-300 rounded-xl ${borderColor}`}
          data-testid={inputTestId}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`h-12 w-12 rounded-xl border-2 hover:border-rose-500 hover:bg-rose-500/10 transition-all duration-300 ${borderColor}`}
          onClick={onUpload}
          disabled={uploading}
        >
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div
                key="loading"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.div>
            ) : (
              <motion.div key="upload" whileHover={{ scale: 1.1 }}>
                {uploadIcon}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
      {children}
    </div>
  </div>
);

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

const SubmitButton = ({ isLoading, disabled }: SubmitButtonProps) => (
  <Button 
    type="submit" 
    className="min-w-64 h-16 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 border-0"
    data-testid="button-save-couple"
    disabled={disabled}
  >
    {/* Shine Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    
    <div className="flex items-center gap-3 relative z-10">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-white"
          >
            ⏳
          </motion.div>
        ) : (
          <motion.div
            key="save"
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2"
          >
            <Save size={24} />
            Lưu Thông Tin
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </Button>
);