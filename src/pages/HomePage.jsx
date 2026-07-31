// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";

// import { Navbar, HeroSchoolsCarousel, JobCard, Toast, Brand, Divider } from "../components/common/Shared";

// function HomePage({ setPage }) {
//   const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
//   useEffect(() => {
//     const onResize = () => setVw(window.innerWidth);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);
//   const isMobile = vw <= 640;
//   const isTablet = vw <= 1024;

//   const FEATURES = [
//     { i:"🎯", t:"Smart Job Matching",      d:"Intelligent matching connects teachers with relevant openings based on subject, city, and experience." },
//     { i:"🔐", t:"Verified Profiles",       d:"Every teacher is reviewed. Every institute is verified. Hire and apply with complete confidence." },
//     { i:"⚡", t:"Real-Time Notifications", d:"Instant alerts when schools post jobs or teachers apply — never miss a perfect opportunity." },
//     { i:"📊", t:"Applicant Management",    d:"Manage applicants, shortlist candidates, and track hiring pipelines in one dashboard." },
//     { i:"🌍", t:"Pan-India Reach",         d:"From metro cities to tier-2 towns, find teaching roles or talent across every corner of India." },
//     { i:"💼", t:"All Engagement Types",    d:"Full-time, part-time, home tuitions, and online tutoring — every arrangement covered." },
//   ];
//   const TESTIMONIALS = [
//     { n:"Priya Sharma",  r:"Mathematics Teacher", s:"Hired by DPS Hyderabad",    t:"Found my dream position in just three days. AcadHr matched me perfectly with a school looking for my exact profile.", a:"👩‍🏫" },
//     { n:"Rajesh Kumar",  r:"Principal",           s:"St. Mary's School, Chennai", t:"We received 30+ qualified applications within a week. The candidate quality on AcadHr is outstanding.", a:"👨‍💼" },
//     { n:"Ananya Singh",  r:"Physics Tutor",       s:"Working with 5 students",    t:"Four tutoring requests in my first week. The platform makes it genuinely easy to connect with students.", a:"👩‍🔬" },
//   ];
//   const HOW = [
//     { step:"01", who:"Teachers",  icon:"👩‍🏫", items:["Create your free profile","List subjects and experience","Browse verified job listings","Apply in one click","Get hired and start teaching"] },
//     { step:"02", who:"Institutes",icon:"🏫",   items:["Register your institution","Post a vacancy for review","Admin approves and publishes","Receive qualified applications","Shortlist, interview, hire"] },
//   ];

//   return (
//     <div>
//       <Navbar setPage={setPage} />
//       {/* ── HERO ───────────────────────────────────────────────────────────── */}
//       <section className="hero-section" style={{ display:"flex", flexDirection:"column", background:"#fff", position:"relative", overflow:"hidden" }}>

//         {/* Subtle background accents */}
//         <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(26,86,219,.05),transparent 65%)", top:-200, right:-150, pointerEvents:"none" }} />
//         <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,.05),transparent 65%)", bottom:-100, left:-100, pointerEvents:"none" }} />
//         <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(26,86,219,.04) 1px,transparent 1px)", backgroundSize:"36px 36px", pointerEvents:"none" }} />

//         <div className="hero-inner" style={{ position:"relative", zIndex:1, flex:1, display:"flex", alignItems:"center", paddingTop:40, paddingBottom:60, paddingLeft:isMobile?16:isTablet?24:60, paddingRight:isMobile?16:isTablet?24:60, width:"100%", boxSizing:"border-box" }}>
//           <div className="hero-grid">

//             {/* ── LEFT: Copy ── */}
//             <div className="fadeUp">
//               {/* Eyebrow badge */}
//               <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:30, padding:"6px 16px", marginBottom:28 }}>
//                 <span style={{ width:7, height:7, borderRadius:"50%", background:"#059669", display:"inline-block", boxShadow:"0 0 8px rgba(5,150,105,.5)" }} />
//                 <span style={{ fontSize:12, fontWeight:700, color:"#1A56DB", letterSpacing:.5 }}>LIVE · 3,200+ Schools Hiring Now</span>
//               </div>

//               {/* Headline */}
//               <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(38px,4.5vw,64px)", fontWeight:800, lineHeight:1.1, color:"#0F172A", marginBottom:22 }}>
//                 India's Smartest<br />
//                 <span style={{ color:"#1A56DB", fontStyle:"italic" }}>Teacher Hiring</span><br />
//                 Platform
//               </h1>

//               <p style={{ fontSize:16, color:"#4B5563", lineHeight:1.85, maxWidth:440, marginBottom:36 }}>
//                 AcadHr connects verified educators with top schools, colleges and coaching institutes across India. Apply, post, and hire — faster than ever.
//               </p>

//               {/* Search */}
//               <div className="hero-search-row">
//                 <div className="hero-search-input-wrap">
//                   <span className="hero-search-icon" aria-hidden="true">🔍</span>
//                   <input
//                     className="hero-search-input"
//                     placeholder="Subject, city, or school..."
//                     onKeyDown={e => e.key==="Enter" && setPage("jobs")}
//                   />
//                 </div>
//                 <button type="button" className="btn btn-primary hero-search-btn" onClick={() => setPage("jobs")}>
//                   Search
//                 </button>
//               </div>

//               {/* Subject tag pills */}
//               <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:44 }}>
//                 {["Mathematics","Physics","English","CS","Chemistry","Biology"].map(s => (
//                   <span key={s} onClick={() => setPage("jobs")} style={{ padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", background:"#F3F4F6", color:"#374151", border:"1px solid #E5E7EB", transition:"all .15s" }}
//                     onMouseEnter={e => { e.currentTarget.style.background="#1A56DB"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#1A56DB"; }}
//                     onMouseLeave={e => { e.currentTarget.style.background="#F3F4F6"; e.currentTarget.style.color="#374151"; e.currentTarget.style.borderColor="#E5E7EB"; }}>
//                     {s}
//                   </span>
//                 ))}
//               </div>

//               {/* CTA row */}
//               <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:48 }}>
//                 <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")} style={{ fontSize:15 }}>
//                   Get Started Free →
//                 </button>
//                 <button onClick={() => setPage("jobs")} style={{ background:"#fff", border:"1.5px solid #D1D5DB", color:"#374151", borderRadius:10, padding:"13px 26px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .18s" }}
//                   onMouseEnter={e => { e.currentTarget.style.borderColor="#1A56DB"; e.currentTarget.style.color="#1A56DB"; }}
//                   onMouseLeave={e => { e.currentTarget.style.borderColor="#D1D5DB"; e.currentTarget.style.color="#374151"; }}>
//                   Browse Jobs
//                 </button>
//               </div>

//               {/* Trust avatars */}
//               <div style={{ display:"flex", alignItems:"center", gap:14 }}>
//                 <div style={{ display:"flex" }}>
//                   {["👩‍🏫","👨‍🏫","👩‍🔬","👨‍💼","👩‍💻"].map((a,i) => (
//                     <div key={i} style={{ width:34, height:34, borderRadius:"50%", background:`hsl(${210+i*20},70%,55%)`, border:"2px solid #fff", boxShadow:"0 0 0 1px #E5E7EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginLeft: i===0?0:-10, zIndex:5-i }}>
//                       {a}
//                     </div>
//                   ))}
//                 </div>
//                 {/* <div>
//                   <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>12,400+ educators</div>
//                   <div style={{ fontSize:11, color:"#6B7280" }}>already on AcadHr</div>
//                 </div> */}
//               </div>
//             </div>

//             {/* ── RIGHT: App Showcase Card ── */}
//             <div className="fadeUp" style={{ animationDelay:".15s" }}>
//               {/* Main card */}
//               <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:24, overflow:"hidden", boxShadow:"0 20px 60px rgba(26,86,219,.12)" }}>
//                 {/* Card topbar */}
//                 <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                     <div style={{ width:8, height:8, borderRadius:"50%", background:"#4ADE80", boxShadow:"0 0 8px #4ADE80" }} />
//                     <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>🏫 Top Hiring Schools</span>
//                   </div>
//                   <span style={{ background:"rgba(255,255,255,.2)", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>Updated Now</span>
//                 </div>

//                 {/* Schools carousel */}
//                 <HeroSchoolsCarousel setPage={setPage} />

//                 {/* Card footer stats */}
//                 {/* <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderTop:"1px solid #E5E7EB" }}>
//                   {[["12.4k+","Educators"],["3.2k+","Schools"],["9.8k+","Placed"]].map(([n,l],i) => (
//                     <div key={l} style={{ padding:"16px 0", textAlign:"center", borderRight: i<2?"1px solid #E5E7EB":"none" }}>
//                       <div style={{ fontSize:18, fontWeight:800, color:"#1A56DB", fontFamily:"Playfair Display,serif" }}>{n}</div>
//                       <div style={{ fontSize:11, color:"#6B7280", fontWeight:600, marginTop:2 }}>{l}</div>
//                     </div>
//                   ))}
//                 </div> */}
//               </div>

//               {/* Feature pills below card */}
//               <div className="home-pills-grid" style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12, marginTop:16 }}>
//                 {[
//                   { icon:"🎯", t:"Smart Matching",    bg:"#EBF5FF", border:"#BFDBFE", color:"#1E429F" },
//                   { icon:"🔐", t:"Verified Profiles", bg:"#ECFDF5", border:"#A7F3D0", color:"#065F46" },
//                   { icon:"⚡", t:"Instant Alerts",    bg:"#FFFBEB", border:"#FDE68A", color:"#92400E" },
//                   { icon:"📊", t:"Live Dashboard",    bg:"#F5F3FF", border:"#DDD6FE", color:"#4C1D95" },
//                 ].map(f => (
//                   <div key={f.t} style={{ background:f.bg, border:`1px solid ${f.border}`, borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", transition:"transform .18s, box-shadow .18s" }}
//                     onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,.08)"; }}
//                     onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
//                     <span style={{ fontSize:18 }}>{f.icon}</span>
//                     <span style={{ fontSize:12, fontWeight:700, color:f.color }}>{f.t}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ALL JOBS SECTION */}
//       <section style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB", padding:"72px 0" }}>
//         <div className="container">
//           {/* Section header */}
//           <div className="flexb" style={{ marginBottom:36, flexWrap:"wrap", gap:16 }}>
//             <div>
//               <div className="sec-eye">All Positions</div>
//               <h2 className="sec-title" style={{ marginBottom:6 }}>Browse All Teaching Jobs</h2>
//               <p style={{ color:"#6B7280", fontSize:15 }}>
//                 Live teaching positions across India — updated daily
//               </p>
//             </div>
//             <div style={{ display:"flex", gap:10, alignItems:"center" }}>
//               <span style={{ background:"#ECFDF5", color:"#059669", border:"1px solid #A7F3D0", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700 }}>🟢 Live Jobs</span>
//               <button className="btn btn-primary" onClick={() => setPage("jobs")}>View All & Filter →</button>
//             </div>
//           </div>

