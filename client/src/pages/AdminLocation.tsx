import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, MapPin, Eye, Upload, Clock, Phone, Mail, Building } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Settings } from "@shared/schema";
import { insertSettingsSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { uploadImageToCloudinary } from "@/lib/imageUpload";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const convertToGoogleMapsEmbed = (input: string): string => {
  if (!input) return input;
  
  if (input.trim().startsWith('<iframe')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  if (input.includes('/maps/embed')) {
    return input;
  }
  
  return input;
};

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

export default function AdminLocation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingVenueImage, setUploadingVenueImage] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const venueImageInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
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
      venueDescription: "",
      venueCapacity: "",
      parkingInfo: "",
      additionalNotes: "",
    },
  });

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
        venueDescription: settings.venueDescription || "",
        venueCapacity: settings.venueCapacity || "",
        parkingInfo: settings.parkingInfo || "",
        additionalNotes: settings.additionalNotes || "",
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
        title: "✅ Đã lưu thông tin địa điểm",
        description: "Thay đổi của bạn đã được cập nhật thành công",
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
        description: "Không thể lưu thông tin địa điểm",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

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
        className: "bg-green-50 border-green-200 text-green-800"
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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-6 max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-64 animate-pulse" />
              <div className="h-4 bg-muted rounded w-96 animate-pulse" />
            </div>
          </div>
        </div>
        
        <Card className="animate-pulse">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
            <div className="h-6 bg-muted rounded w-48" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-12 bg-muted rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-6 max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Thông Tin Địa Điểm
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Quản lý thông tin địa điểm và thời gian tổ chức sự kiện
                </p>
              </div>
            </div>
            
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Building className="w-4 h-4 mr-1" />
              Địa Điểm
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tên Địa Điểm</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100 truncate">
                      {form.watch('venueName') || 'Chưa thiết lập'}
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
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Thời Gian</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {form.watch('eventStartTime') ? 'Đã thiết lập' : 'Chưa thiết lập'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Liên Hệ</p>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                      {form.watch('venuePhone') ? 'Có' : 'Chưa có'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Bản Đồ</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {form.watch('venueMapLink') ? 'Đã nhúng' : 'Chưa nhúng'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Thông Tin Cơ Bản
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Vị Trí & Bản Đồ
                </TabsTrigger>
                <TabsTrigger value="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Thời Gian
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Thông Tin Thêm
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Building className="text-blue-500" size={20} />
                      Thông Tin Cơ Bản Địa Điểm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Building className="w-4 h-4 text-blue-500" />
                              Tên Địa Điểm *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Khách sạn Grand Ballroom"
                                className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
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
                        name="venueCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-500" />
                              Sức Chứa
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="200 người"
                                className="h-12 text-base border-2 focus:border-green-500 transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Số lượng khách tối đa có thể tiếp đón
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="venueDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-500" />
                            Mô Tả Địa Điểm
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mô tả chi tiết về địa điểm, không gian, tiện nghi..."
                              className="min-h-24 resize-none border-2 focus:border-purple-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Mô tả ngắn gọn về địa điểm để khách mời hình dung
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="venueImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4 text-orange-500" />
                            Ảnh Địa Điểm
                          </FormLabel>
                          <div className="space-y-4">
                            <AnimatePresence>
                              {field.value && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="relative w-full max-w-2xl group"
                                >
                                  <img
                                    src={field.value}
                                    alt="Venue"
                                    className="w-full h-64 object-cover rounded-xl border-2 border-border shadow-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => window.open(field.value, '_blank')}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Xem Ảnh Gốc
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            <div className="flex gap-3">
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
                                className="h-12 flex-1 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors"
                                onClick={() => venueImageInputRef.current?.click()}
                                disabled={uploadingVenueImage}
                                data-testid="button-upload-venue-image"
                              >
                                {uploadingVenueImage ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="flex items-center gap-2"
                                  >
                                    <Upload size={18} className="text-blue-500" />
                                    Đang tải lên...
                                  </motion.div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Upload size={18} className="text-blue-500" />
                                    {field.value ? "Thay Đổi Ảnh" : "Tải Ảnh Lên"}
                                  </div>
                                )}
                              </Button>
                              
                              {field.value && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-12 w-12 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
                                      onClick={() => {
                                        form.setValue('venueImage', '');
                                        toast({
                                          title: "Đã xóa ảnh",
                                          description: "Ảnh địa điểm đã được xóa",
                                          className: "bg-blue-50 border-blue-200 text-blue-800"
                                        });
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Xóa ảnh</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <FormDescription>
                            Tải lên ảnh địa điểm để hiển thị tại trang chủ (tối đa 5MB, tỷ lệ 16:9 khuyến nghị)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location & Map Tab */}
              <TabsContent value="location" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-b">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <MapPin className="text-green-500" size={20} />
                      Thông Tin Vị Trí & Bản Đồ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="venueAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            Địa Chỉ Địa Điểm *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="123 Đường Cưới, Phường ABC, Quận XYZ, Thành phố Hồ Chí Minh"
                              className="min-h-20 resize-none border-2 focus:border-green-500 transition-colors text-base"
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
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Eye className="w-4 h-4 text-purple-500" />
                            Link Google Maps (Nhúng iframe)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Dán toàn bộ iframe code hoặc chỉ link embed'
                              className="h-12 border-2 focus:border-purple-500 transition-colors font-mono text-sm"
                              data-testid="input-venue-map-link"
                              value={field.value || ""}
                              onChange={(e) => {
                                const processedValue = convertToGoogleMapsEmbed(e.target.value);
                                field.onChange(processedValue);
                              }}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-3">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-4 h-4 text-blue-500" />
                              <p className="font-medium text-foreground">📍 Cách nhúng Google Maps:</p>
                            </div>
                            <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                              <li>Vào <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Maps</a></li>
                              <li>Tìm kiếm địa điểm của bạn</li>
                              <li>Nhấn nút "Chia sẻ" (Share) → "Nhúng bản đồ" (Embed a map)</li>
                              <li><strong className="text-foreground">Sao chép TOÀN BỘ iframe code và dán vào ô trên</strong></li>
                              <li className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Hệ thống sẽ tự động trích xuất link embed từ iframe
                              </li>
                            </ol>
                            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300">
                              <p className="text-xs font-medium text-foreground mb-2">📋 Ví dụ code iframe:</p>
                              <code className="text-xs block bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto border">
                                {'<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450"></iframe>'}
                              </code>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {field.value && field.value.includes('google.com/maps') && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 space-y-3"
                              >
                                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                    Bản đồ đã được nhúng thành công!
                                  </p>
                                </div>
                                <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-border shadow-lg">
                                  <iframe
                                    src={field.value}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-xl"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parkingInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Car className="w-4 h-4 text-orange-500" />
                            Thông Tin Bãi Đỗ Xe
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Thông tin về bãi đỗ xe, chỗ đậu ô tô, hướng dẫn đỗ xe..."
                              className="min-h-20 resize-none border-2 focus:border-orange-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Hướng dẫn khách mời về bãi đỗ xe và các lưu ý liên quan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Time Information Tab */}
              <TabsContent value="time" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b">
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <Clock className="text-orange-500" size={20} />
                      Thông Tin Thời Gian Sự Kiện
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="eventStartTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Play className="w-4 h-4 text-green-500" />
                              Thời Gian Bắt Đầu *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-12 border-2 focus:border-green-500 transition-colors text-base"
                                data-testid="input-event-start-time"
                                value={(typeof field.value === 'string' ? field.value : '') || ""}
                                onChange={(e) => field.onChange(e.target.value || undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              Thời gian chính thức bắt đầu sự kiện
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eventEndTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Square className="w-4 h-4 text-red-500" />
                              Thời Gian Kết Thúc *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-12 border-2 focus:border-red-500 transition-colors text-base"
                                data-testid="input-event-end-time"
                                value={(typeof field.value === 'string' ? field.value : '') || ""}
                                onChange={(e) => field.onChange(e.target.value || undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              Thời gian dự kiến kết thúc sự kiện
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Time Summary */}
                    <AnimatePresence>
                      {(form.watch('eventStartTime') || form.watch('eventEndTime')) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border border-blue-200"
                        >
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-blue-700">
                            <Clock className="w-4 h-4" />
                            Tóm Tắt Thời Gian
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Bắt đầu:</span>
                              <p className="text-foreground">
                                {form.watch('eventStartTime') 
                                  ? new Date(form.watch('eventStartTime')!).toLocaleString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Chưa thiết lập'}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Kết thúc:</span>
                              <p className="text-foreground">
                                {form.watch('eventEndTime') 
                                  ? new Date(form.watch('eventEndTime')!).toLocaleString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Chưa thiết lập'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b">
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Info className="text-purple-500" size={20} />
                      Thông Tin Liên Hệ & Ghi Chú
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="venuePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Phone className="w-4 h-4 text-blue-500" />
                              Số Điện Thoại Liên Hệ
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(84) 123-456-789"
                                className="h-12 border-2 focus:border-blue-500 transition-colors"
                                data-testid="input-venue-phone"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Số điện thoại liên hệ địa điểm
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="venueEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Mail className="w-4 h-4 text-green-500" />
                              Email Liên Hệ
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="contact@venue.com"
                                className="h-12 border-2 focus:border-green-500 transition-colors"
                                data-testid="input-venue-email"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Email liên hệ địa điểm
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Ghi Chú Thêm
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Các ghi chú, lưu ý thêm cho khách mời về địa điểm..."
                              className="min-h-32 resize-none border-2 focus:border-orange-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Thông tin bổ sung, hướng dẫn đặc biệt, hoặc lưu ý quan trọng cho khách mời
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-4 pt-6 border-t"
            >
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 px-8"
                onClick={() => form.reset()}
              >
                Đặt Lại
              </Button>
              <Button 
                type="submit" 
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
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
                    Lưu Thay Đổi
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </TooltipProvider>
  );
}

// Add missing icon components
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Info = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" width="20" height="20" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Car = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Play = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Square = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);