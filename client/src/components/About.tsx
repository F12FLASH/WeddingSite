import { HeartIcon, SparklesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import type { CoupleInfo } from "@shared/schema";

export default function About() {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch couple info from database
  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });

  // Use database data if available, otherwise use default
  const story = {
    bride: {
      name: coupleInfo?.brideName || "Xuân Lâm",
      description: coupleInfo?.brideDescription || "Cô dâu Xuân Lâm - Người phụ nữ xinh đẹp, dịu dàng với nụ cười rạng rỡ luôn tỏa sáng. Lâm là một dược sĩ tận tâm với công việc, luôn quan tâm chăm sóc sức khỏe cộng đồng.",
      photo: coupleInfo?.bridePhoto || ""
    },
    groom: {
      name: coupleInfo?.groomName || "Xuân Lợi",
      description: coupleInfo?.groomDescription || "Chú rể Xuân Lợi - Chàng trai thông minh, trách nhiệm và luôn tươi cười. Lợi là một kiến trúc sư tài năng với niềm đam mê thiết kế không gian sống hiện đại, ấm cúng.",
      photo: coupleInfo?.groomPhoto || ""
    },
    story: coupleInfo?.ourStory 
      ? coupleInfo.ourStory.split('\n\n') 
      : [
          "Chúng tôi gặp nhau vào mùa xuân năm 2022 tại triển lãm nghệ thuật ở Hà Nội. Từ lần gặp gỡ định mệnh đó, chúng tôi bắt đầu những buổi hẹn hò lãng mạn và khám phá tình yêu đích thực.",
          "Sau hai năm yêu thương và thấu hiểu, Lợi đã cầu hôn Lâm tại Đà Lạt, thành phố ngàn hoa. Giờ đây, chúng tôi rất hạnh phúc được chia sẻ niềm vui này với gia đình và bạn bè."
        ]
  };

  return (
    <section id="about" className="section-padding bg-card overflow-hidden">
      <div className="container-max">
        {/* Floating Background Elements */}
        <FloatingElements />
        
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="section-heading"
            data-testid="heading-about"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Câu Chuyện Của Chúng Tôi
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Hành trình yêu thương của chúng tôi
          </motion.p>
          <motion.div 
            className="section-divider"
            initial={{ width: 0 }}
            animate={headerInView ? { width: "6rem" } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>

        {/* Couple Profiles */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 md:gap-20">
          <ProfileCard 
            person={story.bride}
            heartPosition="top-right"
            delay={0.2}
          />
          <ProfileCard 
            person={story.groom}
            heartPosition="top-left"
            delay={0.5}
          />
        </div>

        {/* Story Content */}
        <StoryContent story={story.story} />
      </div>
    </section>
  );
}

// Floating Background Elements
function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 rounded-full bg-primary/20"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-6 h-6 rounded-full bg-primary/10"
        animate={{
          y: [0, 30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-3 h-3 rounded-full bg-primary/15"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </>
  );
}

// Profile Card with Enhanced Animations
function ProfileCard({ 
  person, 
  heartPosition, 
  delay 
}: { 
  person: { name: string; description: string; photo: string };
  heartPosition: 'top-left' | 'top-right';
  delay: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const heartPositionClasses = {
    'top-left': '-top-2 -left-2',
    'top-right': '-top-2 -right-2'
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotate: heartPosition === 'top-left' ? -5 : 5 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay + 0.3,
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="text-center"
    >
      <motion.div className="relative inline-block mb-6">
        <motion.div
          className="profile-image-container relative overflow-hidden"
          variants={imageVariants}
          transition={{ duration: 0.8, delay }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          <motion.img
            src={person.photo}
            alt={person.name}
            className="profile-image"
            data-testid={`img-${person.name.toLowerCase()}`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>

        {/* Animated Heart */}
        <motion.div
          className={`absolute ${heartPositionClasses[heartPosition]} text-primary`}
          initial={{ scale: 0, rotate: -180 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: delay + 0.5 
          }}
          whileHover={{
            scale: 1.2,
            rotate: 10,
            transition: { duration: 0.2 }
          }}
        >
          <HeartIcon 
            size={40} 
            className="text-primary fill-current drop-shadow-lg" 
          />
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
          className="absolute -bottom-2 -right-2"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <SparklesIcon size={24} className="text-yellow-400/60" />
        </motion.div>
      </motion.div>

      <motion.h3 
        className="profile-name"
        data-testid={`text-${person.name.toLowerCase()}-name`}
        variants={textVariants}
      >
        {person.name}
      </motion.h3>
      
      <motion.p 
        className="profile-description"
        variants={textVariants}
      >
        {person.description}
      </motion.p>
    </motion.div>
  );
}

// Story Content with Typing Animation
function StoryContent({ story }: { story: string[] }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const paragraphVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(5px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="story-content"
    >
      {story.map((paragraph, index) => (
        <motion.p
          key={index}
          variants={paragraphVariants}
          className={`story-paragraph ${index === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
          data-testid={`text-story-${index}`}
        >
          {paragraph}
        </motion.p>
      ))}
      
      {/* Decorative Element */}
      <motion.div
        className="flex justify-center mt-8 space-x-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
