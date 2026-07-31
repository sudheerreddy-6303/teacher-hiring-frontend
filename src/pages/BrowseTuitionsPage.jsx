import { useState, useEffect } from "react";
import { Navbar } from "../components/common/Shared";
import { useAuth } from "../context/AuthContext";
import apiBase from "../config/apiBase";

const SUBJECTS = ["All","Mathematics","Physics","Chemistry","Biology","English","Hindi","Computer Science","Economics","Accountancy","Social Science","Zoology"];
const MODES    = ["All","Online","Offline","Both"];
const CITIES   = ["All","Hyderabad","Delhi","Mumbai","Bangalore","Chennai","Pune","Kolkata","Visakhapatnam","Vijayawada"];

// Show only the first `n` comma-separated items on the card, then "…" if there are more.
// n <= 0 (or omitted) means show the full value uncapped. Empty value shows "—".
function capList(value, n) {
  if (value === undefined || value === null || String(value).trim() === "") return "—";
  const parts = String(value).split(",").map(x => x.trim()).filter(Boolean);
  if (!n || n <= 0 || parts.length <= n) return parts.join(", ");
  return parts.slice(0, n).join(", ") + "…";
}

const SUBJECT_ICON = {
  mathematics:"➗", maths:"➗", math:"➗", physics:"🔬", chemistry:"⚗️", biology:"🧬",
  english:"📖", hindi:"🔤", "computer science":"💻", economics:"📈", accountancy:"📊",
  "social science":"🌍", science:"🔭",
};
function iconFor(subject) {
  const key = (subject || "").trim().toLowerCase().split(/[,/]/)[0].trim();
  return SUBJECT_ICON[key] || "📚";
}

