import { useState } from "react";
import { Calendar, Mail, Phone, Users, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function RSVP() {
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

  return (
    <section id="rsvp" className="py-20 md:py-32 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-rsvp"
          >
            Xác Nhận Tham Dự
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Vui lòng phản hồi trước ngày 01 Tháng 5, 2025
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 animate-fade-in-up">
            <div className="bg-background rounded-2xl p-6 md:p-8 border border-border shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-foreground mb-2 block">
                    Họ Và Tên *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="rounded-xl"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    data-testid="input-rsvp-name"
                    disabled={createRsvpMutation.isPending}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-foreground mb-2 block">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nguyen@example.com"
                      className="pl-10 rounded-xl"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="input-rsvp-email"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-foreground mb-2 block">
                    Số Điện Thoại
                  </Label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+84 (xxx) xxx-xxxx"
                      className="pl-10 rounded-xl"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="input-rsvp-phone"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </div>

                {/* Attending */}
                <div>
                  <Label className="text-foreground mb-3 block">
                    Bạn có tham dự không? *
                  </Label>
                  <RadioGroup
                    value={formData.attending ? "yes" : "no"}
                    onValueChange={(value) => setFormData({ ...formData, attending: value === "yes" })}
                    className="flex gap-4"
                    data-testid="radio-attending"
                    disabled={createRsvpMutation.isPending}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="cursor-pointer">
                        Có, tôi sẽ đến
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="cursor-pointer">
                        Rất tiếc, tôi không thể đến
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.attending && (
                  <>
                    {/* Guest Count */}
                    <div>
                      <Label className="text-foreground mb-2 block flex items-center gap-2">
                        <Users size={18} />
                        Số Lượng Khách
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                          data-testid="button-decrease-guests"
                          disabled={createRsvpMutation.isPending}
                        >
                          -
                        </Button>
                        <span
                          className="text-xl font-medium w-12 text-center"
                          data-testid="text-guest-count"
                        >
                          {formData.guestCount}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, guestCount: Math.min(10, formData.guestCount + 1) })}
                          data-testid="button-increase-guests"
                          disabled={createRsvpMutation.isPending}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Meal Preference */}
                    <div>
                      <Label htmlFor="meal" className="text-foreground mb-2 block flex items-center gap-2">
                        <Utensils size={18} />
                        Lựa Chọn Món Ăn
                      </Label>
                      <Select
                        value={formData.mealPreference}
                        onValueChange={(value) => setFormData({ ...formData, mealPreference: value })}
                        disabled={createRsvpMutation.isPending}
                      >
                        <SelectTrigger
                          id="meal"
                          className="rounded-xl"
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
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <Label htmlFor="special" className="text-foreground mb-2 block">
                        Yêu Cầu Đặc Biệt
                      </Label>
                      <Textarea
                        id="special"
                        placeholder="Hạn chế chế độ ăn, dị ứng, nhu cầu tiếp cận..."
                        rows={3}
                        className="rounded-xl resize-none"
                        value={formData.specialRequirements}
                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        data-testid="input-special-requirements"
                        disabled={createRsvpMutation.isPending}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  size="lg"
                  data-testid="button-submit-rsvp"
                  disabled={createRsvpMutation.isPending}
                >
                  <Calendar size={18} className="mr-2" />
                  {createRsvpMutation.isPending ? "Đang gửi..." : "Gửi Xác Nhận"}
                </Button>
              </form>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20 sticky top-4">
              <h3 className="font-serif text-2xl mb-6 text-foreground">
                Thông Tin Sự Kiện
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày</p>
                  <p className="text-foreground font-medium">15 Tháng 6, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Thời Gian</p>
                  <p className="text-foreground font-medium">3:00 Chiều</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Địa Điểm</p>
                  <p className="text-foreground font-medium">
                    Rose Garden Estate
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    123 Garden Lane, Spring Valley, CA 91977
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Trang Phục
                  </p>
                  <p className="text-foreground font-medium">
                    Trang Trọng / Vest Đen Tùy Chọn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
