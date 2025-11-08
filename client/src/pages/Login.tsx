import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Lock, User as UserIcon, Sparkles, Eye, EyeOff, Gem, Crown, Calendar, Diamond } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const floatAnimation = {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const shimmerAnimation = {
    x: ["-100%", "200%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/80 via-white to-purple-50/80 p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-rose-200/40 to-pink-200/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-purple-200/40 to-blue-200/30 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Wedding Icons */}
        {[...Array(8)].map((_, i) => {
          const icons = [Heart, Diamond, Gem, Crown, Sparkles];
          const IconComponent = icons[i % icons.length];
          return (
            <motion.div
              key={i}
              className="absolute text-rose-300/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            >
              <IconComponent size={24 + Math.random() * 16} />
            </motion.div>
          );
        })}

        {/* Sparkle Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-amber-300/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Sparkles size={12 + Math.random() * 8} />
          </motion.div>
        ))}
      </div>

      {/* Main Login Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Outer Glow Effect */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-blue-400/20 rounded-3xl blur-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <Card className="shadow-2xl border border-white/80 bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden relative">
          {/* Header with Elegant Gradient */}
          <CardHeader className="text-center space-y-6 pb-8 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-white relative overflow-hidden">
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 0)`,
                backgroundSize: '50px 50px'
              }}
            />
            
            {/* Floating Main Icon */}
            <motion.div
              className="flex justify-center relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.5
              }}
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Main Icon */}
                <motion.div
                  className="relative z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart size={32} className="text-white" fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title Section */}
            <motion.div 
              className="space-y-3 relative z-10"
              variants={itemVariants}
            >
              <CardTitle className="text-4xl font-bold font-serif tracking-tight bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
                Tình Yêu Đôi Ta
              </CardTitle>
              <CardDescription className="text-white/80 text-sm font-light tracking-wide">
                Quản lý trang web đám cưới của bạn
              </CardDescription>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-4 left-4 opacity-20"
              animate={floatAnimation}
            >
              <Diamond size={20} />
            </motion.div>
            <motion.div
              className="absolute bottom-4 right-4 opacity-20"
              animate={{
                ...floatAnimation,
                rotate: [0, -180, 0]
              }}
            >
              <Gem size={18} />
            </motion.div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
              {/* Username Field */}
              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="username" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <motion.div 
                    className="p-2 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl border border-rose-200/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserIcon size={18} className="text-rose-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
                    Tên đăng nhập
                  </span>
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập..."
                    required
                    className="h-12 text-base border-2 border-gray-200/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 rounded-xl transition-all duration-300 pl-4 pr-4 bg-white/80 backdrop-blur-sm"
                    data-testid="input-username"
                  />
                </motion.div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="password" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <motion.div 
                    className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-200/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Lock size={18} className="text-blue-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
                    Mật khẩu
                  </span>
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="relative"
                >
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    required
                    className="h-12 text-base border-2 border-gray-200/80 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-300 pl-4 pr-12 bg-white/80 backdrop-blur-sm"
                    data-testid="input-password"
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 flex items-center justify-center rounded-lg hover:bg-gray-100/80 transition-colors"
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
                    className="p-4 text-sm text-rose-700 bg-rose-50/80 border border-rose-200 rounded-xl flex items-center gap-3 backdrop-blur-sm shadow-sm"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0"
                    />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  data-testid="button-login"
                  whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {/* Animated Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform"
                    variants={{ shimmer: shimmerAnimation }}
                    animate="shimmer"
                  />
                  
                  {/* Button Content */}
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        <span>Đang xác thực...</span>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Lock size={18} />
                        </motion.div>
                        <span>Tiếp Tục Hành Trình</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>

              {/* Default Credentials */}
              <motion.div 
                variants={itemVariants}
                className="text-center space-y-4 pt-4 border-t border-gray-200/50"
              >
                <motion.div 
                  className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-4 rounded-2xl border border-amber-200/50 shadow-sm backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="space-y-2 text-sm">
                    <motion.p 
                      className="text-amber-800 font-semibold flex items-center justify-center gap-2"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      Thông tin đăng nhập mặc định
                      <Sparkles size={14} className="text-amber-500" />
                    </motion.p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700 font-medium">Tài khoản:</span>
                        <code className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-mono font-bold text-sm border border-amber-200">admin</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700 font-medium">Mật khẩu:</span>
                        <code className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-mono font-bold text-sm border border-amber-200">admin123</code>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-xs text-gray-500 flex items-center justify-center gap-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Gem size={12} className="text-purple-400" />
                  Hệ thống quản lý đám cưới chuyên nghiệp
                  <Gem size={12} className="text-purple-400" />
                </motion.p>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}