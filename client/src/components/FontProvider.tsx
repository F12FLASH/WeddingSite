import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import { useEffect } from "react";

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      const fontsToLoad: string[] = [];
      
      // Collect all selected fonts
      if (settings.fontHeading && settings.fontHeading !== 'Georgia' && settings.fontHeading !== 'Times New Roman') {
        fontsToLoad.push(settings.fontHeading);
      }
      if (settings.fontBody && settings.fontBody !== 'Georgia' && settings.fontBody !== 'Times New Roman') {
        fontsToLoad.push(settings.fontBody);
      }
      if (settings.fontCursive) {
        fontsToLoad.push(settings.fontCursive);
      }
      if (settings.fontSerif && settings.fontSerif !== 'Georgia' && settings.fontSerif !== 'Times New Roman') {
        fontsToLoad.push(settings.fontSerif);
      }

      // Remove duplicates
      const uniqueFonts = Array.from(new Set(fontsToLoad));

      // Remove existing Google Fonts link if present
      const existingLink = document.getElementById('google-fonts-dynamic');
      if (existingLink) {
        existingLink.remove();
      }

      // Load fonts from Google Fonts if there are any to load
      if (uniqueFonts.length > 0) {
        const link = document.createElement('link');
        link.id = 'google-fonts-dynamic';
        link.rel = 'stylesheet';
        
        // Build Google Fonts URL with Vietnamese subset
        const fontFamilies = uniqueFonts
          .map(font => `family=${encodeURIComponent(font)}:wght@400;500;600;700`)
          .join('&');
        link.href = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap&subset=vietnamese`;
        
        document.head.appendChild(link);
      }

      // Apply fonts to CSS variables
      const root = document.documentElement;
      
      if (settings.fontHeading) {
        root.style.setProperty('--font-serif', `'${settings.fontHeading}', 'Noto Serif', Georgia, serif`);
      }
      
      if (settings.fontBody) {
        root.style.setProperty('--font-body', `'${settings.fontBody}', 'Noto Serif', Georgia, serif`);
        root.style.setProperty('--font-sans', `'${settings.fontBody}', 'Noto Serif', Georgia, serif`);
      }
      
      if (settings.fontCursive) {
        root.style.setProperty('--font-cursive', `'${settings.fontCursive}', 'Dancing Script', cursive`);
      }
      
      if (settings.fontSerif) {
        root.style.setProperty('--font-serif-alt', `'${settings.fontSerif}', 'Noto Serif', Georgia, serif`);
      }
    }
  }, [settings]);

  return <>{children}</>;
}
