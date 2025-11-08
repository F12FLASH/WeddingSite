import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 20);
      });
    }, 150);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          data-testid="loading-screen"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-300 to-purple-400 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900"
            animate={{
              background: [
                "linear-gradient(to bottom right, #fb7185, #f9a8d4, #c084fc)",
                "linear-gradient(to bottom right, #f472b6, #e879f9, #fb7185)",
                "linear-gradient(to bottom right, #fb7185, #f9a8d4, #c084fc)",
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/10 to-white/30 dark:from-transparent dark:via-black/20 dark:to-black/40" />

          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-white/40 dark:bg-white/20 backdrop-blur-sm"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                animate={{
                  y: [0, -100, -200],
                  x: [0, Math.sin(particle.id) * 50],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[500px] h-[500px] rounded-full border-[40px] border-white/10 dark:border-white/5" />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[350px] h-[350px] rounded-full border-[30px] border-pink-200/20 dark:border-pink-400/10" />
          </motion.div>

          <div className="relative z-10 text-center px-4">
            <motion.div
              className="mb-12 relative"
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ 
                scale: 1,
                rotateY: 0,
              }}
              transition={{
                duration: 1.2,
                type: "spring",
                stiffness: 100,
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart 
                  className="text-white blur-2xl" 
                  size={120} 
                  fill="currentColor"
                  strokeWidth={0}
                />
              </motion.div>

              <motion.div
                animate={{
                  rotateY: [0, 15, -15, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <Heart 
                  className="mx-auto text-white drop-shadow-2xl relative z-10" 
                  size={100} 
                  fill="currentColor"
                  strokeWidth={0}
                  data-testid="icon-loading-heart"
                />
              </motion.div>

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white"
                  style={{
                    left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 60}%`,
                    top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles size={20} />
                </motion.div>
              ))}
            </motion.div>

            <motion.h2
              className="font-cursive text-5xl md:text-6xl mb-6 text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ delay: 0.4, duration: 0.8 }}
              data-testid="text-loading"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: "linear-gradient(90deg, #ffffff, #fce7f3, #ffffff)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Đang tải...
              </motion.span>
            </motion.h2>

            <div className="flex justify-center gap-3 mb-10">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-4 h-4 bg-white rounded-full shadow-lg"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <motion.div
              className="w-full max-w-md mx-auto mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-white via-pink-200 to-white rounded-full shadow-lg"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${Math.min(100, progress)}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.p
                className="text-white/90 text-sm mt-3 font-medium"
                key={Math.floor(progress / 25)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                data-testid="text-loading-message"
              >
                {progress < 25 && "Đang chuẩn bị thiệp cưới..."}
                {progress >= 25 && progress < 50 && "Đang tải hình ảnh đẹp..."}
                {progress >= 50 && progress < 75 && "Đang thiết lập âm nhạc..."}
                {progress >= 75 && "Hoàn tất! Chào mừng bạn..."}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/60 text-xs"
            >
              {Math.floor(progress)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
