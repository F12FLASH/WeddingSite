import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Trash2, Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, isError, error } = useQuery<GuestMessage[]>({
    queryKey: ["/api/messages"],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      return await apiRequest("PATCH", `/api/messages/${id}/approve`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ title: "Cập nhật tin nhắn thành công" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Không có quyền",
          description: "Bạn đã đăng xuất. Đang đăng nhập lại...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật tin nhắn",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/messages/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ title: "Xóa tin nhắn thành công" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Không có quyền",
          description: "Bạn đã đăng xuất. Đang đăng nhập lại...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin nhắn",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">Tin Nhắn Khách Mời</h2>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý lời chúc của khách</p>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/6" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">Tin Nhắn Khách Mời</h2>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý lời chúc của khách</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="text-destructive mb-4" size={64} />
            <p className="text-destructive text-lg mb-2">Không thể tải tin nhắn</p>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Vui lòng thử lại sau"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-messages">
          Tin Nhắn Khách Mời
        </h2>
        <p className="text-muted-foreground">
          Kiểm duyệt và quản lý lời chúc của khách
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="text-muted-foreground mb-4" size={64} />
            <p className="text-muted-foreground text-lg">Chưa có tin nhắn nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card key={msg.id} data-testid={`message-card-${msg.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{msg.guestName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(msg.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!msg.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary"
                        onClick={() => approveMutation.mutate({ id: msg.id, approved: true })}
                        disabled={approveMutation.isPending || deleteMutation.isPending}
                        data-testid={`button-approve-${msg.id}`}
                      >
                        <Check size={16} className="mr-1" />
                        Phê duyệt
                      </Button>
                    )}
                    {msg.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveMutation.mutate({ id: msg.id, approved: false })}
                        disabled={approveMutation.isPending || deleteMutation.isPending}
                        data-testid={`button-unapprove-${msg.id}`}
                      >
                        <X size={16} className="mr-1" />
                        Hủy duyệt
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(msg.id)}
                      disabled={approveMutation.isPending || deleteMutation.isPending}
                      data-testid={`button-delete-${msg.id}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{msg.message}</p>
                <div className="mt-3">
                  {msg.approved ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Đã phê duyệt
                    </span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Chờ duyệt
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
