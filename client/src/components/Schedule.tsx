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
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, x: -50 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const rightItemVariants = {
    hidden: { opacity: 0, y: 50, x: 50 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const timelineDotVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const floatingIconVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="schedule" className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Icons */}
        {[...Array(12)].map((_, i) => {
          const icons = [Clock, Heart, Calendar, Sparkles];
          const IconComponent = icons[i % icons.length];
          return (
            <motion.div
              key={i}
              className="absolute text-primary/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={floatingIconVariants}
              animate="float"
              transition={{
                duration: 6 + Math.random() * 4,
                delay: i * 0.8,
              }}
            >
              <IconComponent size={32 + Math.random() * 16} />
            </motion.div>
          );
        })}

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl"
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
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-primary/10 to-primary/5 blur-3xl"
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
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Calendar className="text-primary" size={32} />
            </motion.div>
            <motion.h2
              className="font-serif text-5xl md:text-6xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
              data-testid="heading-schedule"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Lịch Trình Ngày Cưới
            </motion.h2>
          </motion.div>
          
          <motion.div
            className="w-32 h-1.5 bg-gradient-to-r from-primary to-primary/60 mx-auto mb-6 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "8rem" }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">15 Tháng 6, 2025</span> • 
            <span className="text-foreground font-medium"> Rose Garden Estate</span>
          </motion.p>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 transform -translate-x-1/2" />
            
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                className={`relative mb-16 ${index % 2 === 0 ? "pr-1/2" : "pl-1/2"}`}
                variants={index % 2 === 0 ? itemVariants : rightItemVariants}
              >
                <div className={`flex ${index % 2 === 0 ? "flex-row-reverse" : ""}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full ring-4 ring-background shadow-xl z-10" />
                  
                  {/* Content Card Skeleton */}
                  <div className="w-full max-w-md">
                    <div className="bg-card rounded-3xl p-8 border-2 border-card-border shadow-2xl h-48 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-muted rounded-2xl" />
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-4 bg-muted rounded w-5/6" />
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
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <Heart className="mx-auto text-destructive" size={80} />
            </motion.div>
            <p className="text-destructive text-2xl font-semibold mb-4">Không thể tải lịch trình</p>
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
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-6"
            >
              <Calendar className="mx-auto text-muted-foreground" size={80} />
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
            {/* Animated Timeline Line */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 transform -translate-x-1/2 shadow-2xl"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <AnimatePresence>
              {sortedEvents.map((event, index) => {
                const IconComponent = event.icon ? iconMap[event.icon.toLowerCase()] || Calendar : Calendar;
                const isLeft = index % 2 === 0;
                
                return (
                  <motion.div
                    key={event.id}
                    className={`relative mb-20 ${isLeft ? "pr-1/2" : "pl-1/2"}`}
                    variants={isLeft ? itemVariants : rightItemVariants}
                    data-testid={`event-${index}`}
                    onHoverStart={() => setActiveEvent(index)}
                    onHoverEnd={() => setActiveEvent(null)}
                  >
                    <div className={`flex ${isLeft ? "flex-row-reverse" : ""}`}>
                      {/* Enhanced Timeline Dot */}
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full ring-4 ring-background shadow-2xl z-10 flex items-center justify-center cursor-pointer"
                        variants={timelineDotVariants}
                        whileHover={{ 
                          scale: 1.8,
                          backgroundColor: "#fff",
                          boxShadow: "0 0 0 4px hsl(var(--primary))"
                        }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: activeEvent === index ? [1, 1.3, 1] : 1,
                            rotate: activeEvent === index ? [0, 360] : 0
                          }}
                          transition={{ duration: 0.8 }}
                        >
                          <IconComponent 
                            size={16} 
                            className={activeEvent === index ? "text-primary" : "text-white"} 
                          />
                        </motion.div>
                      </motion.div>

                      {/* Enhanced Content Card */}
                      <div className="w-full max-w-lg">
                        <motion.div
                          className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-card-border/50 shadow-2xl relative overflow-hidden group cursor-pointer"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          transition={{ delay: index * 0.2 }}
                        >
                          {/* Animated Background Gradient */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          />

                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                          <div className="relative z-10">
                            <div className={`flex items-center gap-6 mb-6 ${isLeft ? "flex-row-reverse" : ""}`}>
                              <motion.div
                                className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-500 shadow-lg"
                                whileHover={{ 
                                  scale: 1.1,
                                  rotate: 360,
                                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
                                }}
                                transition={{ duration: 0.5 }}
                              >
                                <IconComponent className="text-primary" size={32} />
                              </motion.div>
                              
                              <div className={`flex-1 ${isLeft ? "text-right" : ""}`}>
                                <motion.h3
                                  className="font-serif text-3xl text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                                  whileHover={{ 
                                    color: "hsl(var(--primary))",
                                    scale: 1.02
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {event.title}
                                </motion.h3>
                                
                                <motion.p
                                  className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
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
                                className={`flex items-center gap-3 mb-4 text-muted-foreground ${isLeft ? "justify-end" : ""}`}
                                initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <MapPin size={20} className="text-primary" />
                                <span className="text-lg font-medium">{event.location}</span>
                              </motion.div>
                            )}

                            {event.description && (
                              <motion.p
                                className="text-foreground/80 leading-relaxed text-lg mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                {event.description}
                              </motion.p>
                            )}
                          </div>

                          {/* Decorative Corners */}
                          <div className={`absolute top-4 ${isLeft ? "left-4" : "right-4"} w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl`} />
                          <div className={`absolute bottom-4 ${isLeft ? "right-4" : "left-4"} w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-2xl`} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Enhanced Connecting Line */}
                    {index < sortedEvents.length - 1 && (
                      <motion.div
                        className="absolute left-1/2 top-full w-1 h-16 bg-gradient-to-b from-primary/60 to-primary/30 transform -translate-x-1/2"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Enhanced Start and End Markers */}
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 w-6 h-6 bg-primary rounded-full shadow-2xl border-4 border-background"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            />
            <motion.div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-2 w-6 h-6 bg-primary rounded-full shadow-2xl border-4 border-background"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 1 }}
            />
          </motion.div>
        )}

        {/* Enhanced Floating CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 border-2 border-primary/20 backdrop-blur-sm max-w-md mx-auto shadow-2xl"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.p
              className="text-2xl font-serif text-foreground mb-3"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              📅 Đánh dấu lịch của bạn!
            </motion.p>
            <p className="text-muted-foreground text-lg">
              Chúng tôi rất mong được gặp bạn vào ngày trọng đại
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}