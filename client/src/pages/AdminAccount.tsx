import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, User, Lock, Mail, Calendar, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const profileUpdateSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});

export default function AdminAccount() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { data: user } = useQuery<any>({
    queryKey: ["/api/user"],
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileUpdateSchema>) => {
      return await apiRequest("POST", "/api/update-profile", {
        username: data.username,
        email: data.email || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ 
        title: "✅ Đã cập nhật thông tin",
        description: "Thông tin tài khoản của bạn đã được cập nhật thành công"
      });
      setIsEditingProfile(false);
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: error.message || "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof passwordChangeSchema>) => {
      return await apiRequest("POST", "/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast({ 
        title: "✅ Đã đổi mật khẩu",
        description: "Mật khẩu của bạn đã được cập nhật thành công"
      });
      passwordForm.reset();
      setIsChangingPassword(false);
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "❌ Lỗi",
        description: error.message || "Không thể đổi mật khẩu",
        variant: "destructive",
      });
    },
  });

  const onPasswordSubmit = passwordForm.handleSubmit((data) => {
    changePasswordMutation.mutate(data);
  });

  const onProfileSubmit = profileForm.handleSubmit((data) => {
    updateProfileMutation.mutate(data);
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

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tài Khoản Admin
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin tài khoản của bạn</p>
        </div>
      </motion.div>

      {/* Account Information Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="text-blue-500" size={20} />
                Thông Tin Tài Khoản
              </CardTitle>
              {!isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit size={16} className="mr-2" />
                  Chỉnh Sửa
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!isEditingProfile ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tên đăng nhập</label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <User size={16} className="text-muted-foreground" />
                      <span className="font-medium">{user?.username || "Admin"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Mail size={16} className="text-muted-foreground" />
                      <span className="font-medium">{user?.email || "Chưa có"}</span>
                    </div>
                  </div>
                </div>

                {user?.createdAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Ngày tạo tài khoản</label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Form {...profileForm}>
                <form onSubmit={onProfileSubmit} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên đăng nhập"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        profileForm.reset({
                          username: user?.username || "",
                          email: user?.email || "",
                        });
                      }}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save size={16} className="mr-2" />
                      {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu Thông Tin"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Lock className="text-purple-500" size={20} />
              Đổi Mật Khẩu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!isChangingPassword ? (
              <div className="text-center py-8">
                <Lock size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Bảo vệ tài khoản của bạn bằng mật khẩu mạnh
                </p>
                <Button 
                  onClick={() => setIsChangingPassword(true)}
                  className="rounded-lg"
                >
                  <Lock size={16} className="mr-2" />
                  Đổi Mật Khẩu
                </Button>
              </div>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={onPasswordSubmit} className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>⚠️ Lưu ý:</strong> Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại với mật khẩu mới.
                    </p>
                  </div>

                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật Khẩu Hiện Tại *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu hiện tại"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật Khẩu Mới *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác Nhận Mật Khẩu Mới *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        passwordForm.reset();
                      }}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={changePasswordMutation.isPending}
                    >
                      <Save size={16} className="mr-2" />
                      {changePasswordMutation.isPending ? "Đang lưu..." : "Lưu Mật Khẩu Mới"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Tips */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-green-500">💡 Mẹo</Badge>
              Bảo Mật Tài Khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm text-muted-foreground">
                  Sử dụng mật khẩu dài ít nhất 8-12 ký tự
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm text-muted-foreground">
                  Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm text-muted-foreground">
                  Không sử dụng thông tin cá nhân dễ đoán (tên, ngày sinh, số điện thoại)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm text-muted-foreground">
                  Thay đổi mật khẩu định kỳ để tăng cường bảo mật
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
