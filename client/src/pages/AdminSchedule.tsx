import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Pencil, Clock, MapPin, Search, Filter, Users, Music, Utensils, Heart, Eye, Play, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ScheduleEvent, InsertScheduleEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconOptions = [
  { value: "heart", label: "💖 Trái tim", icon: Heart },
  { value: "calendar", label: "📅 Lịch", icon: Calendar },
  { value: "clock", label: "⏰ Đồng hồ", icon: Clock },
  { value: "map-pin", label: "📍 Địa điểm", icon: MapPin },
  { value: "users", label: "👥 Mọi người", icon: Users },
  { value: "music", label: "🎵 Âm nhạc", icon: Music },
  { value: "utensils", label: "🍽️ Ẩm thực", icon: Utensils },
];

export default function AdminSchedule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: events = [], isLoading } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/schedule"],
  });

  // Filter events based on search and time
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventTime = new Date(event.eventTime);
    const now = new Date();
    const isPast = eventTime < now;
    const isUpcoming = eventTime >= now;
    
    const matchesTime = timeFilter === "all" || 
                       (timeFilter === "past" && isPast) ||
                       (timeFilter === "upcoming" && isUpcoming);

    const matchesTab = activeTab === "all" || 
                      (activeTab === "upcoming" && isUpcoming) ||
                      (activeTab === "past" && isPast);
    
    return matchesSearch && matchesTime && matchesTab;
  });

  // Sort events by time
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
  );

  const stats = {
    total: events.length,
    upcoming: events.filter(event => new Date(event.eventTime) >= new Date()).length,
    past: events.filter(event => new Date(event.eventTime) < new Date()).length,
    today: events.filter(event => {
      const eventDate = new Date(event.eventTime);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    }).length,
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertScheduleEvent) => {
      return await apiRequest("POST", "/api/schedule", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ 
        title: "✅ Tạo sự kiện thành công",
        description: "Sự kiện đã được thêm vào lịch trình",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể tạo sự kiện lịch trình",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertScheduleEvent> }) => {
      return await apiRequest("PATCH", `/api/schedule/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ 
        title: "✅ Cập nhật sự kiện thành công",
        description: "Thông tin sự kiện đã được cập nhật",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      setIsDialogOpen(false);
      setEditingEvent(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật sự kiện lịch trình",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/schedule/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ 
        title: "🗑️ Xóa sự kiện thành công",
        description: "Sự kiện đã được xóa khỏi lịch trình",
        className: "bg-blue-50 border-blue-200 text-blue-800"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa sự kiện lịch trình",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertScheduleEvent = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventTime: new Date(formData.get("eventTime") as string),
      location: formData.get("location") as string,
      icon: formData.get("icon") as string,
      order: parseInt(formData.get("order") as string) || 0,
      duration: formData.get("duration") as string,
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getEventStatus = (eventTime: Date) => {
    const now = new Date();
    const timeDiff = new Date(eventTime).getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 0) return { status: "past", label: "Đã qua", color: "bg-gray-500/20 text-gray-600 border-gray-300" };
    if (hoursDiff < 24) return { status: "soon", label: "Sắp tới", color: "bg-orange-500/20 text-orange-600 border-orange-300" };
    return { status: "upcoming", label: "Sắp diễn ra", color: "bg-green-500/20 text-green-600 border-green-300" };
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Calendar;
  };

  const getTimeUntilEvent = (eventTime: Date) => {
    const now = new Date();
    const diff = new Date(eventTime).getTime() - now.getTime();
    
    if (diff < 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
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
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-6 max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quản Lý Lịch Trình
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Quản lý thời gian biểu và sự kiện đám cưới
                </p>
              </div>
            </div>
            
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {stats.total} sự kiện
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tổng sự kiện</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Sắp diễn ra</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">{stats.upcoming}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Hôm nay</p>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{stats.today}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Đã qua</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.past}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="🔍 Tìm kiếm sự kiện theo tiêu đề, mô tả hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border-2 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-40 rounded-lg border-2">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Tất cả thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">⏰ Tất cả thời gian</SelectItem>
                  <SelectItem value="upcoming">🟢 Sắp tới</SelectItem>
                  <SelectItem value="past">🔴 Đã qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingEvent(null)}
                className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus size={18} className="mr-2" />
                Thêm Sự Kiện
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingEvent ? "✏️ Chỉnh Sửa Sự Kiện" : "📅 Thêm Sự Kiện Mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingEvent ? "Cập nhật thông tin sự kiện" : "Thêm sự kiện mới vào lịch trình đám cưới"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Tiêu Đề Sự Kiện *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Lễ cưới chính thức, Tiệc chiêu đãi..."
                    defaultValue={editingEvent?.title}
                    className="h-12 text-lg border-2 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    Mô Tả Chi Tiết
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Mô tả chi tiết về sự kiện, các hoạt động, lưu ý quan trọng..."
                    defaultValue={editingEvent?.description || ""}
                    className="text-lg border-2 focus:border-green-500 resize-none"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="eventTime" className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      Thời Gian *
                    </Label>
                    <Input
                      id="eventTime"
                      name="eventTime"
                      type="datetime-local"
                      required
                      defaultValue={editingEvent?.eventTime ? new Date(editingEvent.eventTime).toISOString().slice(0, 16) : ""}
                      className="h-12 border-2 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">⏱️</span>
                      Thời Lượng
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      placeholder="2 giờ, 30 phút..."
                      defaultValue={editingEvent?.duration || ""}
                      className="h-12 border-2 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      Địa Điểm
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Nhà thờ chính tòa, Khách sạn Grand Ballroom..."
                      defaultValue={editingEvent?.location || ""}
                      className="h-12 border-2 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="order" className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">🔢</span>
                      Thứ Tự Hiển Thị
                    </Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      defaultValue={editingEvent?.order || 0}
                      className="h-12 border-2 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="icon" className="text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    Biểu Tượng
                  </Label>
                  <Select name="icon" defaultValue={editingEvent?.icon || "calendar"}>
                    <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                      <SelectValue placeholder="Chọn biểu tượng" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent size={16} />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-lg"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingEvent ? "💾 Cập Nhật" : "📤 Tạo"} Sự Kiện
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tất Cả Sự Kiện
              <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Sắp Diễn Ra
              <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">{stats.upcoming}</Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Đã Qua
              <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-700">{stats.past}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Events List */}
            {isLoading ? (
              <motion.div
                className="grid gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="animate-pulse border-0">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-1/3" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="grid gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {sortedEvents.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="border-dashed rounded-2xl border-2">
                        <CardContent className="py-16 text-center text-muted-foreground">
                          <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">Không tìm thấy sự kiện nào</p>
                          <p className="mb-4">
                            {searchTerm || timeFilter !== "all" || activeTab !== "all"
                              ? "Thử thay đổi bộ lọc tìm kiếm" 
                              : "Chưa có sự kiện nào trong lịch trình"
                            }
                          </p>
                          <Button 
                            className="rounded-lg"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            <Plus size={18} className="mr-2" />
                            Thêm Sự Kiện Đầu Tiên
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    sortedEvents.map((event, index) => {
                      const IconComponent = getIconComponent(event.icon || "calendar");
                      const status = getEventStatus(event.eventTime);
                      const timeUntil = getTimeUntilEvent(event.eventTime);
                      
                      return (
                        <motion.div
                          key={event.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          exit="hidden"
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group rounded-2xl overflow-hidden">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                                    <IconComponent className="text-blue-600" size={28} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                      <CardTitle className="text-xl text-foreground">
                                        {event.title}
                                      </CardTitle>
                                      <div className="flex gap-2 flex-wrap">
                                        <Badge className={`${status.color} border`}>
                                          {status.label}
                                        </Badge>
                                        {timeUntil && status.status === "soon" && (
                                          <Badge variant="default" className="bg-orange-500 text-white animate-pulse">
                                            ⚡ Còn {timeUntil}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
                                        <Clock size={14} className="text-blue-500" />
                                        <span className="font-medium">
                                          {new Date(event.eventTime).toLocaleString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      {event.duration && (
                                        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-full">
                                          <span className="text-purple-500">⏱️</span>
                                          <span className="font-medium">{event.duration}</span>
                                        </div>
                                      )}
                                      {event.location && (
                                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-full">
                                          <MapPin size={14} className="text-red-500" />
                                          <span className="font-medium">{event.location}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-50"
                                        onClick={() => {
                                          setEditingEvent(event);
                                          setIsDialogOpen(true);
                                        }}
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Chỉnh sửa</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                          if (confirm(`Bạn có chắc muốn xóa sự kiện "${event.title}"?`)) {
                                            deleteMutation.mutate(event.id);
                                          }
                                        }}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Xóa sự kiện</TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent>
                              {event.description && (
                                <motion.p 
                                  className="text-foreground leading-relaxed text-lg bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/30 p-4 rounded-xl"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {event.description}
                                </motion.p>
                              )}
                              
                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50">
                                <Badge variant="outline" className="text-xs">
                                  Thứ tự hiển thị: {event.order}
                                </Badge>
                                
                                {status.status === "soon" && timeUntil && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-orange-600">
                                      Sắp diễn ra trong {timeUntil}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </TooltipProvider>
  );
}