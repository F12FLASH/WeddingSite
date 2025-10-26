import { QrCode, Heart, Sparkles, CreditCard, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Settings } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

export default function Registry() {
  const { data: settings, isLoading, isError } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

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

  const hasBankInfo = settings?.brideQrCodeUrl || settings?.groomQrCodeUrl || 
                      settings?.brideBankInfo || settings?.groomBankInfo;

  return (
    <section id="registry" className="py-20 md:py-32 px-4 bg-card relative overflow-hidden" data-testid="section-registry">
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
            <QrCode size={40} />
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
            Mừng Cưới
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
            Tuy nhiên, nếu bạn muốn gửi lời chúc mừng, đây là thông tin chuyển khoản của chúng tôi.
          </motion.p>
        </motion.div>

        {/* Bank Transfer Information */}
        {isLoading ? (
          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(2)].map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="animate-pulse rounded-2xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-full aspect-square bg-muted rounded-lg mx-auto" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : isError || !hasBankInfo ? (
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
              <QrCode className="mx-auto mb-4 text-muted-foreground" size={64} />
            </motion.div>
            <p className="text-muted-foreground text-lg">
              Thông tin chuyển khoản sẽ sớm được cập nhật!
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Bride's Bank Transfer */}
            {(settings.brideQrCodeUrl || settings.brideBankInfo) && (
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-background border-pink-200 dark:border-pink-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-8">
                    {/* Header */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 mb-4">
                        <Heart className="text-pink-500" size={32} />
                      </div>
                      <h3 className="font-serif text-2xl text-pink-600 dark:text-pink-400 mb-2" data-testid="heading-bride-bank">
                        Mừng Cưới Cô Dâu
                      </h3>
                    </motion.div>

                    {/* QR Code */}
                    {settings.brideQrCodeUrl && (
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border-2 border-pink-200 dark:border-pink-800 shadow-md">
                          <img
                            src={settings.brideQrCodeUrl}
                            alt="Mã QR Chuyển Khoản Cô Dâu"
                            className="w-full max-w-sm mx-auto rounded-lg"
                            data-testid="img-bride-qr"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Bank Information */}
                    {settings.brideBankInfo && (
                      <motion.div
                        className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-pink-200 dark:border-pink-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Building2 className="text-pink-500 mt-1 flex-shrink-0" size={20} />
                          <h4 className="font-medium text-foreground">Thông Tin Tài Khoản:</h4>
                        </div>
                        <div className="pl-8">
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed" data-testid="text-bride-bank-info">
                            {settings.brideBankInfo}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Groom's Bank Transfer */}
            {(settings.groomQrCodeUrl || settings.groomBankInfo) && (
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-200 dark:border-blue-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-8">
                    {/* Header */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <CreditCard className="text-blue-500" size={32} />
                      </div>
                      <h3 className="font-serif text-2xl text-blue-600 dark:text-blue-400 mb-2" data-testid="heading-groom-bank">
                        Mừng Cưới Chú Rể
                      </h3>
                    </motion.div>

                    {/* QR Code */}
                    {settings.groomQrCodeUrl && (
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-md">
                          <img
                            src={settings.groomQrCodeUrl}
                            alt="Mã QR Chuyển Khoản Chú Rể"
                            className="w-full max-w-sm mx-auto rounded-lg"
                            data-testid="img-groom-qr"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Bank Information */}
                    {settings.groomBankInfo && (
                      <motion.div
                        className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Building2 className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                          <h4 className="font-medium text-foreground">Thông Tin Tài Khoản:</h4>
                        </div>
                        <div className="pl-8">
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed" data-testid="text-groom-bank-info">
                            {settings.groomBankInfo}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
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
                <Heart className="mx-auto mb-4 text-primary" size={48} />
              </motion.div>
              <motion.p
                className="text-lg text-foreground italic leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
                data-testid="text-thank-you"
              >
                "Tình yêu, tiếng cười và sự hiện diện của bạn trong ngày cưới của chúng tôi là món quà lớn nhất. Cảm ơn bạn đã là một phần trong hành trình của chúng tôi!"
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
