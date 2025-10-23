import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestMessage } from "@shared/schema";

export default function Messages() {
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, isError, error } = useQuery<GuestMessage[]>({
    queryKey: ["/api/messages?approved=true"],
  });

  const createMessageMutation = useMutation({
    mutationFn: async (data: { guestName: string; message: string }) => {
      return await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      toast({
        title: "Đã gửi lời chúc!",
        description: "Cảm ơn lời chúc của bạn. Chúng tôi sẽ xem xét trong thời gian sớm nhất.",
      });
      setGuestName("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages?approved=true"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể gửi lời chúc. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền cả tên và lời chúc của bạn",
        variant: "destructive",
      });
      return;
    }

    createMessageMutation.mutate({ guestName: guestName.trim(), message: message.trim() });
  };

  return (
    <section id="messages" className="py-20 md:py-32 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-messages"
          >
            Lời Chúc Khách Mời
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Gửi lời chúc mừng và chúc phúc của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Message Form */}
          <div className="animate-fade-in-up">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-card-border shadow-lg">
              <h3 className="font-serif text-2xl mb-6 text-foreground flex items-center gap-2">
                <Heart className="text-primary" fill="currentColor" size={24} />
                Để Lại Lời Chúc
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Tên Của Bạn"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="rounded-xl"
                    data-testid="input-guest-name"
                    disabled={createMessageMutation.isPending}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Lời chúc của bạn gửi đến cô dâu chú rể..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="rounded-xl resize-none"
                    data-testid="input-message"
                    disabled={createMessageMutation.isPending}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  data-testid="button-submit-message"
                  disabled={createMessageMutation.isPending}
                >
                  <Send size={18} className="mr-2" />
                  {createMessageMutation.isPending ? "Đang gửi..." : "Gửi Lời Chúc"}
                </Button>
              </form>
            </div>
          </div>

          {/* Messages Display */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-4" data-testid="messages-list">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-6 border border-card-border shadow-md animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-full mb-2" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                ))
              ) : isError ? (
                <div className="bg-card rounded-2xl p-8 border border-card-border shadow-md text-center">
                  <Heart className="mx-auto mb-3 text-destructive" size={40} />
                  <p className="text-destructive mb-2">Không thể tải lời chúc</p>
                  <p className="text-muted-foreground">{error instanceof Error ? error.message : "Vui lòng thử lại sau"}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-card rounded-2xl p-8 border border-card-border shadow-md text-center">
                  <Heart className="mx-auto mb-3 text-muted-foreground" size={40} />
                  <p className="text-muted-foreground">Chưa có lời chúc nào. Hãy là người đầu tiên chia sẻ lời chúc của bạn!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className="bg-card rounded-2xl p-6 border border-card-border shadow-md hover-elevate animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    data-testid={`message-${index}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="text-primary" size={18} fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{msg.guestName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(msg.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed pl-13">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
