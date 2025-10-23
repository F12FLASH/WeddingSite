import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Photo } from "@shared/schema";

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const { data: photos = [], isLoading, isError, error } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const openLightbox = (index: number) => setSelectedPhoto(index);
  const closeLightbox = () => setSelectedPhoto(null);
  const nextPhoto = () =>
    setSelectedPhoto((prev) =>
      prev !== null ? (prev + 1) % photos.length : 0
    );
  const prevPhoto = () =>
    setSelectedPhoto((prev) =>
      prev !== null
        ? prev === 0
          ? photos.length - 1
          : prev - 1
        : 0
    );

  return (
    <section id="gallery" className="py-20 md:py-32 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-gallery"
          >
            Album Ảnh
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Những kỷ niệm chúng tôi đã tạo ra cùng nhau
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden h-64 bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-destructive" size={64} />
            <p className="text-destructive text-lg mb-2">Không thể tải ảnh</p>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Vui lòng thử lại sau"}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground text-lg">Chưa có ảnh. Hãy quay lại sau!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer hover-elevate animate-scale-in shadow-lg"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => openLightbox(index)}
                data-testid={`photo-${index}`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Ảnh cưới"}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto !== null && photos.length > 0 && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2 rounded-full bg-white/10 backdrop-blur-sm hover-elevate"
              data-testid="button-close-lightbox"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 text-white hover:text-primary transition-colors p-2 rounded-full bg-white/10 backdrop-blur-sm hover-elevate"
              data-testid="button-prev-photo"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 text-white hover:text-primary transition-colors p-2 rounded-full bg-white/10 backdrop-blur-sm hover-elevate"
              data-testid="button-next-photo"
            >
              <ChevronRight size={32} />
            </button>

            <div
              className="max-w-5xl max-h-[90vh] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedPhoto].url}
                alt={photos[selectedPhoto].caption || "Ảnh cưới"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                data-testid="img-lightbox"
              />
              {photos[selectedPhoto].caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {photos[selectedPhoto].caption}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
