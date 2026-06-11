import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FilterBar, Toast } from "../common/Shared";
import './Admin.css';

/* ═══════════════════════════════════════════════════════════════════════════
   Day-wise registrations & jobs — one individual chart per category, each
   showing the daily numbers and a 7-day total. Self-contained SVG, no deps.
   Uses the existing /admin/analytics data (regTrend + jobTrend).
════════════════════════════════════════════════════════════════════════════ */
function OverviewTrendChart({ analytics }) {
  // Build the last 7 calendar days (oldest → newest)
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const key = (d) => {
    const dt = (d instanceof Date) ? d : new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };

  const regTrend = (analytics && analytics.regTrend) || [];
  const jobTrend = (analytics && analytics.jobTrend) || [];

  const sumFor = (rows, dayKey, roleMatch) =>
    rows.filter(r => key(r.date) === dayKey && (roleMatch ? r.role === roleMatch : true))
        .reduce((acc, r) => acc + Number(r.count || 0), 0);

  const series = [
    { name: "Teachers", title: "Teacher Registrations", icon: "👩‍🏫", color: "#1A56DB", bg: "#EBF5FF", values: days.map(d => sumFor(regTrend, key(d), "teacher")) },
    { name: "Tutors",   title: "Tutor Registrations",   icon: "🧑‍🎓", color: "#6D28D9", bg: "#F5F3FF", values: days.map(d => sumFor(regTrend, key(d), "tutor"))   },
    { name: "Parents",  title: "Parent Registrations",  icon: "👨‍👩‍👧", color: "#D97706", bg: "#FFFBEB", values: days.map(d => sumFor(regTrend, key(d), "parent"))  },
    { name: "Jobs",     title: "Job Postings",          icon: "💼",   color: "#059669", bg: "#ECFDF5", values: days.map(d => sumFor(jobTrend, key(d), null))      },
  ];

  // One individual chart card for a single category
  const renderMini = (s) => {
    const total = s.values.reduce((a, b) => a + b, 0);
    const W = 380, H = 200, padL = 26, padR = 16, padT = 30, padB = 26;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const maxVal = Math.max(1, ...s.values);
    const x = (i) => padL + (plotW * i) / (s.values.length - 1);
    const y = (v) => padT + plotH - (plotH * v) / maxVal;
    const labelFor = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const pts  = s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const area = `${padL},${padT + plotH} ${pts} ${padL + plotW},${padT + plotH}`;
    const hasData = total > 0;
    const gid = `grad-${s.name}`;

    return (
      <div key={s.name} className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{s.title}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1, fontFamily: "Playfair Display,serif" }}>{total}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: .4 }}>added · last 7 days</div>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#EEF2F7" strokeWidth="1" />
          {hasData && <polygon points={area} fill={`url(#${gid})`} />}
          {hasData && <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
          {s.values.map((v, i) => (
            <g key={i}>
              {hasData && <circle cx={x(i)} cy={y(v)} r="3.2" fill="#fff" stroke={s.color} strokeWidth="2" />}
              <text x={x(i)} y={(hasData ? y(v) : padT + plotH) - 9} textAnchor="middle" fontSize="11" fontWeight="700" fill={s.color}>{v}</text>
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#9CA3AF">{labelFor(days[i])}</text>
            </g>
          ))}
          {!hasData && <text x={W / 2} y={padT + plotH / 2} textAnchor="middle" fontSize="12" fill="#9CA3AF">No additions in the last 7 days</text>}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {!analytics ? (
        <div className="card" style={{ padding: 30, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>Loading charts…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {series.map(renderMini)}
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   Analytics tab — combined multi-line registrations trend (last 7 days), one
   line per role. Self-contained SVG, no extra deps. Uses regTrend data.
════════════════════════════════════════════════════════════════════════════ */
function AnalyticsRegChart({ regTrend }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const key = (d) => {
    const dt = (d instanceof Date) ? d : new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };
  const rows = regTrend || [];
  const sumFor = (dayKey, role) =>
    rows.filter(r => key(r.date) === dayKey && r.role === role).reduce((a, r) => a + Number(r.count || 0), 0);

  const roles = [
    { role: "teacher", label: "Teachers", color: "#1A56DB" },
    { role: "tutor",   label: "Tutors",   color: "#6D28D9" },
    { role: "parent",  label: "Parents",  color: "#D97706" },
    { role: "school",  label: "Schools",  color: "#0EA5E9" },
  ];
  const series = roles.map(r => ({ ...r, values: days.map(d => sumFor(key(d), r.role)) }));

  const W = 760, H = 300, padL = 36, padR = 18, padT = 20, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxVal = Math.max(1, ...series.flatMap(s => s.values));
  const yTicks = 4;
  const x = (i) => padL + (plotW * i) / (days.length - 1);
  const y = (v) => padT + plotH - (plotH * v) / maxVal;
  const labelFor = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const hasData = series.some(s => s.values.some(v => v > 0));

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
        {series.map(s => (
          <div key={s.role} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 700 }}>{s.label} ({s.values.reduce((a, b) => a + b, 0)})</span>
          </div>
        ))}
      </div>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 520, display: "block" }} preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const val = Math.round((maxVal * (yTicks - i)) / yTicks);
            const yy = padT + (plotH * i) / yTicks;
            return (
              <g key={i}>
                <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="#EEF2F7" strokeWidth="1" />
                <text x={padL - 8} y={yy + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{val}</text>
              </g>
            );
          })}
          {days.map((d, i) => (
            <text key={i} x={x(i)} y={H - padB + 20} textAnchor="middle" fontSize="11" fill="#6B7280">{labelFor(d)}</text>
          ))}
          {hasData && series.map(s => {
            const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
            return (
              <g key={s.role}>
                <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {s.values.map((v, i) => (
                  <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2">
                    <title>{`${s.label} · ${labelFor(days[i])}: ${v}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
          {!hasData && (
            <text x={W / 2} y={padT + plotH / 2} textAnchor="middle" fontSize="13" fill="#9CA3AF">No registrations in the last 7 days yet</text>
          )}
        </svg>
      </div>
    </div>
  );
}

function AdminDashboard({ setPage }) {
  const { logout } = useAuth();
  const [tab, setTab]   = useState("overview");
  const [toast, setToast] = useState("");
  const showToast = m => { setToast(m); setTimeout(() => setToast(""), 3500); };

  // ── Data state ──────────────────────────────────────────────────────────────
  const [stats,     setStats]     = useState(null);
  const [teachers,  setTeachers]  = useState([]);
  const [tutors,    setTutors]    = useState([]);
  const [schools,   setSchools]   = useState([]);
  const [allJobs,   setAllJobs]   = useState([]);
  const [pending,   setPending]   = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [parents,   setParents]   = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading,   setLoading]   = useState({});

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const API_ORIGIN = API.replace(/\/api\/?$/, "");
  const token = localStorage.getItem("acadhr_token");
  const hdr = token ? { Authorization: "Bearer " + token } : {};

  async function fetchData(key, url, setter) {
    setLoading(l => ({...l, [key]:true}));
    try {
      const r = await fetch(API + url, { headers: hdr });
      const d = await r.json();
      if (r.ok) setter(d);
      else showToast("Error: " + d.message);
    } catch (e) { showToast("Network error: " + e.message); }
    finally { setLoading(l => ({...l, [key]:false})); }
  }

  // Load stats on mount
  useEffect(() => {
    fetchData("stats",    "/admin/stats",    setStats);
    fetchData("pending",  "/admin/pending-jobs", setPending);
    fetchData("analytics", "/admin/analytics", setAnalytics);
  }, []);

  // Load tab-specific data on tab change
  useEffect(() => {
    if (tab === "teachers"  && teachers.length  === 0) fetchData("teachers",  "/admin/teachers",  setTeachers);
    if (tab === "tutors"    && tutors.length    === 0) fetchData("tutors",    "/admin/tutors",    setTutors);
    if (tab === "schools"   && schools.length   === 0) fetchData("schools",   "/admin/schools",   setSchools);
    if (tab === "jobs"      && allJobs.length   === 0) fetchData("jobs",      "/admin/all-jobs",  setAllJobs);
    if (tab === "analytics" && !analytics)             fetchData("analytics", "/admin/analytics", setAnalytics);
    if (tab === "parents"   && parents.length   === 0) fetchData("parents",   "/admin/parents",   setParents);
    if (tab === "feedbacks" && feedbacks.length === 0) fetchData("feedbacks", "/feedback",        setFeedbacks);
  }, [tab]);

  async function approveJob(job) {
    try {
      const r = await fetch(API + `/admin/jobs/${job.id}`, { method:"PATCH", headers:{...hdr,"Content-Type":"application/json"}, body: JSON.stringify({ action:"approve" }) });
      if (r.ok) { setPending(p => p.filter(j => j.id !== job.id)); setAllJobs([]); fetchData("stats","/admin/stats",setStats); showToast("✅ Job approved and published!"); }
    } catch(e) { showToast("Error: " + e.message); }
  }
  async function rejectJob(id) {
    try {
      const r = await fetch(API + `/admin/jobs/${id}`, { method:"PATCH", headers:{...hdr,"Content-Type":"application/json"}, body: JSON.stringify({ action:"reject" }) });
      if (r.ok) { setPending(p => p.filter(j => j.id !== id)); showToast("Job rejected."); }
    } catch(e) { showToast("Error: " + e.message); }
  }
  async function toggleUser(id) {
    try {
      await fetch(API + `/admin/users/${id}/toggle`, { method:"PATCH", headers: hdr });
      setTeachers(t => t.map(u => u.id===id ? {...u, is_active: u.is_active ? 0 : 1} : u));
      setTutors(t   => t.map(u => u.id===id ? {...u, is_active: u.is_active ? 0 : 1} : u));
      setSchools(t  => t.map(u => u.id===id ? {...u, is_active: u.is_active ? 0 : 1} : u));
      setParents(t  => t.map(u => u.id===id ? {...u, is_active: u.is_active ? 0 : 1} : u));
      showToast("User status updated.");
    } catch(e) { showToast("Error: " + e.message); }
  }

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [teacherFilters, setTeacherFilters] = useState({ name:"", email:"", specialization:"", city:"", total_experience:"", status:"" });
  const [tutorFilters,   setTutorFilters]   = useState({ name:"", email:"", subject:"", city:"", teaching_mode:"", status:"" });
  const [schoolFilters,  setSchoolFilters]  = useState({ name:"", email:"", city:"", institute_type:"", status:"" });
  const [parentFilters,  setParentFilters]  = useState({ name:"", email:"", student_class:"", board:"", subject:"", status:"" });
  const [jobFilters,     setJobFilters]     = useState({ title:"", institute_name:"", subject:"", location_city:"", status:"", requirement_type:"" });
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSchool,  setSelectedSchool]  = useState(null);
  const [selectedTutor,   setSelectedTutor]   = useState(null);
  const [selectedParent,  setSelectedParent]  = useState(null);

  const MENU = [
    { id:"overview",   icon:"📊", label:"Overview" },
    { id:"pending",    icon:"⏳", label:"Pending Review", badge: pending.length },
    { id:"jobs",       icon:"💼", label:"All Positions" },
    { id:"schools",    icon:"🏫", label:"Schools / Institutions" },
    { id:"teachers",   icon:"👩‍🏫", label:"Teachers" },
    { id:"tutors",     icon:"🧑‍🎓", label:"Tutors" },
    { id:"parents",    icon:"👨‍👩‍👧", label:"Parents" },
    { id:"payments",   icon:"💳", label:"Payments" },
    { id:"analytics",  icon:"📈", label:"Analytics" },
    { id:"feedbacks",  icon:"💬", label:"Feedbacks" },
  ];

  function Loader() {
    return <div style={{ textAlign:"center", padding:"60px 0", color:"#9CA3AF" }}>
      <div style={{ width:36,height:36,border:"3px solid #E5E7EB",borderTopColor:"#1A56DB",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 14px" }} />
      <div style={{ fontWeight:600, fontSize:14 }}>Loading from database...</div>
    </div>;
  }

  function StatusBadge({ active }) {
    return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
      background: active ? "#ECFDF5" : "#FEF2F2",
      color:      active ? "#059669" : "#DC2626",
      border:     `1px solid ${active ? "#A7F3D0" : "#FECACA"}` }}>
      {active ? "● Active" : "● Inactive"}
    </span>;
  }

  const [navOpen, setNavOpen] = useState(false);
  return (
    <div style={{ display:"flex", width:"100vw", minHeight:"100vh" }}>
      {/* Mobile nav toggle + backdrop */}
      <button className="mobile-nav-toggle" aria-label="Menu" onClick={() => setNavOpen(o => !o)}>{navOpen ? "✕" : "☰"}</button>
      <div className={"sidebar-backdrop" + (navOpen ? " show" : "")} onClick={() => setNavOpen(false)} />
      {/* ── Sidebar ── */}
      <div className={"sidebar" + (navOpen ? " open" : "")} onClick={() => setNavOpen(false)}>
        <div className="sidebar-header">
          <div style={{ cursor:"pointer" }} onClick={() => setPage("home")}>
            <img src="/acadhr-logo.png" alt="AcadHr" style={{ height:48, objectFit:"contain" }} />
          </div>
          <div style={{ fontSize:10, color:"#93C5FD", marginTop:5, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5 }}>Admin Console</div>
        </div>
        <div className="sidebar-sec">Navigation</div>
        {MENU.map(m => (
          <div key={m.id} className={"s-item" + (tab===m.id?" active":"")} onClick={() => setTab(m.id)}>
            <span style={{ fontSize:16 }}>{m.icon}</span>
            {m.label}
            {m.badge > 0 && <span className="s-badge">{m.badge}</span>}
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:"20px 0" }}>
          <div className="sidebar-sec">Account</div>
          <div className="s-item" onClick={() => setPage("home")}>🏠 Back to Site</div>
          <div className="s-item" onClick={logout}>🚪 Logout</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="main">
        {toast && <Toast msg={toast} />}

        {/* ══ OVERVIEW ══ */}
        {tab==="overview" && (
          <div className="fadeUp">
            <div className="page-title">Admin Dashboard</div>
            <div className="page-sub">Live platform overview — all data from database</div>

            {/* Stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, marginBottom:26 }}>
              {[
                { label:"Teachers",        value: stats?.teachers        ?? "...", icon:"👩‍🏫", color:"#1A56DB", bg:"#EBF5FF", tab:"teachers"  },
                { label:"Tutors",          value: stats?.tutors          ?? "...", icon:"🧑‍🎓", color:"#6D28D9", bg:"#F5F3FF", tab:"tutors"    },
                { label:"Institutions",    value: stats?.schools         ?? "...", icon:"🏫",   color:"#0EA5E9", bg:"#E0F2FE", tab:"schools"   },
                { label:"Active Jobs",     value: stats?.activeJobs      ?? "...", icon:"💼",   color:"#059669", bg:"#ECFDF5", tab:"jobs"      },
                { label:"Pending Review",  value: stats?.pendingJobs     ?? "...", icon:"⏳",   color:"#D97706", bg:"#FFFBEB", tab:"pending"   },
                { label:"Applications",    value: stats?.totalApplications?? "...", icon:"📋", color:"#DC2626", bg:"#FEF2F2", tab:"jobs"      },
                { label:"Payments",        value: "₹0",                            icon:"💳",   color:"#059669", bg:"#ECFDF5", tab:"payments"  },
                { label:"Parents",         value: "0",                             icon:"👨‍👩‍👧", color:"#D97706", bg:"#FFFBEB", tab:"parents"   },
              ].map(s => (
                <div key={s.label} onClick={() => setTab(s.tab)}
                  style={{ background:s.bg, border:`1px solid ${s.color}30`, borderRadius:14, padding:"20px 18px", cursor:"pointer", transition:"transform .18s, box-shadow .18s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.10)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:"Playfair Display,serif", lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"#6B7280", fontWeight:700, marginTop:5, textTransform:"uppercase", letterSpacing:.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Day-wise additions line graph */}
            <OverviewTrendChart analytics={analytics} />

            {/* Pending jobs preview */}
            {pending.length > 0 && (
              <div className="card" style={{ padding:24, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontSize:16, fontWeight:800 }}>⏳ Pending Approvals ({pending.length})</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setTab("pending")}>Review All →</button>
                </div>
                {pending.slice(0,3).map((j,i) => (
                  <div key={j.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<2?"1px solid #F3F4F6":"none" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{j.title}</div>
                      <div style={{ fontSize:12, color:"#9CA3AF" }}>{j.institute_name} · {j.posted_by_email}</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="btn btn-success btn-sm" onClick={() => approveJob(j)}>✓ Approve</button>
                      <button className="btn btn-danger btn-sm"  onClick={() => rejectJob(j.id)}>✕ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent registrations */}
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>👥 Recent Registrations</h3>
              {[...teachers.slice(0,3), ...schools.slice(0,2)].length === 0 ? (
                <div style={{ color:"#9CA3AF", fontSize:13 }}>Click Teachers or Schools tab to load data</div>
              ) : (
                [...teachers.slice(0,3), ...schools.slice(0,2)].map((u,i) => (
                  <div key={u.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #F3F4F6" }}>
                    <div>
                      <span style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{u.name}</span>
                      <span className={"badge b"+(u.role==="teacher"?"blue":"sky")} style={{ marginLeft:8, fontSize:10 }}>{u.role||"teacher"}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#9CA3AF" }}>{u.email}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ══ PENDING REVIEW ══ */}
        {tab==="pending" && (
          <div className="fadeUp">
            <div className="page-title">Pending Approvals</div>
            <div className="page-sub">{pending.length} job{pending.length!==1?"s":""} awaiting review — click any card to view full details</div>
            {loading.pending ? <Loader /> : pending.length === 0 ? (
              <div className="card" style={{ padding:64, textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
                <h3>All Clear!</h3>
                <p style={{ color:"#6B7280", marginTop:8 }}>No pending approvals.</p>
              </div>
            ) : pending.map(job => (
              <div key={job.id} className="card" style={{ padding:24, marginBottom:14, cursor:"pointer", transition:"box-shadow .18s, border-color .18s" }}
                onClick={() => setSelectedJob(job)}
                onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(26,86,219,.13)"; e.currentTarget.style.borderColor="#93C5FD"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="#E5E7EB"; }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
                  <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:48,height:48,background:"#EBF5FF",border:"1px solid #BFDBFE",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>🏫</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:800, color:"#111827", marginBottom:3 }}>{job.title}</div>
                      <div style={{ color:"#1A56DB", fontSize:13, fontWeight:600 }}>{job.institute_name} · {job.location_city||job.location||"—"}</div>
                      <div style={{ fontSize:11, color:"#9CA3AF", marginTop:3 }}>
                        By {job.posted_by_email} · {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10 }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm" style={{ color:"#1A56DB", borderColor:"#BFDBFE" }} onClick={() => setSelectedJob(job)}>👁 View Details</button>
                    <button className="btn btn-success btn-sm" onClick={() => approveJob(job)}>✓ Approve</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => rejectJob(job.id)}>✕ Reject</button>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
                  {job.requirement_id && <span style={{ fontFamily:"Fira Code,monospace", fontSize:11, fontWeight:700, color:"#059669", background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:6, padding:"2px 8px" }}>🔖 {job.requirement_id}</span>}
                  <span className="badge bblue">{job.job_type||job.work_mode||"Full-time"}</span>
                  {job.salary_min && <span className="badge bgreen">₹{Number(job.salary_min).toLocaleString()}–₹{Number(job.salary_max).toLocaleString()}/mo</span>}
                  {job.subject && <span className="badge bgray">📚 {job.subject}</span>}
                  {job.grades && <span className="badge bgray">🎓 {job.grades}</span>}
                  <span className="badge bamber">⏳ Pending</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ JOB DETAIL MODAL ══ */}
        {selectedJob && (
          <div className="overlay" onClick={() => setSelectedJob(null)}>
            <div onClick={e => e.stopPropagation()}
              style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>

              {/* Header */}
              <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"24px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ color:"#BFDBFE", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>⏳ Pending Job Requirement</div>
                    <div style={{ color:"#fff", fontSize:20, fontWeight:800, marginBottom:4 }}>{selectedJob.title}</div>
                    <div style={{ color:"#93C5FD", fontSize:13 }}>{selectedJob.institute_name} · {selectedJob.location_city||selectedJob.location_city_user||"—"}</div>
                    {selectedJob.requirement_id && <div style={{ marginTop:6, fontFamily:"Fira Code,monospace", fontSize:12, color:"#4ADE80", fontWeight:700 }}>🔖 {selectedJob.requirement_id}</div>}
                  </div>
                  <button onClick={() => setSelectedJob(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
                </div>
                {/* Top action buttons */}
                <div style={{ display:"flex", gap:10, marginTop:18 }}>
                  <button className="btn btn-success btn-sm" style={{ flex:1, justifyContent:"center", background:"#059669" }}
                    onClick={() => { approveJob(selectedJob); setSelectedJob(null); }}>✓ Approve & Publish</button>
                  <button className="btn btn-danger btn-sm" style={{ flex:1, justifyContent:"center" }}
                    onClick={() => { rejectJob(selectedJob.id); setSelectedJob(null); }}>✕ Reject</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedJob(null)}>Close</button>
                </div>
              </div>

              <div style={{ padding:"24px 28px" }}>

                {/* Helper component for a field box */}
                {(() => {
                  const Field = ({ label, value, full, green, mono }) => !value ? null : (
                    <div style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px", gridColumn: full?"1/-1":"auto" }}>
                      <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:600, color: green?"#059669":mono?"#1A56DB":"#111827", fontFamily: mono?"Fira Code,monospace":"inherit" }}>{value}</div>
                    </div>
                  );

                  const j = selectedJob;
                  const grid = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 };
                  const secHead = (icon, label) => (
                    <div style={{ fontWeight:800, fontSize:11, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1.5, marginBottom:10, paddingBottom:6, borderBottom:"2px solid #EBF5FF" }}>
                      {icon} {label}
                    </div>
                  );

                  return (
                    <>
                      {/* ── Section 1: Institution Details ── */}
                      {secHead("🏫", "Institution Details")}
                      <div style={grid}>
                        <Field label="Requirement ID"     value={j.requirement_id}                              mono />
                        <Field label="Institution Name"   value={j.institution_name||j.institute_name} />
                        <Field label="Institution Type"   value={j.institution_type} />
                        <Field label="State"              value={j.location_state} />
                        <Field label="City"               value={j.location_city||j.institute_city_user} />
                        <Field label="Contact Person"     value={j.contact_person} />
                        <Field label="Contact Number"     value={j.contact_number||j.institute_phone} />
                        <Field label="Email"              value={j.contact_email||j.posted_by_email} />
                        <Field label="Posted On"          value={new Date(j.created_at).toLocaleString()} />
                        <Field label="Posted By (Account)" value={j.posted_by_email} />
                      </div>

                      {/* ── Section 2: Requirement Details ── */}
                      {secHead("📋", "Requirement Details")}
                      <div style={grid}>
                        <Field label="Requirement Type"   value={j.requirement_type} />
                        <Field label="Subject"            value={j.subject} />
                        <Field label="Grades / Classes"   value={j.grades} full />
                        <Field label="Board"              value={j.board} />
                        <Field label="Experience Required" value={j.experience} />
                      </div>

                      {/* ── Section 3: Compensation ── */}
                      {secHead("💰", "Compensation & Schedule")}
                      <div style={grid}>
                        <Field label="Salary Min (₹/mo)"  value={j.salary_min ? "₹"+Number(j.salary_min).toLocaleString() : null} green />
                        <Field label="Salary Max (₹/mo)"  value={j.salary_max ? "₹"+Number(j.salary_max).toLocaleString() : null} green />
                        <Field label="Joining Timeline"   value={j.joining_timeline} />
                        <Field label="Work Mode"          value={j.work_mode||j.job_type} />
                        <Field label="Number of Positions" value={j.positions ? String(j.positions) : null} />
                        <Field label="Interview Mode"     value={j.interview_mode} />
                      </div>

                      {/* ── Section 4: Conditions ── */}
                      {secHead("🏠", "Conditions & Preferences")}
                      <div style={grid}>
                        <Field label="Residential"        value={j.residential} />
                        <Field label="Accommodation"      value={j.accommodation} />
                        <Field label="Gender Preference"  value={j.gender_preference} />
                        <Field label="Demo Required"      value={j.demo_required} />
                      </div>

                      {/* ── Section 5: Internal ── */}
                      {secHead("🗂", "Internal / Admin")}
                      <div style={grid}>
                        <Field label="Status"             value={j.status} />
                        <Field label="Assigned Recruiter" value={j.assigned_recruiter} />
                        <Field label="Notes / Remarks"    value={j.notes} full />
                      </div>
                    </>
                  );
                })()}

                {/* Bottom action row */}
                <div style={{ display:"flex", gap:10, paddingTop:20, borderTop:"1px solid #E5E7EB", marginTop:8 }}>
                  <button className="btn btn-success" style={{ flex:1, justifyContent:"center" }}
                    onClick={() => { approveJob(selectedJob); setSelectedJob(null); }}>✓ Approve & Publish</button>
                  <button className="btn btn-danger" style={{ flex:1, justifyContent:"center" }}
                    onClick={() => { rejectJob(selectedJob.id); setSelectedJob(null); }}>✕ Reject</button>
                  <button className="btn btn-ghost" onClick={() => setSelectedJob(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ══ ALL JOBS ══ */}
        {tab==="jobs" && (
          <div className="fadeUp">
            <div className="page-title">All Positions</div>
            <div className="page-sub">Every job posted on AcadHr — from database</div>
            <FilterBar filters={jobFilters} setFilters={setJobFilters} fields={[
                { key:"title",            type:"text",   placeholder:"🔍 Position...",        width:200 },
                { key:"institute_name",   type:"text",   placeholder:"🏫 Institution...",      width:180 },
                { key:"subject",          type:"text",   placeholder:"📚 Subject...",          width:160 },
                { key:"location_city",    type:"text",   placeholder:"📍 City...",             width:150 },
                { key:"requirement_type", type:"select", placeholder:"Type",                   width:140,
                  options:["Teacher","Faculty","Tutor"] },
                { key:"status",           type:"select", placeholder:"Status",                 width:140,
                  options:["pending","approved","rejected"] },
              ]} />
            {loading.jobs ? <Loader /> : (
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Req ID</th><th>Position</th><th>Institution</th><th>Subject</th><th>Location</th><th>Salary</th><th>Applications</th><th>Status</th></tr></thead>
                    <tbody>
                      {(() => {
                        const f = jobFilters;
                        const filtered = allJobs.filter(j =>
                          (!f.title            || j.title?.toLowerCase().includes(f.title.toLowerCase())) &&
                          (!f.institute_name   || (j.institute_name||"").toLowerCase().includes(f.institute_name.toLowerCase())) &&
                          (!f.subject          || (j.subject||"").toLowerCase().includes(f.subject.toLowerCase())) &&
                          (!f.location_city    || (j.location_city||j.location||"").toLowerCase().includes(f.location_city.toLowerCase())) &&
                          (!f.requirement_type || j.requirement_type === f.requirement_type) &&
                          (!f.status           || j.status === f.status)
                        );
                        return filtered.length === 0 ? (
                          <tr><td colSpan={8} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No jobs match filters</td></tr>
                        ) : filtered.map(j => (
                        <tr key={j.id}>
                          <td style={{ fontFamily:"Fira Code,monospace", fontSize:11, color:"#059669" }}>{j.requirement_id||"—"}</td>
                          <td><strong style={{ color:"#111827" }}>{j.title}</strong></td>
                          <td>{j.institute_name}</td>
                          <td>{j.subject||"—"}</td>
                          <td>📍 {j.location_city||j.location||"—"}</td>
                          <td style={{ color:"#059669", fontWeight:600 }}>{j.salary_min ? `₹${Number(j.salary_min).toLocaleString()}` : "—"}</td>
                          <td>👥 {j.applicant_count||0}</td>
                          <td><span className={"badge "+(j.status==="approved"?"bgreen":j.status==="pending"?"bamber":"bred")}>
                            {j.status==="approved"?"● Live":j.status==="pending"?"⏳ Pending":"✕ Rejected"}
                          </span></td>
                        </tr>
                      ))})()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ SCHOOLS ══ */}
        {tab==="schools" && (
          <div className="fadeUp">
            <div className="page-title">Schools / Institutions</div>
            <div className="page-sub">All registered institutions — from database</div>
            <FilterBar filters={schoolFilters} setFilters={setSchoolFilters} fields={[
                { key:"name",          type:"text",   placeholder:"🔍 Institution...", width:200 },
                { key:"email",         type:"text",   placeholder:"📧 Email...",       width:180 },
                { key:"city",          type:"text",   placeholder:"📍 City...",        width:150 },
                { key:"institute_type",type:"select", placeholder:"Type",              width:180,
                  options:["School","Coaching","Junior College","Degree College","Online Platform"] },
                { key:"status",        type:"select", placeholder:"Status",            width:130,
                  options:[{v:"1",l:"Active"},{v:"0",l:"Inactive"}] },
              ]} />
            {loading.schools ? <Loader /> : (
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Institution</th><th>Email</th><th>Type</th><th>City</th><th>Phone</th><th>Live Jobs</th><th>Pending</th><th>Total Jobs</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {(() => {
                        const f = schoolFilters;
                        const filtered = schools.filter(s =>
                          (!f.name           || s.name?.toLowerCase().includes(f.name.toLowerCase())) &&
                          (!f.email          || s.email?.toLowerCase().includes(f.email.toLowerCase())) &&
                          (!f.city           || (s.city||"").toLowerCase().includes(f.city.toLowerCase())) &&
                          (!f.institute_type || s.institute_type === f.institute_type) &&
                          (f.status === ""   || String(s.is_active) === f.status)
                        );
                        return filtered.length === 0 ? (
                          <tr><td colSpan={11} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No institutions match filters</td></tr>
                        ) : filtered.map(s => (
                        <tr key={s.id} onClick={() => setSelectedSchool(s)} style={{ cursor:"pointer" }}>
                          <td><strong style={{ color:"#1A56DB", textDecoration:"underline" }}>{s.name}</strong></td>
                          <td style={{ fontSize:12, color:"#6B7280" }}>{s.email}</td>
                          <td>{s.institute_type||"—"}</td>
                          <td>📍 {s.city||"—"}</td>
                          <td>{s.phone||"—"}</td>
                          <td><span className="badge bgreen">{s.live_jobs||0}</span></td>
                          <td><span className="badge bamber">{s.pending_jobs||0}</span></td>
                          <td>{s.total_jobs||0}</td>
                          <td style={{ fontSize:11, color:"#9CA3AF" }}>{new Date(s.created_at).toLocaleDateString()}</td>
                          <td><StatusBadge active={s.is_active} /></td>
                          <td><button className={"btn btn-sm "+(s.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(s.id); }}>{s.is_active?"Deactivate":"Activate"}</button></td>
                        </tr>
                      ))})()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TEACHERS ══ */}
        {tab==="teachers" && (
          <div className="fadeUp">
            <div className="page-title">Teachers</div>
            <div className="page-sub">All registered teachers — from database</div>
            <FilterBar filters={teacherFilters} setFilters={setTeacherFilters} fields={[
                { key:"name",             type:"text",   placeholder:"🔍 Name...",          width:180 },
                { key:"email",            type:"text",   placeholder:"📧 Email...",          width:180 },
                { key:"specialization",   type:"text",   placeholder:"📚 Subject...",        width:160 },
                { key:"city",             type:"text",   placeholder:"📍 City...",           width:150 },
                { key:"total_experience", type:"select", placeholder:"Experience",           width:160,
                  options:["Fresher","Less than 1 Year","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years"] },
                { key:"status",           type:"select", placeholder:"Status",              width:130,
                  options:[{v:"1",l:"Active"},{v:"0",l:"Inactive"}] },
              ]} />
            {loading.teachers ? <Loader /> : (
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Photo</th><th>Name</th><th>Email</th><th>Phone</th><th>Specialization</th><th>Experience</th><th>City</th><th>Profile %</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {(() => {
                        const f = teacherFilters;
                        const filtered = teachers.filter(t =>
                          (!f.name           || t.name?.toLowerCase().includes(f.name.toLowerCase())) &&
                          (!f.email          || t.email?.toLowerCase().includes(f.email.toLowerCase())) &&
                          (!f.specialization || (t.specialization||"").toLowerCase().includes(f.specialization.toLowerCase())) &&
                          (!f.city           || (t.city||"").toLowerCase().includes(f.city.toLowerCase())) &&
                          (!f.total_experience || t.total_experience === f.total_experience) &&
                          (f.status === "" || String(t.is_active) === f.status)
                        );
                        return filtered.length === 0 ? (
                          <tr><td colSpan={11} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No teachers match filters</td></tr>
                        ) : filtered.map(t => (
                        <tr key={t.id} onClick={() => setSelectedTeacher(t)} style={{ cursor:"pointer" }}>
                          <td>
                            <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", background:"#EBF5FF", border:"2px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              {t.profile_photo
                                ? <img src={(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + t.profile_photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                : <span style={{ fontSize:18 }}>👤</span>}
                            </div>
                          </td>
                          <td><strong style={{ color:"#1A56DB", textDecoration:"underline" }}>{t.name}</strong></td>
                          <td style={{ fontSize:12, color:"#6B7280" }}>{t.email}</td>
                          <td>{t.phone||"—"}</td>
                          <td>{t.specialization||"—"}</td>
                          <td>{t.total_experience||"—"}</td>
                          <td>📍 {t.city||"—"}</td>
                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <div style={{ width:50, height:6, background:"#F3F4F6", borderRadius:3, overflow:"hidden" }}>
                                <div style={{ height:6, borderRadius:3, background: (t.completion_pct||0)>=70?"#059669":(t.completion_pct||0)>=40?"#D97706":"#DC2626", width:`${t.completion_pct||0}%` }} />
                              </div>
                              <span style={{ fontSize:11, fontWeight:700, color:(t.completion_pct||0)>=70?"#059669":"#D97706" }}>{t.completion_pct||0}%</span>
                            </div>
                          </td>
                          <td style={{ fontSize:11, color:"#9CA3AF" }}>{new Date(t.created_at).toLocaleDateString()}</td>
                          <td><StatusBadge active={t.is_active} /></td>
                          <td><button className={"btn btn-sm "+(t.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(t.id); }}>{t.is_active?"Deactivate":"Activate"}</button></td>
                        </tr>
                      ))})()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TEACHER PROFILE DETAIL ══ */}
        {selectedTeacher && (() => {
          const t = selectedTeacher;
          const photo = t.profile_photo ? API_ORIGIN + t.profile_photo : null;
          const resumeUrl = t.resume_link ? (t.resume_link.startsWith("http") ? t.resume_link : API_ORIGIN + t.resume_link) : null;
          const Field = ({ label, value, full }) => !value ? null : (
            <div style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px", gridColumn: full?"1/-1":"auto" }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13.5, color:"#111827", fontWeight:600 }}>{value}</div>
            </div>
          );
          return (
          <div className="overlay" onClick={() => setSelectedTeacher(null)}>
            <div onClick={e => e.stopPropagation()}
              style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>

              {/* Header */}
              <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"24px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, minWidth:0 }}>
                    <div style={{ width:64, height:64, borderRadius:"50%", overflow:"hidden", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {photo ? <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:30 }}>👤</span>}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ color:"#BFDBFE", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>👩‍🏫 Teacher Profile</div>
                      <div style={{ color:"#fff", fontSize:20, fontWeight:800, marginBottom:2 }}>{t.name}</div>
                      <div style={{ color:"#93C5FD", fontSize:13 }}>{t.specialization || t.current_role || "Teacher"}{t.city ? ` · 📍 ${t.city}` : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTeacher(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
                </div>
                {/* Actions */}
                <div style={{ display:"flex", gap:10, marginTop:18, flexWrap:"wrap" }}>
                  {resumeUrl ? (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download
                      className="btn btn-sm" style={{ flex:1, justifyContent:"center", background:"#059669", color:"#fff", textDecoration:"none", minWidth:160 }}>
                      ⬇️ Download Resume{t.resume_file_name ? ` (${t.resume_file_name})` : ""}
                    </a>
                  ) : (
                    <span style={{ flex:1, textAlign:"center", color:"#BFDBFE", fontSize:13, fontWeight:600, alignSelf:"center", minWidth:160 }}>No resume uploaded</span>
                  )}
                  <button className={"btn btn-sm "+(t.is_active?"btn-danger":"btn-success")}
                    onClick={() => { toggleUser(t.id); setSelectedTeacher(s => s ? {...s, is_active: s.is_active ? 0 : 1} : s); }}>
                    {t.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTeacher(null)}>Close</button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:"24px 28px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                  <StatusBadge active={t.is_active} />
                  {t.profile_status && <span style={{ background:"#EBF5FF", color:"#1A56DB", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>{t.profile_status}</span>}
                  <span style={{ fontSize:12, color:"#6B7280", fontWeight:600 }}>Profile {t.completion_pct||0}% complete</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Field label="Email" value={t.email} />
                  <Field label="Phone" value={t.phone || t.mobile} />
                  <Field label="Specialization" value={t.specialization} />
                  <Field label="Experience" value={t.total_experience} />
                  <Field label="Qualification" value={t.qualification} />
                  <Field label="Current Role" value={t.current_role} />
                  <Field label="City" value={t.city || t.current_location} />
                  <Field label="Work Mode" value={t.work_mode} />
                  <Field label="Gender" value={t.gender} />
                  <Field label="Languages" value={t.languages} />
                  <Field label="Subjects" value={t.subjects} full />
                  <Field label="Grades Handling" value={t.grades_handling} full />
                  <Field label="Boards Handled" value={t.boards_handled} full />
                  <Field label="Joined" value={t.created_at ? new Date(t.created_at).toLocaleString() : null} />
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ══ TUTORS ══ */}
        {tab==="tutors" && (
          <div className="fadeUp">
            <div className="page-title">Tutors</div>
            <div className="page-sub">All registered tutors — from database</div>
            <FilterBar filters={tutorFilters} setFilters={setTutorFilters} fields={[
                { key:"name",         type:"text",   placeholder:"🔍 Name...",    width:180 },
                { key:"email",        type:"text",   placeholder:"📧 Email...",   width:180 },
                { key:"subject",      type:"text",   placeholder:"📚 Subject...", width:160 },
                { key:"city",         type:"text",   placeholder:"📍 City...",    width:150 },
                { key:"teaching_mode",type:"select", placeholder:"Mode",          width:150,
                  options:["Online","Offline","Both"] },
                { key:"status",       type:"select", placeholder:"Status",        width:130,
                  options:[{v:"1",l:"Active"},{v:"0",l:"Inactive"}] },
              ]} />
            {loading.tutors ? <Loader /> : (
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Subject</th><th>Experience</th><th>Mode</th><th>City</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {(() => {
                        const f = tutorFilters;
                        const filtered = tutors.filter(t =>
                          (!f.name         || t.name?.toLowerCase().includes(f.name.toLowerCase())) &&
                          (!f.email        || t.email?.toLowerCase().includes(f.email.toLowerCase())) &&
                          (!f.subject      || (t.subject||"").toLowerCase().includes(f.subject.toLowerCase())) &&
                          (!f.city         || (t.city||"").toLowerCase().includes(f.city.toLowerCase())) &&
                          (!f.teaching_mode|| t.teaching_mode === f.teaching_mode) &&
                          (f.status === "" || String(t.is_active) === f.status)
                        );
                        return filtered.length === 0 ? (
                          <tr><td colSpan={10} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No tutors match filters</td></tr>
                        ) : filtered.map(t => (
                        <tr key={t.id} onClick={() => setSelectedTutor(t)} style={{ cursor:"pointer" }}>
                          <td><strong style={{ color:"#6D28D9", textDecoration:"underline" }}>{t.name}</strong></td>
                          <td style={{ fontSize:12, color:"#6B7280" }}>{t.email}</td>
                          <td>{t.phone||"—"}</td>
                          <td>{t.subject||"—"}</td>
                          <td>{t.experience||"—"}</td>
                          <td>{t.teaching_mode||"—"}</td>
                          <td>📍 {t.city||"—"}</td>
                          <td style={{ fontSize:11, color:"#9CA3AF" }}>{new Date(t.created_at).toLocaleDateString()}</td>
                          <td><StatusBadge active={t.is_active} /></td>
                          <td><button className={"btn btn-sm "+(t.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(t.id); }}>{t.is_active?"Deactivate":"Activate"}</button></td>
                        </tr>
                      ))})()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ PARENTS ══ */}
        {tab==="parents" && (
          <div className="fadeUp">
            <div className="page-title">Parents / Guardians</div>
            <div className="page-sub">All registered parents — from database</div>
            <FilterBar filters={parentFilters} setFilters={setParentFilters} fields={[
              { key:"name",          type:"text",   placeholder:"🔍 Parent name...", width:180 },
              { key:"email",         type:"text",   placeholder:"📧 Email...",       width:180 },
              { key:"subject",       type:"text",   placeholder:"📚 Subject...",     width:160 },
              { key:"student_class", type:"select", placeholder:"Class",             width:170,
                options:["Pre-Primary (Nursery–KG)","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Degree"] },
              { key:"board",         type:"select", placeholder:"Board",             width:150,
                options:["CBSE","ICSE","State Board (AP)","State Board (TS)","IB","IGCSE"] },
              { key:"status",        type:"select", placeholder:"Tutor Status",      width:160,
                options:["Open","Assigned"] },
            ]} />
            {loading.parents
              ? <Loader />
              : <div className="card" style={{ padding:0, overflow:"hidden" }}>
                  <div className="tbl-wrap">
                    <table>
                      <thead><tr><th>Parent Name</th><th>Email</th><th>Phone</th><th>Student</th><th>Class</th><th>Board</th><th>Subject</th><th>Location</th><th>Mode</th><th>Time</th><th>Budget</th><th>Tutor Gender</th><th>Exp Req</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {(() => {
                          const f = parentFilters;
                          const filtered = parents.filter(p =>
                            (!f.name          || p.name?.toLowerCase().includes(f.name.toLowerCase())) &&
                            (!f.email         || p.email?.toLowerCase().includes(f.email.toLowerCase())) &&
                            (!f.subject       || (p.subject||"").toLowerCase().includes(f.subject.toLowerCase())) &&
                            (!f.student_class || p.student_class === f.student_class) &&
                            (!f.board         || p.board === f.board) &&
                            (!f.status        || (p.status||"Open") === f.status)
                          );
                          return filtered.length === 0
                            ? <tr><td colSpan={15} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No parents match filters</td></tr>
                            : filtered.map(p => (
                              <tr key={p.id} onClick={() => setSelectedParent(p)} style={{ cursor:"pointer" }}>
                                <td><strong style={{ color:"#059669", textDecoration:"underline" }}>{p.name}</strong></td>
                                <td style={{ fontSize:12, color:"#6B7280" }}>{p.email}</td>
                                <td>{p.phone||"—"}</td>
                                <td style={{ fontWeight:600, color:"#1A56DB" }}>{p.student_name||"—"}</td>
                                <td>{p.student_class||"—"}</td>
                                <td>{p.board||"—"}</td>
                                <td>{p.subject||"—"}</td>
                                <td>📍 {p.location||p.city||"—"}</td>
                                <td>{p.mode||"—"}</td>
                                <td>{p.preferred_time||"—"}</td>
                                <td style={{ color:"#059669", fontWeight:600 }}>{p.budget||"—"}</td>
                                <td>{p.tutor_gender_pref||"Any"}</td>
                                <td>{p.experience_req||"Any"}</td>
                                <td><span className={"badge "+(p.status==="Assigned"?"bgreen":"bamber")}>{p.status||"Open"}</span></td>
                                <td><button className={"btn btn-sm "+(p.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(p.id); }}>{p.is_active?"Deactivate":"Activate"}</button></td>
                              </tr>
                            ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
            }
          </div>
        )}

        {/* ══ PAYMENTS ══ */}
        {tab==="payments" && (
          <div className="fadeUp">
            <div className="page-title">Payments</div>
            <div className="page-sub">Revenue and transaction management</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:24 }}>
              {[["Total Revenue","₹0","💰","#059669"],["This Month","₹0","📅","#1A56DB"],["Pending","₹0","⏳","#D97706"]].map(([l,v,i,c]) => (
                <div key={l} className="card" style={{ padding:24, textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{i}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:c, fontFamily:"Playfair Display,serif" }}>{v}</div>
                  <div style={{ fontSize:12, color:"#6B7280", fontWeight:700, marginTop:4, textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:64, textAlign:"center" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>💳</div>
              <h3 style={{ fontSize:20, marginBottom:8 }}>Payment Gateway Coming Soon</h3>
              <p style={{ color:"#6B7280", fontSize:14 }}>Credit purchases, premium job boosts, and subscription management will appear here.</p>
            </div>
          </div>
        )}

        {/* ══ SCHOOL PROFILE DETAIL ══ */}
        {selectedSchool && (() => {
          const s = selectedSchool;
          const Field = ({ label, value, full }) => !value && value !== 0 ? null : (
            <div style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px", gridColumn: full?"1/-1":"auto" }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13.5, color:"#111827", fontWeight:600 }}>{value}</div>
            </div>
          );
          return (
          <div className="overlay" onClick={() => setSelectedSchool(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
              <div style={{ background:"linear-gradient(135deg,#0369A1,#0EA5E9)", padding:"24px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, minWidth:0 }}>
                    <div style={{ width:64, height:64, borderRadius:16, background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:30 }}>🏫</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ color:"#BAE6FD", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>🏫 Institution Profile</div>
                      <div style={{ color:"#fff", fontSize:20, fontWeight:800, marginBottom:2 }}>{s.name}</div>
                      <div style={{ color:"#E0F2FE", fontSize:13 }}>{s.institute_type || "Institution"}{s.city ? ` · 📍 ${s.city}` : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedSchool(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:18, flexWrap:"wrap" }}>
                  {s.website && <a href={s.website.startsWith("http")?s.website:`https://${s.website}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ flex:1, justifyContent:"center", background:"#fff", color:"#0369A1", textDecoration:"none", minWidth:140 }}>🌐 Visit Website</a>}
                  <button className={"btn btn-sm "+(s.is_active?"btn-danger":"btn-success")} onClick={() => { toggleUser(s.id); setSelectedSchool(x => x ? {...x, is_active: x.is_active ? 0 : 1} : x); }}>{s.is_active?"Deactivate":"Activate"}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedSchool(null)}>Close</button>
                </div>
              </div>
              <div style={{ padding:"24px 28px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}><StatusBadge active={s.is_active} /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Field label="Email" value={s.email} />
                  <Field label="Phone" value={s.phone} />
                  <Field label="Institution Type" value={s.institute_type} />
                  <Field label="City" value={s.city} />
                  <Field label="Website" value={s.website} />
                  <Field label="Total Jobs Posted" value={s.total_jobs ?? 0} />
                  <Field label="Live Jobs" value={s.live_jobs ?? 0} />
                  <Field label="Pending Jobs" value={s.pending_jobs ?? 0} />
                  <Field label="Joined" value={s.created_at ? new Date(s.created_at).toLocaleString() : null} full />
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ══ TUTOR PROFILE DETAIL ══ */}
        {selectedTutor && (() => {
          const t = selectedTutor;
          const Field = ({ label, value, full }) => !value ? null : (
            <div style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px", gridColumn: full?"1/-1":"auto" }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13.5, color:"#111827", fontWeight:600 }}>{value}</div>
            </div>
          );
          return (
          <div className="overlay" onClick={() => setSelectedTutor(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
              <div style={{ background:"linear-gradient(135deg,#4C1D95,#6D28D9)", padding:"24px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, minWidth:0 }}>
                    <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:30 }}>🧑‍🎓</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ color:"#DDD6FE", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>🧑‍🎓 Tutor Profile</div>
                      <div style={{ color:"#fff", fontSize:20, fontWeight:800, marginBottom:2 }}>{t.name}</div>
                      <div style={{ color:"#C4B5FD", fontSize:13 }}>{t.subject || "Tutor"}{t.city ? ` · 📍 ${t.city}` : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTutor(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:18, flexWrap:"wrap" }}>
                  <button className={"btn btn-sm "+(t.is_active?"btn-danger":"btn-success")} onClick={() => { toggleUser(t.id); setSelectedTutor(x => x ? {...x, is_active: x.is_active ? 0 : 1} : x); }}>{t.is_active?"Deactivate":"Activate"}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTutor(null)}>Close</button>
                </div>
              </div>
              <div style={{ padding:"24px 28px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}><StatusBadge active={t.is_active} /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Field label="Email" value={t.email} />
                  <Field label="Phone" value={t.phone} />
                  <Field label="Subject" value={t.subject} />
                  <Field label="Experience" value={t.experience} />
                  <Field label="Qualification" value={t.qualification} />
                  <Field label="Teaching Mode" value={t.teaching_mode} />
                  <Field label="Hourly Rate" value={t.hourly_rate} />
                  <Field label="City" value={t.city} />
                  <Field label="Joined" value={t.created_at ? new Date(t.created_at).toLocaleString() : null} full />
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ══ PARENT PROFILE DETAIL ══ */}
        {selectedParent && (() => {
          const p = selectedParent;
          const Field = ({ label, value, full }) => !value ? null : (
            <div style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 14px", gridColumn: full?"1/-1":"auto" }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13.5, color:"#111827", fontWeight:600 }}>{value}</div>
            </div>
          );
          return (
          <div className="overlay" onClick={() => setSelectedParent(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
              <div style={{ background:"linear-gradient(135deg,#065F46,#059669)", padding:"24px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, minWidth:0 }}>
                    <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:30 }}>👨‍👩‍👧</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ color:"#A7F3D0", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>👨‍👩‍👧 Parent Profile</div>
                      <div style={{ color:"#fff", fontSize:20, fontWeight:800, marginBottom:2 }}>{p.name}</div>
                      <div style={{ color:"#A7F3D0", fontSize:13 }}>{p.student_name ? `Student: ${p.student_name}` : "Parent / Guardian"}{(p.location||p.city) ? ` · 📍 ${p.location||p.city}` : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedParent(null)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:18, flexWrap:"wrap" }}>
                  <button className={"btn btn-sm "+(p.is_active?"btn-danger":"btn-success")} onClick={() => { toggleUser(p.id); setSelectedParent(x => x ? {...x, is_active: x.is_active ? 0 : 1} : x); }}>{p.is_active?"Deactivate":"Activate"}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedParent(null)}>Close</button>
                </div>
              </div>
              <div style={{ padding:"24px 28px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                  <StatusBadge active={p.is_active} />
                  <span style={{ background: p.status==="Assigned"?"#ECFDF5":"#FFFBEB", color: p.status==="Assigned"?"#059669":"#D97706", border:`1px solid ${p.status==="Assigned"?"#A7F3D0":"#FDE68A"}`, borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>{p.status||"Open"}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Field label="Email" value={p.email} />
                  <Field label="Phone" value={p.phone} />
                  <Field label="Student Name" value={p.student_name} />
                  <Field label="Student Class" value={p.student_class} />
                  <Field label="Board" value={p.board} />
                  <Field label="Subject(s)" value={p.subject} />
                  <Field label="Location" value={p.location || p.city} />
                  <Field label="Mode" value={p.mode} />
                  <Field label="Preferred Time" value={p.preferred_time} />
                  <Field label="Budget" value={p.budget} />
                  <Field label="Tutor Gender Preference" value={p.tutor_gender_pref} />
                  <Field label="Experience Required" value={p.experience_req} />
                  <Field label="Assigned Tutor" value={p.assigned_tutor} />
                  <Field label="Joined" value={p.created_at ? new Date(p.created_at).toLocaleString() : null} />
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ══ FEEDBACKS ══ */}
        {tab==="feedbacks" && (
          <div className="fadeUp">
            <div className="page-title">Feedbacks</div>
            <div className="page-sub">User feedback and error reports — from database</div>
            {loading.feedbacks ? <Loader /> : feedbacks.length === 0 ? (
              <div className="card" style={{ padding:48, textAlign:"center", color:"#9CA3AF" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
                <h3 style={{ fontSize:18, color:"#111827", marginBottom:6 }}>No feedback yet</h3>
                <p style={{ fontSize:14 }}>Submissions from the feedback widget will appear here.</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
                {feedbacks.map(f => (
                  <div key={f.id} className="card" style={{ padding:20, display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                      <span style={{ background:"#EBF5FF", color:"#1A56DB", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>
                        {f.category || "Feedback"}
                      </span>
                      <span style={{ fontSize:11, color:"#9CA3AF", fontWeight:600 }}>
                        {f.created_at ? new Date(f.created_at).toLocaleString() : ""}
                      </span>
                    </div>

                    <p style={{ fontSize:14, color:"#111827", lineHeight:1.55, margin:0, whiteSpace:"pre-wrap" }}>{f.message}</p>

                    <div style={{ display:"flex", flexWrap:"wrap", gap:8, fontSize:12.5, color:"#374151" }}>
                      {f.name  && <span>👤 {f.name}</span>}
                      {f.phone && <span>📞 {f.phone}</span>}
                      {f.email && <span>✉️ {f.email}</span>}
                    </div>

                    {f.page && <div style={{ fontSize:11, color:"#6B7280" }}>📄 Page: {f.page}</div>}

                    {f.screenshot && (
                      <a href={`${API_ORIGIN}${f.screenshot}`} target="_blank" rel="noopener noreferrer"
                        style={{ display:"block", marginTop:2 }}>
                        <img src={`${API_ORIGIN}${f.screenshot}`} alt="screenshot"
                          style={{ width:"100%", maxHeight:180, objectFit:"cover", borderRadius:10, border:"1px solid #E5E7EB" }} />
                        <span style={{ fontSize:11, color:"#1A56DB", fontWeight:700 }}>🖼️ Open screenshot</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {tab==="analytics" && (
          <div className="fadeUp">
            <div className="page-title">Analytics</div>
            <div className="page-sub">Platform insights — from database</div>
            {loading.analytics ? <Loader /> : !analytics ? (
              <div className="card" style={{ padding:40, textAlign:"center", color:"#9CA3AF" }}>No analytics data yet</div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
                  {/* Top Subjects */}
                  <div className="card" style={{ padding:24 }}>
                    <h3 style={{ fontSize:16, fontWeight:800, marginBottom:18 }}>📚 Top Subjects in Demand</h3>
                    {analytics.topSubjects.length === 0 ? <div style={{ color:"#9CA3AF" }}>No data yet</div> :
                      analytics.topSubjects.map((s,i) => (
                        <div key={s.subject} style={{ marginBottom:12 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13, fontWeight:600 }}>
                            <span style={{ color:"#111827" }}>{s.subject}</span>
                            <span style={{ color:"#1A56DB" }}>{s.count} jobs</span>
                          </div>
                          <div style={{ height:8, background:"#F3F4F6", borderRadius:4 }}>
                            <div style={{ height:8, borderRadius:4, background:`hsl(${210+i*15},70%,55%)`, width:`${(s.count/analytics.topSubjects[0].count)*100}%`, transition:"width .5s" }} />
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  {/* Top Cities */}
                  <div className="card" style={{ padding:24 }}>
                    <h3 style={{ fontSize:16, fontWeight:800, marginBottom:18 }}>📍 Top Teacher Cities</h3>
                    {analytics.topCities.length === 0 ? <div style={{ color:"#9CA3AF" }}>No data yet</div> :
                      analytics.topCities.map((c,i) => (
                        <div key={c.city} style={{ marginBottom:12 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13, fontWeight:600 }}>
                            <span style={{ color:"#111827" }}>📍 {c.city}</span>
                            <span style={{ color:"#059669" }}>{c.count} teachers</span>
                          </div>
                          <div style={{ height:8, background:"#F3F4F6", borderRadius:4 }}>
                            <div style={{ height:8, borderRadius:4, background:`hsl(${140+i*12},60%,50%)`, width:`${(c.count/analytics.topCities[0].count)*100}%`, transition:"width .5s" }} />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Registration Trend */}
                <div className="card" style={{ padding:24 }}>
                  <h3 style={{ fontSize:16, fontWeight:800, marginBottom:18 }}>📈 Registrations (Last 7 Days)</h3>
                  {analytics.regTrend.length === 0 ? (
                    <div style={{ color:"#9CA3AF", textAlign:"center", padding:"30px 0" }}>No registrations in the last 7 days</div>
                  ) : (
                    <AnalyticsRegChart regTrend={analytics.regTrend} />
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
