// ─── AcadHr <AdminBannersManager /> ───────────────────────────────────────────
// NEW, self-contained. Lets the admin manage banners for the Home page and each
// Browse page — separately. Reads/writes /api/banners/* only. Nothing existing
// is changed by adding this file.

import { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const token = () => localStorage.getItem("acadhr_token");

const PLACEMENTS = [
  { id: "home",            label: "🏠 Home Page" },
  { id: "browse_teachers", label: "👩‍🏫 Browse Teachers" },
  { id: "browse_tutors",   label: "🧑‍🎓 Browse Tutors" },
  { id: "browse_tuitions", label: "📚 Browse Tuitions" },
  { id: "browse_jobs",     label: "💼 Browse Jobs" },
];

const blank = (placement) => ({
  id: null, placement, title: "", subtitle: "", image_url: "",
  link_url: "", cta_text: "", bg_color: "#1A56DB", active: 1, sort_order: 0,
});

export default function AdminBannersManager() {
  const [placement, setPlacement] = useState("home");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // banner being added/edited
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/banners/all?placement=${placement}`, { headers: { Authorization: "Bearer " + token() } })
      .then(r => r.ok ? r.json() : [])
      .then(d => setRows(Array.isArray(d) ? d : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [placement]);

  useEffect(() => { load(); setEditing(null); }, [load]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  function onPickImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { flash("Please choose an image under 3 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setEditing(b => ({ ...b, image_url: reader.result }));
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    try {
      const r = await fetch(`${API}/banners/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token() },
        body: JSON.stringify(editing),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Save failed");
      flash("Saved ✓");
      setEditing(null);
      load();
    } catch (e) { flash(e.message); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const r = await fetch(`${API}/banners/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token() },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.message || "Delete failed"); }
      flash("Deleted");
      load();
    } catch (e) { flash(e.message); }
  }

  const lbl = { fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, display: "block" };
  const inp = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13.5, outline: "none", marginBottom: 12, boxSizing: "border-box" };

  return (
    <div style={{ padding: "26px 26px 50px" }} className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Manage Banners</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 18 }}>Add and edit banners for the Home page and each Browse page — each is managed separately.</p>

      {/* placement tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {PLACEMENTS.map(p => (
          <button key={p.id} onClick={() => setPlacement(p.id)}
            style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid " + (placement === p.id ? "#1A56DB" : "#E5E7EB"),
              background: placement === p.id ? "#1A56DB" : "#fff", color: placement === p.id ? "#fff" : "#374151",
              fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {p.label}
          </button>
        ))}
      </div>

      {msg && <div style={{ marginBottom: 14, background: "#EEF3FE", border: "1px solid #C7D7FE", color: "#1A56DB", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>{PLACEMENTS.find(p => p.id === placement)?.label} — {rows.length} banner{rows.length === 1 ? "" : "s"}</div>
        {!editing && <button onClick={() => setEditing(blank(placement))} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "#1A56DB", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>+ Add Banner</button>}
      </div>

      {/* editor */}
      {editing && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, marginBottom: 22 }}>
          <div style={{ fontWeight: 800, color: "#111827", marginBottom: 14 }}>{editing.id ? "Edit banner" : "New banner"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Banner image</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                <label style={{ padding: "9px 14px", borderRadius: 8, border: "1px dashed #9CA3AF", background: "#F9FAFB", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#374151" }}>
                  ⬆ Upload image
                  <input type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
                </label>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>or paste a URL / path below</span>
              </div>
              <input style={inp} placeholder="https://…  or  /browse-teachers-banner.png" value={editing.image_url?.startsWith("data:") ? "" : editing.image_url} onChange={e => setEditing(b => ({ ...b, image_url: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Title (optional)</label>
              <input style={inp} value={editing.title} onChange={e => setEditing(b => ({ ...b, title: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Subtitle (optional)</label>
              <input style={inp} value={editing.subtitle} onChange={e => setEditing(b => ({ ...b, subtitle: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Button text (optional)</label>
              <input style={inp} value={editing.cta_text} onChange={e => setEditing(b => ({ ...b, cta_text: e.target.value }))} placeholder="e.g. Explore Jobs" />
            </div>
            <div>
              <label style={lbl}>Link when clicked (optional)</label>
              <input style={inp} value={editing.link_url} onChange={e => setEditing(b => ({ ...b, link_url: e.target.value }))} placeholder="e.g. /jobs or https://…" />
            </div>
            <div>
              <label style={lbl}>Overlay color</label>
              <input type="color" value={editing.bg_color || "#1A56DB"} onChange={e => setEditing(b => ({ ...b, bg_color: e.target.value }))} style={{ ...inp, height: 40, padding: 4 }} />
            </div>
            <div>
              <label style={lbl}>Order (lower shows first)</label>
              <input type="number" style={inp} value={editing.sort_order} onChange={e => setEditing(b => ({ ...b, sort_order: Number(e.target.value) || 0 }))} />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <input id="banner-active" type="checkbox" checked={!!editing.active} onChange={e => setEditing(b => ({ ...b, active: e.target.checked ? 1 : 0 }))} />
              <label htmlFor="banner-active" style={{ fontSize: 13.5, color: "#374151", fontWeight: 600 }}>Active (visible on the site)</label>
            </div>
          </div>

          {/* live preview */}
          <div style={{ marginTop: 6, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>Live preview</div>
            <BannerPreview b={editing} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} disabled={busy} style={{ padding: "10px 20px", borderRadius: 9, border: "none", background: "#1A56DB", color: "#fff", fontWeight: 700, fontSize: 14, cursor: busy ? "wait" : "pointer" }}>{busy ? "Saving…" : "Save banner"}</button>
            <button onClick={() => setEditing(null)} style={{ padding: "10px 20px", borderRadius: 9, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* list */}
      {loading ? (
        <div style={{ color: "#6B7280", fontSize: 14 }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ background: "#fff", border: "1px dashed #D1D5DB", borderRadius: 14, padding: "36px 24px", textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🖼️</div>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>No banners here yet</div>
          <div style={{ fontSize: 13 }}>Click “Add Banner” to create one for this page.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map(b => (
            <div key={b.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 14, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 220, maxWidth: "100%", flex: "0 0 auto" }}><BannerPreview b={b} small /></div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 800, color: "#111827" }}>{b.title || <span style={{ color: "#9CA3AF" }}>(image only)</span>}</div>
                {b.subtitle && <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>{b.subtitle}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 999, background: b.active ? "#ECFDF5" : "#FEF2F2", color: b.active ? "#059669" : "#DC2626" }}>{b.active ? "Active" : "Hidden"}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>Order: {b.sort_order}</span>
                  {b.link_url && <span style={{ fontSize: 11, color: "#9CA3AF" }}>→ {b.link_url}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
                <button onClick={() => setEditing({ ...b, active: b.active ? 1 : 0 })} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #C7D7FE", background: "#EEF3FE", color: "#1A56DB", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Edit</button>
                <button onClick={() => remove(b.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shared preview — renders the banner the way the site will show it.
function BannerPreview({ b, small }) {
  const h = small ? 90 : 200;
  const hasText = b.title || b.subtitle || b.cta_text;
  return (
    <div style={{ position: "relative", width: "100%", height: h, borderRadius: 12, overflow: "hidden", background: b.image_url ? "#000" : (b.bg_color || "#1A56DB"), border: "1px solid #E5E7EB" }}>
      {b.image_url ? (
        <img src={b.image_url} alt={b.title || "banner"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: hasText ? 0.7 : 1 }} onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : null}
      {hasText && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: small ? "0 12px" : "0 34px", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
          {b.title &&    <div style={{ fontSize: small ? 13 : 26, fontWeight: 900, lineHeight: 1.15 }}>{b.title}</div>}
          {b.subtitle && <div style={{ fontSize: small ? 10 : 14, marginTop: small ? 2 : 8, opacity: .95 }}>{b.subtitle}</div>}
          {b.cta_text && !small && <div style={{ marginTop: 14, alignSelf: "flex-start", background: "#fff", color: b.bg_color || "#1A56DB", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 8 }}>{b.cta_text}</div>}
        </div>
      )}
    </div>
  );
}
