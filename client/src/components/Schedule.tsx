import { Clock, Users, Music, Utensils, Heart, MapPin, Camera, Sparkles } from "lucide-react";
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
};

export default function Schedule() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const { data: events = [], isLoading, isError, error } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/schedule"],
  });

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
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const timelineDotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <section id="schedule" className="py-20 md:py-32 px-4 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Clock size={40} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-schedule"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Lịch Trình Ngày Cưới
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-primary font-semibold">15 Tháng 6, 2025</span> • Rose Garden Estate
          </motion.p>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="relative"
                variants={itemVariants}
              >
                <div className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-lg h-48 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full" />
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
              </motion.div>
            ))}
          </motion.div>
        ) : isError ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="mx-auto mb-4 text-destructive" size={64} />
            </motion.div>
            <p className="text-destructive text-lg mb-2">Không thể tải lịch trình</p>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
            </p>
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Clock className="mx-auto mb-4 text-muted-foreground" size={64} />
            </motion.div>
            <p className="text-muted-foreground text-lg">Lịch trình sẽ sớm được cập nhật!</p>
          </motion.div>
        ) : (
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Timeline Line */}
            <motion.div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 transform -translate-x-1/2"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            <AnimatePresence>
              {events.map((event, index) => {
                const IconComponent = event.icon ? iconMap[event.icon.toLowerCase()] || Clock : Clock;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={event.id}
                    className={`relative mb-16 ${
                      isEven ? "md:pr-1/2" : "md:pl-1/2 md:text-right"
                    }`}
                    variants={itemVariants}
                    data-testid={`event-${index}`}
                    onHoverStart={() => setActiveEvent(index)}
                    onHoverEnd={() => setActiveEvent(null)}
                  >
                    <div
                      className={`flex items-start gap-6 ${
                        isEven ? "md:flex-row-reverse md:justify-end" : ""
                      }`}
                    >
                      {/* Timeline Dot */}
                      <motion.div
                        className="absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full ring-4 ring-background shadow-xl z-10 flex items-center justify-center"
                        variants={timelineDotVariants}
                        whileHover={{ 
                          scale: 1.5,
                          backgroundColor: "#fff",
                          border: "2px solid hsl(var(--primary))"
                        }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: activeEvent === index ? [1, 1.2, 1] : 1,
                            rotate: activeEvent === index ? [0, 180, 360] : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent 
                            size={12} 
                            className={activeEvent === index ? "text-primary" : "text-white"} 
                          />
                        </motion.div>
                      </motion.div>

                      {/* Content Card */}
                      <div className="ml-20 md:ml-0 md:w-full md:max-w-md">
                        <motion.div
                          className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-xl backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Background Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="relative z-10">
                            <div className={`flex items-center gap-4 mb-4 ${isEven ? "" : "md:flex-row-reverse"}`}>
                              <motion.div
                                className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <IconComponent className="text-primary" size={28} />
                              </motion.div>
                              <div className={`flex-1 ${isEven ? "" : "md:text-right"}`}>
                                <motion.h3
                                  className="font-serif text-2xl text-foreground mb-1"
                                  whileHover={{ color: "hsl(var(--primary))" }}
                                >
                                  {event.title}
                                </motion.h3>
                                <motion.p
                                  className="text-primary font-semibold text-lg"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {new Date(event.eventTime).toLocaleTimeString('vi-VN', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                </motion.p>
                              </div>
                            </div>

                            {event.location && (
                              <motion.div
                                className="flex items-center gap-2 mb-3 text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <MapPin size={16} />
                                <span className="text-sm font-medium">{event.location}</span>
                              </motion.div>
                            )}

                            {event.description && (
                              <motion.p
                                className="text-foreground leading-relaxed text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                {event.description}
                              </motion.p>
                            )}

                            {/* Duration Badge */}
                            {event.duration && (
                              <motion.div
                                className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-3"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                              >
                                <Clock size={14} />
                                {event.duration}
                              </motion.div>
                            )}
                          </div>

                          {/* Decorative Corner */}
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Connecting Line Animation */}
                    {index < events.length - 1 && (
                      <motion.div
                        className="absolute left-8 md:left-1/2 top-full w-1 h-8 bg-gradient-to-b from-primary/50 to-primary/30 transform -translate-x-1/2"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Start and End Markers */}
            <motion.div
              className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-primary rounded-full shadow-lg"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            />
            <motion.div
              className="absolute left-8 md:left-1/2 bottom-0 -translate-x-1/2 translate-y-2 w-4 h-4 bg-primary rounded-full shadow-lg"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
            />
          </motion.div>
        )}

        {/* Floating CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-primary/5 rounded-2xl p-6 border border-primary/20 max-w-md mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-foreground font-medium mb-2">
              📅 Đánh dấu lịch của bạn!
            </p>
            <p className="text-muted-foreground text-sm">
              Chúng tôi rất mong được gặp bạn vào ngày trọng đại
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}