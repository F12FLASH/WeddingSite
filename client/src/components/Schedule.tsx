import { Clock, Users, Music, Utensils, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ScheduleEvent } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  clock: Clock,
  users: Users,
  music: Music,
  utensils: Utensils,
  heart: Heart,
};

export default function Schedule() {
  const { data: events = [], isLoading, isError, error } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/schedule"],
  });

  return (
    <section id="schedule" className="py-20 md:py-32 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-schedule"
          >
            Lịch Trình Ngày Cưới
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            15 Tháng 6, 2025 • Rose Garden Estate
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-2xl p-6 md:p-8 border border-card-border h-48" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-destructive" size={64} />
            <p className="text-destructive text-lg mb-2">Không thể tải lịch trình</p>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Vui lòng thử lại sau"}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground text-lg">Lịch trình sẽ sớm được cập nhật!</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />

            {events.map((event, index) => {
              const IconComponent = event.icon ? iconMap[event.icon.toLowerCase()] || Clock : Clock;
              
              return (
                <div
                  key={event.id}
                  className={`relative mb-12 animate-fade-in-up ${
                    index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:text-right"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`event-${index}`}
                >
                  <div
                    className={`flex items-start gap-6 ${
                      index % 2 === 0 ? "md:flex-row-reverse md:justify-end" : ""
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full ring-4 ring-background shadow-lg z-10" />

                    {/* Content Card */}
                    <div className="ml-20 md:ml-0 md:w-full md:max-w-md">
                      <div className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-lg hover-elevate">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <IconComponent className="text-primary" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-2xl text-foreground">
                              {event.title}
                            </h3>
                            <p className="text-primary font-medium">
                              {new Date(event.eventTime).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        {event.location && (
                          <p className="text-muted-foreground mb-2">
                            {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-foreground leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
