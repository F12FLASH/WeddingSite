import { useState } from "react";
import { Calendar, Mail, Phone, Users, Utensils, Heart, Clock, MapPin, CheckCircle, XCircle, AlertCircle, User, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import type { CoupleInfo, Settings } from "@shared/schema";

export default function RSVP() {
  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });
  
  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    attending: true,
    guestCount: 1,
    mealPreference: "",
    specialRequirements: "",
  });

  const { toast } = useToast();

  const createRsvpMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/rsvps", data);
    },
    onSuccess: () => {
      toast({
        title: "Đã Nhận Xác Nhận!",
        description: "Cảm ơn phản hồi của bạn. Chúng tôi rất mong được ăn mừng cùng bạn!",
      });
      setFormData({
        guestName: "",
        email: "",
        phone: "",
        attending: true,
        guestCount: 1,
        mealPreference: "",
        specialRequirements: "",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể gửi xác nhận. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.email) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền tất cả các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    createRsvpMutation.mutate(formData);
  };

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

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="rsvp" className="py-20 md:py-32 px-4 bg-card relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart size={40} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-rsvp"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Xác Nhận Tham Dự
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Vui lòng phản hồi trước ngày <span className="text-primary font-semibold">
              {coupleInfo?.weddingDate 
                ? (() => {
                    const deadline = new Date(coupleInfo.weddingDate);
                    deadline.setDate(deadline.getDate() - 7);
                    return deadline.toLocaleDateString('vi-VN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    });
                  })()
                : "01 Tháng 5, 2025"}
            </span>
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-background rounded-2xl p-6 md:p-8 border border-border shadow-2xl backdrop-blur-sm relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Name */}
                <motion.div variants={itemVariants}>
                  <Label htmlFor="name" className="text-foreground mb-3 block text-lg font-medium flex items-center gap-2">
                    <User size={18} />
                    Họ Và Tên *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="rounded-xl h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    data-testid="input-rsvp-name"
                    disabled={createRsvpMutation.isPending}
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <Label htmlFor="email" className="text-foreground mb-3 block text-lg font-medium flex items-center gap-2">
                    <Mail size={18} />
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nguyen@example.com"
                      className="pl-12 rounded-xl h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="input-rsvp-email"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants}>
                  <Label htmlFor="phone" className="text-foreground mb-3 block text-lg font-medium flex items-center gap-2">
                    <Phone size={18} />
                    Số Điện Thoại
                  </Label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+84 (xxx) xxx-xxxx"
                      className="pl-12 rounded-xl h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="input-rsvp-phone"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </motion.div>

                {/* Attending */}
                <motion.div variants={itemVariants}>
                  <Label className="text-foreground mb-4 block text-lg font-medium flex items-center gap-2">
                    <Heart size={18} />
                    Bạn có tham dự không? *
                  </Label>
                  <RadioGroup
                    value={formData.attending ? "yes" : "no"}
                    onValueChange={(value) => setFormData({ ...formData, attending: value === "yes" })}
                    className="flex gap-6"
                    data-testid="radio-attending"
                    disabled={createRsvpMutation.isPending}
                  >
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      <RadioGroupItem value="yes" id="yes" className="w-5 h-5" />
                      <Label htmlFor="yes" className="cursor-pointer text-lg font-medium flex items-center gap-2">
                        <CheckCircle size={18} />
                        Có, tôi sẽ đến
                      </Label>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      <RadioGroupItem value="no" id="no" className="w-5 h-5" />
                      <Label htmlFor="no" className="cursor-pointer text-lg font-medium flex items-center gap-2">
                        <XCircle size={18} />
                        Rất tiếc, tôi không thể đến
                      </Label>
                    </motion.div>
                  </RadioGroup>
                </motion.div>

                <AnimatePresence mode="wait">
                  {formData.attending && (
                    <motion.div
                      key="attending-fields"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-6"
                    >
                      {/* Guest Count */}
                      <motion.div variants={itemVariants}>
                        <Label className="text-foreground mb-4 block text-lg font-medium flex items-center gap-2">
                          <Users size={20} />
                          Số Lượng Khách
                        </Label>
                        <div className="flex items-center gap-4 bg-muted/50 rounded-xl p-4">
                          <MotionButton
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                            data-testid="button-decrease-guests"
                            disabled={createRsvpMutation.isPending}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            -
                          </MotionButton>
                          <motion.span
                            className="text-2xl font-bold w-16 text-center text-primary"
                            data-testid="text-guest-count"
                            key={formData.guestCount}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            {formData.guestCount}
                          </motion.span>
                          <MotionButton
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={() => setFormData({ ...formData, guestCount: Math.min(10, formData.guestCount + 1) })}
                            data-testid="button-increase-guests"
                            disabled={createRsvpMutation.isPending}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            +
                          </MotionButton>
                        </div>
                      </motion.div>

                      {/* Meal Preference */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="meal" className="text-foreground mb-3 block text-lg font-medium flex items-center gap-2">
                          <Utensils size={20} />
                          Lựa Chọn Món Ăn
                        </Label>
                        <Select
                          value={formData.mealPreference}
                          onValueChange={(value) => setFormData({ ...formData, mealPreference: value })}
                          disabled={createRsvpMutation.isPending}
                        >
                          <SelectTrigger
                            id="meal"
                            className="rounded-xl h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                            data-testid="select-meal"
                          >
                            <SelectValue placeholder="Chọn món bạn thích" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chicken">Gà</SelectItem>
                            <SelectItem value="beef">Bò</SelectItem>
                            <SelectItem value="fish">Cá</SelectItem>
                            <SelectItem value="vegetarian">Chay</SelectItem>
                            <SelectItem value="vegan">Thuần Chay</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Special Requirements */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="special" className="text-foreground mb-3 block text-lg font-medium flex items-center gap-2">
                          <Sparkles size={18} />
                          Yêu Cầu Đặc Biệt
                        </Label>
                        <Textarea
                          id="special"
                          placeholder="Hạn chế chế độ ăn, dị ứng, nhu cầu tiếp cận..."
                          rows={4}
                          className="rounded-xl resize-none text-lg border-2 focus:border-primary transition-all duration-300"
                          value={formData.specialRequirements}
                          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                          data-testid="input-special-requirements"
                          disabled={createRsvpMutation.isPending}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                  <MotionButton
                    type="submit"
                    className="w-full rounded-xl h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    size="lg"
                    data-testid="button-submit-rsvp"
                    disabled={createRsvpMutation.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      {createRsvpMutation.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Clock size={20} />
                          </motion.div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Gửi Xác Nhận
                        </>
                      )}
                    </div>
                  </MotionButton>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* Event Details Sidebar */}
          <motion.div
            className="lg:col-span-2"
            variants={sidebarVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20 backdrop-blur-sm sticky top-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3
                className="font-serif text-2xl mb-6 text-foreground flex items-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Heart className="text-primary" size={24} fill="currentColor" />
                Thông Tin Sự Kiện
              </motion.h3>
              
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <Calendar className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ngày</p>
                    <p className="text-foreground font-medium text-lg">
                      {coupleInfo?.weddingDate 
                        ? new Date(coupleInfo.weddingDate).toLocaleDateString('vi-VN', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })
                        : "15 Tháng 6, 2025"}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <Clock className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Thời Gian</p>
                    <p className="text-foreground font-medium text-lg">
                      {settings?.eventStartTime && settings?.eventEndTime
                        ? (() => {
                            const startTime = new Date(settings.eventStartTime);
                            const endTime = new Date(settings.eventEndTime);
                            const startTimeStr = startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                            const endTimeStr = endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                            return `${startTimeStr} - ${endTimeStr}`;
                          })()
                        : "3:00 Chiều - 10:00 Tối"}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Địa Điểm</p>
                    <p className="text-foreground font-medium text-lg">
                      {settings?.venueName || "Rose Garden Estate"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {settings?.venueAddress || "123 Garden Lane, Spring Valley, CA 91977"}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <p className="text-sm text-muted-foreground mb-2">👔 Trang Phục</p>
                  <p className="text-foreground font-medium text-lg">
                    Trang Trọng / Vest Đen Tùy Chọn
                  </p>
                </motion.div>

                {/* Countdown Note */}
                <motion.div
                  className="bg-primary/10 rounded-xl p-4 border border-primary/20 mt-6"
                  variants={itemVariants}
                >
                  <p className="text-sm text-foreground font-medium text-center">
                    ⏰ Vui lòng phản hồi trước ngày{' '}
                    {coupleInfo?.weddingDate 
                      ? (() => {
                          const deadline = new Date(coupleInfo.weddingDate);
                          deadline.setDate(deadline.getDate() - 7);
                          return deadline.toLocaleDateString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          });
                        })()
                      : "01/05/2025"}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}