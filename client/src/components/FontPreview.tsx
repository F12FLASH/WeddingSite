import { useEffect } from "react";

interface FontPreviewProps {
  fontFamily: string;
  text: string;
  fontSize?: string;
  className?: string;
}

export function FontPreview({ fontFamily, text, fontSize = '16px', className = '' }: FontPreviewProps) {
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

  return (
    <div className={`mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border ${className}`}>
      <p className="text-sm text-muted-foreground mb-1">Xem trước:</p>
      <p style={{ fontFamily: `'${fontFamily}', serif`, fontSize }}>
        {text}
      </p>
    </div>
  );
}
