import { Clock, Users, Music, Utensils, Heart, MapPin, Camera, Sparkles, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ScheduleEvent } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  clock: Clock,
  users: Users,
  music: Music,
  utensils: Utensils,
  heart: Heart,
  map: MapPin,
  camera: Camera,
  sparkles: Sparkles,
  calendar: Calendar,
};

export default function Schedule() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const { data: events = [], isLoading, isError, error } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/schedule"],
  });

  // Sort events by time to ensure proper alternating layout
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, x: -30 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const rightItemVariants = {
    hidden: { opacity: 0, y: 30, x: 30 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const heartBeatVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingHeartsVariants = {
    float: {
      y: [0, -25, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 15, -15, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Heart-shaped path for the timeline
  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  return (
    <section id="schedule" className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-pink-50/30 dark:to-pink-950/10 relative overflow-hidden">
      {/* Romantic Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Hearts */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/40 dark:text-pink-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={floatingHeartsVariants}
            animate="float"
            transition={{
              duration: 8 + Math.random() * 4,
              delay: i * 0.5,
            }}
          >
            <Heart 
              size={24 + Math.random() * 24} 
              fill="currentColor"
            />
          </motion.div>
        ))}

        {/* Romantic Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-48 w-80 h-80 rounded-full bg-gradient-to-r from-pink-400/10 to-rose-400/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-80 h-80 rounded-full bg-gradient-to-l from-rose-400/10 to-pink-400/5 blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300/30"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.8,
              repeat: Infinity,
            }}
          >
            <Sparkles size={16 + Math.random() * 16} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Romantic Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-4 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              variants={heartBeatVariants}
              initial="initial"
              animate="animate"
            >
              <Heart className="text-pink-500" size={36} fill="currentColor" />
            </motion.div>
            <motion.h2
              className="font-serif text-5xl md:text-6xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
              data-testid="heading-schedule"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hành Trình Yêu
            </motion.h2>
            <motion.div
              variants={heartBeatVariants}
              initial="initial"
              animate="animate"
            >
              <Heart className="text-rose-500" size={36} fill="currentColor" />
            </motion.div>
          </motion.div>
          
          <motion.div
            className="w-48 h-1.5 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 mx-auto mb-6 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "12rem", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />
          
          <motion.p
            className="text-xl text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Từng khoảnh khắc đặc biệt trong ngày trọng đại của chúng tôi
          </motion.p>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Heart Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300/40 via-rose-400/60 to-pink-300/40 transform -translate-x-1/2" />
            
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                className={`relative mb-16 ${index % 2 === 0 ? "pr-1/2" : "pl-1/2"}`}
                variants={index % 2 === 0 ? itemVariants : rightItemVariants}
              >
                <div className={`flex ${index % 2 === 0 ? "flex-row-reverse" : ""}`}>
                  {/* Heart Timeline Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full ring-4 ring-background shadow-xl z-10 flex items-center justify-center">
                    <Heart size={14} className="text-white" fill="currentColor" />
                  </div>
                  
                  {/* Content Card Skeleton */}
                  <div className="w-full max-w-md">
                    <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl p-8 border-2 border-pink-100 dark:border-pink-900/50 shadow-2xl h-48 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-pink-200/50 dark:bg-pink-800/30 rounded-2xl" />
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-pink-200/50 dark:bg-pink-800/30 rounded w-3/4" />
                          <div className="h-4 bg-pink-200/50 dark:bg-pink-800/30 rounded w-1/4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-pink-200/50 dark:bg-pink-800/30 rounded w-1/2" />
                        <div className="h-4 bg-pink-200/50 dark:bg-pink-800/30 rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : isError ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <Heart className="mx-auto text-rose-500" size={80} fill="currentColor" />
            </motion.div>
            <p className="text-rose-600 text-2xl font-semibold mb-4">Không thể tải lịch trình</p>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
            </p>
          </motion.div>
        ) : sortedEvents.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <Heart className="mx-auto text-muted-foreground" size={80} />
            </motion.div>
            <p className="text-muted-foreground text-2xl font-semibold mb-4">Lịch trình đang được cập nhật</p>
            <p className="text-muted-foreground text-lg">Thông tin chi tiết sẽ sớm được công bố!</p>
          </motion.div>
        ) : (
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Wavy Heart Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 transform -translate-x-1/2 overflow-hidden">
              <motion.div
                className="w-full h-full bg-gradient-to-b from-pink-300/30 via-rose-400/50 to-pink-300/30"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>

            <AnimatePresence>
              {sortedEvents.map((event, index) => {
                const IconComponent = event.icon ? iconMap[event.icon.toLowerCase()] || Heart : Heart;
                const isLeft = index % 2 === 0;
                
                return (
                  <motion.div
                    key={event.id}
                    className={`relative mb-24 ${isLeft ? "pr-1/2" : "pl-1/2"}`}
                    variants={isLeft ? itemVariants : rightItemVariants}
                    data-testid={`event-${index}`}
                    onHoverStart={() => setActiveEvent(index)}
                    onHoverEnd={() => setActiveEvent(null)}
                  >
                    <div className={`flex ${isLeft ? "flex-row-reverse" : ""}`}>
                      {/* Beating Heart Timeline Dot */}
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full ring-4 ring-background shadow-2xl z-10 flex items-center justify-center cursor-pointer"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ 
                          scale: 1.4,
                          backgroundColor: "#fff",
                          boxShadow: "0 0 0 4px hsl(350, 89%, 60%)"
                        }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: activeEvent === index ? [1, 1.4, 1] : 1,
                            rotate: activeEvent === index ? [0, 15, -15, 0] : 0
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent 
                            size={18} 
                            className={activeEvent === index ? "text-rose-600" : "text-white"} 
                            fill={activeEvent === index ? "none" : "currentColor"}
                          />
                        </motion.div>
                      </motion.div>

                      {/* Romantic Content Card */}
                      <div className="w-full max-w-lg">
                        <motion.div
                          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-pink-100 dark:border-pink-900/50 shadow-2xl relative overflow-hidden group cursor-pointer"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          transition={{ delay: index * 0.2 }}
                        >
                          {/* Romantic Gradient Overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-rose-50/50 opacity-0 group-hover:opacity-100"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          />

                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                          <div className="relative z-10">
                            <div className={`flex items-center gap-6 mb-6 ${isLeft ? "flex-row-reverse" : ""}`}>
                              <motion.div
                                className="w-18 h-18 bg-gradient-to-br from-pink-200/60 to-rose-200/40 rounded-2xl flex items-center justify-center group-hover:from-pink-300/70 group-hover:to-rose-300/50 transition-all duration-500 shadow-lg border border-pink-200/50"
                                whileHover={{ 
                                  scale: 1.1,
                                  rotate: 360,
                                  boxShadow: "0 15px 40px rgba(244, 114, 182, 0.3)"
                                }}
                                transition={{ duration: 0.5 }}
                              >
                                <IconComponent className="text-rose-600" size={36} />
                              </motion.div>
                              
                              <div className={`flex-1 ${isLeft ? "text-right" : ""}`}>
                                <motion.h3
                                  className="font-serif text-3xl bg-gradient-to-r from-pink-700 to-rose-700 bg-clip-text text-transparent mb-2"
                                  whileHover={{ 
                                    scale: 1.02
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {event.title}
                                </motion.h3>
                                
                                <motion.p
                                  className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  {new Date(event.eventTime).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </motion.p>
                              </div>
                            </div>

                            {event.location && (
                              <motion.div
                                className={`flex items-center gap-3 mb-4 text-foreground/80 ${isLeft ? "justify-end" : ""}`}
                                initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.2 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                >
                                  <MapPin size={20} className="text-rose-500" fill="currentColor" />
                                </motion.div>
                                <span className="text-lg font-medium">{event.location}</span>
                              </motion.div>
                            )}

                            {event.description && (
                              <motion.p
                                className="text-foreground/70 leading-relaxed text-lg mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                {event.description}
                              </motion.p>
                            )}
                          </div>

                          {/* Romantic Corner Decorations */}
                          <div className={`absolute top-4 ${isLeft ? "left-4" : "right-4"} w-6 h-6 border-t-2 border-l-2 border-rose-300/50 rounded-tl-2xl`} />
                          <div className={`absolute bottom-4 ${isLeft ? "right-4" : "left-4"} w-6 h-6 border-b-2 border-r-2 border-rose-300/50 rounded-br-2xl`} />
                          
                          {/* Floating mini hearts */}
                          <motion.div
                            className="absolute -top-2 -right-2 text-rose-400/60"
                            animate={{
                              y: [0, -8, 0],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: index * 0.3
                            }}
                          >
                            <Heart size={16} fill="currentColor" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Curved Connecting Line with Hearts */}
                    {index < sortedEvents.length - 1 && (
                      <motion.div
                        className="absolute left-1/2 top-full w-2 h-20 bg-gradient-to-b from-rose-400/40 to-pink-400/30 transform -translate-x-1/2"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      >
                        {/* Floating heart in connector */}
                        <motion.div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400/70"
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          <Heart size={12} fill="currentColor" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Romantic Start and End Markers */}
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-2xl border-4 border-background flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
            <motion.div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-2 w-8 h-8 bg-gradient-to-br from-rose-600 to-pink-500 rounded-full shadow-2xl border-4 border-background flex items-center justify-center"
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 1 }}
            >
              <Heart size={12} className="text-white" fill="currentColor" />
            </motion.div>
          </motion.div>
        )}

        {/* Romantic Floating CTA */}
        <motion.div
          className="text-center mt-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-3xl p-8 border-2 border-pink-200/50 dark:border-pink-800/30 backdrop-blur-sm max-w-md mx-auto shadow-2xl relative overflow-hidden"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 25px 50px rgba(244, 114, 182, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Background hearts */}
            <div className="absolute inset-0 opacity-5">
              <Heart className="absolute top-2 left-4" size={24} fill="currentColor" />
              <Heart className="absolute bottom-2 right-4" size={20} fill="currentColor" />
            </div>

            <motion.p
              className="text-2xl font-serif bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 relative z-10"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💝 Đánh dấu lịch của bạn!
            </motion.p>
            <p className="text-foreground/80 text-lg relative z-10">
              Chúng tôi rất mong được chia sẻ ngày đặc biệt này cùng bạn
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}