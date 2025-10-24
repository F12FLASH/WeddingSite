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
    title: "Thông Tin Cô Dâu Chú Rể",
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
    title: "Quà Mừng",
    url: "/admin/registry",
    icon: Gift,
    description: "Quản lý danh sách quà",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
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
  const [notifications, setNotifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "🔐 Chưa đăng nhập",
        description: "Bạn đã đăng xuất. Đang chuyển đến trang đăng nhập...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = () => {
    toast({
      title: "👋 Đã đăng xuất",
      description: "Bạn đã đăng xuất thành công",
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <Heart size={80} className="text-primary mx-auto" fill="currentColor" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles size={80} className="text-primary/30" />
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
      <div className="flex h-screen w-full bg-background overflow-hidden">
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
          <Sidebar className="w-80 border-r border-border/40 bg-sidebar/95 backdrop-blur-xl shadow-2xl">
            <SidebarContent className="gap-0">
              <SidebarGroup>
                {/* Header */}
                <motion.div
                  className="p-8 pb-6 border-b border-border/40"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <SidebarGroupLabel className="text-2xl font-cursive text-primary mb-3 flex items-center gap-3">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <Heart size={28} fill="currentColor" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2"
                      >
                        <Sparkles size={32} className="text-primary/30" />
                      </motion.div>
                    </motion.div>
                    Quản Lý Đám Cưới
                  </SidebarGroupLabel>
                  <div className="space-y-2">
                    <p className="text-base text-muted-foreground font-medium">
                      Chào mừng trở lại!
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                      <User size={14} />
                      <span>{user?.name || "Admin"}</span>
                    </div>
                  </div>
                </motion.div>

                <SidebarGroupContent className="p-6">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SidebarMenu className="space-y-3">
                      {menuItems.map((item, index) => {
                        const isActive = location === item.url;
                        return (
                          <motion.div key={item.title} variants={itemVariants}>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                asChild
                                className={cn(
                                  "relative group transition-all duration-400 rounded-2xl p-4 h-auto min-h-[72px]",
                                  "hover:scale-[1.02] hover:shadow-lg border-2",
                                  isActive
                                    ? cn(
                                        "bg-sidebar-accent text-foreground border-primary/30 shadow-lg",
                                        item.bgColor
                                      )
                                    : "border-transparent hover:border-border bg-transparent"
                                )}
                              >
                                <Link 
                                  href={item.url} 
                                  data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-start gap-4"
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                      "p-2 rounded-xl transition-colors",
                                      isActive && "bg-white/50 dark:bg-black/20"
                                    )}
                                  >
                                    <item.icon size={22} className={item.color} />
                                  </motion.div>
                                  
                                  <div className="flex-1 text-left space-y-1.5">
                                    <span className="font-semibold text-base leading-tight block">
                                      {item.title}
                                    </span>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>
                                  
                                  {/* Active indicator */}
                                  {isActive && (
                                    <motion.div
                                      className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full"
                                      layoutId="activeIndicator"
                                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                  )}

                                  {/* Hover effect */}
                                  <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={false}
                                  />
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </motion.div>
                        );
                      })}
                      
                      {/* Logout Button - Spaced out */}
                      <motion.div 
                        className="pt-8 mt-4 border-t border-border/40"
                        variants={itemVariants}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a 
                              href="/api/logout" 
                              data-testid="button-logout"
                              onClick={handleLogout}
                              className="group relative rounded-2xl p-4 h-auto min-h-[72px] text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-400 border-2 border-transparent hover:border-destructive/20"
                            >
                              <div className="flex items-center gap-4">
                                <motion.div
                                  whileHover={{ scale: 1.15, x: 2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 rounded-xl bg-destructive/10"
                                >
                                  <LogOut size={22} />
                                </motion.div>
                                <div className="flex-1 text-left">
                                  <span className="font-semibold text-base block">Đăng Xuất</span>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Kết thúc phiên làm việc
                                  </p>
                                </div>
                              </div>
                              
                              {/* Hover effect */}
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                initial={false}
                              />
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
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative w-12 h-12 rounded-xl border border-border/50 hover:bg-accent/50"
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
          >
            <div className="max-w-7xl mx-auto w-full p-6 lg:p-8">
              <div className="bg-background/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm min-h-[calc(100vh-12rem)]">
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