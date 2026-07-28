"use client";

import { useState, useEffect } from "react";
import type { Besoin } from "@/types";
import { Search, MapPin, Clock, MessageCircle, Zap } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "mobilier", label: "Mobilier" },
  { id: "vetements", label: "Vêtements" },
  { id: "nourriture", label: "Nourriture" },
  { id: "livres", label: "Livres" },
  { id: "electromenager", label: "Électro" },
];

export default function HomePage() {
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");

  const fetchBesoins = async () => {
    setLoading(true);
    try {
      const params = cat !== "all" ? `?category=${cat}` : "";
      const res = await fetch(`/api/besoins${params}`);
      const data = await res.json();
      setBesoins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBesoins(); }, [cat]);

  const filtered = besoins.filter(b =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ color: "#0B3D2E" }}>Sadaqa Intelligente 🌙</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher..."
        style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: "1px solid #E5E7EB" }}
      />
      {loading ? <p>Chargement...</p> : (
        filtered.map(b => (
          <div key={b.id} style={{ padding: 14, marginBottom: 10, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff" }}>
            <strong>{b.title}</strong>
            <p style={{ color: "#6B7280", margin: "4px 0" }}>{b.description}</p>
            <span style={{ fontSize: 12, color: "#0B3D2E" }}>{b.city}</span>
          </div>
        ))
      )}
    </main>
  );
}
