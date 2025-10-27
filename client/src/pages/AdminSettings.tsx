import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Settings as SettingsIcon, Music, MapPin, Palette, Bell, Shield, Eye, Upload, Image, Trash2, Power, Heart, Instagram } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Settings, Popup } from "@shared/schema";
import { insertSettingsSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadImageToCloudinary } from "@/lib/imageUpload";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to extract embed URL from iframe HTML or convert regular Google Maps URLs
const convertToGoogleMapsEmbed = (input: string): string => {
  if (!input) return input;
  
  // Check if input is an iframe HTML tag
  if (input.trim().startsWith('<iframe')) {
    // Extract the src attribute from the iframe
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  // If already an embed URL, return as is
  if (input.includes('/maps/embed')) {
    return input;
  }
  
  // For other Google Maps URLs, return as is
  return input;
};

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVenueImage, setUploadingVenueImage] = useState(false);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const venueImageInputRef = useRef<HTMLInputElement>(null);
  const songNameDebounceRef = useRef<Record<number, NodeJS.Timeout>>({});

  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const { data: popups = [] } = useQuery<Popup[]>({
    queryKey: ["/api/popups"],
  });

  const form = useForm({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: {
      venueName: "",
      venueAddress: "",
      venueMapLink: "",
      venueImage: "",
      venuePhone: "",
      venueEmail: "",
      eventStartTime: undefined as Date | undefined,
      eventEndTime: undefined as Date | undefined,
      backgroundMusicUrl: "",
      backgroundMusicType: "upload",
      backgroundMusicUrls: [] as string[],
      backgroundMusicNames: [] as string[],
      footerText: "",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      hashtag: "",
      fontHeading: "",
      fontBody: "",
      fontCursive: "",
    },
  });

  const toLocalDatetimeString = (date: Date | string | null | undefined): string | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (settings) {
      form.reset({
        venueName: settings.venueName || "",
        venueAddress: settings.venueAddress || "",
        venueMapLink: settings.venueMapLink || "",
        venueImage: settings.venueImage || "",
        venuePhone: settings.venuePhone || "",
        venueEmail: settings.venueEmail || "",
        eventStartTime: toLocalDatetimeString(settings.eventStartTime) as any,
        eventEndTime: toLocalDatetimeString(settings.eventEndTime) as any,
        backgroundMusicUrl: settings.backgroundMusicUrl || "",
        backgroundMusicType: settings.backgroundMusicType || "upload",
        backgroundMusicUrls: settings.backgroundMusicUrls || [],
        backgroundMusicNames: settings.backgroundMusicNames || [],
        footerText: settings.footerText || "",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
        twitterUrl: settings.twitterUrl || "",
        hashtag: settings.hashtag || "",
        fontHeading: settings.fontHeading || "",
        fontBody: settings.fontBody || "",
        fontCursive: settings.fontCursive || "",
      });
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof insertSettingsSchema._type) => {
      const processedData = {
        ...data,
        eventStartTime: data.eventStartTime ? new Date(data.eventStartTime) : undefined,
        eventEndTime: data.eventEndTime ? new Date(data.eventEndTime) : undefined,
      };
      return await apiRequest("POST", "/api/settings", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ 
        title: "✅ Cài đặt đã được lưu",
        description: "Thay đổi của bạn đã được cập nhật thành công"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể lưu cài đặt",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  const handleAudioFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file âm thanh (MP3, WAV, etc.)",
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

    setUploadingAudio(true);

    try {
      const audioUrl = await uploadImageToCloudinary(file);
      const currentUrls = form.getValues('backgroundMusicUrls') || [];
      const currentNames = form.getValues('backgroundMusicNames') || [];
      const newUrls = [...currentUrls, audioUrl];
      
      // Extract filename as default name
      const getSongName = (url: string) => {
        try {
          const urlParts = url.split('/');
          const filename = urlParts[urlParts.length - 1];
          const decodedName = decodeURIComponent(filename);
          const nameWithoutExt = decodedName.replace(/\.[^/.]+$/, '');
          return nameWithoutExt || `Bài hát ${newUrls.length}`;
        } catch {
          return `Bài hát ${newUrls.length}`;
        }
      };
      
      const newNames = [...currentNames, getSongName(audioUrl)];
      form.setValue('backgroundMusicUrls', newUrls);
      form.setValue('backgroundMusicNames', newNames);
      form.setValue('backgroundMusicType', 'upload');
      
      // Auto-save playlist to database
      const formData = form.getValues();
      await updateMutation.mutateAsync({
        ...formData,
        backgroundMusicUrls: newUrls,
      });
      
      toast({
        title: "✅ Thành công!",
        description: "Đã thêm bài hát vào playlist",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tải lên file nhạc",
        variant: "destructive",
      });
    } finally {
      setUploadingAudio(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveSong = async (index: number) => {
    const currentUrls = form.getValues('backgroundMusicUrls') || [];
    const currentNames = form.getValues('backgroundMusicNames') || [];
    const newUrls = currentUrls.filter((_, i) => i !== index);
    const newNames = currentNames.filter((_, i) => i !== index);
    form.setValue('backgroundMusicUrls', newUrls);
    form.setValue('backgroundMusicNames', newNames);
    
    // Auto-save playlist to database
    const formData = form.getValues();
    try {
      await updateMutation.mutateAsync({
        ...formData,
        backgroundMusicUrls: newUrls,
        backgroundMusicNames: newNames,
      });
      
      toast({
        title: "✅ Đã xóa",
        description: "Đã xóa bài hát khỏi playlist",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa bài hát",
        variant: "destructive",
      });
    }
  };
  
  const handleSongNameChange = (index: number, newName: string) => {
    const currentNames = form.getValues('backgroundMusicNames') || [];
    const newNames = [...currentNames];
    newNames[index] = newName;
    form.setValue('backgroundMusicNames', newNames);
    
    // Clear existing timeout for this song index
    if (songNameDebounceRef.current[index]) {
      clearTimeout(songNameDebounceRef.current[index]);
    }
    
    // Auto-save to database after user stops typing for 1 second
    songNameDebounceRef.current[index] = setTimeout(async () => {
      const formData = form.getValues();
      try {
        await updateMutation.mutateAsync({
          ...formData,
          backgroundMusicNames: newNames,
        });
        toast({
          title: "✅ Đã lưu",
          description: "Tên bài hát đã được cập nhật",
        });
      } catch (error) {
        console.error("Failed to save song name:", error);
        toast({
          title: "❌ Lỗi",
          description: "Không thể lưu tên bài hát",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleVenueImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file ảnh (JPG, PNG, etc.)",
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

    setUploadingVenueImage(true);

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      form.setValue('venueImage', imageUrl);
      
      toast({
        title: "✅ Thành công!",
        description: "Đã tải lên ảnh địa điểm thành công",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tải lên ảnh địa điểm",
        variant: "destructive",
      });
    } finally {
      setUploadingVenueImage(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const tabs = [
    { id: "general", label: "Địa Điểm", icon: SettingsIcon },
    { id: "fonts", label: "Font Chữ", icon: Palette },
    { id: "footer", label: "Chân Trang", icon: Heart },
    { id: "popups", label: "Popup Thiệp", icon: Image },
    { id: "features", label: "Âm thanh", icon: Music },
    { id: "security", label: "Bảo Mật", icon: Shield },
  ];

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="admin-page"
      >
        <div className="mb-8">
          <h2 className="admin-heading mb-2 text-foreground">⚙️ Cài Đặt Website</h2>
          <p className="text-muted-foreground">Cấu hình trang web đám cưới của bạn</p>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="admin-page"
    >
      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="admin-heading mb-2 text-foreground">⚙️ Cài Đặt Website</h2>
          <p className="text-muted-foreground text-lg">Tùy chỉnh và cấu hình trang web đám cưới của bạn</p>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="sticky top-6">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="lg:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Form {...form}>
            <form onSubmit={onSubmit}>
            <AnimatedTabContent activeTab={activeTab}>
              {activeTab === "general" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-blue-500" size={20} />
                        Thông Tin Địa Điểm
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Tên Địa Điểm *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Khách sạn Grand Ballroom"
                                className="h-12 text-lg"
                                data-testid="input-venue-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="venueAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Địa Chỉ Địa Điểm *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Đường Cưới, Quận 1, Thành phố Hồ Chí Minh"
                                className="h-12 text-lg"
                                data-testid="input-venue-address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="venueMapLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Link Google Maps (Nhúng iframe)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Dán toàn bộ iframe code hoặc chỉ link embed'
                                className="h-12"
                                data-testid="input-venue-map-link"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const processedValue = convertToGoogleMapsEmbed(e.target.value);
                                  field.onChange(processedValue);
                                }}
                                onBlur={field.onBlur}
                              />
                            </FormControl>
                            <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
                              <p className="font-medium text-foreground">📍 Cách nhúng Google Maps:</p>
                              <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>Vào <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Maps</a></li>
                                <li>Tìm kiếm địa điểm của bạn</li>
                                <li>Nhấn nút "Chia sẻ" (Share)</li>
                                <li>Chọn tab "Nhúng bản đồ" (Embed a map)</li>
                                <li><strong className="text-foreground">Nhấn "Sao chép HTML" và dán TOÀN BỘ đoạn code vào đây</strong></li>
                                <li className="text-xs text-green-600">✅ Hệ thống sẽ tự động trích xuất link embed từ iframe</li>
                              </ol>
                              <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                                <p className="text-xs font-medium text-foreground mb-1">Ví dụ: Bạn có thể dán:</p>
                                <code className="text-[10px] block bg-background p-1 rounded overflow-x-auto">
                                  {'<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450"></iframe>'}
                                </code>
                              </div>
                            </div>
                            
                            {/* Google Maps Preview */}
                            {field.value && field.value.includes('google.com/maps') && (
                              <div className="mt-4">
                                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <Eye size={16} className="text-green-500" />
                                  Xem Trước Bản Đồ
                                </p>
                                <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-border shadow-lg">
                                  <iframe
                                    src={field.value}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="venueImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">🖼️ Ảnh Địa Điểm</FormLabel>
                            <div className="space-y-3">
                              {field.value && (
                                <div className="relative w-full max-w-md">
                                  <img
                                    src={field.value}
                                    alt="Venue"
                                    className="w-full h-48 object-cover rounded-lg border-2 border-border"
                                  />
                                </div>
                              )}
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  ref={venueImageInputRef}
                                  onChange={handleVenueImageSelect}
                                  accept="image/*"
                                  className="hidden"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="h-12 flex-1"
                                  onClick={() => venueImageInputRef.current?.click()}
                                  disabled={uploadingVenueImage}
                                  data-testid="button-upload-venue-image"
                                >
                                  {uploadingVenueImage ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="mr-2"
                                    >
                                      <Upload size={18} />
                                    </motion.div>
                                  ) : (
                                    <Upload size={18} className="mr-2" />
                                  )}
                                  {uploadingVenueImage ? "Đang tải lên..." : "Tải Ảnh Lên"}
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Tải lên ảnh địa điểm để hiển thị tại trang chủ (tối đa 5MB)
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="venuePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">📞 Số Điện Thoại Liên Hệ</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="(84) 123-456-789"
                                  className="h-12"
                                  data-testid="input-venue-phone"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="venueEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">📧 Email Liên Hệ</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="contact@venue.com"
                                  className="h-12"
                                  data-testid="input-venue-email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="eventStartTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">⏰ Thời Gian Bắt Đầu</FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  className="h-12"
                                  data-testid="input-event-start-time"
                                  value={(typeof field.value === 'string' ? field.value : '') || ""}
                                  onChange={(e) => field.onChange(e.target.value || undefined)}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Thời gian bắt đầu sự kiện
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eventEndTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">⏱️ Thời Gian Kết Thúc</FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  className="h-12"
                                  data-testid="input-event-end-time"
                                  value={(typeof field.value === 'string' ? field.value : '') || ""}
                                  onChange={(e) => field.onChange(e.target.value || undefined)}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Thời gian dự kiến kết thúc sự kiện
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "fonts" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="text-purple-500" size={20} />
                        Tùy Chỉnh Font Chữ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Hướng Dẫn</h4>
                        <p className="text-sm text-blue-800">
                          Chọn font chữ phù hợp với tiếng Việt để hiển thị đẹp và rõ ràng trên trang web của bạn.
                          Tất cả các font đều hỗ trợ đầy đủ dấu tiếng Việt.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="fontHeading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">🎨 Font Tiêu Đề Chính</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger className="h-12" data-testid="select-font-heading">
                                  <SelectValue placeholder="Chọn font cho tiêu đề" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Parisienne">Parisienne (Cursive lãng mạn)</SelectItem>
                                <SelectItem value="Alex Brush">Alex Brush (Chữ viết tay)</SelectItem>
                                <SelectItem value="Great Vibes">Great Vibes (Thanh lịch)</SelectItem>
                                <SelectItem value="Allura">Allura (Sang trọng)</SelectItem>
                                <SelectItem value="Satisfy">Satisfy (Hiện đại)</SelectItem>
                                <SelectItem value="Playfair Display">Playfair Display (Cổ điển)</SelectItem>
                                <SelectItem value="Cormorant Garamond">Cormorant Garamond (Truyền thống)</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Font này sẽ được sử dụng cho các tiêu đề lớn trên trang
                            </p>
                            {field.value && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-1">Xem trước:</p>
                                <p style={{ fontFamily: field.value, fontSize: '24px' }}>
                                  Xuân Lâm & Ngân Lê
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fontBody"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">📝 Font Nội Dung</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger className="h-12" data-testid="select-font-body">
                                  <SelectValue placeholder="Chọn font cho nội dung" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Cormorant Garamond">Cormorant Garamond (Dễ đọc)</SelectItem>
                                <SelectItem value="Playfair Display">Playfair Display (Thanh lịch)</SelectItem>
                                <SelectItem value="Noto Serif">Noto Serif (Tiêu chuẩn)</SelectItem>
                                <SelectItem value="Georgia">Georgia (Cổ điển)</SelectItem>
                                <SelectItem value="Times New Roman">Times New Roman (Truyền thống)</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Font này sẽ được sử dụng cho phần nội dung và đoạn văn
                            </p>
                            {field.value && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-1">Xem trước:</p>
                                <p style={{ fontFamily: field.value, fontSize: '16px' }}>
                                  Chúng tôi rất vui mừng được chia sẻ niềm hạnh phúc này cùng bạn.
                                  Hãy đến và cùng chúng tôi tạo nên những kỷ niệm đẹp!
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fontCursive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">✨ Font Chữ Nghệ Thuật</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger className="h-12" data-testid="select-font-cursive">
                                  <SelectValue placeholder="Chọn font chữ nghệ thuật" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Parisienne">Parisienne (Lãng mạn)</SelectItem>
                                <SelectItem value="Alex Brush">Alex Brush (Viết tay)</SelectItem>
                                <SelectItem value="Great Vibes">Great Vibes (Tinh tế)</SelectItem>
                                <SelectItem value="Allura">Allura (Thanh lịch)</SelectItem>
                                <SelectItem value="Satisfy">Satisfy (Độc đáo)</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Font này sẽ được sử dụng cho tên cô dâu/chú rể và các phần nhấn mạnh
                            </p>
                            {field.value && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-1">Xem trước:</p>
                                <p style={{ fontFamily: field.value, fontSize: '32px', textAlign: 'center' }}>
                                  Xuân Lâm & Ngân Lê
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "footer" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-pink-500/5 to-pink-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="text-pink-500" size={20} />
                        Quản Lý Chân Trang
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <FormField
                        control={form.control}
                        name="footerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">💬 Thông Điệp Chân Trang</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cùng chia sẻ câu chuyện tình yêu của chúng tôi"
                                className="h-12 text-lg"
                                data-testid="input-footer-text"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Tin nhắn sẽ hiển thị ở cuối trang
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hashtag"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">#️⃣ Hashtag Đám Cưới</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="#CôDâuChúRể2025"
                                className="h-12 text-lg"
                                data-testid="input-hashtag"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Hashtag sẽ hiển thị ở chân trang
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Instagram className="text-pink-500" size={18} />
                          Liên Kết Mạng Xã Hội
                        </h4>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="facebookUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Facebook URL</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://facebook.com/your-page"
                                    className="h-12"
                                    data-testid="input-facebook-url"
                                    {...field}
                                  />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                  Để trống nếu không muốn hiển thị icon Facebook
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="instagramUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Instagram URL</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://instagram.com/your-profile"
                                    className="h-12"
                                    data-testid="input-instagram-url"
                                    {...field}
                                  />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                  Để trống nếu không muốn hiển thị icon Instagram
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="twitterUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Twitter/X URL</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://twitter.com/your-handle"
                                    className="h-12"
                                    data-testid="input-twitter-url"
                                    {...field}
                                  />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                  Để trống nếu không muốn hiển thị icon Twitter
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "popups" && (
                <div className="space-y-6">
                  <PopupManagement popups={popups} />
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Music className="text-orange-500" size={20} />
                        Cài Đặt Âm Thanh
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <FormLabel className="text-sm font-medium">🎵 Playlist Nhạc Nền</FormLabel>
                        <p className="text-xs text-muted-foreground mb-3">
                          Tải lên nhiều bài hát. Playlist sẽ tự động phát lại từ đầu khi hết.
                        </p>
                        
                        {/* Upload Button */}
                        <div className="flex gap-2 mb-4">
                          <input
                            type="file"
                            ref={audioFileInputRef}
                            onChange={handleAudioFileSelect}
                            accept="audio/*"
                            className="hidden"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="h-12 flex-1"
                            onClick={() => audioFileInputRef.current?.click()}
                            disabled={uploadingAudio}
                            data-testid="button-upload-audio"
                          >
                            {uploadingAudio ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Upload size={18} />
                              </motion.div>
                            ) : (
                              <Music size={18} className="mr-2" />
                            )}
                            {uploadingAudio ? "Đang tải lên..." : "Thêm Bài Hát"}
                          </Button>
                        </div>

                        {/* Playlist Display */}
                        <div className="space-y-2">
                          {(form.watch('backgroundMusicUrls') || []).length === 0 ? (
                            <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                              <Music size={32} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Chưa có bài hát nào</p>
                              <p className="text-xs">Nhấn "Thêm Bài Hát" để upload nhạc</p>
                            </div>
                          ) : (
                            (form.watch('backgroundMusicUrls') || []).map((url, index) => {
                              // Get song name from array or extract from URL
                              const songNames = form.watch('backgroundMusicNames') || [];
                              const getSongName = (url: string, index: number) => {
                                if (songNames[index]) {
                                  return songNames[index];
                                }
                                try {
                                  const urlParts = url.split('/');
                                  const filename = urlParts[urlParts.length - 1];
                                  const decodedName = decodeURIComponent(filename);
                                  const nameWithoutExt = decodedName.replace(/\.[^/.]+$/, '');
                                  return nameWithoutExt || `Bài hát ${index + 1}`;
                                } catch {
                                  return `Bài hát ${index + 1}`;
                                }
                              };
                              
                              return (
                              <div 
                                key={index}
                                className="flex items-center gap-3 p-3 bg-muted rounded-lg group hover:bg-muted/70 transition-colors"
                              >
                                <Music size={18} className="text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <input
                                    type="text"
                                    value={getSongName(url, index)}
                                    onChange={(e) => handleSongNameChange(index, e.target.value)}
                                    className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 w-full"
                                    placeholder="Tên bài hát"
                                    data-testid={`input-song-name-${index}`}
                                  />
                                  <p className="text-xs text-muted-foreground px-2">
                                    Track #{index + 1}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="flex-shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRemoveSong(index)}
                                  data-testid={`button-remove-song-${index}`}
                                >
                                  <Trash2 size={16} className="text-destructive" />
                                </Button>
                              </div>
                            )})
                          )}
                        </div>
                        
                        {(form.watch('backgroundMusicUrls') || []).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            📊 Tổng: {(form.watch('backgroundMusicUrls') || []).length} bài hát trong playlist
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-red-500/5 to-red-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="text-red-500" size={20} />
                        Bảo Mật & Quyền Riêng Tư
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="default">🔒 Bảo mật</Badge>
                          <span className="text-sm font-medium">Duyệt Tin Nhắn</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tất cả tin nhắn từ khách mời sẽ được kiểm duyệt trước khi hiển thị công khai
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">👁️ Riêng tư</Badge>
                          <span className="text-sm font-medium">Thông Tin Liên Hệ</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Thông tin liên hệ chỉ hiển thị cho khách mời đã xác nhận tham dự
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">📊 Phân tích</Badge>
                          <span className="text-sm font-medium">Theo Dõi Hiệu Suất</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Hệ thống tự động theo dõi hiệu suất và bảo mật website 24/7
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </AnimatedTabContent>

            <motion.div 
              className="flex justify-end gap-4 mt-6 p-6 bg-card border rounded-lg sticky bottom-6 shadow-lg"
              variants={itemVariants}
            >
              <Button 
                type="button" 
                variant="outline"
                className="rounded-lg"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye size={16} className="mr-2" />
                Xem trước
              </Button>
              <Button 
                type="submit" 
                className="rounded-lg shadow-lg min-w-32"
                disabled={updateMutation.isPending}
              >
                <Save size={16} className="mr-2" />
                {updateMutation.isPending ? "💾 Đang lưu..." : "💾 Lưu Cài Đặt"}
              </Button>
            </motion.div>
          </form>
          </Form>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AnimatedTabContent({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function PopupManagement({ popups }: { popups: Popup[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingPopup, setUploadingPopup] = useState<string | null>(null);
  const welcomePopupRef = useRef<HTMLInputElement>(null);
  const scrollEndPopupRef = useRef<HTMLInputElement>(null);

  const welcomePopup = popups.find(p => p.type === 'welcome');
  const scrollEndPopup = popups.find(p => p.type === 'scroll_end');

  const createOrUpdatePopupMutation = useMutation({
    mutationFn: async ({ type, imageUrl, isActive }: { type: string; imageUrl: string; isActive: boolean }) => {
      const existingPopup = popups.find(p => p.type === type);
      if (existingPopup) {
        return await apiRequest("PATCH", `/api/popups/${existingPopup.id}`, { imageUrl, isActive });
      } else {
        return await apiRequest("POST", "/api/popups", { type, imageUrl, isActive });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/popups"] });
      toast({
        title: "✅ Thành công!",
        description: "Popup đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật popup",
        variant: "destructive",
      });
    },
  });

  const togglePopupMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/popups/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/popups"] });
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật trạng thái popup",
        variant: "destructive",
      });
    },
  });

  const handlePopupImageUpload = async (type: 'welcome' | 'scroll_end', file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file ảnh",
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

    setUploadingPopup(type);

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      await createOrUpdatePopupMutation.mutateAsync({ type, imageUrl, isActive: true });
      toast({
        title: "✅ Thành công!",
        description: `Đã tải lên ảnh popup ${type === 'welcome' ? 'chào mừng' : 'cuối trang'}`,
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tải lên ảnh popup",
        variant: "destructive",
      });
    } finally {
      setUploadingPopup(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-gradient-to-r from-pink-500/5 to-pink-500/10 border-b">
          <CardTitle className="flex items-center gap-2">
            <Image className="text-pink-500" size={20} />
            Popup Chào Mừng (Khi Vào Trang)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Power className={welcomePopup?.isActive ? "text-green-500" : "text-muted-foreground"} size={20} />
              <div>
                <p className="font-medium">Hiển thị popup khi lần đầu truy cập</p>
                <p className="text-sm text-muted-foreground">
                  Popup sẽ hiện sau 1 giây khi khách truy cập trang lần đầu
                </p>
              </div>
            </div>
            <Switch
              checked={welcomePopup?.isActive || false}
              onCheckedChange={(checked) => {
                if (welcomePopup) {
                  togglePopupMutation.mutate({ id: welcomePopup.id, isActive: checked });
                }
              }}
              disabled={!welcomePopup}
            />
          </div>

          {welcomePopup?.imageUrl && (
            <div className="relative w-full max-w-md">
              <img
                src={welcomePopup.imageUrl}
                alt="Welcome Popup"
                className="w-full h-64 object-contain rounded-lg border-2 border-border bg-muted"
              />
            </div>
          )}

          <div>
            <input
              type="file"
              ref={welcomePopupRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePopupImageUpload('welcome', file);
              }}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={() => welcomePopupRef.current?.click()}
              disabled={uploadingPopup === 'welcome'}
            >
              {uploadingPopup === 'welcome' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Upload size={18} />
                </motion.div>
              ) : (
                <Upload size={18} className="mr-2" />
              )}
              {welcomePopup ? 'Thay Đổi Ảnh Popup' : 'Tải Ảnh Popup Lên'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b">
          <CardTitle className="flex items-center gap-2">
            <Image className="text-purple-500" size={20} />
            Popup Cuối Trang (Khi Lướt Xuống Cuối)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Power className={scrollEndPopup?.isActive ? "text-green-500" : "text-muted-foreground"} size={20} />
              <div>
                <p className="font-medium">Hiển thị popup khi lướt đến cuối trang</p>
                <p className="text-sm text-muted-foreground">
                  Popup sẽ hiện khi khách lướt đến gần cuối trang (95%)
                </p>
              </div>
            </div>
            <Switch
              checked={scrollEndPopup?.isActive || false}
              onCheckedChange={(checked) => {
                if (scrollEndPopup) {
                  togglePopupMutation.mutate({ id: scrollEndPopup.id, isActive: checked });
                }
              }}
              disabled={!scrollEndPopup}
            />
          </div>

          {scrollEndPopup?.imageUrl && (
            <div className="relative w-full max-w-md">
              <img
                src={scrollEndPopup.imageUrl}
                alt="Scroll End Popup"
                className="w-full h-64 object-contain rounded-lg border-2 border-border bg-muted"
              />
            </div>
          )}

          <div>
            <input
              type="file"
              ref={scrollEndPopupRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePopupImageUpload('scroll_end', file);
              }}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={() => scrollEndPopupRef.current?.click()}
              disabled={uploadingPopup === 'scroll_end'}
            >
              {uploadingPopup === 'scroll_end' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Upload size={18} />
                </motion.div>
              ) : (
                <Upload size={18} className="mr-2" />
              )}
              {scrollEndPopup ? 'Thay Đổi Ảnh Popup' : 'Tải Ảnh Popup Lên'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
