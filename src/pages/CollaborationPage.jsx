import { useState } from "react";
import { Divider, Brand, Navbar } from "../components/common/Shared";

function CollaborationPage({ setPage }) {
  // ── What We Manage (stacked service blocks) ──
  const MANAGE = [
    {
      icon:"🗂️", title:"Academic Administration",
      intro:"We help schools establish structured academic systems that ensure consistency, accountability, and measurable learning outcomes.",
      items:[
        "Annual Academic Planning","Academic Calendar Preparation","Timetable & Period Scheduling",
        "Subject-wise Curriculum Planning","Academic Policies & Processes","Teacher Work Allocation",
        "Classroom Observation Framework","Academic Documentation","Examination Planning","Student Progress Monitoring",
      ],
    },
    {
      icon:"📘", title:"Curriculum Planning & Academic Excellence",
      intro:"A strong curriculum creates strong learners. AcadHR works with schools to build and continuously improve academic frameworks.",
      items:[
        "Design and strengthen curriculum frameworks","Align teaching plans with national and international standards",
        "Improve learning outcomes","Build competency-based learning models","Develop assessment strategies",
        "Integrate technology into teaching and learning","Continuously review and enhance academic performance",
      ],
    },
    {
      icon:"📝", title:"Lecture Planning & Academic Execution",
      intro:"We ensure that teaching is well planned and effectively delivered.",
      items:[
        "Preparing annual lesson plans","Designing monthly academic planners","Creating weekly teaching schedules",
        "Monitoring syllabus completion","Tracking lesson delivery","Reviewing classroom effectiveness",
        "Ensuring timely completion of academic targets",
      ],
    },
    {
      icon:"👩‍🏫", title:"Teacher Performance Management",
      intro:"Great schools are built by great teachers. AcadHR supports continuous faculty development.",
      items:[
        "Teacher induction programs","Teaching quality observations","Classroom audits","Faculty mentoring",
        "Professional development workshops","Subject-specific academic support","Performance reviews","Individual development plans",
      ],
    },
  ];

  const LEADERSHIP_WITH = ["School Owners","Trustees","Principals","Vice Principals","Academic Coordinators","Department Heads"];
  const LEADERSHIP_ASSIST = ["Academic decision-making","Leadership mentoring","Goal setting","Performance monitoring","School improvement planning","Team management","Academic review meetings"];

  const OPERATIONS = [
    "Academic administration","Faculty coordination","Timetable management","Examination management",
    "Parent communication processes","Student academic monitoring","Academic reporting","Staff coordination",
    "Standard Operating Procedures (SOPs)","Quality assurance systems",
  ];

  const CHALLENGES = [
    "Low academic performance","Faculty shortages","Poor academic planning","Weak classroom delivery",
    "Inconsistent teaching quality","Leadership challenges","Operational inefficiencies",
  ];

  const EXAMS = ["NEET","IIT-JEE","Foundation Programs","Olympiads","NTSE","CUET","Scholarship Examinations"];

  const TECH = [
    "Academic Management Systems","Faculty Performance Dashboards","Digital Lesson Planning","Student Progress Analytics",
    "AI-Assisted Academic Reports","Learning Management Systems (LMS)","Parent Communication Apps",
    "Attendance & Assessment Solutions","Curriculum Tracking Tools",
  ];

  const BENEFITS = [
    "Experienced Academic Leadership","Structured Academic Planning","Improved Teaching Quality","Better Learning Outcomes",
    "Strong Faculty Development","Efficient School Operations","Reduced Administrative Burden","AI-Enabled Academic Insights",
    "Continuous Monitoring & Support","Long-Term Institutional Growth",
  ];

  const MODEL = [
    { icon:"🎯", title:"Understand", desc:"Understand your school's goals and challenges." },
    { icon:"🔍", title:"Assess", desc:"Assess current academic and operational systems." },
    { icon:"🗺️", title:"Develop Roadmap", desc:"Develop a customized academic improvement roadmap." },
    { icon:"⚙️", title:"Implement", desc:"Implement structured academic processes." },
    { icon:"📊", title:"Monitor", desc:"Monitor performance through regular reviews." },
    { icon:"🚀", title:"Refine", desc:"Continuously refine strategies to achieve excellence." },
  ];

  const BENEFICIARIES = [
    "New Schools","K–12 Schools","CBSE Schools","ICSE Schools","State Board Schools","International Schools",
    "Residential Schools","Integrated Schools","Schools planning to introduce NEET/JEE programs","Institutions seeking academic transformation",
  ];

  // Small reusable checked-list item
  const Bullet = ({ children }) => (
    <li style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"7px 0", color:"#374151", fontSize:14, lineHeight:1.6 }}>
      <span style={{ color:"#1A56DB", fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>
      <span>{children}</span>
    </li>
  );

  return (
    <div className="fw-page" style={{ paddingTop:90 }}>
      <Navbar setPage={setPage} page="collaboration" />

      {/* ── Hero banner ── */}
      <section style={{ background:"linear-gradient(135deg,#1E429F 0%,#1A56DB 100%)", padding:"72px 0 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
        <div className="container coll-hero-grid" style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1.05fr .95fr", gap:44, alignItems:"center" }}>
          <div style={{ textAlign:"left" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", borderRadius:30, padding:"6px 18px", marginBottom:22 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#fff", letterSpacing:.5 }}>ACADEMIC MANAGEMENT · OPERATIONS · GROWTH</span>
            </div>
            <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(30px,4vw,48px)", fontWeight:800, color:"#fff", marginBottom:16, lineHeight:1.14 }}>
              School Academic Management & <em style={{ color:"#93C5FD" }}>Operations Partnership</em>
            </h1>
            <p style={{ fontSize:18, color:"#DBEAFE", fontWeight:700, margin:"0 0 14px", lineHeight:1.6 }}>
              Focus on Growth. Leave the Academic Operations to AcadHR.
            </p>
            <p style={{ fontSize:15.5, color:"#BFDBFE", margin:"0 0 28px", lineHeight:1.8 }}>
              Running a successful school demands strong academic leadership, structured planning, disciplined execution, and efficient operations. AcadHR partners with schools to take responsibility for Academic Management, Academic Operations, and School Administration — so your team can focus on strategic growth while we ensure excellence in execution.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn btn-lg" style={{ background:"#fff", color:"#1E429F", fontWeight:800, boxShadow:"0 10px 30px rgba(0,0,0,.18)" }} onClick={() => setPage("signup")}>Book a Consultation</button>
              <button className="btn btn-lg" style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,.4)" }} onClick={() => setPage("teachers")}>Browse Educators</button>
            </div>

            {/* ADDED: hero highlight chips */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:28 }}>
              {[["🎓","Experienced Academic Leadership"],["📊","AI-Enabled Insights"],["🏆","Board + NEET / JEE Integration"],["⚙️","End-to-End Operations"]].map(([ic,t]) => (
                <div key={t} style={{ display:"inline-flex", alignItems:"center", gap:9, background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.22)", borderRadius:30, padding:"8px 16px", color:"#EFF6FF", fontSize:12.5, fontWeight:700 }}>
                  <span style={{ fontSize:15 }}>{ic}</span>{t}
                </div>
              ))}
            </div>
          </div>

          {/* ADDED: HD hero image */}
          <div className="coll-hero-img" style={{ borderRadius:22, overflow:"hidden", boxShadow:"0 26px 64px rgba(0,0,0,.34)", border:"4px solid rgba(255,255,255,.18)", aspectRatio:"4 / 3.3" }}>
            <img src="/schoolsol-hero.svg" alt="Academic leadership & classroom excellence" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          </div>
        </div>
      </section>

      {/* ── ADDED: trust / stats band ── */}
      <section style={{ background:"#fff", borderBottom:"1px solid #EEF2F7" }}>
        <div className="container" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:0 }}>
          {[["🏫","Every Board","CBSE · ICSE · State · IB"],["👩‍🏫","Faculty First","Training & mentoring built-in"],["🧩","Tailored Roadmaps","Built around your school"],["🤝","True Partnership","An extension of your team"]].map(([ic,h,s],i) => (
            <div key={h} style={{ display:"flex", alignItems:"center", gap:14, padding:"26px 24px", borderLeft: i===0 ? "none" : "1px solid #EEF2F7" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{ic}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>{h}</div>
                <div style={{ fontSize:12.5, color:"#6B7280", marginTop:2 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intro (with HD image) ── */}
      <section style={{ padding:"72px 0 40px", background:"#fff" }}>
        <div className="container coll-two" style={{ display:"grid", gridTemplateColumns:"0.9fr 1.1fr", gap:44, alignItems:"center" }}>
          {/* ADDED: HD image */}
          <div className="coll-two-img" style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 18px 44px rgba(16,42,120,.16)", aspectRatio:"4 / 3.4" }}>
            <img src="/schoolsol-plan.svg" alt="Structured academic planning" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          </div>
          <div>
            <div className="sec-eye">End-to-End Solutions</div>
            <h2 className="sec-title">Comprehensive School <em style={{ color:"#1A56DB" }}>Academic Management</em></h2>
            <p style={{ color:"#6B7280", fontSize:15.5, lineHeight:1.9, marginTop:14 }}>
              Whether you are a newly established school or an existing institution looking to improve academic quality, AcadHR provides end-to-end academic management solutions tailored to your school's vision. Our experienced academic leadership team works alongside school management to create a high-performing educational ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Manage ── */}
      <section style={{ padding:"40px 0 80px", background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>What We Manage</div>
            <h2 className="sec-title">A Complete <em style={{ color:"#1A56DB" }}>Academic Framework</em></h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
            {MANAGE.map((m,i) => {
              const ACCENTS = ["#1A56DB","#0EA5E9","#7C3AED","#059669"];
              const ac = ACCENTS[i % ACCENTS.length];
              return (
              <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderLeft:`5px solid ${ac}`, borderRadius:16, padding:"28px 30px", boxShadow:"0 6px 22px rgba(16,42,120,.06)", transition:"box-shadow .2s, transform .2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow="0 14px 36px rgba(16,42,120,.13)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow="0 6px 22px rgba(16,42,120,.06)"; e.currentTarget.style.transform="none"; }}>
                <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:12 }}>
                  <div style={{ width:54, height:54, borderRadius:14, background:`${ac}14`, border:`1px solid ${ac}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{m.icon}</div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:800, color:ac, letterSpacing:1, textTransform:"uppercase" }}>Service {String(i+1).padStart(2,"0")}</div>
                    <h3 style={{ fontSize:19, fontWeight:800, color:"#111827", marginTop:2 }}>{m.title}</h3>
                  </div>
                </div>
                <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.75, marginBottom:14 }}>{m.intro}</p>
                <ul style={{ listStyle:"none", padding:0, margin:0, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", columnGap:24, rowGap:0 }}>
                  {m.items.map((it,j) => <Bullet key={j}>{it}</Bullet>)}
                </ul>
              </div>
            );})}

            {/* Leadership Support (two columns) */}
            <div className="card" style={{ padding:"28px 30px" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:10 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>🧭</div>
                <h3 style={{ fontSize:19, fontWeight:800, color:"#111827" }}>Leadership Support</h3>
              </div>
              <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.75, marginBottom:16 }}>Strong leadership drives institutional excellence. We work closely with school leadership to raise academic standards.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:800, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>We Work Closely With</div>
                  <ul style={{ listStyle:"none", padding:0, margin:0 }}>{LEADERSHIP_WITH.map((it,j) => <Bullet key={j}>{it}</Bullet>)}</ul>
                </div>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:800, color:"#1A56DB", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Our Experts Assist In</div>
                  <ul style={{ listStyle:"none", padding:0, margin:0 }}>{LEADERSHIP_ASSIST.map((it,j) => <Bullet key={j}>{it}</Bullet>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Complete School Operations Support ── */}
      <section style={{ padding:"80px 0", background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Operations</div>
            <h2 className="sec-title">Complete School <em style={{ color:"#1A56DB" }}>Operations Support</em></h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10, maxWidth:600, margin:"10px auto 0" }}>AcadHR acts as your strategic academic operations partner, streamlining daily functioning while maintaining high standards.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
            {OPERATIONS.map((o,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"15px 16px", boxShadow:"0 2px 8px rgba(16,42,120,.05)", transition:"all .18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#BFDBFE"; e.currentTarget.style.boxShadow="0 8px 22px rgba(26,86,219,.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.boxShadow="0 2px 8px rgba(16,42,120,.05)"; e.currentTarget.style.transform="none"; }}>
                <span style={{ width:28, height:28, borderRadius:9, background:"linear-gradient(135deg,#1A56DB,#12327A)", color:"#fff", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13 }}>✓</span>
                <span style={{ fontSize:13.5, color:"#374151", fontWeight:700 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── School Improvement Program ── */}
      <section style={{ padding:"80px 0", background:"#fff" }}>
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:36, alignItems:"center" }}>
            <div>
              {/* ADDED: HD image */}
              <div style={{ borderRadius:18, overflow:"hidden", boxShadow:"0 16px 40px rgba(16,42,120,.14)", marginBottom:22, aspectRatio:"16 / 10" }}>
                <img src="/schoolsol-review.svg" alt="Academic review & improvement planning" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              </div>
              <div className="sec-eye">School Improvement Program</div>
              <h2 className="sec-title" style={{ marginBottom:14 }}>Facing Academic <em style={{ color:"#1A56DB" }}>Challenges?</em></h2>
              <p style={{ color:"#6B7280", fontSize:15, lineHeight:1.85 }}>
                If your school is facing challenges, AcadHR conducts a comprehensive academic review and develops a customized improvement plan to strengthen your institution.
              </p>
            </div>
            <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:18, padding:"26px 28px" }}>
              <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                {CHALLENGES.map((c,i) => (
                  <li key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom: i < CHALLENGES.length-1 ? "1px solid #EEF2F7" : "none" }}>
                    <span style={{ color:"#DC2626", fontSize:16, flexShrink:0 }}>▹</span>
                    <span style={{ fontSize:14, color:"#374151", fontWeight:600 }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Competitive Examination Integration ── */}
      <section style={{ padding:"80px 0", background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Competitive Exams</div>
            <h2 className="sec-title">Board + <em style={{ color:"#1A56DB" }}>Competitive Exam</em> Integration</h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10, maxWidth:640, margin:"10px auto 0" }}>
              Today's parents expect schools to prepare students for both board and competitive examinations. AcadHR helps introduce integrated academic programs, with curriculum integration, faculty training, academic planning, and performance monitoring.
            </p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", maxWidth:760, margin:"0 auto" }}>
            {EXAMS.map((e,i) => (
              <span key={i} style={{ background:"#fff", border:"1.5px solid #BFDBFE", color:"#1E429F", borderRadius:30, padding:"10px 22px", fontSize:14.5, fontWeight:800, boxShadow:"0 2px 8px rgba(26,86,219,.08)" }}>{e}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI-Powered Academic Management ── */}
      <section style={{ padding:"80px 0", background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Technology</div>
            <h2 className="sec-title">AI-Powered <em style={{ color:"#1A56DB" }}>Academic Management</em></h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10, maxWidth:620, margin:"10px auto 0" }}>Educational expertise combined with modern technology gives management real-time visibility into academic performance and operational effectiveness.</p>
          </div>
          <div className="grid3">
            {TECH.map((t,i) => {
              const ICONS = ["🖥️","📈","📝","📊","🤖","🎓","📱","✅","🧭"];
              return (
              <div key={i} style={{ padding:"20px 22px", display:"flex", alignItems:"center", gap:14, background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, boxShadow:"0 3px 12px rgba(16,42,120,.05)", transition:"all .18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#BFDBFE"; e.currentTarget.style.boxShadow="0 12px 28px rgba(26,86,219,.13)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.boxShadow="0 3px 12px rgba(16,42,120,.05)"; e.currentTarget.style.transform="none"; }}>
                <div style={{ width:46, height:46, borderRadius:12, background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:21, flexShrink:0 }}>{ICONS[i % ICONS.length]}</div>
                <span style={{ fontSize:14.5, fontWeight:700, color:"#111827" }}>{t}</span>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* ── Why Schools Partner + Partnership Model ── */}
      <section style={{ padding:"80px 0", background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Why AcadHR</div>
            <h2 className="sec-title">Why Schools <em style={{ color:"#1A56DB" }}>Partner With Us</em></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:12, marginBottom:64 }}>
            {BENEFITS.map((b,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"15px 16px", boxShadow:"0 2px 8px rgba(5,150,105,.05)", transition:"all .18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#A7F3D0"; e.currentTarget.style.boxShadow="0 8px 22px rgba(5,150,105,.14)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.boxShadow="0 2px 8px rgba(5,150,105,.05)"; e.currentTarget.style.transform="none"; }}>
                <span style={{ width:28, height:28, borderRadius:9, background:"linear-gradient(135deg,#10B981,#059669)", color:"#fff", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13 }}>✓</span>
                <span style={{ fontSize:13.5, color:"#374151", fontWeight:700 }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Our Partnership Model</div>
            <h2 className="sec-title">An Extension of Your <em style={{ color:"#1A56DB" }}>Leadership Team</em></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
            {MODEL.map((s,i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, padding:"34px 18px 22px", boxShadow:"0 4px 16px rgba(16,42,120,.06)", textAlign:"center", position:"relative", marginTop:14 }}>
                {/* step number badge */}
                <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1A56DB,#12327A)", color:"#fff", fontSize:14, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 14px rgba(26,86,219,.35)" }}>{i+1}</div>
                <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 14px" }}>{s.icon}</div>
                <div style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Can Benefit ── */}
      <section style={{ padding:"80px 0", background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Who Can Benefit</div>
            <h2 className="sec-title">Built for <em style={{ color:"#1A56DB" }}>Every Institution</em></h2>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", maxWidth:860, margin:"0 auto" }}>
            {BENEFICIARIES.map((b,i) => (
              <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #E5E7EB", color:"#374151", borderRadius:30, padding:"11px 20px", fontSize:14, fontWeight:700, boxShadow:"0 2px 8px rgba(16,42,120,.05)", transition:"all .18s", cursor:"default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#BFDBFE"; e.currentTarget.style.color="#1E429F"; e.currentTarget.style.boxShadow="0 8px 20px rgba(26,86,219,.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#374151"; e.currentTarget.style.boxShadow="0 2px 8px rgba(16,42,120,.05)"; }}>
                <span style={{ color:"#1A56DB" }}>🏫</span>{b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ background:"linear-gradient(135deg,#1E429F 0%,#1A56DB 100%)", padding:"76px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
        <div className="container" style={{ textAlign:"center", position:"relative", zIndex:1 }}>
          <div className="sec-eye" style={{ justifyContent:"center", color:"#93C5FD" }}>Transform Your School</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,46px)", color:"#fff", marginBottom:14 }}>Let's Build a School That Inspires Excellence</h2>
          <p style={{ color:"#BFDBFE", fontSize:16, marginBottom:36, maxWidth:600, margin:"0 auto 36px", lineHeight:1.8 }}>
            With AcadHR as your academic management partner, you gain experienced education professionals who build stronger systems, empower teachers, enhance leadership, and improve student outcomes.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-lg" style={{ background:"#fff", color:"#1E429F", fontWeight:800 }} onClick={() => setPage("signup")}>Book a Consultation Today</button>
            <button className="btn btn-lg" style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,.4)" }} onClick={() => setPage("jobs")}>Browse Jobs</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="flexb" style={{ flexWrap:"wrap", gap:20 }}>
            <div>
              <Brand size={22} onClick={() => setPage("home")} />
              <p style={{ color:"#6B7280", fontSize:13, marginTop:6 }}>India's Premier Education Hiring Platform</p>
            </div>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
              {["Privacy Policy","Terms of Service","Contact Us","About"].map(l => (
                <span key={l} style={{ fontSize:13, color:"#6B7280", cursor:"pointer" }}
                  onClick={() => { if (l === "Privacy Policy") setPage("privacy"); if (l === "Terms of Service") setPage("terms"); }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <Divider />
          <p style={{ color:"#9CA3AF", fontSize:12, textAlign:"center" }}>© 2025 AcadHr. All rights reserved by DEERAJ TECHNOLOGY PRIVATE LIMITED. Made with ❤️ in Hyderabad, India.</p>
        </div>
      </footer>
    </div>
  );
}

export default CollaborationPage;
