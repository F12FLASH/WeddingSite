import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function AdminCouple() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-couple-info">
          Thông Tin Cô Dâu Chú Rể
        </h2>
        <p className="text-muted-foreground">
          Quản lý thông tin chi tiết về cô dâu chú rể
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh Sửa Thông Tin Cặp Đôi</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="brideName">Tên Cô Dâu</Label>
                <Input
                  id="brideName"
                  defaultValue="Sarah"
                  className="mt-2"
                  data-testid="input-bride-name"
                />
              </div>
              <div>
                <Label htmlFor="groomName">Tên Chú Rể</Label>
                <Input
                  id="groomName"
                  defaultValue="Michael"
                  className="mt-2"
                  data-testid="input-groom-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="weddingDate">Ngày Cưới</Label>
              <Input
                id="weddingDate"
                type="date"
                defaultValue="2025-06-15"
                className="mt-2"
                data-testid="input-wedding-date"
              />
            </div>

            <div>
              <Label htmlFor="ourStory">Câu Chuyện Của Chúng Tôi</Label>
              <Textarea
                id="ourStory"
                rows={6}
                defaultValue="Chúng tôi gặp nhau vào một ngày mùa thu mưa trong một quán cà phê ấm cúng..."
                className="mt-2"
                data-testid="input-our-story"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bridePhoto">URL Ảnh Cô Dâu</Label>
                <Input
                  id="bridePhoto"
                  placeholder="Tải lên hoặc dán URL hình ảnh"
                  className="mt-2"
                  data-testid="input-bride-photo"
                />
              </div>
              <div>
                <Label htmlFor="groomPhoto">URL Ảnh Chú Rể</Label>
                <Input
                  id="groomPhoto"
                  placeholder="Tải lên hoặc dán URL hình ảnh"
                  className="mt-2"
                  data-testid="input-groom-photo"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="heroImage">URL Hình Nền Trang Chủ</Label>
              <Input
                id="heroImage"
                placeholder="Tải lên hoặc dán URL hình ảnh"
                className="mt-2"
                data-testid="input-hero-image"
              />
            </div>

            <Button className="w-full md:w-auto" data-testid="button-save-couple">
              <Save size={18} className="mr-2" />
              Lưu Thay Đổi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