//           {/* Filter chips */}
//           <div style={{ display:"flex", gap:8, marginBottom:32, flexWrap:"wrap" }}>
//             {["All","Full-Time","Part-Time","Home Tuition"].map((t,i) => (
//               <span key={t} style={{ padding:"6px 16px", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer", background: i===0 ? "#1A56DB" : "#fff", color: i===0 ? "#fff" : "#374151", border: i===0 ? "none" : "1px solid #D1D5DB", boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>{t}</span>
//             ))}
//           </div>

//           {/* Jobs grid — all 9 */}
//           <div className="home-jobs-grid responsive-grid-3">
//             <div style={{textAlign:"center",padding:"32px 0",color:"#6B7280"}}><button className="btn btn-primary" onClick={()=>setPage("jobs")}>Browse All Jobs →</button></div>
//           </div>

//           {/* Bottom CTA */}
//           <div style={{ textAlign:"center", marginTop:44 }}>
//             <div style={{ background:"linear-gradient(135deg,#EBF5FF,#E0F2FE)", border:"1px solid #BFDBFE", borderRadius:16, padding:"32px 40px", display:"inline-block", maxWidth:560 }}>
//               <div style={{ fontSize:20, marginBottom:8 }}>🎓</div>
//               <h3 style={{ fontSize:20, marginBottom:8 }}>Can't find the right position?</h3>
//               <p style={{ color:"#6B7280", fontSize:14, marginBottom:20 }}>Create a free profile and let schools come to you. Over 3,200 institutes are actively hiring on AcadHr.</p>
//               <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
//                 <button className="btn btn-primary" onClick={() => setPage("signup")}>Create Free Profile</button>
//                 <button className="btn btn-outline" onClick={() => setPage("jobs")}>Browse with Filters</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FEATURED TEACHERS */}
//       <section className="section" style={{ background:"#fff", borderTop:"1px solid #E5E7EB" }}>
//         <div className="container">
//           <div style={{ textAlign:"center", marginBottom:48 }}>
//             <div className="sec-eye" style={{ justifyContent:"center" }}>Meet Our Educators</div>
//             <h2 className="sec-title">Top Teachers <em style={{ color:"#1A56DB" }}>Available to Hire</em></h2>
//             <p style={{ color:"#6B7280", fontSize:15, marginTop:10 }}>Verified, experienced educators ready to join your institution</p>
//           </div>

//           <div className="home-features-grid responsive-grid-3" style={{ gap:22 }}>
//             {[
//               { name:"Priya Sharma",   role:"Mathematics Teacher",  exp:"5 Years", city:"Hyderabad", qual:"M.Sc + B.Ed", subjects:["Algebra","Calculus","Statistics"],      emoji:"👩‍🏫", rating:4.9, avail:"Immediate", color:"#EBF5FF", accent:"#1A56DB" },
//               { name:"Ravi Kumar",     role:"Physics Teacher",       exp:"3 Years", city:"Bangalore", qual:"M.Sc + B.Ed", subjects:["Mechanics","Optics","Thermodynamics"],  emoji:"👨‍🔬", rating:4.8, avail:"2 Weeks",   color:"#ECFDF5", accent:"#059669" },
//               { name:"Ananya Singh",   role:"Chemistry Tutor",       exp:"4 Years", city:"Mumbai",    qual:"B.Sc + B.Ed", subjects:["Organic","Inorganic","Physical"],        emoji:"👩‍🔬", rating:5.0, avail:"Immediate", color:"#FFF7ED", accent:"#C2410C" },
//               { name:"Deepak Verma",   role:"English Instructor",    exp:"7 Years", city:"Delhi",     qual:"M.A. + B.Ed", subjects:["Grammar","Literature","Writing"],        emoji:"👨‍🏫", rating:4.7, avail:"1 Month",   color:"#F5F3FF", accent:"#6D28D9" },
//               { name:"Sunita Rao",     role:"Biology Teacher",       exp:"6 Years", city:"Chennai",   qual:"M.Sc + B.Ed", subjects:["Botany","Zoology","Genetics"],           emoji:"👩‍🏫", rating:4.9, avail:"Immediate", color:"#ECFDF5", accent:"#059669" },
//               { name:"Arun Mehta",     role:"Computer Science",      exp:"5 Years", city:"Pune",      qual:"B.Tech + B.Ed",subjects:["Python","Java","Data Structures"],      emoji:"👨‍💻", rating:4.8, avail:"2 Weeks",   color:"#EFF6FF", accent:"#1D4ED8" },
//             ].map((t,i) => (
//               <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:18, padding:"24px", boxShadow:"0 2px 10px rgba(0,0,0,.05)", transition:"all .22s", cursor:"pointer" }}
//                 onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(26,86,219,.12)"; e.currentTarget.style.borderColor="#BFDBFE"; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.05)"; e.currentTarget.style.borderColor="#E5E7EB"; }}>

//                 <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//                     <div style={{ width:52, height:52, borderRadius:14, background:t.color, border:`1px solid ${t.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{t.emoji}</div>
//                     <div>
//                       <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>{t.name}</div>
//                       <div style={{ fontSize:12, color:t.accent, fontWeight:600, marginTop:2 }}>{t.role}</div>
//                     </div>
//                   </div>
//                   <div style={{ background:t.color, border:`1px solid ${t.accent}40`, borderRadius:8, padding:"4px 10px" }}>
//                     <div style={{ fontSize:13, fontWeight:800, color:t.accent }}>★ {t.rating}</div>
//                   </div>
//                 </div>

//                 <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
//                   <span style={{ fontSize:11, color:"#6B7280", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 9px" }}>📍 {t.city}</span>
//                   <span style={{ fontSize:11, color:"#6B7280", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 9px" }}>🎓 {t.exp}</span>
//                   <span style={{ fontSize:11, color:"#6B7280", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6, padding:"3px 9px" }}>📜 {t.qual}</span>
//                 </div>

//                 <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
//                   {t.subjects.map(s => (
//                     <span key={s} style={{ fontSize:11, fontWeight:600, color:t.accent, background:t.color, borderRadius:20, padding:"2px 10px", border:`1px solid ${t.accent}30` }}>{s}</span>
//                   ))}
//                 </div>

//                 <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:5 }}>
//                     <span style={{ width:7, height:7, borderRadius:"50%", background: t.avail==="Immediate"?"#059669":"#D97706", display:"inline-block" }} />
//                     <span style={{ fontSize:11, color:"#6B7280", fontWeight:600 }}>{t.avail==="Immediate"?"Available Now":`Avail. in ${t.avail}`}</span>
//                   </div>
//                   <button className="btn btn-primary btn-sm" onClick={() => setPage("signup")}>View Profile</button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div style={{ textAlign:"center", marginTop:40 }}>
//             <button className="btn btn-outline btn-lg" onClick={() => setPage("signup")} style={{ fontSize:14 }}>
//               Browse All Teachers →
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* STATS */}
//       <div className="stats-strip">
//         <div className="container">
//           {/* <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
//             {[["12,400+","Active Teachers","#1A56DB"],["3,200+","Institutes Hiring","#0EA5E9"],["48,000+","Jobs Placed","#059669"],["94%","Placement Rate","#D97706"]].map(([n,l,c]) => (
//               <div key={l} className="stat-item">
//                 <div className="stat-num" style={{ color:c }}>{n}</div>
//                 <div className="stat-lbl">{l}</div>
//               </div>
//             ))}
//           </div> */}
//         </div>
//       </div>

