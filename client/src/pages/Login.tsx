import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Lock, User as UserIcon, Sparkles, Eye, EyeOff, Gem, Crown, Calendar } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ username: false, password: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Animation success trước khi chuyển trang
        setTimeout(() => {
          setLocation("/admin");
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.message || "Thông tin đăng nhập không hợp lệ");
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-cyan-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200/40"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            <Heart size={24 + i * 4} fill="currentColor" />
          </motion.div>
        ))}

        {/* Sparkles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-200/50"
            style={{
              top: `${30 + i * 10}%`,
              right: `${5 + i * 20}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles size={20 + i * 3} />
          </motion.div>
        ))}

        {/* Wedding Icons */}
        <motion.div
          className="absolute bottom-32 left-16 text-purple-200/40"
          animate={floatAnimation}
        >
          <Calendar size={35} />
        </motion.div>
        <motion.div
          className="absolute top-32 right-20 text-rose-200/40"
          animate={{
            ...floatAnimation,
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Crown size={30} />
        </motion.div>
        
        {/* Additional floating elements */}
        <motion.div
          className="absolute bottom-40 right-16 text-blue-200/30"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Gem size={28} />
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          animate={pulseAnimation}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          
          <Card className="shadow-2xl border-2 border-white/60 bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden relative z-10">
            {/* Header Section */}
            <CardHeader className="text-center space-y-4 pb-6 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 text-white relative overflow-hidden">
              {/* Animated Gradient Overlay */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(45deg, #ec4899, #8b5cf6, #06b6d4, #10b981, #f59e0b)',
                  backgroundSize: '400% 400%',
                  opacity: 0.7
                }}
              />
              
              {/* Floating Icons */}
              <motion.div
                className="absolute top-2 left-2 opacity-20"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Heart size={24} />
              </motion.div>
              
              <motion.div
                className="absolute bottom-2 right-2 opacity-20"
                animate={{
                  rotate: -360,
                  scale: [1.2, 1, 1.2]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Calendar size={20} />
              </motion.div>

              {/* Main Icon */}
              <motion.div
                className="flex justify-center relative z-10"
                animate={{ 
                  scale: [1, 1.05, 1],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                  <Heart className="w-16 h-16 relative z-10" fill="currentColor" />
                </div>
              </motion.div>
              
              {/* Title */}
              <motion.div 
                className="space-y-2 relative z-10"
                variants={itemVariants}
              >
                <CardTitle className="text-3xl font-bold font-serif tracking-tight">
                  Quản Lý Đám Cưới
                </CardTitle>
                <CardDescription className="text-white/90 text-sm">
                  Đăng nhập để quản lý website đám cưới của bạn
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
                {/* Username Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <motion.div 
                      className="p-1.5 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserIcon size={16} className="text-rose-600" />
                    </motion.div>
                    Tên đăng nhập
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                      onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                      placeholder="Nhập tên đăng nhập..."
                      required
                      className="h-11 text-base border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 rounded-xl transition-all duration-300 pl-4"
                      data-testid="input-username"
                    />
                  </motion.div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <motion.div 
                      className="p-1.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Lock size={16} className="text-blue-600" />
                    </motion.div>
                    Mật khẩu
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                      onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                      placeholder="Nhập mật khẩu..."
                      required
                      className="h-11 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-300 pl-4 pr-12"
                      data-testid="input-password"
                    />
                    <motion.button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700 flex items-center justify-center rounded-lg hover:bg-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 shadow-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="w-full h-11 text-base font-semibold bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                    data-testid="button-login"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                          Đang đăng nhập...
                        </motion.div>
                      ) : (
                        <>
                          <Lock size={16} />
                          Đăng Nhập
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.div>

                {/* Default Credentials */}
                <motion.div 
                  variants={itemVariants}
                  className="text-center space-y-3 pt-3 border-t border-gray-100"
                >
                  <p className="text-xs text-gray-600 font-medium">Thông tin đăng nhập mặc định:</p>
                  <motion.div 
                    className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-200 shadow-sm"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Tên đăng nhập:</span>
                        <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-mono font-bold text-xs">admin</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Mật khẩu:</span>
                        <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-mono font-bold text-xs">admin123</code>
                      </div>
                    </div>
                  </motion.div>
                  <motion.p 
                    className="text-xs text-gray-500 flex items-center justify-center gap-1"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles size={12} className="text-amber-400" />
                    Hãy thay đổi mật khẩu mặc định sau khi đăng nhập thành công
                    <Sparkles size={12} className="text-amber-400" />
                  </motion.p>
                </motion.div>
              </motion.form>

              {/* Footer */}
              <motion.div
                variants={itemVariants}
                className="text-center pt-3 border-t border-gray-100"
              >
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Gem size={12} className="text-purple-400" />
                  Hệ thống quản lý đám cưới chuyên nghiệp
                  <Gem size={12} className="text-purple-400" />
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}