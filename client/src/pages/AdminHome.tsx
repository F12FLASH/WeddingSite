import { Users, MessageSquare, Calendar, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total RSVPs",
    value: "87",
    icon: Users,
    description: "65 attending, 22 declined",
    color: "text-primary",
  },
  {
    title: "Guest Messages",
    value: "124",
    icon: MessageSquare,
    description: "12 pending approval",
    color: "text-chart-2",
  },
  {
    title: "Days Until Wedding",
    value: "120",
    icon: Calendar,
    description: "June 15, 2025",
    color: "text-chart-3",
  },
  {
    title: "Photo Gallery",
    value: "48",
    icon: Heart,
    description: "Photos uploaded",
    color: "text-primary",
  },
];

export default function AdminHome() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-dashboard">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome to your wedding management dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover-elevate animate-scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
            data-testid={`stat-${index}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent RSVPs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Emily Johnson", status: "Attending", guests: 2 },
                { name: "David Chen", status: "Attending", guests: 1 },
                { name: "Maria Garcia", status: "Declined", guests: 0 },
              ].map((rsvp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  data-testid={`recent-rsvp-${i}`}
                >
                  <div>
                    <p className="font-medium">{rsvp.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rsvp.status}
                      {rsvp.guests > 0 && ` • ${rsvp.guests} guests`}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      rsvp.status === "Attending"
                        ? "bg-primary"
                        : "bg-muted-foreground"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Miller", preview: "So excited for your big day!" },
                { name: "John Smith", preview: "Congratulations to both of you..." },
                { name: "Lisa Wang", preview: "Can't wait to celebrate with you!" },
              ].map((msg, i) => (
                <div
                  key={i}
                  className="p-3 bg-muted/50 rounded-lg"
                  data-testid={`recent-message-${i}`}
                >
                  <p className="font-medium mb-1">{msg.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {msg.preview}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