export default function BrowseTuitionsPage({ setPage }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [shareToast, setShareToast] = useState(false);
  const [tuitions, setTuitions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState({ subject:"All", mode:"All", city:"All", search:"" });
  const [showFilters, setShowFilters] = useState(false);

  const API = apiBase();

  useEffect(() => {
    setLoading(true);
    setError("");
    const url = `${API}/admin/public/tuitions`;
    // Tuition requirements posted by parents (public, no auth needed)
    fetch(url)
      .then(async r => {
        if (!r.ok) {
          const body = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${body.slice(0, 140)}`);
        }
        return r.json();
      })
      .then(data => {
        setTuitions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("[Browse Tuitions] load failed:", err, "| URL:", url);
        setError(`Could not load tuitions — ${err.message}. (URL: ${url})`);
        setLoading(false);
      });
  }, []);

  const cityOf = t => t.location || t.user_city || "";

  const filtered = tuitions.filter(t =>
    (filter.subject === "All" || (t.subject||"").toLowerCase().includes(filter.subject.toLowerCase())) &&
    (filter.mode    === "All" || (t.mode||"") === filter.mode) &&
    (filter.city    === "All" || cityOf(t).toLowerCase().includes(filter.city.toLowerCase())) &&
    (!filter.search ||
      (t.subject||"").toLowerCase().includes(filter.search.toLowerCase()) ||
      (t.board||"").toLowerCase().includes(filter.search.toLowerCase()) ||
      cityOf(t).toLowerCase().includes(filter.search.toLowerCase()) ||
      (t.student_class||"").toLowerCase().includes(filter.search.toLowerCase()) ||
      (t.notes||"").toLowerCase().includes(filter.search.toLowerCase()))
  );

  const activeFilterCount = ["subject","mode","city"].filter(k => filter[k] !== "All").length
    + (filter.search ? 1 : 0);

  // Share a tuition requirement — everything EXCEPT phone, email & student name
  async function shareTuition(t, e) {
    if (e) e.stopPropagation();
    const url = window.location.origin;
    const lines = [];
    if (t.subject)            lines.push(`📚 Subject: ${t.subject}`);
    const cls = [t.student_class, t.board].filter(Boolean).join(" · ");
    if (cls)                  lines.push(`🎓 Class: ${cls}`);
    if (t.mode)               lines.push(`💼 Mode: ${t.mode}`);
    if (t.preferred_time)     lines.push(`🕐 Preferred time: ${t.preferred_time}`);
    if (t.experience_req)     lines.push(`⏳ Experience required: ${t.experience_req}`);
    if (t.tutor_gender_pref)  lines.push(`🧑 Tutor preference: ${t.tutor_gender_pref}`);
    if (t.budget)             lines.push(`💰 Budget: ${t.budget}`);
    if (cityOf(t))            lines.push(`📍 Location: ${cityOf(t)}`);
    if (t.name)               lines.push(`👤 Posted by: ${t.name}`);
    if (t.notes)              lines.push(`📝 ${t.notes}`);
    // (student name, phone & email are deliberately NOT included)
    const text = lines.join("\n") + `\n\nView tuition requirements on AcadHr: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t.subject ? `AcadHr · ${t.subject} Tuition` : "AcadHr Tuition", text, url });
      } else {
        await navigator.clipboard.writeText(text);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 1800);
      }
    } catch (_) { /* cancelled / unavailable — no-op */ }
  }

  return (
    <div className="browse-page" style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="tuitions" />
      <div style={{ paddingTop:90 }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#065F46,#0E7490)", padding:"52px 0 40px" }}>
          <div className="container" style={{ textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", borderRadius:20, padding:"5px 16px", fontSize:13, color:"#A7F3D0", fontWeight:600, marginBottom:16 }}>
              {/* CHANGED (per request): tuition count number removed from this badge. Original kept below:
              📚 {loading ? "..." : tuitions.length.toLocaleString()}+ Tuition Requirements */}
              📚 Tuition Requirements
            </div>
            <h1 style={{ fontSize:38, fontWeight:900, color:"#fff", marginBottom:12 }}>Browse Tuitions</h1>
            <p style={{ color:"#A7F3D0", fontSize:16, marginBottom:28, maxWidth:560, margin:"0 auto 28px" }}>
              Tuition requirements posted by parents — find students to teach across every subject and grade
            </p>
            <div style={{ display:"flex", gap:0, maxWidth:520, margin:"0 auto", background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
              <input
                style={{ flex:1, border:"none", outline:"none", padding:"14px 18px", fontSize:14, fontFamily:"Nunito,sans-serif" }}
                placeholder="Search by subject, class, board or city..."
                value={filter.search}
                onChange={e => setFilter(f => ({...f, search:e.target.value}))}
              />
              <button style={{ background:"#0E7490", color:"#fff", border:"none", padding:"0 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Search</button>
            </div>
          </div>
        </div>

        <div className="container browse-layout" style={{ padding:"32px 0 60px" }}>

          {/* Mobile filter toggle */}
          <button className="browse-filter-toggle" onClick={() => setShowFilters(s => !s)}
            style={{ display:"none", alignItems:"center", justifyContent:"center", gap:8, width:"100%", marginBottom:16, background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"11px 16px", fontSize:14, fontWeight:700, color:"#374151", cursor:"pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>

          {/* Left side filters */}
          <aside className={`browse-sidebar${showFilters ? " open" : ""}`}>
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E5E7EB", padding:"18px 18px 6px", position:"sticky", top:100 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontWeight:800, fontSize:15, color:"#111827" }}>Filters</span>
                {activeFilterCount > 0 && (
                  <button onClick={() => setFilter({ subject:"All", mode:"All", city:"All", search:"" })}
                    style={{ border:"none", background:"none", color:"#DC2626", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>
                    Clear ✕
                  </button>
                )}
              </div>
              {[
                { key:"subject", label:"Subject", options:SUBJECTS },
                { key:"mode",    label:"Mode",    options:MODES    },
                { key:"city",    label:"City",    options:CITIES   },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:18 }}>
                  <div style={{ fontSize:11.5, fontWeight:800, color:"#6B7280", textTransform:"uppercase", letterSpacing:.6, marginBottom:8 }}>{f.label}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:2, maxHeight:190, overflowY:"auto", paddingRight:4 }}>
                    {f.options.map(o => (
                      <label key={o}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:7, cursor:"pointer", fontSize:13.5,
                          color: filter[f.key]===o ? "#0E7490" : "#374151", fontWeight: filter[f.key]===o ? 700 : 500,
                          background: filter[f.key]===o ? "#ECFEFF" : "transparent" }}>
                        <input type="radio" name={`tuition-${f.key}`} checked={filter[f.key]===o}
                          onChange={() => setFilter(prev => ({...prev, [f.key]:o}))}
                          style={{ accentColor:"#0E7490", width:14, height:14, flexShrink:0 }} />
                        {o}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="browse-main">

          {/* CHANGED (per request): "N tuitions found" count removed. Original kept below so it can be re-enabled:
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <span style={{ fontSize:13, color:"#6B7280", fontWeight:600 }}>
              {filtered.length} tuition{filtered.length!==1?"s":""} found
            </span>
          </div>
          */}

          {error && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"14px 18px", marginBottom:20, color:"#DC2626", fontWeight:600, fontSize:14 }}>
              ❌ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#6B7280" }}>
              <div style={{ width:44, height:44, border:"3px solid #E5E7EB", borderTopColor:"#0E7490", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
              <div style={{ fontWeight:600, fontSize:15 }}>Fetching tuitions from database...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:8 }}>
                {tuitions.length === 0 ? "No tuitions posted yet" : "No tuitions match filters"}
              </h3>
              <p style={{ color:"#6B7280", fontSize:14 }}>
                {tuitions.length === 0 ? "Tuition requirements posted by parents will appear here." : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <div className="responsive-grid-3" style={{ display:"grid", gap:20, alignItems:"stretch" }}>
              {filtered.map(t => {
                const sub  = [t.student_class, t.board].filter(Boolean).join(" · ");
                return (
                <div key={t.id}
                  style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:24, transition:"all .2s", height:"100%", display:"flex", flexDirection:"column", boxSizing:"border-box" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(14,116,144,.12)"; e.currentTarget.style.borderColor="#67E8F9"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.transform="none"; }}>

                  <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14 }}>
                    <div style={{ width:54, height:54, borderRadius:14, background:"#ECFEFF", border:"2px solid #A5F3FC", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
                      {iconFor(t.subject)}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:16, color:"#111827" }}>{t.subject ? capList(t.subject, 3) : "Tuition Required"}</div>
                      {sub && <div style={{ fontSize:12, color:"#0E7490", fontWeight:600, marginTop:2 }}>{sub}</div>}
                      <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>Posted by {t.name || "a parent"}</div>
                    </div>
                    {user && (
                      <button onClick={(e) => shareTuition(t, e)} title="Share this requirement"
                        style={{ flexShrink:0, display:"inline-flex", alignItems:"center", gap:4, background:"#ECFEFF", color:"#0E7490", border:"1px solid #A5F3FC", borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:700, cursor:"pointer", lineHeight:1.4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></svg>
                        Share
                      </button>
                    )}
                    <span style={{ background:"#ECFDF5", color:"#059669", border:"1px solid #A7F3D0", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, flexShrink:0 }}>
                      {t.status || "Open"}
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {cityOf(t)         && <span style={{ background:"#F3F4F6", color:"#374151", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>📍 {cityOf(t)}</span>}
                    {t.mode            && <span style={{ background:"#E0F2FE", color:"#0369A1", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>
                      {t.mode === "Online" ? "💻" : t.mode === "Offline" ? "🏠" : "🔄"} {t.mode}
                    </span>}
                    {t.preferred_time  && <span style={{ background:"#F0FDFA", color:"#0E7490", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>🕐 {t.preferred_time}</span>}
                    {t.experience_req  && <span style={{ background:"#FFF7ED", color:"#C2410C", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>⏳ {t.experience_req}</span>}
                    {t.tutor_gender_pref && <span style={{ background:"#FDF2F8", color:"#DB2777", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>👤 {t.tutor_gender_pref}</span>}
                  </div>

                  {/* Details — ADDED (per request): same row format as the Browse Teachers / Tutors cards.
                      Every row always shows ("—" when blank) and long lists are capped at 3 items. */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
                    {[
                      ["Subject",        t.subject, 3],
                      ["Class / Grade",  t.student_class, 3],
                      ["Board",          t.board, 3],
                      ["Location",       t.location || t.user_city, 3],
                      ["Preferred Time", t.preferred_time, 0],
                    ].map(([label, value, cap]) => (
                      <div key={label} style={{ display:"flex", gap:8, fontSize:12, lineHeight:1.4 }}>
                        <span style={{ flexShrink:0, color:"#9CA3AF", fontWeight:700, minWidth:96 }}>{label}</span>
                        <span style={{ color:"#374151", fontWeight:600, wordBreak:"break-word" }}>{capList(value, cap)}</span>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    t.budget && (
                      <div style={{ fontWeight:800, fontSize:16, color:"#059669", marginBottom:t.notes?10:14 }}>
                        💰 {t.budget}
                      </div>
                    )
                  ) : (
                    <div style={{ fontWeight:700, fontSize:13, color:"#9CA3AF", marginBottom:t.notes?10:14 }}>
                      🔒 Login to view budget
                    </div>
                  )}

                  {t.notes && (
                    <p style={{ fontSize:12, color:"#6B7280", marginBottom:14, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                      “{t.notes}”
                    </p>
                  )}

                  <button
                    style={{ width:"100%", padding:"9px 0", borderRadius:10, border:"1.5px solid #A5F3FC", background:"#ECFEFF", color:"#0E7490", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .15s", marginTop:"auto" }}
                    onClick={() => user ? setSelected(t) : setPage("signup")}
                    onMouseEnter={e => { e.currentTarget.style.background="#0E7490"; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#ECFEFF"; e.currentTarget.style.color="#0E7490"; }}>
                    {user ? "View Details →" : "Respond to Request →"}
                  </button>
                </div>
              );})}
            </div>
          )}
          </div>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:16, backdropFilter:"blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.25)" }}>
            <div style={{ background:"linear-gradient(135deg,#047857,#059669)", padding:"22px 26px", borderRadius:"20px 20px 0 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ color:"#A7F3D0", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>Tuition Requirement</div>
                <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{selected.subject || "Tuition Request"}</div>
                <div style={{ color:"#D1FAE5", fontSize:13, marginTop:2 }}>{selected.student_class || ""}{selected.location ? ` - ${selected.location}` : ""}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
            </div>
            <div style={{ padding:"22px 26px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Parent Name", selected.name], ["Contact Email", selected.email],
                ["Phone", selected.phone], ["Student Name", selected.student_name],
                ["Class / Grade", selected.student_class], ["Board", selected.board],
                ["Subject(s)", selected.subject], ["Location", selected.location],
                ["Mode", selected.mode], ["Preferred Time", selected.preferred_time],
                ["Budget", selected.budget], ["Tutor Gender", selected.tutor_gender_pref],
                ["Experience Required", selected.experience_req],
              ].map(([label, value]) => value ? (
                <div key={label} style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13.5, color:"#111827", fontWeight:600, wordBreak:"break-word" }}>{value}</div>
                </div>
              ) : null)}
              {selected.notes && (
                <div style={{ gridColumn:"1/-1", background:"#F9FAFB", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>Notes</div>
                  <div style={{ fontSize:13.5, color:"#111827", fontWeight:600 }}>{selected.notes}</div>
                </div>
              )}
            </div>
            <div style={{ padding:"0 26px 22px", textAlign:"right" }}>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {shareToast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#111827", color:"#fff", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:99999, boxShadow:"0 8px 24px rgba(0,0,0,.25)" }}>
          ✓ Tuition details copied to clipboard
        </div>
      )}
    </div>
  );
}