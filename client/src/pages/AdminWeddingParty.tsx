import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Plus, 
  Trash2, 
  Pencil, 
  Upload,
  X,
  Heart,
  UserPlus
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { WeddingParty, InsertWeddingParty } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

export default function AdminWeddingParty() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<WeddingParty | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    photoUrl: "",
    order: 0,
  });

  const { data: members = [], isLoading } = useQuery<WeddingParty[]>({
    queryKey: ["/api/wedding-party"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertWeddingParty) => {
      return await apiRequest("POST", "/api/wedding-party", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-party"] });
      toast({ 
        title: "✅ Thêm thành viên thành công",
        description: "Thành viên đã được thêm vào đội ngũ đám cưới"
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể thêm thành viên",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertWeddingParty> }) => {
      return await apiRequest("PATCH", `/api/wedding-party/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-party"] });
      toast({ 
        title: "✅ Cập nhật thành công",
        description: "Thông tin thành viên đã được cập nhật"
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể cập nhật thành viên",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/wedding-party/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-party"] });
      toast({ 
        title: "🗑️ Xóa thành công",
        description: "Thành viên đã được xóa khỏi đội ngũ"
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa thành viên",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "❌ Lỗi",
        description: "Kích thước file không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, photoUrl: imageUrl }));
      toast({
        title: "✅ Upload thành công",
        description: "Ảnh đã được tải lên"
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi upload",
        description: "Không thể tải ảnh lên",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (editingMember) {
      updateMutation.mutate({
        id: editingMember.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (member: WeddingParty) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
      photoUrl: member.photoUrl || "",
      order: member.order,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      description: "",
      photoUrl: "",
      order: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
      deleteMutation.mutate(id);
    }
  };

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
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
              <Users size={28} className="text-primary" />
            </div>
            Đội Ngũ Đám Cưới
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý phù dâu, phù rể và đội ngũ hỗ trợ
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingMember(null);
                setFormData({
                  name: "",
                  role: "",
                  description: "",
                  photoUrl: "",
                  order: members.length,
                });
              }}
              className="gap-2"
              data-testid="button-add-member"
            >
              <UserPlus size={18} />
              Thêm Thành Viên
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                {editingMember ? "Chỉnh Sửa Thành Viên" : "Thêm Thành Viên Mới"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Ảnh Thành Viên</Label>
                <div className="flex flex-col gap-4">
                  {formData.photoUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                      <img 
                        src={formData.photoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photoUrl: "" }))}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-fit gap-2"
                    data-testid="button-upload-photo"
                  >
                    <Upload size={18} />
                    {uploading ? "Đang tải..." : "Chọn Ảnh"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên Thành Viên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  required
                  data-testid="input-member-name"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Vai Trò *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Phù Dâu, Phù Rể, MC..."
                  required
                  data-testid="input-member-role"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Giới thiệu ngắn về thành viên..."
                  rows={4}
                  data-testid="input-member-description"
                />
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Thứ Tự Hiển Thị</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  min="0"
                  data-testid="input-member-order"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-member"
                >
                  {editingMember ? "Cập Nhật" : "Thêm Mới"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  data-testid="button-cancel"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng Số</p>
                <p className="text-3xl font-bold text-foreground mt-1">{members.length}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Có Ảnh</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {members.filter(m => m.photoUrl).length}
                </p>
              </div>
              <Heart className="text-rose-500" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vai Trò</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {Array.from(new Set(members.map(m => m.role))).length}
                </p>
              </div>
              <UserPlus className="text-blue-500" size={32} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Members List */}
      {members.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Users size={64} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-xl text-muted-foreground mb-2">Chưa có thành viên nào</p>
          <p className="text-sm text-muted-foreground">
            Nhấn "Thêm Thành Viên" để bắt đầu
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {members.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Photo */}
                    {member.photoUrl ? (
                      <div className="relative h-48 bg-muted">
                        <img 
                          src={member.photoUrl} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Users size={48} className="text-muted-foreground/30" />
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground" data-testid={`text-member-name-${member.id}`}>
                          {member.name}
                        </h3>
                        <p className="text-sm text-primary font-medium">
                          {member.role}
                        </p>
                      </div>
                      
                      {member.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {member.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(member)}
                          className="flex-1 gap-2"
                          data-testid={`button-edit-${member.id}`}
                        >
                          <Pencil size={14} />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(member.id)}
                          className="gap-2"
                          data-testid={`button-delete-${member.id}`}
                        >
                          <Trash2 size={14} />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
