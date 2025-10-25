import { Heart, Instagram, Facebook, Twitter } from "lucide-react";
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
    queryKey: ["/api/couple-info"],
  });

  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const socialLinks = [
    { icon: Instagram, href: settings?.instagramUrl || "#", label: "Instagram", show: !!settings?.instagramUrl },
    { icon: Facebook, href: settings?.facebookUrl || "#", label: "Facebook", show: !!settings?.facebookUrl },
    { icon: Twitter, href: settings?.twitterUrl || "#", label: "Twitter", show: !!settings?.twitterUrl }
  ].filter(link => link.show);

  const coupleNames = coupleInfo 
    ? `${coupleInfo.brideName.split(' ').pop()} & ${coupleInfo.groomName.split(' ').pop()}`
    : "Cô Dâu & Chú Rể";

  const footerText = settings?.footerText || "Cùng chia sẻ câu chuyện tình yêu của chúng tôi";
  const hashtag = settings?.hashtag || `#${coupleNames.replace(/\s+/g, '')}2025`;

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-card border-t border-card-border py-16 px-4 overflow-hidden relative"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          className="flex flex-col items-center justify-center gap-8"
        >
          {/* Brand Section - Centered */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <motion.div
              className="flex items-center gap-3 justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="text-primary" size={28} fill="currentColor" />
              </motion.div>
              <span className="font-cursive text-3xl text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {coupleNames}
              </span>
            </motion.div>
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed max-w-2xl"
              whileHover={{ scale: 1.02 }}
            >
              {footerText}
            </motion.p>
          </motion.div>

          {/* Social & Hashtag */}
          {socialLinks.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                className="flex gap-4 justify-center mb-4"
                variants={containerVariants}
              >
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    data-testid={`link-${social.label.toLowerCase()}`}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      backgroundColor: "hsl(var(--primary))",
                      color: "white"
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </motion.div>
              <motion.p
                className="text-muted-foreground text-lg font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              >
                {hashtag}
              </motion.p>
            </motion.div>
          )}
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center pt-12 border-t border-card-border mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.p
            className="text-muted-foreground text-base flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            © 2025 {coupleNames}. Được tạo với{" "}
            <motion.span
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart
                size={16}
                className="inline text-primary"
                fill="currentColor"
              />
            </motion.span>{" "}
            cho ngày đặc biệt của chúng tôi
          </motion.p>
          
          {/* Floating Hearts */}
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                <Heart
                  size={12}
                  className="text-primary/60"
                  fill="currentColor"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
