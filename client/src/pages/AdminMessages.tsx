import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Trash2, Heart, MessageSquare, Filter, Search, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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

// Constants
const STATUS_FILTERS = {
  ALL: "all",
  APPROVED: "approved",
  PENDING: "pending",
} as const;

const MUTATION_STATES = {
  IDLE: "idle",
  PENDING: "pending",
} as const;

// Types
type StatusFilter = typeof STATUS_FILTERS[keyof typeof STATUS_FILTERS];
type MutationState = typeof MUTATION_STATES[keyof typeof MUTATION_STATES];

interface MessageStats {
  total: number;
  approved: number;
  pending: number;
}

// Animation variants
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

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS_FILTERS.ALL);
  const [previewMessage, setPreviewMessage] = useState<GuestMessage | null>(null);

  // Data fetching
  const { 
    data: messages = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<GuestMessage[]>({
    queryKey: ["/api/messages"],
  });

  // Computed values
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesSearch = msg.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           msg.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === STATUS_FILTERS.ALL || 
                           (statusFilter === STATUS_FILTERS.APPROVED && msg.approved) ||
                           (statusFilter === STATUS_FILTERS.PENDING && !msg.approved);
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const stats: MessageStats = useMemo(() => ({
    total: messages.length,
    approved: messages.filter(msg => msg.approved).length,
    pending: messages.filter(msg => !msg.approved).length,
  }), [messages]);

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      return await apiRequest("PATCH", `/api/messages/${id}/approve`, { approved });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      showSuccessToast(
        variables.approved ? "✅ Đã phê duyệt" : "🔄 Đã hủy duyệt",
        `Tin nhắn đã được ${variables.approved ? 'phê duyệt' : 'hủy duyệt'}`
      );
    },
    onError: handleMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      showSuccessToast("🗑️ Đã xóa tin nhắn", "Tin nhắn đã được xóa thành công");
    },
    onError: handleMutationError,
  });

  // Event handlers
  const handleApprove = (id: string, approved: boolean) => {
    approveMutation.mutate({ id, approved });
  };

  const handleDelete = (message: GuestMessage) => {
    if (confirm(`Bạn có chắc muốn xóa tin nhắn từ "${message.guestName}"?`)) {
      deleteMutation.mutate(message.id);
    }
  };

  const handlePreview = (message: GuestMessage) => {
    setPreviewMessage(message);
  };

  // Helper functions
  const showSuccessToast = (title: string, description: string) => {
    toast({ 
      title,
      description,
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  function handleMutationError(error: Error): void {
    if (isUnauthorizedError(error)) {
      showErrorToast(
        "🔐 Không có quyền",
        "Bạn đã đăng xuất. Đang đăng nhập lại..."
      );
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    showErrorToast("❌ Lỗi", "Không thể thực hiện thao tác");
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (isError) {
    return <ErrorState error={error} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <HeaderSection 
        stats={stats}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Messages List */}
      <MessagesList
        messages={filteredMessages}
        onApprove={handleApprove}
        onDelete={handleDelete}
        onPreview={handlePreview}
        isMutationPending={approveMutation.isPending || deleteMutation.isPending}
      />

      {/* Message Preview Dialog */}
      <MessagePreviewDialog
        message={previewMessage}
        onClose={() => setPreviewMessage(null)}
      />
    </motion.div>
  );
}

// Sub-components
interface HeaderSectionProps {
  stats: MessageStats;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}

const HeaderSection = ({ 
  stats, 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: HeaderSectionProps) => (
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

    {/* Stats Cards */}
    <motion.div className="grid grid-cols-3 gap-4 mb-6" variants={itemVariants}>
      <StatCard
        value={stats.total}
        label="Tổng số tin nhắn"
        color="blue"
      />
      <StatCard
        value={stats.approved}
        label="Đã phê duyệt"
        color="green"
      />
      <StatCard
        value={stats.pending}
        label="Chờ duyệt"
        color="orange"
      />
    </motion.div>

    {/* Search and Filter */}
    <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" variants={itemVariants}>
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="🔍 Tìm kiếm theo tên hoặc nội dung tin nhắn..."
      />
      <StatusFilter
        value={statusFilter}
        onChange={onStatusFilterChange}
      />
    </motion.div>
  </motion.div>
);

interface StatCardProps {
  value: number;
  label: string;
  color: "blue" | "green" | "orange";
}

const StatCard = ({ value, label, color }: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-500/5 border-blue-500/20 text-blue-500",
    green: "bg-green-500/5 border-green-500/20 text-green-500",
    orange: "bg-orange-500/5 border-orange-500/20 text-orange-500",
  };

  return (
    <Card className={colorClasses[color]}>
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
};

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 rounded-xl"
    />
  </div>
);

interface StatusFilterProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

const StatusFilter = ({ value, onChange }: StatusFilterProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-40 rounded-xl">
      <Filter size={16} className="mr-2" />
      <SelectValue placeholder="Tất cả trạng thái" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={STATUS_FILTERS.ALL}>🎯 Tất cả</SelectItem>
      <SelectItem value={STATUS_FILTERS.APPROVED}>✅ Đã duyệt</SelectItem>
      <SelectItem value={STATUS_FILTERS.PENDING}>⏳ Chờ duyệt</SelectItem>
    </SelectContent>
  </Select>
);

interface MessagesListProps {
  messages: GuestMessage[];
  onApprove: (id: string, approved: boolean) => void;
  onDelete: (message: GuestMessage) => void;
  onPreview: (message: GuestMessage) => void;
  isMutationPending: boolean;
}

const MessagesList = ({ 
  messages, 
  onApprove, 
  onDelete, 
  onPreview, 
  isMutationPending 
}: MessagesListProps) => {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onApprove={onApprove}
            onDelete={onDelete}
            onPreview={onPreview}
            isMutationPending={isMutationPending}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

interface MessageCardProps {
  message: GuestMessage;
  onApprove: (id: string, approved: boolean) => void;
  onDelete: (message: GuestMessage) => void;
  onPreview: (message: GuestMessage) => void;
  isMutationPending: boolean;
}

const MessageCard = ({ 
  message, 
  onApprove, 
  onDelete, 
  onPreview, 
  isMutationPending 
}: MessageCardProps) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    exit="hidden"
    data-testid={`message-card-${message.id}`}
  >
    <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AvatarIcon />
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {message.guestName}
                <StatusBadge approved={message.approved} />
              </CardTitle>
              <MessageTimestamp createdAt={message.createdAt!} />
            </div>
          </div>
          <MessageActions
            message={message}
            onApprove={onApprove}
            onDelete={onDelete}
            onPreview={onPreview}
            disabled={isMutationPending}
          />
        </div>
      </CardHeader>
      <CardContent>
        <MessageContent message={message.message} />
      </CardContent>
    </Card>
  </motion.div>
);

const AvatarIcon = () => (
  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
    <Heart size={18} className="text-primary" fill="currentColor" />
  </div>
);

interface StatusBadgeProps {
  approved: boolean;
}

const StatusBadge = ({ approved }: StatusBadgeProps) => (
  approved ? (
    <Badge variant="default" className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
      <CheckCircle size={12} className="mr-1" />
      Đã duyệt
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 hover:bg-orange-500/30">
      <Clock size={12} className="mr-1" />
      Chờ duyệt
    </Badge>
  )
);

interface MessageTimestampProps {
  createdAt: string;
}

const MessageTimestamp = ({ createdAt }: MessageTimestampProps) => (
  <p className="text-sm text-muted-foreground flex items-center gap-1">
    <Clock size={12} />
    {new Date(createdAt).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
  </p>
);

interface MessageActionsProps {
  message: GuestMessage;
  onApprove: (id: string, approved: boolean) => void;
  onDelete: (message: GuestMessage) => void;
  onPreview: (message: GuestMessage) => void;
  disabled: boolean;
}

const MessageActions = ({ 
  message, 
  onApprove, 
  onDelete, 
  onPreview, 
  disabled 
}: MessageActionsProps) => (
  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <Button
      size="sm"
      variant="outline"
      className="rounded-full"
      onClick={() => onPreview(message)}
    >
      <Eye size={14} />
    </Button>
    
    {!message.approved ? (
      <Button
        size="sm"
        className="rounded-full bg-green-500 hover:bg-green-600"
        onClick={() => onApprove(message.id, true)}
        disabled={disabled}
        data-testid={`button-approve-${message.id}`}
      >
        <Check size={14} />
      </Button>
    ) : (
      <Button
        size="sm"
        variant="outline"
        className="rounded-full border-orange-500 text-orange-600 hover:bg-orange-500/10"
        onClick={() => onApprove(message.id, false)}
        disabled={disabled}
        data-testid={`button-unapprove-${message.id}`}
      >
        <X size={14} />
      </Button>
    )}
    
    <Button
      size="sm"
      variant="outline"
      className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
      onClick={() => onDelete(message)}
      disabled={disabled}
      data-testid={`button-delete-${message.id}`}
    >
      <Trash2 size={14} />
    </Button>
  </div>
);

interface MessageContentProps {
  message: string;
}

const MessageContent = ({ message }: MessageContentProps) => (
  <motion.p 
    className="text-foreground leading-relaxed text-lg pl-13"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    "{message}"
  </motion.p>
);

const EmptyState = () => (
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
          Chưa có tin nhắn nào từ khách mời
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

interface MessagePreviewDialogProps {
  message: GuestMessage | null;
  onClose: () => void;
}

const MessagePreviewDialog = ({ message, onClose }: MessagePreviewDialogProps) => (
  <Dialog open={!!message} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl">
      {message && (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare size={20} />
              Tin nhắn từ {message.guestName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground text-lg leading-relaxed italic">
                "{message.message}"
              </p>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Gửi lúc {new Date(message.createdAt!).toLocaleString('vi-VN')}
              </span>
              <StatusBadge approved={message.approved} />
            </div>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

const LoadingState = () => (
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

interface ErrorStateProps {
  error: Error | null;
}

const ErrorState = ({ error }: ErrorStateProps) => (
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