//       {/* FOR WHOM */}
//       <section className="section" style={{ background:"#fff" }}>
//         <div className="container">
//           <div style={{ textAlign:"center", marginBottom:52 }}>
//             <div className="sec-eye" style={{ justifyContent:"center" }}>Who Is It For</div>
//             <h2 className="sec-title">Designed for Every Education Professional</h2>
//           </div>
//           <div className="grid2">
//             <div className="card" style={{ padding:42, borderTop:"4px solid #1A56DB" }}>
//               <div style={{ fontSize:48, marginBottom:18 }}>👩‍🏫</div>
//               <h2 style={{ fontSize:26, marginBottom:10 }}>Are You a Teacher?</h2>
//               <p style={{ color:"#6B7280", lineHeight:1.8, marginBottom:26, fontSize:15 }}>Build your verified profile, showcase qualifications, and apply to hundreds of teaching positions across India. Free for all educators.</p>
//               <ul style={{ listStyle:"none", marginBottom:30 }}>
//                 {["Free profile — always","Apply to unlimited jobs","Get discovered by top schools","Track all applications live"].map(f => (
//                   <li key={f} style={{ color:"#374151", padding:"7px 0", fontSize:14, borderBottom:"1px solid #F3F4F6", display:"flex", gap:10, alignItems:"center" }}>
//                     <span style={{ color:"#1A56DB", fontWeight:800, fontSize:16 }}>✓</span>{f}
//                   </li>
//                 ))}
//               </ul>
//               <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}>Join as Educator →</button>
//             </div>
//             <div className="card" style={{ padding:42, borderTop:"4px solid #0EA5E9" }}>
//               <div style={{ fontSize:48, marginBottom:18 }}>🏫</div>
//               <h2 style={{ fontSize:26, marginBottom:10 }}>Hiring for Your Institute?</h2>
//               <p style={{ color:"#6B7280", lineHeight:1.8, marginBottom:26, fontSize:15 }}>Post vacancies, review vetted applications, and find the perfect educators for your school, college, or coaching institute.</p>
//               <ul style={{ listStyle:"none", marginBottom:30 }}>
//                 {["Post unlimited vacancies","Access verified teacher profiles","Manage all applications","Moderated and trusted listings"].map(f => (
//                   <li key={f} style={{ color:"#374151", padding:"7px 0", fontSize:14, borderBottom:"1px solid #F3F4F6", display:"flex", gap:10, alignItems:"center" }}>
//                     <span style={{ color:"#0EA5E9", fontWeight:800, fontSize:16 }}>✓</span>{f}
//                   </li>
//                 ))}
//               </ul>
//               <button className="btn btn-sky btn-lg" onClick={() => setPage("signup")}>Register Institute →</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="section" style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
//         <div className="container">
//           <div style={{ textAlign:"center", marginBottom:52 }}>
//             <div className="sec-eye" style={{ justifyContent:"center" }}>Process</div>
//             <h2 className="sec-title">How <em style={{ color:"#1A56DB" }}>AcadHr</em> Works</h2>
//             <p className="sec-sub" style={{ margin:"0 auto" }}>A streamlined hiring process built for education professionals.</p>
//           </div>
//           <div className="grid2">
//             {HOW.map(h => (
//               <div key={h.who} className="card" style={{ padding:36 }}>
//                 <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:24 }}>
//                   <div style={{ width:56, height:56, borderRadius:14, background:"#EBF5FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{h.icon}</div>
//                   <div>
//                     <div style={{ fontSize:11, color:"#1A56DB", fontWeight:800, textTransform:"uppercase", letterSpacing:2 }}>Step {h.step}</div>
//                     <h3 style={{ fontSize:20, marginTop:2 }}>For {h.who}</h3>
//                   </div>
//                 </div>
//                 <ol style={{ paddingLeft:20 }}>
//                   {h.items.map((item,i) => (
//                     <li key={i} style={{ color:"#374151", padding:"8px 0", fontSize:14, borderBottom:i < h.items.length - 1 ? "1px solid #F3F4F6" : "none" }}>{item}</li>
//                   ))}
//                 </ol>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="section" style={{ background:"#fff" }}>
//         <div className="container">
//           <div style={{ textAlign:"center", marginBottom:52 }}>
//             <div className="sec-eye" style={{ justifyContent:"center" }}>Platform Features</div>
//             <h2 className="sec-title">Built for the Education Sector</h2>
//           </div>
//           <div className="grid3">
//             {FEATURES.map((f,i) => (
//               <div key={i} className="card card-hover" style={{ padding:26 }}>
//                 <div style={{ fontSize:32, marginBottom:14 }}>{f.i}</div>
//                 <h3 style={{ fontSize:16, fontWeight:700, marginBottom:10, color:"#111827" }}>{f.t}</h3>
//                 <p style={{ color:"#6B7280", lineHeight:1.8, fontSize:13 }}>{f.d}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* LATEST JOBS */}
//       <section className="section" style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB" }}>
//         <div className="container">
//           <div className="flexb" style={{ marginBottom:38 }}>
//             <div>
//               <div className="sec-eye">Latest Openings</div>
//               <h2 className="sec-title" style={{ marginBottom:0 }}>Fresh Teaching Positions</h2>
//             </div>
//             <button className="btn btn-outline" onClick={() => setPage("jobs")}>View All Positions →</button>
//           </div>
//           <div className="grid3">
//             <div style={{textAlign:'center',padding:'32px'}}><button className='btn btn-primary' onClick={()=>setPage('jobs')}>Browse All Jobs →</button></div>
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="section" style={{ background:"#fff" }}>
//         <div className="container">
//           <div style={{ textAlign:"center", marginBottom:52 }}>
//             <div className="sec-eye" style={{ justifyContent:"center" }}>Success Stories</div>
//             <h2 className="sec-title">Trusted by Educators <em style={{ color:"#1A56DB" }}>Across India</em></h2>
//           </div>
//           <div className="grid3">
//             {TESTIMONIALS.map((t,i) => (
//               <div key={i} className="card card-hover" style={{ padding:28 }}>
//                 <div style={{ color:"#D97706", fontSize:16, marginBottom:10, letterSpacing:3 }}>★★★★★</div>
//                 <p style={{ color:"#374151", lineHeight:1.85, marginBottom:22, fontStyle:"italic", fontSize:14 }}>"{t.t}"</p>
//                 <Divider />
//                 <div style={{ display:"flex", gap:14, alignItems:"center", marginTop:16 }}>
//                   <div style={{ fontSize:40 }}>{t.a}</div>
//                   <div>
//                     <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{t.n}</div>
//                     <div style={{ fontSize:12, color:"#1A56DB", fontWeight:600 }}>{t.r}</div>
//                     <div style={{ fontSize:11, color:"#9CA3AF" }}>{t.s}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="section" style={{ background:"#1E429F" }}>
//         <div className="container" style={{ textAlign:"center" }}>
//           <h2 style={{ fontSize:"clamp(28px,4vw,50px)", marginBottom:14, color:"#fff" }}>Begin Your Journey with <em style={{ color:"#93C5FD" }}>AcadHr</em></h2>
//           <p style={{ color:"#BFDBFE", fontSize:17, marginBottom:40, maxWidth:460, margin:"0 auto 40px" }}>Join 15,000+ teachers and 3,000+ institutions already on the platform.</p>
//           <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
//             <button className="btn btn-lg" style={{ background:"#fff", color:"#1E429F", fontWeight:800 }} onClick={() => setPage("signup")}>Create Free Account</button>
//             <button className="btn btn-lg" style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,.5)" }} onClick={() => setPage("jobs")}>Browse Positions</button>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="footer">
//         <div className="container">
//           <div className="flexb" style={{ flexWrap:"wrap", gap:20 }}>
//             <div>
//               <Brand size={22} />
//               <p style={{ color:"#6B7280", fontSize:13, marginTop:6 }}>India's Premier Education Hiring Platform</p>
//             </div>
//             <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
//               {["Privacy Policy","Terms of Service","Contact Us","About"].map(l => (
//                 <span key={l} style={{ fontSize:13, color:"#6B7280", cursor:"pointer" }}>{l}</span>
//               ))}
//             </div>
//           </div>
//           <Divider />
//           <p style={{ color:"#9CA3AF", fontSize:12, textAlign:"center" }}>© 2025 AcadHr. All rights reserved. Made with ❤️ in Hyderabad, India.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════
//    JOBS PAGE
// ════════════════════════════════════════════════════════════════════════════ */
// /* ═══════════════════════════════════════════════════════════════════════════
//    HOW IT WORKS PAGE
// ════════════════════════════════════════════════════════════════════════════ */

// export default HomePage;





import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

import { Navbar, HeroSchoolsCarousel, JobCard, Toast, Brand, Divider } from "../components/common/Shared";
import apiBase from "../config/apiBase";

/* Lightweight inline icon set — consistent line icons replace emoji in the hero */
function Ic({ name, size = 20, stroke = 1.7, style }) {
  const p = {
    search:   <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    pin:      <><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></>,
    cap:      <><path d="M3 9l9-4 9 4-9 4-9-4z" /><path d="M7 11.5V16c0 1 2.4 2.4 5 2.4s5-1.4 5-2.4v-4.5" /></>,
    building: <><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" /><path d="M14 21V9h4a1 1 0 0 1 1 1v11" /><path d="M3 21h18" /><path d="M7.5 8h3M7.5 12h3M7.5 16h3" /></>,
    check:    <path d="M5 12.5l4 4 10-10" />,
    target:   <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
    shield:   <><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
    bell:     <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    activity: <path d="M3 12h4l2.5-6 4 12 2.5-6H20" />,
    crown:    <><path d="M4 18.5h16" /><path d="M4 9l4 3 4-6 4 6 4-3-1.6 8.5H5.6L4 9z" /></>,
    users:    <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /><path d="M16 6.2a3 3 0 0 1 0 5.6" /><path d="M16.8 14.2c2.3.5 3.9 2.4 3.9 4.8" /></>,
    star:     <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
    down:     <path d="M6 9l6 6 6-6" />,
    arrow:    <><path d="M5 12h13" /><path d="M12.5 6l6 6-6 6" /></>,
    left:     <path d="M14.5 6l-6 6 6 6" />,
    right:    <path d="M9.5 6l6 6-6 6" />,
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {p}
    </svg>
  );
}

/* Small rotating card widget for the hero sidebar — cycles through live
   records for a category (Jobs / Teachers / Tuitions / Tutors) every few
   seconds. Purely additive: doesn't touch the existing HeroSchoolsCarousel. */
function MiniLiveCarousel({ emoji, title, items, viewAllLabel, onViewAll }) {
  const [idx, setIdx]   = useState(0);
  const [fade, setFade] = useState(false);
  const total = items.length;

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => {
      setFade(true);
      setTimeout(() => { setIdx(i => (i + 1) % total); setFade(false); }, 200);
    }, 3500);
    return () => clearInterval(t);
  }, [total]);

  if (!total) return null;
  const c = items[idx % total];

  return (
    <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:18, overflow:"hidden", boxShadow:"0 24px 56px -22px rgba(15,23,42,.22)", marginTop:16 }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A8A,#1A56DB)", padding:"15px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ display:"inline-flex", alignItems:"center", gap:10, color:"#fff", fontWeight:800, fontSize:14.5 }}>
          <span style={{ fontSize:17 }}>{emoji}</span> {title}
        </span>
        {onViewAll && (
          <span onClick={onViewAll} style={{ display:"inline-flex", alignItems:"center", gap:5, color:"#DBEAFE", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            {viewAllLabel} <Ic name="arrow" size={14} />
          </span>
        )}
      </div>

      <div style={{ padding:"20px 22px", opacity: fade ? 0 : 1, transition:"opacity .2s" }}>
        <div style={{ fontSize:16.5, fontWeight:800, color:"#0F172A", marginBottom:4 }}>{c.name}</div>
        <div style={{ fontSize:12.5, color:"#1A56DB", fontWeight:600, marginBottom:12 }}>{c.role}</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {c.city  && <span style={{ fontSize:11.5, color:"#64748B", background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:6, padding:"3px 9px" }}>📍 {c.city}</span>}
          {c.exp   && <span style={{ fontSize:11.5, color:"#64748B", background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:6, padding:"3px 9px" }}>🎓 {c.exp}</span>}
          {c.qual  && <span style={{ fontSize:11.5, color:"#64748B", background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:6, padding:"3px 9px" }}>📜 {c.qual}</span>}
        </div>

        {Array.isArray(c.details) && (
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:14, paddingTop:14, borderTop:"1px solid #F1F5F9" }}>
            {c.details.map(([label, value]) => value ? (
              <div key={label} style={{ display:"flex", gap:8, fontSize:11.5, lineHeight:1.4 }}>
                <span style={{ flexShrink:0, color:"#9CA3AF", fontWeight:700, minWidth:88 }}>{label}</span>
                <span style={{ color:"#374151", fontWeight:600, wordBreak:"break-word" }}>{value}</span>
              </div>
            ) : null)}
          </div>
        )}
      </div>

      <div style={{ padding:"0 22px 16px", display:"flex", gap:5 }}>
        {items.map((_, i) => (
          <span key={i} style={{ display:"inline-block", width:i===idx?18:6, height:6, borderRadius:3, background:i===idx?"#1A56DB":"#E2E8F0", transition:"all .3s" }} />
        ))}
      </div>
    </div>
  );
}

