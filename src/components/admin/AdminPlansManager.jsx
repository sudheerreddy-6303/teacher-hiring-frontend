// ─── AcadHr <AdminPlansManager /> ─────────────────────────────────────────────
// Admin screen to edit the pricing catalog. First pick an audience
// (School / Teacher / Tutor / Parent), edit that audience's plans, and a LIVE
// PREVIEW below shows exactly how the pricing page will look as you type.
// Self-contained, additive — changes no existing logic. Prices edited in ₹.

import { useState, useEffect } from "react";

const AUDIENCES = [
  { id: "school",  label: "Schools" },
  { id: "teacher", label: "Teachers" },
  { id: "tutor",   label: "Tutors" },
  { id: "parent",  label: "Parents" },
];

const inr = (paise) => "₹" + ((Number(paise) || 0) / 100).toLocaleString("en-IN");

export default function AdminPlansManager() {
  const [groups, setGroups]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");
  const [savingKey, setSavingKey] = useState("");
  const [savedKey, setSavedKey]   = useState("");
  const [audience, setAudience]   = useState("school");

  const API   = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("acadhr_token");

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const res  = await fetch(API + "/payments/admin/plans", { headers: token ? { Authorization: "Bearer " + token } : {} });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load plans.");
      const g = (Array.isArray(data) ? data : []).map(x => ({ ...x, featuresText: (x.features || []).join("\n") }));
      setGroups(g);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const updGroup  = (key, patch) => setGroups(gs => gs.map(g => g.group_key === key ? { ...g, ...patch } : g));
  const updPeriod = (key, pi, patch) => setGroups(gs => gs.map(g => g.group_key !== key ? g : { ...g, periods: g.periods.map((p, j) => j === pi ? { ...p, ...patch } : p) }));

  const saveGroup = async (key) => {
    const g = groups.find(x => x.group_key === key);
    setSavingKey(key); setSavedKey(""); setErr("");
    try {
      const payload = {
        group_key:  g.group_key,
        group_name: g.group_name,
        tagline:    g.tagline,
        highlight:  !!g.highlight,
        accent:     g.accent,
        price_text: g.price_text || "",
        subtitle:   g.subtitle || "",
        features:   (g.featuresText || "").split("\n").map(s => s.trim()).filter(Boolean),
        periods:    g.periods.map(p => ({
          plan_id:      p.plan_id,
          period_label: p.period_label,
          amount:       Math.max(0, Math.round(Number(p.amount) || 0)),
          months:       Math.max(1, Math.round(Number(p.months) || 1)),
          credits:      Math.max(0, Math.round(Number(p.credits) || 0)),
          note:         p.note || "",
          active:       !!p.active,
        })),
      };
      const res  = await fetch(API + "/payments/admin/plans/save-group", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed.");
      setSavedKey(key);
      setTimeout(() => setSavedKey(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSavingKey(""); }
  };

  const lbl = { fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4, display: "block" };
  const inp = { width: "100%", padding: "8px 10px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, fontFamily: "Nunito,sans-serif" };

  const shown = groups.filter(g => g.audience === audience);

  return (
    <div style={{ padding: "28px 28px", fontFamily: "Nunito,sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Manage Pricing</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 18 }}>Pick who you're pricing for, edit the plans, and watch the live preview update. Prices are in ₹ (rupees). Changes set what customers see and what they're charged.</p>

      {/* Audience sub-tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {AUDIENCES.map(a => (
          <button key={a.id} onClick={() => setAudience(a.id)}
            style={{ padding: "8px 18px", borderRadius: 22, border: `1.5px solid ${audience === a.id ? "#1A56DB" : "#D1D5DB"}`, background: audience === a.id ? "#1A56DB" : "#fff", color: audience === a.id ? "#fff" : "#374151", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "Nunito,sans-serif" }}>
            {a.label}
          </button>
        ))}
      </div>

      {loading && <div style={{ color: "#6B7280" }}>Loading…</div>}
      {!loading && err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 14 }}>{err}</div>}

      {!loading && shown.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>🏷️</div>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>No plans for {AUDIENCES.find(a => a.id === audience)?.label}</div>
          <div style={{ fontSize: 13 }}>There are no {audience} plans set up yet.</div>
        </div>
      )}

      {/* ── Editors for the selected audience ── */}
      {!loading && shown.map(g => (
        <div key={g.group_key} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#4F46E5", background: "#EEF2FF", borderRadius: 20, padding: "3px 10px", textTransform: "capitalize" }}>{g.audience}</span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{g.group_key}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={lbl}>Plan Name</label><input style={inp} value={g.group_name || ""} onChange={e => updGroup(g.group_key, { group_name: e.target.value })} /></div>
            <div><label style={lbl}>Tagline</label><input style={inp} value={g.tagline || ""} onChange={e => updGroup(g.group_key, { tagline: e.target.value })} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={lbl}>Features / points (one per line)</label>
              <textarea style={{ ...inp, minHeight: 96, resize: "vertical" }} value={g.featuresText || ""} onChange={e => updGroup(g.group_key, { featuresText: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Highlight (Most Popular)</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#374151", marginTop: 4 }}>
                <input type="checkbox" checked={!!g.highlight} onChange={e => updGroup(g.group_key, { highlight: e.target.checked })} /> Show badge
              </label>
              <label style={{ ...lbl, marginTop: 14 }}>Accent color</label>
              <input style={inp} value={g.accent || ""} onChange={e => updGroup(g.group_key, { accent: e.target.value })} placeholder="#1A56DB" />
            </div>
          </div>

          {g.kind === "contact" ? (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:14, alignItems:"end" }}>
              <div><label style={lbl}>Price text</label><input style={inp} value={g.price_text || ""} onChange={e => updGroup(g.group_key, { price_text: e.target.value })} placeholder="₹25,000 – ₹1,00,000" /></div>
              <div><label style={lbl}>Subtitle</label><input style={inp} value={g.subtitle || ""} onChange={e => updGroup(g.group_key, { subtitle: e.target.value })} placeholder="Ideal for groups with 5+ schools" /></div>
              <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:700, color:"#374151", paddingBottom:8 }}>
                <input type="checkbox" checked={!!(g.periods[0] && g.periods[0].active)} onChange={e => updPeriod(g.group_key, 0, { active: e.target.checked })} /> Active
              </label>
            </div>
          ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", color: "#6B7280", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", fontWeight: 700 }}>Duration</th>
                  <th style={{ padding: "8px 10px", fontWeight: 700 }}>Price (₹)</th>
                  <th style={{ padding: "8px 10px", fontWeight: 700 }}>Credits</th>
                  <th style={{ padding: "8px 10px", fontWeight: 700 }}>Note</th>
                  <th style={{ padding: "8px 10px", fontWeight: 700 }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {g.periods.map((p, pi) => (
                  <tr key={p.plan_id} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px 10px" }}><input style={{ ...inp, width: 110 }} value={p.period_label || ""} onChange={e => updPeriod(g.group_key, pi, { period_label: e.target.value })} /></td>
                    <td style={{ padding: "8px 10px" }}><input type="number" min="0" style={{ ...inp, width: 120 }} value={Math.round((Number(p.amount) || 0) / 100)} onChange={e => updPeriod(g.group_key, pi, { amount: Math.round((Number(e.target.value) || 0) * 100) })} /></td>
                    <td style={{ padding: "8px 10px" }}><input type="number" min="0" style={{ ...inp, width: 90 }} value={Number(p.credits) || 0} onChange={e => updPeriod(g.group_key, pi, { credits: Number(e.target.value) || 0 })} /></td>
                    <td style={{ padding: "8px 10px" }}><input style={{ ...inp, width: 120 }} value={p.note || ""} onChange={e => updPeriod(g.group_key, pi, { note: e.target.value })} placeholder="e.g. save 10%" /></td>
                    <td style={{ padding: "8px 10px" }}><input type="checkbox" checked={!!p.active} onChange={e => updPeriod(g.group_key, pi, { active: e.target.checked })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <button onClick={() => saveGroup(g.group_key)} disabled={savingKey === g.group_key}
              style={{ padding: "10px 22px", border: "none", borderRadius: 10, background: "#1A56DB", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "Nunito,sans-serif", opacity: savingKey === g.group_key ? .7 : 1 }}>
              {savingKey === g.group_key ? "Saving…" : "Save Changes"}
            </button>
            {savedKey === g.group_key && <span style={{ color: "#059669", fontWeight: 700, fontSize: 13 }}>✓ Saved</span>}
          </div>
        </div>
      ))}

      {/* ── LIVE PREVIEW (looks like the pricing page) ── */}
      {!loading && shown.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Live preview</h3>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 20, padding: "2px 10px" }}>as customers see it</span>
          </div>
          <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 16 }}>This is exactly how the {AUDIENCES.find(a => a.id === audience)?.label} pricing page will look. Only active durations are shown.</p>

          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Choose your plan</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Payments are processed securely via Razorpay.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
              {shown.map(g => {
                const accent = g.accent || "#1A56DB";
                const feats  = (g.featuresText || "").split("\n").map(s => s.trim()).filter(Boolean);
                if (g.kind === "contact") {
                  const on = g.periods[0] && g.periods[0].active;
                  if (!on) return null;
                  return (
                    <div key={g.group_key} style={{ background:"#fff", border:`2px solid ${g.highlight ? accent : "#E5E7EB"}`, borderRadius:16, padding:22, display:"flex", flexDirection:"column", position:"relative" }}>
                      {g.highlight && <span style={{ position:"absolute", top:-12, left:20, background:accent, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20 }}>MOST POPULAR</span>}
                      <div style={{ fontWeight:800, fontSize:18, color:"#111827" }}>{g.group_name || "Plan name"}</div>
                      <div style={{ fontSize:13, color:"#6B7280", marginTop:4, marginBottom:16 }}>{g.tagline || ""}</div>
                      <div style={{ fontSize:22, fontWeight:900, color:"#111827", marginBottom:2 }}>{g.price_text || "—"}</div>
                      <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:16 }}>{g.subtitle || ""}</div>
                      <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14, marginTop:"auto" }}>
                        {feats.map((f, i) => (<div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:"#374151", marginBottom:8 }}><span style={{ color:"#059669", fontWeight:800 }}>✓</span><span>{f}</span></div>))}
                      </div>
                      <button style={{ marginTop:14, width:"100%", padding:"11px 0", borderRadius:10, border:"none", background:"#111827", color:"#fff", fontWeight:800, fontSize:14 }}>Contact Sales</button>
                    </div>
                  );
                }
                const active = g.periods.filter(p => p.active);
                if (active.length === 0) return null;
                return (
                  <div key={g.group_key} style={{ background: "#fff", border: `2px solid ${g.highlight ? accent : "#E5E7EB"}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", position: "relative", boxShadow: g.highlight ? "0 8px 24px rgba(0,0,0,.08)" : "none" }}>
                    {g.highlight && <span style={{ position: "absolute", top: -12, left: 20, background: accent, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>MOST POPULAR</span>}
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>{g.group_name || "Plan name"}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4, marginBottom: 16 }}>{g.tagline || ""}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                      {active.map(p => (
                        <div key={p.plan_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${g.highlight ? accent : "#D1D5DB"}`, background: g.highlight ? accent : "#fff", color: g.highlight ? "#fff" : accent, fontWeight: 800, fontSize: 14 }}>
                          <span>{p.period_label}</span>
                          <span>{inr(p.amount)}{p.note ? <span style={{ fontSize: 11, fontWeight: 700, opacity: .85, marginLeft: 6 }}>· {p.note}</span> : null}</span>
                        </div>
                      ))}
                      <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 2 }}>Tap a duration to pay</div>
                    </div>
                    <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14, marginTop: "auto" }}>
                      {feats.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151", marginBottom: 8 }}>
                          <span style={{ color: "#059669", fontWeight: 800 }}>✓</span><span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
