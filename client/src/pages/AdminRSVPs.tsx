import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Check, X, Heart, Mail, Phone, Calendar, Utensils, Search, Filter, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Rsvp } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminRSVPs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");

  const { data: rsvps = [], isLoading, isError, error } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  // Filter RSVPs based on search and filters
  const filteredRsvps = rsvps.filter(rsvp => {
    const matchesSearch = rsvp.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "attending" && rsvp.attending) ||
                         (statusFilter === "declined" && !rsvp.attending);
    const matchesMeal = mealFilter === "all" || rsvp.mealPreference === mealFilter;
    return matchesSearch && matchesStatus && matchesMeal;
  });

  // Calculate statistics
  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attending).length,
    declined: rsvps.filter(r => !r.attending).length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.attending ? r.guestCount : 0), 0),
    responseRate: rsvps.length > 0 ? Math.round((rsvps.length / 150) * 100) : 0, // Assuming 150 invited
  };

  const mealPreferences = Array.from(new Set(rsvps.map(r => r.mealPreference).filter((meal): meal is string => Boolean(meal))));

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

  const exportToCSV = () => {
    const headers = ['Tên', 'Email', 'Số điện thoại', 'Tham dự', 'Số khách', 'Món ăn', 'Yêu cầu đặc biệt', 'Ngày gửi'];
    const csvData = rsvps.map(rsvp => [
      rsvp.guestName,
      rsvp.email,
      rsvp.phone || '',
      rsvp.attending ? 'Có' : 'Không',
      rsvp.guestCount,
      rsvp.mealPreference || '',
      rsvp.specialRequirements || '',
      new Date(rsvp.createdAt!).toLocaleDateString('vi-VN')
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rsvp-list.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">📋 Quản Lý RSVP</h2>
          <p className="text-muted-foreground">Theo dõi và quản lý phản hồi của khách mời</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3" />
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
          <h2 className="text-3xl font-serif mb-2 text-foreground">📋 Quản Lý RSVP</h2>
          <p className="text-muted-foreground">Theo dõi và quản lý phản hồi của khách mời</p>
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
            <p className="text-destructive text-lg mb-2">Không thể tải RSVP</p>
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
            <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-rsvps">
              📋 Quản Lý RSVP
            </h2>
            <p className="text-muted-foreground text-lg">
              Theo dõi và quản lý phản hồi của khách mời
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="rounded-xl"
          >
            <Download size={16} className="mr-2" />
            Xuất CSV
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid gap-6 md:grid-cols-4 mb-8" variants={itemVariants}>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Phản Hồi</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.responseRate}% tỷ lệ phản hồi
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tham Dự</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.attending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? Math.round((stats.attending / stats.total) * 100) : 0}% tổng số
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Từ Chối</CardTitle>
              <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{stats.declined}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? Math.round((stats.declined / stats.total) * 100) : 0}% tổng số
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Số Khách</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">{stats.totalGuests}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.attending > 0 ? Math.round(stats.totalGuests / stats.attending) : 0} khách/người
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" variants={itemVariants}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="🔍 Tìm kiếm theo tên hoặc email..."
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
                <SelectItem value="attending">✅ Tham dự</SelectItem>
                <SelectItem value="declined">❌ Từ chối</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mealFilter} onValueChange={setMealFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <Utensils size={16} className="mr-2" />
                <SelectValue placeholder="Tất cả món ăn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🍽️ Tất cả</SelectItem>
                {mealPreferences.map(meal => (
                  <SelectItem key={meal} value={meal}>
                    {meal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </motion.div>

      {/* RSVP List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Card className="border-2 border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" size={20} />
              Tất Cả RSVP ({filteredRsvps.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRsvps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Heart className="text-muted-foreground mb-4 opacity-50" size={64} />
                <p className="text-muted-foreground text-lg mb-2">
                  {searchTerm || statusFilter !== "all" || mealFilter !== "all" 
                    ? "Không tìm thấy RSVP nào" 
                    : "Chưa có RSVP nào"
                  }
                </p>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== "all" || mealFilter !== "all" 
                    ? "Thử thay đổi bộ lọc tìm kiếm" 
                    : "Khách mời sẽ xuất hiện ở đây khi họ gửi RSVP"
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredRsvps.map((rsvp) => (
                    <motion.div
                      key={rsvp.id}
                      className="p-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      data-testid={`rsvp-${rsvp.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            rsvp.attending 
                              ? "bg-green-500/10 text-green-600" 
                              : "bg-red-500/10 text-red-600"
                          }`}>
                            {rsvp.attending ? <Check size={20} /> : <X size={20} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold text-foreground text-lg">
                                {rsvp.guestName}
                              </p>
                              <Badge 
                                variant={rsvp.attending ? "default" : "secondary"}
                                className={
                                  rsvp.attending 
                                    ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" 
                                    : "bg-red-500/20 text-red-600 hover:bg-red-500/30"
                                }
                              >
                                {rsvp.attending ? "✅ Tham dự" : "❌ Từ chối"}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Mail size={14} />
                                {rsvp.email}
                              </div>
                              {rsvp.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone size={14} />
                                  {rsvp.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(rsvp.createdAt!).toLocaleDateString('vi-VN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>

                            {rsvp.attending && (
                              <div className="flex flex-wrap gap-3 mt-2">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                  👥 {rsvp.guestCount} {rsvp.guestCount === 1 ? "khách" : "khách"}
                                </Badge>
                                {rsvp.mealPreference && (
                                  <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
                                    <Utensils size={12} className="mr-1" />
                                    {rsvp.mealPreference}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {rsvp.specialRequirements && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Yêu cầu đặc biệt:</span> {rsvp.specialRequirements}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}