/* Hero illustration — school, laptop dashboard, books, pencils, plant (line art) */
function HeroArt() {
  return (
    <svg viewBox="0 0 560 430" width="100%" style={{ maxWidth:560, height:"auto", display:"block" }} role="img" aria-label="Educators connecting with schools" xmlns="http://www.w3.org/2000/svg">
      {/* soft backdrop */}
      <ellipse cx="300" cy="190" rx="240" ry="160" fill="#EFF5FF" />
      <path d="M120 120c-26 0-40 26-22 40-18 8-10 34 12 32h150c20 0 24-26 6-34 12-16-4-40-24-32-6-18-34-18-40 0-10-8-24-4-28 8-8-12-30-12-32-2 0 0 8-12 0-12z" fill="#FFFFFF" opacity=".75" />

      {/* paper plane */}
      <g stroke="#1A56DB" strokeWidth="2.2" strokeLinejoin="round" fill="none">
        <path d="M470 70l44 -16 -16 44 -12 -16 -16 -12z" fill="#DBEAFE" />
        <path d="M514 54l-28 28" />
      </g>
      {/* sparkles */}
      <g stroke="#93C5FD" strokeWidth="2.2" strokeLinecap="round">
        <path d="M150 70v10M145 75h10" />
        <path d="M430 150v8M426 154h8" />
      </g>

      {/* school building */}
      <g stroke="#1A56DB" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none">
        {/* tower */}
        <path d="M250 80l30 -26 30 26z" fill="#DBEAFE" />
        <path d="M280 36v18" /><circle cx="280" cy="34" r="3" fill="#1A56DB" />
        <rect x="262" y="80" width="36" height="40" fill="#FFFFFF" />
        <circle cx="280" cy="98" r="7" fill="#EFF5FF" />
        {/* main body */}
        <rect x="196" y="120" width="168" height="86" rx="3" fill="#FFFFFF" />
        {/* columns */}
        <path d="M214 132v62M236 132v62M324 132v62M346 132v62" stroke="#BFDBFE" strokeWidth="6" />
        {/* windows row */}
        <rect x="262" y="138" width="16" height="20" rx="2" fill="#EFF5FF" />
        <rect x="282" y="138" width="16" height="20" rx="2" fill="#EFF5FF" />
        {/* door */}
        <path d="M270 206v-26a10 10 0 0 1 20 0v26" fill="#DBEAFE" />
        {/* roof line + steps */}
        <path d="M188 120h184" strokeWidth="3" />
        <path d="M182 206h196M174 214h212" strokeWidth="3" />
      </g>

      {/* books stack */}
      <g strokeLinejoin="round" strokeWidth="2.2">
        <rect x="86" y="300" width="120" height="22" rx="4" fill="#1E3A8A" stroke="#1E3A8A" />
        <rect x="78" y="278" width="120" height="22" rx="4" fill="#1A56DB" stroke="#1A56DB" />
        <rect x="92" y="256" width="120" height="22" rx="4" fill="#93C5FD" stroke="#60A5FA" />
        <path d="M86 311h120M78 289h120M92 267h120" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="1.5" />
      </g>
      {/* pencil cup */}
      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.2">
        <path d="M118 256v-40M132 256v-46M146 256v-40" stroke="#F59E0B" />
        <path d="M118 216l-3 -8 6 0z M132 210l-3 -8 6 0z M146 216l-3 -8 6 0z" fill="#FBBF24" stroke="#F59E0B" />
        <path d="M104 232h56l-6 24h-44z" fill="#DBEAFE" stroke="#1A56DB" />
      </g>

      {/* laptop with dashboard */}
      <g strokeLinejoin="round" strokeLinecap="round">
        <rect x="240" y="214" width="180" height="120" rx="8" fill="#FFFFFF" stroke="#1A56DB" strokeWidth="2.6" />
        <rect x="252" y="226" width="156" height="96" rx="4" fill="#F4F8FF" stroke="#BFDBFE" strokeWidth="1.6" />
        {/* dashboard content */}
        <rect x="260" y="234" width="140" height="14" rx="3" fill="#1E3A8A" />
        <circle cx="270" cy="241" r="4" fill="#60A5FA" />
        <rect x="280" y="238" width="40" height="6" rx="3" fill="#93C5FD" />
        <g fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.4">
          <rect x="260" y="256" width="140" height="16" rx="3" />
          <rect x="260" y="276" width="140" height="16" rx="3" />
          <rect x="260" y="296" width="140" height="16" rx="3" />
        </g>
        <g fill="#1A56DB">
          <circle cx="270" cy="264" r="4" /><circle cx="270" cy="284" r="4" /><circle cx="270" cy="304" r="4" />
        </g>
        <g fill="#DBEAFE">
          <rect x="282" y="261" width="64" height="6" rx="3" /><rect x="282" y="281" width="74" height="6" rx="3" /><rect x="282" y="301" width="54" height="6" rx="3" />
        </g>
        <g fill="#34D399">
          <rect x="372" y="259" width="20" height="10" rx="5" opacity=".9" /><rect x="372" y="279" width="20" height="10" rx="5" opacity=".9" /><rect x="372" y="299" width="20" height="10" rx="5" opacity=".9" />
        </g>
        {/* base */}
        <path d="M224 334h212l-12 12H236z" fill="#DBEAFE" stroke="#1A56DB" strokeWidth="2.6" />
      </g>

      {/* potted plant */}
      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.2" fill="none">
        <path d="M470 300c-4 -20 6 -34 22 -38" stroke="#16A34A" />
        <path d="M486 300c2 -18 -4 -32 -16 -40" stroke="#16A34A" />
        <path d="M492 262c10 -4 20 0 24 10 -12 4 -22 0 -24 -10z" fill="#86EFAC" stroke="#16A34A" />
        <path d="M470 252c-10 -6 -12 -18 -6 -28 10 6 12 18 6 28z" fill="#86EFAC" stroke="#16A34A" />
        <path d="M488 254c0 -14 8 -24 20 -26 0 14 -8 24 -20 26z" fill="#4ADE80" stroke="#16A34A" />
        <path d="M462 300h54l-8 36h-38z" fill="#FFFFFF" stroke="#1A56DB" strokeWidth="2.6" />
        <path d="M462 310h54" stroke="#BFDBFE" />
      </g>
    </svg>
  );
}

/* Countries marquee — "Countries we are Providing tuition" */
const TUITION_COUNTRIES = [
  { name: "India",         code: "in" },
  { name: "Qatar",         code: "qa" },
  { name: "Kuwait",        code: "kw" },
  { name: "Bahrain",       code: "bh" },
  { name: "UAE",           code: "ae" },
  { name: "Saudi Arabia",  code: "sa" },
  { name: "Oman",          code: "om" },
  { name: "UK",            code: "gb" },
  { name: "USA",           code: "us" },
  { name: "Australia",     code: "au" },
];

