import { useQuery } from "@tanstack/react-query";
import type { GuestPhoto } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Heart, User, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Hook để detect ảnh dọc/ngang
function useImageOrientation(url: string) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square' | 'unknown'>('unknown');

  useMemo(() => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width > height * 1.1) {
        setOrientation('landscape');
      } else if (height > width * 1.1) {
        setOrientation('portrait');
      } else {
        setOrientation('square');
      }
    };
    img.onerror = () => setOrientation('unknown');
    img.src = url;
  }, [url]);

  return orientation;
}

export default function GuestPhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GuestPhoto | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({});

  const { data: photos = [], isLoading } = useQuery<GuestPhoto[]>({
    queryKey: ["/api/guest-photos"],
    select: (data) => data.filter(photo => photo.approved),
  });

  if (isLoading) {
    return (
      <section id="guest-gallery" data-testid="section-guest-photo-gallery" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"
            />
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return null;
  }

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
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section 
      id="guest-gallery" 
      data-testid="section-guest-photo-gallery" 
      className="py-20 bg-gradient-to-br from-purple-50 via-blue-50/30 to-cyan-50/50 dark:from-purple-950/20 dark:via-blue-950/10 dark:to-cyan-950/10 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full opacity-20 blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <ImageIcon className="w-16 h-16 text-primary mx-auto" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-sm"
              />
            </div>
          </motion.div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📸 Khoảnh Khắc Đáng Nhớ
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Những khoảnh khắc chân thật và đẹp đẽ được ghi lại bởi khách mời trong ngày trọng đại
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Badge variant="secondary" className="mt-6 px-4 py-2 text-base">
              {photos.length} ảnh được chia sẻ
            </Badge>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {photos.map((photo, index) => (
              <PhotoCard 
                key={photo.id} 
                photo={photo} 
                index={index}
                onSelect={setSelectedPhoto}
                onLoad={() => setImageLoaded(prev => ({...prev, [photo.id]: true}))}
                isLoaded={!!imageLoaded[photo.id]}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <PhotoDialog 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
      />
    </section>
  );
}

// Separate component for individual photo card
function PhotoCard({ 
  photo, 
  index, 
  onSelect, 
  onLoad,
  isLoaded 
}: { 
  photo: GuestPhoto; 
  index: number;
  onSelect: (photo: GuestPhoto) => void;
  onLoad: () => void;
  isLoaded: boolean;
}) {
  const orientation = useImageOrientation(photo.url);

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const getAspectRatio = () => {
    switch (orientation) {
      case 'portrait': return 'aspect-[3/4]';
      case 'landscape': return 'aspect-[4/3]';
      case 'square': return 'aspect-square';
      default: return 'aspect-[4/3]';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      exit="exit"
      data-testid={`guest-photo-${photo.id}`}
      className="cursor-pointer group"
      onClick={() => onSelect(photo)}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="relative">
          {/* Loading skeleton */}
          {!isLoaded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${getAspectRatio()} bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse`}
            />
          )}
          
          {/* Actual image */}
          <motion.img
            src={photo.url}
            alt={photo.caption || "Guest photo"}
            className={`w-full ${getAspectRatio()} object-cover transition-all duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={onLoad}
            loading="lazy"
          />
          
          {/* Overlay with info */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {photo.caption && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm font-medium line-clamp-2 mb-3"
                >
                  {photo.caption}
                </motion.p>
              )}
              {photo.guestName && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{photo.guestName}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Shine effect on hover */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            whileHover={{ x: "100%", opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
          />
        </div>
      </Card>
    </motion.div>
  );
}

// Separate component for photo dialog
function PhotoDialog({ photo, onClose }: { photo: GuestPhoto | null; onClose: () => void }) {
  if (!photo) return null;

  const orientation = useImageOrientation(photo.url);

  const getDialogClass = () => {
    switch (orientation) {
      case 'portrait': return 'max-w-2xl';
      case 'landscape': return 'max-w-5xl';
      case 'square': return 'max-w-3xl';
      default: return 'max-w-4xl';
    }
  };

  return (
    <Dialog open={!!photo} onOpenChange={onClose}>
      <DialogContent data-testid="dialog-photo-detail" className={`${getDialogClass()} p-0 overflow-hidden`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
          >
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </motion.div>
                Khoảnh Khắc Đẹp
              </DialogTitle>
            </DialogHeader>
            
            <div className="relative">
              <img
                src={photo.url}
                alt={photo.caption || "Guest photo"}
                className={`w-full ${
                  orientation === 'portrait' ? 'max-h-[80vh]' : 'max-h-[70vh]'
                } object-contain bg-muted`}
              />
            </div>
            
            {(photo.caption || photo.guestName) && (
              <div className="p-6 pt-4 space-y-4 bg-gradient-to-t from-background to-background/80">
                {photo.caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Chú thích</p>
                    <p className="text-lg leading-relaxed">{photo.caption}</p>
                  </motion.div>
                )}
                {photo.guestName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between pt-4 border-t"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Người chia sẻ</p>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <p className="font-semibold text-lg">{photo.guestName}</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-5 h-5 text-primary" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}