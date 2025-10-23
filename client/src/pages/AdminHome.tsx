import { Users, MessageSquare, Calendar, Heart, Gift, Image, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const stats = [
  {
    title: "Tổng Số RSVP",
    value: "87",
    icon: Users,
    description: "65 tham dự, 22 từ chối",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    trend: "+12 tuần này",
    trendUp: true
  },
  {
    title: "Tin Nhắn Khách Mời",
    value: "124",
    icon: MessageSquare,
    description: "12 chờ phê duyệt",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    trend: "+8 mới",
    trendUp: true
  },
  {
    title: "Số Ngày Đến Đám Cưới",
    value: "120",
    icon: Calendar,
    description: "Ngày 15 tháng 6, 2025",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    trend: "Đang đếm ngược",
    trendUp: false
  },
  {
    title: "Thư Viện Ảnh",
    value: "48",
    icon: Image,
    description: "Ảnh đã tải lên",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    trend: "+5 mới",
    trendUp: true
  },
  {
    title: "Quà Đã Đăng Ký",
    value: "23",
    icon: Gift,
    description: "15 đã được mua",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    trend: "65% hoàn thành",
    trendUp: true
  },
  {
    title: "Tỷ Lệ Phản Hồi",
    value: "78%",
    icon: TrendingUp,
    description: "87/112 đã phản hồi",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    trend: "+5% so với tuần trước",
    trendUp: true
  },
];

export default function AdminHome() {
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['/api/admin/activity'],
    placeholderData: [
      { type: 'rsvp', name: 'Emily Johnson', action: 'confirmed', time: '2 phút trước' },
      { type: 'message', name: 'David Chen', action: 'sent message', time: '5 phút trước' },
      { type: 'gift', name: 'Maria Garcia', action: 'purchased gift', time: '1 giờ trước' },
      { type: 'photo', name: 'System', action: 'new photo uploaded', time: '2 giờ trước' },
    ]
  });

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
      y: -5,
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
      case 'rsvp': return <Users size={16} className="text-blue-500" />;
      case 'message': return <MessageSquare size={16} className="text-green-500" />;
      case 'gift': return <Gift size={16} className="text-pink-500" />;
      case 'photo': return <Image size={16} className="text-purple-500" />;
      default: return <Heart size={16} className="text-primary" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'rsvp': return 'bg-blue-500/10 text-blue-600';
      case 'message': return 'bg-green-500/10 text-green-600';
      case 'gift': return 'bg-pink-500/10 text-pink-600';
      case 'photo': return 'bg-purple-500/10 text-purple-600';
      default: return 'bg-primary/10 text-primary';
    }
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
        <motion.h2 
          className="text-3xl font-serif mb-2 text-foreground" 
          data-testid="heading-dashboard"
          variants={itemVariants}
        >
          🎊 Tổng Quan Bảng Điều Khiển
        </motion.h2>
        <motion.p 
          className="text-muted-foreground text-lg"
          variants={itemVariants}
        >
          Chào mừng trở lại! Đây là tổng quan về đám cưới của bạn.
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            data-testid={`stat-${index}`}
          >
            <Card className={`border-2 ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm relative overflow-hidden group`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-foreground/80">
                  {stat.title}
                </CardTitle>
                <motion.div
                  className={`p-2 rounded-lg ${stat.bgColor}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-end justify-between mb-2">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <Badge 
                    variant={stat.trendUp ? "default" : "secondary"} 
                    className={`text-xs ${
                      stat.trendUp 
                        ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' 
                        : 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30'
                    }`}
                  >
                    {stat.trendUp ? "↗" : "↘"} {stat.trend}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Recent Activity & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  Hoạt Động Gần Đây
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group"
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      data-testid={`recent-activity-${i}`}
                    >
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {activity.name}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 Hành Động Nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col gap-1">
                    <Users size={20} />
                    <span className="text-xs">Quản lý RSVP</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-1">
                    <MessageSquare size={20} />
                    <span className="text-xs">Duyệt tin nhắn</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-1">
                    <Image size={20} />
                    <span className="text-xs">Thêm ảnh</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-1">
                    <Gift size={20} />
                    <span className="text-xs">Quản lý quà</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Recent RSVPs & Messages */}
        <div className="space-y-6">
          {/* Recent RSVPs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-blue-500" size={20} />
                  RSVP Gần Đây
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    { name: "Emily Johnson", status: "Tham dự", guests: 2, time: "2 phút trước" },
                    { name: "David Chen", status: "Tham dự", guests: 1, time: "15 phút trước" },
                    { name: "Maria Garcia", status: "Từ chối", guests: 0, time: "1 giờ trước" },
                    { name: "John Smith", status: "Tham dự", guests: 3, time: "2 giờ trước" },
                  ].map((rsvp, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                      variants={itemVariants}
                      data-testid={`recent-rsvp-${i}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${
                          rsvp.status === "Tham dự" 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-red-500/20 text-red-600"
                        }`}>
                          {rsvp.status === "Tham dự" ? 
                            <CheckCircle size={16} /> : 
                            <XCircle size={16} />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{rsvp.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {rsvp.status}
                            {rsvp.guests > 0 && ` • ${rsvp.guests} khách`}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {rsvp.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="text-green-500" size={20} />
                  Tin Nhắn Gần Đây
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    { name: "Sarah Miller", preview: "Rất mong chờ ngày trọng đại của hai bạn!", time: "5 phút trước" },
                    { name: "John Smith", preview: "Chúc mừng cả hai...", time: "30 phút trước" },
                    { name: "Lisa Wang", preview: "Không thể chờ để ăn mừng cùng các bạn!", time: "1 giờ trước" },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      className="p-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      data-testid={`recent-message-${i}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">{msg.name}</p>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {msg.time}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {msg.preview}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}