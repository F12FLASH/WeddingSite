import { Gift, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { RegistryItem } from "@shared/schema";

export default function Registry() {
  const { data: items = [], isLoading, isError, error } = useQuery<RegistryItem[]>({
    queryKey: ["/api/registry"],
  });

  return (
    <section id="registry" className="py-20 md:py-32 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-registry"
          >
            Danh Sách Quà Mừng
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sự hiện diện của bạn trong đám cưới là món quà lớn nhất. Tuy nhiên, nếu bạn muốn tặng chúng tôi quà, chúng tôi đã đăng ký tại các cửa hàng sau.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-6 md:p-8 border border-border h-64 animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-destructive" size={64} />
            <p className="text-destructive text-lg mb-2">Không thể tải danh sách quà</p>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Vui lòng thử lại sau"}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground text-lg">Thông tin danh sách quà sẽ sớm được cập nhật!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-background rounded-2xl p-6 md:p-8 border border-border shadow-lg hover-elevate animate-scale-in group"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`registry-${index}`}
              >
                <div className="text-center">
                  {item.imageUrl && (
                    <div className="mb-4 transform group-hover:scale-110 transition-transform">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 mx-auto object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-2xl mb-3 text-foreground">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.price && (
                    <p className="text-lg font-medium text-primary mb-6">
                      ${item.price}
                    </p>
                  )}
                  {item.purchaseUrl && (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => window.open(item.purchaseUrl!, '_blank')}
                      data-testid={`button-registry-${index}`}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Xem Danh Sách
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thank You Note */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 max-w-3xl mx-auto">
            <Gift className="mx-auto mb-4 text-primary" size={48} />
            <p className="text-lg text-foreground italic leading-relaxed">
              "Tình yêu, tiếng cười và sự hiện diện của bạn trong ngày cưới của chúng tôi là món quà lớn nhất. Cảm ơn bạn đã là một phần trong hành trình của chúng tôi!"
            </p>
            <p className="text-primary font-cursive text-3xl mt-4">
              - Sarah & Michael
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
