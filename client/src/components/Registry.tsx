import { Gift, ExternalLink, Heart, Sparkles, CheckCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { RegistryItem } from "@shared/schema";

export default function Registry() {
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const { data: items = [], isLoading, isError, error } = useQuery<RegistryItem[]>({
    queryKey: ["/api/registry"],
  });

  // Group items by store
  const stores = [...new Set(items.map(item => item.store || "general"))];
  const filteredItems = selectedStore === "all" 
    ? items 
    : items.filter(item => item.store === selectedStore);

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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <section id="registry" className="py-20 md:py-32 px-4 bg-card relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
              duration: 8 + Math.random() * 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Gift size={40} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
            data-testid="heading-registry"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Danh Sách Quà Mừng
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Sự hiện diện của bạn trong đám cưới là món quà lớn nhất. 
            Tuy nhiên, nếu bạn muốn tặng chúng tôi quà, chúng tôi đã đăng ký tại các cửa hàng sau.
          </motion.p>
        </motion.div>

        {/* Store Filter */}
        {items.length > 0 && stores.length > 1 && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.button
              key="all"
              onClick={() => setSelectedStore("all")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedStore === "all"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-background text-foreground border border-border hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Store size={16} />
              Tất Cả
            </motion.button>
            {stores.map((store) => (
              <motion.button
                key={store}
                onClick={() => setSelectedStore(store)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedStore === store
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-background text-foreground border border-border hover:border-primary/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Store size={16} />
                {store.charAt(0).toUpperCase() + store.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Items Grid */}
        {isLoading ? (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-background rounded-2xl p-6 md:p-8 border border-border h-80"
                variants={itemVariants}
              >
                <div className="animate-pulse space-y-4">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                  <div className="h-10 bg-muted rounded-xl" />
                </div>
              </motion.div>
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
            <p className="text-destructive text-lg mb-2">Không thể tải danh sách quà</p>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
            </p>
          </motion.div>
        ) : filteredItems.length === 0 ? (
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
              <Gift className="mx-auto mb-4 text-muted-foreground" size={64} />
            </motion.div>
            <p className="text-muted-foreground text-lg mb-2">
              {selectedStore === "all" 
                ? "Thông tin danh sách quà sẽ sớm được cập nhật!" 
                : "Không có quà nào trong danh mục này"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-background rounded-2xl p-6 md:p-8 border border-border shadow-lg group relative overflow-hidden"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit="hidden"
                  data-testid={`registry-${index}`}
                >
                  {/* Background Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 text-center">
                    {/* Item Image */}
                    {item.imageUrl && (
                      <motion.div 
                        className="mb-6 relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-32 h-32 mx-auto object-contain rounded-2xl shadow-md"
                        />
                        {item.isPurchased && (
                          <motion.div
                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Item Name */}
                    <motion.h3 
                      className="font-serif text-2xl mb-3 text-foreground"
                      whileHover={{ color: "hsl(var(--primary))" }}
                    >
                      {item.name}
                    </motion.h3>

                    {/* Item Description */}
                    {item.description && (
                      <motion.p 
                        className="text-muted-foreground mb-6 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {item.description}
                      </motion.p>
                    )}

                    {/* Price and Store */}
                    <div className="flex items-center justify-between mb-6">
                      {item.price && (
                        <motion.p 
                          className="text-2xl font-bold text-primary"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          ${item.price}
                        </motion.p>
                      )}
                      {item.store && item.store !== "general" && (
                        <motion.span 
                          className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {item.store}
                        </motion.span>
                      )}
                    </div>

                    {/* Purchase Button */}
                    {item.purchaseUrl && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={item.isPurchased ? "outline" : "default"}
                          className="w-full rounded-xl py-3 font-semibold relative overflow-hidden group/btn"
                          onClick={() => window.open(item.purchaseUrl!, '_blank')}
                          data-testid={`button-registry-${index}`}
                          disabled={item.isPurchased}
                        >
                          {/* Button Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                          
                          <div className="flex items-center gap-2 relative z-10">
                            {item.isPurchased ? (
                              <>
                                <CheckCircle size={18} />
                                Đã Được Mua
                              </>
                            ) : (
                              <>
                                <ExternalLink size={18} />
                                Xem Chi Tiết
                              </>
                            )}
                          </div>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Thank You Note */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-primary/5 rounded-2xl p-8 border border-primary/20 max-w-3xl mx-auto relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Background Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-primary/20"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${20 + i * 20}%`,
                  }}
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles size={24} />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Gift className="mx-auto mb-4 text-primary" size={48} />
              </motion.div>
              <motion.p
                className="text-lg text-foreground italic leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                "Tình yêu, tiếng cười và sự hiện diện của bạn trong ngày cưới của chúng tôi là món quà lớn nhất. Cảm ơn bạn đã là một phần trong hành trình của chúng tôi!"
              </motion.p>
              <motion.p
                className="text-primary font-cursive text-3xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                - Sarah & Michael
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}