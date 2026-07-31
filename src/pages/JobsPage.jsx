import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/common/Shared";
import apiBase from "../config/apiBase";

const SUBJECTS = ["All","Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Zoology"];
const CITIES   = ["All","Hyderabad","Delhi","Mumbai","Bangalore","Chennai","Pune","Kolkata","Ahmedabad","Visakhapatnam","Vijayawada"];
const JOB_TYPES = ["All","Full-time","Part-time","Home Tuition"];

function JobsPage({ setPage }) {
  const { user } = useAuth();
  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [filter,     setFilter]     = useState({ subject:"", type:"", location:"", search:"" });
  const [selected,   setSelected]   = useState(null);
  const [applied,    setApplied]    = useState([]);
  const [loginAlert, setLoginAlert] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const API = apiBase();

  // ── Fetch from acadhr.jobs ─────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API}/jobs`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Could not connect to backend. Make sure the server is running."); setLoading(false); });
  }, []);

  // ── Filters using exact DB column names ───────────────────────────────────
  const filtered = jobs.filter(j =>
    (!filter.search   || (j.title||"").toLowerCase().includes(filter.search.toLowerCase()) ||
                         (j.institution_name||"").toLowerCase().includes(filter.search.toLowerCase()) ||
                         (j.subject||"").toLowerCase().includes(filter.search.toLowerCase())) &&
    (!filter.subject  || (j.subject||"").toLowerCase().includes(filter.subject.toLowerCase())) &&
    (!filter.type     || (j.job_type||"").toLowerCase().includes(filter.type.toLowerCase()) ||
                         (j.work_mode||"").toLowerCase().includes(filter.type.toLowerCase())) &&
    (!filter.location || (j.location_city||"").toLowerCase().includes(filter.location.toLowerCase()) ||
                         (j.location_state||"").toLowerCase().includes(filter.location.toLowerCase()))
  );

  const activeFilterCount = ["subject","type","location"].filter(k => filter[k]).length
    + (filter.search ? 1 : 0);

  // ── Apply ──────────────────────────────────────────────────────────────────
  function handleApply(job) {
    if (!user) { setLoginAlert(true); return; }
    if (user.role !== "teacher") { alert("Only teachers can apply."); return; }
    const pct = Number(localStorage.getItem("acadhr_teacher_completion") || 0);
    if (pct < 70) {
      alert(`Your profile is ${pct}% complete. Need 70%+ to apply.\nGo to Dashboard → My Profile.`);
      setPage("dashboard");
      return;
    }
    setSelected(job);
    if (!applied.includes(job.id)) setApplied(a => [...a, job.id]);
  }

  // ── Share a job (button visible only after login) ──────────────────────────
  async function shareJob(job, e) {
    if (e) e.stopPropagation();
    const url = window.location.origin;

    // Build the full job details to share — EVERYTHING except the phone number.
    // job.contact_number (the phone) is intentionally left out below.
    const lines = [];
    if (job.title)            lines.push(`📌 ${job.title}`);
    const inst = job.institution_name || job.posted_by_name;
    if (inst)                 lines.push(`🏫 ${inst}${job.institution_type ? " (" + job.institution_type + ")" : ""}`);
    if (job.requirement_id)   lines.push(`🔖 Job ID: ${job.requirement_id}`);
    if (job.subject)          lines.push(`📚 Subject: ${job.subject}`);
    if (job.grades)           lines.push(`📖 Grades: ${job.grades}`);
    if (job.board)            lines.push(`🏷️ Board: ${job.board}`);
    if (job.experience)       lines.push(`🎓 Experience: ${job.experience}`);
    const jtype = [job.job_type, job.work_mode].filter(Boolean).join(" · ");
    if (jtype)                lines.push(`💼 Type: ${jtype}`);
    lines.push(`💰 Salary: ${fmtSalary(job)}`);
    if (job.joining_timeline) lines.push(`📅 Joining: ${job.joining_timeline}`);
    if (Number(job.positions) > 1) lines.push(`👥 Positions: ${job.positions}`);
    const loc = [job.location_city, job.location_state].filter(Boolean).join(", ");
    if (loc)                  lines.push(`📍 Location: ${loc}`);
    if (job.contact_person)   lines.push(`👤 Contact: ${job.contact_person}`);
    if (job.description)      lines.push(`📝 ${job.description}`);
    // (job.contact_number — phone — and job.contact_email are deliberately NOT included)

    const text = lines.join("\n") + `\n\nApply on AcadHr: ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: job.title ? `AcadHr · ${job.title}` : "AcadHr Job", text, url });
      } else {
        await navigator.clipboard.writeText(text);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 1800);
      }
    } catch (_) { /* user cancelled or share unavailable — no-op */ }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function fmtSalary(j) {
    if (j.salary_min && j.salary_max)
      return `₹${Number(j.salary_min).toLocaleString("en-IN")}–₹${Number(j.salary_max).toLocaleString("en-IN")}/mo`;
    if (j.salary_min) return `From ₹${Number(j.salary_min).toLocaleString("en-IN")}/mo`;
    return "Negotiable";
  }

  function statusBadge(status) {
    if (status === "approved") return { label:"✅ Live",    bg:"#ECFDF5", color:"#059669", border:"#A7F3D0" };
    if (status === "pending")  return { label:"⏳ Pending", bg:"#FFFBEB", color:"#D97706", border:"#FDE68A" };
    return                              { label:status,     bg:"#F3F4F6", color:"#6B7280", border:"#E5E7EB" };
  }

  function typeBadge(jt) {
    const l = (jt||"").toLowerCase();
    if (l.includes("part")) return { label:"Part-Time",   bg:"#E0F2FE", color:"#0369A1" };
    if (l.includes("home") || l.includes("tuit")) return { label:"Home Tuition", bg:"#FEF3C7", color:"#B45309" };
    return                          { label:"Full-Time",   bg:"#EBF5FF", color:"#1A56DB" };
  }

  return (
    <div className="browse-page" style={{ paddingTop:66, minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="jobs" />

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#B45309,#EA580C)", padding:"52px 0 40px", position:"relative", overflow:"hidden", minHeight:440 }}>
        <img
          src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&h=1200&fit=crop&w=1200"
          alt="Teacher engaging with students in a classroom"
          className="jobs-hero-illustration"
          style={{ position:"absolute", top:0, right:0, height:"100%", width:"42%", objectFit:"cover" }}
        />
        <div className="container" style={{ position:"relative", zIndex:2 }}>
          <div style={{ textAlign:"left", maxWidth:560 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", borderRadius:20, padding:"5px 16px", fontSize:13, color:"#FFEDD5", fontWeight:600, marginBottom:16 }}>
              {/* CHANGED (per request): job count number removed from this badge. Original kept below:
              💼 {loading ? "..." : jobs.length.toLocaleString()}+ Teaching Jobs */}
              💼 Teaching Jobs
            </div>
            <h1 style={{ fontSize:38, fontWeight:900, color:"#fff", marginBottom:12 }}>Browse Teaching Jobs</h1>
            <p style={{ color:"#FED7AA", fontSize:16, marginBottom:28, maxWidth:520 }}>
              Find verified teaching positions at schools and coaching institutes across India
            </p>
            <div style={{ display:"flex", gap:0, maxWidth:520, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
              <input
                style={{ flex:1, border:"none", outline:"none", padding:"14px 18px", fontSize:14, fontFamily:"Nunito,sans-serif" }}
                placeholder="Search by title, school or subject..."
                value={filter.search}
                onChange={e => setFilter(f => ({...f, search:e.target.value}))}
              />
              <button style={{ background:"#EA580C", color:"#fff", border:"none", padding:"0 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"40px 0 0" }}>
        <div className="container">
          <div className="page-header-row" style={{ marginBottom:16 }}>
            <div>
              <h1 style={{ fontSize:30, fontWeight:900, color:"#111827", marginBottom:5 }}>Browse Teaching Jobs</h1>
              {/* CHANGED (per request): total/live/pending job count numbers removed. Original kept below:
              <p style={{ color:"#6B7280", fontSize:14 }}>
                {loading ? "Loading from acadhr.jobs..." : (
                  <>
                    <strong style={{ color:"#111827" }}>{jobs.length}</strong> total ·{" "}
                    <strong style={{ color:"#059669" }}>{jobs.filter(j=>j.status==="approved").length}</strong> live ·{" "}
                    <strong style={{ color:"#D97706" }}>{jobs.filter(j=>j.status==="pending").length}</strong> pending
                  </>
                )}
              </p>
              */}
            </div>
            {user?.role === "school" && (
              <button className="btn btn-primary" onClick={() => setPage("dashboard")}>+ Post a Job</button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container browse-layout" style={{ paddingTop:32, paddingBottom:72 }}>

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
                <button onClick={() => setFilter({ subject:"", type:"", location:"", search:"" })}
                  style={{ border:"none", background:"none", color:"#DC2626", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>
                  Clear ✕
                </button>
              )}
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11.5, fontWeight:800, color:"#6B7280", textTransform:"uppercase", letterSpacing:.6, marginBottom:8 }}>Search</div>
              <input className="input" placeholder="Title, school or keyword..."
                value={filter.search} onChange={e => setFilter(f => ({...f, search:e.target.value}))} />
            </div>

            {[
              { key:"subject",  label:"Subject",   options:SUBJECTS  },
              { key:"location", label:"City",      options:CITIES    },
              { key:"type",     label:"Job Type",  options:JOB_TYPES },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:18 }}>
                <div style={{ fontSize:11.5, fontWeight:800, color:"#6B7280", textTransform:"uppercase", letterSpacing:.6, marginBottom:8 }}>{f.label}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:2, maxHeight:190, overflowY:"auto", paddingRight:4 }}>
                  {f.options.map(o => {
                    const val = o === "All" ? "" : o;
                    return (
                      <label key={o}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:7, cursor:"pointer", fontSize:13.5,
                          color: filter[f.key]===val ? "#EA580C" : "#374151", fontWeight: filter[f.key]===val ? 700 : 500,
                          background: filter[f.key]===val ? "#FFF7ED" : "transparent" }}>
                        <input type="radio" name={`job-${f.key}`} checked={filter[f.key]===val}
                          onChange={() => setFilter(prev => ({...prev, [f.key]:val}))}
                          style={{ accentColor:"#EA580C", width:14, height:14, flexShrink:0 }} />
                        {o}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="browse-main">

        {loginAlert && (
          <div className="alert a-warn flexb" style={{ marginBottom:20 }}>
            <span>Please log in as a Teacher to apply for jobs.</span>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("login")}>Log In</button>
          </div>
        )}

        {error && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"14px 20px", marginBottom:20, color:"#DC2626", fontWeight:600 }}>
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#6B7280" }}>
            <div style={{ width:44, height:44, border:"3px solid #E5E7EB", borderTopColor:"#1A56DB", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
            <div style={{ fontWeight:600, fontSize:15 }}>Fetching from acadhr.jobs table...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
            <h3 style={{ color:"#111827", marginBottom:8 }}>
              {jobs.length === 0 ? "No jobs in database yet" : "No jobs match your filters"}
            </h3>
            <p style={{ color:"#6B7280", fontSize:14 }}>
              {jobs.length === 0
                ? "Schools need to post jobs. Admin approves them to show as Live."
                : "Try clearing or adjusting your filters"}
            </p>
          </div>
        ) : (
          <>
            {/* CHANGED (per request): "Showing X of Y jobs" count removed. Original kept below:
            <div style={{ fontSize:13, color:"#6B7280", marginBottom:20 }}>
              Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> of <strong style={{ color:"#111827" }}>{jobs.length}</strong> jobs
            </div>
            */}

            <div className="grid3">
              {filtered.map(job => {
                const sb = statusBadge(job.status);
                const tb = typeBadge(job.job_type);
                return (
                  <div key={job.id} style={{ position:"relative" }}>
                    <div className="card jcard card-hover" onClick={() => handleApply(job)} style={{ cursor:"pointer" }}>

                      {/* Top row — icon + badges */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏫</div>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
                          {user && (
                            <button
                              onClick={(e) => shareJob(job, e)}
                              title="Share this job"
                              style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#EBF5FF", color:"#1A56DB", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, cursor:"pointer", lineHeight:1.4 }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
                              </svg>
                              Share
                            </button>
                          )}
                          <span style={{ background:tb.bg, color:tb.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{tb.label}</span>
                          <span style={{ background:sb.bg, color:sb.color, border:`1px solid ${sb.border}`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{sb.label}</span>
                        </div>
                      </div>

                      {/* Title — from jobs.title */}
                      <div style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:4, lineHeight:1.3 }}>
                        {job.title}
                      </div>

                      {/* Institution name — from jobs.institution_name */}
                      <div style={{ fontSize:13, color:"#1A56DB", fontWeight:700, marginBottom:10 }}>
                        {job.institution_name || job.posted_by_name || "Institution"}
                      </div>

                      {/* Details — exact column names */}
                      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:12 }}>
                        {job.location_city    && <span style={{ fontSize:12, color:"#6B7280" }}>📍 {job.location_city}{job.location_state ? `, ${job.location_state}` : ""}</span>}
                        {job.subject          && <span style={{ fontSize:12, color:"#6B7280" }}>📚 {job.subject}</span>}
                        {job.board            && <span style={{ fontSize:12, color:"#6B7280" }}>🏫 Board: {job.board}</span>}
                        {job.grades           && <span style={{ fontSize:12, color:"#6B7280" }}>📖 Grades: {job.grades}</span>}
                        {job.experience       && <span style={{ fontSize:12, color:"#6B7280" }}>🎓 Exp: {job.experience}</span>}
                        {job.joining_timeline && <span style={{ fontSize:12, color:"#6B7280" }}>📅 Joining: {job.joining_timeline}</span>}
                        {job.positions > 1    && <span style={{ fontSize:12, color:"#059669", fontWeight:600 }}>👥 {job.positions} positions</span>}
                      </div>

                      {/* Footer — salary + date */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"1px solid #F3F4F6" }}>
                        <span style={{ fontWeight:800, fontSize:13, color:"#059669" }}>{fmtSalary(job)}</span>
                        <span style={{ fontSize:11, color:"#9CA3AF" }}>
                          {job.created_at ? new Date(job.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "Recent"}
                        </span>
                      </div>

                      {/* Requirement ID */}
                      {job.requirement_id && (
                        <div style={{ fontSize:10, color:"#9CA3AF", marginTop:8, fontFamily:"Fira Code,monospace", letterSpacing:.3 }}>
                          🔖 {job.requirement_id}
                        </div>
                      )}
                    </div>

                    {applied.includes(job.id) && (
                      <div style={{ position:"absolute", top:14, right:14 }}>
                        <span className="badge bgreen">✓ Applied</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        </div>
      </div>

      {/* Apply success modal */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign:"center", padding:"10px 0 22px" }}>
              <div style={{ fontSize:58, marginBottom:10 }}>🎉</div>
              <h2 style={{ fontSize:22, marginBottom:6 }}>Application Submitted!</h2>
              <p style={{ color:"#6B7280", fontSize:14 }}>
                Your application for <strong>{selected.title}</strong> at{" "}
                <strong style={{ color:"#1A56DB" }}>{selected.institution_name || selected.posted_by_name}</strong> has been sent.
              </p>
            </div>
            <div className="alert a-ok">The school will review your profile and reach out if shortlisted.</div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }}
                onClick={() => { setSelected(null); setPage("dashboard"); }}>Go to Dashboard</button>
              <button className="btn btn-outline" style={{ flex:1, justifyContent:"center" }}
                onClick={() => setSelected(null)}>Browse More</button>
            </div>
          </div>
        </div>
      )}

      {/* Share confirmation toast (clipboard fallback) */}
      {shareToast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#111827", color:"#fff", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:99999, boxShadow:"0 8px 24px rgba(0,0,0,.25)" }}>
          ✓ Job link copied to clipboard
        </div>
      )}
    </div>
  );
}

export default JobsPage;