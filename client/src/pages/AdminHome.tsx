import { Users, MessageSquare, Calendar, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Tổng Số RSVP",
    value: "87",
    icon: Users,
    description: "65 tham dự, 22 từ chối",
    color: "text-primary",
  },
  {
    title: "Tin Nhắn Khách Mời",
    value: "124",
    icon: MessageSquare,
    description: "12 chờ phê duyệt",
    color: "text-chart-2",
  },
  {
    title: "Số Ngày Đến Đám Cưới",
    value: "120",
    icon: Calendar,
    description: "Ngày 15 tháng 6, 2025",
    color: "text-chart-3",
  },
  {
    title: "Thư Viện Ảnh",
    value: "48",
    icon: Heart,
    description: "Ảnh đã tải lên",
    color: "text-primary",
  },
];

export default function AdminHome() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-dashboard">
          Tổng Quan Bảng Điều Khiển
        </h2>
        <p className="text-muted-foreground">
          Chào mừng đến với bảng điều khiển quản lý đám cưới của bạn
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
            <CardTitle>RSVP Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Emily Johnson", status: "Tham dự", guests: 2 },
                { name: "David Chen", status: "Tham dự", guests: 1 },
                { name: "Maria Garcia", status: "Từ chối", guests: 0 },
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
                      {rsvp.guests > 0 && ` • ${rsvp.guests} khách`}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      rsvp.status === "Tham dự"
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
            <CardTitle>Tin Nhắn Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Miller", preview: "Rất mong chờ ngày trọng đại của hai bạn!" },
                { name: "John Smith", preview: "Chúc mừng cả hai..." },
                { name: "Lisa Wang", preview: "Không thể chờ để ăn mừng cùng các bạn!" },
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
