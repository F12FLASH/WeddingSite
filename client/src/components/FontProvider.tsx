import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import { useEffect } from "react";

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      
      if (settings.fontHeading) {
        root.style.setProperty('--font-serif', `'${settings.fontHeading}', 'Noto Serif', Georgia, serif`);
      }
      
      if (settings.fontBody) {
        root.style.setProperty('--font-body', `'${settings.fontBody}', 'Noto Serif', Georgia, serif`);
        root.style.setProperty('--font-sans', `'${settings.fontBody}', 'Noto Serif', Georgia, serif`);
      }
      
      if (settings.fontCursive) {
        root.style.setProperty('--font-cursive', `'${settings.fontCursive}', 'Parisienne', cursive`);
      }
    }
  }, [settings]);

  return <>{children}</>;
}
