import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {/* Animated Heart Logo */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                opacity: 1,
              }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
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
              >
                <Heart 
                  className="mx-auto text-primary" 
                  size={80} 
                  fill="currentColor"
                  strokeWidth={0}
                />
              </motion.div>
            </motion.div>

            {/* Loading Text */}
            <motion.h2
              className="font-cursive text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary via-pink-400 to-rose-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Đang tải...
            </motion.h2>

            {/* Animated Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
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

            {/* Floating Hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-primary/20"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: '110%',
                  }}
                  animate={{
                    y: [-100, -window.innerHeight - 100],
                    x: [0, Math.sin(i) * 50],
                    rotate: [0, 360],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Heart fill="currentColor" size={24 + Math.random() * 16} />
                </motion.div>
              ))}
            </div>

            {/* Progress Message */}
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Chuẩn bị thiệp cưới của bạn...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
