"use client";

export default function HeaderClient() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-publish"));
  };

  return (
    <header style={{ background:"#0B3D2E", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 16px rgba(11,61,46,.35)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:22 }}>🌙</span>
        <span style={{ color:"#F7F3EC", fontWeight:800, fontSize:17 }}>Sadaqa<span style={{ color:"#C9A84C" }}>IA</span></span>
      </div>
      <button onClick={handleClick} style={{ background:"#C9A84C", color:"#0B3D2E", border:"none", borderRadius:8, padding:"8px 14px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
        + Publier un besoin
      </button>
    </header>
  );
}
