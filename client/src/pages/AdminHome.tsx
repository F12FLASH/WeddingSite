import { Users, MessageSquare, Calendar, Heart, Image, TrendingUp, Clock, CheckCircle, XCircle, ImagePlus, Video, Crown, Sparkles, Gift, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Rsvp, GuestMessage, Photo, CoupleInfo, GuestPhoto, LivestreamInfo } from "@shared/schema";

export default function AdminHome() {
  const { data: rsvps = [] } = useQuery<Rsvp[]>({
    queryKey: ['/api/rsvps'],
  });

  const { data: messages = [] } = useQuery<GuestMessage[]>({
    queryKey: ['/api/messages'],
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  const { data: guestPhotos = [] } = useQuery<GuestPhoto[]>({
    queryKey: ['/api/guest-photos'],
  });

  const { data: livestream } = useQuery<LivestreamInfo | null>({
    queryKey: ['/api/livestream'],
  });

  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ['/api/couple'],
  });

  const attendingCount = rsvps.filter(r => r.attending).length;
  const decliningCount = rsvps.filter(r => !r.attending).length;
  const pendingMessages = messages.filter(m => !m.approved).length;
  const pendingGuestPhotos = guestPhotos.filter(p => !p.approved).length;
  const totalGuests = rsvps.reduce((sum, rsvp) => sum + (rsvp.attending ? rsvp.guestCount : 0), 0);
  const responseRate = rsvps.length > 0 ? Math.round((attendingCount / rsvps.length) * 100) : 0;

  const weddingDate = coupleInfo?.weddingDate ? new Date(coupleInfo.weddingDate) : new Date('2025-06-15');
  const today = new Date();
  const daysUntilWedding = Math.max(0, Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const stats = [
    {
      title: "Số Ngày Đến Đám Cưới",
      value: daysUntilWedding.toString(),
      icon: Calendar,
      description: weddingDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
      color: "text-rose-600",
      bgColor: "bg-gradient-to-br from-rose-500/15 to-pink-500/10",
      borderColor: "border-rose-500/40",
      trend: "Đang đếm ngược",
      trendUp: false,
      progress: Math.max(0, 100 - Math.round((daysUntilWedding / 180) * 100)),
      featured: true,
      gradient: "from-rose-500/20 to-pink-500/20",
    },
    {
      title: "Tổng Số RSVP",
      value: rsvps.length.toString(),
      icon: Users,
      description: `${attendingCount} tham dự, ${decliningCount} từ chối`,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-500/15 to-cyan-500/10",
      borderColor: "border-blue-500/40",
      trend: `${totalGuests} khách tổng`,
      trendUp: true,
      progress: responseRate,
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Tin Nhắn Khách Mời",
      value: messages.length.toString(),
      icon: MessageSquare,
      description: `${pendingMessages} chờ phê duyệt`,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-500/15 to-green-500/10",
      borderColor: "border-emerald-500/40",
      trend: pendingMessages > 0 ? `+${pendingMessages} mới` : "Đã xử lý hết",
      trendUp: messages.length > 0,
      progress: messages.length > 0 ? Math.round(((messages.length - pendingMessages) / messages.length) * 100) : 100,
      gradient: "from-emerald-500/20 to-green-500/20",
    },
    {
      title: "Album Ảnh",
      value: photos.length.toString(),
      icon: Image,
      description: "Ảnh đám cưới đã tải",
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-500/15 to-purple-500/10",
      borderColor: "border-violet-500/40",
      trend: photos.length > 0 ? `${photos.length} ảnh` : "Chưa có ảnh",
      trendUp: photos.length > 0,
      progress: Math.min(100, photos.length * 5),
      gradient: "from-violet-500/20 to-purple-500/20",
    },
    {
      title: "Ảnh Khách Upload",
      value: guestPhotos.length.toString(),
      icon: ImagePlus,
      description: `${pendingGuestPhotos} chờ duyệt`,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-500/15 to-blue-500/10",
      borderColor: "border-indigo-500/40",
      trend: pendingGuestPhotos > 0 ? `+${pendingGuestPhotos} mới` : "Đã duyệt hết",
      trendUp: guestPhotos.length > 0,
      progress: guestPhotos.length > 0 ? Math.round(((guestPhotos.length - pendingGuestPhotos) / guestPhotos.length) * 100) : 100,
      gradient: "from-indigo-500/20 to-blue-500/20",
    },
    {
      title: "Livestream",
      value: livestream?.isActive ? "ĐÃ BẬT" : "TẮT",
      icon: Video,
      description: livestream?.platform || "Chưa cấu hình",
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-500/15 to-rose-500/10",
      borderColor: "border-red-500/40",
      trend: livestream?.isActive ? "Đang live" : "Chưa live",
      trendUp: livestream?.isActive || false,
      progress: livestream?.isActive ? 100 : 0,
      gradient: "from-red-500/20 to-rose-500/20",
    },
    {
      title: "Tỷ Lệ Xác Nhận",
      value: `${responseRate}%`,
      icon: TrendingUp,
      description: `${attendingCount}/${rsvps.length} tham dự`,
      color: "text-cyan-600",
      bgColor: "bg-gradient-to-br from-cyan-500/15 to-sky-500/10",
      borderColor: "border-cyan-500/40",
      trend: rsvps.length > 0 ? `${rsvps.length} phản hồi` : "Chưa có phản hồi",
      trendUp: true,
      progress: responseRate,
      gradient: "from-cyan-500/20 to-sky-500/20",
    },
  ];

  const recentRsvps = [...rsvps]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const recentMessages = [...messages]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const recentActivity = [
    ...recentRsvps
      .filter(r => r.createdAt)
      .map(r => ({
        type: 'rsvp' as const,
        name: r.guestName,
        action: r.attending ? 'đã xác nhận tham dự' : 'đã từ chối tham dự',
        time: formatTimeAgo(new Date(r.createdAt!)),
        timestamp: new Date(r.createdAt!).getTime(),
        guestCount: r.guestCount
      })),
    ...recentMessages
      .filter(m => m.createdAt)
      .map(m => ({
        type: 'message' as const,
        name: m.guestName,
        action: 'đã gửi lời chúc',
        time: formatTimeAgo(new Date(m.createdAt!)),
        timestamp: new Date(m.createdAt!).getTime(),
        message: m.message
      })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

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
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rsvp': return <Users size={20} className="text-blue-600" />;
      case 'message': return <MessageSquare size={20} className="text-emerald-600" />;
      default: return <Heart size={20} className="text-rose-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'rsvp': return 'bg-gradient-to-br from-blue-500/15 to-blue-600/10 text-blue-700 border-blue-500/30';
      case 'message': return 'bg-gradient-to-br from-emerald-500/15 to-green-600/10 text-emerald-700 border-emerald-500/30';
      default: return 'bg-gradient-to-br from-rose-500/15 to-pink-600/10 text-rose-700 border-rose-500/30';
    }
  };

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 pb-8"
    >
      {/* Hero Header */}
      <motion.div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 p-8 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
        
        <motion.div variants={itemVariants} className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <motion.div 
                className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Crown size={48} className="text-white" />
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2 drop-shadow-2xl">
                  Tổng Quan
                </h1>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg font-light">
                  Quản lý đám cưới của bạn một cách hoàn hảo
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <Sparkles size={20} className="text-amber-300" />
                  <span className="text-white/80 text-lg">Mọi thứ trong tầm tay bạn</span>
                </div>
              </div>
            </div>
            
            {coupleInfo && (
              <motion.div 
                className="bg-white/20 backdrop-blur-xl rounded-2xl px-8 py-6 border-2 border-white/30 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <p className="text-white/80 text-sm mb-2 font-medium">Cặp đôi</p>
                <p className="text-white font-bold text-2xl">
                  {coupleInfo.brideName} 💝 {coupleInfo.groomName}
                </p>
                <div className="flex items-center gap-2 mt-3 text-white/70">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">
                    {weddingDate.toLocaleDateString('vi-VN', { 
                      weekday: 'long',
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className={stat.featured ? "md:col-span-2 lg:col-span-2" : ""}
          >
            <Card className={`border-2 ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm relative overflow-hidden group h-full shadow-xl hover:shadow-2xl transition-all duration-500`}>
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <CardContent className={`relative z-10 h-full flex flex-col ${stat.featured ? 'p-8' : 'p-6'}`}>
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className={`p-4 rounded-2xl ${stat.bgColor} border-2 ${stat.borderColor} shadow-lg backdrop-blur-sm`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className={`${stat.featured ? 'h-10 w-10' : 'h-8 w-8'} ${stat.color}`} />
                  </motion.div>
                  <Badge 
                    variant={stat.trendUp ? "default" : "secondary"} 
                    className={`text-xs font-bold px-4 py-2 rounded-xl border-2 backdrop-blur-sm ${
                      stat.trendUp 
                        ? 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30 border-emerald-500/40 dark:text-emerald-400' 
                        : 'bg-slate-500/20 text-slate-700 hover:bg-slate-500/30 border-slate-500/40 dark:text-slate-400'
                    }`}
                  >
                    {stat.trend}
                  </Badge>
                </div>

                <div className="space-y-5 flex-1">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {stat.title}
                    </h3>
                    <div className={`${stat.featured ? 'text-6xl' : 'text-5xl'} font-black text-foreground mb-4 leading-none`} data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
                      {stat.description}
                    </p>
                  </div>

                  {stat.progress !== undefined && (
                    <div className="space-y-3 pt-3">
                      <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2">
                        <span>Tiến độ</span>
                        <span>{stat.progress}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={stat.progress} className="h-3.5 bg-muted/50 rounded-full" />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-current to-current opacity-20 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity - Left Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card className="border-2 border-blue-500/30 shadow-2xl h-full overflow-hidden bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10">
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-500/10 to-transparent border-b border-blue-500/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-4 text-3xl">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Clock className="text-white" size={32} />
                  </div>
                  <div>
                    Hoạt Động Gần Đây
                    <CardDescription className="text-lg mt-2 font-semibold text-blue-700/80 dark:text-blue-300/80">
                      Cập nhật mới nhất từ hệ thống
                    </CardDescription>
                  </div>
                </CardTitle>
                <Badge variant="outline" className="text-sm font-bold px-4 py-2 bg-blue-500/10 text-blue-700 border-blue-500/30">
                  {recentActivity.length} hoạt động
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-blue-500/10">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-5 p-7 hover:bg-white/60 dark:hover:bg-blue-950/20 transition-all duration-300 group cursor-pointer border-b border-blue-500/5 last:border-b-0"
                      variants={itemVariants}
                      whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <div className={`p-4 rounded-2xl border-2 shadow-md ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="font-black text-foreground text-lg">
                          {activity.name}
                        </p>
                        <p className="text-base text-muted-foreground font-medium">
                          {activity.action}
                          {activity.type === 'rsvp' && activity.guestCount > 0 && activity.action.includes('tham dự') && (
                            <span className="text-blue-600 font-bold"> • {activity.guestCount} khách</span>
                          )}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-muted-foreground whitespace-nowrap bg-white/80 dark:bg-blue-950/30 px-5 py-2.5 rounded-2xl border border-blue-500/20 shadow-sm">
                        {activity.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center text-muted-foreground">
                  <Clock className="mx-auto mb-5 opacity-20" size={64} />
                  <p className="font-bold text-xl mb-2">Chưa có hoạt động nào</p>
                  <p className="text-lg">Sẽ hiển thị ở đây khi có cập nhật mới</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Recent RSVPs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-2 border-blue-500/30 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10">
              <CardHeader className="pb-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-500/20">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                    <Users className="text-white" size={28} />
                  </div>
                  <div>
                    RSVP Gần Đây
                    <CardDescription className="text-base mt-1.5 font-semibold text-blue-700/80 dark:text-blue-300/80">
                      Phản hồi mới nhất
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentRsvps.length > 0 ? (
                  <div className="divide-y divide-blue-500/10">
                    {recentRsvps.slice(0, 4).map((rsvp) => (
                      <motion.div
                        key={rsvp.id}
                        className="flex items-center justify-between p-6 hover:bg-white/60 dark:hover:bg-blue-950/20 transition-all duration-300 group"
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3.5 rounded-2xl border-2 shadow-md ${
                            rsvp.attending
                              ? "bg-gradient-to-br from-emerald-500/20 to-green-500/15 text-emerald-700 border-emerald-500/40" 
                              : "bg-gradient-to-br from-red-500/20 to-rose-500/15 text-red-700 border-red-500/40"
                          }`}>
                            {rsvp.attending ? 
                              <CheckCircle size={24} /> : 
                              <XCircle size={24} />
                            }
                          </div>
                          <div className="space-y-1.5">
                            <p className="font-black text-foreground text-base">{rsvp.guestName}</p>
                            <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                              <span className={rsvp.attending ? "text-emerald-600" : "text-red-600"}>
                                {rsvp.attending ? "Tham dự" : "Từ chối"}
                              </span>
                              {rsvp.guestCount > 0 && rsvp.attending && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600">{rsvp.guestCount} khách</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center text-muted-foreground">
                    <Users className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-bold text-lg mb-1">Chưa có RSVP</p>
                    <p className="text-sm">Khách mời sẽ xuất hiện ở đây</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-2 border-emerald-500/30 shadow-2xl overflow-hidden bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10">
              <CardHeader className="pb-5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-emerald-500/20">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                    <MessageSquare className="text-white" size={28} />
                  </div>
                  <div>
                    Tin Nhắn Mới
                    <CardDescription className="text-base mt-1.5 font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                      Lời chúc gần đây
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentMessages.length > 0 ? (
                  <div className="divide-y divide-emerald-500/10">
                    {recentMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className="p-6 hover:bg-white/60 dark:hover:bg-emerald-950/20 transition-all duration-300 group cursor-pointer"
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="font-black text-foreground text-base">{msg.guestName}</p>
                          {!msg.approved && (
                            <Badge variant="outline" className="text-xs font-bold px-3 py-1.5 bg-amber-500/10 text-amber-700 border-amber-500/30">
                              Chờ duyệt
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium group-hover:text-foreground/80 transition-colors">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-emerald-600">
                          <Heart size={14} className="fill-current" />
                          <span className="text-xs font-semibold">Lời chúc</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center text-muted-foreground">
                    <MessageSquare className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-bold text-lg mb-1">Chưa có tin nhắn</p>
                    <p className="text-sm">Lời chúc sẽ xuất hiện ở đây</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}