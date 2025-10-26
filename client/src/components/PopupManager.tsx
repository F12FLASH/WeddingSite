import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Popup } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PopupManager() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showScrollEnd, setShowScrollEnd] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [hasShownScrollEnd, setHasShownScrollEnd] = useState(false);

  const { data: popups } = useQuery<Popup[]>({
    queryKey: ["/api/popups"],
  });

  const welcomePopup = popups?.find((p) => p.type === "welcome" && p.isActive);
  const scrollEndPopup = popups?.find((p) => p.type === "scroll_end" && p.isActive);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup");
    
    if (welcomePopup && !hasSeenWelcome && !hasShownWelcome) {
      setTimeout(() => {
        setShowWelcome(true);
        setHasShownWelcome(true);
      }, 1000);
    }
  }, [welcomePopup, hasShownWelcome]);

  useEffect(() => {
    if (!scrollEndPopup) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage > 0.95 && !hasShownScrollEnd) {
        setShowScrollEnd(true);
        setHasShownScrollEnd(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollEndPopup, hasShownScrollEnd]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("hasSeenWelcomePopup", "true");
  };

  const handleCloseScrollEnd = () => {
    setShowScrollEnd(false);
  };

  const PopupContent = ({ popup, onClose }: { popup: Popup; onClose: () => void }) => (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-testid={`popup-overlay-${popup.type}`}
    >
      <motion.div
        className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        data-testid={`popup-content-${popup.type}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          data-testid={`button-close-popup-${popup.type}`}
        >
          <X className="text-white" size={24} />
        </button>
        
        <div className="relative">
          <img
            src={popup.imageUrl}
            alt={popup.title || "Popup"}
            className="w-full max-h-[80vh] object-contain"
            data-testid={`img-popup-${popup.type}`}
          />
          
          {(popup.title || popup.description) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              {popup.title && (
                <h3 className="text-2xl font-bold mb-2" data-testid={`heading-popup-title-${popup.type}`}>
                  {popup.title}
                </h3>
              )}
              {popup.description && (
                <p className="text-lg" data-testid={`text-popup-description-${popup.type}`}>
                  {popup.description}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {showWelcome && welcomePopup && (
        <PopupContent popup={welcomePopup} onClose={handleCloseWelcome} />
      )}
      {showScrollEnd && scrollEndPopup && (
        <PopupContent popup={scrollEndPopup} onClose={handleCloseScrollEnd} />
      )}
    </AnimatePresence>
  );
}
