import { useQuery } from "@tanstack/react-query";
import type { GuestPhoto } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GuestPhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GuestPhoto | null>(null);

  const { data: photos = [], isLoading } = useQuery<GuestPhoto[]>({
    queryKey: ["/api/guest-photos"],
    select: (data) => data.filter(photo => photo.approved),
  });

  if (isLoading) {
    return (
      <section id="guest-gallery" data-testid="section-guest-photo-gallery" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <section id="guest-gallery" data-testid="section-guest-photo-gallery" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <ImageIcon className="w-12 h-12 text-primary mx-auto" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            📷 Khoảnh Khắc Từ Khách Mời
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những bức ảnh đẹp do khách mời chụp và chia sẻ trong tiệc cưới
          </p>
          <Badge variant="secondary" className="mt-4">
            {photos.length} ảnh
          </Badge>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                data-testid={`guest-photo-${photo.id}`}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Card className="overflow-hidden group hover:shadow-2xl transition-shadow">
                  <div className="relative">
                    <img
                      src={photo.url}
                      alt={photo.caption || "Guest photo"}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        {photo.caption && (
                          <p className="text-sm font-medium line-clamp-2 mb-2">
                            {photo.caption}
                          </p>
                        )}
                        {photo.guestName && (
                          <div className="flex items-center gap-2 text-xs">
                            <User className="w-3 h-3" />
                            <span>{photo.guestName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent data-testid="dialog-photo-detail" className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Khoảnh Khắc Đẹp
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || "Guest photo"}
                  className="w-full max-h-[70vh] object-contain bg-muted"
                />
              </div>
              {selectedPhoto.caption && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Chú thích</p>
                  <p className="text-base">{selectedPhoto.caption}</p>
                </div>
              )}
              {selectedPhoto.guestName && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Người chia sẻ</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="font-medium">{selectedPhoto.guestName}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
