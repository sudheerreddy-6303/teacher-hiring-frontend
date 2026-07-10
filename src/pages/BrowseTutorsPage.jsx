import { useState, useEffect } from "react";
import { Navbar } from "../components/common/Shared";
import { useAuth } from "../context/AuthContext";
import apiBase from "../config/apiBase";

const SUBJECTS = ["All","Mathematics","Physics","Chemistry","Biology","English","Hindi","Computer Science","Economics","Accountancy","Social Science","Zoology"];
const MODES    = ["All","Online","Offline","Both"];
const CITIES   = ["All","Hyderabad","Delhi","Mumbai","Bangalore","Chennai","Pune","Kolkata","Visakhapatnam","Vijayawada"];
const EXPS     = ["All","Fresher","1 Year","2 Years","3 Years","4 Years","5+ Years"];

export default function BrowseTutorsPage({ setPage }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [shareToast, setShareToast] = useState(false);
  const [tutors,  setTutors]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState({ subject:"All", mode:"All", city:"All", experience:"All", search:"" });
  const [showFilters, setShowFilters] = useState(false);

  const API = apiBase();

  // Tutor avatar based on gender — plain monochrome icons (no colour/emoji)
  const tutorIcon = (g, size = 28, color = "#4B5563") => {
    const x = (g || "").toLowerCase();
    const common = { width: size, height: size, viewBox: "0 0 24 24", fill: color, style: { verticalAlign: "middle" } };
    if (x === "female") return (
      <svg {...common} aria-label="Female tutor">
        <circle cx="12" cy="5" r="3" />
        <path d="M12 9c-2.2 0-3.7 1.5-4.3 3.6L6 19h2.4l.5 3h6.2l.5-3H18l-1.7-6.4C15.7 10.5 14.2 9 12 9z" />
      </svg>
    );
    if (x === "male") return (
      <svg {...common} aria-label="Male tutor">
        <circle cx="12" cy="5" r="3" />
        <path d="M9 9c-1.7 0-3 1.3-3 3v5h2v5h8v-5h2v-5c0-1.7-1.3-3-3-3H9z" />
      </svg>
    );
    return (
      <svg {...common} aria-label="Tutor">
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7v1H4v-1z" />
      </svg>
    );
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API}/admin/public/tutors`)
      .then(r => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(data => {
        setTutors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load tutors. Please try again.");
        setLoading(false);
      });
  }, []);

  const filtered = tutors.filter(t =>
    (filter.subject === "All"    || (t.subject||"").toLowerCase().includes(filter.subject.toLowerCase())) &&
    (filter.mode    === "All"    || (t.teaching_mode||"") === filter.mode) &&
    (filter.city    === "All"    || (t.city||"").toLowerCase().includes(filter.city.toLowerCase())) &&
    (filter.experience === "All" || (t.experience||"").includes(filter.experience)) &&
    (!filter.search || t.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
                       (t.subject||"").toLowerCase().includes(filter.search.toLowerCase()) ||
                       (t.qualification||"").toLowerCase().includes(filter.search.toLowerCase()))
  );

  const activeFilterCount = ["subject","mode","city","experience"].filter(k => filter[k] !== "All").length
    + (filter.search ? 1 : 0);

  // Share a tutor's details — everything EXCEPT phone & email
  async function shareTutor(t, e) {
    if (e) e.stopPropagation();
    const url = window.location.origin;
    const lines = [];
    if (t.name)               lines.push(`👤 ${t.name}`);
    if (t.subjects || t.subject) lines.push(`📚 Subjects: ${t.subjects || t.subject}`);
    if (t.qualifications || t.qualification) lines.push(`🎓 Qualification: ${t.qualifications || t.qualification}`);
    if (t.experience)         lines.push(`⏳ Experience: ${t.experience}`);
    if (t.teaching_mode)      lines.push(`💼 Mode: ${t.teaching_mode}`);
    if (t.hourly_rate)        lines.push(`💰 Rate: ${t.hourly_rate}`);
    if (t.location || t.city) lines.push(`📍 Location: ${t.location || t.city}`);
    if (t.gender)             lines.push(`🧑 Gender: ${t.gender}`);
    // (phone & email are deliberately NOT included)
    const text = lines.join("\n") + `\n\nFind tutors on AcadHr: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t.name ? `AcadHr · ${t.name}` : "AcadHr Tutor", text, url });
      } else {
        await navigator.clipboard.writeText(text);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 1800);
      }
    } catch (_) { /* cancelled / unavailable — no-op */ }
  }

  return (
    <div className="browse-page" style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="tutors" />
      <div style={{ paddingTop:90 }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#4C1D95,#6D28D9)", padding:"52px 0 40px" }}>
          <div className="container" style={{ textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", borderRadius:20, padding:"5px 16px", fontSize:13, color:"#DDD6FE", fontWeight:600, marginBottom:16 }}>
              🧑‍🎓 {loading ? "..." : tutors.length.toLocaleString()}+ Verified Tutors
            </div>
            <h1 style={{ fontSize:38, fontWeight:900, color:"#fff", marginBottom:12 }}>Find the Perfect Tutor</h1>
            <p style={{ color:"#C4B5FD", fontSize:16, marginBottom:28, maxWidth:520, margin:"0 auto 28px" }}>
              Home tutors, online tutors and coaching experts for every subject and grade
            </p>
            <div style={{ display:"flex", gap:0, maxWidth:520, margin:"0 auto", background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
              <input
                style={{ flex:1, border:"none", outline:"none", padding:"14px 18px", fontSize:14, fontFamily:"Nunito,sans-serif" }}
                placeholder="Search by name, subject or qualification..."
                value={filter.search}
                onChange={e => setFilter(f => ({...f, search:e.target.value}))}
              />
              <button style={{ background:"#6D28D9", color:"#fff", border:"none", padding:"0 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Search</button>
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
                  <button onClick={() => setFilter({ subject:"All", mode:"All", city:"All", experience:"All", search:"" })}
                    style={{ border:"none", background:"none", color:"#DC2626", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>
                    Clear ✕
                  </button>
                )}
              </div>
              {[
                { key:"subject",    label:"Subject",    options:SUBJECTS },
                { key:"mode",       label:"Mode",       options:MODES    },
                { key:"city",       label:"City",       options:CITIES   },
                { key:"experience", label:"Experience", options:EXPS     },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:18 }}>
                  <div style={{ fontSize:11.5, fontWeight:800, color:"#6B7280", textTransform:"uppercase", letterSpacing:.6, marginBottom:8 }}>{f.label}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:2, maxHeight:190, overflowY:"auto", paddingRight:4 }}>
                    {f.options.map(o => (
                      <label key={o}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:7, cursor:"pointer", fontSize:13.5,
                          color: filter[f.key]===o ? "#6D28D9" : "#374151", fontWeight: filter[f.key]===o ? 700 : 500,
                          background: filter[f.key]===o ? "#F5F3FF" : "transparent" }}>
                        <input type="radio" name={`tutor-${f.key}`} checked={filter[f.key]===o}
                          onChange={() => setFilter(prev => ({...prev, [f.key]:o}))}
                          style={{ accentColor:"#6D28D9", width:14, height:14, flexShrink:0 }} />
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

          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <span style={{ fontSize:13, color:"#6B7280", fontWeight:600 }}>
              {filtered.length} tutor{filtered.length!==1?"s":""} found
            </span>
          </div>

          {error && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"14px 18px", marginBottom:20, color:"#DC2626", fontWeight:600, fontSize:14 }}>
              ❌ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#6B7280" }}>
              <div style={{ width:44, height:44, border:"3px solid #E5E7EB", borderTopColor:"#6D28D9", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
              <div style={{ fontWeight:600, fontSize:15 }}>Fetching tutors from database...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:8 }}>
                {tutors.length === 0 ? "No tutors registered yet" : "No tutors match filters"}
              </h3>
              <p style={{ color:"#6B7280", fontSize:14 }}>
                {tutors.length === 0 ? "Tutors who register will appear here." : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <div className="responsive-grid-4" style={{ display:"grid", gap:20 }}>
              {filtered.map(t => (
                <div key={t.id}
                  style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:24, transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(109,40,217,.12)"; e.currentTarget.style.borderColor="#C4B5FD"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.transform="none"; }}>

                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                    <div style={{ width:54, height:54, borderRadius:"50%", background:"#F5F3FF", border:"2px solid #DDD6FE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
                      {tutorIcon("")}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>{t.name}</div>
                      <div style={{ fontSize:12, color:"#6D28D9", fontWeight:600, marginTop:2 }}>{t.subject || "Tutor"}</div>
                      {t.qualification && <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>{t.qualification}</div>}
                    </div>
                    {user && (
                      <button onClick={(e) => shareTutor(t, e)} title="Share this tutor"
                        style={{ alignSelf:"flex-start", flexShrink:0, display:"inline-flex", alignItems:"center", gap:4, background:"#F5F3FF", color:"#6D28D9", border:"1px solid #DDD6FE", borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:700, cursor:"pointer", lineHeight:1.4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></svg>
                        Share
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {t.city          && <span style={{ background:"#F3F4F6", color:"#374151", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>📍 {t.city}</span>}
                    {t.experience    && <span style={{ background:"#F5F3FF", color:"#6D28D9", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>⏳ {t.experience}</span>}
                    {t.teaching_mode && <span style={{ background:"#E0F2FE", color:"#0369A1", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>
                      {t.teaching_mode === "Online" ? "💻" : t.teaching_mode === "Offline" ? "🏠" : "🔄"} {t.teaching_mode}
                    </span>}
                    {t.gender        && <span style={{ background:"#FDF2F8", color:"#DB2777", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>👤 {t.gender}</span>}
                  </div>

                  {/* Details */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
                    {[
                      ["Subjects",       t.subjects || t.subject],
                      ["Qualifications", t.qualifications || t.qualification],
                      ["Experience",     t.experience],
                      ["Teaching Mode",  t.teaching_mode],
                      ["Availability",   t.availability],
                      ["Gender",         t.gender],
                      ["Location",       t.location || t.city],
                      ["Pincode",        t.pincode],
                      ["Address",        t.address],
                      ["Class Link",     t.class_link],
                    ].map(([label, value]) => value ? (
                      <div key={label} style={{ display:"flex", gap:8, fontSize:12, lineHeight:1.4 }}>
                        <span style={{ flexShrink:0, color:"#9CA3AF", fontWeight:700, minWidth:96 }}>{label}</span>
                        <span style={{ color:"#374151", fontWeight:600, wordBreak:"break-word" }}>{value}</span>
                      </div>
                    ) : null)}
                  </div>

                  <button
                    style={{ width:"100%", padding:"9px 0", borderRadius:10, border:"1.5px solid #DDD6FE", background:"#F5F3FF", color:"#6D28D9", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .15s" }}
                    onClick={() => user ? setSelected(t) : setPage("signup")}
                    onMouseEnter={e => { e.currentTarget.style.background="#6D28D9"; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#F5F3FF"; e.currentTarget.style.color="#6D28D9"; }}>
                    {user ? "View Profile →" : "Contact Tutor →"}
                  </button>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:16, backdropFilter:"blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.25)" }}>
            <div style={{ background:"linear-gradient(135deg,#4C1D95,#6D28D9)", padding:"22px 26px", borderRadius:"20px 20px 0 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ color:"#DDD6FE", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>{tutorIcon(selected.gender, 14, "#DDD6FE")} Tutor Profile</div>
                <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{selected.name}</div>
                <div style={{ color:"#C4B5FD", fontSize:13, marginTop:2 }}>{(selected.subjects || selected.subject || "Tutor")}{selected.city ? ` · 📍 ${selected.city}` : ""}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
            </div>
            <div style={{ padding:"22px 26px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Email", selected.email], ["Phone", selected.phone],
                ["Subjects", selected.subjects || selected.subject], ["Qualifications", selected.qualifications || selected.qualification],
                ["Experience", selected.experience], ["Hourly Rate", selected.hourly_rate],
                ["Gender", selected.gender],
                ["Teaching Mode", selected.teaching_mode], ["Availability", selected.availability],
                ["Location", selected.location || selected.city], ["Pincode", selected.pincode],
                ["Address", selected.address], ["Class Link", selected.class_link],
              ].map(([label, value]) => value ? (
                <div key={label} style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13.5, color:"#111827", fontWeight:600, wordBreak:"break-word" }}>{value}</div>
                </div>
              ) : null)}
              {selected.bio && (
                <div style={{ gridColumn:"1/-1", background:"#F9FAFB", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>Bio</div>
                  <div style={{ fontSize:13.5, color:"#111827", fontWeight:600 }}>{selected.bio}</div>
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
          ✓ Tutor details copied to clipboard
        </div>
      )}
    </div>
  );
}