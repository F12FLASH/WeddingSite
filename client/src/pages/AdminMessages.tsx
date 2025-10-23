import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Trash2, Heart, MessageSquare, Filter, Search, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewMessage, setPreviewMessage] = useState<GuestMessage | null>(null);

  const { data: messages = [], isLoading, isError, error } = useQuery<GuestMessage[]>({
    queryKey: ["/api/messages"],
  });

  // Filter messages based on search and status
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "approved" && msg.approved) ||
                         (statusFilter === "pending" && !msg.approved);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    approved: messages.filter(msg => msg.approved).length,
    pending: messages.filter(msg => !msg.approved).length,
  };

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      return await apiRequest("PATCH", `/api/messages/${id}/approve`, { approved });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ 
        title: variables.approved ? "✅ Đã phê duyệt" : "🔄 Đã hủy duyệt",
        description: `Tin nhắn đã được ${variables.approved ? 'phê duyệt' : 'hủy duyệt'}`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "🔐 Không có quyền",
          description: "Bạn đã đăng xuất. Đang đăng nhập lại...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "❌ Lỗi",
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
      toast({ 
        title: "🗑️ Đã xóa tin nhắn",
        description: "Tin nhắn đã được xóa thành công",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "🔐 Không có quyền",
          description: "Bạn đã đăng xuất. Đang đăng nhập lại...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa tin nhắn",
        variant: "destructive",
      });
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">💌 Tin Nhắn Khách Mời</h2>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý lời chúc của khách</p>
        </div>
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
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
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">💌 Tin Nhắn Khách Mời</h2>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý lời chúc của khách</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="text-destructive mb-4" size={64} />
            </motion.div>
            <p className="text-destructive text-lg mb-2">Không thể tải tin nhắn</p>
            <p className="text-muted-foreground text-center">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-messages">
              💌 Tin Nhắn Khách Mời
            </h2>
            <p className="text-muted-foreground text-lg">
              Kiểm duyệt và quản lý lời chúc của khách
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-4 mb-6" variants={itemVariants}>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Tổng số tin nhắn</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Đã phê duyệt</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" variants={itemVariants}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="🔍 Tìm kiếm theo tên hoặc nội dung tin nhắn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🎯 Tất cả</SelectItem>
                <SelectItem value="approved">✅ Đã duyệt</SelectItem>
                <SelectItem value="pending">⏳ Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </motion.div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MessageSquare size={64} className="text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-2">Không tìm thấy tin nhắn nào</p>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== "all" 
                  ? "Thử thay đổi bộ lọc tìm kiếm" 
                  : "Chưa có tin nhắn nào từ khách mời"
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                exit="hidden"
                data-testid={`message-card-${msg.id}`}
              >
                <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart size={18} className="text-primary" fill="currentColor" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {msg.guestName}
                            {msg.approved ? (
                              <Badge variant="default" className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                                <CheckCircle size={12} className="mr-1" />
                                Đã duyệt
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 hover:bg-orange-500/30">
                                <Clock size={12} className="mr-1" />
                                Chờ duyệt
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(msg.createdAt!).toLocaleDateString('vi-VN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setPreviewMessage(msg)}
                        >
                          <Eye size={14} />
                        </Button>
                        {!msg.approved ? (
                          <Button
                            size="sm"
                            className="rounded-full bg-green-500 hover:bg-green-600"
                            onClick={() => approveMutation.mutate({ id: msg.id, approved: true })}
                            disabled={approveMutation.isPending || deleteMutation.isPending}
                            data-testid={`button-approve-${msg.id}`}
                          >
                            <Check size={14} />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-orange-500 text-orange-600 hover:bg-orange-500/10"
                            onClick={() => approveMutation.mutate({ id: msg.id, approved: false })}
                            disabled={approveMutation.isPending || deleteMutation.isPending}
                            data-testid={`button-unapprove-${msg.id}`}
                          >
                            <X size={14} />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa tin nhắn từ "${msg.guestName}"?`)) {
                              deleteMutation.mutate(msg.id);
                            }
                          }}
                          disabled={approveMutation.isPending || deleteMutation.isPending}
                          data-testid={`button-delete-${msg.id}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.p 
                      className="text-foreground leading-relaxed text-lg pl-13"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      "{msg.message}"
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Message Preview Dialog */}
      <Dialog open={!!previewMessage} onOpenChange={() => setPreviewMessage(null)}>
        <DialogContent className="max-w-2xl">
          {previewMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  Tin nhắn từ {previewMessage.guestName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground text-lg leading-relaxed italic">
                    "{previewMessage.message}"
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    Gửi lúc {new Date(previewMessage.createdAt!).toLocaleString('vi-VN')}
                  </span>
                  <Badge variant={previewMessage.approved ? "default" : "secondary"}>
                    {previewMessage.approved ? "✅ Đã duyệt" : "⏳ Chờ duyệt"}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}