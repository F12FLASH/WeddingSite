import { Heart, Instagram, Facebook, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import type { CoupleInfo, Settings } from "@shared/schema";

export default function Footer() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });

  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

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

  const socialLinks = [
    { icon: Instagram, href: settings?.instagramUrl || "#", label: "Instagram", show: !!settings?.instagramUrl },
    { icon: Facebook, href: settings?.facebookUrl || "#", label: "Facebook", show: !!settings?.facebookUrl },
  ].filter(link => link.show);

  const coupleNames = coupleInfo 
    ? `${coupleInfo.brideName} & ${coupleInfo.groomName}`
    : "Cô Dâu & Chú Rể";

  const footerText = settings?.footerText || "Cảm ơn bạn đã đồng hành cùng hành trình hạnh phúc của chúng tôi";
  const hashtag = settings?.hashtag || `#${coupleNames.replace(/\s+/g, '')}`;
  
  const contactInfo = [
    { icon: MapPin, text: settings?.venueName, show: !!settings?.venueName },
    { icon: Phone, text: settings?.venuePhone, show: !!settings?.venuePhone },
    { icon: Mail, text: settings?.venueEmail, show: !!settings?.venueEmail }
  ].filter(item => item.show);

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative bg-gradient-to-b from-slate-50 to-white border-t border-slate-200/60 py-16 px-4 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Gradient Orbs */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-rose-100/40 to-pink-100/30 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-l from-amber-100/30 to-orange-100/20 rounded-full blur-3xl" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Couple Info */}
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-6"
          >
            {/* Couple Names with Elegant Styling */}
            <motion.div
              className="flex items-center gap-4 justify-center lg:justify-start mb-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-8 h-8 text-rose-500" />
              </motion.div>
              <h3 className="font-serif text-3xl lg:text-4xl text-slate-800 tracking-tight">
                {coupleNames}
              </h3>
            </motion.div>

            {/* Wedding Date */}
            {settings?.weddingDate && (
              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-600 font-light italic"
              >
                {new Date(settings.weddingDate).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </motion.p>
            )}

            {/* Footer Message */}
            <motion.p
              variants={itemVariants}
              className="text-slate-600 leading-relaxed text-lg max-w-xl"
            >
              {footerText}
            </motion.p>

            {/* Contact Information */}
            {contactInfo.length > 0 && (
              <motion.div
                variants={containerVariants}
                className="space-y-3 pt-4"
              >
                {contactInfo.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="flex items-center gap-3 text-slate-600 justify-center lg:justify-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg flex items-center justify-center group-hover:from-rose-100 group-hover:to-pink-100 transition-colors">
                      <item.icon size={16} className="text-rose-500" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Social & Hashtag */}
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-right space-y-8"
          >
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div className="space-y-6">
                <motion.h4
                  variants={itemVariants}
                  className="text-lg font-semibold text-slate-800 uppercase tracking-wider"
                >
                  Theo Dõi Hành Trình
                </motion.h4>
                <motion.div
                  className="flex gap-4 justify-center lg:justify-end"
                  variants={containerVariants}
                >
                  {socialLinks.map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      variants={itemVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:border-rose-200">
                        <social.icon size={20} className="text-slate-600 group-hover:text-rose-500 transition-colors" />
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Hashtag */}
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <motion.p
                className="text-slate-600 text-sm font-medium"
                variants={itemVariants}
              >
                Chia sẻ khoảnh khắc với chúng tôi
              </motion.p>
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-3 rounded-2xl border border-rose-100/60 shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Heart size={16} className="text-rose-500" fill="currentColor" />
                <span className="font-serif text-lg text-rose-600 font-medium">
                  {hashtag}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Copyright Section */}
        <motion.div
          className="pt-8 border-t border-slate-200/80 text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Animated Hearts */}
          <motion.div
            className="flex justify-center gap-1 mb-2"
            variants={containerVariants}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              >
                <Heart size={12} className="text-rose-400" fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>

          {/* Copyright Text */}
          <motion.p
            className="text-slate-500 text-sm flex items-center justify-center gap-2 flex-wrap"
            whileHover={{ scale: 1.02 }}
          >
            <span>© 2025 {coupleNames}.</span>
            <span className="flex items-center gap-1">
              Được tạo với 
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart size={12} className="text-rose-500" fill="currentColor" />
              </motion.span>
              cho ngày trọng đại
            </span>
          </motion.p>

          {/* Final Blessing */}
          <motion.p
            className="text-slate-400 text-xs font-light italic"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Mong tình yêu và hạnh phúc sẽ đến với tất cả chúng ta
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}