import { Users, MessageSquare, Calendar, Heart, Gift, Image, TrendingUp, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Rsvp, GuestMessage, Photo, RegistryItem, CoupleInfo } from "@shared/schema";

export default function AdminHome() {
  // Fetch real data from database
  const { data: rsvps = [] } = useQuery<Rsvp[]>({
    queryKey: ['/api/rsvps'],
  });

  const { data: messages = [] } = useQuery<GuestMessage[]>({
    queryKey: ['/api/messages'],
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  const { data: registryItems = [] } = useQuery<RegistryItem[]>({
    queryKey: ['/api/registry'],
  });

  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ['/api/couple'],
  });

  // Calculate real statistics
  const attendingCount = rsvps.filter(r => r.attending).length;
  const decliningCount = rsvps.filter(r => !r.attending).length;
  const pendingMessages = messages.filter(m => !m.approved).length;
  const purchasedItems = registryItems.filter(i => i.isPurchased).length;
  const totalGuests = rsvps.reduce((sum, rsvp) => sum + (rsvp.attending ? rsvp.guestCount : 0), 0);
  const responseRate = rsvps.length > 0 ? Math.round((rsvps.length / (rsvps.length + 25)) * 100) : 0; // Assuming 25 more expected
  const purchaseProgress = registryItems.length > 0 ? Math.round((purchasedItems / registryItems.length) * 100) : 0;

  // Calculate days until wedding
  const weddingDate = coupleInfo?.weddingDate ? new Date(coupleInfo.weddingDate) : new Date('2025-06-15');
  const today = new Date();
  const daysUntilWedding = Math.max(0, Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const stats = [
    {
      title: "Tổng Số RSVP",
      value: rsvps.length.toString(),
      icon: Users,
      description: `${attendingCount} tham dự, ${decliningCount} từ chối`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      trend: `${totalGuests} khách tổng`,
      trendUp: true,
      progress: attendingCount > 0 ? Math.round((attendingCount / rsvps.length) * 100) : 0
    },
    {
      title: "Tin Nhắn Khách Mời",
      value: messages.length.toString(),
      icon: MessageSquare,
      description: `${pendingMessages} chờ phê duyệt`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      trend: pendingMessages > 0 ? `+${pendingMessages} mới` : "Đã xử lý hết",
      trendUp: messages.length > 0,
      progress: messages.length > 0 ? Math.round(((messages.length - pendingMessages) / messages.length) * 100) : 100
    },
    {
      title: "Số Ngày Đến Đám Cưới",
      value: daysUntilWedding.toString(),
      icon: Calendar,
      description: weddingDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      trend: "Đang đếm ngược",
      trendUp: false,
      progress: Math.max(0, 100 - Math.round((daysUntilWedding / 365) * 100))
    },
    {
      title: "Thư Viện Ảnh",
      value: photos.length.toString(),
      icon: Image,
      description: "Ảnh đã tải lên",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      trend: photos.length > 0 ? `${photos.length} ảnh` : "Chưa có ảnh",
      trendUp: photos.length > 0,
      progress: Math.min(100, photos.length * 2)
    },
    {
      title: "Quà Đã Đăng Ký",
      value: registryItems.length.toString(),
      icon: Gift,
      description: `${purchasedItems} đã được mua`,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      trend: `${purchaseProgress}% hoàn thành`,
      trendUp: purchasedItems > 0,
      progress: purchaseProgress
    },
    {
      title: "Tỷ Lệ Phản Hồi",
      value: `${responseRate}%`,
      icon: TrendingUp,
      description: `${rsvps.length} đã phản hồi`,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      trend: rsvps.length > 0 ? `${rsvps.length} phản hồi` : "Chưa có phản hồi",
      trendUp: true,
      progress: responseRate
    },
  ];

  // Get recent RSVPs
  const recentRsvps = [...rsvps]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // Get recent messages
  const recentMessages = [...messages]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  // Get recent activity - combine RSVPs and Messages
  const recentActivity = [
    ...recentRsvps.map(r => ({
      type: 'rsvp' as const,
      name: r.guestName,
      action: r.attending ? 'đã xác nhận tham dự' : 'đã từ chối tham dự',
      time: r.createdAt ? formatTimeAgo(new Date(r.createdAt)) : 'Vừa xong',
      timestamp: r.createdAt ? new Date(r.createdAt).getTime() : Date.now()
    })),
    ...recentMessages.map(m => ({
      type: 'message' as const,
      name: m.guestName,
      action: 'đã gửi lời chúc',
      time: m.createdAt ? formatTimeAgo(new Date(m.createdAt)) : 'Vừa xong',
      timestamp: m.createdAt ? new Date(m.createdAt).getTime() : Date.now()
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rsvp': return <Users size={18} className="text-blue-500" />;
      case 'message': return <MessageSquare size={18} className="text-green-500" />;
      case 'gift': return <Gift size={18} className="text-pink-500" />;
      case 'photo': return <Image size={18} className="text-purple-500" />;
      default: return <Heart size={18} className="text-primary" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'rsvp': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'message': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'gift': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'photo': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
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
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-3">
            🎊 Tổng Quan Bảng Điều Khiển
          </h2>
          <p className="text-xl text-muted-foreground">
            Chào mừng trở lại! Đây là tổng quan về đám cưới của bạn.
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className="h-full"
          >
            <Card className={`border-2 ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm relative overflow-hidden group h-full`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-6 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bgColor} border ${stat.borderColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge 
                    variant={stat.trendUp ? "default" : "secondary"} 
                    className={`text-xs font-medium ${
                      stat.trendUp 
                        ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30 border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30 border-orange-500/30'
                    }`}
                  >
                    {stat.trendUp ? "↗" : "↘"} {stat.trend}
                  </Badge>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/80 mb-1">
                      {stat.title}
                    </h3>
                    <div className="text-3xl font-bold text-foreground mb-2" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </div>

                  {stat.progress !== undefined && (
                    <div className="space-y-2">
                      <Progress value={stat.progress} className="h-2 bg-muted/50" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Tiến độ</span>
                        <span>{stat.progress}%</span>
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
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="xl:col-span-2"
        >
          <Card className="border-2 border-border/50 shadow-lg h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Clock className="text-blue-500" size={24} />
                  </div>
                  <div>
                    Hoạt Động Gần Đây
                    <CardDescription className="text-base mt-1">
                      Cập nhật mới nhất từ hệ thống
                    </CardDescription>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 p-6 hover:bg-muted/30 transition-all duration-300 group"
                      variants={itemVariants}
                      whileHover={{ x: 8 }}
                    >
                      <div className={`p-3 rounded-xl border ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-semibold text-foreground text-base">
                          {activity.name}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
                        {activity.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  Chưa có hoạt động nào
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent RSVPs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-2 border-blue-500/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div>
                    RSVP Gần Đây
                    <CardDescription className="text-base mt-1">
                      Phản hồi mới nhất
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentRsvps.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {recentRsvps.map((rsvp, i) => (
                      <motion.div
                        key={rsvp.id}
                        className="flex items-center justify-between p-6 hover:bg-muted/30 transition-all duration-300 group"
                        variants={itemVariants}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${
                            rsvp.attending
                              ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                              : "bg-red-500/10 text-red-600 border border-red-500/20"
                          }`}>
                            {rsvp.attending ? 
                              <CheckCircle size={18} /> : 
                              <XCircle size={18} />
                            }
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground text-base">{rsvp.guestName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{rsvp.attending ? "Tham dự" : "Từ chối"}</span>
                              {rsvp.guestCount > 0 && rsvp.attending && (
                                <>
                                  <span>•</span>
                                  <span>{rsvp.guestCount} khách</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
                          {rsvp.createdAt ? formatTimeAgo(new Date(rsvp.createdAt)) : 'Vừa xong'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Chưa có RSVP nào
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
            <Card className="border-2 border-green-500/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-500/10 rounded-xl">
                    <MessageSquare className="text-green-500" size={24} />
                  </div>
                  <div>
                    Tin Nhắn Gần Đây
                    <CardDescription className="text-base mt-1">
                      Lời chúc mới nhất
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentMessages.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {recentMessages.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        className="p-6 hover:bg-muted/30 transition-all duration-300 group cursor-pointer"
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="font-semibold text-foreground text-base">{msg.guestName}</p>
                          <div className="text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
                            {msg.createdAt ? formatTimeAgo(new Date(msg.createdAt)) : 'Vừa xong'}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors">
                          {msg.message}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Chưa có tin nhắn nào
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
