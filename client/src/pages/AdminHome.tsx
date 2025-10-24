import { Users, MessageSquare, Calendar, Heart, Gift, Image, TrendingUp, Clock, CheckCircle, XCircle, Plus, Settings, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    trendUp: true,
    progress: 75
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
    trendUp: true,
    progress: 90
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
    trendUp: false,
    progress: 60
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
    trendUp: true,
    progress: 40
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
    trendUp: true,
    progress: 65
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
    trendUp: true,
    progress: 78
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
      { type: 'rsvp', name: 'John Smith', action: 'declined', time: '3 giờ trước' },
    ]
  });

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

        {/* Welcome Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">
                    💝 Chúc mừng đám cưới!
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Mọi thứ đang diễn ra tuyệt vời. Tiếp tục phát huy nhé!
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-xl">
                    <Settings size={18} className="mr-2" />
                    Cài Đặt
                  </Button>
                  <Button className="rounded-xl bg-primary hover:bg-primary/90">
                    <Plus size={18} className="mr-2" />
                    Thêm Mới
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </div>

                  {stat.progress && (
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
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <Eye size={16} className="mr-2" />
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
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
                <div className="divide-y divide-border/50">
                  {[
                    { name: "Emily Johnson", status: "Tham dự", guests: 2, time: "2 phút trước" },
                    { name: "David Chen", status: "Tham dự", guests: 1, time: "15 phút trước" },
                    { name: "Maria Garcia", status: "Từ chối", guests: 0, time: "1 giờ trước" },
                    { name: "John Smith", status: "Tham dự", guests: 3, time: "2 giờ trước" },
                    { name: "Sarah Wilson", status: "Tham dự", guests: 2, time: "3 giờ trước" },
                  ].map((rsvp, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-6 hover:bg-muted/30 transition-all duration-300 group"
                      variants={itemVariants}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${
                          rsvp.status === "Tham dự" 
                            ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                            : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}>
                          {rsvp.status === "Tham dự" ? 
                            <CheckCircle size={18} /> : 
                            <XCircle size={18} />
                          }
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground text-base">{rsvp.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{rsvp.status}</span>
                            {rsvp.guests > 0 && (
                              <>
                                <span>•</span>
                                <span>{rsvp.guests} khách</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
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
                <div className="divide-y divide-border/50">
                  {[
                    { name: "Sarah Miller", preview: "Rất mong chờ ngày trọng đại của hai bạn! Chúc các bạn hạnh phúc mãi mãi...", time: "5 phút trước" },
                    { name: "John Smith", preview: "Chúc mừng cả hai! Thật tuyệt vời khi được chứng kiến tình yêu của các bạn...", time: "30 phút trước" },
                    { name: "Lisa Wang", preview: "Không thể chờ để ăn mừng cùng các bạn! Chúc các bạn một cuộc sống hôn nhân...", time: "1 giờ trước" },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      className="p-6 hover:bg-muted/30 transition-all duration-300 group cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-semibold text-foreground text-base">{msg.name}</p>
                        <div className="text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
                          {msg.time}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors">
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