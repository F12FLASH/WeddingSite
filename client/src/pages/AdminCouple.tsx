import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Image, User, Calendar, Heart, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCouple() {
  const [formData, setFormData] = useState({
    brideName: "Sarah",
    groomName: "Michael",
    weddingDate: "2025-06-15",
    ourStory: "Chúng tôi gặp nhau vào một ngày mùa thu mưa trong một quán cà phê ấm cúng...",
    bridePhoto: "",
    groomPhoto: "",
    heroImage: "",
    brideDescription: "Một nhà thiết kế đầy đam mê, yêu thích nghệ thuật, hoa và tạo ra những khoảnh khắc đẹp đẽ.",
    groomDescription: "Một tâm hồn phiêu lưu với trái tim nhân hậu. Anh thích nhiếp ảnh, du lịch và làm cho Sarah cười mỗi ngày."
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "✅ Thành công!",
        description: "Thông tin cặp đôi đã được cập nhật",
      });
    }, 1500);
  };

  const handleImageUpload = (field: string) => {
    // Simulate image upload
    toast({
      title: "📸 Tải ảnh lên",
      description: `Tính năng tải ảnh lên cho ${field} sẽ được kích hoạt`,
    });
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="mb-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 
          className="text-3xl font-serif mb-2 text-foreground" 
          data-testid="heading-couple-info"
          variants={itemVariants}
        >
          👰‍♀️🤵‍♂️ Thông Tin Cô Dâu Chú Rể
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          variants={itemVariants}
        >
          Quản lý thông tin chi tiết về cô dâu chú rể và câu chuyện tình yêu
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-2 border-border/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <motion.div variants={itemVariants}>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="text-primary" size={24} fill="currentColor" />
                Chỉnh Sửa Thông Tin Cặp Đôi
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="p-6">
            <motion.form onSubmit={handleSubmit} className="space-y-8" variants={containerVariants}>
              {/* Names Section */}
              <motion.div 
                className="grid md:grid-cols-2 gap-6 p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="space-y-3">
                  <Label htmlFor="brideName" className="text-lg font-medium flex items-center gap-2">
                    <User className="text-pink-500" size={20} />
                    Tên Cô Dâu
                  </Label>
                  <Input
                    id="brideName"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    className="h-12 text-lg border-2 focus:border-pink-500 transition-all duration-300"
                    data-testid="input-bride-name"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="groomName" className="text-lg font-medium flex items-center gap-2">
                    <User className="text-blue-500" size={20} />
                    Tên Chú Rể
                  </Label>
                  <Input
                    id="groomName"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-300"
                    data-testid="input-groom-name"
                  />
                </div>
              </motion.div>

              {/* Wedding Date */}
              <motion.div 
                className="p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Label htmlFor="weddingDate" className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Calendar className="text-primary" size={20} />
                  Ngày Cưới
                </Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                  data-testid="input-wedding-date"
                />
              </motion.div>

              {/* Descriptions */}
              <motion.div 
                className="grid md:grid-cols-2 gap-6 p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="space-y-3">
                  <Label htmlFor="brideDescription" className="text-lg font-medium flex items-center gap-2">
                    💝 Mô Tả Cô Dâu
                  </Label>
                  <Textarea
                    id="brideDescription"
                    value={formData.brideDescription}
                    onChange={(e) => setFormData({ ...formData, brideDescription: e.target.value })}
                    rows={4}
                    className="text-lg border-2 focus:border-pink-500 transition-all duration-300 resize-none"
                    placeholder="Mô tả tính cách và sở thích của cô dâu..."
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="groomDescription" className="text-lg font-medium flex items-center gap-2">
                    💼 Mô Tả Chú Rể
                  </Label>
                  <Textarea
                    id="groomDescription"
                    value={formData.groomDescription}
                    onChange={(e) => setFormData({ ...formData, groomDescription: e.target.value })}
                    rows={4}
                    className="text-lg border-2 focus:border-blue-500 transition-all duration-300 resize-none"
                    placeholder="Mô tả tính cách và sở thích của chú rể..."
                  />
                </div>
              </motion.div>

              {/* Our Story */}
              <motion.div 
                className="p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Label htmlFor="ourStory" className="text-lg font-medium flex items-center gap-2 mb-3">
                  📖 Câu Chuyện Của Chúng Tôi
                </Label>
                <Textarea
                  id="ourStory"
                  value={formData.ourStory}
                  onChange={(e) => setFormData({ ...formData, ourStory: e.target.value })}
                  rows={6}
                  className="text-lg border-2 focus:border-primary transition-all duration-300 resize-none"
                  data-testid="input-our-story"
                  placeholder="Chia sẻ câu chuyện tình yêu đặc biệt của bạn..."
                />
              </motion.div>

              {/* Image Uploads */}
              <motion.div 
                className="space-y-6 p-4 bg-card rounded-xl border"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="text-primary" size={24} />
                  Hình Ảnh
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bride Photo */}
                  <div className="space-y-3">
                    <Label htmlFor="bridePhoto" className="text-lg font-medium flex items-center gap-2">
                      👰 Ảnh Cô Dâu
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="bridePhoto"
                        value={formData.bridePhoto}
                        onChange={(e) => setFormData({ ...formData, bridePhoto: e.target.value })}
                        placeholder="Dán URL hình ảnh"
                        className="h-12 text-lg border-2 focus:border-pink-500 transition-all duration-300"
                        data-testid="input-bride-photo"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleImageUpload("cô dâu")}
                      >
                        <Upload size={20} />
                      </Button>
                    </div>
                  </div>

                  {/* Groom Photo */}
                  <div className="space-y-3">
                    <Label htmlFor="groomPhoto" className="text-lg font-medium flex items-center gap-2">
                      🤵 Ảnh Chú Rể
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="groomPhoto"
                        value={formData.groomPhoto}
                        onChange={(e) => setFormData({ ...formData, groomPhoto: e.target.value })}
                        placeholder="Dán URL hình ảnh"
                        className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-300"
                        data-testid="input-groom-photo"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleImageUpload("chú rể")}
                      >
                        <Upload size={20} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="space-y-3">
                  <Label htmlFor="heroImage" className="text-lg font-medium flex items-center gap-2">
                    🏞️ Hình Nền Trang Chủ
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="heroImage"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="Dán URL hình ảnh nền"
                      className="h-12 text-lg border-2 focus:border-primary transition-all duration-300"
                      data-testid="input-hero-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => handleImageUpload("hình nền")}
                    >
                      <Image size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Preview Section */}
              <motion.div 
                className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/20"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  👁️ Xem Trước
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><strong>Cô dâu:</strong> {formData.brideName}</p>
                    <p><strong>Chú rể:</strong> {formData.groomName}</p>
                    <p><strong>Ngày cưới:</strong> {new Date(formData.weddingDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {formData.ourStory.length > 100 
                        ? formData.ourStory.substring(0, 100) + '...' 
                        : formData.ourStory
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto min-w-48 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  data-testid="button-save-couple"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-2 relative z-10">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.div>
                    ) : (
                      <>
                        <Save size={20} />
                        Lưu Thay Đổi
                      </>
                    )}
                  </div>
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}