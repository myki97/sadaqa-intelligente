import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sadaqa Intelligente — Donner près de toi",
  description: "La bonne sadaqa, au bon moment, au bon endroit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F7F3EC" }}>
        <header style={{ background: "#0B3D2E", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 16px rgba(11,61,46,.35)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>🌙</span>
            <span style={{ color: "#F7F3EC", fontWeight: 800, fontSize: 17 }}>
              Sadaqa<span style={{ color: "#C9A84C" }}>IA</span>
            </span>
          </div>
          <button style={{ background: "#C9A84C", color: "#0B3D2E", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            + Publier un besoin
          </button>
        </header>
        {children}
      </body>
    </html>
  );
}
