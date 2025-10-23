import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Pencil, Clock, MapPin, Search, Filter, Users, Music, Utensils, Heart } from "lucide-react";
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

const iconOptions = [
  { value: "heart", label: "💖 Heart", icon: Heart },
  { value: "calendar", label: "📅 Calendar", icon: Calendar },
  { value: "clock", label: "⏰ Clock", icon: Clock },
  { value: "map-pin", label: "📍 Map Pin", icon: MapPin },
  { value: "users", label: "👥 Users", icon: Users },
  { value: "music", label: "🎵 Music", icon: Music },
  { value: "utensils", label: "🍽️ Utensils", icon: Utensils },
];

export default function AdminSchedule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

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
    
    return matchesSearch && matchesTime;
  });

  // Sort events by time
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
  );

  const stats = {
    total: events.length,
    upcoming: events.filter(event => new Date(event.eventTime) >= new Date()).length,
    past: events.filter(event => new Date(event.eventTime) < new Date()).length,
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertScheduleEvent) => {
      return await apiRequest("POST", "/api/schedule", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ 
        title: "✅ Tạo sự kiện thành công",
        description: "Sự kiện đã được thêm vào lịch trình"
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
        description: "Thông tin sự kiện đã được cập nhật"
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
        description: "Sự kiện đã được xóa khỏi lịch trình"
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

  const getEventStatus = (eventTime: Date) => {
    const now = new Date();
    const timeDiff = new Date(eventTime).getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 0) return { status: "past", label: "Đã qua", color: "bg-gray-500/20 text-gray-600" };
    if (hoursDiff < 24) return { status: "soon", label: "Sắp tới", color: "bg-orange-500/20 text-orange-600" };
    return { status: "upcoming", label: "Sắp diễn ra", color: "bg-green-500/20 text-green-600" };
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Calendar;
  };

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
        <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-serif mb-2 text-foreground">📅 Sự Kiện Lịch Trình</h2>
            <p className="text-muted-foreground text-lg">Quản lý thời gian biểu đám cưới của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingEvent(null)}
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Tiêu Đề Sự Kiện *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Lễ cưới chính thức"
                    defaultValue={editingEvent?.title}
                    className="h-12 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Mô Tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Mô tả chi tiết về sự kiện..."
                    defaultValue={editingEvent?.description || ""}
                    className="text-lg"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTime" className="text-sm font-medium">Thời Gian *</Label>
                    <Input
                      id="eventTime"
                      name="eventTime"
                      type="datetime-local"
                      required
                      defaultValue={editingEvent?.eventTime ? new Date(editingEvent.eventTime).toISOString().slice(0, 16) : ""}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-medium">Thời Lượng</Label>
                    <Input
                      id="duration"
                      name="duration"
                      placeholder="2 giờ"
                      defaultValue={editingEvent?.duration || ""}
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Địa Điểm</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Nhà thờ chính tòa"
                      defaultValue={editingEvent?.location || ""}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-sm font-medium">Thứ Tự Hiển Thị</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      defaultValue={editingEvent?.order || 0}
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-sm font-medium">Biểu Tượng</Label>
                  <Select name="icon" defaultValue={editingEvent?.icon || "calendar"}>
                    <SelectTrigger className="h-12">
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
                    className="rounded-lg shadow-lg"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingEvent ? "💾 Cập Nhật" : "📤 Tạo"} Sự Kiện
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-4 mb-6" variants={itemVariants}>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Tổng sự kiện</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.upcoming}</p>
              <p className="text-sm text-muted-foreground">Sắp diễn ra</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.past}</p>
              <p className="text-sm text-muted-foreground">Đã qua</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" variants={itemVariants}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="🔍 Tìm kiếm sự kiện theo tiêu đề, mô tả hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Tất cả thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">⏰ Tất cả</SelectItem>
                <SelectItem value="upcoming">🟢 Sắp tới</SelectItem>
                <SelectItem value="past">🔴 Đã qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </motion.div>

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
              <Card className="animate-pulse">
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
                <Card className="border-dashed">
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Không tìm thấy sự kiện nào</p>
                    <p>
                      {searchTerm || timeFilter !== "all" 
                        ? "Thử thay đổi bộ lọc tìm kiếm" 
                        : "Chưa có sự kiện nào trong lịch trình"
                      }
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              sortedEvents.map((event, index) => {
                const IconComponent = getIconComponent(event.icon || "calendar");
                const status = getEventStatus(event.eventTime);
                
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
                    <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <IconComponent className="text-primary" size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-xl text-foreground">
                                  {event.title}
                                </CardTitle>
                                <Badge className={status.color}>
                                  {status.label}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {new Date(event.eventTime).toLocaleString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                {event.duration && (
                                  <div className="flex items-center gap-1">
                                    <span>⏱️ {event.duration}</span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              onClick={() => {
                                setEditingEvent(event);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Pencil size={14} />
                            </Button>
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
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {event.description && (
                          <motion.p 
                            className="text-foreground leading-relaxed text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {event.description}
                          </motion.p>
                        )}
                        
                        <div className="flex justify-between items-center mt-3">
                          <Badge variant="outline" className="text-xs">
                            Thứ tự: {event.order}
                          </Badge>
                          
                          {status.status === "soon" && (
                            <Badge variant="default" className="bg-orange-500 text-white animate-pulse">
                              ⚡ Sắp diễn ra!
                            </Badge>
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
    </motion.div>
  );
}