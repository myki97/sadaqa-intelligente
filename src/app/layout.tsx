import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sadaqa Intelligente — Donner près de toi",
  description: "La bonne sadaqa, au bon moment, au bon endroit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin:0, fontFamily:"'Segoe UI', system-ui, sans-serif", background:"#F7F3EC" }}>
        {children}
      </body>
    </html>
  );
}
