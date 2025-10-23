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

const menuItems = [
  {
    title: "Tổng Quan",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Xem tổng quan đám cưới",
    color: "text-blue-500"
  },
  {
    title: "Thông Tin Cô Dâu Chú Rể",
    url: "/admin/couple",
    icon: Heart,
    description: "Quản lý thông tin cặp đôi",
    color: "text-pink-500"
  },
  {
    title: "Lịch Trình",
    url: "/admin/schedule",
    icon: Calendar,
    description: "Quản lý lịch trình sự kiện",
    color: "text-green-500"
  },
  {
    title: "Album Ảnh",
    url: "/admin/gallery",
    icon: Image,
    description: "Quản lý hình ảnh đám cưới",
    color: "text-purple-500"
  },
  {
    title: "Lời Chúc",
    url: "/admin/messages",
    icon: MessageSquare,
    description: "Xem và quản lý lời chúc",
    color: "text-orange-500"
  },
  {
    title: "Danh Sách Khách",
    url: "/admin/rsvps",
    icon: Users,
    description: "Quản lý RSVP và khách mời",
    color: "text-cyan-500"
  },
  {
    title: "Quà Mừng",
    url: "/admin/registry",
    icon: Gift,
    description: "Quản lý danh sách quà",
    color: "text-yellow-500"
  },
  {
    title: "Cài Đặt",
    url: "/admin/settings",
    icon: Settings,
    description: "Cài đặt website",
    color: "text-gray-500"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center"
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
          >
            <Heart size={64} className="text-primary mx-auto mb-4" fill="currentColor" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-foreground text-lg font-medium"
          >
            Đang tải...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "5rem",
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Sidebar className="border-r border-border/50 shadow-xl">
            <SidebarContent>
              <SidebarGroup>
                {/* Header */}
                <motion.div
                  className="p-6 border-b border-border/50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <SidebarGroupLabel className="text-xl font-cursive text-primary mb-2 flex items-center gap-2">
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
                    >
                      <Heart size={24} fill="currentColor" />
                    </motion.div>
                    Quản Lý Đám Cưới
                  </SidebarGroupLabel>
                  <p className="text-sm text-muted-foreground">
                    Chào mừng trở lại, {user?.name || "Admin"}!
                  </p>
                </motion.div>

                <SidebarGroupContent className="p-4">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SidebarMenu>
                      {menuItems.map((item, index) => (
                        <motion.div key={item.title} variants={itemVariants}>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              className={`relative group transition-all duration-300 rounded-xl ${
                                location === item.url
                                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg"
                                  : "hover:bg-sidebar-accent hover:text-foreground"
                              }`}
                            >
                              <Link 
                                href={item.url} 
                                data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <item.icon className={item.color} />
                                </motion.div>
                                <div className="flex-1 text-left">
                                  <span className="font-medium">{item.title}</span>
                                  <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {item.description}
                                  </p>
                                </div>
                                
                                {/* Active indicator */}
                                {location === item.url && (
                                  <motion.div
                                    className="absolute right-2 w-2 h-2 bg-primary rounded-full"
                                    layoutId="activeIndicator"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  />
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </motion.div>
                      ))}
                      
                      {/* Logout Button */}
                      <motion.div variants={itemVariants}>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a 
                              href="/api/logout" 
                              data-testid="button-logout"
                              onClick={handleLogout}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-300 group"
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <LogOut />
                              </motion.div>
                              <span>Đăng Xuất</span>
                              <div className="absolute inset-0 bg-destructive/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <motion.header 
            className="flex items-center justify-between p-4 lg:p-6 border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <SidebarTrigger 
                data-testid="button-sidebar-toggle"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </SidebarTrigger>
              
              <motion.h1 
                className="font-serif text-2xl lg:text-3xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Quản Lý Đám Cưới
              </motion.h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center"
                    >
                      {notifications}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* User Profile */}
              <motion.div
                className="flex items-center gap-3 bg-card rounded-xl px-4 py-2 border shadow-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quản trị viên
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.header>

          {/* Main Content */}
          <motion.main 
            className="flex-1 overflow-auto p-4 lg:p-6 bg-gradient-to-br from-muted/20 to-muted/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>

          {/* Footer */}
          <motion.footer 
            className="p-4 border-t bg-background/80 backdrop-blur-lg text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              💝 Hệ thống quản lý đám cưới • {new Date().getFullYear()}
            </p>
          </motion.footer>
        </div>
      </div>
    </SidebarProvider>
  );
}