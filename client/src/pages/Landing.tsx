import Hero from "@/components/Hero";
import About from "@/components/About";
import Schedule from "@/components/Schedule";
import WeddingParty from "@/components/WeddingParty";
import Gallery from "@/components/Gallery";
import Messages from "@/components/Messages";
import RSVP from "@/components/RSVP";
import Location from "@/components/Location";
import Registry from "@/components/Registry";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import PopupManager from "@/components/PopupManager";
import Livestream from "@/components/Livestream";
import GuestPhotoUpload from "@/components/GuestPhotoUpload";
import GuestPhotoGallery from "@/components/GuestPhotoGallery";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isLoading, setIsLoading] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-4"
          >
            💍
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-cursive text-4xl md:text-6xl text-foreground mb-4"
          >
            Trang Web Cưới
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-muted-foreground text-lg"
          >
            Đang tải trang web cưới...
          </motion.p>
          <motion.div
            className="mt-8 w-48 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "12rem" }}
            transition={{ delay: 0.3, duration: 1.5 }}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ 
                delay: 0.5, 
                duration: 2, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen scroll-smooth bg-background" id="home">
      {/* Global Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Navigation />
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <Hero />
      </motion.section>

      {/* About Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <About />
      </motion.section>

      {/* Livestream Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <Livestream />
      </motion.section>

      {/* Schedule Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <Schedule />
      </motion.section>

      {/* Wedding Party Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <WeddingParty />
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <Gallery />
      </motion.section>

      {/* Guest Photo Gallery Section - Moved below Gallery */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <GuestPhotoGallery />
      </motion.section>

      {/* Guest Photo Upload Section - Moved below GuestPhotoGallery */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <GuestPhotoUpload />
      </motion.section>

      {/* Messages Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <Messages />
      </motion.section>

      {/* RSVP Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <RSVP />
      </motion.section>

      {/* Location Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15%" }}
        variants={sectionVariants}
      >
        <Location />
      </motion.section>


      {/* Footer */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <Footer />
      </motion.section>

      {/* Music Player */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <MusicPlayer />
      </motion.div>

      {/* Popup Manager */}
      <PopupManager />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Background Decorations */}
      <BackgroundElements />
    </div>
  );
}

// Scroll to Top Component
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.button
      className={`fixed bottom-6 left-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: isVisible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <path d="m18 15-6-6-6 6"/>
      </motion.svg>
    </motion.button>
  );
}

// Background Elements Component
function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Hearts */}
      {[...Array(8)].map((_, i) => (
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
            duration: 15 + Math.random() * 10,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="currentColor"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </motion.svg>
        </motion.div>
      ))}

      {/* Floating Circles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full bg-primary/5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 30}px`,
            height: `${20 + Math.random() * 30}px`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-primary/10 to-primary/5 blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}