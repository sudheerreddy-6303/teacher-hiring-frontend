import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FilterBar, Toast } from "../common/Shared";
import { SUBS, INDIA_LOCATIONS } from "../../constants";
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

/* ═══════════════════════════════════════════════════════════════════════════
   Admin "Add" modals — these render the SAME forms that teachers, tutors,
   parents and schools fill in their own dashboards, so the admin can post a
   teacher profile, tutor profile, tuition requirement or job/position on
   anyone's behalf. Each form posts to the matching /api/admin create endpoint.
════════════════════════════════════════════════════════════════════════════ */
const ADD_META = {
  teacher: { title:"Add Teacher",             icon:"👩‍🏫", endpoint:"/admin/teachers", refresh:"teachers" },
  tutor:   { title:"Add Tutor",               icon:"🧑‍🎓", endpoint:"/admin/tutors",   refresh:"tutors"   },
  tuition: { title:"Add Tuition Requirement", icon:"📒",   endpoint:"/admin/tuitions", refresh:"parents"  },
  job:     { title:"Post a New Requirement",  icon:"💼",   endpoint:"/admin/jobs",     refresh:"jobs"     },
};

const SECTION = { fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginTop:22, marginBottom:14, paddingBottom:6, borderBottom:"2px solid #EBF5FF" };

// Reusable pill / chip selector — matches the style used across the role dashboards.
function Chips({ options, value, onChange, multi=false }) {
  const selected = multi ? (value ? String(value).split(",").map(s=>s.trim()).filter(Boolean) : []) : [value];
  const isOn = o => multi ? selected.includes(o) : value === o;
  const toggle = o => {
    if (!multi) return onChange(o);
    const cur = selected.includes(o) ? selected.filter(x=>x!==o) : [...selected, o];
    onChange(cur.join(", "));
  };
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
      {options.map(o => (
        <label key={o} onClick={() => toggle(o)}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20,
            border:`1.5px solid ${isOn(o)?"#1A56DB":"#D1D5DB"}`, background:isOn(o)?"#EBF5FF":"#fff",
            cursor:"pointer", fontSize:13, fontWeight:600, color:isOn(o)?"#1A56DB":"#374151", userSelect:"none" }}>
          {isOn(o) ? (multi?"✓ ":"● ") : (multi?"":"○ ")}{o}
        </label>
      ))}
    </div>
  );
}

