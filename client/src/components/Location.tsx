import { MapPin, Navigation, Phone, Clock, Car, Wifi, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";

export default function Location() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const venueName = settings?.venueName || "Rose Garden Estate";
  const venueAddress = settings?.venueAddress || "123 Garden Lane, Spring Valley, CA 91977";
  const venuePhone = settings?.venuePhone || "+1 (555) 123-4567";
  const venueEmail = settings?.venueEmail || "info@rosegardenestate.com";
  
  // Format event times if available
  const formatEventTime = () => {
    if (settings?.eventStartTime && settings?.eventEndTime) {
      const startTime = new Date(settings.eventStartTime);
      const endTime = new Date(settings.eventEndTime);
      const startTimeStr = startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const endTimeStr = endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `${startTimeStr} - ${endTimeStr}`;
    }
    return "3:00 Chiều - 10:00 Tối";
  };

  const formatEventDate = () => {
    if (settings?.eventStartTime) {
      const eventDate = new Date(settings.eventStartTime);
      return eventDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return "15 Tháng 6, 2025";
  };
  
  const venueDetails = {
    name: venueName,
    address: {
      line1: venueAddress.split(',')[0] || venueAddress,
      line2: venueAddress.split(',').slice(1).join(',').trim() || ""
    },
    contact: {
      phone: venuePhone,
      email: venueEmail
    },
    timing: {
      date: formatEventDate(),
      time: formatEventTime()
    },
    amenities: [
      { icon: Car, label: "Bãi đỗ xe miễn phí"},
      { icon: Wifi, label: "Wi-Fi miễn phí"},
      { icon: Utensils, label: "Nhà hàng"}
    ]
  };

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

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const getDirections = () => {
    if (settings?.venueMapLink) {
      window.open(settings.venueMapLink, '_blank');
    } else {
      const address = encodeURIComponent(`${venueDetails.address.line1}, ${venueDetails.address.line2}`);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
    }
  };

  return (
    <section id="location" className="py-20 md:py-32 px-4 bg-background overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-location"
          >
            Địa Điểm Tổ Chức
          </h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Hãy đến với chúng tôi tại địa điểm tuyệt đẹp
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Venue Image & Map */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Venue Image */}
            <motion.div
              className="rounded-2xl overflow-hidden shadow-2xl mb-6 relative group cursor-pointer"
              variants={imageVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img
                src={settings?.venueImage || "https://placehold.co/800x600/e3e3e3/999999?text=Venue+Image"}
                alt="Địa Điểm Cưới"
                className="w-full h-80 object-contain bg-muted"
                data-testid="img-venue"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white text-lg font-medium">{venueName}</p>
              </div>
            </motion.div>

            {/* Interactive Map */}
            <motion.div
              className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-2xl h-80 relative"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {!isMapLoaded && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center z-10"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isMapLoaded ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MapPin className="mx-auto mb-4 text-primary" size={48} />
                    </motion.div>
                    <p className="text-muted-foreground text-lg font-medium">
                      Đang tải bản đồ...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {venueDetails.name}
                    </p>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Google Maps Iframe */}
              {settings?.venueMapLink ? (
                <iframe
                  src={settings.venueMapLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setIsMapLoaded(true)}
                  onError={() => {
                    console.error("Failed to load Google Maps iframe");
                    setIsMapLoaded(true);
                  }}
                  data-testid="iframe-map"
                  title="Bản đồ địa điểm tổ chức"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Chưa có bản đồ</p>
                    <p className="text-xs mt-2">Vui lòng thêm link Google Maps trong Admin</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Venue Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-2xl backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3
                className="font-serif text-3xl mb-6 text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                {venueDetails.name}
              </motion.h3>

              <motion.div
                className="space-y-6"
                variants={containerVariants}
              >
                {/* Address */}
                <motion.div
                  className="flex items-start gap-4 group cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MapPin className="text-primary" size={24} />
                  </motion.div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Địa Chỉ</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {venueDetails.address.line1}
                      <br />
                      {venueDetails.address.line2}
                    </p>
                  </div>
                </motion.div>

                {/* Contact */}
                <motion.div
                  className="flex items-start gap-4 group cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Phone className="text-primary" size={24} />
                  </motion.div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Liên Hệ</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {venueDetails.contact.phone}
                      <br />
                      {venueDetails.contact.email}
                    </p>
                  </div>
                </motion.div>

                {/* Timing */}
                <motion.div
                  className="flex items-start gap-4 group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="text-primary" size={24} />
                  </motion.div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Thời Gian Sự Kiện
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {venueDetails.timing.date}
                      <br />
                      {venueDetails.timing.time}
                    </p>
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  variants={containerVariants}
                >
                  {venueDetails.amenities.map((amenity, index) => (
                    <motion.div
                      key={amenity.label}
                      className="bg-primary/5 rounded-xl p-3 border border-primary/10 text-center group cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(59, 130, 246, 0.1)"
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors"
                        whileHover={{ scale: 1.2 }}
                      >
                        <amenity.icon className="text-primary" size={16} />
                      </motion.div>
                      <p className="text-xs font-medium text-foreground mb-1">
                        {amenity.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {amenity.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Parking Info */}
                <motion.div
                  className="bg-primary/5 rounded-xl p-4 border border-primary/20"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="font-medium text-foreground mb-2">
                    🅿️ Thông Tin Đỗ Xe
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dịch vụ đỗ xe miễn phí có sẵn. Bãi đỗ xe bổ sung nằm ở phía bắc. 
                    Vui lòng đến sớm để có chỗ đỗ xe thuận tiện.
                  </p>
                </motion.div>

                {/* Directions Button */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                    onClick={getDirections}
                    data-testid="button-directions"
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Navigation size={20} className="mr-3" />
                    </motion.div>
                    Chỉ Đường Đến Địa Điểm
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}