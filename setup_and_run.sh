
#!/bin/bash

# File đánh dấu đã setup
SETUP_FLAG=".setup_complete"

echo "🚀 Wedding Site - Auto Setup & Run Script"
echo "=========================================="

# Kiểm tra xem đã setup chưa
if [ ! -f "$SETUP_FLAG" ]; then
    echo "📦 Lần chạy đầu tiên - Đang setup môi trường..."
    
    # 1. Cài đặt dependencies
    echo "📥 Đang cài đặt dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi cài đặt dependencies!"
        exit 1
    fi
    
    # 2. Kiểm tra file .env
    if [ ! -f ".env" ]; then
        echo "⚠️  Chưa có file .env!"
        echo "📝 Đang tạo file .env từ .env.example..."
        cp .env.example .env
        echo ""
        echo "⚠️  QUAN TRỌNG: Vui lòng cập nhật các giá trị trong file .env:"
        echo "   - DATABASE_URL: Connection string PostgreSQL"
        echo "   - SESSION_SECRET: Random secret key"
        echo ""
        read -p "Nhấn Enter sau khi đã cập nhật file .env..."
    fi
    
    # 3. Push database schema
    echo "🗄️  Đang tạo database schema..."
    npm run db:push
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi tạo database schema!"
        exit 1
    fi
    
    # 4. Seed database
    echo "🌱 Đang nạp dữ liệu mẫu vào database..."
    npx tsx server/seed.ts
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi nạp dữ liệu!"
        exit 1
    fi
    
    # Đánh dấu đã setup xong
    echo "✅ Setup hoàn tất!" > "$SETUP_FLAG"
    echo ""
    echo "🎉 Setup thành công!"
    echo "📋 Thông tin đăng nhập admin:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
else
    echo "✅ Đã setup trước đó - Bỏ qua bước setup"
fi

# Chạy development server
echo "🌐 Đang khởi động web server..."
echo "📍 Web sẽ chạy tại: http://0.0.0.0:5000"
echo "🔑 Đăng nhập admin tại: http://0.0.0.0:5000/admin/login"
echo ""
echo "Nhấn Ctrl+C để dừng server"
echo "=========================================="

npm run dev