/* ── Teacher form — mirrors TeacherDashboard → My Profile ── */
// ── Pill helpers that match the teacher dashboard's selectors ──
function PillRadio({ options, value, onChange, color="#1A56DB", bg="#EBF5FF" }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
      {options.map(o => {
        const on = value === o;
        return (
          <label key={o} onClick={()=>onChange(o)}
            style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${on?color:"#D1D5DB"}`, background:on?bg:"#fff", cursor:"pointer", fontSize:12, fontWeight:700, color:on?color:"#374151", userSelect:"none" }}>
            {on?"● ":"○ "}{o}
          </label>
        );
      })}
    </div>
  );
}
function PillMulti({ options, value, onChange, color="#1A56DB", bg="#EBF5FF", grid=false }) {
  const sel = value ? String(value).split(",").map(x=>x.trim()).filter(Boolean) : [];
  const toggle = o => { const next = sel.includes(o) ? sel.filter(x=>x!==o) : [...sel,o]; onChange(next.join(", ")); };
  const wrapStyle = grid
    ? { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:8, marginTop:6 }
    : { display:"flex", gap:8, flexWrap:"wrap", marginTop:6 };
  return (
    <div style={wrapStyle}>
      {options.map(o => {
        const on = sel.includes(o);
        return (
          <label key={o} onClick={()=>toggle(o)}
            style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${on?color:"#D1D5DB"}`, background:on?bg:"#fff", cursor:"pointer", fontSize:12, fontWeight:700, color:on?color:"#374151", userSelect:"none", display:"flex", alignItems:"center", justifyContent: grid?"center":"flex-start", gap:4 }}>
            {on?"✓ ":""}{o}
          </label>
        );
      })}
    </div>
  );
}
function YesNoPills({ value, onChange, color="#1A56DB" }) {
  return (
    <div style={{ display:"flex", gap:10, marginTop:6 }}>
      {["Yes","No"].map(v => {
        const on = value === v;
        return (
          <label key={v} onClick={()=>onChange(v)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 18px", borderRadius:22, border:`2px solid ${on?color:"#D1D5DB"}`, background:on?color+"15":"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:on?color:"#374151", userSelect:"none" }}>
            <div style={{ width:13, height:13, borderRadius:"50%", border:`2px solid ${on?color:"#9CA3AF"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {on && <div style={{ width:5, height:5, borderRadius:"50%", background:color }} />}
            </div>{v}
          </label>
        );
      })}
    </div>
  );
}

/* ── Teacher form — the SAME 5-section form a teacher fills under My Profile → Edit Profile.
   Email is editable and a password is added because the admin is creating the account.   ── */
function AdminTeacherForm({ form, up }) {
  const SUB_LIST = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Telugu","Kannada","Tamil","History","Geography","Civics","Accountancy","Business Studies"];
  const card = { padding:28, marginBottom:20 };
  const head = { fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:18, paddingBottom:8, borderBottom:"2px solid #EBF5FF" };

  const DEMO_MAX = 3;
  const [demoLinks, setDemoLinks] = useState(() => {
    const a = form.demo_link ? form.demo_link.split(",").map(x=>x.trim()).filter(Boolean) : [];
    return a.length ? a : [""];
  });
  const syncDemo  = rows => { setDemoLinks(rows); up("demo_link", rows.map(s=>s.trim()).filter(Boolean).join(", ")); };
  const setDemoAt = (i,v) => { const r=[...demoLinks]; r[i]=v; syncDemo(r); };
  const addDemo   = () => { if (demoLinks.length < DEMO_MAX) setDemoLinks([...demoLinks, ""]); };
  const removeDemo= i  => { if (demoLinks.length > 1) syncDemo(demoLinks.filter((_,x)=>x!==i)); };

  const prefList = form.preferred_locations ? form.preferred_locations.split(",").map(x=>x.trim()).filter(Boolean) : [];
  const specList = form.specialization ? form.specialization.split(",").map(x=>x.trim()).filter(Boolean) : [];

  return (
    <>
      {/* ── Section 1: Basic Information ── */}
      <div className="card" style={card}>
        <div style={head}>👤 Basic Information</div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Full Name *</label>
            <input className="input" value={form.full_name} onChange={e=>up("full_name",e.target.value)} placeholder="Teacher's full name" />
          </div>
          <div className="fg"><label className="flabel">Mobile Number *</label>
            <input className="input" value={form.mobile} onChange={e=>up("mobile",e.target.value)} placeholder="+91 98765 43210" />
          </div>
        </div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Email ID *</label>
            <input className="input" type="email" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="teacher@email.com" />
          </div>
          <div className="fg"><label className="flabel">Login Password</label>
            <input className="input" value={form.password} onChange={e=>up("password",e.target.value)} placeholder="Welcome@123" />
          </div>
        </div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Date of Birth *</label>
            <input className="input" type="date" value={form.dob} onChange={e=>up("dob",e.target.value)} />
          </div>
          <div className="fg"><label className="flabel">Gender *</label>
            <PillRadio options={["Male","Female","Prefer not to say"]} value={form.gender} onChange={v=>up("gender",v)} />
          </div>
        </div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Current Location (City) *</label>
            <input className="input" value={form.current_location} onChange={e=>up("current_location",e.target.value)} placeholder="e.g. Hyderabad" />
          </div>
          <div className="fg"><label className="flabel">Preferred Locations (select multiple cities)</label>
            <select className="input" value="" onChange={e=>{ const c=e.target.value; if(!c) return; if(!prefList.includes(c)) up("preferred_locations",[...prefList,c].join(", ")); }}>
              <option value="">+ Add city (you can select multiple)</option>
              {Object.entries(INDIA_LOCATIONS).map(([state,cities]) => (
                <optgroup key={state} label={state}>{cities.map(c=><option key={c} value={c}>{c}</option>)}</optgroup>
              ))}
            </select>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
              {prefList.map(c => (
                <span key={c} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, border:"1.5px solid #1A56DB", background:"#EBF5FF", fontSize:12, fontWeight:700, color:"#1A56DB" }}>
                  {c}<span onClick={()=>up("preferred_locations", prefList.filter(x=>x!==c).join(", "))} style={{ cursor:"pointer", fontWeight:900 }}>×</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Qualifications & Experience ── */}
      <div className="card" style={card}>
        <div style={head}>🎓 Qualifications & Experience</div>
        <div className="fg"><label className="flabel">Qualification * (B.Sc / M.Sc / B.Tech etc)</label>
          <PillRadio options={["B.Sc","M.Sc","B.Tech","M.Tech","B.Ed","M.Ed","M.Sc + B.Ed","B.Tech + B.Ed","PhD","Diploma"]} value={form.qualification} onChange={v=>up("qualification",v)} />
        </div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Specialization / Subject * (select at least 3)</label>
            <select className="input" value="" onChange={e=>{ const s=e.target.value; if(!s) return; if(!specList.includes(s)) up("specialization",[...specList,s].join(", ")); }}>
              <option value="">+ Add subject (you can select multiple)</option>
              {SUB_LIST.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
              {specList.map(s => (
                <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, border:"1.5px solid #1A56DB", background:"#EBF5FF", fontSize:12, fontWeight:700, color:"#1A56DB" }}>
                  {s}<span onClick={()=>up("specialization", specList.filter(x=>x!==s).join(", "))} style={{ cursor:"pointer", fontWeight:900 }}>×</span>
                </span>
              ))}
            </div>
          </div>
          <div className="fg"><label className="flabel">Current Role *</label>
            <select className="input" value={form.current_role} onChange={e=>up("current_role",e.target.value)}>
              <option value="">Select role</option>
              <option>Teacher</option><option>Faculty</option><option>Tutor</option><option>Lecturer</option><option>HOD</option><option>PGT</option><option>TGT</option><option>PRT</option><option>Fresher</option>
            </select>
          </div>
        </div>
        <div className="fg"><label className="flabel">Total Experience *</label>
          <PillRadio options={["Fresher","Less than 1 Year","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years","15+ Years","20+ Years"]} value={form.total_experience} onChange={v=>up("total_experience",v)} />
        </div>
        <div className="fg"><label className="flabel">Relevant Teaching Experience *</label>
          <PillRadio options={["Fresher","Less than 1 Year","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years","15+ Years","20+ Years"]} value={form.relevant_experience} onChange={v=>up("relevant_experience",v)} color="#059669" bg="#ECFDF5" />
        </div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Current Organization</label>
            <input className="input" value={form.current_org} onChange={e=>up("current_org",e.target.value)} placeholder="School / Coaching name" />
          </div>
          <div className="fg"><label className="flabel">Available From</label>
            <input className="input" type="date" value={form.available_from} onChange={e=>up("available_from",e.target.value)} />
          </div>
        </div>
        <div className="grid2">
          <div className="fg"><label className="flabel">Current Salary (Monthly)</label>
            <select className="input" value={form.current_salary} onChange={e=>up("current_salary",e.target.value)}>
              <option value="">Select range</option>
              <option>Below ₹20,000</option><option>₹20,000–₹40,000</option><option>₹40,000–₹60,000</option>
              <option>₹60,000–₹80,000</option><option>₹80,000–₹100,000</option><option>₹100,000–₹120,000</option>
            </select>
          </div>
          <div className="fg"><label className="flabel">Expected Salary (Monthly)</label>
            <select className="input" value={form.expected_salary} onChange={e=>up("expected_salary",e.target.value)}>
              <option value="">Select range</option>
              <option>Below ₹20,000</option><option>₹20,000–₹40,000</option><option>₹40,000–₹60,000</option>
              <option>₹60,000–₹80,000</option><option>₹80,000–₹100,000</option><option>₹100,000–₹120,000</option>
              <option>₹120,000–₹140,000</option><option>₹140,000–₹160,000</option><option>₹160,000–₹180,000</option>
              <option>₹180,000–₹200,000</option><option>Above ₹2,00,000</option><option>Above ₹3,00,000</option>
            </select>
          </div>
        </div>
        <div className="fg"><label className="flabel">Notice Period</label>
          <PillRadio options={["Immediate","15 Days","30 Days","45 Days","60 Days","90 Days"]} value={form.notice_period} onChange={v=>up("notice_period",v)} color="#D97706" bg="#FFFBEB" />
        </div>
        <div className="fg"><label className="flabel">Certifications</label>
          <PillMulti options={["B.Ed","M.Ed","CTET","TET (State)","NET","SET","NTT","D.El.Ed","BTC","PGDCA","None"]} value={form.certifications} onChange={v=>up("certifications",v)} color="#6D28D9" bg="#F5F3FF" />
        </div>
      </div>

      {/* ── Section 3: Teaching Preferences ── */}
      <div className="card" style={card}>
        <div style={head}>📚 Teaching Preferences</div>
        <div className="fg"><label className="flabel">Work Mode *</label>
          <PillRadio options={["Full-time","Part-time","Online","Hybrid"]} value={form.work_mode} onChange={v=>up("work_mode",v)} />
        </div>
        <div className="fg"><label className="flabel">Tutor Type</label>
          <PillRadio options={["School Teacher","Coaching Faculty","Home Tutor","Online Tutor"]} value={form.tutor_type} onChange={v=>up("tutor_type",v)} color="#0EA5E9" bg="#E0F2FE" />
        </div>
        <div className="fg"><label className="flabel">Subjects * (select all you teach)</label>
          <PillMulti options={SUB_LIST} value={form.subjects} onChange={v=>up("subjects",v)} grid />
          {form.subjects && <div style={{ fontSize:11, color:"#6B7280", marginTop:5 }}>Selected: {form.subjects}</div>}
        </div>
        <div className="fg"><label className="flabel">Grades Handling * (select all applicable)</label>
          <PillMulti options={["Pre-Primary (Nursery–KG)","Primary (1–5)","Upper Primary (6–8)","Secondary (9–10)","Senior Secondary (11–12)","All Grades","Degree Level","Diploma Level"]} value={form.grades_handling} onChange={v=>up("grades_handling",v)} />
        </div>
        <div className="fg"><label className="flabel">Boards Handled * (CBSE / ICSE / State)</label>
          <PillMulti options={["CBSE","ICSE","State Board (AP)","State Board (TS)","State Board (KA)","State Board (MH)","IB","IGCSE","All Boards"]} value={form.boards_handled} onChange={v=>up("boards_handled",v)} color="#059669" bg="#ECFDF5" />
        </div>
        <div className="fg"><label className="flabel">Competitive Exams Handled</label>
          <PillMulti options={["JEE (Mains)","JEE (Advanced)","NEET","EAMCET","Olympiad","NTSE","NDA","UPSC","CA Foundation","State SET"]} value={form.competitive_exams} onChange={v=>up("competitive_exams",v)} color="#6D28D9" bg="#F5F3FF" />
        </div>
        <div className="fg"><label className="flabel">Teaching Mode *</label>
          <PillRadio options={["Offline","Online","Hybrid (Both)"]} value={form.teaching_mode} onChange={v=>up("teaching_mode",v)} />
        </div>
        <div className="fg"><label className="flabel">Languages Known *</label>
          <PillMulti options={["English","Hindi","Telugu","Kannada","Tamil","Malayalam","Marathi","Bengali","Gujarati","Punjabi","Urdu","Odia"]} value={form.languages} onChange={v=>up("languages",v)} color="#D97706" bg="#FFFBEB" />
        </div>
      </div>

      {/* ── Section 4: Demo & Additional Details ── */}
      <div className="card" style={card}>
        <div style={head}>🎥 Demo & Additional Details</div>
        <div className="fg"><label className="flabel">Demo Available</label>
          <YesNoPills value={form.demo_available} onChange={v=>up("demo_available",v)} color="#059669" />
        </div>
        <div className="fg"><label className="flabel">Demo Link (Video URL)</label>
          <div style={{ fontSize:12, color:"#6B7280", marginTop:2, marginBottom:8, lineHeight:1.6 }}>
            📁 Paste the demo video as a <strong>Google Drive</strong> link. You can add 1 to 3 links.
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {demoLinks.map((link, idx) => {
              const invalid = link.trim() !== "" && !link.includes("drive.google.com");
              return (
                <div key={idx}>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <input className="input" value={link} onChange={e=>setDemoAt(idx,e.target.value)} placeholder="https://drive.google.com/file/d/.../view?usp=sharing" style={{ flex:1 }} />
                    {demoLinks.length > 1 && (
                      <button type="button" onClick={()=>removeDemo(idx)} title="Remove this link"
                        style={{ flexShrink:0, width:38, height:38, borderRadius:8, border:"1.5px solid #FCA5A5", background:"#FEF2F2", color:"#DC2626", fontWeight:900, fontSize:16, cursor:"pointer" }}>×</button>
                    )}
                  </div>
                  {invalid && <div style={{ fontSize:11, color:"#DC2626", marginTop:4 }}>⚠️ This doesn't look like a Google Drive link.</div>}
                </div>
              );
            })}
            {demoLinks.length < DEMO_MAX && (
              <button type="button" onClick={addDemo}
                style={{ alignSelf:"flex-start", padding:"8px 16px", borderRadius:8, border:"1.5px dashed #1A56DB", background:"#EBF5FF", color:"#1A56DB", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                + Add another link ({demoLinks.length}/{DEMO_MAX})
              </button>
            )}
          </div>
        </div>
        <div className="grid2">
          {[
            ["Residential Preference","residential_pref","#1A56DB"],
            ["Relocation Ready","relocation_ready","#1A56DB"],
            ["Accommodation Required","accommodation_req","#DC2626"],
            ["Aadhaar / ID Verified","aadhaar_verified","#059669"],
          ].map(([label,key,color]) => (
            <div key={key} className="fg"><label className="flabel">{label}</label>
              <YesNoPills value={form[key]} onChange={v=>up(key,v)} color={color} />
            </div>
          ))}
        </div>
        <div className="fg"><label className="flabel">Profile Status</label>
          <div style={{ display:"flex", gap:10, marginTop:6 }}>
            {[["Active","#059669"],["Inactive","#DC2626"]].map(([v,color]) => {
              const on = form.profile_status === v;
              return (
                <label key={v} onClick={()=>up("profile_status",v)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 20px", borderRadius:22, border:`2px solid ${on?color:"#D1D5DB"}`, background:on?color+"18":"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:on?color:"#374151", userSelect:"none" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:on?color:"#D1D5DB" }} />{v}
                </label>
              );
            })}
          </div>
        </div>
        <div className="fg"><label className="flabel">Resume Link (Google Drive)</label>
          <input className="input" value={form.resume_link} onChange={e=>{ up("resume_link",e.target.value); up("resume_file_name",""); }} placeholder="https://drive.google.com/file/..." />
        </div>
        <div className="fg"><label className="flabel">Remarks / Notes</label>
          <textarea className="input" rows={3} value={form.remarks} onChange={e=>up("remarks",e.target.value)} placeholder="Any additional information..." />
        </div>
      </div>

      {/* ── Section 5: Terms & Conditions ── */}
      <div className="card" style={card}>
        <div style={head}>📜 Terms & Conditions</div>
        <div style={{ maxHeight:200, overflowY:"auto", padding:"14px 16px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, fontSize:13, color:"#374151", lineHeight:1.7 }}>
          <p style={{ marginTop:0 }}>By submitting this profile, the teacher confirms and agrees that:</p>
          <ol style={{ paddingLeft:18, margin:0 }}>
            <li>All information provided in this profile is true, accurate, and complete.</li>
            <li>The documents, demo videos, and links shared (including Google Drive links) are genuine.</li>
            <li>AcadHr is authorized to share this profile with registered schools and recruiters for hiring purposes.</li>
            <li>Providing false or misleading information may lead to rejection or removal of the profile.</li>
            <li>The teacher agrees to be contacted by AcadHr and prospective employers regarding suitable opportunities.</li>
          </ol>
        </div>
        <label onClick={()=>up("terms_accepted", form.terms_accepted==="Yes" ? "No" : "Yes")}
          style={{ display:"flex", alignItems:"center", gap:10, marginTop:14, cursor:"pointer", userSelect:"none" }}>
          <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${form.terms_accepted==="Yes"?"#059669":"#9CA3AF"}`, background:form.terms_accepted==="Yes"?"#059669":"#fff", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:900, flexShrink:0 }}>
            {form.terms_accepted==="Yes" ? "✓" : ""}
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>I have read and accept the Terms &amp; Conditions</span>
        </label>
      </div>
    </>
  );
}

/* ── Tutor form — mirrors TutorDashboard → My Profile ── */
function AdminTutorForm({ form, up }) {
  return (
    <>
      <div style={{ ...SECTION, marginTop:0 }}>👤 Account & Contact</div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Full Name *</label><input className="input" value={form.name} onChange={e=>up("name",e.target.value)} placeholder="Tutor's full name" /></div>
        <div className="fg"><label className="flabel">Email ID *</label><input className="input" type="email" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="tutor@email.com" /></div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Phone</label><input className="input" value={form.phone} onChange={e=>up("phone",e.target.value)} placeholder="+91 98765 43210" /></div>
        <div className="fg"><label className="flabel">Login Password</label><input className="input" value={form.password} onChange={e=>up("password",e.target.value)} /></div>
      </div>

      <div style={SECTION}>📚 Tutor Profile</div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Subject(s) * (select one or more)</label>
          <PillMulti options={SUBS} value={form.subject} onChange={v=>up("subject",v)} grid />
        </div>
        <div className="fg"><label className="flabel">City</label><input className="input" value={form.city} onChange={e=>up("city",e.target.value)} placeholder="e.g. Hyderabad" /></div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Experience</label>
          <select className="input" value={form.experience} onChange={e=>up("experience",e.target.value)}>
            <option value="">Select</option>{["Fresher","1–2 Years","2–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years"].map(x=><option key={x}>{x}</option>)}
          </select>
        </div>
        <div className="fg"><label className="flabel">Qualification</label><input className="input" value={form.qualification} onChange={e=>up("qualification",e.target.value)} placeholder="e.g. M.Sc, B.Ed" /></div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Hourly Rate (₹)</label><input className="input" value={form.hourly_rate} onChange={e=>up("hourly_rate",e.target.value)} placeholder="e.g. 500" /></div>
        <div className="fg"><label className="flabel">Teaching Mode</label>
          <select className="input" value={form.teaching_mode} onChange={e=>up("teaching_mode",e.target.value)}>
            <option>Both</option><option>Online</option><option>Offline</option>
          </select>
        </div>
      </div>
      <div className="fg"><label className="flabel">Bio</label><textarea className="input" rows={3} value={form.bio} onChange={e=>up("bio",e.target.value)} placeholder="A short bio..." /></div>
    </>
  );
}

/* ── Tuition requirement form — mirrors ParentDashboard → My Requirement ── */
function AdminTuitionForm({ form, up }) {
  return (
    <>
      <div style={{ ...SECTION, marginTop:0 }}>👨‍👩‍👧 Parent Account</div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Parent Name *</label><input className="input" value={form.name} onChange={e=>up("name",e.target.value)} placeholder="Parent's name" /></div>
        <div className="fg"><label className="flabel">Email ID *</label><input className="input" type="email" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="parent@email.com" /></div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Phone</label><input className="input" value={form.phone} onChange={e=>up("phone",e.target.value)} placeholder="+91 98765 43210" /></div>
        <div className="fg"><label className="flabel">Login Password</label><input className="input" value={form.password} onChange={e=>up("password",e.target.value)} /></div>
      </div>

      <div style={SECTION}>📋 Tutor Requirement</div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Student Name</label><input className="input" value={form.student_name} onChange={e=>up("student_name",e.target.value)} placeholder="Child's name" /></div>
        <div className="fg"><label className="flabel">Class / Grade</label>
          <select className="input" value={form.student_class} onChange={e=>up("student_class",e.target.value)}>
            <option value="">Select class</option>{["Pre-Primary (Nursery–KG)","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Degree"].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Board</label>
          <select className="input" value={form.board} onChange={e=>up("board",e.target.value)}>
            <option value="">Select board</option><option>CBSE</option><option>ICSE</option><option>State Board (AP)</option><option>State Board (TS)</option><option>IB</option><option>IGCSE</option>
          </select>
        </div>
        <div className="fg"><label className="flabel">Subject(s) Required *</label><input className="input" value={form.subject} onChange={e=>up("subject",e.target.value)} placeholder="e.g. Mathematics, Physics" /></div>
      </div>
      <div className="fg"><label className="flabel">Location / Area</label><input className="input" value={form.location} onChange={e=>up("location",e.target.value)} placeholder="e.g. Banjara Hills, Hyderabad" /></div>
      <div className="fg"><label className="flabel">Tutoring Mode</label>
        <div style={{ display:"flex", gap:10, marginTop:6 }}>
          {["Home","Online","Either"].map(m => (
            <label key={m} onClick={()=>up("mode",m)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px 0", borderRadius:10, border:`2px solid ${form.mode===m?"#1A56DB":"#E5E7EB"}`, background:form.mode===m?"#EBF5FF":"#F9FAFB", cursor:"pointer", fontSize:13, fontWeight:700, color:form.mode===m?"#1A56DB":"#6B7280", userSelect:"none" }}>
              {m==="Home"?"🏠":m==="Online"?"💻":"🔄"} {m}
            </label>
          ))}
        </div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Preferred Time</label>
          <select className="input" value={form.preferred_time} onChange={e=>up("preferred_time",e.target.value)}>
            <option value="">Select</option><option>Morning (6am–12pm)</option><option>Afternoon (12pm–4pm)</option><option>Evening (4pm–8pm)</option><option>Flexible</option>
          </select>
        </div>
        <div className="fg"><label className="flabel">Monthly Budget (₹)</label>
          <select className="input" value={form.budget} onChange={e=>up("budget",e.target.value)}>
            <option value="">Select range</option><option>Under ₹2,000</option><option>₹2,000–₹4,000</option><option>₹4,000–₹6,000</option><option>₹6,000–₹10,000</option><option>Above ₹10,000</option>
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="flabel">Tutor Gender Preference</label>
          <select className="input" value={form.tutor_gender_pref} onChange={e=>up("tutor_gender_pref",e.target.value)}>
            <option value="">No Preference</option><option>Male</option><option>Female</option>
          </select>
        </div>
        <div className="fg"><label className="flabel">Experience Required</label>
          <select className="input" value={form.experience_req} onChange={e=>up("experience_req",e.target.value)}>
            <option value="">Any</option><option>Fresher OK</option><option>1+ Years</option><option>2+ Years</option><option>3+ Years</option><option>5+ Years</option>
          </select>
        </div>
      </div>
      <div className="fg"><label className="flabel">Additional Notes</label><textarea className="input" rows={3} value={form.notes} onChange={e=>up("notes",e.target.value)} placeholder="Any special requirements..." /></div>
    </>
  );
}

/* ── Job / position form — mirrors SchoolDashboard → Post a New Requirement ── */
function AdminJobForm({ form, up }) {
  // Same inline section styles the school "Post a New Requirement" form uses.
  const sec     = { fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:14, paddingBottom:6, borderBottom:"2px solid #EBF5FF" };
  const secTop  = { ...sec, marginTop:0 };
  const secNext = { ...sec, marginTop:22 };
  const secGray = { fontWeight:800, fontSize:13, color:"#6B7280", textTransform:"uppercase", letterSpacing:1, marginTop:22, marginBottom:14, paddingBottom:6, borderBottom:"2px solid #F3F4F6" };
  return (
    <>
      {/* ── Section 1: Institution Details ── */}
      <div style={secTop}>🏫 Institution Details</div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Requirement ID</label>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:"#F0FDF4", border:"1.5px solid #A7F3D0", borderRadius:8 }}>
            <span style={{ fontSize:16 }}>🔖</span>
            <span style={{ fontWeight:800, fontSize:16, color:"#059669", fontFamily:"Fira Code,monospace", letterSpacing:1 }}>Will be generated on submit</span>
          </div>
          <div style={{ fontSize:11, color:"#6B7280", marginTop:4 }}>Auto-generated by the system. Unique &amp; saved to database.</div>
        </div>
        <div className="fg">
          <label className="flabel">Institution Name *</label>
          <input className="input" placeholder="e.g. Delhi Public School" value={form.institution_name} onChange={e => up("institution_name",e.target.value)} />
        </div>
      </div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Institution Type *</label>
          <select className="input" value={form.institution_type} onChange={e => up("institution_type",e.target.value)}>
            <option value="">Select type</option>
            <option>School</option><option>Coaching</option><option>Junior College</option>
            <option>Degree College</option><option>Online Platform</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">State *</label>
          <select className="input" value={form.location_state} onChange={e => { up("location_state", e.target.value); up("location_city", ""); }}>
            <option value="">Select state</option>
            {Object.keys(INDIA_LOCATIONS).sort().map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">City *</label>
          <select className="input" value={form.location_city} onChange={e => up("location_city", e.target.value)} disabled={!form.location_state}>
            <option value="">{form.location_state ? "Select city" : "Select state first"}</option>
            {form.location_state && (INDIA_LOCATIONS[form.location_state]||[]).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Contact Person</label>
          <input className="input" placeholder="Name" value={form.contact_person} onChange={e => up("contact_person",e.target.value)} />
        </div>
      </div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Contact Number</label>
          <input className="input" type="tel" placeholder="+91 98765 43210" value={form.contact_number} onChange={e => up("contact_number",e.target.value)} />
        </div>
        <div className="fg">
          <label className="flabel">Email</label>
          <input className="input" type="email" placeholder="contact@school.edu.in" value={form.contact_email} onChange={e => up("contact_email",e.target.value)} />
        </div>
      </div>

      {/* ── Section 2: Requirement Details ── */}
      <div style={secNext}>📋 Requirement Details</div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Requirement Type *</label>
          <select className="input" value={form.requirement_type} onChange={e => up("requirement_type",e.target.value)}>
            <option>Teacher</option><option>Faculty</option><option>Tutor</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Subject(s) * (select one or more)</label>
          <PillMulti options={SUBS} value={form.subject} onChange={v => up("subject",v)} grid />
        </div>
      </div>

      {/* Grades — checkboxes */}
      <div className="fg">
        <label className="flabel">Grades / Classes</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
          {["Nursery–KG","Grade 1–5","Grade 6–8","Grade 9–10","Grade 11–12","All Grades","Degree","Diploma"].map(g => (
            <label key={g} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, border:`1.5px solid ${form.grades.includes(g)?"#1A56DB":"#D1D5DB"}`, background:form.grades.includes(g)?"#EBF5FF":"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:form.grades.includes(g)?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
              <input type="checkbox" style={{ display:"none" }} checked={form.grades.includes(g)}
                onChange={() => up("grades", form.grades.includes(g) ? form.grades.filter(x => x !== g) : [...form.grades, g])} />
              {form.grades.includes(g) ? "✓ " : ""}{g}
            </label>
          ))}
        </div>
        {form.grades.length > 0 && <div style={{ fontSize:11, color:"#6B7280", marginTop:6 }}>Selected: {form.grades.join(", ")}</div>}
      </div>

      {/* Board — radio */}
      <div className="fg">
        <label className="flabel">Board</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
          {["CBSE","ICSE","State Board","IB","IGCSE","All Boards"].map(b => (
            <label key={b} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, border:`1.5px solid ${form.board===b?"#1A56DB":"#D1D5DB"}`, background:form.board===b?"#EBF5FF":"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:form.board===b?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
              <input type="radio" name="board" style={{ display:"none" }} checked={form.board===b} onChange={() => up("board", b)} />
              {form.board===b ? "● " : "○ "}{b}
            </label>
          ))}
        </div>
      </div>

      {/* Experience — radio */}
      <div className="fg">
        <label className="flabel">Experience Required</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
          {["Fresher","0–1 Year","1–3 Years","3–5 Years","5–8 Years","8–10 Years","10+ Years"].map(exp => (
            <label key={exp} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, border:`1.5px solid ${form.experience===exp?"#1A56DB":"#D1D5DB"}`, background:form.experience===exp?"#EBF5FF":"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:form.experience===exp?"#1A56DB":"#374151", transition:"all .15s", userSelect:"none" }}>
              <input type="radio" name="experience" style={{ display:"none" }} checked={form.experience===exp} onChange={() => up("experience", exp)} />
              {form.experience===exp ? "● " : "○ "}{exp}
            </label>
          ))}
        </div>
      </div>

      {/* ── Section 3: Compensation & Schedule ── */}
      <div style={secNext}>💰 Compensation &amp; Schedule</div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Salary Budget — Min (₹/mo)</label>
          <input className="input" type="number" placeholder="e.g. 30000" value={form.salary_min} onChange={e => up("salary_min",e.target.value)} />
        </div>
        <div className="fg">
          <label className="flabel">Salary Budget — Max (₹/mo)</label>
          <input className="input" type="number" placeholder="e.g. 60000" value={form.salary_max} onChange={e => up("salary_max",e.target.value)} />
        </div>
      </div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Joining Timeline</label>
          <select className="input" value={form.joining_timeline} onChange={e => up("joining_timeline",e.target.value)}>
            <option>Immediate</option><option>Within 15 days</option>
            <option>30 days</option><option>60 days</option><option>Flexible</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Work Mode</label>
          <select className="input" value={form.work_mode} onChange={e => up("work_mode",e.target.value)}>
            <option>Full-time</option><option>Part-time</option>
            <option>Online</option><option>Hybrid</option>
          </select>
        </div>
      </div>

      {/* ── Section 4: Conditions ── */}
      <div style={secNext}>🏠 Conditions &amp; Preferences</div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Residential</label>
          <select className="input" value={form.residential} onChange={e => up("residential",e.target.value)}>
            <option>No</option><option>Yes</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Accommodation</label>
          <select className="input" value={form.accommodation} onChange={e => up("accommodation",e.target.value)}>
            <option>Not Provided</option><option>Provided</option>
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Gender Preference</label>
          <select className="input" value={form.gender_preference} onChange={e => up("gender_preference",e.target.value)}>
            <option>No Preference</option><option>Male</option><option>Female</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Interview Mode</label>
          <select className="input" value={form.interview_mode} onChange={e => up("interview_mode",e.target.value)}>
            <option>Online</option><option>Offline</option><option>Both</option>
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Demo Required</label>
          <select className="input" value={form.demo_required} onChange={e => up("demo_required",e.target.value)}>
            <option>No</option><option>Yes</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Number of Positions</label>
          <input className="input" type="number" min="1" placeholder="1" value={form.positions} onChange={e => up("positions",e.target.value)} />
        </div>
      </div>

      {/* ── Section 5: Admin / Internal ── */}
      <div style={secGray}>🗂 Internal Details</div>
      <div className="grid2">
        <div className="fg">
          <label className="flabel">Status</label>
          <select className="input" value={form.status} onChange={e => up("status",e.target.value)}>
            <option>Open</option><option>Closed</option>
          </select>
        </div>
        <div className="fg">
          <label className="flabel">Assigned Recruiter</label>
          <input className="input" placeholder="Recruiter name" value={form.assigned_recruiter} onChange={e => up("assigned_recruiter",e.target.value)} />
        </div>
      </div>
      <div className="fg">
        <label className="flabel">Notes / Remarks</label>
        <textarea className="input" rows={3} placeholder="Any additional remarks or special requirements..." value={form.notes} onChange={e => up("notes",e.target.value)} />
      </div>
    </>
  );
}

const ADD_REQUIRED = {
  teacher: [["full_name","Full Name"],["email","Email"],["specialization","Specialization / Subject"]],
  tutor:   [["name","Full Name"],["email","Email"],["subject","Subject"]],
  tuition: [["name","Parent Name"],["email","Email"],["subject","Subject(s) Required"]],
  job:     [["subject","Subject"]],
};

const ADD_INIT = {
  teacher: { full_name:"", email:"", mobile:"", password:"Welcome@123", gender:"", dob:"", current_location:"", preferred_locations:"", qualification:"", specialization:"", total_experience:"", relevant_experience:"", current_role:"", current_org:"", current_salary:"", expected_salary:"", notice_period:"", available_from:"", certifications:"", work_mode:"", tutor_type:"", subjects:"", grades_handling:"", boards_handled:"", competitive_exams:"", teaching_mode:"", languages:"", demo_available:"", demo_link:"", residential_pref:"", relocation_ready:"", accommodation_req:"", aadhaar_verified:"", resume_link:"", resume_file_name:"", profile_status:"Active", remarks:"", terms_accepted:"" },
  tutor:   { name:"", email:"", phone:"", password:"Welcome@123", subject:"", city:"", experience:"", qualification:"", hourly_rate:"", teaching_mode:"Both", bio:"" },
  tuition: { name:"", email:"", phone:"", password:"Welcome@123", student_name:"", student_class:"", board:"", subject:"", location:"", mode:"Home", preferred_time:"", budget:"", tutor_gender_pref:"", experience_req:"", notes:"" },
  job:     { institution_name:"", institution_type:"", location_state:"", location_city:"", contact_person:"", contact_number:"", contact_email:"", requirement_type:"Teacher", subject:"", grades:[], board:"CBSE", experience:"", salary_min:"", salary_max:"", joining_timeline:"Immediate", work_mode:"Full-time", residential:"No", accommodation:"Not Provided", gender_preference:"No Preference", interview_mode:"Online", demo_required:"No", positions:1, status:"Open", assigned_recruiter:"", notes:"" },
};

/* ── Teacher View/Edit modal — shows the SAME full teacher form, pre-filled with
   the selected teacher's data, and lets the admin update & save it.            ── */
function TeacherEditModal({ teacher, api, hdr, onClose, onToggle, onSaved }) {
  const d = (v) => (v ? String(v).split("T")[0] : "");   // ISO datetime → YYYY-MM-DD
  const [form, setForm] = useState(() => ({
    full_name:           teacher.full_name || teacher.name || "",
    email:               teacher.email || "",
    mobile:              teacher.mobile || teacher.phone || "",
    password:            "",
    gender:              teacher.gender || "",
    dob:                 d(teacher.dob),
    current_location:    teacher.current_location || teacher.city || "",
    preferred_locations: teacher.preferred_locations || "",
    qualification:       teacher.qualification || "",
    specialization:      teacher.specialization || "",
    total_experience:    teacher.total_experience || "",
    relevant_experience: teacher.relevant_experience || "",
    current_role:        teacher.current_role || "",
    current_org:         teacher.current_org || "",
    current_salary:      teacher.current_salary || "",
    expected_salary:     teacher.expected_salary || "",
    notice_period:       teacher.notice_period || "",
    available_from:      d(teacher.available_from),
    certifications:      teacher.certifications || "",
    work_mode:           teacher.work_mode || "",
    tutor_type:          teacher.tutor_type || "",
    subjects:            teacher.subjects || "",
    grades_handling:     teacher.grades_handling || "",
    boards_handled:      teacher.boards_handled || "",
    competitive_exams:   teacher.competitive_exams || "",
    teaching_mode:       teacher.teaching_mode || "",
    languages:           teacher.languages || "",
    demo_available:      teacher.demo_available || "",
    demo_link:           teacher.demo_link || "",
    residential_pref:    teacher.residential_pref || "",
    relocation_ready:    teacher.relocation_ready || "",
    accommodation_req:   teacher.accommodation_req || "",
    aadhaar_verified:    teacher.aadhaar_verified || "",
    resume_link:         teacher.resume_link || "",
    resume_file_name:    teacher.resume_file_name || "",
    profile_status:      teacher.profile_status || "Active",
    remarks:             teacher.remarks || "",
    terms_accepted:      teacher.terms_accepted || "",
  }));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const up = (k, v) => setForm(s => ({ ...s, [k]: v }));

  async function save() {
    if (!String(form.full_name).trim() || !String(form.email).trim()) { setMsg("⚠️ Name and Email are required."); return; }
    setSaving(true); setMsg("");
    try {
      const r = await fetch(api + `/admin/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { ...hdr, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) { setMsg("✓ Changes saved to database."); onSaved && onSaved(); }
      else setMsg("Error: " + (data.message || "Save failed"));
    } catch (e) { setMsg("Network error: " + e.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"22px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#93C5FD", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>👩‍🏫 Teacher Profile</div>
              <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{form.full_name || teacher.name}</div>
              <div style={{ color:"#BFDBFE", fontSize:13, marginTop:2 }}>{form.specialization || "—"}{form.current_location ? ` · 📍 ${form.current_location}` : ""}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
          </div>
        </div>
        {/* Body — the full form, pre-filled */}
        <div style={{ padding:"24px 28px" }}>
          {msg && <div className={"alert " + (msg.startsWith("✓") ? "a-ok" : "a-warn")} style={{ marginBottom:16 }}>{msg}</div>}
          <AdminTeacherForm form={form} up={up} />
          <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:8, paddingTop:18, borderTop:"1px solid #E5E7EB" }}>
            <button className={"btn btn-sm " + (teacher.is_active ? "btn-danger" : "btn-success")} onClick={() => onToggle(teacher.id)}>
              {teacher.is_active ? "Deactivate" : "Activate"}
            </button>
            <div style={{ flex:1 }} />
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes ✓"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tutor View/Edit modal — shows the SAME tutor registration form, pre-filled
   with the selected tutor's data, and lets the admin update & save it.        ── */
function TutorEditModal({ tutor, api, hdr, onClose, onToggle, onSaved }) {
  const EXPS  = ["Fresher (0-1 year)","1-3 years","3-5 years","5-10 years","10+ years"];
  const QUALS = ["B.Ed","M.Ed","M.Sc + B.Ed","B.Tech + B.Ed","M.Tech + B.Ed","PhD","Diploma in Education"];
  const TIMES = ["Morning","Afternoon","Evening","Any Time"];
  const [form, setForm] = useState(() => ({
    name:          tutor.name || "",
    email:         tutor.email || "",
    phone:         tutor.phone || "",
    city:          tutor.city || "",
    password:      "",
    subjects:      tutor.subjects || tutor.subject || "",
    qualifications:tutor.qualifications || tutor.qualification || "",
    experience:    tutor.experience || "",
    hourly_rate:   tutor.hourly_rate || "",
    teaching_mode: tutor.teaching_mode || "Both",
    availability:  tutor.availability || "",
    address:       tutor.address || "",
    location:      tutor.location || "",
    pincode:       tutor.pincode || "",
    class_link:    tutor.class_link || "",
    resume_link:   tutor.resume_link || "",
    resume_file_name: tutor.resume_file_name || "",
    bio:           tutor.bio || "",
  }));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const up = (k, v) => setForm(s => ({ ...s, [k]: v }));

  async function save() {
    if (!String(form.name).trim() || !String(form.email).trim()) { setMsg("⚠️ Name and Email are required."); return; }
    setSaving(true); setMsg("");
    try {
      const r = await fetch(api + `/admin/tutors/${tutor.id}`, {
        method: "PATCH",
        headers: { ...hdr, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) { setMsg("✓ Changes saved to database."); onSaved && onSaved(); }
      else setMsg("Error: " + (data.message || "Save failed"));
    } catch (e) { setMsg("Network error: " + e.message); }
    finally { setSaving(false); }
  }

  const sec = { fontWeight:800, fontSize:13, color:"#6D28D9", textTransform:"uppercase", letterSpacing:1, marginTop:22, marginBottom:14, paddingBottom:6, borderBottom:"2px solid #F5F3FF" };

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
        <div style={{ background:"linear-gradient(135deg,#5B21B6,#7C3AED)", padding:"22px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#DDD6FE", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>🧑‍🎓 Tutor Profile</div>
              <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{form.name}</div>
              <div style={{ color:"#EDE9FE", fontSize:13, marginTop:2 }}>{(form.subjects||"").split(",")[0] || "—"}{form.city ? ` · 📍 ${form.city}` : ""}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          {msg && <div className={"alert " + (msg.startsWith("✓") ? "a-ok" : "a-warn")} style={{ marginBottom:16 }}>{msg}</div>}

          <div style={{ ...sec, marginTop:0 }}>👤 Account & Contact</div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Full Name *</label><input className="input" value={form.name} onChange={e=>up("name",e.target.value)} /></div>
            <div className="fg"><label className="flabel">Email ID *</label><input className="input" type="email" value={form.email} onChange={e=>up("email",e.target.value)} /></div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Phone</label><input className="input" value={form.phone} onChange={e=>up("phone",e.target.value)} /></div>
            <div className="fg"><label className="flabel">City</label><input className="input" value={form.city} onChange={e=>up("city",e.target.value)} /></div>
          </div>
          <div className="fg"><label className="flabel">Login Password</label><input className="input" value={form.password} onChange={e=>up("password",e.target.value)} placeholder="Leave blank to keep current password" /></div>

          <div style={sec}>🧑‍🎓 Tutor Details</div>
          <div className="fg"><label className="flabel">Subjects (select one or more)</label>
            <PillMulti options={SUBS} value={form.subjects} onChange={v=>up("subjects",v)} color="#6D28D9" bg="#F5F3FF" grid />
          </div>
          <div className="fg"><label className="flabel">Qualifications (select one or more)</label>
            <PillMulti options={QUALS} value={form.qualifications} onChange={v=>up("qualifications",v)} color="#6D28D9" bg="#F5F3FF" />
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Experience</label>
              <select className="input" value={form.experience} onChange={e=>up("experience",e.target.value)}>
                <option value="">Select</option>{EXPS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="fg"><label className="flabel">Hourly Charges</label>
              <input className="input" placeholder="e.g. ₹800/hr" value={form.hourly_rate} onChange={e=>up("hourly_rate",e.target.value)} />
            </div>
          </div>
          <div className="fg"><label className="flabel">Teaching Mode</label>
            <select className="input" value={form.teaching_mode} onChange={e=>up("teaching_mode",e.target.value)}>
              <option>Online</option><option>Offline</option><option>Both</option>
            </select>
          </div>
          <div className="fg"><label className="flabel">Available Timings (select one or more)</label>
            <PillMulti options={TIMES} value={form.availability} onChange={v=>up("availability",v)} color="#D97706" bg="#FFFBEB" />
          </div>

          <div style={sec}>📍 Location & Links</div>
          <div className="fg"><label className="flabel">Address</label><input className="input" placeholder="House no., street, area" value={form.address} onChange={e=>up("address",e.target.value)} /></div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Location</label><input className="input" placeholder="e.g. Banjara Hills, Hyderabad" value={form.location} onChange={e=>up("location",e.target.value)} /></div>
            <div className="fg"><label className="flabel">Pincode</label><input className="input" placeholder="e.g. 500034" value={form.pincode} onChange={e=>up("pincode",e.target.value)} /></div>
          </div>
          <div className="fg"><label className="flabel">Class Link (Google Meet / Zoom)</label><input className="input" placeholder="https://meet.google.com/..." value={form.class_link} onChange={e=>up("class_link",e.target.value)} /></div>
          <div className="fg"><label className="flabel">Resume / CV Link</label>
            <input className="input" value={form.resume_link} onChange={e=>up("resume_link",e.target.value)} placeholder="https://drive.google.com/file/..." />
            {form.resume_file_name && <div style={{ fontSize:12, color:"#059669", marginTop:6, fontWeight:700 }}>📄 {form.resume_file_name}</div>}
          </div>
          <div className="fg"><label className="flabel">Short Bio</label><textarea className="input" rows={3} value={form.bio} onChange={e=>up("bio",e.target.value)} placeholder="Tell schools about yourself..." /></div>

          <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:8, paddingTop:18, borderTop:"1px solid #E5E7EB" }}>
            <button className={"btn btn-sm " + (tutor.is_active ? "btn-danger" : "btn-success")} onClick={() => onToggle(tutor.id)}>
              {tutor.is_active ? "Deactivate" : "Activate"}
            </button>
            <div style={{ flex:1 }} />
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes ✓"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── School View/Edit modal — same registration form, pre-filled & saveable ── */
function SchoolEditModal({ school, api, hdr, onClose, onToggle, onSaved }) {
  const ITYPES = ["School (CBSE)","School (ICSE)","School (State Board)","Junior College","Degree College","Coaching Institute","Tuition Centre","Online Platform"];
  const [form, setForm] = useState(() => ({
    name:           school.name || "",
    email:          school.email || "",
    phone:          school.phone || "",
    city:           school.city || "",
    password:       "",
    institute_type: school.institute_type || "",
    est_year:       school.est_year || "",
    student_count:  school.student_count || "",
    website:        school.website || "",
  }));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const up = (k, v) => setForm(s => ({ ...s, [k]: v }));

  async function save() {
    if (!String(form.name).trim() || !String(form.email).trim()) { setMsg("⚠️ Name and Email are required."); return; }
    setSaving(true); setMsg("");
    try {
      const r = await fetch(api + `/admin/schools/${school.id}`, { method:"PATCH", headers:{...hdr,"Content-Type":"application/json"}, body: JSON.stringify(form) });
      const data = await r.json();
      if (r.ok) { setMsg("✓ Changes saved to database."); onSaved && onSaved(); }
      else setMsg("Error: " + (data.message || "Save failed"));
    } catch (e) { setMsg("Network error: " + e.message); }
    finally { setSaving(false); }
  }
  const sec = { fontWeight:800, fontSize:13, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginTop:22, marginBottom:14, paddingBottom:6, borderBottom:"2px solid #EBF5FF" };

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:720, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
        <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"22px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#93C5FD", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>🏫 Institution Profile</div>
              <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{form.name}</div>
              <div style={{ color:"#BFDBFE", fontSize:13, marginTop:2 }}>{form.institute_type || "—"}{form.city ? ` · 📍 ${form.city}` : ""}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          {msg && <div className={"alert " + (msg.startsWith("✓") ? "a-ok" : "a-warn")} style={{ marginBottom:16 }}>{msg}</div>}

          <div style={{ ...sec, marginTop:0 }}>👤 Account & Contact</div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Institution Name *</label><input className="input" value={form.name} onChange={e=>up("name",e.target.value)} /></div>
            <div className="fg"><label className="flabel">Email ID *</label><input className="input" type="email" value={form.email} onChange={e=>up("email",e.target.value)} /></div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Phone</label><input className="input" value={form.phone} onChange={e=>up("phone",e.target.value)} /></div>
            <div className="fg"><label className="flabel">City</label><input className="input" value={form.city} onChange={e=>up("city",e.target.value)} /></div>
          </div>
          <div className="fg"><label className="flabel">Login Password</label><input className="input" value={form.password} onChange={e=>up("password",e.target.value)} placeholder="Leave blank to keep current password" /></div>

          <div style={sec}>🏫 Institution Details</div>
          <div className="fg"><label className="flabel">Institute Type</label>
            <select className="input" value={form.institute_type} onChange={e=>up("institute_type",e.target.value)}>
              <option value="">Select type</option>{ITYPES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Est. Year</label><input className="input" type="number" placeholder="e.g. 1995" value={form.est_year} onChange={e=>up("est_year",e.target.value)} /></div>
            <div className="fg"><label className="flabel">No. of Students</label>
              <select className="input" value={form.student_count} onChange={e=>up("student_count",e.target.value)}>
                <option value="">Select</option><option>Under 500</option><option>500-1,000</option><option>1,000-3,000</option><option>3,000+</option>
              </select>
            </div>
          </div>
          <div className="fg"><label className="flabel">Website (Optional)</label><input className="input" placeholder="https://yourschool.edu.in" value={form.website} onChange={e=>up("website",e.target.value)} /></div>

          <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:8, paddingTop:18, borderTop:"1px solid #E5E7EB" }}>
            <button className={"btn btn-sm " + (school.is_active ? "btn-danger" : "btn-success")} onClick={() => onToggle(school.id)}>{school.is_active ? "Deactivate" : "Activate"}</button>
            <div style={{ flex:1 }} />
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes ✓"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Parent View/Edit modal — same tuition requirement form, pre-filled & saveable ── */
function ParentEditModal({ parent, api, hdr, onClose, onToggle, onSaved }) {
  const [form, setForm] = useState(() => ({
    name:              parent.name || "",
    email:             parent.email || "",
    phone:             parent.phone || "",
    city:              parent.city || "",
    password:          "",
    student_name:      parent.student_name || "",
    student_class:     parent.student_class || "",
    board:             parent.board || "",
    subject:           parent.subject || "",
    location:          parent.location || "",
    mode:              parent.mode || "",
    preferred_time:    parent.preferred_time || "",
    budget:            parent.budget || "",
    tutor_gender_pref: parent.tutor_gender_pref || "",
    experience_req:    parent.experience_req || "",
    notes:             parent.notes || "",
  }));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const up = (k, v) => setForm(s => ({ ...s, [k]: v }));

  async function save() {
    if (!String(form.name).trim() || !String(form.email).trim()) { setMsg("⚠️ Name and Email are required."); return; }
    setSaving(true); setMsg("");
    try {
      const r = await fetch(api + `/admin/parents/${parent.id}`, { method:"PATCH", headers:{...hdr,"Content-Type":"application/json"}, body: JSON.stringify(form) });
      const data = await r.json();
      if (r.ok) { setMsg("✓ Changes saved to database."); onSaved && onSaved(); }
      else setMsg("Error: " + (data.message || "Save failed"));
    } catch (e) { setMsg("Network error: " + e.message); }
    finally { setSaving(false); }
  }
  const sec = { fontWeight:800, fontSize:13, color:"#059669", textTransform:"uppercase", letterSpacing:1, marginTop:22, marginBottom:14, paddingBottom:6, borderBottom:"2px solid #ECFDF5" };

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:720, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
        <div style={{ background:"linear-gradient(135deg,#047857,#059669)", padding:"22px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#A7F3D0", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>👨‍👩‍👧 Parent Profile</div>
              <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{form.name}</div>
              <div style={{ color:"#D1FAE5", fontSize:13, marginTop:2 }}>{form.student_name ? `Student: ${form.student_name}` : "—"}{form.subject ? ` · ${form.subject}` : ""}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          {msg && <div className={"alert " + (msg.startsWith("✓") ? "a-ok" : "a-warn")} style={{ marginBottom:16 }}>{msg}</div>}

          <div style={{ ...sec, marginTop:0 }}>👤 Parent Account</div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Parent Name *</label><input className="input" value={form.name} onChange={e=>up("name",e.target.value)} /></div>
            <div className="fg"><label className="flabel">Email ID *</label><input className="input" type="email" value={form.email} onChange={e=>up("email",e.target.value)} /></div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Phone</label><input className="input" value={form.phone} onChange={e=>up("phone",e.target.value)} /></div>
            <div className="fg"><label className="flabel">City</label><input className="input" value={form.city} onChange={e=>up("city",e.target.value)} /></div>
          </div>
          <div className="fg"><label className="flabel">Login Password</label><input className="input" value={form.password} onChange={e=>up("password",e.target.value)} placeholder="Leave blank to keep current password" /></div>

          <div style={sec}>📋 Tutor Requirement</div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Student Name</label><input className="input" placeholder="Child's full name" value={form.student_name} onChange={e=>up("student_name",e.target.value)} /></div>
            <div className="fg"><label className="flabel">Class / Grade</label>
              <select className="input" value={form.student_class} onChange={e=>up("student_class",e.target.value)}>
                <option value="">Select class</option>{["Pre-Primary (Nursery–KG)","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Degree"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Board</label>
              <select className="input" value={form.board} onChange={e=>up("board",e.target.value)}>
                <option value="">Select board</option><option>CBSE</option><option>ICSE</option><option>State Board (AP)</option><option>State Board (TS)</option><option>IB</option><option>IGCSE</option>
              </select>
            </div>
            <div className="fg"><label className="flabel">Subject(s) Required</label><input className="input" placeholder="e.g. Mathematics, Physics" value={form.subject} onChange={e=>up("subject",e.target.value)} /></div>
          </div>
          <div className="fg"><label className="flabel">Location / Area</label><input className="input" placeholder="e.g. Banjara Hills, Hyderabad" value={form.location} onChange={e=>up("location",e.target.value)} /></div>
          <div className="fg"><label className="flabel">Tutoring Mode</label>
            <div style={{ display:"flex", gap:10, marginTop:6 }}>
              {["Home","Online","Either"].map(m => (
                <label key={m} onClick={() => up("mode",m)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"9px 0", borderRadius:10, border:`2px solid ${form.mode===m?"#059669":"#E5E7EB"}`, background:form.mode===m?"#ECFDF5":"#F9FAFB", cursor:"pointer", fontSize:13, fontWeight:700, color:form.mode===m?"#059669":"#6B7280", userSelect:"none" }}>
                  {m==="Home"?"🏠":m==="Online"?"💻":"🔄"} {m}
                </label>
              ))}
            </div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Preferred Time</label>
              <select className="input" value={form.preferred_time} onChange={e=>up("preferred_time",e.target.value)}>
                <option value="">Select</option><option>Morning (6am–12pm)</option><option>Afternoon (12pm–4pm)</option><option>Evening (4pm–8pm)</option><option>Flexible</option>
              </select>
            </div>
            <div className="fg"><label className="flabel">Monthly Budget (₹)</label>
              <select className="input" value={form.budget} onChange={e=>up("budget",e.target.value)}>
                <option value="">Select range</option><option>Under ₹2,000</option><option>₹2,000–₹4,000</option><option>₹4,000–₹6,000</option><option>₹6,000–₹10,000</option><option>Above ₹10,000</option>
              </select>
            </div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="flabel">Tutor Gender Preference</label>
              <select className="input" value={form.tutor_gender_pref} onChange={e=>up("tutor_gender_pref",e.target.value)}>
                <option value="">No Preference</option><option>Male</option><option>Female</option>
              </select>
            </div>
            <div className="fg"><label className="flabel">Experience Required</label>
              <select className="input" value={form.experience_req} onChange={e=>up("experience_req",e.target.value)}>
                <option value="">Any</option><option>Fresher OK</option><option>1+ Years</option><option>2+ Years</option><option>3+ Years</option><option>5+ Years</option>
              </select>
            </div>
          </div>
          <div className="fg"><label className="flabel">Additional Notes</label><textarea className="input" rows={3} placeholder="Any special requirements or notes..." value={form.notes} onChange={e=>up("notes",e.target.value)} /></div>

          <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:8, paddingTop:18, borderTop:"1px solid #E5E7EB" }}>
            <button className={"btn btn-sm " + (parent.is_active ? "btn-danger" : "btn-success")} onClick={() => onToggle(parent.id)}>{parent.is_active ? "Deactivate" : "Activate"}</button>
            <div style={{ flex:1 }} />
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes ✓"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Job View/Edit modal — shows the SAME job posting form, pre-filled with the
   requirement's data and saveable. Pending jobs keep Approve/Reject.          ── */
function JobEditModal({ job, api, hdr, onClose, onApprove, onReject, onSaved }) {
  const num = (v) => (v == null || v === "" ? "" : String(v).replace(/\.00$/, ""));
  const [form, setForm] = useState(() => ({
    institution_name: job.institution_name || job.institute_name || "",
    institution_type: job.institution_type || "",
    location_state:   job.location_state || "",
    location_city:    job.location_city || "",
    contact_person:   job.contact_person || "",
    contact_number:   job.contact_number || "",
    contact_email:    job.contact_email || job.institute_email || "",
    requirement_type: job.requirement_type || "Teacher",
    subject:          job.subject || "",
    grades:           job.grades ? String(job.grades).split(",").map(x=>x.trim()).filter(Boolean) : [],
    board:            job.board || "",
    experience:       job.experience || "",
    salary_min:       num(job.salary_min),
    salary_max:       num(job.salary_max),
    joining_timeline: job.joining_timeline || "Immediate",
    work_mode:        job.work_mode || "Full-time",
    residential:      job.residential || "No",
    accommodation:    job.accommodation || "Not Provided",
    gender_preference:job.gender_preference || "No Preference",
    interview_mode:   job.interview_mode || "Online",
    demo_required:    job.demo_required || "No",
    positions:        job.positions || 1,
    status:           job.status || "Open",
    assigned_recruiter: job.assigned_recruiter || "",
    notes:            job.notes || job.description || "",
  }));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const up = (k, v) => setForm(s => ({ ...s, [k]: v }));
  const isPending = job.status === "pending";

  async function save() {
    if (!String(form.subject).trim()) { setMsg("⚠️ Subject is required."); return; }
    setSaving(true); setMsg("");
    const payload = { ...form, title: (form.requirement_type || "Teacher") + " — " + form.subject, description: form.notes };
    try {
      const r = await fetch(api + `/admin/jobs/${job.id}`, { method:"PATCH", headers:{...hdr,"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      const data = await r.json();
      if (r.ok) { setMsg("✓ Changes saved to database."); onSaved && onSaved(); }
      else setMsg("Error: " + (data.message || "Save failed"));
    } catch (e) { setMsg("Network error: " + e.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:760, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)" }}>
        <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"22px 28px", borderRadius:"20px 20px 0 0", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#93C5FD", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>💼 Job Requirement</div>
              <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{(form.requirement_type || "Teacher")} — {form.subject || "—"}</div>
              <div style={{ color:"#BFDBFE", fontSize:13, marginTop:2 }}>{form.institution_name}{form.location_city ? ` · 📍 ${form.location_city}` : ""}</div>
              {job.requirement_id && <div style={{ marginTop:6, fontFamily:"Fira Code,monospace", fontSize:12, color:"#4ADE80", fontWeight:700 }}>🔖 {job.requirement_id}</div>}
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, flexShrink:0 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          {msg && <div className={"alert " + (msg.startsWith("✓") ? "a-ok" : "a-warn")} style={{ marginBottom:16 }}>{msg}</div>}
          <AdminJobForm form={form} up={up} />
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginTop:8, paddingTop:18, borderTop:"1px solid #E5E7EB" }}>
            {isPending && (
              <>
                <button className="btn btn-success btn-sm" onClick={onApprove}>✓ Approve &amp; Publish</button>
                <button className="btn btn-danger btn-sm" onClick={onReject}>✕ Reject</button>
              </>
            )}
            <div style={{ flex:1 }} />
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes ✓"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddEntityModal({ type, busy, onClose, onSubmit }) {
  const meta = ADD_META[type];
  const [form, setForm] = useState(() => ({ ...ADD_INIT[type] }));
  const [err, setErr]   = useState("");
  const up = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    for (const [k, label] of (ADD_REQUIRED[type] || [])) {
      if (!String(form[k] || "").trim()) { setErr("Please fill: " + label); return; }
    }
    setErr("");
    const payload = { ...form };
    if (type === "teacher") {
      // Rough profile completion so the admin-added teacher shows a sensible %.
      const keys = ["full_name","mobile","gender","dob","current_location","qualification",
        "specialization","total_experience","relevant_experience","current_role",
        "work_mode","subjects","grades_handling","boards_handled","teaching_mode",
        "languages","resume_link","terms_accepted"];
      const filled = keys.filter(k => String(form[k] || "").trim()).length;
      payload.completion_pct = Math.round((filled / keys.length) * 100);
    }
    if (type === "job") {
      payload.contact_email = form.contact_email;
      payload.title = form.title || ((form.requirement_type || "Teacher") + " — " + form.subject);
      payload.description = form.description || form.notes;
    }
    onSubmit(meta.endpoint, meta.refresh, payload);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{ maxWidth:680, padding:0 }}>
        <div style={{ padding:"20px 28px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#fff", zIndex:10, borderRadius:"18px 18px 0 0" }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111827" }}>{meta.icon} {meta.title}</h2>
            <p style={{ fontSize:13, color:"#6B7280", marginTop:2 }}>The same form your users fill — posted by admin and saved to the database.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding:"24px 28px", overflowY:"auto", maxHeight:"72vh" }}>
          <form onSubmit={submit}>
            {type==="teacher" && <AdminTeacherForm form={form} up={up} />}
            {type==="tutor"   && <AdminTutorForm   form={form} up={up} />}
            {type==="tuition" && <AdminTuitionForm form={form} up={up} />}
            {type==="job"     && <AdminJobForm     form={form} up={up} />}
            {err && <div className="alert a-warn" style={{ marginTop:16 }}>⚠️ {err}</div>}
            <div style={{ display:"flex", gap:10, marginTop:18, paddingTop:18, borderTop:"1px solid #E5E7EB" }}>
              <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={onClose} disabled={busy}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:2, justifyContent:"center" }} disabled={busy}>{busy ? "Saving…" : meta.title + " →"}</button>
            </div>
          </form>
        </div>
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

  // ── Admin "Add" record modal ──────────────────────────────────────────────
  const [addType, setAddType] = useState(null);   // null | "teacher" | "tutor" | "tuition" | "job"
  const [addBusy, setAddBusy] = useState(false);

  async function submitAdd(endpoint, refreshKey, payload) {
    setAddBusy(true);
    try {
      const r = await fetch(API + endpoint, {
        method: "POST",
        headers: { ...hdr, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (r.ok) {
        showToast("✓ " + (d.message || "Added successfully"));
        setAddType(null);
        if (refreshKey === "teachers")      fetchData("teachers", "/admin/teachers",  setTeachers);
        else if (refreshKey === "tutors")   fetchData("tutors",   "/admin/tutors",    setTutors);
        else if (refreshKey === "parents")  fetchData("parents",  "/admin/parents",   setParents);
        else if (refreshKey === "jobs")     fetchData("jobs",     "/admin/all-jobs",  setAllJobs);
        fetchData("stats", "/admin/stats", setStats);
      } else {
        showToast("Error: " + (d.message || "Failed to add"));
      }
    } catch (e) { showToast("Network error: " + e.message); }
    finally { setAddBusy(false); }
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
    return <span style={{ display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap", lineHeight:1,
      padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700,
      background: active ? "#ECFDF5" : "#FEF2F2",
      color:      active ? "#059669" : "#DC2626",
      border:     `1px solid ${active ? "#A7F3D0" : "#FECACA"}` }}>
      <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background: active ? "#059669" : "#DC2626" }} />
      {active ? "Active" : "Inactive"}
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
        {addType && <AddEntityModal type={addType} busy={addBusy} onClose={() => setAddType(null)} onSubmit={submitAdd} />}

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
          <JobEditModal
            job={selectedJob}
            api={API}
            hdr={hdr}
            onClose={() => setSelectedJob(null)}
            onApprove={() => { approveJob(selectedJob); setSelectedJob(null); }}
            onReject={() => { rejectJob(selectedJob.id); setSelectedJob(null); }}
            onSaved={() => { setAllJobs([]); fetchData("jobs", "/admin/all-jobs", setAllJobs); }}
          />
        )}


        {/* ══ ALL JOBS ══ */}
        {tab==="jobs" && (
          <div className="fadeUp">
            <div className="page-title">All Positions</div>
            <div className="page-sub">Every job posted on AcadHr — from database</div>
            <div style={{ margin:"4px 0 16px" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setAddType("job")}>＋ Add Job</button>
            </div>
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
                <div className="tbl-wrap admin-tbl">
                  <table>
                    <thead><tr><th>Position</th><th>Institution</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
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
                          <tr><td colSpan={5} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No jobs match filters</td></tr>
                        ) : filtered.map(j => (
                        <tr key={j.id} onClick={() => setSelectedJob(j)} style={{ cursor:"pointer" }}>
                          <td><strong style={{ color:"#111827" }}>{j.title}</strong></td>
                          <td>{j.institute_name}</td>
                          <td>📍 {j.location_city||j.location||"—"}</td>
                          <td><span className={"badge "+(j.status==="approved"?"bgreen":j.status==="pending"?"bamber":"bred")}>
                            {j.status==="approved"?"● Live":j.status==="pending"?"⏳ Pending":"✕ Rejected"}
                          </span></td>
                          <td>
                            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                              <button className="btn btn-sm" style={{ color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }} onClick={(e) => { e.stopPropagation(); setSelectedJob(j); }}>👁 View</button>
                            </div>
                          </td>
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
                <div className="tbl-wrap admin-tbl">
                  <table>
                    <thead><tr><th>Institution</th><th>Email</th><th>City</th><th>Live Jobs</th><th>Status</th><th>Action</th></tr></thead>
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
                          <tr><td colSpan={6} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No institutions match filters</td></tr>
                        ) : filtered.map(s => (
                        <tr key={s.id} onClick={() => setSelectedSchool(s)} style={{ cursor:"pointer" }}>
                          <td><strong style={{ color:"#1A56DB", textDecoration:"underline" }}>{s.name}</strong></td>
                          <td style={{ fontSize:12, color:"#6B7280" }}>{s.email}</td>
                          <td>📍 {s.city||"—"}</td>
                          <td><span className="badge bgreen">{s.live_jobs||0}</span></td>
                          <td><StatusBadge active={s.is_active} /></td>
                          <td>
                            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                              <button className="btn btn-sm" style={{ color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }} onClick={(e) => { e.stopPropagation(); setSelectedSchool(s); }}>👁 View</button>
                              <button className={"btn btn-sm "+(s.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(s.id); }}>{s.is_active?"Deactivate":"Activate"}</button>
                            </div>
                          </td>
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
            <div style={{ margin:"4px 0 16px" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setAddType("teacher")}>＋ Add Teacher</button>
            </div>
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
                <div className="tbl-wrap admin-tbl">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Specialization</th><th>City</th><th>Status</th><th>Action</th></tr></thead>
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
                          <tr><td colSpan={6} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No teachers match filters</td></tr>
                        ) : filtered.map(t => (
                        <tr key={t.id} onClick={() => setSelectedTeacher(t)} style={{ cursor:"pointer" }}>
                          <td><strong style={{ color:"#1A56DB", textDecoration:"underline" }}>{t.name}</strong></td>
                          <td style={{ fontSize:12, color:"#6B7280" }}>{t.email}</td>
                          <td>{t.specialization||"—"}</td>
                          <td>📍 {t.city||"—"}</td>
                          <td><StatusBadge active={t.is_active} /></td>
                          <td>
                            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                              <button className="btn btn-sm" style={{ color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }} onClick={(e) => { e.stopPropagation(); setSelectedTeacher(t); }}>👁 View</button>
                              <button className={"btn btn-sm "+(t.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(t.id); }}>{t.is_active?"Deactivate":"Activate"}</button>
                            </div>
                          </td>
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
        {selectedTeacher && (
          <TeacherEditModal
            teacher={selectedTeacher}
            api={API}
            hdr={hdr}
            onClose={() => setSelectedTeacher(null)}
            onToggle={(id) => { toggleUser(id); setSelectedTeacher(s => s ? {...s, is_active: s.is_active ? 0 : 1} : s); }}
            onSaved={() => fetchData("teachers", "/admin/teachers", setTeachers)}
          />
        )}

        {/* ══ TUTORS ══ */}
        {tab==="tutors" && (
          <div className="fadeUp">
            <div className="page-title">Tutors</div>
            <div className="page-sub">All registered tutors — from database</div>
            <div style={{ margin:"4px 0 16px" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setAddType("tutor")}>＋ Add Tutor</button>
            </div>
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
                <div className="tbl-wrap admin-tbl">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>City</th><th>Status</th><th>Action</th></tr></thead>
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
                          <tr><td colSpan={6} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No tutors match filters</td></tr>
                        ) : filtered.map(t => (
                        <tr key={t.id} onClick={() => setSelectedTutor(t)} style={{ cursor:"pointer" }}>
                          <td><strong style={{ color:"#6D28D9", textDecoration:"underline" }}>{t.name}</strong></td>
                          <td style={{ fontSize:12, color:"#6B7280" }}>{t.email}</td>
                          <td>{t.subject||"—"}</td>
                          <td>📍 {t.city||"—"}</td>
                          <td><StatusBadge active={t.is_active} /></td>
                          <td>
                            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                              <button className="btn btn-sm" style={{ color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }} onClick={(e) => { e.stopPropagation(); setSelectedTutor(t); }}>👁 View</button>
                              <button className={"btn btn-sm "+(t.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(t.id); }}>{t.is_active?"Deactivate":"Activate"}</button>
                            </div>
                          </td>
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
            <div style={{ margin:"4px 0 16px" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setAddType("tuition")}>＋ Add Tuition</button>
            </div>
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
                  <div className="tbl-wrap admin-tbl">
                    <table>
                      <thead><tr><th>Parent Name</th><th>Email</th><th>Student</th><th>Subject</th><th>Status</th><th>Action</th></tr></thead>
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
                            ? <tr><td colSpan={6} style={{ textAlign:"center", color:"#9CA3AF", padding:"40px 0" }}>No parents match filters</td></tr>
                            : filtered.map(p => (
                              <tr key={p.id} onClick={() => setSelectedParent(p)} style={{ cursor:"pointer" }}>
                                <td><strong style={{ color:"#059669", textDecoration:"underline" }}>{p.name}</strong></td>
                                <td style={{ fontSize:12, color:"#6B7280" }}>{p.email}</td>
                                <td style={{ fontWeight:600, color:"#1A56DB" }}>{p.student_name||"—"}</td>
                                <td>{p.subject||"—"}</td>
                                <td><span className={"badge "+(p.status==="Assigned"?"bgreen":"bamber")}>{p.status||"Open"}</span></td>
                                <td>
                                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                                    <button className="btn btn-sm" style={{ color:"#1A56DB", borderColor:"#BFDBFE", background:"#EBF5FF" }} onClick={(e) => { e.stopPropagation(); setSelectedParent(p); }}>👁 View</button>
                                    <button className={"btn btn-sm "+(p.is_active?"btn-danger":"btn-success")} onClick={(e) => { e.stopPropagation(); toggleUser(p.id); }}>{p.is_active?"Deactivate":"Activate"}</button>
                                  </div>
                                </td>
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
        {selectedSchool && (
          <SchoolEditModal
            school={selectedSchool}
            api={API}
            hdr={hdr}
            onClose={() => setSelectedSchool(null)}
            onToggle={(id) => { toggleUser(id); setSelectedSchool(s => s ? {...s, is_active: s.is_active ? 0 : 1} : s); }}
            onSaved={() => fetchData("schools", "/admin/schools", setSchools)}
          />
        )}

        {/* ══ TUTOR PROFILE DETAIL ══ */}
        {selectedTutor && (
          <TutorEditModal
            tutor={selectedTutor}
            api={API}
            hdr={hdr}
            onClose={() => setSelectedTutor(null)}
            onToggle={(id) => { toggleUser(id); setSelectedTutor(s => s ? {...s, is_active: s.is_active ? 0 : 1} : s); }}
            onSaved={() => fetchData("tutors", "/admin/tutors", setTutors)}
          />
        )}

        {/* ══ PARENT PROFILE DETAIL ══ */}
        {selectedParent && (
          <ParentEditModal
            parent={selectedParent}
            api={API}
            hdr={hdr}
            onClose={() => setSelectedParent(null)}
            onToggle={(id) => { toggleUser(id); setSelectedParent(s => s ? {...s, is_active: s.is_active ? 0 : 1} : s); }}
            onSaved={() => fetchData("parents", "/admin/parents", setParents)}
          />
        )}

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
