import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Image,
  Gift,
  Settings,
  Heart,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Sparkles,
  Home,
  ExternalLink,
  CheckCircle,
  ImagePlus,
  DollarSign,
  Video,
  MapPin,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import type { Rsvp, GuestMessage, GuestPhoto } from "@shared/schema";

const menuItems = [
  {
    title: "Tổng Quan",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Xem tổng quan đám cưới",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Cô Dâu & Chú Rể",
    url: "/admin/couple",
    icon: Heart,
    description: "Quản lý thông tin cặp đôi",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20"
  },
  {
    title: "Lịch Trình",
    url: "/admin/schedule",
    icon: Calendar,
    description: "Quản lý lịch trình sự kiện",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20"
  },
  {
    title: "Album Ảnh",
    url: "/admin/gallery",
    icon: Image,
    description: "Quản lý hình ảnh đám cưới",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20"
  },
  {
    title: "Lời Chúc",
    url: "/admin/messages",
    icon: MessageSquare,
    description: "Xem và quản lý lời chúc",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20"
  },
  {
    title: "Danh Sách Khách",
    url: "/admin/rsvps",
    icon: Users,
    description: "Quản lý RSVP và khách mời",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20"
  },
  {
    title: "Đội Ngũ Đám Cưới",
    url: "/admin/wedding-party",
    icon: Users,
    description: "Quản lý phù dâu, phù rể",
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/20"
  },
  {
    title: "Quà Mừng",
    url: "/admin/registry",
    icon: Gift,
    description: "Quản lý danh sách quà",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
  },
  {
    title: "Ảnh Khách Upload",
    url: "/admin/guest-photos",
    icon: ImagePlus,
    description: "Quản lý ảnh khách tải lên",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20"
  },
  {
    title: "Livestream",
    url: "/admin/livestream",
    icon: Video,
    description: "Cài đặt trực tiếp online",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20"
  },
  {
    title: "Địa Điểm",
    url: "/admin/location",
    icon: MapPin,
    description: "Quản lý thông tin địa điểm",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Popup Thiệp",
    url: "/admin/popups",
    icon: Bell,
    description: "Quản lý popup thiệp mời",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20"
  },
  {
    title: "Tài Khoản",
    url: "/admin/account",
    icon: User,
    description: "Quản lý tài khoản admin",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20"
  },
  {
    title: "Cài Đặt",
    url: "/admin/settings",
    icon: Settings,
    description: "Cài đặt website",
    color: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-950/20"
  },
];

