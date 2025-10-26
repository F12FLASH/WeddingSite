import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ImageMapping {
  folder: string;
  files: string[];
  category: string;
}

async function convertImagesToBase64() {
  const basePath = join(__dirname, '..', 'attached_assets', 'wedding_images');
  
  const imagesMappings: ImageMapping[] = [
    { folder: 'album', files: readdirSync(join(basePath, 'album')), category: 'album' },
    { folder: 'background', files: readdirSync(join(basePath, 'background')), category: 'background' },
    { folder: 'avatar', files: readdirSync(join(basePath, 'avatar')), category: 'avatar' },
    { folder: 'venue', files: readdirSync(join(basePath, 'venue')), category: 'venue' },
    { folder: 'bridesmaids', files: readdirSync(join(basePath, 'bridesmaids')), category: 'bridesmaids' },
    { folder: 'groomsmen', files: readdirSync(join(basePath, 'groomsmen')), category: 'groomsmen' },
    { folder: 'qr', files: readdirSync(join(basePath, 'qr')), category: 'qr' },
  ];

  const results: Record<string, Record<string, string>> = {};

  console.log('🚀 Bắt đầu convert ảnh thành base64 data URLs...\n');

  for (const mapping of imagesMappings) {
    console.log(`📁 Đang xử lý folder: ${mapping.folder}`);
    results[mapping.category] = {};

    for (const filename of mapping.files) {
      const filePath = join(basePath, mapping.folder, filename);
      
      try {
        console.log(`  ⏳ Đang convert: ${filename}...`);
        const file = readFileSync(filePath);
        const extension = filename.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
        const base64 = `data:image/${extension};base64,${file.toString('base64')}`;
        
        results[mapping.category][filename] = base64;
        
        console.log(`  ✅ Thành công: ${filename} (${(file.length / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.error(`  ❌ Lỗi convert ${filename}:`, error);
      }
    }
    console.log('');
  }

  console.log('\n📝 Lưu kết quả vào file image_data.json...\n');
  const outputPath = join(__dirname, 'image_data.json');
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`✅ Hoàn thành! File đã được lưu tại ${outputPath}`);

  return results;
}

convertImagesToBase64().catch(console.error);
