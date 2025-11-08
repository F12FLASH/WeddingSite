import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Save, ExternalLink, Calendar, MessageCircle, Upload, X, Play, Clock, Users, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminLivestream() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("settings");

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
        title: "✅ Đã lưu cài đặt livestream",
        description: "Thông tin livestream đã được cập nhật thành công",
        className: "bg-green-50 border-green-200 text-green-800"
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
        description: "Vui lòng chọn file hình ảnh (JPG, PNG, WebP)",
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
        className: "bg-green-50 border-green-200 text-green-800"
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return '▶️';
      case 'facebook': return '📘';
      case 'zoom': return '📹';
      default: return '🔗';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'text-red-500 bg-red-50 border-red-200';
      case 'facebook': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'zoom': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const isStreamActive = formData.isActive && formData.streamUrl;
  const hasSchedule = formData.startTime || formData.endTime;

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex flex-col items-center justify-center h-screen space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="text-muted-foreground">Đang tải cài đặt livestream...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div data-testid="page-admin-livestream" className="space-y-6 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Video size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                  Quản Lý Livestream
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Cài đặt trực tiếp đám cưới cho khách mời xem online
                </p>
              </div>
            </div>
            
            <Badge variant={isStreamActive ? "default" : "secondary"} className="px-3 py-1 text-sm">
              {isStreamActive ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Đang hoạt động
                </div>
              ) : (
                "Chưa kích hoạt"
              )}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Trạng Thái</p>
                    <p className="text-lg font-bold text-red-900 dark:text-red-100">
                      {formData.isActive ? 'Đang bật' : 'Đã tắt'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Nền Tảng</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100 capitalize">
                      {formData.platform || 'Chưa chọn'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Lịch Trình</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {hasSchedule ? 'Đã đặt' : 'Chưa đặt'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Tính Năng Chat</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {formData.chatEnabled ? 'Bật' : 'Tắt'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Cài Đặt Livestream
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!isStreamActive}>
              <Eye className="w-4 h-4" />
              Xem Trước
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-red-500/5 to-pink-500/10 border-b">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Video className="text-red-500" size={20} />
                  Cài Đặt Livestream
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Activation Switch */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-6 border-2 border-blue-100 rounded-xl bg-blue-50/50"
                  >
                    <div className="space-y-1">
                      <Label htmlFor="isActive" className="text-lg font-semibold flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        Kích Hoạt Livestream
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.isActive 
                          ? "Livestream đang được hiển thị trên website" 
                          : "Livestream đang bị ẩn khỏi website"}
                      </p>
                    </div>
                    <Switch
                      data-testid="switch-is-active"
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </motion.div>

                  {/* Platform and URL */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="platform" className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Nền Tảng Livestream
                      </Label>
                      <Select 
                        value={formData.platform} 
                        onValueChange={(value) => setFormData({ ...formData, platform: value })}
                      >
                        <SelectTrigger data-testid="select-platform" className="h-12 border-2 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube" className="flex items-center gap-2">
                            <span className="text-lg">▶️</span>
                            YouTube Live
                          </SelectItem>
                          <SelectItem value="facebook" className="flex items-center gap-2">
                            <span className="text-lg">📘</span>
                            Facebook Live
                          </SelectItem>
                          <SelectItem value="zoom" className="flex items-center gap-2">
                            <span className="text-lg">📹</span>
                            Zoom
                          </SelectItem>
                          <SelectItem value="custom" className="flex items-center gap-2">
                            <span className="text-lg">🔗</span>
                            Nền Tảng Khác
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Chọn nền tảng bạn sử dụng để livestream
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="streamUrl" className="text-sm font-medium flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-green-500" />
                        Link Xem Trực Tiếp *
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          data-testid="input-stream-url"
                          id="streamUrl"
                          type="url"
                          placeholder="https://youtube.com/watch?v=... hoặc https://facebook.com/..."
                          value={formData.streamUrl}
                          onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                          className="h-12 border-2 focus:border-green-500"
                          required
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="button-test-link"
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => window.open(formData.streamUrl, '_blank')}
                              disabled={!formData.streamUrl}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mở link trong tab mới</TooltipContent>
                        </Tooltip>
                      </div>
                    </motion.div>
                  </div>

                  {/* Stream Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <Label htmlFor="streamTitle" className="text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        Tiêu Đề Livestream
                      </Label>
                      <Input
                        data-testid="input-stream-title"
                        id="streamTitle"
                        placeholder="Trực Tiếp Đám Cưới Tình Yêu Vĩnh Cửu - John & Sarah"
                        value={formData.streamTitle}
                        onChange={(e) => setFormData({ ...formData, streamTitle: e.target.value })}
                        className="h-12 border-2 focus:border-purple-500 text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="streamDescription" className="text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">📄</span>
                        Mô Tả Livestream
                      </Label>
                      <Textarea
                        data-testid="textarea-stream-description"
                        id="streamDescription"
                        placeholder="Chào mừng các bạn đến với buổi livestream đám cưới của chúng tôi! Hãy cùng chia sẻ những khoảnh khắc hạnh phúc này..."
                        value={formData.streamDescription}
                        onChange={(e) => setFormData({ ...formData, streamDescription: e.target.value })}
                        rows={4}
                        className="border-2 focus:border-purple-500 resize-none"
                      />
                    </div>
                  </motion.div>

                  {/* Schedule */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      Lịch Trình Livestream
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-xs font-medium">
                          Thời Gian Bắt Đầu
                        </Label>
                        <Input
                          data-testid="input-start-time"
                          id="startTime"
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          className="h-12 border-2 focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-xs font-medium">
                          Thời Gian Kết Thúc
                        </Label>
                        <Input
                          data-testid="input-end-time"
                          id="endTime"
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          className="h-12 border-2 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    
                    {/* Schedule Summary */}
                    <AnimatePresence>
                      {(formData.startTime || formData.endTime) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border border-orange-200"
                        >
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-orange-700">
                            <Clock className="w-4 h-4" />
                            Tóm Tắt Lịch Trình
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Bắt đầu:</span>
                              <p className="text-foreground">
                                {formData.startTime 
                                  ? new Date(formData.startTime).toLocaleString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Chưa đặt'}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Kết thúc:</span>
                              <p className="text-foreground">
                                {formData.endTime 
                                  ? new Date(formData.endTime).toLocaleString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Chưa đặt'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Thumbnail */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">🖼️</span>
                      Ảnh Thumbnail Livestream
                    </Label>
                    
                    <div className="space-y-4">
                      {/* Current Thumbnail Preview */}
                      <AnimatePresence>
                        {formData.thumbnailUrl && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <div className="relative w-full max-w-md rounded-xl overflow-hidden border-2 border-border shadow-lg">
                              <img
                                src={formData.thumbnailUrl}
                                alt="Thumbnail preview"
                                className="w-full h-48 object-cover"
                                data-testid="img-thumbnail-preview"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => window.open(formData.thumbnailUrl, '_blank')}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem Ảnh Gốc
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Upload Controls */}
                      <div className="flex gap-3 items-start">
                        <Input
                          data-testid="input-thumbnail-url"
                          type="url"
                          placeholder={coupleInfo?.heroImage || "https://example.com/thumbnail.jpg"}
                          value={formData.thumbnailUrl}
                          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                          className="flex-1 h-12 border-2 focus:border-blue-500"
                        />
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 border-2 border-dashed border-blue-300 hover:border-blue-500"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            data-testid="button-upload-thumbnail"
                          >
                            {uploading ? (
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Upload className="w-4 h-4" />
                                </motion.div>
                                {uploadProgress}%
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Tải Ảnh
                              </div>
                            )}
                          </Button>

                          {formData.thumbnailUrl && formData.thumbnailUrl !== coupleInfo?.heroImage && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-12 w-12 border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={() => setFormData({ ...formData, thumbnailUrl: coupleInfo?.heroImage || "" })}
                                  data-testid="button-reset-thumbnail"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Đặt lại về ảnh mặc định</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {uploading && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            Đang tải lên... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {coupleInfo?.heroImage 
                        ? "Mặc định sử dụng ảnh background đám cưới. Bạn có thể tải ảnh mới hoặc nhập URL."
                        : "Tải lên ảnh thumbnail cho livestream (tối đa 5MB, tỷ lệ 16:9 khuyến nghị)"
                      }
                    </p>
                  </motion.div>

                  {/* Chat Settings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-between p-6 border-2 border-purple-100 rounded-xl bg-purple-50/50"
                  >
                    <div className="space-y-1">
                      <Label htmlFor="chatEnabled" className="text-lg font-semibold flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-purple-500" />
                        Cho Phép Chat
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.chatEnabled 
                          ? "Khách mời có thể chat trong livestream" 
                          : "Tính năng chat đã bị tắt"}
                      </p>
                    </div>
                    <Switch
                      data-testid="switch-chat-enabled"
                      id="chatEnabled"
                      checked={formData.chatEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </motion.div>

                  {/* Save Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-4 pt-6 border-t"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-8"
                      onClick={() => window.open('/#livestream', '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem Trang Chủ
                    </Button>
                    
                    <Button
                      data-testid="button-save"
                      type="submit"
                      className="h-12 px-8 flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Save size={18} />
                          </motion.div>
                          Đang lưu...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save size={18} />
                          Lưu
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <AnimatePresence>
              {isStreamActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-500/5 to-emerald-500/10 border-b">
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <Eye className="text-green-500" size={20} />
                        Xem Trước Livestream
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* Stream Preview */}
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-lg relative group">
                        {formData.thumbnailUrl ? (
                          <>
                            <img
                              src={formData.thumbnailUrl}
                              alt="Livestream preview"
                              className="w-full h-full object-cover"
                              data-testid="img-livestream-preview"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center text-white space-y-4">
                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                  <Play className="w-10 h-10 text-white ml-1" />
                                </div>
                                <div>
                                  <p className="text-2xl font-bold mb-2">
                                    SẮP DIỄN RA TRỰC TIẾP
                                  </p>
                                  <p className="text-lg opacity-90">
                                    {formData.streamTitle || "Trực Tiếp Đám Cưới"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center space-y-4">
                              <Video className="w-16 h-16 mx-auto text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground font-semibold">
                                  Chưa có ảnh thumbnail
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Thêm ảnh thumbnail để xem trước đẹp hơn
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stream Info */}
                      <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="font-bold text-xl text-foreground">
                                {formData.streamTitle || "Trực Tiếp Đám Cưới"}
                              </h3>
                              {formData.streamDescription && (
                                <p className="text-muted-foreground mt-2 leading-relaxed">
                                  {formData.streamDescription}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getPlatformColor(formData.platform)}>
                                  {getPlatformIcon(formData.platform)} {formData.platform.toUpperCase()}
                                </Badge>
                              </div>
                              {formData.chatEnabled && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Chat được bật
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Schedule Info */}
                        {(formData.startTime || formData.endTime) && (
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
                            {formData.startTime && (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">Bắt đầu</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(formData.startTime).toLocaleString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                            )}
                            {formData.endTime && (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">Kết thúc</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(formData.endTime).toLocaleString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          data-testid="button-view-on-site"
                          variant="outline"
                          onClick={() => window.open('/', '_blank')}
                          className="flex-1 h-12 gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                          Xem Trên Trang Chủ
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => window.open(formData.streamUrl, '_blank')}
                          className="flex-1 h-12 gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Mở Livestream
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}