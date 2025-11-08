import { Heart, Calendar, MapPin, Clock, X } from "lucide-react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CoupleInfo, Settings, Popup } from "@shared/schema";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [showInvitation, setShowInvitation] = useState(false);

  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });

  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const { data: popups } = useQuery<Popup[]>({
    queryKey: ["/api/popups"],
  });

  const welcomePopup = popups?.find((p) => p.type === "welcome" && p.isActive);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const calculateTimeLeft = () => {
      const weddingDate = coupleInfo?.weddingDate 
        ? new Date(coupleInfo.weddingDate)
        : new Date('2025-06-15T00:00:00');
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [coupleInfo?.weddingDate]);

  // Animate numbers
  useEffect(() => {
    Object.entries(timeLeft).forEach(([key, value]) => {
      const controls = animate(0, value, {
        duration: 1,
        onUpdate: (latest) => {
          // You would need separate motion values for each counter
          // This is simplified for demonstration
        }
      });
      return controls.stop;
    });
  }, [timeLeft]);

  const countdownItems = [
    { value: timeLeft.days, label: "Ngày", icon: Calendar },
    { value: timeLeft.hours, label: "Giờ", icon: Clock },
    { value: timeLeft.minutes, label: "Phút", icon: Clock },
    { value: timeLeft.seconds, label: "Giây", icon: Clock }
  ];

  const floatingHearts = [...Array(12)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: i * 1.5,
    duration: 18 + Math.random() * 10,
    size: 24 + Math.random() * 32
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const countdownVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background Image with Gradient Overlay */}
      {/* Background Image - using img tag for better control */}
      {coupleInfo?.heroImage && (
        <motion.img
          src={coupleInfo.heroImage}
          alt="Wedding Background"
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
      {!coupleInfo?.heroImage && (
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))' }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Hearts */}
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-primary/20"
            style={{
              left: `${heart.left}%`,
              top: '110%',
              fontSize: `${heart.size}px`
            }}
            animate={{
              y: [-100, -window.innerHeight - 100],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Heart fill="currentColor" />
          </motion.div>
        ))}

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Wedding Announcement */}
        <motion.div
          className="mb-6"
          variants={containerVariants}
        >
          <motion.h1
            className="font-cursive text-6xl md:text-8xl lg:text-9xl mb-6 text-foreground relative font-normal"
            data-testid="text-couple-names"
            variants={itemVariants}
          >
            <motion.span 
              className="bg-gradient-to-r from-primary via-pink-400 to-rose-500 bg-clip-text text-transparent inline-block font-normal"
              initial={{ opacity: 0, y: 50, rotateX: 90 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                scale: [1, 1.02, 1],
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                opacity: { duration: 0.8 },
                y: { duration: 0.8, type: "spring", stiffness: 100 },
                rotateX: { duration: 1, type: "spring", stiffness: 100 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
              style={{
                backgroundSize: "200% 200%",
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {coupleInfo ? `${coupleInfo.brideName} & ${coupleInfo.groomName}` : "Xuân Lâm & Xuân Lợi"}
            </motion.span>
            {/* Character count display */}
            <motion.div
              className="absolute -top-8 right-0 text-xs text-muted-foreground/60 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
            </motion.div>
            {/* Decorative underline with shimmer */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-primary/40"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${-10 + Math.sin(i) * 10}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.h1>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-foreground mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-3 text-xl md:text-3xl"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="text-primary" size={32} />
              <span className="font-serif font-medium">
                {coupleInfo?.weddingDate 
                  ? new Date(coupleInfo.weddingDate).toLocaleDateString('vi-VN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : "15 Tháng 6, 2025"}
              </span>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-3 text-xl md:text-3xl"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="text-primary" size={32} />
              <span className="font-serif font-medium">
                {settings?.venueName || "Grand Ballroom"}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          className="flex justify-center gap-2 md:gap-4 mb-4"
          data-testid="countdown-timer"
          variants={containerVariants}
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="text-center backdrop-blur-xl bg-card/60 rounded-xl md:rounded-2xl lg:rounded-3xl p-2 sm:p-3 md:p-4 lg:p-6 border border-card-border/50 shadow-2xl relative overflow-hidden min-w-[60px] sm:min-w-[70px] md:min-w-[90px] lg:min-w-[120px]"
              variants={countdownVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 400 }
              }}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl" />
              
              <motion.div
                className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-primary relative z-10"
                key={item.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {item.value.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground mt-0.5 sm:mt-1 md:mt-2 font-medium relative z-10 flex items-center justify-center gap-1">
                <item.icon size={12} className="hidden lg:inline" />
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={containerVariants}
        >
          <motion.a
            href="#rsvp"
            className="group relative inline-flex items-center justify-center min-h-10 md:min-h-12 px-6 md:px-10 rounded-full bg-primary text-primary-foreground border border-primary-border font-medium shadow-2xl overflow-hidden"
            data-testid="button-rsvp"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 text-base md:text-lg font-semibold">
              Xác Nhận Tham Dự
            </span>
          </motion.a>

          <motion.a
            href="#livestream"
            className="group relative inline-flex items-center justify-center min-h-10 md:min-h-12 px-6 md:px-10 rounded-full bg-red-600 text-white border border-red-700 font-medium shadow-2xl overflow-hidden"
            data-testid="button-livestream"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 text-base md:text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Xem Livestream
            </span>
          </motion.a>

          <motion.button
            onClick={() => setShowInvitation(true)}
            className="group inline-flex items-center justify-center min-h-10 md:min-h-12 px-6 md:px-10 rounded-full backdrop-blur-xl bg-background/70 text-foreground border border-border/50 font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
            data-testid="button-invitation"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base md:text-lg font-semibold">
              Xem Thiệp Cưới
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
      {/* Wedding Invitation Popup */}
      <AnimatePresence>
        {showInvitation && welcomePopup && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInvitation(false)}
            data-testid="popup-overlay-invitation"
          >
            <motion.div
              className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="popup-content-invitation"
            >
              <button
                onClick={() => setShowInvitation(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                data-testid="button-close-invitation"
              >
                <X className="text-white" size={24} />
              </button>
              
              <div className="relative">
                <img
                  src={welcomePopup.imageUrl}
                  alt={welcomePopup.title || "Thiệp Cưới"}
                  className="w-full max-h-[80vh] object-contain"
                  data-testid="img-invitation"
                />
                
                {(welcomePopup.title || welcomePopup.description) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    {welcomePopup.title && (
                      <h3 className="text-2xl font-bold mb-2" data-testid="heading-invitation-title">
                        {welcomePopup.title}
                      </h3>
                    )}
                    {welcomePopup.description && (
                      <p className="text-lg" data-testid="text-invitation-description">
                        {welcomePopup.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}