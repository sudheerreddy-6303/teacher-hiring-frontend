import { useState } from "react";
import { Navbar } from "../components/common/Shared";

const FAQ_SECTIONS = [
  {
    id: "general",
    title: "General",
    items: [
      { q: "What is AcadHr?", a: "AcadHr is an online job portal for the education sector. It connects schools and institutions with qualified teachers across India." },
      { q: "How does AcadHr work?", a: "Schools post vacancies and access teacher profiles. Teachers create profiles, browse jobs, and apply. Applications are shared directly with schools for faster hiring." },
      { q: "Is AcadHr a consultancy?", a: "No. AcadHr is a job portal, not a consultancy. Teachers and schools connect directly on the platform." },
    ],
  },
  {
    id: "seekers",
    title: "For Teachers",
    items: [
      { q: "Is it free for teachers?", a: "Registration is free. Complete your profile to at least 70% to apply for jobs and receive suggestions." },
      { q: "How do I apply for jobs?", a: "Create your profile, upload your resume, browse jobs, and click Apply. Your profile is shared with the school instantly." },
      { q: "Why can't I apply yet?", a: "You need at least 70% profile completion. Add resume, job role, and location preferences from your dashboard." },
      { q: "Can I track my applications?", a: "Yes. View all applications under My Applications in your dashboard with real-time status updates." },
    ],
  },
  {
    id: "schools",
    title: "For Schools",
    items: [
      { q: "How can a school post a job?", a: "Register as a school, complete your institute profile, post job details, and manage applicants from your dashboard." },
      { q: "How do schools receive applications?", a: "When a teacher applies, their full profile, resume, and contact details are available in your Applicants dashboard." },
      { q: "Can schools search for teachers?", a: "Yes. Use the Teacher Database to filter by subject, experience, qualification, city, and work mode." },
    ],
  },
];

export default function FaqPage({ setPage }) {
  const [activeTab, setActiveTab] = useState("general");
  const [open, setOpen] = useState(null);
  const section = FAQ_SECTIONS.find(s => s.id === activeTab);

  return (
    <div style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} />
      <div className="container" style={{ maxWidth:800, paddingTop:100, paddingBottom:60 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h1 style={{ fontSize:36, fontWeight:900, color:"#111827", marginBottom:10 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color:"#6B7280", fontSize:16 }}>
            Find answers to common questions about AcadHr
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:32 }}>
          {FAQ_SECTIONS.map(s => (
            <button key={s.id} onClick={() => { setActiveTab(s.id); setOpen(null); }}
              style={{ padding:"10px 24px", borderRadius:10, border:"none", cursor:"pointer",
                fontWeight:700, fontSize:14, fontFamily:"Nunito,sans-serif", transition:"all .2s",
                background: activeTab===s.id ? "#1A56DB" : "#fff",
                color:      activeTab===s.id ? "#fff"    : "#374151",
                boxShadow:  activeTab===s.id ? "0 4px 12px rgba(26,86,219,.3)" : "0 1px 4px rgba(0,0,0,.08)" }}>
              {s.title}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {section.items.map((item, i) => (
            <div key={i} style={{ background:"#fff", borderRadius:12,
              border:`1px solid ${open===i ? "#BFDBFE" : "#E5E7EB"}`,
              overflow:"hidden", transition:"all .2s" }}>
              <button onClick={() => setOpen(open===i ? null : i)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"18px 22px", background:"none", border:"none", cursor:"pointer",
                  fontWeight:700, fontSize:15, color:"#111827", fontFamily:"Nunito,sans-serif", textAlign:"left" }}>
                <span>{item.q}</span>
                <span style={{ fontSize:20, color:"#1A56DB", flexShrink:0, marginLeft:12, transition:"transform .2s",
                  transform: open===i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {open===i && (
                <div style={{ padding:"0 22px 18px", fontSize:14, color:"#6B7280", lineHeight:1.7, borderTop:"1px solid #F3F4F6" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", marginTop:48, background:"linear-gradient(135deg,#1E429F,#1A56DB)", borderRadius:20, padding:"36px 32px" }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:8 }}>Still have questions?</h2>
          <p style={{ color:"#93C5FD", fontSize:14, marginBottom:20 }}>We're here to help you get started.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button className="btn" onClick={() => setPage("signup")}
              style={{ background:"#fff", color:"#1A56DB", fontWeight:800, padding:"10px 24px", borderRadius:10 }}>
              Get Started Free →
            </button>
            <a href="mailto:acadhire01@gmail.com"
              style={{ background:"rgba(255,255,255,.15)", color:"#fff", fontWeight:700, padding:"10px 24px",
                borderRadius:10, textDecoration:"none", border:"1px solid rgba(255,255,255,.3)", fontSize:14 }}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
