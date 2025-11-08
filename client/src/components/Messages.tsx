import { useState } from "react";
import { Heart, Send, Sparkles, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import type { GuestMessage } from "@shared/schema";

export default function Messages() {
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, isError, error } = useQuery<GuestMessage[]>({
    queryKey: ["/api/messages?approved=true"],
  });

  const createMessageMutation = useMutation({
    mutationFn: async (data: { guestName: string; message: string }) => {
      return await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      toast({
        title: "🎉 Đã gửi lời chúc!",
        description: "Cảm ơn lời chúc của bạn. Chúng tôi sẽ xem xét trong thời gian sớm nhất.",
      });
      setGuestName("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages?approved=true"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({
        title: "❌ Lỗi",
        description: "Không thể gửi lời chúc. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) {
      toast({
        title: "⚠️ Thiếu thông tin",
        description: "Vui lòng điền cả tên và lời chúc của bạn",
        variant: "destructive",
      });
      return;
    }

    createMessageMutation.mutate({ guestName: guestName.trim(), message: message.trim() });
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

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const floatingStars = [...Array(5)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: i * 0.5,
    duration: 3 + Math.random() * 2
  }));

  return (
    <section id="messages" className="py-20 md:py-32 px-4 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute text-primary/20"
            style={{
              left: `${star.left}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star size={20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
            data-testid="heading-messages"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Lời Chúc Khách Mời
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
            Chia sẻ yêu thương và những lời chúc phúc của bạn
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Message Form - Updated with equal height */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <motion.div
              className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-2xl backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <motion.h3
                  className="font-serif text-2xl mb-6 text-foreground flex items-center gap-3"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="text-primary" fill="currentColor" size={28} />
                  </motion.div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Gửi Lời Chúc Của Bạn
                  </span>
                </motion.h3>
                
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-4 flex-1 flex flex-col"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Input
                      type="text"
                      placeholder="✨ Tên Của Bạn"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="rounded-xl h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                      data-testid="input-guest-name"
                      disabled={createMessageMutation.isPending}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="flex-1">
                    <Textarea
                      placeholder="💝 Viết lời chúc của bạn gửi đến cô dâu chú rể..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-xl resize-none text-lg border-2 focus:border-primary transition-all duration-300 h-full min-h-[200px]"
                      data-testid="input-message"
                      disabled={createMessageMutation.isPending}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="pt-4">
                    <Button
                      type="submit"
                      className="w-full rounded-xl h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      data-testid="button-submit-message"
                      disabled={createMessageMutation.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2 relative z-10"
                      >
                        {createMessageMutation.isPending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles size={20} />
                            </motion.div>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Gửi Lời Chúc
                          </>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.form>
              </div>
            </motion.div>
          </motion.div>

          {/* Messages Display - Updated with equal height */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-2xl backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col">
              {/* Background Gradient */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 -translate-x-16" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 translate-x-12" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <motion.h3
                  className="font-serif text-2xl mb-6 text-foreground flex items-center gap-3"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Quote className="text-primary" size={28} />
                  </motion.div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Lời Chúc Từ Khách Mời
                  </span>
                </motion.h3>
                
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[500px]" data-testid="messages-list">
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-background/50 rounded-2xl p-6 border border-card-border shadow-md"
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="animate-pulse space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-full" />
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-muted rounded w-1/3" />
                                <div className="h-3 bg-muted rounded w-1/4" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-muted rounded w-full" />
                              <div className="h-3 bg-muted rounded w-5/6" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : isError ? (
                      <motion.div
                        className="bg-background/50 rounded-2xl p-8 border border-card-border shadow-md text-center flex items-center justify-center flex-col min-h-[200px]"
                        variants={itemVariants}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="mx-auto mb-3 text-destructive" size={48} />
                        </motion.div>
                        <p className="text-destructive text-lg mb-2">Không thể tải lời chúc</p>
                        <p className="text-muted-foreground">
                          {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
                        </p>
                      </motion.div>
                    ) : messages.length === 0 ? (
                      <motion.div
                        className="bg-background/50 rounded-2xl p-8 border border-card-border shadow-md text-center flex items-center justify-center flex-col min-h-[200px]"
                        variants={itemVariants}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Quote className="mx-auto mb-3 text-muted-foreground" size={48} />
                        </motion.div>
                        <p className="text-muted-foreground text-lg mb-2">
                          Chưa có lời chúc nào
                        </p>
                        <p className="text-muted-foreground">
                          Hãy là người đầu tiên chia sẻ lời chúc của bạn!
                        </p>
                      </motion.div>
                    ) : (
                      <AnimatePresence>
                        {messages.map((msg, index) => (
                          <motion.div
                            key={msg.id}
                            className="bg-background/50 rounded-2xl p-6 border border-card-border shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={{ 
                              y: -5,
                              scale: 1.02
                            }}
                            transition={{ type: "spring", stiffness: 400 }}
                            data-testid={`message-${index}`}
                          >
                            {/* Background Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative z-10">
                              <div className="flex items-start gap-3 mb-4">
                                <motion.div
                                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                                  whileHover={{ scale: 1.1, rotate: 360 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Heart className="text-primary" size={18} fill="currentColor" />
                                </motion.div>
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground text-lg">
                                    {msg.guestName}
                                  </p>
                                  <motion.p
                                    className="text-xs text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    {new Date(msg.createdAt!).toLocaleDateString('vi-VN', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </motion.p>
                                </div>
                              </div>
                              
                              <motion.p
                                className="text-foreground leading-relaxed text-lg pl-13 italic relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Quote className="absolute -left-2 -top-2 text-primary/20" size={24} />
                                {msg.message}
                              </motion.p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}