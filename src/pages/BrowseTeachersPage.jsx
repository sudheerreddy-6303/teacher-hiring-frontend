import { useState, useEffect } from "react";
import { Navbar } from "../components/common/Shared";
import { useAuth } from "../context/AuthContext";
import apiBase from "../config/apiBase";

const SUBJECTS  = ["All","Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Zoology"];
const CITIES    = ["All","Hyderabad","Delhi","Mumbai","Bangalore","Chennai","Pune","Kolkata","Ahmedabad","Visakhapatnam","Vijayawada"];
const EXPS      = ["All","Fresher","Less than 1 Year","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years"];
const MODES     = ["All","Full-time","Part-time","Online","Home Tuition"];

export default function BrowseTeachersPage({ setPage }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [shareToast, setShareToast] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState({ subject:"All", city:"All", experience:"All", mode:"All", search:"" });

  const API = apiBase();

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API}/admin/public/teachers`)
      .then(r => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(data => {
        setTeachers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not load teachers. Please try again.");
        setLoading(false);
      });
  }, []);

  const filtered = teachers.filter(t =>
    (filter.subject === "All"    || (t.specialization||"").toLowerCase().includes(filter.subject.toLowerCase())) &&
    (filter.city    === "All"    || (t.city||"").toLowerCase().includes(filter.city.toLowerCase())) &&
    (filter.experience === "All" || t.total_experience === filter.experience) &&
    (filter.mode === "All"       || (t.work_mode||"").toLowerCase().includes(filter.mode.toLowerCase()) ||
                                    (t.teaching_mode||"").toLowerCase().includes(filter.mode.toLowerCase())) &&
    (!filter.search || t.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
                       (t.specialization||"").toLowerCase().includes(filter.search.toLowerCase()) ||
                       (t.current_role||"").toLowerCase().includes(filter.search.toLowerCase()))
  );

  // Share a teacher's details — everything EXCEPT phone & email
  async function shareTeacher(t, e) {
    if (e) e.stopPropagation();
    const url = window.location.origin;
    const lines = [];
    if (t.name)               lines.push(`👤 ${t.name}`);
    const role = t.specialization || t.current_role;
    if (role)                 lines.push(`🎯 ${role}`);
    if (t.current_org)        lines.push(`🏫 ${t.current_org}`);
    if (t.subjects || t.specialization) lines.push(`📚 Subjects: ${t.subjects || t.specialization}`);
    if (t.qualification)      lines.push(`🎓 Qualification: ${t.qualification}`);
    if (t.total_experience)   lines.push(`⏳ Experience: ${t.total_experience}`);
    if (t.work_mode)          lines.push(`💼 Mode: ${t.work_mode}`);
    if (t.current_location || t.city) lines.push(`📍 Location: ${t.current_location || t.city}`);
    if (t.gender)             lines.push(`🧑 Gender: ${t.gender}`);
    // (phone & email are deliberately NOT included)
    const text = lines.join("\n") + `\n\nFind teachers on AcadHr: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t.name ? `AcadHr · ${t.name}` : "AcadHr Teacher", text, url });
      } else {
        await navigator.clipboard.writeText(text);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 1800);
      }
    } catch (_) { /* cancelled / unavailable — no-op */ }
  }

  return (
    <div className="browse-page" style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="teachers" />
      <div style={{ paddingTop:90 }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#1E3A8A,#1A56DB)", padding:"52px 0 40px" }}>
          <div className="container" style={{ textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", borderRadius:20, padding:"5px 16px", fontSize:13, color:"#BAE6FD", fontWeight:600, marginBottom:16 }}>
              👩‍🏫 {loading ? "..." : teachers.length.toLocaleString()}+ Verified Teachers
            </div>
            <h1 style={{ fontSize:38, fontWeight:900, color:"#fff", marginBottom:12 }}>Browse Qualified Teachers</h1>
            <p style={{ color:"#93C5FD", fontSize:16, marginBottom:28, maxWidth:520, margin:"0 auto 28px" }}>
              Find verified, experienced teachers for your school or coaching institute
            </p>
            <div style={{ display:"flex", gap:0, maxWidth:520, margin:"0 auto", background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
              <input
                style={{ flex:1, border:"none", outline:"none", padding:"14px 18px", fontSize:14, fontFamily:"Nunito,sans-serif" }}
                placeholder="Search by name, subject or qualification..."
                value={filter.search}
                onChange={e => setFilter(f => ({...f, search:e.target.value}))}
              />
              <button style={{ background:"#1A56DB", color:"#fff", border:"none", padding:"0 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Search</button>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding:"32px 0 60px" }}>
          {/* Filters */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24, background:"#fff", padding:"16px 20px", borderRadius:12, border:"1px solid #E5E7EB" }}>
            {[
              { key:"subject",    label:"Subject",    options:SUBJECTS },
              { key:"city",       label:"City",       options:CITIES   },
              { key:"experience", label:"Experience", options:EXPS     },
              { key:"mode",       label:"Work Mode",  options:MODES    },
            ].map(f => (
              <select key={f.key}
                style={{ border:"1px solid #E5E7EB", borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:600, color:"#374151", background:"#F9FAFB", cursor:"pointer" }}
                value={filter[f.key]} onChange={e => setFilter(prev => ({...prev, [f.key]:e.target.value}))}>
                {f.options.map(o => <option key={o} value={o}>{o==="All" ? f.label : o}</option>)}
              </select>
            ))}
            {(filter.subject!=="All"||filter.city!=="All"||filter.experience!=="All"||filter.mode!=="All"||filter.search) && (
              <button onClick={() => setFilter({ subject:"All", city:"All", experience:"All", mode:"All", search:"" })}
                style={{ border:"1px solid #FECACA", borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:600, color:"#DC2626", background:"#FEF2F2", cursor:"pointer" }}>
                Clear ✕
              </button>
            )}
            <span style={{ marginLeft:"auto", fontSize:13, color:"#6B7280", alignSelf:"center", fontWeight:600 }}>
              {filtered.length} teacher{filtered.length!==1?"s":""} found
            </span>
          </div>

          {/* States */}
          {error && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"14px 18px", marginBottom:20, color:"#DC2626", fontWeight:600, fontSize:14 }}>
              ❌ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#6B7280" }}>
              <div style={{ width:44, height:44, border:"3px solid #E5E7EB", borderTopColor:"#1A56DB", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
              <div style={{ fontWeight:600, fontSize:15 }}>Fetching teachers from database...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:8 }}>
                {teachers.length === 0 ? "No teachers registered yet" : "No teachers match filters"}
              </h3>
              <p style={{ color:"#6B7280", fontSize:14 }}>
                {teachers.length === 0 ? "Teachers who register will appear here." : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <div className="responsive-grid-4" style={{ display:"grid", gap:20 }}>
              {filtered.map(t => (
                <div key={t.id}
                  style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:24, transition:"all .2s", cursor:"default" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(26,86,219,.12)"; e.currentTarget.style.borderColor="#93C5FD"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.transform="none"; }}>

                  {/* Photo + Name */}
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                    <div style={{ width:54, height:54, borderRadius:"50%", overflow:"hidden", background:"#EBF5FF", border:"2px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                      {t.profile_photo
                        ? <img src={(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + t.profile_photo} alt={t.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>{t.name}</div>
                      <div style={{ fontSize:12, color:"#1A56DB", fontWeight:600, marginTop:2 }}>{t.specialization || t.current_role || "Educator"}</div>
                      {t.current_org && <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>{t.current_org}</div>}
                    </div>
                    {user && (
                      <button onClick={(e) => shareTeacher(t, e)} title="Share this teacher"
                        style={{ alignSelf:"flex-start", flexShrink:0, display:"inline-flex", alignItems:"center", gap:4, background:"#EBF5FF", color:"#1A56DB", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:700, cursor:"pointer", lineHeight:1.4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></svg>
                        Share
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                    {t.city             && <span style={{ background:"#F3F4F6", color:"#374151", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>📍 {t.city}</span>}
                    {t.total_experience && <span style={{ background:"#EBF5FF", color:"#1A56DB", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>⏳ {t.total_experience}</span>}
                    {t.qualification    && <span style={{ background:"#F5F3FF", color:"#6D28D9", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>🎓 {t.qualification}</span>}
                    {t.work_mode        && <span style={{ background:"#ECFDF5", color:"#059669", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{t.work_mode}</span>}
                  </div>

                  {/* Details */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
                    {[
                      ["Specialization", t.specialization],
                      ["Subjects",       t.subjects],
                      ["Experience",     t.total_experience || t.experience],
                      ["Teaching Mode",  t.teaching_mode],
                      ["Languages",      t.languages],
                      ["Grades",         t.grades_handling],
                      ["Boards",         t.boards_handled],
                      ["Location",       t.current_location || t.city],
                    ].map(([label, value]) => value ? (
                      <div key={label} style={{ display:"flex", gap:8, fontSize:12, lineHeight:1.4 }}>
                        <span style={{ flexShrink:0, color:"#9CA3AF", fontWeight:700, minWidth:96 }}>{label}</span>
                        <span style={{ color:"#374151", fontWeight:600, wordBreak:"break-word" }}>{value}</span>
                      </div>
                    ) : null)}
                  </div>

                  <button
                    style={{ width:"100%", padding:"9px 0", borderRadius:10, border:"1.5px solid #BFDBFE", background:"#EBF5FF", color:"#1A56DB", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .15s" }}
                    onClick={() => user ? setSelected(t) : setPage("signup")}
                    onMouseEnter={e => { e.currentTarget.style.background="#1A56DB"; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#EBF5FF"; e.currentTarget.style.color="#1A56DB"; }}>
                    {user ? "View Profile →" : "Contact Teacher →"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:16, backdropFilter:"blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.25)" }}>
            <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"22px 26px", borderRadius:"20px 20px 0 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ color:"#93C5FD", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>Teacher Profile</div>
                <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{selected.name || selected.full_name}</div>
                <div style={{ color:"#BFDBFE", fontSize:13, marginTop:2 }}>{(selected.specialization || selected.subject || "Teacher")}{(selected.current_location || selected.city) ? ` - ${selected.current_location || selected.city}` : ""}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
            </div>
            <div style={{ padding:"22px 26px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Email", selected.email], ["Phone", selected.phone || selected.mobile],
                ["Specialization", selected.specialization], ["Subjects", selected.subjects],
                ["Qualification", selected.qualification], ["Experience", selected.total_experience || selected.experience],
                ["Current Role", selected.current_role], ["Work Mode", selected.work_mode],
                ["Teaching Mode", selected.teaching_mode], ["Languages", selected.languages],
                ["Grades", selected.grades_handling], ["Boards", selected.boards_handled],
                ["Location", selected.current_location || selected.city], ["Gender", selected.gender],
              ].map(([label, value]) => value ? (
                <div key={label} style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13.5, color:"#111827", fontWeight:600, wordBreak:"break-word" }}>{value}</div>
                </div>
              ) : null)}
            </div>
            <div style={{ padding:"0 26px 22px", textAlign:"right" }}>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {shareToast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#111827", color:"#fff", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:99999, boxShadow:"0 8px 24px rgba(0,0,0,.25)" }}>
          ✓ Teacher details copied to clipboard
        </div>
      )}
    </div>
  );
}