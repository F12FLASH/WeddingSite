import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, DollarSign, Search, TrendingUp, Gift as GiftIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GiftMoney } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminGiftMoney() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sideFilter, setSideFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftMoney | null>(null);

  const { data: gifts = [], isLoading } = useQuery<GiftMoney[]>({
    queryKey: ["/api/gift-money"],
  });

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.guestName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSide = sideFilter === "all" || gift.side === sideFilter;
    return matchesSearch && matchesSide;
  });

  const stats = {
    total: gifts.reduce((sum, g) => sum + (g.giftType === "money" ? g.amount : 0), 0),
    bride: gifts.filter(g => g.side === "bride").reduce((sum, g) => sum + (g.giftType === "money" ? g.amount : 0), 0),
    groom: gifts.filter(g => g.side === "groom").reduce((sum, g) => sum + (g.giftType === "money" ? g.amount : 0), 0),
    both: gifts.filter(g => g.side === "both").reduce((sum, g) => sum + (g.giftType === "money" ? g.amount : 0), 0),
    count: gifts.length,
  };

  const [formData, setFormData] = useState({
    guestName: "",
    amount: 0,
    relationship: "",
    notes: "",
    giftType: "money" as "money" | "gift",
    giftDescription: "",
    side: "both" as "bride" | "groom" | "both",
  });

  const resetForm = () => {
    setFormData({
      guestName: "",
      amount: 0,
      relationship: "",
      notes: "",
      giftType: "money",
      giftDescription: "",
      side: "both",
    });
    setEditingGift(null);
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/gift-money", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-money"] });
      toast({ 
        title: "✅ Đã thêm",
        description: "Thông tin mừng cưới đã được thêm thành công",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể thêm thông tin mừng cưới",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      return await apiRequest("PATCH", `/api/gift-money/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-money"] });
      toast({ 
        title: "✅ Đã cập nhật",
        description: "Thông tin mừng cưới đã được cập nhật",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/gift-money/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-money"] });
      toast({ 
        title: "🗑️ Đã xóa",
        description: "Thông tin đã được xóa thành công",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa thông tin",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGift) {
      updateMutation.mutate({ id: editingGift.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (gift: GiftMoney) => {
    setEditingGift(gift);
    setFormData({
      guestName: gift.guestName,
      amount: gift.amount,
      relationship: gift.relationship || "",
      notes: gift.notes || "",
      giftType: gift.giftType as "money" | "gift",
      giftDescription: gift.giftDescription || "",
      side: gift.side as "bride" | "groom" | "both",
    });
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="page-admin-gift-money" className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
            💝 Sổ Mừng Cưới
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý tiền mừng và quà tặng từ khách mời</p>
        </div>
        <Button 
          data-testid="button-add-gift"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm Mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="stat-total">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(stats.total)}
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stats.count} lượt mừng</p>
          </CardContent>
        </Card>

        <Card data-testid="stat-bride">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phía Cô Dâu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-pink-600 dark:text-pink-400">
              {formatCurrency(stats.bride)}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-groom">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phía Chú Rể</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(stats.groom)}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-both">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.both)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="input-search"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sideFilter} onValueChange={setSideFilter}>
          <SelectTrigger data-testid="select-side-filter" className="w-48">
            <SelectValue placeholder="Lọc theo phía" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="bride">Cô dâu</SelectItem>
            <SelectItem value="groom">Chú rể</SelectItem>
            <SelectItem value="both">Chung</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách ({filteredGifts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Tên Khách</th>
                  <th className="text-left p-4 font-medium">Số Tiền</th>
                  <th className="text-left p-4 font-medium">Quan Hệ</th>
                  <th className="text-left p-4 font-medium">Phía</th>
                  <th className="text-left p-4 font-medium">Ghi Chú</th>
                  <th className="text-right p-4 font-medium">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredGifts.map((gift) => (
                    <motion.tr
                      key={gift.id}
                      data-testid={`gift-row-${gift.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">{gift.guestName}</td>
                      <td className="p-4">
                        {gift.giftType === "money" ? (
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(gift.amount)}
                          </span>
                        ) : (
                          <Badge variant="outline">Quà tặng</Badge>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">{gift.relationship || "-"}</td>
                      <td className="p-4">
                        <Badge 
                          variant={gift.side === "bride" ? "default" : gift.side === "groom" ? "secondary" : "outline"}
                        >
                          {gift.side === "bride" ? "Cô dâu" : gift.side === "groom" ? "Chú rể" : "Chung"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                        {gift.notes || gift.giftDescription || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            data-testid={`button-edit-${gift.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(gift)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`button-delete-${gift.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Bạn có chắc muốn xóa?")) {
                                deleteMutation.mutate(gift.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredGifts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-gift-form" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGift ? "Chỉnh Sửa Thông Tin" : "Thêm Mừng Cưới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin về tiền mừng hoặc quà tặng từ khách mời
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestName">Tên Khách Mời *</Label>
                <Input
                  data-testid="input-guest-name"
                  id="guestName"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="side">Phía</Label>
                <Select value={formData.side} onValueChange={(value: any) => setFormData({ ...formData, side: value })}>
                  <SelectTrigger data-testid="select-side">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Chung</SelectItem>
                    <SelectItem value="bride">Cô dâu</SelectItem>
                    <SelectItem value="groom">Chú rể</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="giftType">Loại</Label>
                <Select value={formData.giftType} onValueChange={(value: any) => setFormData({ ...formData, giftType: value })}>
                  <SelectTrigger data-testid="select-gift-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="money">Tiền mừng</SelectItem>
                    <SelectItem value="gift">Quà tặng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Số Tiền (VNĐ)</Label>
                <Input
                  data-testid="input-amount"
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  disabled={formData.giftType === "gift"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Quan Hệ</Label>
              <Input
                data-testid="input-relationship"
                id="relationship"
                placeholder="Bạn bè, đồng nghiệp, họ hàng..."
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              />
            </div>

            {formData.giftType === "gift" && (
              <div className="space-y-2">
                <Label htmlFor="giftDescription">Mô Tả Quà Tặng</Label>
                <Input
                  data-testid="input-gift-description"
                  id="giftDescription"
                  value={formData.giftDescription}
                  onChange={(e) => setFormData({ ...formData, giftDescription: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi Chú</Label>
              <Textarea
                data-testid="textarea-notes"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                data-testid="button-cancel"
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button 
                data-testid="button-submit"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingGift ? "Cập Nhật" : "Thêm Mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
