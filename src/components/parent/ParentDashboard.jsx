import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Toast, Divider } from "../common/Shared";
import SuccessPopup from "../common/SuccessPopup";
import SaveErrorPopup from "../common/SaveErrorPopup"; // ADDED: profile save-error popup
import PaymentHistory from "../common/PaymentHistory"; // ADDED: payment history
import ParentTuitionPosts from "./ParentTuitionPosts"; // ADDED: multiple tuition posts
import { startPayment } from "../../payments"; // ADDED: payments
import './Parent.css';

// ADDED: compact a comma-separated value to the first n items (used by the richer
// Find-Tutors card). Empty → "—". n<=0 shows all.
const tcap = (v, n) => {
  if (v === undefined || v === null || String(v).trim() === "") return "—";
  const parts = String(v).split(",").map(x => x.trim()).filter(Boolean);
  if (!n || n <= 0 || parts.length <= n) return parts.join(", ");
  return parts.slice(0, n).join(", ") + "…";
};

function ParentDashboard({ user, setPage }) {
  const { logout } = useAuth();
  const [tab, setTab] = useState("overview");
  // ADDED (credit system): show remaining contact credits on the Overview page too
  const [overviewCredits, setOverviewCredits] = useState(null);
  const [planDays, setPlanDays] = useState(null); // ADDED: days left on the active plan
  const refreshCredits = () => {
    const _t = localStorage.getItem("acadhr_token");
    if (!_t) return;
    const _base = (process.env.REACT_APP_API_URL || "http://localhost:5000/api");
    fetch(_base + "/admin/parent/credits", { headers: { Authorization: "Bearer " + _t } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && typeof d.credits === "number") setOverviewCredits(d.credits); })
      .catch(() => {});
    // ADDED: plan days-left comes from the shared payments/credits endpoint
    fetch(_base + "/payments/credits", { headers: { Authorization: "Bearer " + _t } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPlanDays(typeof d.days_left === "number" ? d.days_left : null); })
      .catch(() => {});
  };
  useEffect(() => { refreshCredits(); }, [tab]); // eslint-disable-line
  // ADDED: admin-editable plans catalog (same source the teacher/tutor pricing use)
  const [catalog, setCatalog] = useState({});
  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:5000/api") + "/payments/config")
      .then(r => r.json()).then(d => setCatalog(d && d.catalog ? d.catalog : {})).catch(() => {});
  }, []);
  const [profile, setProfile] = useState({
    student_name:"", student_class:"", board:"", subject:"",
    location:"", mode:"", preferred_time:"", budget:"",
    tutor_gender_pref:"", experience_req:"", status:"Open",
    assigned_tutor:"", notes:"",
    state:"", pincode:"", landmark:"", institute_name:"", hourly_budget:"",
    time_from:"", time_to:""   // ADDED: preferred start / end timing
  });
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved]       = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // ADDED: tutors who applied to this parent's requirement
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantContacted, setApplicantContacted] = useState([]); // revealed cards (FREE, no credit)
  const loadApplicants = () => {
    const _t = localStorage.getItem("acadhr_token");
    if (!_t) return;
    setApplicantsLoading(true);
    fetch(API + "/tutor/my-tuition-applicants", { headers: { Authorization: "Bearer " + _t } })
      .then(r => r.ok ? r.json() : [])
      .then(d => setApplicants(Array.isArray(d) ? d : []))
      .catch(() => setApplicants([]))
      .finally(() => setApplicantsLoading(false));
  };
  useEffect(() => { if (tab === "applicants") loadApplicants(); }, [tab]); // eslint-disable-line
  // ADDED: local contact helpers for the Applicants cards (main-component scope)
  const waLinkA = (phone) => { const d = String(phone || "").replace(/[^0-9]/g, ""); return "https://wa.me/" + (d.length === 10 ? "91" + d : d); };
  const contactRowA = { display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"9px 12px", borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none", border:"1px solid", cursor:"pointer" };

  useEffect(() => {
    const token = localStorage.getItem("acadhr_token");
    if (!token) return;
    fetch(API + "/teacher/general-profile", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.profile) {
          const p = data.profile;
          setProfile(prev => ({
            ...prev,
            student_name:      p.student_name      || "",
            student_class:     p.student_class     || "",
            board:             p.board             || "",
            subject:           p.subject           || "",
            location:          p.location          || "",
            mode:              p.mode              || "",
            preferred_time:    p.preferred_time    || "",
            budget:            p.budget            || "",
            tutor_gender_pref: p.tutor_gender_pref || "",
            experience_req:    p.experience_req    || "",
            status:            p.status            || "Open",
            assigned_tutor:    p.assigned_tutor    || "",
            notes:             p.notes             || "",
            state:             p.state             || "",
            pincode:           p.pincode           || "",
            landmark:          p.landmark          || "",
            institute_name:    p.institute_name    || "",
            hourly_budget:     p.hourly_budget     || "",
            time_from:         p.time_from         || "",
            time_to:           p.time_to           || "",
          }));
        }
      }).catch(() => {});
  }, []);

  async function saveProfile() {
    // ADDED (mandatory fields): all profile fields are required before saving
    {
      const missing = [];
      const need = (v, label) => { if (v === "" || v === null || v === undefined) missing.push(label); };
      need(profile.student_name, "Student Name"); need(profile.student_class, "Class");
      need(profile.board, "Board"); need(profile.subject, "Subjects");
      need(profile.location, "Location"); need(profile.mode, "Mode");
      need(profile.preferred_time, "Preferred Time");
      need(profile.budget || profile.hourly_budget, "Budget");
      need(profile.tutor_gender_pref, "Tutor Gender Preference");
      need(profile.experience_req, "Experience Required");
      need(profile.state, "State"); need(profile.pincode, "Pincode");
      need(profile.landmark, "Landmark"); need(profile.institute_name, "School/Institute Name");
      if (missing.length) { setSaveError("Please fill all mandatory fields: " + missing.join(", ")); return; }
    }
    setSaving(true); setSaveError("");
    try {
      const token = localStorage.getItem("acadhr_token");
      const r = await fetch(API + "/teacher/general-profile", {
        method: "PATCH",
        headers: { "Content-Type":"application/json", Authorization:"Bearer "+token },
        body: JSON.stringify({
          student_name: profile.student_name, student_class: profile.student_class,
          board: profile.board, subject: profile.subject, location: profile.location,
          mode: profile.mode, preferred_time: profile.preferred_time, budget: profile.budget,
          tutor_gender_pref: profile.tutor_gender_pref, experience_req: profile.experience_req,
          notes: profile.notes,
          state: profile.state, pincode: profile.pincode, landmark: profile.landmark,
          institute_name: profile.institute_name, hourly_budget: profile.hourly_budget,
          time_from: profile.time_from, time_to: profile.time_to
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setSaved(true); setShowSavePopup(true); setEditMode(false);
    } catch(err) { setSaveError(err.message); }
    finally { setSaving(false); }
  }

  function up(k,v) { setProfile(p => ({...p, [k]:v})); }

  // Multi-select helpers for comma-separated fields (subject, preferred_time)
  const csvArr = (key) => (profile[key] || "").split(",").map(s => s.trim()).filter(Boolean);
  function toggleCsv(key, val) {
    const arr = csvArr(key);
    up(key, (arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]).join(", "));
  }
  const REQ_SUBS  = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Zoology"];
  const REQ_TIMES = ["Morning","Afternoon","Evening","Any time"];
  // ADDED: hourly time slots for the "Preferred Time Slot" dropdown
  const TIME_SLOTS = [
    "6-7 AM","7-8 AM","8-9 AM","9-10 AM","10-11 AM","11-12 PM",
    "12-1 PM","1-2 PM","2-3 PM","3-4 PM","4-5 PM","5-6 PM",
    "6-7 PM","7-8 PM","8-9 PM","9-10 PM",
  ];
  const reqChip = (on, editable) => ({
    padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:600, userSelect:"none",
    cursor: editable ? "pointer" : "default",
    border: on ? "1.5px solid #1A56DB" : "1.5px solid #E5E7EB",
    background: on ? "#EBF5FF" : (editable ? "#fff" : "#F9FAFB"), color: on ? "#1A56DB" : "#374151", transition:"all .15s",
  });

  const MENU = [
    { id:"overview",     icon:"🏠", label:"Overview" },
    { id:"profile",      icon:"👤", label:"My Profile" },
    { id:"requirement",  icon:"📋", label:"My Requirement" },
    { id:"posts",        icon:"📝", label:"My Tuition Posts" }, // ADDED: multiple posts
    { id:"tutors",       icon:"🧑‍🎓", label:"Find Tutors" },
    { id:"applicants",   icon:"📨", label:"Applicants" },      // ADDED: tutors who applied
    { id:"pricing",      icon:"🏷️", label:"Pricing" },        // ADDED
    { id:"payments",     icon:"🧾", label:"Payment History" },
  ];

  const [navOpen, setNavOpen] = useState(false);
  return (
    <div style={{ display:"flex", width:"100vw", minHeight:"100vh" }}>
      <SuccessPopup show={showSavePopup} onClose={() => setShowSavePopup(false)} message="Your requirement has been saved." />
      <SaveErrorPopup show={!!saveError} onClose={() => setSaveError("")} message={saveError} />
      {/* Mobile nav toggle + backdrop */}
      <button className="mobile-nav-toggle" aria-label="Menu" onClick={() => setNavOpen(o => !o)}>{navOpen ? "✕" : "☰"}</button>
      <div className={"sidebar-backdrop" + (navOpen ? " show" : "")} onClick={() => setNavOpen(false)} />
      <div className={"sidebar" + (navOpen ? " open" : "")} onClick={() => setNavOpen(false)}>
        <div className="sidebar-header">
          <div style={{ cursor:"pointer" }} onClick={() => setPage("home")}>
            <img src="/acadhr-logo.png" alt="AcadHr" style={{ height:48, objectFit:"contain" }} />
          </div>
          <div style={{ fontSize:10, color:"#6B7280", marginTop:5, fontWeight:800, textTransform:"uppercase", letterSpacing:1 }}>Parent Portal</div>
        </div>
        <div style={{ padding:"14px 22px 12px", borderBottom:"1px solid #E5E7EB", background:"#F9FAFB" }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{user.name}</div>
          <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>👨‍👩‍👧 Parent / Guardian</div>
          {profile.student_name && <div style={{ fontSize:11, color:"#1A56DB", fontWeight:600, marginTop:3 }}>Child: {profile.student_name}</div>}
          {/* ADDED: credits shown on the left */}
          <div
            onClick={() => setTab("pricing")}
            style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer",
              background: (overviewCredits ?? 0) > 0 ? "linear-gradient(135deg,#F59E0B,#D97706)" : "linear-gradient(135deg,#EF4444,#DC2626)",
              color:"#fff", fontWeight:800, fontSize:12.5, padding:"6px 12px", borderRadius:999,
              boxShadow:"0 3px 10px rgba(217,119,6,.30)" }}
            title="Your available credits">
            🪙 {overviewCredits == null ? "…" : overviewCredits} credit{overviewCredits === 1 ? "" : "s"}
          </div>
          {/* ADDED: days left on the active plan */}
          {planDays !== null && (
            <div style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:6,
              background: planDays > 0 ? "#ECFDF5" : "#FEF2F2", border:`1px solid ${planDays > 0 ? "#A7F3D0" : "#FECACA"}`,
              color: planDays > 0 ? "#047857" : "#B91C1C", fontWeight:800, fontSize:12, padding:"5px 12px", borderRadius:999 }}>
              📅 {planDays > 0 ? `${planDays} day${planDays === 1 ? "" : "s"} left` : "Plan expired"}
            </div>
          )}
        </div>
        <div className="sidebar-sec">Navigation</div>
        {MENU.map(m => (
          <div key={m.id} className={"s-item"+(tab===m.id?" active":"")} onClick={() => setTab(m.id)}>
            <span>{m.icon}</span>{m.label}
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:"20px 0" }}>
          <div className="sidebar-sec">Account</div>
          <div className="s-item" onClick={() => setPage("home")}>🏠 Back to Site</div>
          <div className="s-item" onClick={logout}>🚪 Logout</div>
        </div>
      </div>

      <div className="main">
        {/* ══ MY PROFILE ══ */}
        {tab==="profile" && (
          <div className="fadeUp">
            <div className="page-title">My Profile</div>
            <div className="page-sub">Your personal account details</div>
            <div className="card" style={{ padding:28, maxWidth:560 }}>
              <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:24 }}>
                <div style={{ width:70, height:70, borderRadius:"50%", background:"#EBF5FF", border:"2px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>👨‍👩‍👧</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:20, color:"#111827" }}>{user.name}</div>
                  <div style={{ fontSize:13, color:"#1A56DB", fontWeight:600, marginTop:2 }}>Parent / Guardian</div>
                  <span className="badge bgreen" style={{ marginTop:6 }}>✓ Verified Account</span>
                </div>
              </div>
              <Divider />
              <div style={{ marginTop:18 }}>
                {[
                  ["👤 Full Name",    user.name],
                  ["📧 Email",        user.email],
                  ["📱 Phone",        user.phone || "Not added"],
                  ["📍 City",         user.city  || "Not added"],
                  ["🧒 Child Name",   profile.student_name  || "Not set"],
                  ["📚 Class",        profile.student_class || "Not set"],
                  ["🏫 Board",        profile.board         || "Not set"],
                  ["📖 Subject(s)",   profile.subject       || "Not set"],
                  ["📋 Status",       profile.status        || "Open"],
                  ["🧑‍🎓 Assigned Tutor", profile.assigned_tutor || "Not assigned yet"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F3F4F6", fontSize:13 }}>
                    <span style={{ color:"#6B7280", fontWeight:600 }}>{label}</span>
                    <span style={{ color: value==="Not set"||value==="Not added"||value==="Not assigned yet" ? "#9CA3AF" : "#111827", fontWeight:600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20 }}>
                <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={() => setTab("requirement")}>
                  ✏️ Edit Tutor Requirement
                </button>
              </div>
            </div>
          </div>
        )}

        {tab==="overview" && (
          <div className="fadeUp">
            <div className="page-title">Welcome, {user.name.split(" ")[0]} 👋</div>
            <div className="page-sub">Your tutor search at a glance</div>
            <div className="dash-grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:24 }}>
              {[
                ["Student",   profile.student_name||"Not set", "🧒", "#1A56DB"],
                ["Class",     profile.student_class||"Not set", "📚", "#059669"],
                ["Status",    profile.status||"Open",           "📋", "#D97706"],
                /* ADDED (credit system): credits card on Overview */
                ...(overviewCredits !== null ? [["Contact Credits", `${overviewCredits} left`, "🪙", overviewCredits > 0 ? "#D97706" : "#DC2626"]] : []),
              ].map(([l,v,i,c]) => (
                <div key={l} className="card kpi" style={{ padding:22, textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{i}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
                  <div style={{ fontSize:12, color:"#6B7280", fontWeight:600, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontSize:17, fontWeight:800 }}>My Tutor Requirement</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setTab("requirement")}>Edit Requirement</button>
              </div>
              {[
                ["Subject(s)", profile.subject],
                ["Board", profile.board],
                ["Location", profile.location],
                ["Mode", profile.mode],
                ["Preferred Time", profile.preferred_time],
                ["Budget", profile.budget],
                ["Tutor Gender", profile.tutor_gender_pref||"No Preference"],
                ["Experience Needed", profile.experience_req||"Any"],
              ].map(([k,v]) => v ? (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #F3F4F6", fontSize:13 }}>
                  <span style={{ color:"#6B7280", fontWeight:600 }}>{k}</span>
                  <span style={{ color:"#111827", fontWeight:600 }}>{v}</span>
                </div>
              ) : null)}
              {profile.notes && (
                <div style={{ marginTop:12, background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#92400E" }}>
                  📝 {profile.notes}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="requirement" && (
          <div className="fadeUp">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <div>
                <div className="page-title">My Tutor Requirement</div>
                <div className="page-sub" style={{ marginBottom:0 }}>Update your child's tutor requirement details</div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-outline btn-sm" onClick={() => { setEditMode(e => !e); setSaved(false); }}>
                  {editMode ? "✕ Cancel" : "✏️ Edit"}
                </button>
                {editMode && <button className="btn btn-primary btn-sm" onClick={saveProfile} disabled={saving}>{saving?"Saving...":"Save ✓"}</button>}
              </div>
            </div>
            {saved    && <div className="alert a-ok" style={{ marginBottom:16 }}>✅ Requirement saved successfully!</div>}
            {saveError && <div className="alert a-err" style={{ marginBottom:16 }}>❌ {saveError}</div>}
            {!editMode && <div className="alert a-info" style={{ marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>👁 View mode — click Edit to make changes</span>
              <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>✏️ Edit</button>
            </div>}
            <div className="card" style={{ padding:28 }}>
              <div className="grid2">
                <div className="fg"><label className="flabel">Student Name *</label>
                  <input className="input" readOnly={!editMode} value={profile.student_name} onChange={e => up("student_name",e.target.value)} placeholder="Child's name" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
                </div>
                <div className="fg"><label className="flabel">Class / Grade *</label>
                  <select className="input" value={profile.student_class} onChange={e => editMode && up("student_class",e.target.value)} style={{ pointerEvents:editMode?"auto":"none", background:!editMode?"#F9FAFB":"#fff" }}>
                    <option value="">Select class</option>
                    {["Pre-Primary (Nursery–KG)","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Degree"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg"><label className="flabel">Board</label>
                <select className="input" value={profile.board} onChange={e => editMode && up("board",e.target.value)} style={{ pointerEvents:editMode?"auto":"none", background:!editMode?"#F9FAFB":"#fff" }}>
                  <option value="">Select board</option>
                  <option>CBSE</option><option>ICSE</option><option>State Board (AP)</option><option>State Board (TS)</option><option>IB</option><option>IGCSE</option>
                </select>
              </div>
              <div className="fg"><label className="flabel">Subject(s) Required * (select all that apply)</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:12, background:!editMode?"#F9FAFB":"#FAFBFC" }}>
                  {REQ_SUBS.map(s => {
                    const on = csvArr("subject").includes(s);
                    return <span key={s} onClick={() => editMode && toggleCsv("subject", s)} style={reqChip(on, editMode)}>{s}</span>;
                  })}
                </div>
              </div>
              <div className="fg"><label className="flabel">Location / Area</label>
                <input className="input" readOnly={!editMode} value={profile.location} onChange={e => up("location",e.target.value)} placeholder="e.g. Banjara Hills, Hyderabad" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
              </div>
              <div className="grid2">
                <div className="fg"><label className="flabel">State</label>
                  <input className="input" readOnly={!editMode} value={profile.state} onChange={e => up("state",e.target.value)} placeholder="e.g. Telangana" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
                </div>
                <div className="fg"><label className="flabel">Pincode</label>
                  <input className="input" readOnly={!editMode} value={profile.pincode} onChange={e => up("pincode",e.target.value)} placeholder="e.g. 500034" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
                </div>
              </div>
              <div className="fg"><label className="flabel">Landmark / Area</label>
                <input className="input" readOnly={!editMode} value={profile.landmark} onChange={e => up("landmark",e.target.value)} placeholder="e.g. Near City Center Mall" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
              </div>
              <div className="fg"><label className="flabel">School / College / Institute Name</label>
                <input className="input" readOnly={!editMode} value={profile.institute_name} onChange={e => up("institute_name",e.target.value)} placeholder="e.g. Delhi Public School" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
              </div>
              <div className="fg"><label className="flabel">Tutoring Mode</label>
                <div style={{ display:"flex", gap:10, marginTop:6 }}>
                  {["Home","Online","Offline & Online"].map(m => (
                    <label key={m} onClick={() => editMode && up("mode",m)}
                      style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px 0", borderRadius:10, border:`2px solid ${profile.mode===m?"#1A56DB":"#E5E7EB"}`, background:profile.mode===m?"#EBF5FF":"#F9FAFB", cursor:editMode?"pointer":"default", fontSize:13, fontWeight:700, color:profile.mode===m?"#1A56DB":"#6B7280", userSelect:"none" }}>
                      {m==="Home"?"🏠":m==="Online"?"💻":"🔄"} {m}
                    </label>
                  ))}
                </div>
              </div>
              <div className="fg"><label className="flabel">Preferred Time (select all that apply)</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:12, background:!editMode?"#F9FAFB":"#FAFBFC" }}>
                  {REQ_TIMES.map(t => {
                    const on = csvArr("preferred_time").includes(t);
                    return <span key={t} onClick={() => editMode && toggleCsv("preferred_time", t)} style={reqChip(on, editMode)}>{t}</span>;
                  })}
                </div>
              </div>
              {/* ADDED: pick one or more hourly time slots (7-8 AM, 8-9 AM, …) as chips */}
              <div className="fg"><label className="flabel">Preferred Time Slots (select one or more)</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:12, background:!editMode?"#F9FAFB":"#FAFBFC" }}>
                  {TIME_SLOTS.map(s => {
                    const on = csvArr("time_from").includes(s);
                    return <span key={s} onClick={() => editMode && toggleCsv("time_from", s)} style={reqChip(on, editMode)}>{s}</span>;
                  })}
                </div>
              </div>
              <div className="grid2">
                <div className="fg"><label className="flabel">Monthly Budget (₹)</label>
                  <select className="input" value={profile.budget} onChange={e => editMode && up("budget",e.target.value)} style={{ pointerEvents:editMode?"auto":"none", background:!editMode?"#F9FAFB":"#fff" }}>
                    <option value="">Select range</option>
                    <option>Under ₹2,000</option><option>₹2,000–₹4,000</option>
                    <option>₹4,000–₹6,000</option><option>₹6,000–₹10,000</option><option>Above ₹10,000</option>
                  </select>
                </div>
                <div className="fg"><label className="flabel">Hourly Budget (₹)</label>
                  <input className="input" type="number" min="0" readOnly={!editMode} value={profile.hourly_budget} onChange={e => up("hourly_budget",e.target.value)} placeholder="e.g. 500" style={{ background:!editMode?"#F9FAFB":"#fff" }} />
                </div>
              </div>
              <div className="grid2">
                <div className="fg"><label className="flabel">Tutor Gender Preference</label>
                  <select className="input" value={profile.tutor_gender_pref} onChange={e => editMode && up("tutor_gender_pref",e.target.value)} style={{ pointerEvents:editMode?"auto":"none", background:!editMode?"#F9FAFB":"#fff" }}>
                    <option value="">No Preference</option><option>Male</option><option>Female</option>
                  </select>
                </div>
                <div className="fg"><label className="flabel">Experience Required</label>
                  <select className="input" value={profile.experience_req} onChange={e => editMode && up("experience_req",e.target.value)} style={{ pointerEvents:editMode?"auto":"none", background:!editMode?"#F9FAFB":"#fff" }}>
                    <option value="">Any</option>
                    <option>Fresher OK</option><option>1+ Years</option><option>2+ Years</option><option>3+ Years</option><option>5+ Years</option>
                  </select>
                </div>
              </div>
              <div className="fg"><label className="flabel">Additional Notes</label>
                <textarea className="input" readOnly={!editMode} rows={3} value={profile.notes} onChange={e => up("notes",e.target.value)} placeholder="Any special requirements..." style={{ background:!editMode?"#F9FAFB":"#fff" }} />
              </div>
              {editMode && (
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={() => setEditMode(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex:2, justifyContent:"center" }} onClick={saveProfile} disabled={saving}>{saving?"Saving...":"Save Changes ✓"}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="payments" && <PaymentHistory />}

        {/* ADDED: multiple tuition posts (plan-limited) */}
        {tab==="posts" && <ParentTuitionPosts setPage={setTab} />}

        {/* ══ APPLICANTS ══ (ADDED: tutors who applied to this parent's requirement) */}
        {tab==="applicants" && (
          <div className="fadeUp" style={{ padding:"4px 0" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div>
                <div className="page-title">Applicants</div>
                <div className="page-sub">Tutors who applied to your tuition requirement</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={loadApplicants}>↻ Refresh</button>
            </div>

            {applicantsLoading ? (
              <div style={{ textAlign:"center", padding:"50px 0", color:"#9CA3AF" }}>Loading applicants…</div>
            ) : applicants.length === 0 ? (
              <div style={{ textAlign:"center", padding:"56px 0", color:"#9CA3AF" }}>
                <div style={{ fontSize:46, marginBottom:12 }}>📭</div>
                <div style={{ fontWeight:700, fontSize:16, color:"#374151" }}>No applicants yet</div>
                <div style={{ fontSize:13, marginTop:6 }}>When tutors apply to your requirement, they'll show up here with their details.</div>
              </div>
            ) : (
              <div className="grid2" style={{ marginTop:18 }}>
                {applicants.map(t => (
                  <div key={t.id} className="card" style={{ padding:24 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14 }}>
                      <div style={{ width:56, height:56, borderRadius:"50%", background:"#F5F3FF", border:"2px solid #DDD6FE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>🧑‍🎓</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:800, fontSize:16, color:"#111827", lineHeight:1.25 }}>{t.name}</div>
                        <div style={{ fontSize:13, color:"#6D28D9", fontWeight:700, marginTop:3 }}>{tcap(t.subjects || t.subject, 3)}</div>
                        {(t.qualifications || t.qualification) && (
                          <div style={{ fontSize:12, color:"#6B7280", fontWeight:600, marginTop:2 }}>{tcap(t.qualifications || t.qualification, 4)}</div>
                        )}
                      </div>
                      <span style={{ fontSize:11, fontWeight:800, color:"#065F46", background:"#D1FAE5", borderRadius:999, padding:"3px 10px", whiteSpace:"nowrap" }}>{t.status || "Applied"}</span>
                    </div>

                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                      {(t.location || t.city) && <span style={{ fontSize:11.5, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:20, padding:"3px 10px", color:"#B91C1C", fontWeight:600 }}>📍 {t.location || t.city}</span>}
                      {t.experience    && <span style={{ fontSize:11.5, background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:20, padding:"3px 10px", color:"#92400E", fontWeight:600 }}>⏳ {t.experience}</span>}
                      {t.teaching_mode && <span style={{ fontSize:11.5, background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 10px", color:"#1A56DB", fontWeight:700 }}>💻 {t.teaching_mode}</span>}
                      {t.gender        && <span style={{ fontSize:11.5, background:"#FDF2F8", border:"1px solid #FBCFE8", borderRadius:20, padding:"3px 10px", color:"#9D174D", fontWeight:600 }}>👤 {t.gender}</span>}
                    </div>

                    {/* labeled detail rows (same format as Find Tutors) */}
                    <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"7px 14px", marginBottom:14, fontSize:12.5 }}>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>Subjects</span>
                      <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.subjects || t.subject, 0)}</span>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>Classes Taught</span>
                      <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.classes_taught, 0)}</span>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>Qualifications</span>
                      <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.qualifications || t.qualification, 0)}</span>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>Available Timing</span>
                      <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.availability, 0)}</span>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>Location</span>
                      <span style={{ color:"#374151", fontWeight:600 }}>{t.location || t.city || "—"}</span>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>Hourly Price</span>
                      <span style={{ color:"#059669", fontWeight:800 }}>{t.hourly_rate ? t.hourly_rate : "—"}</span>
                    </div>

                    {/* Contact Tutor — FREE (no credit deducted): just reveals the details */}
                    {applicantContacted.includes(t.id) ? (
                      <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14, display:"flex", flexDirection:"column", gap:8 }}>
                        {t.phone && <a href={"tel:" + t.phone} style={{ ...contactRowA, color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }}>📞 {t.phone}</a>}
                        {t.phone && <a href={waLinkA(t.phone)} target="_blank" rel="noreferrer" style={{ ...contactRowA, color:"#059669", borderColor:"#A7F3D0", background:"#ECFDF5" }}>💬 WhatsApp</a>}
                        {t.email && <a href={"mailto:" + t.email} style={{ ...contactRowA, color:"#92400E", borderColor:"#FDE68A", background:"#FFFBEB" }}>✉️ {t.email}</a>}
                        {t.resume_link && (
                          <a href={/^https?:\/\//.test(t.resume_link) ? t.resume_link : (API.replace("/api","") + t.resume_link)}
                             target="_blank" rel="noreferrer"
                             style={{ ...contactRowA, color:"#6D28D9", borderColor:"#DDD6FE", background:"#F5F3FF" }}>
                            📄 View Resume{t.resume_file_name ? ` (${t.resume_file_name})` : ""}
                          </a>
                        )}
                        {!t.phone && !t.email && !t.resume_link && <div style={{ textAlign:"center", fontSize:12, color:"#9CA3AF" }}>No contact details available</div>}
                      </div>
                    ) : (
                      <button
                        onClick={() => setApplicantContacted(c => c.includes(t.id) ? c : [...c, t.id])}
                        style={{ width:"100%", marginTop:4, padding:"13px", borderRadius:12, border:"1.5px solid #DDD6FE", background:"#F5F3FF", color:"#6D28D9", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
                        Contact Tutor →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PRICING ══ (ADDED — same style/behaviour as the Teacher dashboard) */}
        {tab==="pricing" && (
          <div style={{ padding:"28px 28px" }} className="fadeUp">
            <h2 style={{ fontSize:22, fontWeight:800, color:"#111827", marginBottom:6 }}>Choose your plan</h2>
            <p style={{ color:"#6B7280", fontSize:14, marginBottom:24 }}>Upgrade to post more tuition requests and unlock tutor contacts. Payments are secured via Razorpay.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:20, maxWidth:1080 }}>
              {(() => {
                const _fallback = [
                  {
                    name:"Starter", tagline:"Most popular for parents", accent:"#DB2777", highlight:true,
                    periods:[
                      { id:"parent_starter_1m", label:"1 month",  price:"₹1,000" },
                      { id:"parent_starter_3m", label:"3 months", price:"₹2,700", note:"save 10%" },
                    ],
                    features:["2–3 tuition requests","Access tutor profiles","60 unlock credits"],
                  },
                  {
                    name:"Premium", tagline:"For serious parents", accent:"#7C3AED",
                    periods:[
                      { id:"parent_premium_1m", label:"1 month",  price:"₹2,000" },
                      { id:"parent_premium_3m", label:"3 months", price:"₹5,400", note:"save 10%" },
                    ],
                    features:["4–5 tuition requests","100 unlock credits","Dedicated recruiter support","Demo class scheduling","One month dedicated support"],
                  },
                ];
                // ADDED: the free "Inaugural Offer" plan (shown on the public Pricing
                // page) so the parent dashboard also shows all 3 plans, not just 2.
                const _free = {
                  name:"Inaugural Offer", tagline:"Limited launch offer", accent:"#059669", free:true, badge:"🎉 Launch Offer",
                  periods:[{ id:"parent_free", label:"Get Started Free", price:"", free:true }],
                  features:["Post 1 tuition request","View tutor profiles","Academic updates","20 free credits"],
                };
                const _db = (catalog && Array.isArray(catalog.parent)) ? catalog.parent : [];
                let plans = _db.length ? _db : _fallback;
                // make sure the free/inaugural plan is present (like the public Pricing page)
                if (!plans.some(p => /free|inaugural/i.test(String(p.name || "")))) plans = [_free, ...plans];
                return plans.map(p => (
                  <div key={p.name} style={{ background:"#fff", border:`2px solid ${p.highlight?p.accent:"#E5E7EB"}`, borderRadius:16, padding:24, display:"flex", flexDirection:"column", position:"relative", boxShadow:p.highlight?"0 8px 24px rgba(219,39,119,.12)":"none" }}>
                    {p.highlight && <span style={{ position:"absolute", top:-12, left:24, background:p.accent, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20 }}>MOST POPULAR</span>}
                    {p.badge && <span style={{ position:"absolute", top:-12, left:24, background:p.accent, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20 }}>{p.badge}</span>}
                    <div style={{ fontWeight:800, fontSize:18, color:"#111827" }}>{p.name}</div>
                    <div style={{ fontSize:13, color:"#6B7280", marginTop:4, marginBottom:16 }}>{p.tagline}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                      {p.periods.map(per => (
                        <button key={per.id}
                          onClick={() => { if (per.free || p.free) { setTab("tutors"); return; } startPayment(per.id, { onSuccess: () => refreshCredits() }); }}
                          style={{ display:"flex", alignItems:"center", justifyContent:(per.free||p.free)?"center":"space-between", width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${p.accent}`, background:p.highlight?p.accent:"#fff", color:p.highlight?"#fff":p.accent, cursor:"pointer", fontWeight:800, fontFamily:"Nunito,sans-serif", fontSize:14 }}>
                          <span>{per.label}{(per.free||p.free) ? " →" : ""}</span>
                          {!(per.free || p.free) && <span>{per.price}{per.note ? <span style={{ fontSize:11, fontWeight:700, opacity:.85, marginLeft:6 }}>&middot; {per.note}</span> : null}</span>}
                        </button>
                      ))}
                      {!p.free && <div style={{ fontSize:11, color:"#9CA3AF", textAlign:"center", marginTop:2 }}>Tap a duration to pay</div>}
                    </div>
                    <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14, marginTop:"auto" }}>
                      {p.features.map(f => (
                        <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:"#374151", marginBottom:8 }}>
                          <span style={{ color:"#059669", fontWeight:800 }}>✓</span><span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
            <p style={{ fontSize:12, color:"#9CA3AF", marginTop:20 }}>Prices are exclusive of GST where applicable. You'll be charged securely through Razorpay.</p>
          </div>
        )}

        {tab==="tutors" && (
          <TutorFinder user={user} profile={profile} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

// ── TutorFinder — only shown to approved parents ─────────────────────────────
function TutorFinder({ user, profile, setPage }) {
  const [tutors,   setTutors]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [approved, setApproved] = useState(true); // is_active from backend
  const [filter,   setFilter]   = useState({ subjects:[], city:"" });
  const [contacted, setContacted] = useState([]);
  // ADDED (mobile fix): searchable city box state — native <select> popup
  // could overflow the phone screen, this stays fully inside it.
  const [cityQuery, setCityQuery] = useState("");
  const [citySug,   setCitySug]   = useState(false);
  // ADDED (credit system): parents get 5 free tutor contacts; balance lives on the server
  const [credits,     setCredits]     = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  // ADDED: freeze background scrolling while the upgrade popup is open,
  // so the popup always sits centered over a still page
  useEffect(() => {
    document.body.style.overflow = showUpgrade ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showUpgrade]);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const token = localStorage.getItem("acadhr_token");
    if (!token) { setLoading(false); return; }
    // ADDED (credit system): load the parent's remaining credits
    fetch(`${API}/admin/parent/credits`, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && typeof d.credits === "number") setCredits(d.credits); })
      .catch(() => {});
    // Fetch ALL tutors for the parent — backend returns 403 if not approved
    fetch(API + "/admin/tutors-list", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(async r => {
      if (r.status === 403) { setApproved(false); setLoading(false); return; }
      const d = await r.json();
      if (r.ok) setTutors(d);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  // Unique dropdown / chip options derived from the fetched tutors
  // CHANGED (chip cleanup): split combined "Math, Physics, ..." strings into individual
  // subjects so the filter shows one clean chip per subject. Original line kept below.
  // const subjectOptions = Array.from(new Set(tutors.map(t => t.subject).filter(Boolean))).sort();
  const subjectOptions = Array.from(new Set(
    tutors.flatMap(t => String(t.subjects || t.subject || "").split(","))
          .map(s => s.trim())
          .filter(Boolean)
  )).sort();
  const cityOptions    = Array.from(new Set(tutors.map(t => t.city).filter(Boolean))).sort();

  // Build a WhatsApp link (strip non-digits; assume +91 for 10-digit Indian numbers)
  const waLink = (phone) => {
    const d = String(phone || "").replace(/[^0-9]/g, "");
    return "https://wa.me/" + (d.length === 10 ? "91" + d : d);
  };
  const contactRow = {
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    padding:"9px 12px", borderRadius:10, fontSize:13, fontWeight:700,
    textDecoration:"none", border:"1px solid", cursor:"pointer",
  };

  const filtered = tutors.filter(t =>
    (!filter.subjects.length || filter.subjects.some(s => (t.subject||"").toLowerCase().includes(s.toLowerCase()))) &&
    (!filter.city || (t.city||"") === filter.city)
  );

  if (!approved) return (
    <div className="fadeUp">
      <div className="page-title">Find Tutors</div>
      <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:16, padding:"40px 32px", textAlign:"center", marginTop:8 }}>
        <div style={{ fontSize:52, marginBottom:14 }}>⏳</div>
        <h3 style={{ fontSize:20, fontWeight:800, marginBottom:8, color:"#92400E" }}>Account Pending Approval</h3>
        <p style={{ color:"#B45309", fontSize:14, maxWidth:420, margin:"0 auto 16px", lineHeight:1.7 }}>
          Your account is currently under review by the AcadHr admin team.<br/>
          Once approved, you'll be able to browse and contact tutors here.
        </p>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:10, padding:"10px 20px", fontSize:13, color:"#92400E", fontWeight:600 }}>
          📧 You'll receive a confirmation once your account is approved.
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <div style={{ width:36, height:36, border:"3px solid #E5E7EB", borderTopColor:"#1A56DB", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 14px" }} />
      <div style={{ fontWeight:600, color:"#6B7280" }}>Loading tutors...</div>
    </div>
  );

  return (
    <div className="fadeUp">
      <div className="page-title">Find Tutors</div>
      <div className="page-sub" style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <span>Browse all tutors — {filtered.length} available</span>
        {credits !== null && (
          <span style={{
            background: credits > 0 ? "linear-gradient(135deg,#F59E0B,#D97706)" : "linear-gradient(135deg,#EF4444,#DC2626)",
            color:"#fff", borderRadius:24, padding:"7px 18px", fontSize:14, fontWeight:800,
            boxShadow: credits > 0 ? "0 4px 14px rgba(217,119,6,.35)" : "0 4px 14px rgba(220,38,38,.35)",
            display:"inline-flex", alignItems:"center", gap:6, letterSpacing:.3 }}>
            🪙 {credits} credit{credits === 1 ? "" : "s"} left
          </span>
        )}
      </div>

      {/* Filters */}
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
        <div className="parent-filter-bar" style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"stretch" }}>
          <div style={{ flex:"1 1 340px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:12.5, fontWeight:800, color:"#374151", letterSpacing:.2 }}>📚 Filter by Subject</div>
              {filter.subjects.length > 0 && <span style={{ fontSize:11, fontWeight:700, color:"#1A56DB", background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:999, padding:"2px 9px" }}>{filter.subjects.length} selected</span>}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {subjectOptions.length === 0
                ? <span style={{ fontSize:12, color:"#9CA3AF" }}>No subjects available</span>
                : subjectOptions.map(s => {
                    const on = filter.subjects.includes(s);
                    return (
                      <span key={s}
                        onClick={() => setFilter(f => ({ ...f, subjects: on ? f.subjects.filter(x => x !== s) : [...f.subjects, s] }))}
                        style={{ padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", userSelect:"none",
                          border: on ? "1.5px solid #1A56DB" : "1.5px solid #E5E7EB", background: on ? "#EBF5FF" : "#fff", color: on ? "#1A56DB" : "#374151", transition:"all .15s" }}>
                        {s}
                      </span>
                    );
                  })}
            </div>
          </div>
          <div className="parent-city-filter" style={{ flex:"0 0 260px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:12.5, fontWeight:800, color:"#374151", marginBottom:10, letterSpacing:.2 }}>📍 Filter by City</div>
            {/* Original dropdown kept (not deleted) — hidden; native popup overflowed phone screens */}
            <select className="input parent-city-select-old" style={{ display:"none" }} value={filter.city} onChange={e => setFilter(f => ({ ...f, city:e.target.value }))}>
              <option value="">Select City</option>
              {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* ADDED: searchable city box — suggestion list stays inside the screen */}
            <div style={{ position:"relative" }}>
              <input className="input" placeholder="Type a city..." value={filter.city || cityQuery}
                onChange={e => { setCityQuery(e.target.value); setCitySug(true); if (filter.city) setFilter(f => ({ ...f, city:"" })); }}
                onFocus={() => setCitySug(true)}
                onBlur={() => setTimeout(() => setCitySug(false), 150)} />
              {filter.city && (
                <span onClick={() => { setFilter(f => ({ ...f, city:"" })); setCityQuery(""); }}
                  style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#9CA3AF", fontWeight:700 }}>✕</span>
              )}
              {citySug && !filter.city && (
                <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:50, background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, marginTop:4, maxHeight:220, overflowY:"auto", boxShadow:"0 10px 30px rgba(0,0,0,.12)" }}>
                  {cityOptions.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).slice(0, 30).map(c => (
                    <div key={c}
                      onMouseDown={() => { setFilter(f => ({ ...f, city:c })); setCityQuery(""); setCitySug(false); }}
                      style={{ padding:"9px 12px", fontSize:13, cursor:"pointer", borderBottom:"1px solid #F3F4F6" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F0F4FF"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                      {c}
                    </div>
                  ))}
                  {cityOptions.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).length === 0 && (
                    <div style={{ padding:"10px 12px", fontSize:13, color:"#9CA3AF" }}>No matching city</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {(filter.subjects.length || filter.city) ? (
          <button className="btn btn-ghost btn-sm" style={{ marginTop:14 }} onClick={() => setFilter({ subjects:[], city:"" })}>Clear filters ✕</button>
        ) : null}
      </div>

      {/* Tutor requirement summary */}
      {profile.subject && (
        <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:10, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#1E429F" }}>
          🔍 Your requirement: <strong>{profile.subject}</strong>
          {profile.location && <> · 📍 <strong>{profile.location}</strong></>}
          {profile.budget   && <> · 💰 Budget: <strong>{profile.budget}</strong></>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#9CA3AF" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🧑‍🎓</div>
          <div style={{ fontWeight:600, fontSize:16 }}>No tutors found</div>
          <div style={{ fontSize:13, marginTop:6 }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div className="grid2">
          {filtered.map(t => (
            <div key={t.id} className="card" style={{ padding:24, transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(26,86,219,.12)"; e.currentTarget.style.borderColor="#93C5FD"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="#E5E7EB"; }}>
              {/* CHANGED per request: richer tutor card (same style as the Browse Tutors card).
                  Nothing removed — the Contact Tutor action below is exactly as before. */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14 }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:"#F5F3FF", border:"2px solid #DDD6FE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>🧑‍🎓</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:16, color:"#111827", lineHeight:1.25 }}>{t.name}</div>
                  <div style={{ fontSize:13, color:"#6D28D9", fontWeight:700, marginTop:3 }}>{tcap(t.subjects || t.subject, 3)}</div>
                  {(t.qualifications || t.qualification) && (
                    <div style={{ fontSize:12, color:"#6B7280", fontWeight:600, marginTop:2 }}>{tcap(t.qualifications || t.qualification, 4)}</div>
                  )}
                </div>
              </div>

              {/* chips row */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                {(t.location || t.city) && <span style={{ fontSize:11.5, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:20, padding:"3px 10px", color:"#B91C1C", fontWeight:600 }}>📍 {t.location || t.city}</span>}
                {t.experience    && <span style={{ fontSize:11.5, background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:20, padding:"3px 10px", color:"#92400E", fontWeight:600 }}>⏳ {t.experience}</span>}
                {t.teaching_mode && <span style={{ fontSize:11.5, background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 10px", color:"#1A56DB", fontWeight:700 }}>💻 {t.teaching_mode}</span>}
                {t.gender        && <span style={{ fontSize:11.5, background:"#FDF2F8", border:"1px solid #FBCFE8", borderRadius:20, padding:"3px 10px", color:"#9D174D", fontWeight:600 }}>👤 {t.gender}</span>}
              </div>

              {/* labeled detail rows */}
              <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"7px 14px", marginBottom:14, fontSize:12.5 }}>
                <span style={{ color:"#9CA3AF", fontWeight:600 }}>Subjects</span>
                <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.subjects || t.subject, 0)}</span>
                <span style={{ color:"#9CA3AF", fontWeight:600 }}>Classes Taught</span>
                <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.classes_taught, 0)}</span>
                <span style={{ color:"#9CA3AF", fontWeight:600 }}>Qualifications</span>
                <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.qualifications || t.qualification, 0)}</span>
                <span style={{ color:"#9CA3AF", fontWeight:600 }}>Available Timing</span>
                <span style={{ color:"#374151", fontWeight:600 }}>{tcap(t.availability, 0)}</span>
                <span style={{ color:"#9CA3AF", fontWeight:600 }}>Location</span>
                <span style={{ color:"#374151", fontWeight:600 }}>{t.location || t.city || "—"}</span>
                <span style={{ color:"#9CA3AF", fontWeight:600 }}>Hourly Price</span>
                <span style={{ color:"#059669", fontWeight:800 }}>{t.hourly_rate ? t.hourly_rate : "—"}</span>
              </div>

              <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14 }}>
                {contacted.includes(t.id) ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {t.phone && (
                      <a href={"tel:" + t.phone} style={{ ...contactRow, color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }}>
                        📞 {t.phone}
                      </a>
                    )}
                    {t.phone && (
                      <a href={waLink(t.phone)} target="_blank" rel="noreferrer" style={{ ...contactRow, color:"#059669", borderColor:"#A7F3D0", background:"#ECFDF5" }}>
                        💬 WhatsApp
                      </a>
                    )}
                    {t.email && (
                      <a href={"mailto:" + t.email} style={{ ...contactRow, color:"#92400E", borderColor:"#FDE68A", background:"#FFFBEB" }}>
                        ✉️ {t.email}
                      </a>
                    )}
                    {!t.phone && !t.email && (
                      <div style={{ textAlign:"center", fontSize:12, color:"#9CA3AF" }}>No contact details available</div>
                    )}
                  </div>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ width:"100%", justifyContent:"center" }}
                    onClick={async () => {
                      // ADDED (credit system): 1 credit per new tutor contact, checked on the server.
                      // Already-contacted tutors stay open free (button hidden for them).
                      try {
                        const token = localStorage.getItem("acadhr_token");
                        const r = await fetch(`${API}/admin/parent/use-credit`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
                          body: JSON.stringify({ tutor_id: t.id }),
                        });
                        if (r.status === 402) { setShowUpgrade(true); return; }
                        if (r.ok) {
                          const d = await r.json();
                          if (typeof d.credits === "number") setCredits(d.credits);
                          setContacted(c => [...c, t.id]);
                          return;
                        }
                      } catch (e) { /* network issue — fall through to original behavior */ }
                      // Original behavior kept as fallback (e.g. backend not yet redeployed)
                      setContacted(c => [...c, t.id]);
                    }}>
                    📞 Contact Tutor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADDED (credit system): upgrade popup when credits reach 0 */}
      {showUpgrade && (
        <div onClick={() => setShowUpgrade(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:3000, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:16, paddingTop:70, overflowY:"auto" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#fff", borderRadius:18, maxWidth:400, width:"100%", padding:"30px 26px", textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,.25)" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🪙</div>
            <h3 style={{ fontWeight:800, fontSize:19, color:"#111827", marginBottom:8 }}>You're out of credits</h3>
            <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.6, marginBottom:22 }}>
              You've used your 5 free tutor contacts. Upgrade your plan to keep connecting with tutors.
            </p>
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", marginBottom:10 }}
              onClick={() => { setShowUpgrade(false); if (typeof setPage === "function") setPage("pricing"); }}>
              🚀 Upgrade Now
            </button>
            <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"center" }}
              onClick={() => setShowUpgrade(false)}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentDashboard;
