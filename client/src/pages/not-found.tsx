import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function NotFound() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            variants={floatingVariants}
            animate="float"
            transition={{
              duration: 4 + i,
              delay: i * 0.5,
            }}
          >
            <Heart size={40} />
          </motion.div>
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-gradient-to-l from-primary/10 to-primary/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md mx-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full border-2 border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardContent className="p-8">
            <motion.div
              className="text-center mb-6"
              variants={itemVariants}
            >
              {/* Animated 404 Number */}
              <motion.div
                className="text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
              >
                404
              </motion.div>

              {/* Icon and Title */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-4"
                variants={itemVariants}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </motion.div>
                <h1 className="text-3xl font-serif font-bold text-foreground">
                  Trang Không Tìm Thấy
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-lg text-muted-foreground mb-2 leading-relaxed"
                variants={itemVariants}
              >
                Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
              </motion.p>
              <motion.p
                className="text-sm text-muted-foreground mb-8"
                variants={itemVariants}
              >
                Có thể bạn đã nhập sai địa chỉ hoặc trang đã bị xóa.
              </motion.p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Button
                asChild
                variant="outline"
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <ArrowLeft size={18} className="mr-2" />
                  Quay Lại
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <Home size={18} className="mr-2" />
                  Về Trang Chủ
                </Link>
              </Button>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              className="mt-8 p-4 bg-muted/50 rounded-xl border border-border/50"
              variants={itemVariants}
            >
              <p className="text-sm text-muted-foreground text-center">
                💡 Nếu bạn tin đây là lỗi, vui lòng liên hệ với quản trị viên.
              </p>
            </motion.div>

            {/* Wedding Theme Touch */}
            <motion.div
              className="mt-6 text-center"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart size={16} className="text-primary" fill="currentColor" />
                <span>Sarah & Michael - 15.06.2025</span>
                <Heart size={16} className="text-primary" fill="currentColor" />
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <motion.div
          className="flex justify-center gap-2 mt-8"
          variants={containerVariants}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}