import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import venueImage from "@assets/generated_images/Wedding_venue_ceremony_setup_4b2b0b2c.png";

export default function Location() {
  return (
    <section id="location" className="py-20 md:py-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-location"
          >
            Địa Điểm Tổ Chức
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Hãy đến với chúng tôi tại địa điểm tuyệt đẹp
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Venue Image & Map */}
          <div className="animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden shadow-xl mb-6">
              <img
                src={venueImage}
                alt="Địa Điểm Cưới"
                className="w-full h-80 object-cover"
                data-testid="img-venue"
              />
            </div>

            {/* Embedded Map Placeholder */}
            <div className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-lg h-80">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 text-primary" size={48} />
                  <p className="text-muted-foreground">
                    Bản Đồ Tương Tác
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rose Garden Estate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-lg">
              <h3 className="font-serif text-3xl mb-6 text-foreground">
                Rose Garden Estate
              </h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Địa Chỉ</p>
                    <p className="text-muted-foreground">
                      123 Garden Lane
                      <br />
                      Spring Valley, CA 91977
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Liên Hệ</p>
                    <p className="text-muted-foreground">
                      +1 (555) 123-4567
                      <br />
                      info@rosegardenestate.com
                    </p>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Thời Gian Sự Kiện
                    </p>
                    <p className="text-muted-foreground">
                      15 Tháng 6, 2025
                      <br />
                      3:00 Chiều - 10:00 Tối
                    </p>
                  </div>
                </div>

                {/* Parking Info */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="font-medium text-foreground mb-2">
                    Thông Tin Đỗ Xe
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dịch vụ đỗ xe miễn phí. Bãi đỗ xe bổ sung nằm ở phía bắc. Vui lòng đến sớm 15-20 phút để đỗ xe.
                  </p>
                </div>

                {/* Directions Button */}
                <Button
                  className="w-full rounded-xl"
                  size="lg"
                  data-testid="button-directions"
                >
                  <Navigation size={18} className="mr-2" />
                  Chỉ Đường
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
