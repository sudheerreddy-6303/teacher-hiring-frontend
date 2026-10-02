// ─── AcadHr <SiteBanner /> ────────────────────────────────────────────────────
// NEW, self-contained. Renders admin-managed banners for a placement. If none are
// set (or the fetch fails), it renders `fallback` so pages keep their default
// banner. Nothing existing is changed by adding this file.

import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function SiteBanner({ placement, fallback = null, imgClassName = "", rotateMs = 5000, onNavigate }) {
  const [banners, setBanners] = useState(null); // null = still loading
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/banners?placement=${encodeURIComponent(placement)}`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { if (alive) setBanners(Array.isArray(d) ? d : []); })
      .catch(() => { if (alive) setBanners([]); });
    return () => { alive = false; };
  }, [placement]);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), rotateMs);
    return () => clearInterval(t);
  }, [banners, rotateMs]);

  // While loading or when there are no admin banners, show the page's default.
  if (banners === null || banners.length === 0) return fallback;

  const b = banners[idx % banners.length];
  const hasText = b.title || b.subtitle || b.cta_text;
  const clickable = !!b.link_url;

  const go = () => {
    if (!b.link_url) return;
    if (/^https?:\/\//i.test(b.link_url)) { window.open(b.link_url, "_blank", "noopener"); return; }
    if (onNavigate) onNavigate(String(b.link_url).replace(/^\//, ""));
  };

  return (
    <div style={{ position: "relative", width: "100%", cursor: clickable ? "pointer" : "default" }} onClick={go}>
      {b.image_url ? (
        <img className={imgClassName} src={b.image_url} alt={b.title || "banner"}
          style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "center", ...(imgClassName ? {} : { height: 360 }) }}
          onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : (
        <div className={imgClassName} style={{ width: "100%", background: b.bg_color || "#1A56DB", ...(imgClassName ? {} : { height: 360 }) }} />
      )}

      {hasText && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 6%", color: "#fff", background: b.image_url ? "linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.15))" : "transparent",
          textShadow: "0 2px 10px rgba(0,0,0,.45)" }}>
          {b.title &&    <div style={{ fontSize: "clamp(20px,3.4vw,40px)", fontWeight: 900, lineHeight: 1.12, maxWidth: 620 }}>{b.title}</div>}
          {b.subtitle && <div style={{ fontSize: "clamp(12px,1.6vw,17px)", marginTop: 10, maxWidth: 560, opacity: .96 }}>{b.subtitle}</div>}
          {b.cta_text && <div style={{ marginTop: 18, alignSelf: "flex-start", background: "#fff", color: b.bg_color || "#1A56DB", fontWeight: 800, fontSize: 14, padding: "10px 22px", borderRadius: 10 }}>{b.cta_text}</div>}
        </div>
      )}

      {banners.length > 1 && (
        <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7 }}>
          {banners.map((_, i) => (
            <span key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
              style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 999, background: i === idx ? "#fff" : "rgba(255,255,255,.55)", transition: "all .2s", cursor: "pointer" }} />
          ))}
        </div>
      )}
    </div>
  );
}
