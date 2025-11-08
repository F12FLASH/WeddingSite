import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Settings as SettingsIcon, Music, Palette, Shield, Eye, Upload, Trash2, Heart, Instagram, Facebook, Twitter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Settings, MusicTrack } from "@shared/schema";
import { insertSettingsSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
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
import { FontPreview } from "@/components/FontPreview";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("fonts");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const songNameDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const { data: musicTracks = [] } = useQuery<MusicTrack[]>({
    queryKey: ["/api/music-tracks"],
  });

  const form = useForm({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: {
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
      fontSerif: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
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
        fontSerif: settings.fontSerif || "",
      });
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof insertSettingsSchema._type) => {
      return await apiRequest("POST", "/api/settings", data);
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

  // Music Track Mutations
  const createMusicTrackMutation = useMutation({
    mutationFn: async (trackData: { title: string; filename: string; displayOrder: number }) => {
      return await apiRequest("POST", "/api/music-tracks", trackData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music-tracks"] });
      toast({
        title: "✅ Thành công!",
        description: "Đã thêm bài hát vào playlist",
      });
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tạo bài hát",
        variant: "destructive",
      });
    },
  });

  const updateMusicTrackMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ title: string; displayOrder: number; isActive: boolean }> }) => {
      return await apiRequest("PATCH", `/api/music-tracks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music-tracks"] });
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật bài hát",
        variant: "destructive",
      });
    },
  });

  const deleteMusicTrackMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/music-tracks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music-tracks"] });
      toast({
        title: "✅ Đã xóa",
        description: "Đã xóa bài hát khỏi playlist",
      });
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa bài hát",
        variant: "destructive",
      });
    },
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
      
      // Extract filename as default title
      const getSongName = (filename: string) => {
        try {
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
          return nameWithoutExt || `Bài hát ${musicTracks.length + 1}`;
        } catch {
          return `Bài hát ${musicTracks.length + 1}`;
        }
      };
      
      const title = getSongName(file.name);
      const filename = audioUrl;
      const displayOrder = musicTracks.length;
      
      await createMusicTrackMutation.mutateAsync({ title, filename, displayOrder });
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

  const handleRemoveSong = async (trackId: string) => {
    await deleteMusicTrackMutation.mutateAsync(trackId);
  };
  
  const handleSongNameChange = (trackId: string, newTitle: string) => {
    if (songNameDebounceRef.current[trackId]) {
      clearTimeout(songNameDebounceRef.current[trackId]);
    }
    
    songNameDebounceRef.current[trackId] = setTimeout(async () => {
      try {
        await updateMusicTrackMutation.mutateAsync({
          id: trackId,
          data: { title: newTitle },
        });
        toast({
          title: "✅ Đã lưu",
          description: "Tên bài hát đã được cập nhật",
        });
      } catch (error) {
        console.error("Failed to save song name:", error);
      }
    }, 1000);
  };

  const tabs = [
    { id: "fonts", label: "Font Chữ", icon: Palette, color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950/30" },
    { id: "footer", label: "Chân Trang", icon: Heart, color: "text-pink-500", bgColor: "bg-pink-50 dark:bg-pink-950/30" },
    { id: "music", label: "Âm thanh", icon: Music, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950/30" },
    { id: "security", label: "Bảo Mật", icon: Shield, color: "text-gray-500", bgColor: "bg-gray-50 dark:bg-gray-950/30" },
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
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h2 className="admin-heading mb-2 text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <SettingsIcon size={24} className="text-white" />
              </div>
              Cài Đặt Website
            </h2>
            <p className="text-muted-foreground text-base">Tùy chỉnh và cấu hình trang web đám cưới của bạn</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="sticky top-6 shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Danh Mục</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <nav className="space-y-1.5">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-300 border-2 ${
                        isActive
                          ? `${tab.bgColor} border-${tab.color.split('-')[1]}-300 shadow-md`
                          : "border-transparent hover:bg-muted/50 hover:border-border"
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/80 dark:bg-black/20' : 'bg-transparent'}`}>
                        <IconComponent size={18} className={tab.color} />
                      </div>
                      <span className={`font-medium text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {tab.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="lg:col-span-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <AnimatedTabContent activeTab={activeTab}>
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
                              <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                                  🎨
                                </div>
                                Font Tiêu Đề Chính
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
                                Hiển thị ở phần Hero (đầu trang), tên cặp đôi và các tiêu đề lớn
                              </p>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="h-12 ml-10" data-testid="select-font-heading">
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
                              {field.value && (
                                <FontPreview 
                                  fontFamily={field.value}
                                  previewType="heading"
                                />
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
                              <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                                  📝
                                </div>
                                Font Nội Dung Chính
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
                                Dùng cho tất cả đoạn văn, mô tả, thông tin sự kiện và nội dung chi tiết
                              </p>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="h-12 ml-10" data-testid="select-font-body">
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
                              {field.value && (
                                <FontPreview 
                                  fontFamily={field.value}
                                  previewType="body"
                                />
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
                              <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white">
                                  ✨
                                </div>
                                Font Chữ Nghệ Thuật
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
                                Chữ viết tay lãng mạn cho tên cô dâu/chú rể và lời mời đặc biệt
                              </p>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="h-12 ml-10" data-testid="select-font-cursive">
                                    <SelectValue placeholder="Chọn font chữ nghệ thuật" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Dancing Script">Dancing Script (Lãng mạn)</SelectItem>
                                  <SelectItem value="Yellowtail">Yellowtail (Tinh tế)</SelectItem>
                                  <SelectItem value="Yesteryear">Yesteryear (Cổ điển)</SelectItem>
                                </SelectContent>
                              </Select>
                              {field.value && (
                                <FontPreview 
                                  fontFamily={field.value}
                                  previewType="cursive"
                                />
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fontSerif"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                                  📜
                                </div>
                                Font Serif Bổ Sung
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
                                Dùng cho lời cảm ơn, thông tin quan trọng và tin nhắn đặc biệt
                              </p>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="h-12 ml-10" data-testid="select-font-serif">
                                    <SelectValue placeholder="Chọn font serif bổ sung" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Cormorant Garamond">Cormorant Garamond (Dễ đọc)</SelectItem>
                                  <SelectItem value="Playfair Display">Playfair Display (Thanh lịch)</SelectItem>
                                  <SelectItem value="Noto Serif">Noto Serif (Tiêu chuẩn)</SelectItem>
                                  <SelectItem value="Crimson Text">Crimson Text (Sang trọng)</SelectItem>
                                  <SelectItem value="Lora">Lora (Hiện đại)</SelectItem>
                                </SelectContent>
                              </Select>
                              {field.value && (
                                <FontPreview 
                                  fontFamily={field.value}
                                  previewType="serif"
                                />
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

                        {/* Footer Preview */}
                        <div className="border-t pt-6">
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Eye className="text-pink-500" size={18} />
                            Xem Trước Chân Trang
                          </h4>
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl border-2 border-border">
                            <div className="text-center space-y-4">
                              <div className="flex items-center gap-3 justify-center">
                                <Heart className="text-pink-500" size={24} fill="currentColor" />
                                <span className="font-cursive text-2xl text-pink-500">
                                  Cô Dâu & Chú Rể
                                </span>
                              </div>
                              <p className="text-muted-foreground text-base">
                                {form.watch("footerText") || "Cùng chia sẻ câu chuyện tình yêu của chúng tôi"}
                              </p>
                              <div className="flex gap-3 justify-center">
                                {form.watch("facebookUrl") && (
                                  <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center" data-testid="preview-facebook-icon">
                                    <Facebook size={18} className="text-muted-foreground" />
                                  </div>
                                )}
                                {form.watch("instagramUrl") && (
                                  <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center" data-testid="preview-instagram-icon">
                                    <Instagram size={18} className="text-muted-foreground" />
                                  </div>
                                )}
                                {form.watch("twitterUrl") && (
                                  <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center" data-testid="preview-twitter-icon">
                                    <Twitter size={18} className="text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              {form.watch("hashtag") && (
                                <div className="inline-block px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
                                  <p className="text-sm font-cursive text-pink-600 dark:text-pink-400">
                                    {form.watch("hashtag")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "music" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-b">
                        <CardTitle className="flex items-center gap-2">
                          <Music className="text-green-500" size={20} />
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
                            {musicTracks.length === 0 ? (
                              <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                                <Music size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Chưa có bài hát nào</p>
                                <p className="text-xs">Nhấn "Thêm Bài Hát" để upload nhạc</p>
                              </div>
                            ) : (
                              musicTracks.map((track, index) => (
                                <div 
                                  key={track.id}
                                  className="flex items-center gap-3 p-3 bg-muted rounded-lg group hover:bg-muted/70 transition-colors"
                                >
                                  <Music size={18} className="text-primary flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <input
                                      type="text"
                                      defaultValue={track.title}
                                      onChange={(e) => handleSongNameChange(track.id, e.target.value)}
                                      className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 w-full"
                                      placeholder="Tên bài hát"
                                      data-testid={`input-song-name-${track.id}`}
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
                                    onClick={() => handleRemoveSong(track.id)}
                                    data-testid={`button-remove-song-${track.id}`}
                                  >
                                    <Trash2 size={16} className="text-destructive" />
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>
                          
                          {musicTracks.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              📊 Tổng: {musicTracks.length} bài hát trong playlist
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