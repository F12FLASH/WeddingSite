import { useState } from "react";
import { Calendar, Mail, Phone, Users, Utensils, Heart, Clock, MapPin, CheckCircle, XCircle, User, Send, Sparkles, Video } from "lucide-react";
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
import type { CoupleInfo, Settings, LivestreamInfo } from "@shared/schema";

export default function RSVP() {
  const { data: coupleInfo } = useQuery<CoupleInfo | null>({
    queryKey: ["/api/couple"],
  });
  
  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const { data: livestream } = useQuery<LivestreamInfo>({
    queryKey: ["/api/livestream"],
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
    hidden: { opacity: 0, y: 20 },
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
    hidden: { opacity: 0, x: -30 },
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
    hidden: { opacity: 0, x: 30 },
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

  const attendingFieldsVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      marginTop: 0,
      overflow: "hidden"
    },
    visible: { 
      opacity: 1,
      height: "auto",
      marginTop: "1.5rem",
      overflow: "visible",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      marginTop: 0,
      overflow: "hidden",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="rsvp" className="py-20 md:py-28 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-rose-100/40 to-pink-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-l from-amber-100/30 to-orange-100/20 rounded-full blur-3xl" />
        
        {/* Floating Hearts */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/40"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 6 + i * 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart size={24 + i * 4} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl mb-6 text-slate-800"
            data-testid="heading-rsvp"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Xác Nhận Tham Dự
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-6 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Vui lòng phản hồi trước ngày{' '}
            <span className="text-rose-600 font-semibold">
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
            </span>{' '}
            để chúng tôi có thể chuẩn bị chu đáo nhất
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-2"
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-xl backdrop-blur-sm relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-pink-50/20" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-200/10 rounded-full -translate-y-20 translate-x-20" />
              
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
                  <Label htmlFor="name" className="text-slate-700 mb-3 block text-base font-semibold">
                    Họ Và Tên *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="pl-12 rounded-xl h-12 text-base border-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-300"
                      required
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      data-testid="input-rsvp-name"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <Label htmlFor="email" className="text-slate-700 mb-3 block text-base font-semibold">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nguyen@example.com"
                      className="pl-12 rounded-xl h-12 text-base border-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-300"
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
                  <Label htmlFor="phone" className="text-slate-700 mb-3 block text-base font-semibold">
                    Số Điện Thoại
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+84 (xxx) xxx-xxxx"
                      className="pl-12 rounded-xl h-12 text-base border-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-300"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="input-rsvp-phone"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </motion.div>

                {/* Attending */}
                <motion.div variants={itemVariants}>
                  <Label className="text-slate-700 mb-4 block text-base font-semibold">
                    Bạn có tham dự không? *
                  </Label>
                  <RadioGroup
                    value={formData.attending ? "yes" : "no"}
                    onValueChange={(value) => setFormData({ ...formData, attending: value === "yes" })}
                    className="grid grid-cols-2 gap-4"
                    data-testid="radio-attending"
                    disabled={createRsvpMutation.isPending}
                  >
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                    >
                      <RadioGroupItem value="yes" id="yes" className="sr-only" />
                      <Label 
                        htmlFor="yes" 
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.attending 
                            ? 'border-rose-400 bg-rose-50 text-rose-700' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle size={24} className="mb-2" />
                        <span className="font-semibold">Có, tôi sẽ đến</span>
                      </Label>
                    </motion.div>
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                    >
                      <RadioGroupItem value="no" id="no" className="sr-only" />
                      <Label 
                        htmlFor="no" 
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          !formData.attending 
                            ? 'border-slate-400 bg-slate-100 text-slate-700' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <XCircle size={24} className="mb-2" />
                        <span className="font-semibold">Không thể đến</span>
                      </Label>
                    </motion.div>
                  </RadioGroup>
                </motion.div>

                {/* Additional Fields - Sửa lỗi ở đây */}
                <AnimatePresence mode="wait">
                  {formData.attending && (
                    <motion.div
                      key="attending-fields"
                      variants={attendingFieldsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Guest Count */}
                      <motion.div variants={itemVariants}>
                        <Label className="text-slate-700 mb-4 block text-base font-semibold">
                          Số Lượng Khách
                        </Label>
                        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <MotionButton
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10 border-slate-300 hover:border-rose-400 hover:bg-rose-50"
                            onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                            data-testid="button-decrease-guests"
                            disabled={createRsvpMutation.isPending}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            -
                          </MotionButton>
                          <motion.div
                            className="text-center"
                            key={formData.guestCount}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <div className="text-2xl font-bold text-rose-600">{formData.guestCount}</div>
                            <div className="text-sm text-slate-500">khách</div>
                          </motion.div>
                          <MotionButton
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10 border-slate-300 hover:border-rose-400 hover:bg-rose-50"
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
                        <Label htmlFor="meal" className="text-slate-700 mb-3 block text-base font-semibold">
                          Lựa Chọn Món Ăn
                        </Label>
                        <Select
                          value={formData.mealPreference}
                          onValueChange={(value) => setFormData({ ...formData, mealPreference: value })}
                          disabled={createRsvpMutation.isPending}
                        >
                          <SelectTrigger
                            id="meal"
                            className="rounded-xl h-12 text-base border-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-300"
                            data-testid="select-meal"
                          >
                            <SelectValue placeholder="Chọn món bạn thích" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sơn Hào">Sơn Hào</SelectItem>
                            <SelectItem value="Hải Vị">Hải Vị</SelectItem>
                            <SelectItem value="Tùy Chọn">Tùy Chọn</SelectItem>
                            <SelectItem value="Đồ Mặn">Đồ Mặn</SelectItem>
                            <SelectItem value="Thuần Chay">Thuần Chay</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Special Requirements */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="special" className="text-slate-700 mb-3 block text-base font-semibold">
                          Yêu Cầu Đặc Biệt
                        </Label>
                        <Textarea
                          id="special"
                          placeholder="Hạn chế chế độ ăn, dị ứng, nhu cầu tiếp cận..."
                          rows={3}
                          className="rounded-xl resize-none text-base border-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-300"
                          value={formData.specialRequirements}
                          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                          data-testid="input-special-requirements"
                          disabled={createRsvpMutation.isPending}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="space-y-4 pt-4">
                  <MotionButton
                    type="submit"
                    className="w-full rounded-xl h-14 text-base font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
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
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
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

                  {livestream?.isActive && livestream?.streamUrl && (
                    <MotionButton
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl h-14 text-base font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                      data-testid="button-watch-livestream"
                      onClick={() => {
                        const livestreamSection = document.getElementById('livestream');
                        if (livestreamSection) {
                          livestreamSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <Video size={20} />
                        🔴 Xem Livestream
                      </div>
                    </MotionButton>
                  )}
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* Event Details Sidebar */}
          <motion.div
            className="lg:col-span-1"
            variants={sidebarVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200/60 shadow-xl backdrop-blur-sm sticky top-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3
                className="font-serif text-2xl mb-6 text-slate-800 flex items-center gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Sparkles className="text-rose-500" size={24} />
                Thông Tin Sự Kiện
              </motion.h3>
              
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-rose-100 flex-shrink-0">
                    <Calendar className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Ngày</p>
                    <p className="text-slate-800 font-semibold text-lg">
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

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-rose-100 flex-shrink-0">
                    <Clock className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Thời Gian</p>
                    <p className="text-slate-800 font-semibold text-lg">
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

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-rose-100 flex-shrink-0">
                    <MapPin className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Địa Điểm</p>
                    <p className="text-slate-800 font-semibold text-lg">
                      {settings?.venueName || "Rose Garden Estate"}
                    </p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {settings?.venueAddress || "123 Garden Lane, Spring Valley, CA 91977"}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-rose-100 flex-shrink-0">
                    <Users className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Trang Phục</p>
                    <p className="text-slate-800 font-semibold text-lg">
                      Trang Trọng / Vest Đen Tùy Chọn
                    </p>
                  </div>
                </motion.div>

                {/* Countdown Note */}
                <motion.div
                  className="bg-white rounded-xl p-4 border border-rose-200 mt-6"
                  variants={itemVariants}
                >
                  <p className="text-sm text-slate-700 font-medium text-center">
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