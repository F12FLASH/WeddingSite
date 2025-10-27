import { useQuery } from "@tanstack/react-query";
import type { LivestreamInfo } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink, Clock, Calendar, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function Livestream() {
  const { data: livestream } = useQuery<LivestreamInfo>({
    queryKey: ["/api/livestream"],
  });

  if (!livestream?.isActive || !livestream?.streamUrl) {
    return null;
  }

  const now = new Date();
  const startTime = livestream.startTime ? new Date(livestream.startTime) : null;
  const endTime = livestream.endTime ? new Date(livestream.endTime) : null;

  const isLive = startTime && endTime && now >= startTime && now <= endTime;
  const isUpcoming = startTime && now < startTime;
  const isEnded = endTime && now > endTime;

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "youtube": return "📺";
      case "facebook": return "📘";
      case "zoom": return "💻";
      default: return "🎥";
    }
  };

  const getEmbedUrl = (url: string, platform: string) => {
    if (platform === "youtube") {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1` : url;
    }
    if (platform === "facebook") {
      return url.includes('facebook.com') ? url.replace('watch', 'embed') + '?autoplay=true&muted=1' : url;
    }
    return url;
  };

  return (
    <section id="livestream" data-testid="section-livestream" className="py-20 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Badge variant={isLive ? "default" : "secondary"} className="text-lg px-4 py-2">
              {getPlatformEmoji(livestream.platform)} {isLive && "🔴 ĐANG TRỰC TIẾP"}
              {isUpcoming && "⏳ SẮP DIỄN RA"}
              {isEnded && "✅ ĐÃ KẾT THÚC"}
            </Badge>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {livestream.streamTitle || "Xem Trực Tiếp Đám Cưới"}
          </h2>
          {livestream.streamDescription && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {livestream.streamDescription}
            </p>
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              {isLive && (
                <div className="aspect-video bg-black">
                  <iframe
                    src={getEmbedUrl(livestream.streamUrl, livestream.platform)}
                    title={livestream.streamTitle || "Wedding Livestream"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    data-testid="iframe-livestream"
                  />
                </div>
              )}

              {!isLive && livestream.thumbnailUrl && (
                <div className="aspect-video bg-muted relative">
                  <img
                    src={livestream.thumbnailUrl}
                    alt="Livestream thumbnail"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-semibold">
                        {isUpcoming && "Livestream sẽ bắt đầu sớm"}
                        {isEnded && "Livestream đã kết thúc"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                {(startTime || endTime) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {startTime && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Bắt đầu</p>
                          <p className="font-medium">
                            {format(startTime, "dd/MM/yyyy - HH:mm", { locale: vi })}
                          </p>
                        </div>
                      </div>
                    )}
                    {endTime && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Kết thúc</p>
                          <p className="font-medium">
                            {format(endTime, "dd/MM/yyyy - HH:mm", { locale: vi })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {livestream.chatEnabled && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat trực tiếp đang được bật</span>
                  </div>
                )}

                <Button
                  data-testid="button-watch-livestream"
                  onClick={() => window.open(livestream.streamUrl, '_blank')}
                  className="w-full gap-2"
                  size="lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  {isLive ? "Xem Trực Tiếp Ngay" : "Mở Link Livestream"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
