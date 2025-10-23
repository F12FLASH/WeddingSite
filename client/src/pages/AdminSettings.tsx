import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Settings, InsertSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertSettings) => {
      return await apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Lưu cài đặt thành công" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể lưu cài đặt",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertSettings = {
      venueName: formData.get("venueName") as string,
      venueAddress: formData.get("venueAddress") as string,
      venueLatitude: formData.get("venueLatitude") as string,
      venueLongitude: formData.get("venueLongitude") as string,
      backgroundMusicUrl: formData.get("backgroundMusicUrl") as string,
    };

    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">Cài Đặt Website</h2>
          <p className="text-muted-foreground">Cấu hình trang web đám cưới của bạn</p>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground">Cài Đặt Website</h2>
        <p className="text-muted-foreground">Cấu hình trang web đám cưới của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon size={20} />
              Thông Tin Địa Điểm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venueName">Tên Địa Điểm</Label>
              <Input
                id="venueName"
                name="venueName"
                placeholder="Khách sạn Grand Ballroom"
                defaultValue={settings?.venueName || ""}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="venueAddress">Địa Chỉ Địa Điểm</Label>
              <Textarea
                id="venueAddress"
                name="venueAddress"
                rows={3}
                placeholder="123 Đường Cưới, Thành phố, Tỉnh 12345"
                defaultValue={settings?.venueAddress || ""}
                className="mt-2"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venueLatitude">Vĩ Độ</Label>
                <Input
                  id="venueLatitude"
                  name="venueLatitude"
                  placeholder="40.7128"
                  defaultValue={settings?.venueLatitude || ""}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Để hiển thị bản đồ (tùy chọn)
                </p>
              </div>
              <div>
                <Label htmlFor="venueLongitude">Kinh Độ</Label>
                <Input
                  id="venueLongitude"
                  name="venueLongitude"
                  placeholder="-74.0060"
                  defaultValue={settings?.venueLongitude || ""}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Để hiển thị bản đồ (tùy chọn)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cài Đặt Âm Thanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="backgroundMusicUrl">URL Nhạc Nền</Label>
              <Input
                id="backgroundMusicUrl"
                name="backgroundMusicUrl"
                type="url"
                placeholder="https://example.com/music.mp3"
                defaultValue={settings?.backgroundMusicUrl || ""}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL tới file MP3 cho nhạc nền trên trang chủ
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save size={18} className="mr-2" />
            {updateMutation.isPending ? "Đang lưu..." : "Lưu Cài Đặt"}
          </Button>
        </div>
      </form>
    </div>
  );
}
