import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { SUBS, INDIA_LOCATIONS } from "../../constants";
import { Toast, InlineBrowseJobs, FilterBar } from "../common/Shared";
import SuccessPopup from "../common/SuccessPopup";
import './Teacher.css';

function TeacherDashboard({ user, setPage }) {
  const { logout } = useAuth();
  const [tab, setTab]         = useState("overview");
  const [editMode, setEditMode]     = useState(false);
  const [saved, setSaved]           = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  // ── Full profile with all fields from spec ──────────────────────────────────
  const [profile, setProfile] = useState({
    // Basic
    full_name:          user.name || "",
    mobile:             "",
    email:              user.email || "",
    gender:             "",
    dob:                "",
    current_location:   "",
    preferred_locations:"",
    // Qualifications
    qualification:      "",
    specialization:     user.subject || "",
    total_experience:   "",
    relevant_experience:"",
    current_role:       "",
    current_org:        "",
    current_salary:     "",
    expected_salary:    "",
    notice_period:      "",
    available_from:     "",
    // Work preferences
    work_mode:          "",
    tutor_type:         "",
    subjects:           "",
    grades_handling:    "",
    boards_handled:     "",
    competitive_exams:  "",
    teaching_mode:      "",
    // Demo & languages
    demo_available:     "",
    demo_link:          "",    languages:          "",
    certifications:     "",
    // Other
    residential_pref:   "",
    relocation_ready:   "",
    accommodation_req:  "",
    aadhaar_verified:   "",
    resume_link:        "",
    profile_status:     "Active",
    remarks:            "",
    resume_file_name:   "",
    profile_photo:      "",
    terms_accepted:     "",
  });

  function up(k, v) { setProfile(p => ({...p, [k]: v})); }

  // Demo links — up to 3 Google Drive URLs (stored as comma-separated in demo_link)
  const DEMO_MAX = 3;
  const [demoLinks, setDemoLinks] = useState([""]);
  function syncDemoLinks(rows) {
    setDemoLinks(rows);
    up("demo_link", rows.map(s => s.trim()).filter(Boolean).join(", "));
  }
  function setDemoLinkAt(idx, val) {
    const rows = [...demoLinks];
    rows[idx] = val;
    syncDemoLinks(rows);
  }
  function addDemoLink() {
    if (demoLinks.length >= DEMO_MAX) return;
    setDemoLinks([...demoLinks, ""]);
  }
  function removeDemoLink(idx) {
    if (demoLinks.length <= 1) return;
    syncDemoLinks(demoLinks.filter((_, i) => i !== idx));
  }

  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError,     setResumeError]     = useState("");
  const [resumeSuccess,   setResumeSuccess]   = useState("");

  async function handleResumeUpload(file) {
    setResumeUploading(true);
    setResumeError(""); setResumeSuccess("");
    try {
      const token = localStorage.getItem("acadhr_token");
      const fd    = new FormData();
      fd.append("resume", file);
      const res = await fetch(
        (process.env.REACT_APP_API_URL || "http://localhost:5000/api") + "/teacher/upload-resume",
        { method:"POST", headers:{ Authorization:"Bearer "+token }, body:fd }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile(p => ({ ...p, resume_link: data.resume_link, resume_file_name: data.resume_file_name }));
      setResumeSuccess(`✅ "${file.name}" uploaded successfully!`);
    } catch(e) {
      setResumeError(e.message || "Upload failed. Please try again.");
    } finally {
      setResumeUploading(false);
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("acadhr_token");
    if (!token) return;
    setAppsLoading(true);
    fetch(
      (process.env.REACT_APP_API_URL || "http://localhost:5000/api") + "/my-applications",
      { headers: { Authorization: "Bearer " + token } }
    )
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      if (Array.isArray(data)) {
        setApplications(data.map(a => ({
          id:       a.id,
          job:      a.title,
          school:   a.institution_name || a.school_name,
          date:     new Date(a.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
          status:   a.status === "shortlisted" ? "Shortlisted"
                  : a.status === "rejected"    ? "Not Selected"
                  : "Under Review",
          sClass:   a.status === "shortlisted" ? "bgreen"
                  : a.status === "rejected"    ? "bred"
                  : "bamber",
          location: a.location_city || "",
          subject:  a.subject       || "",
          salary:   a.salary_min && a.salary_max
                      ? `₹${Number(a.salary_min).toLocaleString("en-IN")}–₹${Number(a.salary_max).toLocaleString("en-IN")}/mo`
                      : "",
        })));
      }
    })
    .catch(e => console.error("Applications fetch error:", e))
    .finally(() => setAppsLoading(false));
  }, []);

  // Load profile from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("acadhr_token");
    if (!token) { setProfileLoading(false); return; }
    fetch((process.env.REACT_APP_API_URL || "http://localhost:5000/api") + "/teacher/profile", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data) {
        setProfile(p => ({
          ...p,
          full_name:          data.full_name          || user.name || "",
          mobile:             data.mobile             || "",
          email:              user.email              || "",
          gender:             data.gender             || "",
          dob:                data.dob                || "",
          current_location:   data.current_location   || "",
          preferred_locations:data.preferred_locations|| "",
          qualification:      data.qualification      || "",
          specialization:     data.specialization     || user.subject || "",
          total_experience:   data.total_experience   || "",
          relevant_experience:data.relevant_experience|| "",
          current_role:       data.current_role       || "",
          current_org:        data.current_org        || "",
          current_salary:     data.current_salary     || "",
          expected_salary:    data.expected_salary    || "",
          notice_period:      data.notice_period      || "",
          available_from:     data.available_from     || "",
          certifications:     data.certifications     || "",
          work_mode:          data.work_mode          || "",
          tutor_type:         data.tutor_type         || "",
          subjects:           data.subjects           || "",
          grades_handling:    data.grades_handling    || "",
          boards_handled:     data.boards_handled     || "",
          competitive_exams:  data.competitive_exams  || "",
          teaching_mode:      data.teaching_mode      || "",
          languages:          data.languages          || "",
          demo_available:     data.demo_available     || "",
          demo_link:          data.demo_link          || "",
          residential_pref:   data.residential_pref   || "",
          relocation_ready:   data.relocation_ready   || "",
          accommodation_req:  data.accommodation_req  || "",
          aadhaar_verified:   data.aadhaar_verified   || "",
          resume_link:        data.resume_link        || "",
          resume_file_name:   data.resume_file_name   || "",
          profile_photo:      data.profile_photo       || "",
          profile_status:     data.profile_status     || "Active",
          remarks:            data.remarks            || "",
          terms_accepted:     data.terms_accepted     || "",
        }));
        setDemoLinks((() => { const a = data.demo_link ? data.demo_link.split(",").map(x=>x.trim()).filter(Boolean) : []; return a.length ? a : [""]; })());
        if (data.completion_pct) {
          localStorage.setItem("acadhr_teacher_completion", String(data.completion_pct));
        }
      }
    })
    .catch(e => console.error("Profile load error:", e))
    .finally(() => setProfileLoading(false));
  }, []);

  // Save profile to backend
  async function saveProfile() {
    setSaving(true); setSaveError("");
    try {
      const token = localStorage.getItem("acadhr_token");
      const payload = { ...profile, completion_pct: completion };
      const res = await fetch(
        (process.env.REACT_APP_API_URL || "http://localhost:5000/api") + "/teacher/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: "Bearer " + token } : {}),
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      setSaved(true);
      setShowSavePopup(true);
      setEditMode(false);
      localStorage.setItem("acadhr_teacher_completion", String(completion));
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Profile completion calculator ───────────────────────────────────────────
  // Fields weighted for 70% threshold
  const REQUIRED_FIELDS = [
    "full_name","mobile","email","gender","dob","current_location",
    "qualification","specialization","total_experience","relevant_experience",
    "current_role","work_mode","subjects","grades_handling","boards_handled",
    "teaching_mode","languages","profile_status",
  ];
  const OPTIONAL_FIELDS = [
    "preferred_locations","current_org","current_salary","expected_salary",
    "notice_period","available_from","tutor_type","competitive_exams",
    "demo_available","demo_link","certifications","residential_pref",
    "relocation_ready","accommodation_req","aadhaar_verified","resume_link","remarks",
  ];
  const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

  function calcCompletion() {
    const filled = ALL_FIELDS.filter(f => profile[f] && profile[f].toString().trim() !== "").length;
    return Math.round((filled / ALL_FIELDS.length) * 100);
  }

  const completion   = calcCompletion();
  const canApply     = completion >= 70;
  const progressColor = completion >= 70 ? "#059669" : completion >= 40 ? "#D97706" : "#DC2626";

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading]   = useState(false);
  const [appFilterT, setAppFilterT]     = useState({ job:"", school:"", status:"" });
  const [recentJobs,  setRecentJobs]    = useState([]);

  // Fetch recent jobs for overview panel
  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    fetch(`${API}/jobs`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setRecentJobs(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  const MENU = [
    { id:"overview",     icon:"🏠", label:"Home" },
    { id:"profile",      icon:"👤", label:"My Profile" },
    { id:"browse",       icon:"🔍", label:"Browse Jobs" },
    { id:"applications", icon:"📋", label:"My Applications" },
    { id:"analytics",    icon:"📊", label:"Analytics" },
    { id:"resume",       icon:"📄", label:"Resume & Docs" },
    { id:"settings",     icon:"⚙️",  label:"Settings" },
  ];

  const SUBS  = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit"];
  const QUALS = ["B.Sc","M.Sc","B.Tech","M.Tech","B.Ed","M.Ed","PhD","Diploma","B.A","M.A","B.Com","M.Com","B.E","BCA","MCA","BBA","MBA","M.Phil"];
  const GRADES= ["Pre-Primary","1–5","6–8","9–10","11–12","All Grades","Degree"];
  const BOARDS= ["CBSE","ICSE","State Board","IB","IGCSE","All Boards"];
  const EXAMS = ["NEET","JEE","Olympiad","UPSC","CA Foundation","None"];

  const [navOpen, setNavOpen] = useState(false);
  return (
    <div style={{ display:"flex", width:"100vw", overflowX:"hidden", minHeight:"100vh" }}>

      <SuccessPopup show={showSavePopup} onClose={() => setShowSavePopup(false)} />

      {/* Mobile nav toggle + backdrop */}
      <button className="mobile-nav-toggle" aria-label="Menu" onClick={() => setNavOpen(o => !o)}>{navOpen ? "✕" : "☰"}</button>
      <div className={"sidebar-backdrop" + (navOpen ? " show" : "")} onClick={() => setNavOpen(false)} />

      {/* Sidebar */}
      <div className={"sidebar" + (navOpen ? " open" : "")} onClick={() => setNavOpen(false)}>
        <div className="sidebar-header">
          <div className="brand" style={{ cursor:"pointer" }} onClick={() => setPage("home")}>
            <img src="/acadhr-logo.png" alt="AcadHr" style={{ height:52, objectFit:"contain" }} />
          </div>
          <div style={{ fontSize:11, color:"#6B7280", marginTop:6, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Teacher Portal</div>
        </div>

        {/* Profile completion in sidebar */}
        <div style={{ padding:"16px 22px 14px", borderBottom:"1px solid #E5E7EB", background:"#F9FAFB" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <div style={{ width:46, height:46, borderRadius:"50%", overflow:"hidden", border:"2px solid #BFDBFE", flexShrink:0, background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {profile.profile_photo
                ? <img src={(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + profile.profile_photo} alt="Photo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <span style={{ fontSize:20 }}>👤</span>}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{profile.full_name || user.name}</div>
              <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>{profile.specialization || user.subject || "Educator"}</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:11, fontWeight:700 }}>
            <span style={{ color:"#374151" }}>Profile Complete</span>
            <span style={{ color:progressColor }}>{completion}%</span>
          </div>
          <div style={{ height:6, background:"#E5E7EB", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:6, borderRadius:3, background:progressColor, width:`${completion}%`, transition:"width .4s" }} />
          </div>
          {!canApply && (
            <div style={{ fontSize:10, color:"#DC2626", marginTop:5, fontWeight:600 }}>
              ⚠ Complete 70% to apply for jobs
            </div>
          )}
          {canApply && (
            <div style={{ fontSize:10, color:"#059669", marginTop:5, fontWeight:600 }}>
              ✓ You can apply for jobs
            </div>
          )}
        </div>

        <div className="sidebar-sec">Navigation</div>
        {MENU.map(m => (
          <div key={m.id} className={"s-item" + (tab===m.id?" active":"")}
            onClick={() => setTab(m.id)}>
            <span>{m.icon}</span>{m.label}
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:"20px 0" }}>
          <div className="sidebar-sec">Account</div>
          <div className="s-item" onClick={() => setPage("home")}>🏠 Back to Site</div>
          <div className="s-item" onClick={logout}>🚪 Logout</div>
        </div>
      </div>

      {/* Main */}
      <div className="main">

        {/* ══ OVERVIEW ══ */}
        {tab==="overview" && (
          <div className="fadeUp">
            <div className="page-title">Welcome back, {(profile.full_name||user.name).split(" ")[0]} 👋</div>
            <div className="page-sub">Your job search at a glance</div>

            {/* Profile completion banner */}
            <div style={{ background: canApply ? "#ECFDF5" : "#FFF7ED", border:`1px solid ${canApply?"#A7F3D0":"#FDE68A"}`, borderRadius:14, padding:"20px 24px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15, color: canApply?"#065F46":"#92400E", marginBottom:6 }}>
                  {canApply ? "✅ Profile Ready — You can apply for jobs!" : "⚠️ Complete your profile to apply for jobs"}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ flex:1, height:10, background:"#E5E7EB", borderRadius:5, maxWidth:300 }}>
                    <div style={{ height:10, borderRadius:5, background:progressColor, width:`${completion}%`, transition:"width .5s" }} />
                  </div>
                  <span style={{ fontWeight:800, fontSize:16, color:progressColor }}>{completion}%</span>
                </div>
                {!canApply && (
                  <div style={{ fontSize:12, color:"#92400E", marginTop:6 }}>
                    You need at least <strong>70%</strong> profile completion to apply. Currently at <strong>{completion}%</strong>.
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setTab("profile")}>
                {canApply ? "✏️ Edit Profile" : "Complete Profile →"}
              </button>
            </div>

            {/* KPI cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18, marginBottom:26 }}>
              {[["Applied",applications.length,"📋","#1A56DB"],["Shortlisted",applications.filter(a=>a.status==="Shortlisted").length,"⭐","#059669"]].map(([l,v,i,c]) => (
                <div key={l} className="card kpi">
                  <div className="kpi-icon">{i}</div>
                  <div className="kpi-num" style={{ color:c }}>{v}</div>
                  <div className="kpi-lbl">{l}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div className="card" style={{ padding:24 }}>
                <h3 style={{ fontSize:17, marginBottom:18 }}>Recent Applications</h3>
                {applications.slice(0,3).map((a,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<2?"1px solid #F3F4F6":"none" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{a.job}</div>
                      <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>{a.school} · {a.date}</div>
                    </div>
                    <span className={"badge "+a.sClass}>{a.status}</span>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ marginTop:14, width:"100%" }} onClick={() => setTab("applications")}>View All →</button>
              </div>

              <div className="card" style={{ padding:24, borderTop:"3px solid #1A56DB" }}>
                <h3 style={{ fontSize:17, marginBottom:6 }}>🔥 Recommended For You</h3>
                <p style={{ color:"#9CA3AF", fontSize:12, marginBottom:16 }}>Latest jobs from the database:</p>
                {recentJobs.length === 0 ? (
                  <div style={{ color:"#9CA3AF", fontSize:13, textAlign:"center", padding:"20px 0" }}>No jobs yet — check back soon</div>
                ) : recentJobs.map(j => (
                  <div key={j.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:18 }}>🏫</span>
                      <div>
                        <div style={{ fontWeight:600, fontSize:12, color:"#111827" }}>{j.title}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF" }}>{j.institution_name || j.posted_by_name || "School"}</div>
                      </div>
                    </div>
                    {canApply
                      ? <button className="btn btn-primary btn-sm" onClick={() => setTab("browse")}>Apply</button>
                      : <button className="btn btn-ghost btn-sm" title="Complete 70% profile to apply"
                          onClick={() => setTab("profile")} style={{ color:"#DC2626", borderColor:"#FECACA" }}>
                          🔒 {completion}%
                        </button>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ FULL PROFILE FORM ══ */}
        {/* ══ MY PROFILE ══ */}
        {tab==="profile" && (
          <div className="fadeUp">
            {profileLoading ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#6B7280" }}>
                <div style={{ width:40, height:40, border:"3px solid #E5E7EB", borderTopColor:"#1A56DB", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
                <div style={{ fontWeight:600 }}>Loading your profile...</div>
              </div>
            ) : !editMode ? (
              /* ── VIEW MODE: Beautiful profile card ── */
              <>
                {/* Profile Hero Card */}
                <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", borderRadius:20, padding:"32px 36px", marginBottom:20, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
                  <div style={{ position:"absolute", bottom:-60, right:60, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />
                  <div style={{ display:"flex", alignItems:"center", gap:24, position:"relative", zIndex:1 }}>
                    {/* Photo */}
                    <div style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden", border:"4px solid rgba(255,255,255,.3)", background:"#1A56DB", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {profile.profile_photo
                        ? <img src={(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + profile.profile_photo} alt="Profile" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <span style={{ fontSize:40 }}>👤</span>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:4 }}>{profile.full_name || user.name}</div>
                      <div style={{ color:"#93C5FD", fontSize:15, fontWeight:600, marginBottom:8 }}>
                        {profile.current_role || "Educator"}{profile.specialization ? ` · ${profile.specialization}` : ""}
                      </div>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                        {profile.current_location && <span style={{ color:"#BFDBFE", fontSize:13 }}>📍 {profile.current_location}</span>}
                        {profile.total_experience  && <span style={{ color:"#BFDBFE", fontSize:13 }}>⏳ {profile.total_experience}</span>}
                        {profile.teaching_mode     && <span style={{ color:"#BFDBFE", fontSize:13 }}>🖥 {profile.teaching_mode}</span>}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                      <button className="btn btn-sm" onClick={() => setEditMode(true)}
                        style={{ background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", backdropFilter:"blur(4px)" }}>
                        ✏️ Edit Profile
                      </button>
                      <div style={{ background:"rgba(255,255,255,.12)", borderRadius:20, padding:"4px 14px", fontSize:12, color:"#fff", fontWeight:700 }}>
                        {completion}% Complete
                      </div>
                    </div>
                  </div>
                  {/* Progress bar inside hero */}
                  <div style={{ marginTop:20, position:"relative", zIndex:1 }}>
                    <div style={{ height:6, background:"rgba(255,255,255,.2)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:6, borderRadius:3, background: completion>=70?"#34D399":completion>=40?"#FBBF24":"#F87171", width:`${completion}%`, transition:"width .5s" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"rgba(255,255,255,.6)" }}>
                      <span>0%</span>
                      <span style={{ color: completion>=70?"#34D399":"rgba(255,255,255,.6)" }}>70% — Can Apply</span>
                      <span style={{ color: completion>=100?"#34D399":"rgba(255,255,255,.6)" }}>100%</span>
                    </div>
                  </div>
                </div>

                {saved && <div className="alert a-ok" style={{ marginBottom:16 }}>✅ Profile saved! {completion}%{canApply?" — You can now apply for jobs 🎉":""}</div>}

                {/* Info cards grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

                  {/* About */}
                  <div className="card" style={{ padding:22 }}>
                    <div style={{ fontWeight:800, fontSize:12, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:14, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>👤 Personal Info</div>
                    {[
                      ["Full Name",    profile.full_name     || user.name, "👤"],
                      ["Email",        user.email,                         "📧"],
                      ["Phone",        profile.mobile,                     "📱"],
                      ["Gender",       profile.gender,                     "⚥"],
                      ["Date of Birth",profile.dob ? new Date(profile.dob).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : null, "🎂"],
                      ["Location",     profile.current_location,           "📍"],
                      ["Preferred Cities", profile.preferred_locations,    "🗺️"],
                    ].filter(([,v]) => v).map(([label, value, icon]) => (
                      <div key={label} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                        <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:1 }}>{label}</div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#111827", wordBreak:"break-word" }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Qualifications */}
                  <div className="card" style={{ padding:22 }}>
                    <div style={{ fontWeight:800, fontSize:12, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:14, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>🎓 Qualifications</div>
                    {[
                      ["Qualification",    profile.qualification,       "🎓"],
                      ["Specialization",   profile.specialization,      "📚"],
                      ["Certifications",   profile.certifications,      "📜"],
                      ["Total Experience", profile.total_experience,    "⏳"],
                      ["Teaching Exp",     profile.relevant_experience, "🏫"],
                      ["Current Role",     profile.current_role,        "💼"],
                      ["Organization",     profile.current_org,         "🏢"],
                    ].filter(([,v]) => v).map(([label, value, icon]) => (
                      <div key={label} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                        <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:1 }}>{label}</div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#111827", wordBreak:"break-word" }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Salary & Availability */}
                  <div className="card" style={{ padding:22 }}>
                    <div style={{ fontWeight:800, fontSize:12, color:"#059669", textTransform:"uppercase", letterSpacing:1, marginBottom:14, paddingBottom:8, borderBottom:"2px solid #ECFDF5" }}>💰 Salary & Availability</div>
                    {[
                      ["Current Salary",  profile.current_salary,  "💵"],
                      ["Expected Salary", profile.expected_salary, "💰"],
                      ["Notice Period",   profile.notice_period,   "📅"],
                      ["Available From",  profile.available_from ? new Date(profile.available_from).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : null, "🗓️"],
                      ["Work Mode",       profile.work_mode,       "🖥"],
                      ["Tutor Type",      profile.tutor_type,      "🧑‍🏫"],
                    ].filter(([,v]) => v).map(([label, value, icon]) => (
                      <div key={label} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                        <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:1 }}>{label}</div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Teaching Preferences */}
                  <div className="card" style={{ padding:22 }}>
                    <div style={{ fontWeight:800, fontSize:12, color:"#6D28D9", textTransform:"uppercase", letterSpacing:1, marginBottom:14, paddingBottom:8, borderBottom:"2px solid #F5F3FF" }}>📚 Teaching Preferences</div>
                    {profile.subjects && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Subjects</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {profile.subjects.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                            <span key={s} style={{ background:"#EBF5FF", color:"#1A56DB", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.grades_handling && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Grades</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {profile.grades_handling.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                            <span key={s} style={{ background:"#F5F3FF", color:"#6D28D9", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.boards_handled && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Boards</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {profile.boards_handled.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                            <span key={s} style={{ background:"#ECFDF5", color:"#059669", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.languages && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Languages</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {profile.languages.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                            <span key={s} style={{ background:"#FFFBEB", color:"#D97706", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.competitive_exams && (
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Competitive Exams</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {profile.competitive_exams.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                            <span key={s} style={{ background:"#FEF2F2", color:"#DC2626", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {!profile.subjects && !profile.grades_handling && !profile.boards_handled && (
                      <div style={{ color:"#9CA3AF", fontSize:13 }}>No teaching preferences added yet.</div>
                    )}
                  </div>
                </div>

                {/* Additional details row */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
                  {/* Demo */}
                  <div className="card" style={{ padding:18, textAlign:"center" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{profile.demo_available==="Yes"?"🎥":"📵"}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>Demo {profile.demo_available||"—"}</div>
                    <div style={{ fontSize:11, color:"#6B7280", marginTop:4 }}>Demo Video</div>
                    {profile.demo_link && <a href={profile.demo_link.split(",")[0].trim()} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#1A56DB", fontWeight:600, marginTop:6, display:"block" }}>Watch Demo →</a>}
                  </div>
                  {/* Relocation */}
                  <div className="card" style={{ padding:18, textAlign:"center" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{profile.relocation_ready==="Yes"?"✈️":"🏠"}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>Relocation: {profile.relocation_ready||"—"}</div>
                    <div style={{ fontSize:11, color:"#6B7280", marginTop:4 }}>Residential: {profile.residential_pref||"—"}</div>
                  </div>
                  {/* Aadhaar */}
                  <div className="card" style={{ padding:18, textAlign:"center" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{profile.aadhaar_verified==="Yes"?"✅":"⏳"}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>ID {profile.aadhaar_verified==="Yes"?"Verified":"Not Verified"}</div>
                    <div style={{ fontSize:11, color:"#6B7280", marginTop:4 }}>Aadhaar / ID Status</div>
                  </div>
                </div>

                {/* Resume */}
                <div className="card" style={{ padding:22, marginBottom:16, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:48, height:48, background:"#EBF5FF", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#111827", marginBottom:2 }}>Resume / CV</div>
                    {profile.resume_file_name
                      ? <span style={{ color:"#1A56DB", fontWeight:600, fontSize:13 }}>📎 {profile.resume_file_name}</span>
                      : profile.resume_link
                        ? <a href={profile.resume_link.startsWith("http") ? profile.resume_link : (process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + profile.resume_link} target="_blank" rel="noreferrer" style={{ color:"#1A56DB", fontWeight:600, fontSize:13 }}>🔗 View Resume</a>
                        : <span style={{ color:"#9CA3AF", fontSize:13 }}>No resume uploaded yet</span>}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>Update Resume</button>
                </div>

                {/* Remarks */}
                {profile.remarks && (
                  <div className="card" style={{ padding:22, background:"#FFFBEB", border:"1px solid #FDE68A" }}>
                    <div style={{ fontWeight:700, fontSize:12, color:"#D97706", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>📝 Notes</div>
                    <p style={{ fontSize:13, color:"#92400E", lineHeight:1.7, margin:0 }}>{profile.remarks}</p>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="card" style={{ padding:22, marginTop:16 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>📜 Terms &amp; Conditions</div>
                  <div style={{ maxHeight:170, overflowY:"auto", padding:"12px 14px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, fontSize:13, color:"#374151", lineHeight:1.7 }}>
                    <p style={{ marginTop:0 }}>By submitting this profile, the teacher confirms and agrees that:</p>
                    <ol style={{ paddingLeft:18, margin:0 }}>
                      <li>All information provided in this profile is true, accurate, and complete.</li>
                      <li>The documents, demo videos, and links shared (including Google Drive links) are genuine and owned by the teacher.</li>
                      <li>AcadHr is authorized to share this profile with registered schools, institutions, and recruiters for hiring purposes.</li>
                      <li>Providing false or misleading information may lead to rejection or removal of the profile.</li>
                      <li>The teacher agrees to be contacted by AcadHr and prospective employers regarding suitable job opportunities.</li>
                    </ol>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12, fontSize:13, fontWeight:700, color: profile.terms_accepted==="Yes" ? "#059669" : "#9CA3AF" }}>
                    <span>{profile.terms_accepted==="Yes" ? "✅ Accepted" : "⬜ Not accepted yet"}</span>
                    {profile.terms_accepted!=="Yes" && <button className="btn btn-sm" onClick={() => setEditMode(true)} style={{ marginLeft:"auto" }}>Review &amp; Accept</button>}
                  </div>
                </div>

                {/* Edit button at bottom */}
                <div style={{ marginTop:20, textAlign:"center" }}>
                  <button className="btn btn-primary" style={{ justifyContent:"center", minWidth:200 }} onClick={() => setEditMode(true)}>
                    ✏️ Edit Profile
                  </button>
                </div>
              </>
            ) : (
              /* ── EDIT MODE: Form ── */
              <>
{/* ── Section 1: Basic Info ── */}
            <div className="card" style={{ padding:28, marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>
                👤 Basic Information
              </div>

              {/* Profile Photo */}
              <div className="fg" style={{ marginBottom:20 }}>
                <label className="flabel">Profile Photo</label>
                <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:6 }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", overflow:"hidden", border:"3px solid #BFDBFE", background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {profile.profile_photo
                      ? <img src={(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + profile.profile_photo} alt="Profile" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <span style={{ fontSize:36 }}>👤</span>}
                  </div>
                  {editMode && (
                    <div>
                      <input type="file" id="photo-upload" accept="image/jpeg,image/png,image/webp" style={{ display:"none" }}
                        onChange={async e => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("photo", file);
                          const token = localStorage.getItem("acadhr_token");
                          try {
                            const r = await fetch(
                              (process.env.REACT_APP_API_URL||"http://localhost:5000/api") + "/teacher/upload-photo",
                              { method:"POST", headers: token ? { Authorization:"Bearer "+token } : {}, body: fd }
                            );
                            const d = await r.json();
                            if (r.ok) { up("profile_photo", d.photo_url); }
                            else alert("Upload failed: " + d.message);
                          } catch(err) { alert("Upload error: " + err.message); }
                        }}
                      />
                      <label htmlFor="photo-upload" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", background:"#EBF5FF", border:"1.5px dashed #1A56DB", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, color:"#1A56DB" }}>
                        📷 Upload Photo
                      </label>
                      <div style={{ fontSize:11, color:"#9CA3AF", marginTop:5 }}>JPG / PNG / WEBP · Max 5MB</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid2">
                <div className="fg"><label className="flabel">Full Name *</label>
                  <input className="input" readOnly={!editMode} value={profile.full_name} onChange={e => up("full_name",e.target.value)} placeholder="Your full name" style={{ background: !editMode?"#F9FAFB":"#fff" }} />
                </div>
                <div className="fg"><label className="flabel">Mobile Number *</label>
                  <input className="input" readOnly={!editMode} value={profile.mobile} onChange={e => up("mobile",e.target.value)} placeholder="+91 98765 43210" style={{ background: !editMode?"#F9FAFB":"#fff" }} />
                </div>
              </div>
              <div className="grid2">
                <div className="fg"><label className="flabel">Email ID *</label>
                  <input className="input" readOnly value={profile.email} style={{ background:"#F9FAFB", color:"#6B7280" }} />
                </div>
                <div className="fg"><label className="flabel">Date of Birth *</label>
                  <input className="input" type="date" readOnly={!editMode} value={profile.dob} onChange={e => up("dob",e.target.value)} style={{ background: !editMode?"#F9FAFB":"#fff" }} />
                </div>
              </div>

              {/* Gender — radio buttons */}
              <div className="fg">
                <label className="flabel">Gender *</label>
                <div style={{ display:"flex", gap:10, marginTop:6, flexWrap:"wrap" }}>
                  {["Male","Female","Prefer not to say"].map(g => (
                    <label key={g} onClick={() => editMode && up("gender",g)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:22, border:`2px solid ${profile.gender===g?"#1A56DB":"#D1D5DB"}`, background:profile.gender===g?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.gender===g?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${profile.gender===g?"#1A56DB":"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {profile.gender===g && <div style={{ width:6, height:6, borderRadius:"50%", background:"#1A56DB" }} />}
                      </div>
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid2">
                <div className="fg"><label className="flabel">Current Location (City) *</label>
                  <input className="input" readOnly={!editMode} value={profile.current_location} onChange={e => up("current_location",e.target.value)} placeholder="e.g. Hyderabad" style={{ background: !editMode?"#F9FAFB":"#fff" }} />
                </div>
                <div className="fg"><label className="flabel">Preferred Locations (select multiple cities)</label>
                  {editMode && (
                    <select className="input" value="" onChange={e => {
                      const city = e.target.value;
                      if (!city) return;
                      const cur = profile.preferred_locations ? profile.preferred_locations.split(",").map(x=>x.trim()).filter(Boolean) : [];
                      if (!cur.includes(city)) up("preferred_locations", [...cur, city].join(", "));
                    }} style={{ background:"#fff" }}>
                      <option value="">+ Add city (you can select multiple)</option>
                      {Object.entries(INDIA_LOCATIONS).map(([state, cities]) => (
                        <optgroup key={state} label={state}>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  )}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop: editMode?8:0 }}>
                    {(profile.preferred_locations ? profile.preferred_locations.split(",").map(x=>x.trim()).filter(Boolean) : []).map(c => (
                      <span key={c} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, border:"1.5px solid #1A56DB", background:"#EBF5FF", fontSize:12, fontWeight:700, color:"#1A56DB" }}>
                        {c}
                        {editMode && (
                          <span onClick={() => {
                            const cur = profile.preferred_locations.split(",").map(x=>x.trim()).filter(Boolean).filter(x=>x!==c);
                            up("preferred_locations", cur.join(", "));
                          }} style={{ cursor:"pointer", fontWeight:900 }}>×</span>
                        )}
                      </span>
                    ))}
                    {!profile.preferred_locations && !editMode && <span style={{ color:"#9CA3AF", fontSize:13 }}>—</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Qualifications & Experience ── */}
            <div className="card" style={{ padding:28, marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>
                🎓 Qualifications & Experience
              </div>

              {/* Qualification — multi-select pills */}
              <div className="fg">
                <label className="flabel">Qualification * (B.Sc / M.Sc / B.Tech etc — select one or more)</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["B.Sc","M.Sc","B.Tech","M.Tech","B.Ed","M.Ed","PhD","Diploma","B.A","M.A","B.Com","M.Com","B.E","BCA","MCA","BBA","MBA","M.Phil"].map(q => {
                    const on = (profile.qualification||"").split(",").map(x=>x.trim()).filter(Boolean).includes(q);
                    return (
                    <label key={q} onClick={() => editMode && up("qualification", ((profile.qualification||"").split(",").map(x=>x.trim()).filter(Boolean).includes(q) ? (profile.qualification||"").split(",").map(x=>x.trim()).filter(Boolean).filter(x=>x!==q) : [...(profile.qualification||"").split(",").map(x=>x.trim()).filter(Boolean), q]).join(", "))}
                      style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${on?"#1A56DB":"#D1D5DB"}`, background:on?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:on?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                      {on?"✓ ":""}{q}
                    </label>
                    );
                  })}
                </div>
              </div>

              {/* Specialization — dropdown */}
              <div className="grid2">
                <div className="fg"><label className="flabel">Specialization / Subject * (select at least 3)</label>
                  {editMode && (
                    <select className="input" value="" onChange={e => {
                      const sub = e.target.value;
                      if (!sub) return;
                      const cur = profile.specialization ? profile.specialization.split(",").map(x=>x.trim()).filter(Boolean) : [];
                      if (!cur.includes(sub)) up("specialization", [...cur, sub].join(", "));
                    }} style={{ background:"#fff" }}>
                      <option value="">+ Add subject (you can select multiple)</option>
                      {["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Telugu","Kannada","Tamil","History","Geography","Civics","Accountancy","Business Studies"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop: editMode?8:0 }}>
                    {(profile.specialization ? profile.specialization.split(",").map(x=>x.trim()).filter(Boolean) : []).map(s => (
                      <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, border:"1.5px solid #1A56DB", background:"#EBF5FF", fontSize:12, fontWeight:700, color:"#1A56DB" }}>
                        {s}
                        {editMode && (
                          <span onClick={() => {
                            const cur = profile.specialization.split(",").map(x=>x.trim()).filter(Boolean).filter(x=>x!==s);
                            up("specialization", cur.join(", "));
                          }} style={{ cursor:"pointer", fontWeight:900 }}>×</span>
                        )}
                      </span>
                    ))}
                    {!profile.specialization && !editMode && <span style={{ color:"#9CA3AF", fontSize:13 }}>—</span>}
                  </div>
                </div>
                <div className="fg"><label className="flabel">Current Role *</label>
                  <select className="input" value={profile.current_role} onChange={e => editMode && up("current_role",e.target.value)} style={{ background: !editMode?"#F9FAFB":"#fff", pointerEvents: editMode?"auto":"none" }}>
                    <option value="">Select role</option>
                    <option>Teacher</option><option>Faculty</option><option>Tutor</option><option>Lecturer</option><option>HOD</option><option>PGT</option><option>TGT</option><option>PRT</option><option>Fresher</option>
                  </select>
                </div>
              </div>

              {/* Total Experience — radio pills */}
              <div className="fg">
                <label className="flabel">Total Experience *</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["Fresher","Less than 1 Year","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years","15+ Years","20+ Years"].map(exp => (
                    <label key={exp} onClick={() => editMode && up("total_experience",exp)}
                      style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${profile.total_experience===exp?"#1A56DB":"#D1D5DB"}`, background:profile.total_experience===exp?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:profile.total_experience===exp?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                      {profile.total_experience===exp?"● ":"○ "}{exp}
                    </label>
                  ))}
                </div>
              </div>

              {/* Relevant Experience — radio pills */}
              <div className="fg">
                <label className="flabel">Relevant Teaching Experience *</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["Fresher","Less than 1 Year","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years","15+ Years","20+ Years"].map(exp => (
                    <label key={exp} onClick={() => editMode && up("relevant_experience",exp)}
                      style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${profile.relevant_experience===exp?"#059669":"#D1D5DB"}`, background:profile.relevant_experience===exp?"#ECFDF5":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:profile.relevant_experience===exp?"#059669":"#374151", transition:"all .15s", userSelect:"none" }}>
                      {profile.relevant_experience===exp?"● ":"○ "}{exp}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid2">
                <div className="fg"><label className="flabel">Current Organization</label>
                  <input className="input" readOnly={!editMode} value={profile.current_org} onChange={e => up("current_org",e.target.value)} placeholder="School / Coaching name" style={{ background: !editMode?"#F9FAFB":"#fff" }} />
                </div>
                <div className="fg"><label className="flabel">Available From</label>
                  <input className="input" type="date" readOnly={!editMode} value={profile.available_from} onChange={e => up("available_from",e.target.value)} style={{ background: !editMode?"#F9FAFB":"#fff" }} />
                </div>
              </div>

              {/* Current Salary — dropdown */}
              <div className="grid2">
                <div className="fg"><label className="flabel">Current Salary (Monthly)</label>
                  <select className="input" value={profile.current_salary} onChange={e => editMode && up("current_salary",e.target.value)} style={{ background: !editMode?"#F9FAFB":"#fff", pointerEvents: editMode?"auto":"none" }}>
                    <option value="">Select range</option>
                    <option>Below ₹20,000</option><option>₹20,000–₹40,000</option><option>₹40,000–₹60,000</option>
                    <option>₹60,000–₹80,000</option><option>₹80,000–₹100,000</option><option>₹100,000–₹120,000</option>
                    {/* <option>₹50,000–₹70,000</option><option>₹70,000–₹1,00,000</option><option>Above ₹1,00,000</option> */}
                  </select>
                </div>
                <div className="fg"><label className="flabel">Expected Salary (Monthly)</label>
                  <select className="input" value={profile.expected_salary} onChange={e => editMode && up("expected_salary",e.target.value)} style={{ background: !editMode?"#F9FAFB":"#fff", pointerEvents: editMode?"auto":"none" }}>
                    <option value="">Select range</option>
                    <option>Below ₹20,000</option><option>₹20,000–₹40,000</option><option>₹40,000–₹60,000</option>
                    <option>₹60,000–₹80,000</option><option>₹80,000–₹100,000</option><option>₹100,000–₹120,000</option>
                    <option>₹120,000–₹140,000</option><option>₹140,000–₹160,000</option><option>₹160,000–₹180,000</option>
                    <option>₹180,000–₹200,000</option><option>Above ₹2,00,000</option><option>Above ₹3,00,000</option><option>Above ₹4,00,000</option><option>Above ₹5,00,000</option><option>Above ₹6,00,000</option>
                  </select>
                </div>
              </div>

              {/* Notice Period — radio pills */}
              <div className="fg">
                <label className="flabel">Notice Period</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["Immediate","15 Days","30 Days","45 Days","60 Days","90 Days"].map(np => (
                    <label key={np} onClick={() => editMode && up("notice_period",np)}
                      style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${profile.notice_period===np?"#D97706":"#D1D5DB"}`, background:profile.notice_period===np?"#FFFBEB":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:profile.notice_period===np?"#D97706":"#374151", transition:"all .15s", userSelect:"none" }}>
                      {profile.notice_period===np?"● ":"○ "}{np}
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications — multi-select pills */}
              <div className="fg">
                <label className="flabel">Certifications</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["B.Ed","M.Ed","CTET","TET (State)","NET","SET","NTT","D.El.Ed","BTC","PGDCA","None"].map(c => {
                    const selected = profile.certifications.includes(c);
                    return (
                      <label key={c} onClick={() => {
                        if (!editMode) return;
                        const cur = profile.certifications ? profile.certifications.split(",").map(x=>x.trim()).filter(Boolean) : [];
                        const next = cur.includes(c) ? cur.filter(x=>x!==c) : [...cur,c];
                        up("certifications", next.join(", "));
                      }}
                        style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${selected?"#6D28D9":"#D1D5DB"}`, background:selected?"#F5F3FF":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:selected?"#6D28D9":"#374151", transition:"all .15s", userSelect:"none" }}>
                        {selected?"✓ ":""}{c}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Section 3: Teaching Preferences ── */}
            <div className="card" style={{ padding:28, marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>
                📚 Teaching Preferences
              </div>

              {/* Work Mode — radio pills */}
              <div className="fg">
                <label className="flabel">Work Mode *</label>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:6 }}>
                  {["Full-time","Part-time","Online","Hybrid"].map(m => (
                    <label key={m} onClick={() => editMode && up("work_mode",m)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:22, border:`2px solid ${profile.work_mode===m?"#1A56DB":"#D1D5DB"}`, background:profile.work_mode===m?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.work_mode===m?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${profile.work_mode===m?"#1A56DB":"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {profile.work_mode===m && <div style={{ width:6, height:6, borderRadius:"50%", background:"#1A56DB" }} />}
                      </div>
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tutor Type — radio pills */}
              <div className="fg">
                <label className="flabel">Tutor Type</label>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:6 }}>
                  {["School Teacher","Coaching Faculty","Home Tutor","Online Tutor"].map(t => (
                    <label key={t} onClick={() => editMode && up("tutor_type",t)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:22, border:`2px solid ${profile.tutor_type===t?"#0EA5E9":"#D1D5DB"}`, background:profile.tutor_type===t?"#E0F2FE":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.tutor_type===t?"#0369A1":"#374151", transition:"all .15s", userSelect:"none" }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${profile.tutor_type===t?"#0EA5E9":"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {profile.tutor_type===t && <div style={{ width:6, height:6, borderRadius:"50%", background:"#0EA5E9" }} />}
                      </div>
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {/* Subjects — multi-select pills */}
              <div className="fg">
                <label className="flabel">Subjects * (select all you teach)</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Telugu","Kannada","Tamil","Accountancy","Business Studies","History","Geography"].map(s => {
                    const sel = profile.subjects.includes(s);
                    return (
                      <label key={s} onClick={() => {
                        if (!editMode) return;
                        const cur = profile.subjects ? profile.subjects.split(",").map(x=>x.trim()).filter(Boolean) : [];
                        const next = cur.includes(s) ? cur.filter(x=>x!==s) : [...cur,s];
                        up("subjects", next.join(", "));
                      }}
                        style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${sel?"#1A56DB":"#D1D5DB"}`, background:sel?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:sel?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                        {sel?"✓ ":""}{s}
                      </label>
                    );
                  })}
                </div>
                {profile.subjects && <div style={{ fontSize:11, color:"#6B7280", marginTop:5 }}>Selected: {profile.subjects}</div>}
              </div>

              {/* Grades — multi-select pills */}
              <div className="fg">
                <label className="flabel">Grades Handling * (select all applicable)</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["Pre-Primary (Nursery–KG)","Primary (1–5)","Upper Primary (6–8)","Secondary (9–10)","Senior Secondary (11–12)","All Grades","Degree Level","Diploma Level"].map(g => {
                    const sel = profile.grades_handling.includes(g);
                    return (
                      <label key={g} onClick={() => {
                        if (!editMode) return;
                        const cur = profile.grades_handling ? profile.grades_handling.split(",").map(x=>x.trim()).filter(Boolean) : [];
                        const next = cur.includes(g) ? cur.filter(x=>x!==g) : [...cur,g];
                        up("grades_handling", next.join(", "));
                      }}
                        style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${sel?"#1A56DB":"#D1D5DB"}`, background:sel?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:sel?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                        {sel?"✓ ":""}{g}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Boards — multi-select pills */}
              <div className="fg">
                <label className="flabel">Boards Handled * (CBSE / ICSE / State)</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["CBSE","ICSE","State Board (AP)","State Board (TS)","State Board (KA)","State Board (MH)","IB","IGCSE","All Boards"].map(b => {
                    const sel = profile.boards_handled.includes(b);
                    return (
                      <label key={b} onClick={() => {
                        if (!editMode) return;
                        const cur = profile.boards_handled ? profile.boards_handled.split(",").map(x=>x.trim()).filter(Boolean) : [];
                        const next = cur.includes(b) ? cur.filter(x=>x!==b) : [...cur,b];
                        up("boards_handled", next.join(", "));
                      }}
                        style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${sel?"#059669":"#D1D5DB"}`, background:sel?"#ECFDF5":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:sel?"#059669":"#374151", transition:"all .15s", userSelect:"none" }}>
                        {sel?"✓ ":""}{b}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Competitive Exams — multi-select pills */}
              <div className="fg">
                <label className="flabel">Competitive Exams Handled</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["JEE (Mains)","JEE (Advanced)","NEET","EAMCET","Olympiad","NTSE","NDA","UPSC","CA Foundation","State SET"].map(ex => {
                    const sel = profile.competitive_exams.includes(ex);
                    return (
                      <label key={ex} onClick={() => {
                        if (!editMode) return;
                        const cur = profile.competitive_exams ? profile.competitive_exams.split(",").map(x=>x.trim()).filter(Boolean) : [];
                        const next = cur.includes(ex) ? cur.filter(x=>x!==ex) : [...cur,ex];
                        up("competitive_exams", next.join(", "));
                      }}
                        style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${sel?"#6D28D9":"#D1D5DB"}`, background:sel?"#F5F3FF":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:sel?"#6D28D9":"#374151", transition:"all .15s", userSelect:"none" }}>
                        {sel?"✓ ":""}{ex}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Teaching Mode — radio pills */}
              <div className="fg">
                <label className="flabel">Teaching Mode *</label>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:6 }}>
                  {["Offline","Online","Hybrid (Both)"].map(m => (
                    <label key={m} onClick={() => editMode && up("teaching_mode",m)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:22, border:`2px solid ${profile.teaching_mode===m?"#1A56DB":"#D1D5DB"}`, background:profile.teaching_mode===m?"#EBF5FF":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.teaching_mode===m?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${profile.teaching_mode===m?"#1A56DB":"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {profile.teaching_mode===m && <div style={{ width:6, height:6, borderRadius:"50%", background:"#1A56DB" }} />}
                      </div>
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages — multi-select pills */}
              <div className="fg">
                <label className="flabel">Languages Known *</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                  {["English","Hindi","Telugu","Kannada","Tamil","Malayalam","Marathi","Bengali","Gujarati","Punjabi","Urdu","Odia"].map(l => {
                    const sel = profile.languages.includes(l);
                    return (
                      <label key={l} onClick={() => {
                        if (!editMode) return;
                        const cur = profile.languages ? profile.languages.split(",").map(x=>x.trim()).filter(Boolean) : [];
                        const next = cur.includes(l) ? cur.filter(x=>x!==l) : [...cur,l];
                        up("languages", next.join(", "));
                      }}
                        style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${sel?"#D97706":"#D1D5DB"}`, background:sel?"#FFFBEB":"#fff", cursor:editMode?"pointer":"default", fontSize:12, fontWeight:700, color:sel?"#D97706":"#374151", transition:"all .15s", userSelect:"none" }}>
                        {sel?"✓ ":""}{l}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Section 4: Demo & Additional ── */}
            <div className="card" style={{ padding:28, marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>
                🎥 Demo & Additional Details
              </div>

              {/* Demo Available — radio */}
              <div className="fg">
                <label className="flabel">Demo Available</label>
                <div style={{ display:"flex", gap:10, marginTop:6 }}>
                  {["Yes","No"].map(v => (
                    <label key={v} onClick={() => editMode && up("demo_available",v)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 20px", borderRadius:22, border:`2px solid ${profile.demo_available===v?"#059669":"#D1D5DB"}`, background:profile.demo_available===v?"#ECFDF5":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.demo_available===v?"#059669":"#374151", transition:"all .15s", userSelect:"none" }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${profile.demo_available===v?"#059669":"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {profile.demo_available===v && <div style={{ width:6, height:6, borderRadius:"50%", background:"#059669" }} />}
                      </div>
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div className="fg"><label className="flabel">Demo Link (Video URL)</label>
                <div style={{ fontSize:12, color:"#6B7280", marginTop:2, marginBottom:8, lineHeight:1.6 }}>
                  📁 Paste your demo video as a <strong>Google Drive</strong> link (e.g. <span style={{ color:"#1A56DB" }}>https://drive.google.com/file/d/.../view</span>). You can add a minimum of 1 and a maximum of 3 links.
                </div>
                {editMode ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {demoLinks.map((link, idx) => {
                      const invalid = link.trim() !== "" && !link.includes("drive.google.com");
                      return (
                        <div key={idx}>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            <input className="input" value={link} onChange={e => setDemoLinkAt(idx, e.target.value)} placeholder="https://drive.google.com/file/d/.../view?usp=sharing" style={{ background:"#fff", flex:1 }} />
                            {demoLinks.length > 1 && (
                              <button type="button" onClick={() => removeDemoLink(idx)} title="Remove this link"
                                style={{ flexShrink:0, width:38, height:38, borderRadius:8, border:"1.5px solid #FCA5A5", background:"#FEF2F2", color:"#DC2626", fontWeight:900, fontSize:16, cursor:"pointer" }}>×</button>
                            )}
                          </div>
                          {invalid && <div style={{ fontSize:11, color:"#DC2626", marginTop:4 }}>⚠️ This doesn't look like a Google Drive link.</div>}
                        </div>
                      );
                    })}
                    {demoLinks.length < DEMO_MAX && (
                      <button type="button" onClick={addDemoLink}
                        style={{ alignSelf:"flex-start", padding:"8px 16px", borderRadius:8, border:"1.5px dashed #1A56DB", background:"#EBF5FF", color:"#1A56DB", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                        + Add another link ({demoLinks.length}/{DEMO_MAX})
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {(profile.demo_link ? profile.demo_link.split(",").map(x=>x.trim()).filter(Boolean) : []).map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#1A56DB", fontWeight:600 }}>🔗 Demo Link {idx+1}</a>
                    ))}
                    {!profile.demo_link && <span style={{ color:"#9CA3AF", fontSize:13 }}>No demo link added yet</span>}
                  </div>
                )}
              </div>

              {/* Yes/No radio group for 4 fields */}
              <div className="grid2">
                {[
                  ["Residential Preference","residential_pref","#1A56DB"],
                  ["Relocation Ready","relocation_ready","#1A56DB"],
                  ["Accommodation Required","accommodation_req","#DC2626"],
                  ["Aadhaar / ID Verified","aadhaar_verified","#059669"],
                ].map(([label, key, color]) => (
                  <div key={key} className="fg">
                    <label className="flabel">{label}</label>
                    <div style={{ display:"flex", gap:10, marginTop:6 }}>
                      {["Yes","No"].map(v => (
                        <label key={v} onClick={() => editMode && up(key,v)}
                          style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 18px", borderRadius:22, border:`2px solid ${profile[key]===v?color:"#D1D5DB"}`, background:profile[key]===v?color+"15":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile[key]===v?color:"#374151", transition:"all .15s", userSelect:"none" }}>
                          <div style={{ width:13, height:13, borderRadius:"50%", border:`2px solid ${profile[key]===v?color:"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {profile[key]===v && <div style={{ width:5, height:5, borderRadius:"50%", background:color }} />}
                          </div>
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile Status — radio */}
              <div className="fg">
                <label className="flabel">Profile Status</label>
                <div style={{ display:"flex", gap:10, marginTop:6 }}>
                  {[["Active","#059669"],["Inactive","#DC2626"]].map(([v,color]) => (
                    <label key={v} onClick={() => editMode && up("profile_status",v)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 20px", borderRadius:22, border:`2px solid ${profile.profile_status===v?color:"#D1D5DB"}`, background:profile.profile_status===v?color+"18":"#fff", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.profile_status===v?color:"#374151", transition:"all .15s", userSelect:"none" }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:profile.profile_status===v?color:"#D1D5DB" }} />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="fg">
                <label className="flabel">Resume Upload / Link</label>
                {editMode ? (
                  <div>
                    <input type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} id="resume-upload"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) { up("resume_file_name", file.name); up("resume_link",""); }
                      }} />
                    <div style={{ display:"flex", gap:8, flexDirection:"column" }}>
                      <label htmlFor="resume-upload" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 16px", background:"#EBF5FF", border:"2px dashed #1A56DB", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13, color:"#1A56DB" }}>
                        📎 {profile.resume_file_name ? "✓ "+profile.resume_file_name : "Click to upload Resume (PDF / DOC / DOCX)"}
                      </label>
                      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#9CA3AF" }}>
                        <div style={{ flex:1, height:1, background:"#E5E7EB" }} /><span>OR paste Google Drive link</span><div style={{ flex:1, height:1, background:"#E5E7EB" }} />
                      </div>
                      <input className="input" value={profile.resume_link} onChange={e => { up("resume_link",e.target.value); up("resume_file_name",""); }} placeholder="https://drive.google.com/file/..." />
                    </div>
                  </div>
                ) : (
                  <div style={{ padding:"12px 14px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, fontSize:13 }}>
                    {profile.resume_file_name
                      ? <span style={{ color:"#1A56DB", fontWeight:600 }}>📎 {profile.resume_file_name}</span>
                      : profile.resume_link
                        ? <a href={profile.resume_link} target="_blank" rel="noreferrer" style={{ color:"#1A56DB", fontWeight:600 }}>🔗 View Resume</a>
                        : <span style={{ color:"#9CA3AF" }}>No resume uploaded yet</span>}
                  </div>
                )}
              </div>

              <div className="fg"><label className="flabel">Remarks / Notes</label>
                <textarea className="input" readOnly={!editMode} rows={3} value={profile.remarks} onChange={e => up("remarks",e.target.value)} placeholder="Any additional information..." style={{ background: !editMode?"#F9FAFB":"#fff" }} />
              </div>
            </div>

            {/* ── Section 5: Terms & Conditions ── */}
            <div className="card" style={{ padding:28, marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>
                📜 Terms & Conditions
              </div>
              <div style={{ maxHeight:200, overflowY:"auto", padding:"14px 16px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, fontSize:13, color:"#374151", lineHeight:1.7 }}>
                <p style={{ marginTop:0 }}>By submitting this profile, I confirm and agree that:</p>
                <ol style={{ paddingLeft:18, margin:0 }}>
                  <li>All information provided in this profile is true, accurate, and complete to the best of my knowledge.</li>
                  <li>The documents, demo videos, and links I share (including Google Drive links) are genuine and belong to me.</li>
                  <li>I authorize AcadHr to share my profile with registered schools, institutions, and recruiters for hiring purposes.</li>
                  <li>I understand that providing false or misleading information may lead to rejection or removal of my profile.</li>
                  <li>I agree to be contacted by AcadHr and prospective employers regarding suitable job opportunities.</li>
                </ol>
              </div>
              <label onClick={() => editMode && up("terms_accepted", profile.terms_accepted==="Yes" ? "No" : "Yes")}
                style={{ display:"flex", alignItems:"center", gap:10, marginTop:14, cursor:editMode?"pointer":"default", userSelect:"none" }}>
                <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${profile.terms_accepted==="Yes"?"#059669":"#9CA3AF"}`, background:profile.terms_accepted==="Yes"?"#059669":"#fff", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:900, flexShrink:0 }}>
                  {profile.terms_accepted==="Yes" ? "✓" : ""}
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>I have read and accept the Terms &amp; Conditions</span>
              </label>
            </div>

                <div style={{ display:"flex", gap:10, marginBottom:20, marginTop:8 }}>
                  <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={() => { setEditMode(false); setSaved(false); }}>✕ Cancel</button>
                  <button className="btn btn-primary" style={{ flex:2, justifyContent:"center" }} onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes ✓"}</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ BROWSE JOBS (inline) ══ */}
        {tab==="browse" && (
          <div className="fadeUp">
            <div className="page-title">Browse Jobs</div>
            <div className="page-sub">All available teaching positions</div>
            {!canApply && (
              <div className="alert a-warn" style={{ marginBottom:16 }}>
                ⚠️ Complete <strong>70%</strong> of your profile to apply. Currently at <strong>{completion}%</strong>.
                <button className="btn btn-primary btn-sm" style={{ marginLeft:12 }} onClick={() => setTab("profile")}>Complete Profile</button>
              </div>
            )}
            <InlineBrowseJobs user={user} canApply={canApply}
              onApplyBlocked={() => { setTab("profile"); }} />
          </div>
        )}

        {/* ══ APPLICATIONS ══ */}
        {tab==="applications" && (
          <div className="fadeUp">
            <div className="page-title">My Applications</div>
            <div className="page-sub">Track all your job applications</div>
            {!canApply && (
              <div className="alert a-warn" style={{ marginBottom:20 }}>
                ⚠️ Your profile is only <strong>{completion}%</strong> complete. Complete at least <strong>70%</strong> to apply for new jobs.
                <button className="btn btn-primary btn-sm" style={{ marginLeft:16 }} onClick={() => setTab("profile")}>Complete Profile</button>
              </div>
            )}
            <FilterBar filters={appFilterT} setFilters={setAppFilterT} fields={[
              { key:"job",    type:"text",   placeholder:"🔍 Search position...",  width:220 },
              { key:"school", type:"text",   placeholder:"🏫 Institution...",       width:200 },
              { key:"status", type:"select", placeholder:"All Statuses",            width:170,
                options:["Shortlisted","Under Review","Not Selected"] },
            ]} />
            {appsLoading ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#6B7280" }}>
                <div style={{ width:36, height:36, border:"3px solid #E5E7EB", borderTopColor:"#1A56DB", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 14px" }} />
                <div style={{ fontWeight:600 }}>Loading your applications...</div>
              </div>
            ) : applications.length === 0 ? (
              <div className="card" style={{ padding:64, textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:16 }}>📋</div>
                <h3 style={{ fontSize:18, fontWeight:800, marginBottom:8, color:"#111827" }}>No Applications Yet</h3>
                <p style={{ color:"#6B7280", fontSize:14, marginBottom:20 }}>You haven't applied to any jobs yet.</p>
                <button className="btn btn-primary" onClick={() => setTab("browse")}>Browse Jobs →</button>
              </div>
            ) : (
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Position</th><th>Institution</th><th>Subject</th><th>Location</th><th>Applied On</th><th>Status</th></tr></thead>
                    <tbody>{applications.filter(a =>
                        (!appFilterT.job    || a.job.toLowerCase().includes(appFilterT.job.toLowerCase())) &&
                        (!appFilterT.school || a.school.toLowerCase().includes(appFilterT.school.toLowerCase())) &&
                        (!appFilterT.status || a.status === appFilterT.status)
                      ).map((a,i) => (
                      <tr key={i}>
                        <td><strong style={{ color:"#111827" }}>{a.job}</strong>
                          {a.salary && <div style={{ fontSize:11, color:"#059669", fontWeight:600, marginTop:2 }}>{a.salary}</div>}
                        </td>
                        <td>{a.school}</td>
                        <td style={{ color:"#6B7280" }}>{a.subject||"—"}</td>
                        <td style={{ color:"#6B7280" }}>{a.location||"—"}</td>
                        <td style={{ color:"#9CA3AF" }}>{a.date}</td>
                        <td><span className={"badge "+a.sClass}>{a.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {tab==="analytics" && (
          <div className="fadeUp">
            <div className="page-title">Analytics</div>
            <div className="page-sub">Your performance insights</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:24 }}>
              {[
                ["Profile Views","0","👁","#1A56DB"],
                ["Applications Sent",applications.length,"📋","#059669"],
                ["Shortlisted",applications.filter(a=>a.status==="Shortlisted").length,"⭐","#D97706"],
              ].map(([l,v,i,c]) => (
                <div key={l} className="card" style={{ padding:24, textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{i}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
                  <div style={{ fontSize:12, color:"#6B7280", fontWeight:600, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:40, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
              <h3>Analytics Coming Soon</h3>
              <p style={{ color:"#6B7280", fontSize:14, marginTop:8 }}>Detailed profile views, search appearances, and application analytics will appear here.</p>
            </div>
          </div>
        )}

        {/* ══ RESUME & DOCS ══ */}
        {tab==="resume" && (
          <div className="fadeUp">
            <div className="page-title">Resume & Documents</div>
            <div className="page-sub">Upload and manage your resume</div>

            {/* Resume card */}
            <div className="card" style={{ padding:28, marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>
                📄 Resume / CV
              </div>

              {/* Current resume status */}
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
                <div style={{ width:56, height:56, background:"#EBF5FF", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>📄</div>
                <div style={{ flex:1 }}>
                  {profile.resume_file_name ? (
                    <>
                      <div style={{ fontWeight:700, color:"#111827", marginBottom:4 }}>📎 {profile.resume_file_name}</div>
                      <div style={{ fontSize:12, color:"#059669", fontWeight:600 }}>✓ Resume uploaded successfully</div>
                    </>
                  ) : profile.resume_link ? (
                    <>
                      <div style={{ fontWeight:700, color:"#111827", marginBottom:4 }}>🔗 External Link</div>
                      <a href={profile.resume_link} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#1A56DB" }}>
                        {profile.resume_link.slice(0, 60)}...
                      </a>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight:700, color:"#9CA3AF", marginBottom:4 }}>No resume uploaded yet</div>
                      <div style={{ fontSize:12, color:"#9CA3AF" }}>Upload a PDF or DOC file (max 10MB)</div>
                    </>
                  )}
                </div>
                {/* View button */}
                {(profile.resume_link || profile.resume_file_name) && (() => {
                  const link = profile.resume_link || "";
                  const BASE = (process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","");
                  const url  = link.startsWith("http") ? link : link ? BASE + link : null;
                  return url ? (
                    <a href={url} target="_blank" rel="noreferrer"
                      style={{ padding:"8px 18px", borderRadius:9, border:"1.5px solid #BFDBFE", background:"#EBF5FF", color:"#1A56DB", fontWeight:700, fontSize:13, textDecoration:"none", whiteSpace:"nowrap" }}>
                      👁 View Resume
                    </a>
                  ) : null;
                })()}
              </div>

              {/* Upload new resume */}
              <div style={{ background:"#F9FAFB", border:"2px dashed #D1D5DB", borderRadius:12, padding:"24px", textAlign:"center" }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor="#1A56DB"; e.currentTarget.style.background="#EBF5FF"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor="#D1D5DB"; e.currentTarget.style.background="#F9FAFB"; }}
                onDrop={async e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor="#D1D5DB"; e.currentTarget.style.background="#F9FAFB";
                  const file = e.dataTransfer.files[0];
                  if (file) handleResumeUpload(file);
                }}>
                <div style={{ fontSize:36, marginBottom:10 }}>📤</div>
                <div style={{ fontWeight:700, color:"#374151", marginBottom:6 }}>
                  {resumeUploading ? "Uploading..." : "Drag & drop your resume here"}
                </div>
                <div style={{ fontSize:13, color:"#9CA3AF", marginBottom:14 }}>Supports PDF, DOC, DOCX (max 10MB)</div>
                <label style={{ display:"inline-block", padding:"9px 22px", background:"#1A56DB", color:"#fff", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"Nunito,sans-serif" }}>
                  {resumeUploading ? "⏳ Uploading..." : "📂 Browse File"}
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }}
                    onChange={e => { if (e.target.files[0]) handleResumeUpload(e.target.files[0]); }} />
                </label>
              </div>

              {resumeError && <div className="alert a-err" style={{ marginTop:12 }}>❌ {resumeError}</div>}
              {resumeSuccess && <div className="alert a-ok" style={{ marginTop:12 }}>✅ {resumeSuccess}</div>}

              {/* OR add link */}
              <div style={{ marginTop:20 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#374151", marginBottom:8 }}>Or add a Google Drive / external link:</div>
                <div style={{ display:"flex", gap:10 }}>
                  <input className="input" style={{ flex:1 }} placeholder="https://drive.google.com/..."
                    value={profile.resume_link||""}
                    onChange={e => setProfile(p => ({...p, resume_link: e.target.value}))} />
                  <button className="btn btn-primary btn-sm" onClick={async () => {
                    try {
                      const token = localStorage.getItem("acadhr_token");
                      await fetch((process.env.REACT_APP_API_URL||"http://localhost:5000/api") + "/teacher/profile", {
                        method:"PATCH", headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},
                        body: JSON.stringify({ resume_link: profile.resume_link })
                      });
                      setResumeSuccess("Link saved successfully!");
                      setTimeout(() => setResumeSuccess(""), 3000);
                    } catch { setResumeError("Failed to save link."); }
                  }}>Save Link</button>
                </div>
              </div>
            </div>

            {/* Inline preview */}
            {profile.resume_link && (profile.resume_link.endsWith(".pdf") || profile.resume_link.includes("/uploads/resumes/")) && (
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid #E5E7EB", fontWeight:700, fontSize:14, color:"#111827" }}>
                  📄 Resume Preview
                </div>
                <iframe
                  src={profile.resume_link.startsWith("http")
                    ? profile.resume_link
                    : (process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + profile.resume_link}
                  style={{ width:"100%", height:600, border:"none" }}
                  title="Resume Preview"
                />
              </div>
            )}

            {/* Document vault placeholder */}
            <div className="card" style={{ padding:32, textAlign:"center", marginTop:16 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📁</div>
              <h3 style={{ marginBottom:8 }}>Document Vault Coming Soon</h3>
              <p style={{ color:"#6B7280", fontSize:14 }}>Upload degree certificates, experience letters, and other documents securely.</p>
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab==="settings" && (
          <div className="fadeUp">
            <div className="page-title">Settings</div>
            <div className="page-sub">Manage your account preferences</div>
            <div className="card" style={{ padding:28, marginBottom:16, maxWidth:500 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" }}>⚙️ Account</div>
              {[
                ["Name",  user.name],
                ["Email", user.email],
                ["Role",  "Teacher"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid #F3F4F6", fontSize:13 }}>
                  <span style={{ color:"#6B7280", fontWeight:600 }}>{k}</span>
                  <span style={{ color:"#111827", fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:20 }}>
                <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Are you sure you want to logout?")) logout(); }}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TeacherDashboard;
