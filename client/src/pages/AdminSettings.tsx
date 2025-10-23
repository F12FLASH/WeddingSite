import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Settings as SettingsIcon, Music, MapPin, Palette, Bell, Shield, Upload, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Settings, InsertSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertSettings) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertSettings = {
      venueName: formData.get("venueName") as string,
      venueAddress: formData.get("venueAddress") as string,
      venueLatitude: formData.get("venueLatitude") as string,
      venueLongitude: formData.get("venueLongitude") as string,
      backgroundMusicUrl: formData.get("backgroundMusicUrl") as string,
      websiteTitle: formData.get("websiteTitle") as string,
      primaryColor: formData.get("primaryColor") as string,
      enableMusic: formData.get("enableMusic") === "on",
      enableMessages: formData.get("enableMessages") === "on",
      enableRSVP: formData.get("enableRSVP") === "on",
      enableGallery: formData.get("enableGallery") === "on",
    };

    updateMutation.mutate(data);
  };

  const tabs = [
    { id: "general", label: "🌐 Tổng Quan", icon: SettingsIcon },
    { id: "appearance", label: "🎨 Giao Diện", icon: Palette },
    { id: "features", label: "⚙️ Tính Năng", icon: Bell },
    { id: "security", label: "🔒 Bảo Mật", icon: Shield },
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
      >
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">⚙️ Cài Đặt Website</h2>
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
    >
      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-serif mb-2 text-foreground">⚙️ Cài Đặt Website</h2>
          <p className="text-muted-foreground text-lg">Tùy chỉnh và cấu hình trang web đám cưới của bạn</p>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
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

        {/* Main Content */}
        <motion.div 
          className="lg:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSubmit}>
            <AnimatedTabContent activeTab={activeTab}>
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="text-primary" size={20} />
                        Thông Tin Cơ Bản
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="websiteTitle" className="text-sm font-medium">Tiêu Đề Website</Label>
                        <Input
                          id="websiteTitle"
                          name="websiteTitle"
                          placeholder="Đám cưới Sarah & Michael"
                          defaultValue={settings?.websiteTitle || ""}
                          className="h-12 text-lg"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tiêu đề hiển thị trên trình duyệt và SEO
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-blue-500" size={20} />
                        Thông Tin Địa Điểm
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="venueName" className="text-sm font-medium">Tên Địa Điểm *</Label>
                        <Input
                          id="venueName"
                          name="venueName"
                          required
                          placeholder="Khách sạn Grand Ballroom"
                          defaultValue={settings?.venueName || ""}
                          className="h-12 text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venueAddress" className="text-sm font-medium">Địa Chỉ Địa Điểm *</Label>
                        <Textarea
                          id="venueAddress"
                          name="venueAddress"
                          rows={3}
                          required
                          placeholder="123 Đường Cưới, Quận 1, Thành phố Hồ Chí Minh"
                          defaultValue={settings?.venueAddress || ""}
                          className="text-lg resize-none"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="venueLatitude" className="text-sm font-medium">Vĩ Độ</Label>
                          <Input
                            id="venueLatitude"
                            name="venueLatitude"
                            placeholder="10.8231"
                            defaultValue={settings?.venueLatitude || ""}
                            className="h-12"
                          />
                          <p className="text-xs text-muted-foreground">
                            Để hiển thị bản đồ chính xác
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="venueLongitude" className="text-sm font-medium">Kinh Độ</Label>
                          <Input
                            id="venueLongitude"
                            name="venueLongitude"
                            placeholder="106.6297"
                            defaultValue={settings?.venueLongitude || ""}
                            className="h-12"
                          />
                          <p className="text-xs text-muted-foreground">
                            Để hiển thị bản đồ chính xác
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="text-purple-500" size={20} />
                        Màu Sắc & Giao Diện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor" className="text-sm font-medium">Màu Chủ Đạo</Label>
                        <Select name="primaryColor" defaultValue={settings?.primaryColor || "blue"}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Chọn màu chủ đạo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rose">🌹 Hồng - Lãng mạn</SelectItem>
                            <SelectItem value="blue">🔵 Xanh dương - Cổ điển</SelectItem>
                            <SelectItem value="emerald">💚 Xanh ngọc - Tươi mới</SelectItem>
                            <SelectItem value="purple">🟣 Tím - Quý phái</SelectItem>
                            <SelectItem value="amber">🟠 Cam - Ấm áp</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Màu sắc chủ đạo cho toàn bộ website
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg">
                        {['rose', 'blue', 'emerald', 'purple', 'amber'].map((color) => (
                          <div
                            key={color}
                            className={`h-8 rounded-lg cursor-pointer border-2 ${
                              settings?.primaryColor === color ? 'border-foreground' : 'border-transparent'
                            } bg-${color}-500`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Features Settings */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="text-green-500" size={20} />
                        Quản Lý Tính Năng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label htmlFor="enableMusic" className="text-sm font-medium cursor-pointer">
                            🎵 Nhạc Nền
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Bật/tắt nhạc nền trên website
                          </p>
                        </div>
                        <Switch
                          id="enableMusic"
                          name="enableMusic"
                          defaultChecked={settings?.enableMusic ?? true}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label htmlFor="enableRSVP" className="text-sm font-medium cursor-pointer">
                            📋 RSVP
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Cho phép khách mời xác nhận tham dự
                          </p>
                        </div>
                        <Switch
                          id="enableRSVP"
                          name="enableRSVP"
                          defaultChecked={settings?.enableRSVP ?? true}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label htmlFor="enableMessages" className="text-sm font-medium cursor-pointer">
                            💌 Lời Chúc
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Cho phép khách mời gửi lời chúc
                          </p>
                        </div>
                        <Switch
                          id="enableMessages"
                          name="enableMessages"
                          defaultChecked={settings?.enableMessages ?? true}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label htmlFor="enableGallery" className="text-sm font-medium cursor-pointer">
                            📸 Thư Viện Ảnh
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Hiển thị album ảnh đám cưới
                          </p>
                        </div>
                        <Switch
                          id="enableGallery"
                          name="enableGallery"
                          defaultChecked={settings?.enableGallery ?? true}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Music className="text-orange-500" size={20} />
                        Cài Đặt Âm Thanh
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="backgroundMusicUrl" className="text-sm font-medium">URL Nhạc Nền</Label>
                        <div className="flex gap-2">
                          <Input
                            id="backgroundMusicUrl"
                            name="backgroundMusicUrl"
                            type="url"
                            placeholder="https://example.com/our-wedding-song.mp3"
                            defaultValue={settings?.backgroundMusicUrl || ""}
                            className="h-12 flex-1"
                          />
                          <Button type="button" variant="outline" size="icon" className="h-12 w-12">
                            <Upload size={18} />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          URL tới file MP3 cho nhạc nền trên trang chủ
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Settings */}
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

            {/* Save Button */}
            <motion.div 
              className="flex justify-end gap-4 mt-6 p-6 bg-card border rounded-lg sticky bottom-6 shadow-lg"
              variants={itemVariants}
            >
              <Button 
                type="button" 
                variant="outline"
                className="rounded-lg"
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
        </motion.div>
      </div>
    </motion.div>
  );
}

// Animated Tab Content Component
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