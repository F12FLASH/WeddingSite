import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Save, Upload, CloudUpload, Image as ImageIcon, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Settings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { uploadImageToCloudinary } from "@/lib/imageUpload";
import { Progress } from "@/components/ui/progress";

export default function AdminRegistry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingBrideQR, setUploadingBrideQR] = useState(false);
  const [uploadingGroomQR, setUploadingGroomQR] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const brideQRInputRef = useRef<HTMLInputElement>(null);
  const groomQRInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const [brideBankInfo, setBrideBankInfo] = useState("");
  const [groomBankInfo, setGroomBankInfo] = useState("");
  const [brideQrCodeUrl, setBrideQrCodeUrl] = useState("");
  const [groomQrCodeUrl, setGroomQrCodeUrl] = useState("");

  // Update state when settings are loaded
  useEffect(() => {
    if (settings) {
      setBrideBankInfo(settings.brideBankInfo || "");
      setGroomBankInfo(settings.groomBankInfo || "");
      setBrideQrCodeUrl(settings.brideQrCodeUrl || "");
      setGroomQrCodeUrl(settings.groomQrCodeUrl || "");
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      return await apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ 
        title: "✅ Cập nhật thành công",
        description: "Thông tin chuyển khoản đã được lưu"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể lưu thông tin",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (
    file: File | null, 
    type: 'bride' | 'groom'
  ) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file hình ảnh (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "❌ Lỗi",
        description: "Kích thước file không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }

    if (type === 'bride') {
      setUploadingBrideQR(true);
    } else {
      setUploadingGroomQR(true);
    }
    setUploadProgress(0);

    try {
      const imageUrl = await uploadImageToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      if (type === 'bride') {
        setBrideQrCodeUrl(imageUrl);
      } else {
        setGroomQrCodeUrl(imageUrl);
      }

      toast({
        title: "✅ Tải lên thành công!",
        description: `Mã QR ${type === 'bride' ? 'Cô dâu' : 'Chú rể'} đã được tải lên`,
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tải lên ảnh",
        variant: "destructive",
      });
    } finally {
      if (type === 'bride') {
        setUploadingBrideQR(false);
      } else {
        setUploadingGroomQR(false);
      }
      setUploadProgress(0);
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      brideBankInfo,
      groomBankInfo,
      brideQrCodeUrl,
      groomQrCodeUrl,
    });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={brideQRInputRef}
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'bride')}
        accept="image/*"
        className="hidden"
        data-testid="input-bride-qr-upload"
      />
      <input
        type="file"
        ref={groomQRInputRef}
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'groom')}
        accept="image/*"
        className="hidden"
        data-testid="input-groom-qr-upload"
      />

      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-registry">
              💳 Thông Tin Chuyển Khoản
            </h2>
            <p className="text-muted-foreground text-lg">
              Quản lý mã QR và thông tin tài khoản ngân hàng cho cô dâu và chú rể
            </p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="button-save-bank-info"
          >
            <Save size={18} className="mr-2" />
            {updateMutation.isPending ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </motion.div>

        {/* Bank Transfer Cards */}
        <motion.div className="grid md:grid-cols-2 gap-6" variants={containerVariants}>
          {/* Bride's Bank Transfer */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-pink-200 dark:border-pink-800 shadow-lg">
              <CardHeader className="bg-pink-50 dark:bg-pink-950/20 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400" data-testid="heading-bride-bank">
                  <QrCode size={24} />
                  Thông Tin Cô Dâu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* QR Code Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Mã QR Chuyển Khoản</label>
                  
                  {/* QR Code Preview */}
                  {brideQrCodeUrl && (
                    <div className="relative group">
                      <img
                        src={brideQrCodeUrl}
                        alt="Mã QR Cô Dâu"
                        className="w-full max-w-xs mx-auto rounded-lg border-2 border-pink-200 dark:border-pink-800 shadow-md"
                        data-testid="img-bride-qr"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setBrideQrCodeUrl("")}
                        data-testid="button-remove-bride-qr"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}

                  {/* Upload Buttons */}
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Hoặc dán URL ảnh QR"
                      value={brideQrCodeUrl}
                      onChange={(e) => setBrideQrCodeUrl(e.target.value)}
                      className="flex-1"
                      data-testid="input-bride-qr-url"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => brideQRInputRef.current?.click()}
                      disabled={uploadingBrideQR}
                      data-testid="button-upload-bride-qr"
                    >
                      {uploadingBrideQR ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.div>
                      ) : (
                        <CloudUpload size={18} />
                      )}
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {uploadingBrideQR && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        Đang tải lên... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Bank Information */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Thông Tin Tài Khoản</label>
                  <Textarea
                    placeholder="Ngân hàng: Vietcombank&#10;Số tài khoản: 1234567890&#10;Chủ tài khoản: Nguyễn Thị A&#10;Chi nhánh: TP.HCM"
                    value={brideBankInfo}
                    onChange={(e) => setBrideBankInfo(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                    data-testid="textarea-bride-bank-info"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập thông tin tài khoản ngân hàng của cô dâu (mỗi thông tin một dòng)
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Groom's Bank Transfer */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-blue-200 dark:border-blue-800 shadow-lg">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/20 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400" data-testid="heading-groom-bank">
                  <QrCode size={24} />
                  Thông Tin Chú Rể
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* QR Code Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Mã QR Chuyển Khoản</label>
                  
                  {/* QR Code Preview */}
                  {groomQrCodeUrl && (
                    <div className="relative group">
                      <img
                        src={groomQrCodeUrl}
                        alt="Mã QR Chú Rể"
                        className="w-full max-w-xs mx-auto rounded-lg border-2 border-blue-200 dark:border-blue-800 shadow-md"
                        data-testid="img-groom-qr"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setGroomQrCodeUrl("")}
                        data-testid="button-remove-groom-qr"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}

                  {/* Upload Buttons */}
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Hoặc dán URL ảnh QR"
                      value={groomQrCodeUrl}
                      onChange={(e) => setGroomQrCodeUrl(e.target.value)}
                      className="flex-1"
                      data-testid="input-groom-qr-url"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => groomQRInputRef.current?.click()}
                      disabled={uploadingGroomQR}
                      data-testid="button-upload-groom-qr"
                    >
                      {uploadingGroomQR ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.div>
                      ) : (
                        <CloudUpload size={18} />
                      )}
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {uploadingGroomQR && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        Đang tải lên... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Bank Information */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Thông Tin Tài Khoản</label>
                  <Textarea
                    placeholder="Ngân hàng: Vietcombank&#10;Số tài khoản: 0987654321&#10;Chủ tài khoản: Trần Văn B&#10;Chi nhánh: TP.HCM"
                    value={groomBankInfo}
                    onChange={(e) => setGroomBankInfo(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                    data-testid="textarea-groom-bank-info"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập thông tin tài khoản ngân hàng của chú rể (mỗi thông tin một dòng)
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Info Card */}
        <motion.div className="mt-6" variants={itemVariants}>
          <Card className="bg-muted/50 border-dashed rounded-2xl">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="text-primary">
                  <ImageIcon size={24} />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-foreground">Hướng dẫn sử dụng</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Tải lên ảnh mã QR hoặc dán URL ảnh QR của ngân hàng</li>
                    <li>Nhập đầy đủ thông tin tài khoản bao gồm: tên ngân hàng, số tài khoản, tên chủ tài khoản</li>
                    <li>Khách mời sẽ thấy mã QR và thông tin này trên trang chủ để chuyển khoản mừng cưới</li>
                    <li>Hỗ trợ định dạng ảnh: JPEG, PNG, WebP (tối đa 10MB)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
