import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Download, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "@shared/schema";

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const { data: photos = [], isLoading, isError, error } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto !== null) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") {
          setDirection(1);
          nextPhoto();
        }
        if (e.key === "ArrowLeft") {
          setDirection(-1);
          prevPhoto();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    setDirection(0);
  };

  const closeLightbox = () => setSelectedPhoto(null);

  const nextPhoto = () => {
    setDirection(1);
    setSelectedPhoto((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
  };

  const prevPhoto = () => {
    setDirection(-1);
    setSelectedPhoto((prev) =>
      prev !== null ? (prev === 0 ? photos.length - 1 : prev - 1) : 0
    );
  };

  const sharePhoto = async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ảnh cưới Sarah & Michael",
          text: photo.caption || "Chia sẻ khoảnh khắc đặc biệt",
          url: photo.url,
        });
      } catch (err) {
        console.log("Sharing cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(photo.url);
      // You can add a toast notification here
    }
  };

  const downloadPhoto = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      y: 100,
      rotateX: -90,
      rotateY: 20,
      rotateZ: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        duration: 1.2,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    })
  };

  return (
    <section id="gallery" className="py-20 md:py-32 px-4 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-gallery"
          >
            Album Ảnh
          </h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          />
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Những kỷ niệm chúng tôi đã tạo ra cùng nhau
          </motion.p>
        </motion.div>

        {/* Photo Grid - Masonry Layout */}
        {isLoading ? (
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 animate-pulse break-inside-avoid mb-4"
                style={{ height: `${200 + (i % 3) * 80}px` }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
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
            <p className="text-destructive text-lg mb-2">Không thể tải ảnh</p>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
            </p>
          </motion.div>
        ) : photos.length === 0 ? (
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
              <Heart className="mx-auto mb-4 text-muted-foreground" size={64} />
            </motion.div>
            <p className="text-muted-foreground text-lg">Chưa có ảnh. Hãy quay lại sau!</p>
          </motion.div>
        ) : (
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg bg-background break-inside-avoid mb-4"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
                whileHover={{ 
                  scale: 1.08,
                  y: -12,
                  rotateY: index % 2 === 0 ? 5 : -5,
                  rotateX: -3,
                  zIndex: 10,
                  boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.35)",
                  filter: "brightness(1.05)"
                }}
                whileTap={{ 
                  scale: 0.92,
                  rotateY: 0,
                  rotateX: 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  mass: 0.8
                }}
                onClick={() => openLightbox(index)}
                data-testid={`photo-${index}`}
              >
                <motion.div
                  className="relative overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{ 
                    scale: 1.15,
                    rotateZ: index % 3 === 0 ? 2 : index % 3 === 1 ? -2 : 0
                  }}
                  transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <motion.img
                    src={photo.url}
                    alt={photo.caption || "Ảnh cưới"}
                    className="w-full h-auto object-cover"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ 
                      filter: "brightness(1) saturate(1) contrast(1)",
                      scale: 1
                    }}
                    whileHover={{ 
                      filter: "brightness(1.15) saturate(1.2) contrast(1.05)",
                      scale: 1.02
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Enhanced Shimmer Effect with Rainbow Colors */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0"
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "200%", opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  
                  {/* Magical Sparkle Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
                      mixBlendMode: "overlay"
                    }}
                    whileHover={{ opacity: 0.4 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
                
                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {photo.caption && (
                    <motion.p
                      className="text-white text-sm font-medium mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {photo.caption}
                    </motion.p>
                  )}
                  <motion.div
                    className="flex gap-2"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sharePhoto(photo);
                      }}
                      className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Share2 size={16} className="text-white" />
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence mode="wait" custom={direction}>
          {selectedPhoto !== null && photos.length > 0 && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-3 rounded-full bg-white/10 backdrop-blur-sm z-10"
                data-testid="button-close-lightbox"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              {/* Navigation Buttons */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-6 text-white hover:text-primary transition-colors p-3 rounded-full bg-white/10 backdrop-blur-sm z-10"
                data-testid="button-prev-photo"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={32} />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-6 text-white hover:text-primary transition-colors p-3 rounded-full bg-white/10 backdrop-blur-sm z-10"
                data-testid="button-next-photo"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={32} />
              </motion.button>

              {/* Action Buttons */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPhoto(photos[selectedPhoto].url, `photo-${selectedPhoto + 1}.jpg`);
                }}
                className="absolute top-6 left-6 text-white hover:text-primary transition-colors p-3 rounded-full bg-white/10 backdrop-blur-sm z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download size={24} />
              </motion.button>

              {/* Photo Display */}
              <motion.div
                className="max-w-5xl max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                key={selectedPhoto}
              >
                <motion.img
                  src={photos[selectedPhoto].url}
                  alt={photos[selectedPhoto].caption || "Ảnh cưới"}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  data-testid="img-lightbox"
                />
                {photos[selectedPhoto].caption && (
                  <motion.p
                    className="text-white text-center mt-4 text-lg bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {photos[selectedPhoto].caption}
                  </motion.p>
                )}
              </motion.div>

              {/* Photo Counter */}
              <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {selectedPhoto + 1} / {photos.length}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}