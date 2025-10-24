import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Lock, User as UserIcon, Sparkles, Eye, EyeOff, WeddingRing } from "lucide-react";

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
        setLocation("/admin");
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 text-pink-200"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-blue-200"
          animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Heart size={50} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20 text-purple-200"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <WeddingRing size={45} />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-orange-200"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={35} />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-2 border-pink-100/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          {/* Header with Gradient */}
          <CardHeader className="text-center space-y-6 pb-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white relative overflow-hidden">
            {/* Animated Background */}
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
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)',
                backgroundSize: '400% 400%',
              }}
            />
            
            <motion.div
              className="flex justify-center relative z-10"
              variants={itemVariants}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <Heart className="w-20 h-20" fill="currentColor" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-20 h-20 text-white/30" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2 relative z-10">
              <CardTitle className="text-4xl font-serif font-bold">
                Quản Lý Đám Cưới
              </CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Đăng nhập để quản lý website đám cưới của bạn
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
              {/* Username Field */}
              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="username" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <UserIcon size={18} className="text-pink-600" />
                  </div>
                  Tên đăng nhập
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập của bạn"
                  required
                  className="h-12 text-lg border-2 border-gray-200 focus:border-pink-500 rounded-xl transition-all duration-300 pl-4"
                  data-testid="input-username"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="password" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lock size={18} className="text-blue-600" />
                  </div>
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 pl-4 pr-12"
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {error}
                </motion.div>
              )}

              {/* Login Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  disabled={loading}
                  data-testid="button-login"
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-2 relative z-10">
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
                        <Lock size={18} />
                        Đăng Nhập
                      </>
                    )}
                  </div>
                </Button>
              </motion.div>

              {/* Default Credentials */}
              <motion.div 
                variants={itemVariants}
                className="text-center space-y-3 pt-4 border-t border-gray-200"
              >
                <p className="text-sm text-gray-600 font-medium">Thông tin đăng nhập mặc định:</p>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Tên đăng nhập:</span>
                      <code className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-mono font-bold">admin</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Mật khẩu:</span>
                      <code className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-mono font-bold">admin123</code>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Hãy thay đổi mật khẩu mặc định sau khi đăng nhập thành công
                </p>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="text-center pt-4 border-t border-gray-100"
            >
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                Hệ thống quản lý đám cưới chuyên nghiệp
                <Sparkles size={14} className="text-pink-400" />
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}