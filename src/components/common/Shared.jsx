import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { HERO_SLIDES, SUBS } from "../../constants";


/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function Toast({ msg }) { if (!msg) return null; return <div className="toast">{msg}</div>; }
function Spinner() { return <span style={{ display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }} />; }
function Divider() { return <div className="divider" />; }
function Brand({ size, onClick }) {
  return (
    <div className="brand" style={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <img src="/acadhr-logo.png" alt="AcadHr" style={{ height: size ? size * 1.8 : 70, maxHeight: 76, objectFit: "contain", display: "block" }} />
    </div>
  );
}

function Navbar({ setPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (p) => { setMenuOpen(false); setPage(p); };
  return (
    <nav className={"nav" + (menuOpen ? " nav-menu-open" : "")}>
      <div className="container nav-inner">
        <div className="nav-top">
          <Brand onClick={() => go("home")} />
          <button type="button" className="nav-burger" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        <div className={"nav-actions" + (menuOpen ? " open" : "")}>
          <span className="nav-link" onClick={() => go("jobs")}>Browse Jobs</span>
          <span className="nav-link" onClick={() => go("teachers")}>Browse Teachers</span>
          <span className="nav-link" onClick={() => go("tutors")}>Browse Tutors</span>
          <span className="nav-link" onClick={() => go("tuitions")}>Browse Tuitions</span>
          <span className="nav-link" onClick={() => go("howitworks")}>How It Works</span>
          <span className="nav-link" onClick={() => go("faq")}>FAQ</span>
          <span className="nav-link" onClick={() => go("pricing")} style={{ color:"#1A56DB", fontWeight:700 }}>Pricing</span>
          {user ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => go("dashboard")}>Dashboard</button>
              <button className="btn btn-sm" style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }} onClick={() => { setMenuOpen(false); logout(); }}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => go("login")}>Log In</button>
              <button className="btn btn-primary btn-sm" onClick={() => go("signup")}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero Schools Carousel ─────────────────────────────────────────────────── */

/* Small inline icon set for the carousel (line icons, no emoji) */
function CIc({ name, size = 16, stroke = 1.7, style }) {
  const p = {
    building: <><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" /><path d="M14 21V9h4a1 1 0 0 1 1 1v11" /><path d="M3 21h18" /><path d="M7.5 8h3M7.5 12h3M7.5 16h3" /></>,
    pin:      <><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></>,
    cap:      <><path d="M3 9l9-4 9 4-9 4-9-4z" /><path d="M7 11.5V16c0 1 2.4 2.4 5 2.4s5-1.4 5-2.4v-4.5" /></>,
    tag:      <><path d="M3 12l8.5-8.5a1 1 0 0 1 .7-.3H20a1 1 0 0 1 1 1v7.8a1 1 0 0 1-.3.7L12 21z" /><circle cx="16.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" /></>,
    check:    <path d="M5 12.5l4 4 10-10" />,
    left:     <path d="M14.5 6l-6 6 6 6" />,
    right:    <path d="M9.5 6l6 6-6 6" />,
    arrow:    <><path d="M5 12h13" /><path d="M12.5 6l6 6-6 6" /></>,
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {p}
    </svg>
  );
}

function HeroSchoolsCarousel({ setPage, dark }) {
  const [slide, setSlide]       = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => goTo(s => (s + 1) % total), 4000);
    return () => clearInterval(t);
  }, [total]);

  function goTo(fn) {
    setAnimating(true);
    setTimeout(() => { setSlide(typeof fn === "function" ? fn : () => fn); setAnimating(false); }, 200);
  }

  const sc = HERO_SLIDES[slide];

  return (
    <div className="fadeUp" style={{ animationDelay:".2s" }}>
      <div style={{ background:"#fff" }}>

        {/* Header — school info */}
        <div style={{ padding:"22px 22px 16px", borderBottom:"1px solid #EEF1F5", opacity:animating?0:1, transition:"opacity .2s" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:13 }}>

            {/* Icon */}
            <div style={{ width:52, height:52, borderRadius:12, background:"#EBF2FE", color:"#1A56DB", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <CIc name="building" size={24} />
            </div>

            <div style={{ flex:1, minWidth:0 }}>
              {/* Tag */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10.5, fontWeight:800, color:"#1A56DB", textTransform:"uppercase", letterSpacing:.7, marginBottom:5 }}>
                <CIc name="check" size={13} stroke={2.4} style={{ color:"#059669" }} />
                {String(sc.tag || "").replace(/^[^A-Za-z]+/, "")}
              </div>
              {/* Name */}
              <div style={{ fontSize:17.5, fontWeight:800, color:"#0F172A", marginBottom:7, lineHeight:1.2 }}>{sc.name}</div>
              {/* Meta */}
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", fontWeight:600 }}><CIc name="pin" size={13} style={{ color:"#94A3B8" }} />{sc.city}</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", fontWeight:600 }}><CIc name="cap" size={13} style={{ color:"#94A3B8" }} />{sc.board}</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", fontWeight:600 }}><CIc name="tag" size={13} style={{ color:"#94A3B8" }} />{sc.type}</span>
              </div>
            </div>

            {/* Open count */}
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:34, fontWeight:800, color:"#059669", lineHeight:1, fontFamily:"Playfair Display,serif" }}>{sc.open}</div>
              <div style={{ fontSize:10.5, color:"#64748B", fontWeight:700, marginTop:4 }}>Open Roles</div>
            </div>
          </div>
        </div>

        {/* Roles */}
        <div style={{ padding:"14px 22px 16px", borderBottom:"1px solid #EEF1F5", opacity:animating?0:1, transition:"opacity .2s" }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:"#94A3B8", textTransform:"uppercase", letterSpacing:.6, marginBottom:9 }}>Hiring for</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {sc.roles.map(r => (
              <span key={r} style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:600, color:"#475569" }}>{r}</span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding:"12px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:5 }}>
            {HERO_SLIDES.map((_, i) => (
              <span key={i} onClick={() => goTo(i)}
                style={{ display:"inline-block", width:i===slide?18:6, height:6, borderRadius:3, background:i===slide?"#1A56DB":"#E2E8F0", cursor:"pointer", transition:"all .3s" }} />
            ))}
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <button aria-label="Previous" onClick={() => goTo(sv => (sv-1+total)%total)}
              style={{ width:30, height:30, borderRadius:"50%", border:"1px solid #E2E8F0", background:"#fff", cursor:"pointer", color:"#64748B", display:"flex", alignItems:"center", justifyContent:"center" }}><CIc name="left" size={15} /></button>
            <button aria-label="Next" onClick={() => goTo(sv => (sv+1)%total)}
              style={{ width:30, height:30, borderRadius:"50%", border:"1px solid #E2E8F0", background:"#fff", cursor:"pointer", color:"#64748B", display:"flex", alignItems:"center", justifyContent:"center" }}><CIc name="right" size={15} /></button>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("institutes")}>View All Jobs</button>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ─── Job Card ─────────────────────────────────────────────────────────────── */
