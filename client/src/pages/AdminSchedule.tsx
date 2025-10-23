import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Pencil } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ScheduleEvent, InsertScheduleEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminSchedule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const { data: events = [], isLoading } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/schedule"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertScheduleEvent) => {
      return await apiRequest("POST", "/api/schedule", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ title: "Tạo sự kiện lịch trình thành công" });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể tạo sự kiện lịch trình",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertScheduleEvent> }) => {
      return await apiRequest("PATCH", `/api/schedule/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ title: "Cập nhật sự kiện lịch trình thành công" });
      setIsDialogOpen(false);
      setEditingEvent(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sự kiện lịch trình",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/schedule/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({ title: "Xóa sự kiện lịch trình thành công" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể xóa sự kiện lịch trình",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertScheduleEvent = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventTime: new Date(formData.get("eventTime") as string),
      location: formData.get("location") as string,
      icon: formData.get("icon") as string,
      order: parseInt(formData.get("order") as string) || 0,
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif mb-2 text-foreground">Sự Kiện Lịch Trình</h2>
          <p className="text-muted-foreground">Quản lý thời gian biểu đám cưới của bạn</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(null)}>
              <Plus size={18} className="mr-2" />
              Thêm Sự Kiện
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Chỉnh Sửa Sự Kiện" : "Thêm Sự Kiện Mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu Đề Sự Kiện</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={editingEvent?.title}
                />
              </div>
              <div>
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={editingEvent?.description || ""}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventTime">Thời Gian Sự Kiện</Label>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="datetime-local"
                    required
                    defaultValue={editingEvent?.eventTime ? new Date(editingEvent.eventTime).toISOString().slice(0, 16) : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Địa Điểm</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingEvent?.location || ""}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Biểu Tượng</Label>
                  <Input
                    id="icon"
                    name="icon"
                    placeholder="vd: Heart, Calendar"
                    defaultValue={editingEvent?.icon || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="order">Thứ Tự Hiển Thị</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingEvent?.order || 0}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingEvent ? "Cập Nhật" : "Tạo"} Sự Kiện
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>Chưa có sự kiện lịch trình nào. Nhấp "Thêm Sự Kiện" để tạo mới.</p>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar size={20} />
                        {event.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(event.eventTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingEvent(event);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(event.id)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-muted-foreground mb-2">{event.description}</p>
                  )}
                  {event.location && (
                    <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