export default function AdminDashboard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const { data: rsvps = [] } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const { data: messages = [] } = useQuery<GuestMessage[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const { data: guestPhotos = [] } = useQuery<GuestPhoto[]>({
    queryKey: ["/api/guest-photos"],
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const recentRsvps = rsvps.slice(-5).reverse();
  const recentMessages = messages.filter(m => !m.approved).slice(-5);
  const recentGuestPhotos = guestPhotos.filter(p => !p.approved).slice(-5);
  
  // Filter out viewed notifications
  const unviewedRsvps = recentRsvps.filter(r => !viewedNotifications.has(`rsvp-${r.id}`));
  const unviewedMessages = recentMessages.filter(m => !viewedNotifications.has(`message-${m.id}`));
  const unviewedGuestPhotos = recentGuestPhotos.filter(p => !viewedNotifications.has(`guestphoto-${p.id}`));
  const notifications = unviewedRsvps.length + unviewedMessages.length + unviewedGuestPhotos.length;

  // Initialize AudioContext once on first user interaction
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          setAudioContext(ctx);
          // Resume context on user interaction (required by browsers)
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        } catch (error) {
          console.error('Error initializing audio context:', error);
        }
      }
    };

    // Initialize on first click
    const handleClick = () => {
      initAudioContext();
      document.removeEventListener('click', handleClick);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [audioContext]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioContext]);

  // Save viewed notifications to localStorage
  useEffect(() => {
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(viewedNotifications)));
  }, [viewedNotifications]);

  // Play notification sound when count increases
  useEffect(() => {
    if (previousNotificationCount > 0 && notifications > previousNotificationCount) {
      // Play notification sound using Web Audio API
      playNotificationSound();
      
      toast({
        title: "🔔 Thông báo mới!",
        description: `Bạn có ${notifications - previousNotificationCount} thông báo mới`,
      });
    }
    setPreviousNotificationCount(notifications);
  }, [notifications]);

  const markAllAsRead = () => {
    const newViewed = new Set(viewedNotifications);
    recentRsvps.forEach(r => newViewed.add(`rsvp-${r.id}`));
    recentMessages.forEach(m => newViewed.add(`message-${m.id}`));
    recentGuestPhotos.forEach(p => newViewed.add(`guestphoto-${p.id}`));
    setViewedNotifications(newViewed);
  };

  const markAsRead = (id: string, type: 'rsvp' | 'message' | 'guestphoto') => {
    const notificationId = `${type}-${id}`;
    const newViewed = new Set(viewedNotifications);
    newViewed.add(notificationId);
    setViewedNotifications(newViewed);
  };

  // Function to play notification sound using shared AudioContext
  const playNotificationSound = () => {
    if (!audioContext || audioContext.state === 'closed') {
      console.warn('AudioContext not available');
      return;
    }

    try {
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create oscillator for beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure sound
      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      // Clean up oscillator after it stops
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "🔐 Chưa đăng nhập",
        description: "Vui lòng đăng nhập để truy cập trang quản lý",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "👋 Đang đăng xuất...",
      description: "Đang chuyển về trang chủ",
    });
    
    setTimeout(() => {
      window.location.href = "/api/logout";
    }, 300);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <Heart size={80} className="text-rose-500 dark:text-rose-400 mx-auto" fill="currentColor" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles size={80} className="text-pink-400/30 dark:text-pink-300/20" />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-foreground text-xl font-medium"
          >
            Đang tải trang quản lý...
          </motion.p>
        </motion.div>
      </div>
    );
  }

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden" data-admin-page="true">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="z-50"
        >
          <Sidebar className="w-72 border-r border-border/40 bg-sidebar/98 backdrop-blur-xl shadow-xl">
            <SidebarContent className="gap-0">
              <SidebarGroup>
                {/* Header */}
                <motion.div
                  className="p-6 pb-4 border-b border-border/40"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <SidebarGroupLabel className="text-xl font-cursive text-primary mb-2 flex items-center gap-2">
                    <Heart size={22} fill="currentColor" />
                    Quản Lý Đám Cưới
                  </SidebarGroupLabel>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mt-2">
                    <User size={12} />
                    <span>{user?.name || user?.username || "Admin"}</span>
                  </div>
                </motion.div>

                <SidebarGroupContent className="p-4">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SidebarMenu className="space-y-2">
                      {menuItems.map((item, index) => {
                        const isActive = location === item.url;
                        return (
                          <motion.div key={item.title} variants={itemVariants}>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                asChild
                                className={cn(
                                  "relative group transition-all duration-300 rounded-xl p-3 h-auto",
                                  "hover:shadow-md border",
                                  isActive
                                    ? cn(
                                        "bg-sidebar-accent text-foreground border-primary/40 shadow-md",
                                        item.bgColor
                                      )
                                    : "border-transparent hover:border-border/50 bg-transparent"
                                )}
                              >
                                <Link 
                                  href={item.url} 
                                  data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={cn(
                                      "p-1.5 rounded-lg transition-colors",
                                      isActive ? "bg-white/50 dark:bg-black/20" : "bg-transparent"
                                    )}
                                  >
                                    <item.icon size={18} className={item.color} />
                                  </div>
                                  
                                  <div className="flex-1 text-left">
                                    <span className="font-medium text-sm leading-tight block">
                                      {item.title}
                                    </span>
                                  </div>
                                  
                                  {/* Active indicator */}
                                  {isActive && (
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </motion.div>
                        );
                      })}
                      
                      {/* View Homepage Button */}
                      <motion.div 
                        className="pt-6 mt-3"
                        variants={itemVariants}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link 
                              href="/" 
                              data-testid="link-homepage"
                              className="group relative rounded-2xl p-3.5 h-auto min-h-[60px] text-primary hover:bg-primary/10 hover:text-primary transition-all duration-400 border-2 border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-1.5 rounded-lg bg-primary/10"
                                >
                                  <Home size={18} />
                                </motion.div>
                                <div className="flex-1 text-left">
                                  <span className="font-medium text-sm block">Xem Trang Chủ</span>
                                </div>
                                <ExternalLink size={14} className="opacity-60" />
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </motion.div>

                      {/* Logout Button */}
                      <motion.div 
                        className="pt-3 mt-3 border-t border-border/40"
                        variants={itemVariants}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a 
                              href="/api/logout" 
                              data-testid="button-logout"
                              onClick={handleLogout}
                              className="group relative rounded-2xl p-3.5 h-auto min-h-[60px] text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-400 border-2 border-transparent hover:border-destructive/20"
                            >
                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.1, x: 2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-1.5 rounded-lg bg-destructive/10"
                                >
                                  <LogOut size={18} />
                                </motion.div>
                                <div className="flex-1 text-left">
                                  <span className="font-medium text-sm block">Đăng Xuất</span>
                                </div>
                              </div>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </motion.div>
                    </SidebarMenu>
                  </motion.div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          {/* Header */}
          <motion.header 
            className="flex items-center justify-between p-6 lg:p-8 border-b bg-background/95 backdrop-blur-xl sticky top-0 z-30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <SidebarTrigger 
                data-testid="button-sidebar-toggle"
                className="lg:hidden p-2 hover:bg-accent rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </SidebarTrigger>
              
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart size={20} className="text-white" fill="currentColor" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl lg:text-3xl text-foreground font-bold">
                    Quản Lý Đám Cưới
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trang quản trị hệ thống
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative w-12 h-12 rounded-xl border border-border/50 hover:bg-accent/50"
                      data-testid="button-notifications"
                    >
                      <Bell size={22} />
                      {notifications > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium border-2 border-background"
                        >
                          {notifications}
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Bell size={18} />
                        Thông Báo
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notifications > 0 ? `Bạn có ${notifications} thông báo mới` : "Không có thông báo mới"}
                      </p>
                    </div>
                    {notifications > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                        data-testid="button-mark-all-read"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Đọc hết
                      </Button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <CheckCircle className="mx-auto mb-2" size={32} />
                        <p>Bạn đã xem hết thông báo</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {unviewedRsvps.length > 0 && (
                          <div className="p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">RSVP MỚI</p>
                            {unviewedRsvps.map((rsvp) => (
                              <Link 
                                key={rsvp.id} 
                                href="/admin/rsvps"
                                onClick={() => markAsRead(rsvp.id!, 'rsvp')}
                              >
                                <div className="p-2 hover:bg-muted rounded-lg cursor-pointer mb-1 relative">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                                  <p className="text-sm font-medium pl-3">{rsvp.guestName}</p>
                                  <p className="text-xs text-muted-foreground pl-3">
                                    {rsvp.attending ? "✅ Tham dự" : "❌ Từ chối"} • {rsvp.guestCount} khách
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                        {unviewedMessages.length > 0 && (
                          <div className="p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">LỜI CHÚC CHỜ DUYỆT</p>
                            {unviewedMessages.map((msg) => (
                              <Link 
                                key={msg.id} 
                                href="/admin/messages"
                                onClick={() => markAsRead(msg.id!, 'message')}
                              >
                                <div className="p-2 hover:bg-muted rounded-lg cursor-pointer mb-1 relative">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                                  <p className="text-sm font-medium pl-3">{msg.guestName}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1 pl-3">{msg.message}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                        {unviewedGuestPhotos.length > 0 && (
                          <div className="p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">ẢNH KHÁCH CHỜ DUYỆT</p>
                            {unviewedGuestPhotos.map((photo) => (
                              <Link 
                                key={photo.id} 
                                href="/admin/guest-photos"
                                onClick={() => markAsRead(photo.id!, 'guestphoto')}
                              >
                                <div className="p-2 hover:bg-muted rounded-lg cursor-pointer mb-1 relative flex items-center gap-2">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                                  <div className="flex-1 pl-3">
                                    <p className="text-sm font-medium">{photo.guestName}</p>
                                    <p className="text-xs text-muted-foreground">📸 Đã tải lên ảnh mới</p>
                                  </div>
                                  {photo.url && (
                                    <img 
                                      src={photo.url} 
                                      alt="Guest photo thumbnail" 
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Profile */}
              <motion.div
                className="flex items-center gap-4 bg-card rounded-2xl px-5 py-3 border shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border">
                  <User size={20} className="text-primary" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-base font-semibold text-foreground">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quản trị viên
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.header>

          {/* Main Content */}
          <motion.main 
            className="flex-1 overflow-auto bg-gradient-to-br from-muted/30 via-background to-muted/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-admin-page="true"
          >
            <div className="max-w-7xl mx-auto w-full p-6 lg:p-8" data-admin-page="true">
              <div className="bg-background/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm min-h-[calc(100vh-12rem)]" data-admin-page="true">
                {children}
              </div>
            </div>
          </motion.main>

          {/* Footer */}
          <motion.footer 
            className="p-6 border-t bg-background/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  Hệ thống quản lý đám cưới • {new Date().getFullYear()}
                </p>
                <p className="text-muted-foreground/70">
                  Made with 💝
                </p>
              </div>
            </div>
          </motion.footer>
        </div>
      </div>
    </SidebarProvider>
  );
}