function JobCard({ job, onApply }) {
  const typeClass = job.type === "Full-Time" ? "bblue" : job.type === "Part-Time" ? "bsky" : "bamber";
  return (
    <div className="card jcard card-hover" onClick={() => onApply && onApply(job)}>
      <div className="flexb" style={{ marginBottom:14 }}>
        <div className="jcard-logo">{job.logo || "🏫"}</div>
        <span className={"badge " + typeClass}>{job.type}</span>
      </div>
      <div className="jcard-title">{job.title}</div>
      <div className="jcard-org">{job.institute || job.institute_name}</div>
      <div className="jcard-meta">
        <span>📍 {job.location}</span>
        <span>🎓 {job.experience}</span>
        <span>📚 {job.subject}</span>
      </div>
      <div className="jcard-footer">
        <span className="badge bgreen">{job.salary || "Negotiable"}</span>
        <span style={{ fontSize:11, color:"#6B7280" }}>👥 {job.applicants || 0} applicants</span>
      </div>
      <div style={{ marginTop:10, fontSize:11, color:"#9CA3AF" }}>🕐 {job.posted || "Recently"}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════════════════════ */
function HomePage({ setPage }) {
  // Track viewport width so the inline-styled hero/grids respond on every device
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = vw <= 768;
  const isTablet = vw <= 1024;

  const FEATURES = [
    { i:"🎯", t:"Smart Job Matching",      d:"Intelligent matching connects teachers with relevant openings based on subject, city, and experience." },
    { i:"🔐", t:"Verified Profiles",       d:"Every teacher is reviewed. Every institute is verified. Hire and apply with complete confidence." },
    { i:"⚡", t:"Real-Time Notifications", d:"Instant alerts when schools post jobs or teachers apply — never miss a perfect opportunity." },
    { i:"📊", t:"Applicant Management",    d:"Manage applicants, shortlist candidates, and track hiring pipelines in one dashboard." },
    { i:"🌍", t:"Pan-India Reach",         d:"From metro cities to tier-2 towns, find teaching roles or talent across every corner of India." },
    { i:"💼", t:"All Engagement Types",    d:"Full-time, part-time, home tuitions, and online tutoring — every arrangement covered." },
  ];
  const TESTIMONIALS = [
    { n:"Priya Sharma",  r:"Mathematics Teacher", s:"Hired by DPS Hyderabad",    t:"Found my dream position in just three days. AcadHr matched me perfectly with a school looking for my exact profile.", a:"👩‍🏫" },
    { n:"Rajesh Kumar",  r:"Principal",           s:"St. Mary's School, Chennai", t:"We received 30+ qualified applications within a week. The candidate quality on AcadHr is outstanding.", a:"👨‍💼" },
    { n:"Ananya Singh",  r:"Physics Tutor",       s:"Working with 5 students",    t:"Four tutoring requests in my first week. The platform makes it genuinely easy to connect with students.", a:"👩‍🔬" },
  ];
  const HOW = [
    { step:"01", who:"Teachers",  icon:"👩‍🏫", items:["Create your free profile","List subjects and experience","Browse verified job listings","Apply in one click","Get hired and start teaching"] },
    { step:"02", who:"Institutes",icon:"🏫",   items:["Register your institution","Post a vacancy for review","Admin approves and publishes","Receive qualified applications","Shortlist, interview, hire"] },
  ];

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#fff", position:"relative", overflow:"hidden", paddingTop:90 }}>

        {/* Subtle background accents */}
        <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(26,86,219,.05),transparent 65%)", top:-200, right:-150, pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,.05),transparent 65%)", bottom:-100, left:-100, pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(26,86,219,.04) 1px,transparent 1px)", backgroundSize:"36px 36px", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", alignItems:"center", paddingTop: isMobile?24:40, paddingBottom: isMobile?40:60, paddingLeft: isMobile?16:60, paddingRight: isMobile?16:60, width:"100%", boxSizing:"border-box" }}>
          <div style={{ display:"grid", gridTemplateColumns: vw<=900?"1fr":"1fr 1fr", gap: isMobile?32:(isTablet?48:72), alignItems:"center", width:"100%" }}>

            {/* ── LEFT: Copy ── */}
            <div className="fadeUp">
              {/* Eyebrow badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:30, padding:"6px 16px", marginBottom:28 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#059669", display:"inline-block", boxShadow:"0 0 8px rgba(5,150,105,.5)" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#1A56DB", letterSpacing:.5 }}>LIVE · 3,200+ Schools Hiring Now</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(38px,4.5vw,64px)", fontWeight:800, lineHeight:1.1, color:"#0F172A", marginBottom:22 }}>
                India's Smartest<br />
                <span style={{ color:"#1A56DB", fontStyle:"italic" }}>Teacher Hiring</span><br />
                Platform
              </h1>

              <p style={{ fontSize:16, color:"#4B5563", lineHeight:1.85, maxWidth:440, marginBottom:36 }}>
                AcadHr connects verified educators with top schools, colleges and coaching institutes across India. Apply, post, and hire — faster than ever.
              </p>

              {/* Search */}
              <div style={{ display:"flex", background:"#fff", border:"1.5px solid #D1D5DB", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(26,86,219,.1)", marginBottom:24, maxWidth:480 }}>
                <span style={{ padding:"0 16px", display:"flex", alignItems:"center", color:"#9CA3AF", fontSize:18 }}>🔍</span>
                <input
                  placeholder="Subject, city, or school..."
                  style={{ flex:1, border:"none", outline:"none", fontSize:14, color:"#111827", fontFamily:"Nunito,sans-serif", padding:"14px 0", background:"transparent" }}
                  onKeyDown={e => e.key==="Enter" && setPage("jobs")}
                />
                <button className="btn btn-primary" style={{ borderRadius:0, borderTopRightRadius:10, borderBottomRightRadius:10, padding:"0 24px", fontSize:14 }} onClick={() => setPage("jobs")}>
                  Search
                </button>
              </div>

              {/* Subject tag pills */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:44 }}>
                {["Mathematics","Physics","English","CS","Chemistry","Biology"].map(s => (
                  <span key={s} onClick={() => setPage("jobs")} style={{ padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", background:"#F3F4F6", color:"#374151", border:"1px solid #E5E7EB", transition:"all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="#1A56DB"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#1A56DB"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#F3F4F6"; e.currentTarget.style.color="#374151"; e.currentTarget.style.borderColor="#E5E7EB"; }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* CTA row */}
              <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:48 }}>
                <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")} style={{ fontSize:15 }}>
                  Get Started Free →
                </button>
                <button onClick={() => setPage("jobs")} style={{ background:"#fff", border:"1.5px solid #D1D5DB", color:"#374151", borderRadius:10, padding:"13px 26px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#1A56DB"; e.currentTarget.style.color="#1A56DB"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#D1D5DB"; e.currentTarget.style.color="#374151"; }}>
                  Browse Jobs
                </button>
              </div>

              {/* Trust avatars */}
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ display:"flex" }}>
                  {["👩‍🏫","👨‍🏫","👩‍🔬","👨‍💼","👩‍💻"].map((a,i) => (
                    <div key={i} style={{ width:34, height:34, borderRadius:"50%", background:`hsl(${210+i*20},70%,55%)`, border:"2px solid #fff", boxShadow:"0 0 0 1px #E5E7EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginLeft: i===0?0:-10, zIndex:5-i }}>
                      {a}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>12,400+ educators</div>
                  <div style={{ fontSize:11, color:"#6B7280" }}>already on AcadHr</div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: App Showcase Card ── */}
            <div className="fadeUp" style={{ animationDelay:".15s" }}>
              {/* Main card */}
              <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:24, overflow:"hidden", boxShadow:"0 20px 60px rgba(26,86,219,.12)" }}>
                {/* Card topbar */}
                <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"#4ADE80", boxShadow:"0 0 8px #4ADE80" }} />
                    <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>🏫 Top Hiring Schools</span>
                  </div>
                  <span style={{ background:"rgba(255,255,255,.2)", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>Updated Now</span>
                </div>

                {/* Schools carousel */}
                <HeroSchoolsCarousel setPage={setPage} />
              </div>

              {/* Feature pills below card */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16 }}>
                {[
                  { icon:"🎯", t:"Smart Matching",    bg:"#EBF5FF", border:"#BFDBFE", color:"#1E429F" },
                  { icon:"🔐", t:"Verified Profiles", bg:"#ECFDF5", border:"#A7F3D0", color:"#065F46" },
                  { icon:"⚡", t:"Instant Alerts",    bg:"#FFFBEB", border:"#FDE68A", color:"#92400E" },
                  { icon:"📊", t:"Live Dashboard",    bg:"#F5F3FF", border:"#DDD6FE", color:"#4C1D95" },
                ].map(f => (
                  <div key={f.t} style={{ background:f.bg, border:`1px solid ${f.border}`, borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", transition:"transform .18s, box-shadow .18s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                    <span style={{ fontSize:18 }}>{f.icon}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:f.color }}>{f.t}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ALL JOBS SECTION */}
      <section style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB", padding:"72px 0" }}>
        <div className="container">
          {/* Section header */}
          <div className="flexb" style={{ marginBottom:36, flexWrap:"wrap", gap:16 }}>
            <div>
              <div className="sec-eye">All Positions</div>
              <h2 className="sec-title" style={{ marginBottom:6 }}>Browse All Teaching Jobs</h2>
              <p style={{ color:"#6B7280", fontSize:15 }}>
                Live teaching positions across India — updated daily
              </p>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ background:"#ECFDF5", color:"#059669", border:"1px solid #A7F3D0", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700 }}>🟢 Live Jobs</span>
              <button className="btn btn-primary" onClick={() => setPage("jobs")}>View All & Filter →</button>
            </div>
          </div>

          {/* Filter chips */}
          <div style={{ display:"flex", gap:8, marginBottom:32, flexWrap:"wrap" }}>
            {["All","Full-Time","Part-Time","Home Tuition"].map((t,i) => (
              <span key={t} style={{ padding:"6px 16px", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer", background: i===0 ? "#1A56DB" : "#fff", color: i===0 ? "#fff" : "#374151", border: i===0 ? "none" : "1px solid #D1D5DB", boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>{t}</span>
            ))}
          </div>

          {/* Jobs grid — all 9 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {/* Jobs loaded from database on Jobs page */}
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign:"center", marginTop:44 }}>
            <div style={{ background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", borderRadius:16, padding:"32px 40px", display:"inline-block", maxWidth:560 }}>
              <div style={{ fontSize:20, marginBottom:8 }}>🎓</div>
              <h3 style={{ fontSize:20, marginBottom:8 }}>Can't find the right position?</h3>
              <p style={{ color:"#6B7280", fontSize:14, marginBottom:20 }}>Create a free profile and let schools come to you. Over 3,200 institutes are actively hiring on AcadHr.</p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <button className="btn btn-primary" onClick={() => setPage("signup")}>Create Free Profile</button>
                <button className="btn btn-outline" onClick={() => setPage("jobs")}>Browse with Filters</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED TEACHERS */}
      <section className="section" style={{ background:"#fff", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Meet Our Educators</div>
            <h2 className="sec-title">Top Teachers <em style={{ color:"#1A56DB" }}>Available to Hire</em></h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10 }}>Verified, experienced educators ready to join your institution</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":(isTablet?"repeat(2,1fr)":"repeat(3,1fr)"), gap:22 }}>
            {[
              { name:"Priya Sharma",   role:"Mathematics Teacher",  exp:"5 Years", city:"Hyderabad", qual:"M.Sc + B.Ed", subjects:["Algebra","Calculus","Statistics"],      emoji:"👩‍🏫", rating:4.9, avail:"Immediate", color:"#EBF5FF", accent:"#1A56DB" },
              { name:"Ravi Kumar",     role:"Physics Teacher",       exp:"3 Years", city:"Bangalore", qual:"M.Sc + B.Ed", subjects:["Mechanics","Optics","Thermodynamics"],  emoji:"👨‍🔬", rating:4.8, avail:"2 Weeks",   color:"#ECFDF5", accent:"#059669" },
              { name:"Ananya Singh",   role:"Chemistry Tutor",       exp:"4 Years", city:"Mumbai",    qual:"B.Sc + B.Ed", subjects:["Organic","Inorganic","Physical"],        emoji:"👩‍🔬", rating:5.0, avail:"Immediate", color:"#FFF7ED", accent:"#C2410C" },
              { name:"Deepak Verma",   role:"English Instructor",    exp:"7 Years", city:"Delhi",     qual:"M.A. + B.Ed", subjects:["Grammar","Literature","Writing"],        emoji:"👨‍🏫", rating:4.7, avail:"1 Month",   color:"#F5F3FF", accent:"#6D28D9" },
              { name:"Sunita Rao",     role:"Biology Teacher",       exp:"6 Years", city:"Chennai",   qual:"M.Sc + B.Ed", subjects:["Botany","Zoology","Genetics"],           emoji:"👩‍🏫", rating:4.9, avail:"Immediate", color:"#ECFDF5", accent:"#059669" },
              { name:"Arun Mehta",     role:"Computer Science",      exp:"5 Years", city:"Pune",      qual:"B.Tech + B.Ed",subjects:["Python","Java","Data Structures"],      emoji:"👨‍💻", rating:4.8, avail:"2 Weeks",   color:"#EFF6FF", accent:"#1D4ED8" },
            ].map((t,i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:18, padding:"24px", boxShadow:"0 2px 10px rgba(0,0,0,.05)", transition:"all .22s", cursor:"pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(26,86,219,.12)"; e.currentTarget.style.borderColor="#BFDBFE"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.05)"; e.currentTarget.style.borderColor="#E5E7EB"; }}>

                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:t.color, border:`1px solid ${t.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{t.emoji}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>{t.name}</div>
                      <div style={{ fontSize:12, color:t.accent, fontWeight:600, marginTop:2 }}>{t.role}</div>
                    </div>
                  </div>
                  <div style={{ background:t.color, border:`1px solid ${t.accent}40`, borderRadius:8, padding:"4px 10px" }}>
                    <div style={{ fontSize:13, fontWeight:800, color:t.accent }}>★ {t.rating}</div>
                  </div>
                </div>

                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                  <span style={{ fontSize:11, color:"#6B7280", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 9px" }}>📍 {t.city}</span>
                  <span style={{ fontSize:11, color:"#6B7280", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 9px" }}>🎓 {t.exp}</span>
                  <span style={{ fontSize:11, color:"#6B7280", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 9px" }}>📜 {t.qual}</span>
                </div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                  {t.subjects.map(s => (
                    <span key={s} style={{ fontSize:11, fontWeight:600, color:t.accent, background:t.color, borderRadius:20, padding:"2px 10px", border:`1px solid ${t.accent}30` }}>{s}</span>
                  ))}
                </div>

                <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background: t.avail==="Immediate"?"#059669":"#D97706", display:"inline-block" }} />
                    <span style={{ fontSize:11, color:"#6B7280", fontWeight:600 }}>{t.avail==="Immediate"?"Available Now":`Avail. in ${t.avail}`}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setPage("signup")}>View Profile</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:40 }}>
            <button className="btn btn-outline btn-lg" onClick={() => setPage("signup")} style={{ fontSize:14 }}>
              Browse All Teachers →
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(2,1fr)":"repeat(4,1fr)" }}>
            {[["12,400+","Active Teachers","#1A56DB"],["3,200+","Institutes Hiring","#0EA5E9"],["48,000+","Jobs Placed","#059669"],["94%","Placement Rate","#D97706"]].map(([n,l,c]) => (
              <div key={l} className="stat-item">
                <div className="stat-num" style={{ color:c }}>{n}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOR WHOM */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Who Is It For</div>
            <h2 className="sec-title">Designed for Every Education Professional</h2>
          </div>
          <div className="grid2">
            <div className="card" style={{ padding:42, borderTop:"4px solid #1A56DB" }}>
              <div style={{ fontSize:48, marginBottom:18 }}>👩‍🏫</div>
              <h2 style={{ fontSize:26, marginBottom:10 }}>Are You a Teacher?</h2>
              <p style={{ color:"#6B7280", lineHeight:1.8, marginBottom:26, fontSize:15 }}>Build your verified profile, showcase qualifications, and apply to hundreds of teaching positions across India. Free for all educators.</p>
              <ul style={{ listStyle:"none", marginBottom:30 }}>
                {["Free profile — always","Apply to unlimited jobs","Get discovered by top schools","Track all applications live"].map(f => (
                  <li key={f} style={{ color:"#374151", padding:"7px 0", fontSize:14, borderBottom:"1px solid #F3F4F6", display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ color:"#1A56DB", fontWeight:800, fontSize:16 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}>Join as Educator →</button>
            </div>
            <div className="card" style={{ padding:42, borderTop:"4px solid #0EA5E9" }}>
              <div style={{ fontSize:48, marginBottom:18 }}>🏫</div>
              <h2 style={{ fontSize:26, marginBottom:10 }}>Hiring for Your Institute?</h2>
              <p style={{ color:"#6B7280", lineHeight:1.8, marginBottom:26, fontSize:15 }}>Post vacancies, review vetted applications, and find the perfect educators for your school, college, or coaching institute.</p>
              <ul style={{ listStyle:"none", marginBottom:30 }}>
                {["Post unlimited vacancies","Access verified teacher profiles","Manage all applications","Moderated and trusted listings"].map(f => (
                  <li key={f} style={{ color:"#374151", padding:"7px 0", fontSize:14, borderBottom:"1px solid #F3F4F6", display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ color:"#0EA5E9", fontWeight:800, fontSize:16 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-sky btn-lg" onClick={() => setPage("signup")}>Register Institute →</button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Process</div>
            <h2 className="sec-title">How <em style={{ color:"#1A56DB" }}>AcadHr</em> Works</h2>
            <p className="sec-sub" style={{ margin:"0 auto" }}>A streamlined hiring process built for education professionals.</p>
          </div>
          <div className="grid2">
            {HOW.map(h => (
              <div key={h.who} className="card" style={{ padding:36 }}>
                <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:24 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{h.icon}</div>
                  <div>
                    <div style={{ fontSize:11, color:"#1A56DB", fontWeight:800, textTransform:"uppercase", letterSpacing:2 }}>Step {h.step}</div>
                    <h3 style={{ fontSize:20, marginTop:2 }}>For {h.who}</h3>
                  </div>
                </div>
                <ol style={{ paddingLeft:20 }}>
                  {h.items.map((item,i) => (
                    <li key={i} style={{ color:"#374151", padding:"8px 0", fontSize:14, borderBottom:i < h.items.length - 1 ? "1px solid #F3F4F6" : "none" }}>{item}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Platform Features</div>
            <h2 className="sec-title">Built for the Education Sector</h2>
          </div>
          <div className="grid3">
            {FEATURES.map((f,i) => (
              <div key={i} className="card card-hover" style={{ padding:26 }}>
                <div style={{ fontSize:32, marginBottom:14 }}>{f.i}</div>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:10, color:"#111827" }}>{f.t}</h3>
                <p style={{ color:"#6B7280", lineHeight:1.8, fontSize:13 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="section" style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div className="flexb" style={{ marginBottom:38 }}>
            <div>
              <div className="sec-eye">Latest Openings</div>
              <h2 className="sec-title" style={{ marginBottom:0 }}>Fresh Teaching Positions</h2>
            </div>
            <button className="btn btn-outline" onClick={() => setPage("jobs")}>View All Positions →</button>
          </div>
          <div className="grid3">
            <div style={{textAlign:'center',padding:'32px 0',color:'#6B7280'}}><div style={{fontSize:48,marginBottom:12}}>💼</div><p>Loading latest jobs...</p><button className='btn btn-primary' onClick={()=>setPage('jobs')}>Browse All Jobs →</button></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Success Stories</div>
            <h2 className="sec-title">Trusted by Educators <em style={{ color:"#1A56DB" }}>Across India</em></h2>
          </div>
          <div className="grid3">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="card card-hover" style={{ padding:28 }}>
                <div style={{ color:"#D97706", fontSize:16, marginBottom:10, letterSpacing:3 }}>★★★★★</div>
                <p style={{ color:"#374151", lineHeight:1.85, marginBottom:22, fontStyle:"italic", fontSize:14 }}>"{t.t}"</p>
                <Divider />
                <div style={{ display:"flex", gap:14, alignItems:"center", marginTop:16 }}>
                  <div style={{ fontSize:40 }}>{t.a}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{t.n}</div>
                    <div style={{ fontSize:12, color:"#1A56DB", fontWeight:600 }}>{t.r}</div>
                    <div style={{ fontSize:11, color:"#9CA3AF" }}>{t.s}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background:"#1E429F" }}>
        <div className="container" style={{ textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,50px)", marginBottom:14, color:"#fff" }}>Begin Your Journey with <em style={{ color:"#93C5FD" }}>AcadHr</em></h2>
          <p style={{ color:"#BFDBFE", fontSize:17, marginBottom:40, maxWidth:460, margin:"0 auto 40px" }}>Join 15,000+ teachers and 3,000+ institutions already on the platform.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-lg" style={{ background:"#fff", color:"#1E429F", fontWeight:800 }} onClick={() => setPage("signup")}>Create Free Account</button>
            <button className="btn btn-lg" style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,.5)" }} onClick={() => setPage("jobs")}>Browse Positions</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="flexb" style={{ flexWrap:"wrap", gap:20 }}>
            <div>
              <Brand size={22} />
              <p style={{ color:"#6B7280", fontSize:13, marginTop:6 }}>India's Premier Education Hiring Platform</p>
            </div>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
              {["Privacy Policy","Terms of Service","Contact Us","About"].map(l => (
                <span key={l} style={{ fontSize:13, color:"#6B7280", cursor:"pointer" }}>{l}</span>
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

/* ═══════════════════════════════════════════════════════════════════════════
   JOBS PAGE
════════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS PAGE
════════════════════════════════════════════════════════════════════════════ */
function HowItWorksPage({ setPage }) {
  const TEACHER_STEPS = [
    { step:"01", icon:"📝", title:"Create Your Free Profile",    desc:"Sign up as a Teacher or Tutor. Add your name, subject specialisation, qualifications, city, and a short bio. It takes under 3 minutes." },
    { step:"02", icon:"🔍", title:"Browse Verified Job Listings", desc:"Explore hundreds of verified openings from CBSE, ICSE, and state-board schools across India. Filter by subject, city, job type, and salary." },
    { step:"03", icon:"📤", title:"Apply in One Click",           desc:"Found the right role? Hit Apply. Your profile is instantly shared with the hiring school — no resume uploads, no lengthy forms." },
    { step:"04", icon:"🔔", title:"Get Notified in Real Time",    desc:"Receive instant alerts when a school views your profile, shortlists you, or sends a message. Never miss an opportunity." },
    { step:"05", icon:"🤝", title:"Get Hired & Start Teaching",   desc:"Once selected, coordinate directly with the school. Accept the offer from your dashboard and begin your new teaching journey." },
  ];
  const SCHOOL_STEPS = [
    { step:"01", icon:"🏫", title:"Register Your Institution",    desc:"Create a verified school or institute account. Add details like board type, city, website, and a brief about your institution." },
    { step:"02", icon:"✍️", title:"Post a Vacancy",               desc:"Describe the role — subject, experience required, salary range, job type. Our team reviews and publishes your listing within 24 hours." },
    { step:"03", icon:"📥", title:"Receive Qualified Applications",desc:"Verified, pre-screened teacher profiles land directly in your dashboard. Browse applicants, read bios, and check qualifications." },
    { step:"04", icon:"⭐", title:"Shortlist & Interview",         desc:"Mark candidates as shortlisted or rejected with one click. Reach out directly to schedule interviews from within the platform." },
    { step:"05", icon:"✅", title:"Hire with Confidence",          desc:"Select your ideal candidate, extend an offer, and track their onboarding — all from your AcadHr school dashboard." },
  ];
  const FAQS = [
    { q:"Is AcadHr free for teachers?",            a:"Yes — completely free. Teachers and tutors can create profiles, browse jobs, and apply with no charges ever." },
    { q:"How are schools verified?",               a:"Every institution goes through a manual review by our team before listings are published. We check registration details and contact information." },
    { q:"How long does hiring take?",              a:"Most teachers receive a response within 3–7 days of applying. Schools can shortlist and contact you directly from the platform." },
    { q:"Can tutors find private students?",       a:"Yes. Tutors have a separate portal to list availability, subjects, and hourly rates so students and parents can find and request sessions." },
    { q:"Is there a mobile app?",                  a:"Our platform is fully mobile-responsive. A dedicated app is on our roadmap — stay tuned!" },
    { q:"What subjects and cities are covered?",   a:"We cover all major school subjects and 50+ cities across India, from metros like Hyderabad and Mumbai to tier-2 cities." },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ paddingTop:90 }}>

      {/* ── Hero banner ── */}
      <section style={{ background:"linear-gradient(135deg,#1E429F 0%,#1A56DB 100%)", padding:"72px 0 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
        <div className="container" style={{ position:"relative", zIndex:1, textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", borderRadius:30, padding:"6px 18px", marginBottom:24 }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff", letterSpacing:.5 }}>SIMPLE · FAST · TRUSTED</span>
          </div>
          <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, color:"#fff", marginBottom:18, lineHeight:1.1 }}>
            How <em style={{ color:"#93C5FD" }}>AcadHr</em> Works
          </h1>
          <p style={{ fontSize:17, color:"#BFDBFE", maxWidth:560, margin:"0 auto 36px", lineHeight:1.8 }}>
            Whether you're a teacher looking for your next role or a school searching for the perfect educator — AcadHr makes the process simple, transparent, and fast.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-lg" style={{ background:"#fff", color:"#1E429F", fontWeight:800 }} onClick={() => setPage("signup")}>Get Started Free</button>
            <button className="btn btn-lg" style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,.4)" }} onClick={() => setPage("jobs")}>Browse Jobs</button>
          </div>
        </div>
      </section>

      {/* ── For Teachers ── */}
      <section style={{ padding:"80px 0", background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>For Teachers & Tutors</div>
            <h2 className="sec-title">Land Your Dream <em style={{ color:"#1A56DB" }}>Teaching Role</em></h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10, maxWidth:520, margin:"10px auto 0" }}>5 simple steps from sign-up to your first day of class</p>
          </div>
          <div style={{ position:"relative" }}>
            {/* Connector line */}
            <div style={{ position:"absolute", left:"calc(50% - 1px)", top:40, bottom:40, width:2, background:"linear-gradient(#BFDBFE,#E0F2FE)", zIndex:0, display:"none" }} />
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {TEACHER_STEPS.map((s, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns: i%2===0 ? "1fr 80px 1fr" : "1fr 80px 1fr", gap:0, alignItems:"center", marginBottom:24 }}>
                  {/* Left content (even) or empty (odd) */}
                  <div style={{ padding:"0 32px 0 0", textAlign:"right", visibility: i%2===0 ? "visible":"hidden" }}>
                    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:18, padding:"24px 28px", boxShadow:"0 4px 16px rgba(26,86,219,.08)", display:"inline-block", textAlign:"left", maxWidth:380 }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>{s.icon}</div>
                      <div style={{ fontWeight:800, fontSize:16, color:"#111827", marginBottom:8 }}>{s.title}</div>
                      <div style={{ fontSize:14, color:"#6B7280", lineHeight:1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                  {/* Centre step bubble */}
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", zIndex:1 }}>
                    <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#1E429F,#1A56DB)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, fontFamily:"Playfair Display,serif", boxShadow:"0 4px 14px rgba(26,86,219,.35)" }}>{s.step}</div>
                    {i < TEACHER_STEPS.length-1 && <div style={{ width:2, height:36, background:"#BFDBFE", marginTop:4 }} />}
                  </div>
                  {/* Right content (odd) or empty (even) */}
                  <div style={{ padding:"0 0 0 32px", visibility: i%2===1 ? "visible":"hidden" }}>
                    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:18, padding:"24px 28px", boxShadow:"0 4px 16px rgba(26,86,219,.08)", display:"inline-block", maxWidth:380 }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>{s.icon}</div>
                      <div style={{ fontWeight:800, fontSize:16, color:"#111827", marginBottom:8 }}>{s.title}</div>
                      <div style={{ fontSize:14, color:"#6B7280", lineHeight:1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:"center", marginTop:32 }}>
            <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}>Join as Teacher / Tutor →</button>
          </div>
        </div>
      </section>

      {/* ── For Schools ── */}
      <section style={{ padding:"80px 0", background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>For Schools & Institutes</div>
            <h2 className="sec-title">Hire the <em style={{ color:"#1A56DB" }}>Right Teacher</em> Fast</h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10, maxWidth:520, margin:"10px auto 0" }}>Post, review, and hire quality educators in 5 easy steps</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16 }}>
            {SCHOOL_STEPS.map((s,i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, padding:"24px 18px", boxShadow:"0 2px 10px rgba(0,0,0,.05)", textAlign:"center", position:"relative" }}>
                {i < SCHOOL_STEPS.length-1 && (
                  <div style={{ position:"absolute", right:-16, top:"50%", transform:"translateY(-50%)", fontSize:20, color:"#BFDBFE", zIndex:1 }}>›</div>
                )}
                <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 14px" }}>{s.icon}</div>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"#1A56DB", color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>{i+1}</div>
                <div style={{ fontWeight:800, fontSize:14, color:"#111827", marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:40 }}>
            <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}>Register Your School →</button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:"80px 0", background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>FAQs</div>
            <h2 className="sec-title">Common <em style={{ color:"#1A56DB" }}>Questions</em></h2>
          </div>
          <div style={{ maxWidth:720, margin:"0 auto", display:"flex", flexDirection:"column", gap:12 }}>
            {FAQS.map((f,i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid " + (openFaq===i?"#BFDBFE":"#E5E7EB"), borderRadius:14, overflow:"hidden", boxShadow: openFaq===i?"0 4px 16px rgba(26,86,219,.08)":"none", transition:"all .2s" }}>
                <div onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 22px", cursor:"pointer" }}>
                  <span style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{f.q}</span>
                  <span style={{ fontSize:20, color:"#1A56DB", fontWeight:800, transition:"transform .2s", transform: openFaq===i?"rotate(45deg)":"none" }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding:"0 22px 18px", fontSize:14, color:"#4B5563", lineHeight:1.75, borderTop:"1px solid #EBF5FF" }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ background:"#1E429F", padding:"72px 0" }}>
        <div className="container" style={{ textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,48px)", color:"#fff", marginBottom:14 }}>Ready to Get Started?</h2>
          <p style={{ color:"#BFDBFE", fontSize:16, marginBottom:36, maxWidth:460, margin:"0 auto 36px" }}>Join 15,000+ teachers and 3,000+ institutions already on AcadHr.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-lg" style={{ background:"#fff", color:"#1E429F", fontWeight:800 }} onClick={() => setPage("signup")}>Create Free Account</button>
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
                <span key={l} style={{ fontSize:13, color:"#6B7280", cursor:"pointer" }}>{l}</span>
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

function JobsPage({ setPage }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState({ subject:"", type:"", location:"", search:"" });
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState([]);
  const [loginAlert, setLoginAlert] = useState(false);

  const filtered = jobs.filter(j =>
    (!filter.subject  || j.subject.toLowerCase().includes(filter.subject.toLowerCase())) &&
    (!filter.type     || j.type === filter.type) &&
    (!filter.location || j.location.toLowerCase().includes(filter.location.toLowerCase())) &&
    (!filter.search   || j.title.toLowerCase().includes(filter.search.toLowerCase()) || j.institute.toLowerCase().includes(filter.search.toLowerCase()))
  );

  function handleApply(job) {
    if (!user) { setLoginAlert(true); return; }
    if (user.role !== "teacher") { alert("Only teachers can apply. Please log in with a teacher account."); return; }
    // Profile completion check — teachers must have ≥70% to apply
    // Since JobsPage doesn't have access to teacher profile state, we check localStorage
    const stored = localStorage.getItem("acadhr_teacher_completion");
    const pct = stored ? Number(stored) : 0;
    if (pct < 70) {
      alert(`⚠️ Your profile is only ${pct}% complete.\n\nYou need at least 70% profile completion to apply for jobs.\n\nPlease go to your Dashboard → My Profile and fill in the required fields.`);
      setPage("dashboard");
      return;
    }
    setSelected(job);
    if (!applied.includes(job.id)) setApplied(a => [...a, job.id]);
  }

  return (
    <div style={{ paddingTop:66 }}>
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"42px 0 0" }}>
        <div className="container">
          <div className="sec-eye">Opportunities</div>
          <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:34, fontWeight:800, marginBottom:6, color:"#111827" }}>Browse Teaching Positions</h1>
          <p style={{ color:"#6B7280", marginBottom:26, fontSize:15 }}>Verified opportunities across India's leading schools and institutions</p>
          <div style={{ display:"flex", gap:12, paddingBottom:24, flexWrap:"wrap" }}>
            <input className="input" style={{ maxWidth:240 }} placeholder="🔍  Title or institute..." value={filter.search} onChange={e => setFilter({...filter,search:e.target.value})} />
            <input className="input" style={{ maxWidth:200 }} placeholder="📚  Subject..." value={filter.subject} onChange={e => setFilter({...filter,subject:e.target.value})} />
            <select className="input" style={{ maxWidth:180 }} value={filter.type} onChange={e => setFilter({...filter,type:e.target.value})}>
              <option value="">All Job Types</option>
              <option>Full-Time</option><option>Part-Time</option><option>Home Tuition</option>
            </select>
            <input className="input" style={{ maxWidth:200 }} placeholder="📍  City..." value={filter.location} onChange={e => setFilter({...filter,location:e.target.value})} />
            {Object.values(filter).some(v => v) && (
              <button className="btn btn-ghost btn-sm" onClick={() => setFilter({subject:"",type:"",location:"",search:""})}>Clear ✕</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ background:"#F9FAFB", minHeight:"60vh" }}>
        <div className="container" style={{ paddingTop:36, paddingBottom:72 }}>
          {loginAlert && (
            <div className="alert a-warn flexb" style={{ marginBottom:24 }}>
              <span>Please log in as a Teacher to apply for positions.</span>
              <button className="btn btn-primary btn-sm" onClick={() => setPage("login")}>Log In</button>
            </div>
          )}
          <div style={{ marginBottom:20, color:"#9CA3AF", fontSize:13 }}>
            Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> position{filtered.length !== 1 ? "s" : ""}
          </div>
          <div className="grid3">
            {filtered.map(job => (
              <div key={job.id} style={{ position:"relative" }}>
                <JobCard job={job} onApply={handleApply} />
                {applied.includes(job.id) && (
                  <div style={{ position:"absolute", top:14, right:14 }}>
                    <span className="badge bgreen">✓ Applied</span>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"72px 0" }}>
                <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
                <h3 style={{ marginBottom:8, color:"#111827" }}>No positions found</h3>
                <p style={{ color:"#6B7280", fontSize:14 }}>Try adjusting or clearing your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign:"center", padding:"10px 0 22px" }}>
              <div style={{ fontSize:58, marginBottom:10 }}>🎉</div>
              <h2 style={{ fontSize:22, marginBottom:6 }}>Application Submitted!</h2>
              <p style={{ color:"#6B7280", fontSize:14 }}>Your application for <strong>{selected.title}</strong> at <strong style={{ color:"#1A56DB" }}>{selected.institute}</strong> has been sent.</p>
            </div>
            <div className="alert a-ok">The school will review your profile and reach out if shortlisted. Track it in your dashboard.</div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }} onClick={() => { setSelected(null); setPage("dashboard"); }}>Go to Dashboard</button>
              <button className="btn btn-outline" style={{ flex:1, justifyContent:"center" }} onClick={() => setSelected(null)}>Browse More</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTH PAGE
════════════════════════════════════════════════════════════════════════════ */
// ── OTP Boxes (defined outside AuthPage to prevent re-mount on each keystroke) ──
function OtpBoxes({ arr, setter, prefix, disabled, onChangeFn, onKeyDownFn }) {
  return (
    <div className="otp-row" style={{ marginBottom:8 }}>
      {arr.map((val, idx) => (
        <input
          key={idx}
          className="otp-input"
          id={`otp-${prefix}-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          disabled={disabled}
          autoComplete="one-time-code"
          onChange={e => onChangeFn(e.target.value, idx, setter, arr)}
          onKeyDown={e => onKeyDownFn(e, idx, setter, arr)}
          style={{
            width:48, height:56, textAlign:"center", fontSize:22, fontWeight:800,
            border:`2px solid ${val?"#1A56DB":"#D1D5DB"}`,
            borderRadius:10, outline:"none", fontFamily:"Nunito,sans-serif",
            background: val?"#EBF5FF":"#fff", color:"#1A56DB",
            transition:"border-color .15s, background .15s",
            opacity: disabled ? .6 : 1
          }}
        />
      ))}
    </div>
  );
}


// ── InlineBrowseJobs — used inside dashboards so user stays in dashboard ────
function InlineBrowseJobs({ user, canApply, onApplyBlocked }) {
  const [jobs,      setJobs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState({ subject:"", type:"", location:"", search:"" });
  const [applied,   setApplied]   = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [applyJob,  setApplyJob]  = useState(null);
  const [applying,  setApplying]  = useState(false);
  const [applyErr,  setApplyErr]  = useState("");

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/jobs`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setJobs(Array.isArray(data) ? data.map(j => ({
          id:            j.id,
          title:         j.title || "",
          institute:     j.institution_name || j.posted_by_name || "",
          institution_type: j.institution_type || "",
          location:      j.location_city || "",
          location_state:j.location_state || "",
          subject:       j.subject || "",
          experience:    j.experience || "",
          type:          (j.job_type||"Full-Time").includes("Part") ? "Part-Time"
                       : (j.job_type||"").includes("Home")          ? "Home Tuition"
                       : "Full-Time",
          salary:        j.salary_min && j.salary_max
                           ? `₹${Number(j.salary_min).toLocaleString("en-IN")}–₹${Number(j.salary_max).toLocaleString("en-IN")}/mo`
                           : "Negotiable",
          posted:        j.created_at ? new Date(j.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "Recently",
          applicants:    j.applicant_count || 0,
          logo:          "🏫",
          board:         j.board || "",
          grades:        j.grades || "",
          status:        j.status || "",
          requirement_id:j.requirement_id || "",
          joining_timeline: j.joining_timeline || "",
          work_mode:     j.work_mode || "",
          positions:     j.positions || 1,
          description:   j.description || "",
          gender_preference: j.gender_preference || "",
          interview_mode:j.interview_mode || "",
          demo_required: j.demo_required || "",
          residential:   j.residential || "",
          accommodation: j.accommodation || "",
        })) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    (!filter.subject  || j.subject.toLowerCase().includes(filter.subject.toLowerCase())) &&
    (!filter.type     || j.type === filter.type) &&
    (!filter.location || j.location.toLowerCase().includes(filter.location.toLowerCase())) &&
    (!filter.search   || j.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                         j.institute.toLowerCase().includes(filter.search.toLowerCase()))
  );

  async function handleApply(job) {
    if (!user) return;
    if (user.role !== "teacher") { alert("Only teachers can apply for jobs."); return; }
    if (!canApply) { onApplyBlocked && onApplyBlocked(); return; }
    if (applied.includes(job.id)) { setSelected(null); setApplyJob(job); return; }
    setApplying(true); setApplyErr("");
    try {
      const token = localStorage.getItem("acadhr_token");
      const res = await fetch(`${API}/jobs/applications`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:"Bearer "+token },
        body: JSON.stringify({ job_id: job.id }),
      });
      const data = await res.json();
      if (res.status === 409 || res.ok) {
        setApplied(a => [...a, job.id]);
        setSelected(null);
        setApplyJob(job);
      } else {
        setApplyErr(data.message || "Failed to apply.");
      }
    } catch { setApplyErr("Network error. Please try again."); }
    finally { setApplying(false); }
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <input className="input" style={{ maxWidth:220 }} placeholder="🔍 Title or institute..."
            value={filter.search} onChange={e => setFilter({...filter, search:e.target.value})} />
          <input className="input" style={{ maxWidth:160 }} placeholder="📚 Subject..."
            value={filter.subject} onChange={e => setFilter({...filter, subject:e.target.value})} />
          <select className="input" style={{ maxWidth:160 }} value={filter.type} onChange={e => setFilter({...filter, type:e.target.value})}>
            <option value="">All Types</option>
            <option>Full-Time</option><option>Part-Time</option><option>Home Tuition</option>
          </select>
          <input className="input" style={{ maxWidth:160 }} placeholder="📍 City..."
            value={filter.location} onChange={e => setFilter({...filter, location:e.target.value})} />
          {Object.values(filter).some(v=>v) && (
            <button className="btn btn-ghost btn-sm" onClick={() => setFilter({subject:"",type:"",location:"",search:""})}>Clear ✕</button>
          )}
        </div>
      </div>

      <div style={{ marginBottom:14, color:"#9CA3AF", fontSize:13 }}>
        {loading ? "Loading jobs..." : <><strong style={{ color:"#111827" }}>{filtered.length}</strong> position{filtered.length!==1?"s":""} found</>}
      </div>

      {applyErr && <div className="alert a-err" style={{ marginBottom:14 }}>❌ {applyErr}</div>}

      {loading ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#6B7280" }}>
          <div style={{ width:36, height:36, border:"3px solid #E5E7EB", borderTopColor:"#1A56DB", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 14px" }} />
          <div style={{ fontWeight:600 }}>Fetching jobs...</div>
        </div>
      ) : (
        <div className="grid3">
          {filtered.map(job => (
            <div key={job.id} style={{ position:"relative" }}>
              <div className="card jcard card-hover" onClick={() => setSelected(job)} style={{ cursor:"pointer" }}>
                <div className="flexb" style={{ marginBottom:14 }}>
                  <div className="jcard-logo">🏫</div>
                  <span className={"badge " + (job.type==="Full-Time"?"bblue":job.type==="Part-Time"?"bsky":"bamber")}>{job.type}</span>
                </div>
                <div className="jcard-title">{job.title}</div>
                <div className="jcard-org">{job.institute}</div>
                <div className="jcard-meta">
                  {job.location   && <span>📍 {job.location}</span>}
                  {job.experience && <span>🎓 {job.experience}</span>}
                  {job.subject    && <span>📚 {job.subject}</span>}
                </div>
                <div className="jcard-footer">
                  <span className="badge bgreen">{job.salary}</span>
                  <span style={{ fontSize:11, color:"#6B7280" }}>👥 {job.applicants} applicants</span>
                </div>
                {job.requirement_id && <div style={{ marginTop:8, fontSize:10, color:"#059669", fontFamily:"Fira Code,monospace" }}>🔖 {job.requirement_id}</div>}
                <div style={{ marginTop:6, fontSize:11, color:"#9CA3AF" }}>🕐 {job.posted}</div>
                <div style={{ marginTop:8, fontSize:11, color:"#1A56DB", fontWeight:600 }}>View Details →</div>
              </div>
              {applied.includes(job.id) && (
                <div style={{ position:"absolute", top:12, right:12 }}>
                  <span className="badge bgreen">✓ Applied</span>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:"#9CA3AF" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              <div style={{ fontWeight:600 }}>{jobs.length===0?"No jobs in database yet":"No positions found"}</div>
            </div>
          )}
        </div>
      )}

      {/* ── Job Detail Modal ─────────────────────────────────────────────── */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:600, padding:0, overflow:"hidden" }}>

            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"26px 28px 20px", position:"relative" }}>
              <button onClick={() => setSelected(null)}
                style={{ position:"absolute", top:14, right:14, width:32, height:32, borderRadius:"50%",
                  border:"1px solid rgba(255,255,255,.3)", background:"rgba(255,255,255,.15)",
                  cursor:"pointer", fontSize:16, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{ width:50, height:50, borderRadius:12, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🏫</div>
                <div>
                  <h2 style={{ fontSize:19, fontWeight:900, color:"#fff", marginBottom:3, lineHeight:1.2 }}>{selected.title}</h2>
                  <div style={{ fontSize:14, color:"#93C5FD", fontWeight:600 }}>{selected.institute}</div>
                  {selected.requirement_id && <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", fontFamily:"Fira Code,monospace", marginTop:3 }}>🔖 {selected.requirement_id}</div>}
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding:"20px 28px", maxHeight:"55vh", overflowY:"auto" }}>

              {/* Quick badges */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:18 }}>
                {selected.location    && <span style={{ background:"#F3F4F6", color:"#374151", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>📍 {selected.location}{selected.location_state?`, ${selected.location_state}`:""}</span>}
                {selected.type        && <span style={{ background:"#EBF5FF", color:"#1A56DB", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{selected.type}</span>}
                {selected.experience  && <span style={{ background:"#F5F3FF", color:"#6D28D9", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>🎓 {selected.experience}</span>}
                {selected.work_mode   && <span style={{ background:"#ECFDF5", color:"#059669", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>💻 {selected.work_mode}</span>}
              </div>

              {/* Details grid — NO school email/phone */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
                {[
                  ["💰 Salary",        selected.salary],
                  ["📚 Subject",       selected.subject],
                  ["🏫 Board",         selected.board],
                  ["📖 Grades",        selected.grades],
                  ["👥 Openings",      selected.positions > 1 ? `${selected.positions} positions` : "1 position"],
                  ["📅 Joining",       selected.joining_timeline],
                  ["🎭 Interview Mode",selected.interview_mode],
                  ["🎬 Demo Required", selected.demo_required],
                  ["🏠 Residential",   selected.residential],
                  ["🏨 Accommodation", selected.accommodation],
                  ["⚥ Gender Pref",   selected.gender_preference],
                  ["🏷 Institution",   selected.institution_type],
                ].filter(([,v]) => v && v !== "No Preference" && v !== "No" && v !== "0").map(([label, value]) => (
                  <div key={label} style={{ background:"#F9FAFB", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {selected.description && (
                <div style={{ background:"#F9FAFB", borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>About This Role</div>
                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.7, margin:0 }}>{selected.description}</p>
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9CA3AF" }}>
                <span>👥 {selected.applicants} applicant{selected.applicants!==1?"s":""}</span>
                <span>🕐 Posted {selected.posted}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding:"14px 28px", borderTop:"1px solid #E5E7EB", display:"flex", gap:10 }}>
              <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={() => setSelected(null)}>Close</button>
              {applied.includes(selected.id) ? (
                <button className="btn" style={{ flex:2, justifyContent:"center", background:"#ECFDF5", color:"#059669", border:"1px solid #A7F3D0", fontWeight:700 }} disabled>
                  ✓ Already Applied
                </button>
              ) : (
                <button className="btn btn-primary" style={{ flex:2, justifyContent:"center" }}
                  onClick={() => handleApply(selected)} disabled={applying}>
                  {applying ? "Submitting..." : "Apply Now →"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Apply success ─────────────────────────────────────────────────── */}
      {applyJob && (
        <div className="overlay" onClick={() => setApplyJob(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:440 }}>
            <div style={{ textAlign:"center", padding:"10px 0 20px" }}>
              <div style={{ width:68, height:68, borderRadius:"50%", background:"#ECFDF5", border:"3px solid #A7F3D0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:32 }}>🎉</div>
              <h2 style={{ fontSize:22, fontWeight:900, color:"#111827", marginBottom:6 }}>Application Submitted!</h2>
              <p style={{ color:"#6B7280", fontSize:14 }}>You applied for <strong>{applyJob.title}</strong> at <strong style={{ color:"#1A56DB" }}>{applyJob.institute}</strong></p>
            </div>
            <div className="alert a-ok" style={{ marginBottom:14 }}>✅ The school will review your profile and contact you if shortlisted.</div>
            <div style={{ background:"#EBF5FF", borderRadius:10, padding:"12px 14px", marginBottom:18, fontSize:13, color:"#1E429F" }}>
              💡 Track your application in <strong>My Applications</strong>
            </div>
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={() => setApplyJob(null)}>
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBar({ filters, setFilters, fields, onClear }) {
  const active = Object.values(filters).some(v => v !== "");
  return (
    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
                  padding:"14px 18px", marginBottom:18, display:"flex",
                  flexWrap:"wrap", gap:10, alignItems:"center" }}>
      {fields.map(f => (
        f.type === "select" ? (
          <select key={f.key} className="input" style={{ maxWidth:f.width||170, fontSize:13 }}
            value={filters[f.key]||""} onChange={e => setFilters(p => ({...p, [f.key]:e.target.value}))}>
            <option value="">{f.placeholder}</option>
            {f.options.map(o => <option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
          </select>
        ) : (
          <input key={f.key} className="input" style={{ maxWidth:f.width||180, fontSize:13 }}
            placeholder={f.placeholder} value={filters[f.key]||""}
            onChange={e => setFilters(p => ({...p, [f.key]:e.target.value}))} />
        )
      ))}
      {active && (
        <button className="btn btn-ghost btn-sm" onClick={() => {
          const cleared = {}; fields.forEach(f => cleared[f.key]="");
          setFilters(cleared); onClear && onClear();
        }}>Clear All ✕</button>
      )}
      {active && (
        <span style={{ fontSize:12, color:"#6B7280", marginLeft:4 }}>
          Filters active
        </span>
      )}
    </div>
  );
}

export { Toast, Spinner, Divider, Brand, HeroSchoolsCarousel, Navbar, JobCard, OtpBoxes, InlineBrowseJobs, FilterBar };