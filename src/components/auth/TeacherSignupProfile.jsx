// TeacherSignupProfile.jsx  (ADDED — new file, nothing existing changed)
// Teacher REGISTRATION Step 2 — the same profile sections the admin fills under
// Admin Dashboard → Teachers → Add Teacher (copied from AdminDashboard.jsx, so the
// admin form itself is untouched). Name, email, phone, city and password are already
// collected in registration Step 1, so they are not asked twice.
import { useState } from "react";
import { INDIA_LOCATIONS } from "../../constants";

// Empty values for every profile field (so all inputs start blank and controlled)
export const TEACHER_SIGNUP_DEFAULTS = {
  dob:"", gender:"", preferred_locations:"", qualification:"", specialization:"", current_role:"",
  total_experience:"", relevant_experience:"", current_org:"", available_from:"",
  current_salary:"", expected_salary:"", notice_period:"", certifications:"",
  work_mode:"", tutor_type:"", subjects:"", grades_handling:"", boards_handled:"", competitive_exams:"",
  teaching_mode:"", languages:"", demo_available:"", demo_link:"", residential_pref:"", relocation_ready:"",
  accommodation_req:"", aadhaar_verified:"", profile_status:"Active", resume_link:"", resume_file_name:"",
  remarks:"", terms_accepted:"",
};

// Required fields (the ones marked * on the form) → label shown in the "missing fields" popup
export function teacherSignupMissing(tp = {}) {
  const has = v => String(v == null ? "" : v).trim() !== "";
  const req = [
    ["dob","Date of Birth"],["gender","Gender"],["qualification","Qualification"],
    ["specialization","Specialization / Subject"],["current_role","Current Role"],
    ["total_experience","Total Experience"],["relevant_experience","Relevant Teaching Experience"],
    ["work_mode","Work Mode"],["subjects","Subjects"],["grades_handling","Grades Handling"],
    ["boards_handled","Boards Handled"],["teaching_mode","Teaching Mode"],["languages","Languages Known"],
  ];
  const missing = req.filter(([k]) => !has(tp[k])).map(([, l]) => l);
  if (!tp._photo_file) missing.unshift("Profile Photo"); // ADDED: profile photo at registration
  const specCount = String(tp.specialization || "").split(",").map(x => x.trim()).filter(Boolean).length;
  if (has(tp.specialization) && specCount < 3) missing.push("Specialization / Subject (select at least 3)");
  if (tp.demo_available === "Yes" && !has(tp.demo_link)) missing.push("Demo Link");
  if (tp.terms_accepted !== "Yes") missing.push("Accept Terms & Conditions");
  return missing;
}

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

function TeacherSignupProfile({ form, up }) {
  const SUB_LIST = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Telugu","Kannada","Tamil","History","Geography","Civics","Accountancy","Business Studies","Zoology"];
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
        {/* ADDED: profile photo — uploaded with the existing /teacher/upload-photo right after the account is created */}
        <div className="fg"><label className="flabel">Profile Photo *</label>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:6 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", overflow:"hidden", border:"2px solid #BFDBFE", background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>
              {form._photo_preview ? <img src={form._photo_preview} alt="Profile" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
            </div>
            <div>
              <label style={{ display:"inline-block", padding:"8px 14px", border:"1.5px dashed #1A56DB", borderRadius:8, color:"#1A56DB", background:"#EBF5FF", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                📷 {form._photo_preview ? "Change Photo" : "Upload Photo"}
                <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display:"none" }}
                  onChange={e => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { alert("Please choose a JPG, PNG or WEBP image."); return; }
                    if (f.size > 5 * 1024 * 1024) { alert("Photo is too large. Maximum size is 5MB."); return; }
                    up("_photo_file", f);
                    up("_photo_preview", URL.createObjectURL(f));
                  }} />
              </label>
              <div style={{ fontSize:11, color:"#6B7280", marginTop:5 }}>JPG / PNG / WEBP · Max 5MB</div>
            </div>
          </div>
        </div>
        <div className="grid2" style={{ gridTemplateColumns:"1fr" }}>
          <div className="fg"><label className="flabel">Date of Birth *</label>
            <input className="input" type="date" value={form.dob} onChange={e=>up("dob",e.target.value)} />
          </div>
          <div className="fg"><label className="flabel">Gender *</label>
            <PillRadio options={["Male","Female","Prefer not to say"]} value={form.gender} onChange={v=>up("gender",v)} />
          </div>
        </div>
        <div className="grid2" style={{ gridTemplateColumns:"1fr" }}>
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
          <PillMulti options={["B.Sc","M.Sc","B.Tech","M.Tech","B.Ed","M.Ed","PhD","Diploma","B.A","M.A","B.Com","M.Com","B.E","BCA","MCA","BBA","MBA","M.Phil"]} value={form.qualification} onChange={v=>up("qualification",v)} />
        </div>
        <div className="grid2" style={{ gridTemplateColumns:"1fr" }}>
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
        <div className="grid2" style={{ gridTemplateColumns:"1fr" }}>
          <div className="fg"><label className="flabel">Current Organization</label>
            <input className="input" value={form.current_org} onChange={e=>up("current_org",e.target.value)} placeholder="School / Coaching name" />
          </div>
          <div className="fg"><label className="flabel">Available From</label>
            <input className="input" type="date" value={form.available_from} onChange={e=>up("available_from",e.target.value)} />
          </div>
        </div>
        <div className="grid2" style={{ gridTemplateColumns:"1fr" }}>
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
        <div className="grid2" style={{ gridTemplateColumns:"1fr" }}>
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
          <p style={{ marginTop:0 }}>By registering, I confirm and agree that:</p>
          <ol style={{ paddingLeft:18, margin:0 }}>
            <li>All information provided in this profile is true, accurate, and complete.</li>
            <li>The documents, demo videos, and links shared (including Google Drive links) are genuine.</li>
            <li>AcadHr is authorized to share this profile with registered schools and recruiters for hiring purposes.</li>
            <li>Providing false or misleading information may lead to rejection or removal of the profile.</li>
            <li>I agree to be contacted by AcadHr and prospective employers regarding suitable opportunities.</li>
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

export default TeacherSignupProfile;