function CountriesMarquee() {
  // Duplicate the list 4x so the track stays wider than the viewport on large
  // screens (avoids empty space on the right before the loop repeats).
  const loopCountries = [...TUITION_COUNTRIES, ...TUITION_COUNTRIES, ...TUITION_COUNTRIES, ...TUITION_COUNTRIES];
  return (
    <section style={{ background: "#fff", padding: "56px 0" }}>
      <div className="container" style={{ textAlign: "center", marginBottom: 34 }}>
        <h2 className="sec-title" style={{ marginBottom: 10 }}>
          Countries we are <em style={{ fontStyle: "italic", color: "#1A56DB" }}>Providing tuition</em>
        </h2>
        <p style={{ color: "#6B7280", fontSize: 15 }}>
          Our programs support CBSE and State Syllabus students in India and the GCC.
        </p>
      </div>
      <div className="countries-marquee-viewport">
        <div className="countries-marquee-track">
          {loopCountries.map((c, i) => (
            <div className="country-flag-item" key={`${c.code}-${i}`}>
              <span className="country-flag-badge">
                <img src={`https://flagcdn.com/w160/${c.code}.png`} alt={`${c.name} flag`} loading="lazy" />
              </span>
              <span className="country-flag-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Subjects coverflow — "All Subjects · All State Boards" (autoplays every 5s) */
const SUBJECTS_COVERED = [
  { name: "Mathematics",               icon: "📐", tag: "CBSE · ICSE · All State Boards" },
  { name: "Science",                   icon: "🔬", tag: "CBSE · ICSE · All State Boards" },
  { name: "Physics",                   icon: "⚛️", tag: "CBSE · ICSE · All State Boards" },
  { name: "Chemistry",                 icon: "🧪", tag: "CBSE · ICSE · All State Boards" },
  { name: "Biology",                   icon: "🧬", tag: "CBSE · ICSE · All State Boards" },
  { name: "English",                   icon: "📖", tag: "CBSE · ICSE · All State Boards" },
  { name: "Social Studies",            icon: "🌍", tag: "CBSE · ICSE · All State Boards" },
  { name: "Computer Science",          icon: "💻", tag: "CBSE · ICSE · All State Boards" },
  { name: "Accountancy",               icon: "💰", tag: "CBSE · ICSE · All State Boards" },
  { name: "Economics",                 icon: "📈", tag: "CBSE · ICSE · All State Boards" },
  { name: "Hindi & Regional Languages",icon: "🗣️", tag: "CBSE · ICSE · All State Boards" },
];

function SubjectsCoverflow() {
  const [active, setActive] = useState(0);
  const n = SUBJECTS_COVERED.length;

  // Auto-advance every 5 seconds; pauses while the user hovers the stage.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive(a => (a + 1) % n);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  const goto = (i) => setActive(((i % n) + n) % n);
  const prev = () => goto(active - 1);
  const next = () => goto(active + 1);

  return (
    <section style={{ background: "#F9FBFF", padding: "64px 0 56px", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1A56DB", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
          What We Teach
        </div>
        <h2 className="sec-title" style={{ color: "#0F172A", marginBottom: 10 }}>
          All Subjects <em style={{ fontStyle: "italic", color: "#1A56DB" }}>All State Boards</em>
        </h2>
        <p style={{ color: "#6B7280", fontSize: 15 }}>
          From core subjects to languages — covering CBSE, ICSE and every State Board curriculum.
        </p>
      </div>

      <div className="subjects-coverflow-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <button type="button" className="coverflow-arrow coverflow-arrow-left" onClick={prev} aria-label="Previous subject">‹</button>

        <div className="subjects-coverflow-stage">
          {SUBJECTS_COVERED.map((s, i) => {
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            if (Math.abs(offset) > 3) return null; // only render nearby cards for performance
            const abs = Math.abs(offset);
            const translate = offset * 150;
            const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.66;
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.25;
            return (
              <div
                key={s.name}
                className="subject-coverflow-card"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translate}px) scale(${scale})`,
                  opacity,
                  zIndex: 10 - abs,
                  filter: abs === 0 ? "none" : "grayscale(55%)",
                }}
              >
                <span className="subject-coverflow-icon">{s.icon}</span>
              </div>
            );
          })}
        </div>

        <button type="button" className="coverflow-arrow coverflow-arrow-right" onClick={next} aria-label="Next subject">›</button>
      </div>

      <div style={{ textAlign: "center", marginTop: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "inline-block", width: 34, height: 1.5, background: "#1A56DB" }} />
          <h3 style={{ color: "#0F172A", fontWeight: 800, fontSize: 20, margin: 0 }}>{SUBJECTS_COVERED[active].name}</h3>
          <span style={{ display: "inline-block", width: 34, height: 1.5, background: "#1A56DB" }} />
        </div>
        <div style={{ color: "#6B7280", fontSize: 12.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 6 }}>
          {SUBJECTS_COVERED[active].tag}
        </div>
      </div>

      <div className="subjects-coverflow-dots">
        {SUBJECTS_COVERED.map((s, i) => (
          <button
            key={s.name}
            type="button"
            className={`coverflow-dot${i === active ? " coverflow-dot-active" : ""}`}
            onClick={() => goto(i)}
            aria-label={`Go to ${s.name}`}
          />
        ))}
      </div>
    </section>
  );
}

function HomePage({ setPage }) {
  const { user } = useAuth();
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Hero poster carousel — cycles through your actual files in frontend/public:
  // "teachers image.png", "tutors image.png", "parents image.png"
  const heroPosters = [
    { src: "/teachers image.png", alt: "AcadHr for Teachers" },
    { src: "/tutors image.png",   alt: "AcadHr for Tutors" },
    { src: "/parents image.png",  alt: "AcadHr for Parents" },
  ];
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPosterMissing, setHeroPosterMissing] = useState({}); // { "/teachers image.png": true } once an image fails to load
  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % heroPosters.length), 5000);
    return () => clearInterval(t);
  }, []);
  const goToHeroSlide = (i) => setHeroSlide(((i % heroPosters.length) + heroPosters.length) % heroPosters.length);

  // Tuition requirements posted by parents (public, fetched from DB)
  const [homeTuitions, setHomeTuitions] = useState([]);
  useEffect(() => {
    fetch(`${apiBase()}/admin/public/tuitions`)
      .then(r => (r.ok ? r.json() : []))
      .then(data => setHomeTuitions(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setHomeTuitions([]));
  }, []);

  // Live profiles for the community section (fetched from DB; falls back to samples if a category is empty)
  const [liveTeachers, setLiveTeachers] = useState([]);
  const [liveTutors,   setLiveTutors]   = useState([]);
  const [liveSchools,  setLiveSchools]  = useState([]);
  const [liveParents,  setLiveParents]  = useState([]);
  const [liveJobs,     setLiveJobs]     = useState([]);
  // ── Homepage lists ONLY teachers whose profile is filled out fully ──────────
  // A teacher qualifies when their name plus every key profile field the card
  // shows is present. Teachers with partial/empty profiles are skipped so the
  // "Teachers Available to Hire" row shows complete profiles only. This is
  // purely additive — every other category and the sample-data fallback below
  // are untouched. (To use a looser bar instead, swap the check for
  // Number(r.completion_pct) >= 70.)
  const TEACHER_KEY_FIELDS = [
    "specialization", "qualification", "total_experience",
    "subjects", "current_location", "grades_handling", "boards_handled",
    "languages", "work_mode",
  ];
  const isTeacherProfileFull = (r) => {
    if (!r) return false;
    const has = (f) => {
      const v = r[f];
      return v !== undefined && v !== null && String(v).trim() !== "";
    };
    const nameOk = has("name") || has("full_name");
    return nameOk && TEACHER_KEY_FIELDS.every(has);
  };
  useEffect(() => {
    const j = (p) => fetch(`${apiBase()}${p}`)
      .then(r => (r.ok ? r.json() : []))
      .then(d => (Array.isArray(d) ? d : []))
      .catch(() => []);
    j("/admin/public/teachers").then(rows => setLiveTeachers(rows.filter(isTeacherProfileFull)));
    j("/admin/public/tutors").then(setLiveTutors);
    j("/admin/public/schools").then(setLiveSchools);
    j("/admin/public/parents").then(setLiveParents);
    j("/jobs").then(setLiveJobs);
  }, []);
  const isMobile = vw <= 640;
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

  const GROUPS = [
    {
      key:"schools", label:"Jobs Hiring Now", icon:"💼",
      cards:[
        { name:"Mathematics Teacher", role:"Delhi Public School · Hyderabad", city:"Hyderabad", exp:"Full-Time",    qual:"CBSE Board",  subjects:["Maths","Science","English"],   emoji:"💼", rating:null, statusText:"Hiring Now",        statusDot:"#059669", color:"#EBF5FF", accent:"#1A56DB" },
        { name:"English Teacher",     role:"St. Mary's School · Chennai",   city:"Chennai",   exp:"Part-Time",  qual:"ICSE Board",  subjects:["Hindi","EVS","Art"],           emoji:"💼", rating:null, statusText:"Hiring in 2 Weeks", statusDot:"#D97706", color:"#ECFDF5", accent:"#059669" },
        { name:"Physics Teacher",     role:"Sunrise Academy · Pune",        city:"Pune",      exp:"Full-Time",  qual:"State Board", subjects:["Physics","Commerce","CS"],     emoji:"💼", rating:null, statusText:"Hiring Now",        statusDot:"#059669", color:"#FFF7ED", accent:"#C2410C" },
      ],
    },
    {
      key:"teachers", label:"Teachers Available to Hire", icon:"👩‍🏫",
      cards:[
        { name:"Priya Sharma", role:"Mathematics Teacher", city:"Hyderabad", exp:"5 Years", qual:"M.Sc + B.Ed", subjects:["Algebra","Calculus","Statistics"],     emoji:"👩‍🏫", rating:4.9, statusText:"Available Now",     statusDot:"#059669", color:"#EBF5FF", accent:"#1A56DB" },
        { name:"Ravi Kumar",   role:"Physics Teacher",       city:"Bangalore", exp:"3 Years", qual:"M.Sc + B.Ed", subjects:["Mechanics","Optics","Thermodynamics"], emoji:"👨‍🔬", rating:4.8, statusText:"Avail. in 2 Weeks", statusDot:"#D97706", color:"#ECFDF5", accent:"#059669" },
        { name:"Ananya Singh", role:"Chemistry Teacher",     city:"Mumbai",    exp:"4 Years", qual:"B.Sc + B.Ed", subjects:["Organic","Inorganic","Physical"],      emoji:"👩‍🔬", rating:5.0, statusText:"Available Now",     statusDot:"#059669", color:"#FFF7ED", accent:"#C2410C" },
      ],
    },
    {
      key:"parents", label:"Parents Seeking Tutors", icon:"👪",
      cards:[
        { name:"Meena Iyer",  role:"Parent · Seeking Tutor", city:"Hyderabad", exp:"Class 10", qual:"Home Tuition",  subjects:["Maths","Science"],     emoji:"👩", rating:null, statusText:"Looking Now",        statusDot:"#059669", color:"#FDF2F8", accent:"#DB2777" },
        { name:"Rahul Nair",  role:"Parent · Seeking Tutor", city:"Bangalore", exp:"Class 7",  qual:"Online",        subjects:["English","Hindi"],     emoji:"👨", rating:null, statusText:"Looking Now",        statusDot:"#059669", color:"#EFF6FF", accent:"#1D4ED8" },
        { name:"Fatima Khan", role:"Parent · Seeking Tutor", city:"Chennai",   exp:"Class 12", qual:"Home / Online", subjects:["Physics","Chemistry"], emoji:"🧕", rating:null, statusText:"Looking This Week",  statusDot:"#D97706", color:"#F0FDFA", accent:"#0E7490" },
      ],
    },
    {
      key:"tutors", label:"Tutors Ready to Teach", icon:"📚",
      cards:[
        { name:"Vikram Joshi", role:"Maths Tutor",   city:"Pune",      exp:"6 Years", qual:"Online + Home", subjects:["Algebra","Trigonometry"],  emoji:"👨‍🏫", rating:4.9, statusText:"Available Now",    statusDot:"#059669", color:"#ECFDF5", accent:"#059669" },
        { name:"Sneha Reddy",  role:"English Tutor", city:"Hyderabad", exp:"4 Years", qual:"Online",        subjects:["Spoken","Grammar","IELTS"], emoji:"👩‍🏫", rating:4.8, statusText:"Available Now",    statusDot:"#059669", color:"#EBF5FF", accent:"#1A56DB" },
        { name:"Arjun Das",    role:"CS Tutor",      city:"Bangalore", exp:"5 Years", qual:"Home Tuition",  subjects:["Python","Web Dev"],         emoji:"👨‍💻", rating:5.0, statusText:"Avail. in 1 Week", statusDot:"#D97706", color:"#F5F3FF", accent:"#6D28D9" },
      ],
    },
  ];

  // Map real DB records into the same card shape this section renders (samples used as fallback)
  const _subs = (v) => Array.isArray(v)
    ? v.filter(Boolean).slice(0, 3)
    : (typeof v === "string" && v.trim() ? v.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3) : []);
  const _pal = [
    { color:"#EBF5FF", accent:"#1A56DB" }, { color:"#ECFDF5", accent:"#059669" },
    { color:"#FFF7ED", accent:"#C2410C" }, { color:"#F5F3FF", accent:"#6D28D9" },
    { color:"#EFF6FF", accent:"#1D4ED8" }, { color:"#FDF2F8", accent:"#DB2777" },
  ];
  const _pick = (i) => _pal[i % _pal.length];

  const liveCardsFor = (key) => {
    if (key === "schools") return liveJobs.map((r, i) => ({
      name: r.title || "Teaching Job",
      role: `${r.institution_name || "School"}${r.location_city ? ` · ${r.location_city}` : ""}`,
      city: r.location_city || r.location_state || "",
      exp: r.job_type || r.work_mode || "Full-Time",
      qual: r.subject || "\u2014",
      details: [
        ["Institution", r.institution_name],
        ["Subject", r.subject],
        ["Job Type", r.job_type],
        ["Work Mode", r.work_mode],
        ["Location", r.location_city || r.location_state],
        ["Salary", r.salary_range || r.salary],
      ],
      subjects: _subs(r.subject), emoji:"💼", rating:null,
      statusText: "Hiring Now",
      statusDot: "#059669",
      ..._pick(i),
    }));
    if (key === "teachers") return liveTeachers.map((r, i) => ({
      raw: r, // full DB record kept alongside the mapped shape so the browse-style card can read every field
      name: r.name || r.full_name || "Teacher",
      role: r.specialization || r.current_role || "Teacher",
      city: r.current_location || r.city || "",
      exp: r.total_experience || "\u2014",
      qual: r.qualification || "\u2014",
      details: [
        ["Specialization", r.specialization],
        ["Subjects", r.subjects],
        ["Experience", r.total_experience || r.experience],
        ["Teaching Mode", r.teaching_mode],
        ["Languages", r.languages],
        ["Grades", r.grades_handling],
        ["Boards", r.boards_handled],
        ["Location", r.current_location || r.city],
      ],
      subjects: _subs(r.subjects || r.specialization), emoji:"👩‍🏫", rating:null,
      statusText:"Available Now", statusDot:"#059669",
      ..._pick(i),
    }));
    if (key === "parents") return liveParents.map((r, i) => ({
      name: r.name || "Parent",
      role: "Parent · Seeking Tutor",
      city: r.location || r.city || "",
      exp: r.student_class ? `Class ${r.student_class}` : (r.board || "\u2014"),
      qual: r.mode || r.board || "Tuition",
      details: [
        ["Student", r.student_name],
        ["Class", r.student_class],
        ["Board", r.board],
        ["Subject", r.subject || r.courses],
        ["Mode", r.mode],
        ["Preferred Time", r.preferred_time],
        ["Location", r.location || r.city],
        ["Budget", r.budget || r.hourly_budget],
      ],
      subjects: _subs(r.subject || r.courses), emoji:"👪", rating:null,
      statusText:"Looking Now", statusDot:"#059669",
      ..._pick(i),
    }));
    if (key === "tutors") return liveTutors.map((r, i) => {
      const subj = (r.subject || r.subjects || "").toString();
      const first = (subj.split(",")[0] || "").trim();
      return {
        name: r.name || "Tutor",
        role: first ? `${first} Tutor` : "Tutor",
        city: r.location || r.city || "",
        exp: r.experience || "\u2014",
        qual: r.qualification || r.qualifications || "\u2014",
        details: [
          ["Subjects", r.subjects || r.subject],
          ["Qualifications", r.qualifications || r.qualification],
          ["Experience", r.experience],
          ["Teaching Mode", r.teaching_mode],
          ["Availability", r.availability],
          ["Gender", r.gender],
          ["Location", r.location || r.city],
          ["Pincode", r.pincode],
          ["Address", r.address],
          ["Class Link", r.class_link],
        ],
        subjects: _subs(r.subjects || r.subject), emoji:"📚", rating:null,
        statusText:"Available Now", statusDot:"#059669",
        ..._pick(i),
      };
    });
    return [];
  };
  const GROUPS_LIVE = GROUPS.map(g => {
    const live = liveCardsFor(g.key);
    return live.length ? { ...g, cards: live } : g;
  });

  // Refs + scroll handler for the arrow-controlled rows below.
  const communityScrollRefs = useRef([]);
  const scrollCommunityRow = (gi, dir) => {
    const el = communityScrollRefs.current[gi];
    if (el) el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };
  // Only show the arrows when a row actually has enough cards to overflow —
  // avoids a big empty gap before the arrow when there are just 2-3 cards.
  const [rowOverflow, setRowOverflow] = useState([]);
  useEffect(() => {
    const check = () => {
      setRowOverflow(communityScrollRefs.current.map(el => !!el && el.scrollWidth > el.clientWidth + 4));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [liveTeachers, liveTutors, liveSchools, liveParents, liveJobs]);

  // Renders a single teacher card in the SAME structure/style as the Browse Teachers page
  // (photo avatar + tag chips + Preferred Location/Subjects/Languages/Grades/Boards details + full-width button).
  // Used only for the "Teachers Available to Hire" row so it visually matches Browse Teachers.
  // renderCommunityCard below is left fully intact and still used by every other group.
  const renderBrowseTeacherCard = (t, i, group) => {
    const r = t.raw || {}; // live DB record (present for live teachers); falls back to card fields for sample data
    const capList = (value, n) => {
      if (value === undefined || value === null || String(value).trim() === "") return "\u2014";
      const parts = String(value).split(",").map(x => x.trim()).filter(Boolean);
      if (!n || n <= 0 || parts.length <= n) return parts.join(", ");
      return parts.slice(0, n).join(", ") + "\u2026";
    };
    const photo       = r.profile_photo;
    const displayName = t.name || r.name || r.full_name || "Teacher";
    const displayRole = r.specialization || r.current_role || (t.role && t.role !== "Teacher" ? t.role : "Educator");
    const city        = t.city || r.current_location || r.city || "";
    const exp         = r.total_experience || r.experience || (t.exp && t.exp !== "\u2014" ? t.exp : "");
    const qual        = r.qualification || (t.qual && t.qual !== "\u2014" ? t.qual : "");
    const mode        = r.work_mode || r.teaching_mode || "";
    const goProfile   = () => { if (!user) { setPage("login"); return; } setPage("teachers"); };
    return (
      <div key={i}
        style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:24, transition:"all .2s", cursor:"default", height:"100%", display:"flex", flexDirection:"column", boxSizing:"border-box" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(26,86,219,.12)"; e.currentTarget.style.borderColor="#93C5FD"; e.currentTarget.style.transform="translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.transform="none"; }}>

        {/* Photo + Name */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
          <div style={{ width:54, height:54, borderRadius:"50%", overflow:"hidden", background:"#EBF5FF", border:"2px solid #BFDBFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
            {photo
              ? <img src={(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","") + photo} alt={displayName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>{displayName}</div>
            <div style={{ fontSize:12, color:"#1A56DB", fontWeight:600, marginTop:2 }}>{displayRole}</div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
          {city && <span style={{ background:"#F3F4F6", color:"#374151", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>📍 {city}</span>}
          {exp  && <span style={{ background:"#EBF5FF", color:"#1A56DB", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>⏳ {exp}</span>}
          {qual && <span style={{ background:"#F5F3FF", color:"#6D28D9", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>🎓 {qual}</span>}
          {mode && <span style={{ background:"#ECFDF5", color:"#059669", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{mode}</span>}
        </div>

        {/* Details */}
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
          {[
            ["Preferred Location", r.preferred_locations, 3],
            ["Subjects",           r.subjects || r.specialization, 3],
            ["Languages",          r.languages, 0],
            ["Grades",             r.grades_handling, 3],
            ["Boards",             r.boards_handled, 3],
          ].map(([label, value, cap]) => (
            <div key={label} style={{ display:"flex", gap:8, fontSize:12, lineHeight:1.4 }}>
              <span style={{ flexShrink:0, color:"#9CA3AF", fontWeight:700, minWidth:96 }}>{label}</span>
              <span style={{ color:"#374151", fontWeight:600, wordBreak:"break-word" }}>{capList(value, cap)}</span>
            </div>
          ))}
        </div>

        <button
          style={{ width:"100%", padding:"9px 0", borderRadius:10, border:"1.5px solid #BFDBFE", background:"#EBF5FF", color:"#1A56DB", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .15s", marginTop:"auto" }}
          onClick={goProfile}
          onMouseEnter={e => { e.currentTarget.style.background="#1A56DB"; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#EBF5FF"; e.currentTarget.style.color="#1A56DB"; }}>
          {user ? "View Profile →" : "Contact Teacher →"}
        </button>
      </div>
    );
  };

  // Renders a single community card — used by both the normal grid layout
  // and the Jobs marquee below. Content/markup is unchanged from before.
  const renderCommunityCard = (t, i, group) => (
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
        {t.rating != null && (
          <div style={{ background:t.color, border:`1px solid ${t.accent}40`, borderRadius:8, padding:"4px 10px" }}>
            <div style={{ fontSize:13, fontWeight:800, color:t.accent }}>★ {t.rating}</div>
          </div>
        )}
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

      {Array.isArray(t.details) && (
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
          {t.details.map(([label, value]) => value ? (
            <div key={label} style={{ display:"flex", gap:8, fontSize:12, lineHeight:1.4 }}>
              <span style={{ flexShrink:0, color:"#9CA3AF", fontWeight:700, minWidth:96 }}>{label}</span>
              <span style={{ color:"#374151", fontWeight:600, wordBreak:"break-word" }}>{value}</span>
            </div>
          ) : null)}
        </div>
      )}

      <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background: t.statusDot || (t.avail==="Immediate"?"#059669":"#D97706"), display:"inline-block" }} />
          <span style={{ fontSize:11, color:"#6B7280", fontWeight:600 }}>{t.statusText || (t.avail==="Immediate"?"Available Now":`Avail. in ${t.avail}`)}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { if (!user) { setPage("login"); return; } setPage(group.key === "teachers" ? "teachers" : group.key === "tutors" ? "tutors" : group.key === "parents" ? "tuitions" : "jobs"); }}>View Profile</button>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <Navbar setPage={setPage} page="home" />
      {/* ── HERO (original — kept in code, not rendered; replaced below by the poster carousel) ── */}
      {false && (
      <section className="hero-section" style={{ display:"flex", flexDirection:"column", background:"#fff", position:"relative", overflow:"hidden", minHeight:"auto" }}>

        {/* Background wash */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#FBFCFE 0%,#FFFFFF 60%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:680, height:680, borderRadius:"50%", background:"radial-gradient(circle,rgba(26,86,219,.06),transparent 62%)", top:-260, left:"38%", pointerEvents:"none" }} />

        <div className="hero-inner" style={{ position:"relative", zIndex:1, flex:1, display:"flex", alignItems:"flex-start", paddingTop:12, paddingBottom:48, paddingLeft:isMobile?16:isTablet?24:60, paddingRight:isMobile?16:isTablet?24:60, width:"100%", boxSizing:"border-box" }}>
          <div style={{ display:"flex", flexDirection:"column", width:"100%" }}>
          <div className="hero-grid hero-wide" style={{ alignItems:"start" }}>

            {/* ── LEFT: Copy + illustration ── */}
            <div className="fadeUp">

              {/* Headline + illustration */}
              <div style={{ display:"grid", gridTemplateColumns: isTablet ? "1fr" : "minmax(0,0.82fr) minmax(0,1fr)", gap: isTablet?12:26, alignItems: isTablet?"center":"start", marginBottom: isMobile?28:30 }}>
                {/* Copy */}
                <div>
                  {/* Eyebrow */}
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #E2E8F0", borderRadius:30, padding:"7px 15px", marginBottom:22, boxShadow:"0 1px 2px rgba(15,23,42,.05)" }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:"#059669", display:"inline-block" }} />
                    <span style={{ fontSize:12, fontWeight:800, color:"#334155", letterSpacing:.3 }}>LIVE · Top Schools Are Hiring Now</span>
                  </div>

                  {/* Headline with quotes */}
                  <div style={{ position:"relative" }}>
                    <span aria-hidden="true" style={{ position:"absolute", top:-32, left:-4, fontFamily:"Playfair Display,serif", fontSize:62, lineHeight:1, color:"#1A56DB", fontWeight:800 }}>&ldquo;</span>
                    <h1 style={{ fontFamily:"Nunito,sans-serif", fontSize:"clamp(60px,2.9vw,40px)", fontWeight:800, lineHeight:1.18, letterSpacing:"-0.015em", color:"#0F172A", margin:0, paddingTop:8 }}>
                      Great teachers<br />
                      <span style={{ fontFamily:"Playfair Display,serif", color:"#1A56DB", fontStyle:"italic", fontWeight:700 }}>change lives.</span><br />
                      We help schools<br />
                      find them.<span aria-hidden="true" style={{ fontFamily:"Playfair Display,serif", color:"#1A56DB", fontWeight:800, fontSize:"1.2em", verticalAlign:"-0.15em", marginLeft:2 }}>&rdquo;</span>
                    </h1>
                  </div>
                  <div style={{ marginTop:18 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#64748B" }}>&mdash; Every Student, Every Day</span>
                    <div style={{ width:54, height:2, background:"#1A56DB", borderRadius:2, marginTop:8 }} />
                  </div>
                </div>

                {/* Illustration */}
                <div style={{ order: isTablet ? 2 : 0, justifySelf:"center", width:"100%" }}>
                  <HeroArt />
                </div>
              </div>

              {/* Search */}
              <div className="hero-search-row" style={{ maxWidth:420 }}>
                <div className="hero-search-input-wrap">
                  <span className="hero-search-icon" aria-hidden="true"><Ic name="search" size={18} /></span>
                  <input
                    className="hero-search-input"
                    placeholder="Search by subject, skill or school name…"
                    onKeyDown={e => e.key==="Enter" && setPage("jobs")}
                  />
                </div>
                <button type="button" className="btn btn-primary hero-search-btn" onClick={() => setPage("jobs")}>
                  Search
                </button>
              </div>

              {/* Subject chips + More */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28 }}>
                {["Mathematics","Physics","English","Chemistry","Biology"].map(s => (
                  <span key={s} onClick={() => setPage("jobs")} style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 13px", borderRadius:20, fontSize:12.5, fontWeight:700, cursor:"pointer", background:"#fff", color:"#475569", border:"1px solid #E2E8F0", transition:"all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#1A56DB"; e.currentTarget.style.color="#1A56DB"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.color="#475569"; }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#1A56DB", display:"inline-block" }} />
                    {s}
                  </span>
                ))}
                <span onClick={() => setPage("jobs")} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:20, fontSize:12.5, fontWeight:700, cursor:"pointer", background:"#F8FAFC", color:"#334155", border:"1px solid #E2E8F0" }}>
                  More <Ic name="down" size={14} />
                </span>
              </div>

              {/* CTAs */}
              <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:30 }}>
                <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")} style={{ fontSize:15 }}>
                  Get Started Free <Ic name="arrow" size={17} style={{ marginLeft:2 }} />
                </button>
                <button onClick={() => setPage("jobs")} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #CBD5E1", color:"#334155", borderRadius:10, padding:"13px 24px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"all .18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#1A56DB"; e.currentTarget.style.color="#1A56DB"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#CBD5E1"; e.currentTarget.style.color="#334155"; }}>
                  <Ic name="building" size={16} /> Browse Jobs
                </button>
              </div>

              {/* Trust row — initials avatars */}
              <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center" }}>
                  {[["AS","#1A56DB"],["RK","#0EA5E9"],["PM","#7C3AED"],["SN","#059669"]].map(([ini,bg],i) => (
                    <span key={ini} style={{ width:34, height:34, borderRadius:"50%", background:bg, color:"#fff", border:"2px solid #fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11.5, fontWeight:800, marginLeft: i===0?0:-10, zIndex:10-i }}>{ini}</span>
                  ))}
                  <span style={{ width:34, height:34, borderRadius:"50%", background:"#F59E0B", color:"#fff", border:"2px solid #fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, marginLeft:-10, zIndex:5 }}>+2k</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"#475569" }}>Find your next teaching opportunity with AcadHR.</span>
              </div>

              {/* Tutors — kept in code, not rendered here anymore (now shown in the
                  right-side grid's second row instead, alongside Teachers/Tuitions) */}
              {false && (
                <div style={{ marginTop:24 }}>
                  <MiniLiveCarousel
                    emoji="📚" title="Tutors Ready to Teach"
                    items={liveCardsFor("tutors")}
                    viewAllLabel="View All Tutors" onViewAll={() => setPage("tutors")}
                  />
                </div>
              )}
            </div>

            {/* ── RIGHT: Schools card + features ── */}
            <div className="fadeUp" style={{ animationDelay:".15s" }}>
              {/* Schools card — kept in code, not rendered (replaced below with the
                  same rotating-widget style used for Jobs/Teachers/Tuitions/Tutors) */}
              {false && (
                <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:18, overflow:"hidden", boxShadow:"0 24px 56px -22px rgba(15,23,42,.22)" }}>
                  {/* Topbar */}
                  <div style={{ background:"linear-gradient(135deg,#1E3A8A,#1A56DB)", padding:"15px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:10, color:"#fff", fontWeight:800, fontSize:14.5 }}>
                      <Ic name="crown" size={18} style={{ color:"#FBBF24" }} /> Top Hiring Schools
                    </span>
                    <span onClick={() => setPage("institutes")} style={{ display:"inline-flex", alignItems:"center", gap:5, color:"#DBEAFE", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      View All Schools <Ic name="arrow" size={14} />
                    </span>
                  </div>

                  {/* Carousel */}
                  <HeroSchoolsCarousel setPage={setPage} />
                </div>
              )}

              {/* Row 1 — 2 cards */}
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
                <MiniLiveCarousel
                  emoji="🏫" title="Top Hiring Schools"
                  items={liveSchools.map(r => ({
                    name: r.institute_name || r.name || "School",
                    role: r.institute_type ? `${r.institute_type} · School` : "School",
                    city: r.city || "",
                    exp: `${r.live_jobs || 0} Openings`,
                    qual: r.est_year ? `Est. ${r.est_year}` : "Institute",
                    details: [
                      ["Type", r.institute_type],
                      ["City", r.city],
                      ["Openings", `${r.live_jobs || 0}`],
                      ["Established", r.est_year],
                      ["Students", r.student_count],
                      ["Website", r.website],
                    ],
                  }))}
                  viewAllLabel="View All Schools" onViewAll={() => setPage("institutes")}
                />

                <MiniLiveCarousel
                  emoji="💼" title="Jobs Hiring Now"
                  items={liveCardsFor("schools")}
                  viewAllLabel="View All Jobs" onViewAll={() => setPage("jobs")}
                />
              </div>

              {/* Row 2 — 3 cards */}
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap:16, marginTop:16 }}>
                <MiniLiveCarousel
                  emoji="👩‍🏫" title="Teachers Available"
                  items={liveCardsFor("teachers")}
                  viewAllLabel="View All Teachers" onViewAll={() => setPage("teachers")}
                />
                <MiniLiveCarousel
                  emoji="👪" title="Tuitions Requested"
                  items={liveCardsFor("parents")}
                  viewAllLabel="View All Tuitions" onViewAll={() => setPage("tuitions")}
                />
                <MiniLiveCarousel
                  emoji="📚" title="Tutors Ready to Teach"
                  items={liveCardsFor("tutors")}
                  viewAllLabel="View All Tutors" onViewAll={() => setPage("tutors")}
                />
              </div>

            </div>

          </div>

          {/* Feature cards — single row, full page width */}
          <div className="home-pills-grid" style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr", gap:14, marginTop:24, width:"100%" }}>
            {[
              { icon:"target",   t:"Smart Matching",    d:"AI matches you with the best teaching jobs.",                bg:"#EFF5FF", bd:"#DBEAFE", c:"#1E429F" },
              { icon:"shield",   t:"Verified Profiles", d:"100% verified schools and institutions.",                   bg:"#ECFDF5", bd:"#A7F3D0", c:"#065F46" },
              { icon:"bell",     t:"Instant Alerts",    d:"Get notified instantly about new job openings.",            bg:"#FFFBEB", bd:"#FDE68A", c:"#92400E" },
              { icon:"activity", t:"Live Dashboard",    d:"Track applications, responses and job updates in real-time.", bg:"#F5F3FF", bd:"#DDD6FE", c:"#5B21B6" },
            ].map(f => (
              <div key={f.t} style={{ background:f.bg, border:`1px solid ${f.bd}`, borderRadius:14, padding:"16px 16px", transition:"transform .18s, box-shadow .18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 24px -14px rgba(15,23,42,.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:9, background:"#fff", border:`1px solid ${f.bd}`, color:f.c, marginBottom:10 }}>
                  <Ic name={f.icon} size={18} />
                </span>
                <div style={{ fontSize:13.5, fontWeight:800, color:f.c, marginBottom:4 }}>{f.t}</div>
                <div style={{ fontSize:12, color:"#64748B", lineHeight:1.5 }}>{f.d}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>
      )}

      {/* ── HERO: poster carousel (teacher / tuition / parent) ──────────────── */}
      <section
        className="hero-poster-carousel"
        style={{ position:"relative", width:"100%", overflow:"hidden", background:"#fff", paddingTop: 90 }}
      >
        <div style={{ position:"relative", width:"100%", paddingTop: isMobile ? "46%" : "36%" }}>
          {heroPosters.map((p, i) => (
            heroPosterMissing[p.src] ? (
              <div
                key={p.src}
                style={{
                  position:"absolute", inset:0, display: i === heroSlide ? "flex" : "none",
                  flexDirection:"column", alignItems:"center", justifyContent:"center",
                  background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)", color:"#6B7280", textAlign:"center", padding:20,
                }}
              >
                <div style={{ fontSize:32, marginBottom:8 }}>🖼️</div>
                <div style={{ fontWeight:700, fontSize:14, color:"#374151" }}>Image not found</div>
                <div style={{ fontSize:13, marginTop:4 }}>
                  Add <code style={{ background:"#fff", padding:"2px 6px", borderRadius:4, border:"1px solid #E5E7EB" }}>{p.src}</code> to your <code style={{ background:"#fff", padding:"2px 6px", borderRadius:4, border:"1px solid #E5E7EB" }}>frontend/public</code> folder
                </div>
              </div>
            ) : (
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                onError={() => setHeroPosterMissing(m => ({ ...m, [p.src]: true }))}
                style={{
                  position:"absolute", inset:0, width:"100%", height:"100%", objectFit: "contain",
                  opacity: i === heroSlide ? 1 : 0,
                  transition:"opacity .6s ease",
                  pointerEvents: i === heroSlide ? "auto" : "none",
                }}
              />
            )
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goToHeroSlide(heroSlide - 1)}
          style={{ position:"absolute", top:"50%", left: isMobile ? 8 : 16, transform:"translateY(-50%)", width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius:"50%", border:"none", background:"rgba(17,24,39,.35)", color:"#fff", fontSize: isMobile ? 16 : 20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}
        >‹</button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goToHeroSlide(heroSlide + 1)}
          style={{ position:"absolute", top:"50%", right: isMobile ? 8 : 16, transform:"translateY(-50%)", width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius:"50%", border:"none", background:"rgba(17,24,39,.35)", color:"#fff", fontSize: isMobile ? 16 : 20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}
        >›</button>

        {/* Dots */}
        <div style={{ position:"absolute", bottom: isMobile ? 8 : 16, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, zIndex:2 }}>
          {heroPosters.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToHeroSlide(i)}
              style={{ width:9, height:9, borderRadius:"50%", border:"none", cursor:"pointer", background: i === heroSlide ? "#fff" : "rgba(255,255,255,.5)", boxShadow:"0 0 0 1px rgba(0,0,0,.15)" }}
            />
          ))}
        </div>
      </section>

      {/* ── COUNTRIES WE ARE PROVIDING TUITION (marquee) ──────────────────── */}
      <CountriesMarquee />

      {/* ── SUBJECTS WE COVER (coverflow, autoplays every 5s) ─────────────── */}
      <SubjectsCoverflow />

      {/* ── VALUE BAND ─────────────────────────────────────────────────────── */}
      <section style={{ background:"#F9FBFF", padding: isMobile?"0 0 40px":"0 0 56px" }}>
        <div className="container">
          <div style={{ background:"#fff", border:"1px solid #E8EDF4", borderRadius:18, boxShadow:"0 16px 40px -24px rgba(15,23,42,.18)", marginTop:-28, padding: isMobile?"28px 18px":"36px 28px" }}>
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":(isTablet?"1fr 1fr":"repeat(4,1fr)"), gap: isMobile?"28px 16px":32 }}>
              {[
                { icon:"cap",    t:"Built for Educators", d:"Designed to make your job search simple and effective." },
                { icon:"shield", t:"Trusted by Schools",  d:"Schools trust us to connect them with the right teaching talent." },
                { icon:"users",  t:"Growing Community",   d:"A community of passionate educators and institutions." },
                { icon:"star",   t:"Quality First",       d:"We focus on quality matches that create lasting impact." },
              ].map(v => (
                <div key={v.t} style={{ textAlign:"center", padding:"0 4px" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:62, height:62, borderRadius:"50%", background:"#EBF2FE", color:"#1A56DB", marginBottom:14 }}>
                    <Ic name={v.icon} size={26} stroke={1.8} />
                  </span>
                  <div style={{ fontSize:16, fontWeight:800, color:"#0F172A", marginBottom:7 }}>{v.t}</div>
                  <div style={{ fontSize:13, color:"#64748B", lineHeight:1.6, maxWidth:230, margin:"0 auto" }}>{v.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALL JOBS SECTION */}
  

      {/* FEATURED TEACHERS */}
      <section className="section" style={{ background:"#fff", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Who's on AcadHr</div>
            <h2 className="sec-title">A Thriving <em style={{ color:"#1A56DB" }}>Education Community</em></h2>
            <p style={{ color:"#6B7280", fontSize:15, marginTop:10 }}>Schools hiring, teachers and tutors available, and parents finding the right match</p>
          </div>

          {GROUPS_LIVE.map((group, gi) => (
            <div key={group.key} style={{ marginBottom:40 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                <span style={{ fontSize:20 }}>{group.icon}</span>
                <h3 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:0 }}>{group.label}</h3>
                <span style={{ flex:1, height:1, background:"#E5E7EB" }} />
              </div>

              {false ? (
                <div className="jobs-marquee-viewport">
                  <div className={`jobs-marquee-track${gi % 2 === 0 ? " jobs-marquee-track-reverse" : ""}`}>
                    {[...group.cards, ...group.cards].map((t,i) => renderCommunityCard(t, i, group))}
                  </div>
                </div>
              ) : false ? (
                <div className="home-features-grid responsive-grid-3" style={{ gap:22 }}>
                  {group.cards.map((t,i) => renderCommunityCard(t, i, group))}
                </div>
              ) : (
                <div style={{ position:"relative" }}>
                  {rowOverflow[gi] && (
                    <button
                      aria-label="Scroll left"
                      onClick={() => scrollCommunityRow(gi, -1)}
                      style={{ position:"absolute", left:-18, top:"50%", transform:"translateY(-50%)", zIndex:2, width:36, height:36, borderRadius:"50%", border:"1px solid #E5E7EB", background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,.12)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#374151" }}
                    >←</button>
                  )}

                  <div
                    ref={el => (communityScrollRefs.current[gi] = el)}
                    className="community-scroll-row"
                    style={{ display:"flex", gap:22, overflowX:"auto", scrollBehavior:"smooth", scrollbarWidth:"none", paddingBottom:4 }}
                  >
                    {group.cards.map((t,i) => (
                      <div key={i} style={{ flexShrink:0, width:340 }}>{group.key === "teachers" ? renderBrowseTeacherCard(t, i, group) : renderCommunityCard(t, i, group)}</div>
                    ))}
                  </div>

                  {rowOverflow[gi] && (
                    <button
                      aria-label="Scroll right"
                      onClick={() => scrollCommunityRow(gi, 1)}
                      style={{ position:"absolute", right:-18, top:"50%", transform:"translateY(-50%)", zIndex:2, width:36, height:36, borderRadius:"50%", border:"1px solid #E5E7EB", background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,.12)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#374151" }}
                    >→</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        <div className="container">
          {/* <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {[["12,400+","Active Teachers","#1A56DB"],["3,200+","Institutes Hiring","#0EA5E9"],["48,000+","Jobs Placed","#059669"],["94%","Placement Rate","#D97706"]].map(([n,l,c]) => (
              <div key={l} className="stat-item">
                <div className="stat-num" style={{ color:c }}>{n}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* FOR WHOM */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="sec-eye" style={{ justifyContent:"center" }}>Who Is It For</div>
            <h2 className="sec-title">Designed for Every Education Professional</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : (isTablet ? "1fr 1fr" : "repeat(4,1fr)"), gap: isMobile?16:20, alignItems:"stretch" }}>
            {[
              { icon:"👩‍🏫", title:"Are You a Teacher?",     desc:"Build your verified profile, showcase qualifications, and apply to teaching positions across India. Free for all educators.", items:["Free profile — always","Apply to unlimited jobs","Get discovered by top schools","Track all applications live"], cta:"Join as Educator", accent:"#1A56DB", hover:"#1E429F" },
              { icon:"🏫",   title:"Hiring for Your Institute?", desc:"Post vacancies, review vetted applications, and find the perfect educators for your school, college, or coaching institute.", items:["Post unlimited vacancies","Access verified teacher profiles","Manage all applications","Moderated, trusted listings"], cta:"Register Institute", accent:"#0EA5E9", hover:"#0284C7" },
              { icon:"📚",   title:"Are You a Tutor?",        desc:"Offer home or online tuitions, set your own subjects and rates, and connect with students and parents who need you.", items:["List subjects & availability","Choose home or online","Get student requests","Grow your tuition income"], cta:"Join as Tutor", accent:"#059669", hover:"#047857" },
              { icon:"👪",   title:"Looking for a Tutor?",    desc:"Post your requirement, browse verified tutors by subject and board, and find the right match for your child.", items:["Post your requirement free","Browse verified tutors","Compare and connect","Hire with confidence"], cta:"Find a Tutor", accent:"#7C3AED", hover:"#6D28D9" },
            ].map(c => (
              <div key={c.title} className="card" style={{ padding:26, borderTop:`4px solid ${c.accent}`, display:"flex", flexDirection:"column" }}>
                <div style={{ fontSize:40, marginBottom:14 }}>{c.icon}</div>
                <h3 style={{ fontSize:19, marginBottom:9, lineHeight:1.25 }}>{c.title}</h3>
                <p style={{ color:"#6B7280", lineHeight:1.7, marginBottom:18, fontSize:13.5 }}>{c.desc}</p>
                <ul style={{ listStyle:"none", marginBottom:22 }}>
                  {c.items.map(f => (
                    <li key={f} style={{ color:"#374151", padding:"7px 0", fontSize:13, borderBottom:"1px solid #F3F4F6", display:"flex", gap:9, alignItems:"flex-start" }}>
                      <span style={{ color:c.accent, fontWeight:800, fontSize:15, lineHeight:1.3 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setPage("signup")} style={{ marginTop:"auto", width:"100%", background:c.accent, color:"#fff", border:"none", borderRadius:10, padding:"13px 18px", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Nunito,sans-serif", transition:"background .18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=c.hover; }}
                  onMouseLeave={e => { e.currentTarget.style.background=c.accent; }}>
                  {c.cta} →
                </button>
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
      {false && (
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
            <div style={{textAlign:'center',padding:'32px'}}><button className='btn btn-primary' onClick={()=>setPage('jobs')}>Browse All Jobs →</button></div>
          </div>
        </div>
      </section>
      )}

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

    {false && (
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
          <div className="home-jobs-grid responsive-grid-3">
            <div style={{textAlign:"center",padding:"32px 0",color:"#6B7280"}}><button className="btn btn-primary" onClick={()=>setPage("jobs")}>Browse All Jobs →</button></div>
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
    )}



      {/* Tuition Requirements (posted by parents — fetched from DB) */}
      {homeTuitions.length > 0 && (
      <section className="section" style={{ background:"#F0FDFA", borderTop:"1px solid #E5E7EB" }}>
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36, flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#0E7490", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Tuitions on AcadHr</div>
              <h2 className="sec-title" style={{ marginBottom:6 }}>Latest <em style={{ color:"#0E7490" }}>Tuition Requirements</em></h2>
              <p style={{ color:"#6B7280", fontSize:15 }}>Tuition needs posted by parents — find students to teach</p>
            </div>
            <button className="btn btn-outline" onClick={() => setPage("tuitions")}>Browse All Tuitions →</button>
          </div>

          <div className="home-features-grid responsive-grid-3" style={{ gap:22 }}>
            {homeTuitions.map(t => {
              const sub  = [t.student_class, t.board].filter(Boolean).join(" · ");
              const city = t.location || t.user_city || "";
              return (
                <div key={t.id} onClick={() => setPage("tuitions")}
                  style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, padding:22, cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(14,116,144,.12)"; e.currentTarget.style.borderColor="#67E8F9"; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                      <div style={{ width:48, height:48, borderRadius:12, background:"#ECFEFF", border:"1px solid #A5F3FC", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>📚</div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontWeight:800, fontSize:15, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.subject || "Tuition Required"}</div>
                        {sub && <div style={{ fontSize:12, color:"#0E7490", fontWeight:600, marginTop:2 }}>{sub}</div>}
                      </div>
                    </div>
                    <span style={{ background:"#ECFDF5", color:"#059669", border:"1px solid #A7F3D0", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, flexShrink:0 }}>{t.status || "Open"}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {city     && <span style={{ background:"#F3F4F6", color:"#374151", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>📍 {city}</span>}
                    {t.mode   && <span style={{ background:"#E0F2FE", color:"#0369A1", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{t.mode === "Online" ? "💻" : t.mode === "Offline" ? "🏠" : "🔄"} {t.mode}</span>}
                    {t.budget && <span style={{ background:"#ECFDF5", color:"#059669", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>💰 {t.budget}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

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
                <span key={l} style={{ fontSize:13, color:"#6B7280", cursor:"pointer" }}
                  onClick={() => { if (l === "Privacy Policy") setPage("privacy"); if (l === "Terms of Service") setPage("terms"); }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <Divider />
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <p style={{ color:"#6B7280", fontSize:12.5, marginBottom:6, lineHeight:1.6 }}>
              📍 Fn. 709, 7th Floor, D Block, Petbasheerabad Village, Kutbullapur, Hyderabad, Telangana – 500055
            </p>
            <p style={{ color:"#6B7280", fontSize:12.5 }}>
              📞 <a href="tel:+919849876783" style={{ color:"#6B7280", textDecoration:"none" }}>+91 98498 76783</a>
            </p>
          </div>
          <p style={{ color:"#9CA3AF", fontSize:12, textAlign:"center" }}>© 2025 AcadHr. All rights reserved by DEERAJ TECHNOLOGY PRIVATE LIMITED. Made with ❤️ in Hyderabad, India.</p>
        </div>
      </footer>

      {/* Social links — sits just above the floating Support button (home page only) */}
      <div style={{ position:"fixed", right:22, bottom:74, zIndex:10000, display:"flex", flexDirection:"column", gap:10 }}>
        <a href="https://www.linkedin.com/company/acad-hr/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
          style={{ width:42, height:42, borderRadius:"50%", background:"#0A66C2", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 18px rgba(10,102,194,.35)", textDecoration:"none" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
          style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 18px rgba(214,41,118,.35)", textDecoration:"none" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   JOBS PAGE
════════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS PAGE
════════════════════════════════════════════════════════════════════════════ */

export default HomePage;