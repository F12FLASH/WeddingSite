import { Heart, Calendar, MapPin, Clock } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import heroImage from "@assets/generated_images/Romantic_wedding_couple_hero_background_0afd25e7.png";
import { useQuery } from "@tanstack/react-query";
import type { CoupleInfo, Settings } from "@shared/schema";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });

  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

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
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${coupleInfo?.heroImage || heroImage})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      </motion.div>

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
          className="mb-8"
          variants={containerVariants}
        >
          <motion.p
            className="text-muted-foreground text-lg md:text-xl mb-6 font-light tracking-widest"
            data-testid="text-wedding-announcement"
            variants={itemVariants}
          >
            Với sự hiện diện của gia đình và bạn bè
          </motion.p>
          
          <motion.h1
            className="font-cursive text-6xl md:text-8xl lg:text-9xl mb-8 text-foreground relative"
            data-testid="text-couple-names"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {coupleInfo ? `${coupleInfo.brideName} & ${coupleInfo.groomName}` : "Sarah & Michael"}
            </span>
            {/* Decorative underline */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-primary rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.h1>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-foreground mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-2 text-xl md:text-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="text-primary" size={28} />
              <span className="font-serif">
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
              className="flex items-center gap-2 text-xl md:text-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="text-primary" size={28} />
              <span className="font-serif">
                {settings?.venueName || "Grand Ballroom"}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          className="flex justify-center gap-3 md:gap-6 mb-12"
          data-testid="countdown-timer"
          variants={containerVariants}
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="text-center backdrop-blur-xl bg-card/60 rounded-3xl p-6 border border-card-border/50 shadow-2xl relative overflow-hidden"
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
                className="text-4xl md:text-5xl font-serif font-bold text-primary relative z-10"
                key={item.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {item.value.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-sm md:text-base text-muted-foreground mt-2 font-medium relative z-10 flex items-center justify-center gap-1">
                <item.icon size={16} />
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
            className="group relative inline-flex items-center justify-center min-h-12 px-10 rounded-full bg-primary text-primary-foreground border border-primary-border font-medium shadow-2xl overflow-hidden"
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
            <span className="relative z-10 text-lg font-semibold">
              Xác Nhận Tham Dự
            </span>
          </motion.a>

          <motion.a
            href="#registry"
            className="group inline-flex items-center justify-center min-h-12 px-10 rounded-full backdrop-blur-xl bg-background/70 text-foreground border border-border/50 font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
            data-testid="button-registry"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg font-semibold">
              Xem Danh Sách Quà
            </span>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center relative cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-1 h-3 bg-foreground/50 rounded-full mt-2"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <motion.p
          className="text-foreground/60 text-sm mt-2 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cuộn xuống
        </motion.p>
      </motion.div>
    </section>
  );
}