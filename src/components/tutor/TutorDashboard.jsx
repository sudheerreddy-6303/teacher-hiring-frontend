import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { profileAPI } from "../../api";

import { Toast, Divider, InlineBrowseJobs } from "../../components/common/Shared";
import './Tutor.css';

function TutorDashboard({ user, setPage }) {
  const { logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState({
    name: user.name, subject: user.subject || "", city: user.city || "",
    experience: "", qualification: "", phone: user.phone || "",
    mode: "Both (Online & Offline)", rate: "",
    bio: "",
    // Full registration fields
    subjects: "", qualifications: "", availability: "", gender: "",
    address: "", location: "", pincode: "", class_link: "",
    teaching_mode: "Both", hourly_rate: "", resume_name: "", resume_link: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Persist profile edits to the database
  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await profileAPI.update({
        name:          profile.name,
        city:          profile.city,
        phone:         profile.phone,
        subject:       profile.subjects || profile.subject,
        subjects:      profile.subjects,
        qualification: profile.qualifications || profile.qualification,
        qualifications:profile.qualifications,
        experience:    profile.experience,
        bio:           profile.bio,
        hourly_rate:   profile.hourly_rate,
        teaching_mode: profile.teaching_mode,
        availability:  profile.availability,
        address:       profile.address,
        location:      profile.location,
        pincode:       profile.pincode,
        class_link:    profile.class_link,
        gender:        profile.gender,
      });
      setEditMode(false);
      setSaved(true);
      await loadProfile();   // re-fetch from DB so the form shows the saved data
    } catch (e) {
      setSaved(false);
      alert("Could not save profile: " + (e.message || "please try again"));
    } finally { setSaving(false); }
  }

  // Multi-select helpers for comma-separated fields (subjects, qualifications, availability)
  const csvArr = (key) => (profile[key] || "").split(",").map(s => s.trim()).filter(Boolean);
  function toggleCsv(key, val) {
    const arr = csvArr(key);
    setProfile(p => ({ ...p, [key]: (arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]).join(", ") }));
  }
  const PROF_SUBS  = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit"];
  const PROF_QUALS = ["B.Ed","M.Ed","M.Sc + B.Ed","B.Tech + B.Ed","M.Tech + B.Ed","PhD","Diploma in Education"];
  const PROF_EXPS  = ["Fresher (0-1 year)","1-3 years","3-5 years","5-10 years","10+ years"];
  const PROF_TIMES = ["Morning","Afternoon","Evening","Any Time"];
  const profChip = (on, editable) => ({
    padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:600, userSelect:"none",
    cursor: editable ? "pointer" : "default",
    border: on ? "1.5px solid #1A56DB" : "1.5px solid #E5E7EB",
    background: on ? "#EBF5FF" : (editable ? "#fff" : "#F9FAFB"), color: on ? "#1A56DB" : "#374151", transition:"all .15s",
  });

  // Load the real tutor profile from the database
  async function loadProfile() {
    try {
      const data = await profileAPI.get();   // { user, profile }
      if (!data) return;
      const u = data.user || {};
      const p = data.profile || {};
      const modeMap = { Online: "Online Only", Offline: "Offline Only", Both: "Both (Online & Offline)" };
      const rawRate = p.hourly_rate != null ? String(p.hourly_rate).trim() : "";
      const rate = rawRate ? (/^\d+$/.test(rawRate) ? `₹${rawRate}/hr` : rawRate) : "";
      setProfile(prev => ({
        ...prev,
        name:          u.name || prev.name,
        subject:       p.subjects || p.subject || prev.subject,
        city:          u.city || prev.city,
        experience:    p.experience || prev.experience,
        qualification: p.qualifications || p.qualification || prev.qualification,
        phone:         u.phone || prev.phone,
        mode:          modeMap[p.teaching_mode] || prev.mode,
        rate:          rate || prev.rate,
        bio:           p.bio || prev.bio,
        // Full registration fields
        subjects:       p.subjects || p.subject || prev.subjects,
        qualifications: p.qualifications || p.qualification || prev.qualifications,
        availability:   p.availability || prev.availability,
        gender:         p.gender || prev.gender,
        address:        p.address || prev.address,
        location:       p.location || prev.location,
        pincode:        p.pincode || prev.pincode,
        class_link:     p.class_link || prev.class_link,
        teaching_mode:  p.teaching_mode || prev.teaching_mode,
        hourly_rate:    rawRate || prev.hourly_rate,
        resume_name:    p.resume_file_name || prev.resume_name,
        resume_link:    p.resume_link || prev.resume_link,
      }));
    } catch (e) { /* keep current values if the fetch fails */ }
  }

  useEffect(() => { loadProfile(); }, []);

  // Tutor's students — no backend source yet, so start empty (no fake data)
  const [requests] = useState([]);

  const MENU = [
    { id:"overview",  icon:"🏠", label:"Overview" },
    { id:"students",  icon:"🧑‍🎓", label:"My Students" },
    { id:"schedule",  icon:"📅", label:"Schedule" },
    { id:"earnings",  icon:"💰", label:"Earnings" },
    { id:"profile",   icon:"👤", label:"My Profile" },
  ];

  // Earnings — no backend source yet, so start empty (no fake data)
  const earnings = [];

  const [navOpen, setNavOpen] = useState(false);
  return (
    <div style={{ display:"flex", width:"100vw", overflowX:"hidden", minHeight:"100vh" }}>
      {/* Mobile nav toggle + backdrop */}
      <button className="mobile-nav-toggle" aria-label="Menu" onClick={() => setNavOpen(o => !o)}>{navOpen ? "✕" : "☰"}</button>
      <div className={"sidebar-backdrop" + (navOpen ? " show" : "")} onClick={() => setNavOpen(false)} />
      {/* Sidebar */}
      <div className={"sidebar" + (navOpen ? " open" : "")} onClick={() => setNavOpen(false)}>
        <div className="sidebar-header">
          <div className="brand" style={{ cursor:"pointer" }} onClick={() => setPage("home")}>
            <img src="/acadhr-logo.png" alt="AcadHr" style={{ height:52, objectFit:"contain" }} />
          </div>
          <div style={{ fontSize:11, color:"#6B7280", marginTop:6, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Tutor Portal</div>
        </div>
        <div className="sidebar-user">
          <div style={{ fontSize:34, marginBottom:6 }}>🧑‍🎓</div>
          <div style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{user.name}</div>
          <div style={{ fontSize:12, color:"#059669", fontWeight:600, marginTop:2 }}>{profile.subject ? `${profile.subject} Tutor` : "Tutor"}</div>
        </div>
        <div className="sidebar-sec">Navigation</div>
        {MENU.map(m => (
          <div key={m.id} className={"s-item" + (tab === m.id ? " active" : "")} onClick={() => setTab(m.id)}>
            <span>{m.icon}</span>{m.label}
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:"20px 0" }}>
          <div className="sidebar-sec">Account</div>
          <div className="s-item" onClick={() => setPage("home")}>🏠 Back to Site</div>
          <div className="s-item" onClick={logout}>🚪 Logout</div>
        </div>
      </div>

      {/* Main content */}
      <div className="main">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="fadeUp">
            <div className="page-title">Welcome back, {user.name.split(" ")[0]} 👋</div>
            <div className="page-sub">Your tutoring activity at a glance</div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, marginBottom:26 }}>
              {[
                ["Active Students", String(requests.filter(r => r.status === "Active").length), "🧑‍🎓", "#1A56DB"],
                ["Hours This Month", "—", "⏱️", "#059669"],
                ["Earnings (This Month)", "—", "💰", "#D97706"],
                ["Avg. Rating", "—", "⭐", "#6D28D9"],
              ].map(([l,v,i,c]) => (
                <div key={l} className="card kpi" style={{ padding:20, textAlign:"center" }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{i}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:c, fontFamily:"Playfair Display,serif" }}>{v}</div>
                  <div style={{ fontSize:12, color:"#6B7280", fontWeight:600, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {/* Active students */}
              <div className="card" style={{ padding:24 }}>
                <h3 style={{ fontSize:17, marginBottom:18 }}>Active Students</h3>
                {requests.filter(r => r.status === "Active").length === 0 ? (
                  <div style={{ color:"#9CA3AF", fontSize:13, padding:"18px 0", textAlign:"center" }}>No students yet</div>
                ) : requests.filter(r => r.status === "Active").map((r,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🧑</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{r.student}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF" }}>{r.grade} · {r.mode}</div>
                      </div>
                    </div>
                    <span className={"badge " + r.sClass}>{r.status}</span>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ marginTop:14, width:"100%" }} onClick={() => setTab("students")}>All Students →</button>
              </div>

              {/* Earnings chart */}
              <div className="card" style={{ padding:24 }}>
                <h3 style={{ fontSize:17, marginBottom:18 }}>Monthly Earnings</h3>
                {earnings.length === 0 ? (
                  <div style={{ color:"#9CA3AF", fontSize:13, padding:"18px 0", textAlign:"center" }}>No earnings recorded yet</div>
                ) : earnings.map((e,i) => (
                  <div key={i} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12, color:"#374151", fontWeight:600 }}>
                      <span>{e.month}</span><span style={{ color:"#059669" }}>₹{e.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ height:7, background:"#F3F4F6", borderRadius:4 }}>
                      <div style={{ height:7, borderRadius:4, background:"linear-gradient(90deg,#1A56DB,#0EA5E9)", width:`${(e.amount/25000)*100}%`, transition:"width .4s" }} />
                    </div>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ marginTop:10, width:"100%" }} onClick={() => setTab("earnings")}>Full Report →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Students ── */}
        {tab === "students" && (
          <div className="fadeUp">
            <div className="page-title">My Students</div>
            <div className="page-sub">Manage all your tutoring relationships</div>
            <div className="card" style={{ padding:0, overflow:"hidden" }}>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>Student</th><th>Grade</th><th>Subject</th><th>Mode</th><th>Since</th><th>Status</th></tr></thead>
                  <tbody>{requests.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign:"center", color:"#9CA3AF", padding:"28px 0" }}>No students yet</td></tr>
                  ) : requests.map((r,i) => (
                    <tr key={i}>
                      <td><strong style={{ color:"#111827" }}>{r.student}</strong></td>
                      <td>{r.grade}</td>
                      <td>{r.subject}</td>
                      <td><span style={{ fontSize:11 }}>{r.mode === "Online" ? "💻 Online" : "🏠 Offline"}</span></td>
                      <td style={{ color:"#9CA3AF", fontSize:12 }}>{r.since}</td>
                      <td><span className={"badge " + r.sClass}>{r.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Schedule ── */}
        {tab === "schedule" && (
          <div className="fadeUp">
            <div className="page-title">My Schedule</div>
            <div className="page-sub">Weekly tutoring sessions</div>
            <div className="card" style={{ padding:24 }}>
              <div style={{ color:"#9CA3AF", fontSize:13, padding:"30px 0", textAlign:"center" }}>No classes scheduled yet</div>
            </div>
          </div>
        )}

        {/* ── Earnings ── */}
        {tab === "earnings" && (
          <div className="fadeUp">
            <div className="page-title">Earnings</div>
            <div className="page-sub">Your tutoring income summary</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:26 }}>
              {[["This Month","—","#059669"],["Last Month","—","#1A56DB"],["Total","—","#D97706"]].map(([l,v,c]) => (
                <div key={l} className="card" style={{ padding:22, textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:c, fontFamily:"Playfair Display,serif", marginBottom:6 }}>{v}</div>
                  <div style={{ fontSize:13, color:"#6B7280", fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontSize:17, marginBottom:20 }}>Monthly Breakdown</h3>
              {earnings.length === 0 ? (
                <div style={{ color:"#9CA3AF", fontSize:13, padding:"20px 0", textAlign:"center" }}>No earnings recorded yet</div>
              ) : earnings.map((e,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
                  <div style={{ width:90, fontSize:13, fontWeight:600, color:"#374151" }}>{e.month}</div>
                  <div style={{ flex:1, height:10, background:"#F3F4F6", borderRadius:5 }}>
                    <div style={{ height:10, borderRadius:5, background:"linear-gradient(90deg,#1A56DB,#0EA5E9)", width:`${(e.amount/25000)*100}%` }} />
                  </div>
                  <div style={{ width:80, textAlign:"right", fontSize:13, fontWeight:700, color:"#059669" }}>₹{e.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && (
          <div className="fadeUp">
            <div className="flexb" style={{ marginBottom:24 }}>
              <div>
                <div className="page-title">My Profile</div>
                <div className="page-sub" style={{ marginBottom:0 }}>Manage your public tutor profile</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => { setEditMode(e => !e); setSaved(false); }}>
                {editMode ? "✕ Cancel" : "✏️ Edit Profile"}
              </button>
            </div>
            {saved && <div className="alert a-ok">✓ Profile updated!</div>}
            <div className="card" style={{ padding:28, maxWidth:600 }}>
              <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:24 }}>
                <div style={{ width:70, height:70, borderRadius:18, background:"#EBF5FF", border:"2px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>🧑‍🎓</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:"#111827" }}>{profile.name}</div>
                  <div style={{ fontSize:13, color:"#059669", fontWeight:600 }}>{[profile.subject ? `${profile.subject} Tutor` : "Tutor", profile.city].filter(Boolean).join(" · ")}</div>
                  <div style={{ fontSize:12, color:"#D97706", fontWeight:700, marginTop:4 }}>{[profile.rate, profile.mode].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
              <Divider />
              <div style={{ marginTop:20 }}>
                <div className="grid2">
                  <div className="fg"><label className="flabel">Full Name</label><input className="input" disabled={!editMode} value={profile.name} onChange={e => setProfile(p => ({...p, name:e.target.value}))} /></div>
                  <div className="fg"><label className="flabel">Phone</label><input className="input" disabled={!editMode} value={profile.phone} onChange={e => setProfile(p => ({...p, phone:e.target.value}))} /></div>
                </div>

                <div className="fg"><label className="flabel">Subject(s) (select all that apply)</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:12, background:!editMode?"#F9FAFB":"#FAFBFC" }}>
                    {PROF_SUBS.map(s => {
                      const on = csvArr("subjects").includes(s);
                      return <span key={s} onClick={() => editMode && toggleCsv("subjects", s)} style={profChip(on, editMode)}>{s}</span>;
                    })}
                  </div>
                </div>

                <div className="fg"><label className="flabel">Qualifications (select all that apply)</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:12, background:!editMode?"#F9FAFB":"#FAFBFC" }}>
                    {PROF_QUALS.map(q => {
                      const on = csvArr("qualifications").includes(q);
                      return <span key={q} onClick={() => editMode && toggleCsv("qualifications", q)} style={profChip(on, editMode)}>{q}</span>;
                    })}
                  </div>
                </div>

                <div className="grid2">
                  <div className="fg"><label className="flabel">Experience</label>
                    <select className="input" disabled={!editMode} value={profile.experience} onChange={e => setProfile(p => ({...p, experience:e.target.value}))}>
                      <option value="">Select</option>
                      {PROF_EXPS.map(x => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="flabel">Hourly Charges</label><input className="input" disabled={!editMode} placeholder="e.g. ₹800/hr" value={profile.hourly_rate} onChange={e => setProfile(p => ({...p, hourly_rate:e.target.value}))} /></div>
                </div>

                <div className="grid2">
                  <div className="fg"><label className="flabel">Gender</label>
                    <select className="input" disabled={!editMode} value={profile.gender} onChange={e => setProfile(p => ({...p, gender:e.target.value}))}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="fg"><label className="flabel">Teaching Mode</label>
                    <select className="input" disabled={!editMode} value={profile.teaching_mode} onChange={e => setProfile(p => ({...p, teaching_mode:e.target.value}))}>
                      <option>Online</option><option>Offline</option><option>Both</option>
                    </select>
                  </div>
                </div>

                <div className="fg"><label className="flabel">Available Timings (select one or more)</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:12, background:!editMode?"#F9FAFB":"#FAFBFC" }}>
                    {PROF_TIMES.map(t => {
                      const on = csvArr("availability").includes(t);
                      return <span key={t} onClick={() => editMode && toggleCsv("availability", t)} style={profChip(on, editMode)}>{t}</span>;
                    })}
                  </div>
                </div>

                <div className="fg"><label className="flabel">Address</label><input className="input" disabled={!editMode} placeholder="House no., street, area" value={profile.address} onChange={e => setProfile(p => ({...p, address:e.target.value}))} /></div>

                <div className="grid2">
                  <div className="fg"><label className="flabel">Location</label><input className="input" disabled={!editMode} placeholder="e.g. Banjara Hills, Hyderabad" value={profile.location} onChange={e => setProfile(p => ({...p, location:e.target.value}))} /></div>
                  <div className="fg"><label className="flabel">City</label><input className="input" disabled={!editMode} value={profile.city} onChange={e => setProfile(p => ({...p, city:e.target.value}))} /></div>
                </div>

                <div className="grid2">
                  <div className="fg"><label className="flabel">Pincode</label><input className="input" disabled={!editMode} placeholder="e.g. 500034" value={profile.pincode} onChange={e => setProfile(p => ({...p, pincode:e.target.value}))} /></div>
                  <div className="fg"><label className="flabel">Class Link (Google Meet / Zoom)</label><input className="input" disabled={!editMode} placeholder="https://meet.google.com/..." value={profile.class_link} onChange={e => setProfile(p => ({...p, class_link:e.target.value}))} /></div>
                </div>

                {profile.resume_name && (
                  <div className="fg"><label className="flabel">Resume / CV</label>
                    <div style={{ fontSize:13, color:"#059669", fontWeight:700 }}>📄 {profile.resume_name}</div>
                  </div>
                )}

                <div className="fg"><label className="flabel">Bio</label><textarea className="input" rows={4} disabled={!editMode} value={profile.bio} onChange={e => setProfile(p => ({...p, bio:e.target.value}))} /></div>
                {editMode && <button className="btn btn-primary" disabled={saving} onClick={handleSave}>{saving ? "Saving…" : "Save Changes ✓"}</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorDashboard;
