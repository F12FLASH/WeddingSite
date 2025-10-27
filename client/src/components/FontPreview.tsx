import { useEffect } from "react";
import { motion } from "framer-motion";

interface FontPreviewProps {
  fontFamily: string;
  previewType: 'heading' | 'body' | 'cursive' | 'serif';
  className?: string;
}

const previewContent = {
  heading: {
    title: "Tiêu đề chính",
    description: "Font này hiển thị ở phần Hero (đầu trang) và các tiêu đề lớn",
    examples: [
      { text: "Xuân Lâm & Xuân Lợi", size: "32px", label: "Tên cặp đôi trên Hero" },
      { text: "Câu Chuyện Tình Yêu", size: "28px", label: "Tiêu đề các phần" },
      { text: "Lời Chúc Mừng", size: "24px", label: "Tiêu đề phụ" },
    ],
    icon: "🎨",
    color: "from-purple-500/10 to-purple-500/5",
    borderColor: "border-purple-200",
  },
  body: {
    title: "Nội dung chính",
    description: "Font này dùng cho tất cả đoạn văn và nội dung thông tin",
    examples: [
      { text: "Chúng tôi rất vui mừng được chia sẻ niềm hạnh phúc này cùng bạn.", size: "16px", label: "Đoạn văn giới thiệu" },
      { text: "Địa điểm: Trung tâm hội nghị ABC, TP. Hồ Chí Minh", size: "15px", label: "Thông tin sự kiện" },
      { text: "Thời gian: 10:00 - 25/12/2025", size: "14px", label: "Chi tiết nhỏ" },
    ],
    icon: "📝",
    color: "from-blue-500/10 to-blue-500/5",
    borderColor: "border-blue-200",
  },
  cursive: {
    title: "Chữ nghệ thuật",
    description: "Font chữ viết tay lãng mạn dùng cho tên cô dâu/chú rể",
    examples: [
      { text: "Xuân Lâm", size: "36px", label: "Tên chú rể" },
      { text: "Xuân Lợi", size: "36px", label: "Tên cô dâu" },
      { text: "Trân trọng kính mời", size: "20px", label: "Lời mời đặc biệt" },
    ],
    icon: "✨",
    color: "from-pink-500/10 to-pink-500/5",
    borderColor: "border-pink-200",
  },
  serif: {
    title: "Font phụ trợ",
    description: "Font serif bổ sung cho các phần văn bản đặc biệt, lời cảm ơn",
    examples: [
      { text: "Chân thành cảm ơn sự hiện diện của quý khách!", size: "18px", label: "Lời cảm ơn" },
      { text: "Đám cưới của chúng tôi sẽ được tổ chức vào ngày 25/12/2025", size: "16px", label: "Thông tin quan trọng" },
      { text: "Rất mong được đón tiếp", size: "15px", label: "Tin nhắn đặc biệt" },
    ],
    icon: "📜",
    color: "from-green-500/10 to-green-500/5",
    borderColor: "border-green-200",
  },
};

export function FontPreview({ fontFamily, previewType, className = '' }: FontPreviewProps) {
  useEffect(() => {
    if (!fontFamily || fontFamily === 'Georgia' || fontFamily === 'Times New Roman') {
      return;
    }

    const linkId = `font-preview-${fontFamily.replace(/\s+/g, '-')}`;
    const existingLink = document.getElementById(linkId);
    
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap&subset=vietnamese`;
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  const content = previewContent[previewType];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 p-5 bg-gradient-to-br ${content.color} rounded-xl border-2 ${content.borderColor} ${className}`}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-2xl">{content.icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{content.title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{content.description}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {content.examples.map((example, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              📍 {example.label}
            </p>
            <p 
              style={{ 
                fontFamily: `'${fontFamily}', serif`, 
                fontSize: example.size,
                lineHeight: '1.4'
              }}
              className="text-gray-900 dark:text-gray-100"
            >
              {example.text}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Font đang dùng: <span className="font-semibold text-gray-700 dark:text-gray-300">{fontFamily}</span>
        </p>
      </div>
    </motion.div>
  );
}
