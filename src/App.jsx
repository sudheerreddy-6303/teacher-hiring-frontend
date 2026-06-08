import { useState } from "react";
import "./index.css";
import "./styles/responsive.css";
import { AuthContext } from "./context/AuthContext";

import HomePage           from "./pages/HomePage";
import HowItWorksPage     from "./pages/HowItWorksPage";
import JobsPage           from "./pages/JobsPage";
import BrowseTeachersPage from "./pages/BrowseTeachersPage";
import BrowseTutorsPage   from "./pages/BrowseTutorsPage";
import BrowseTuitionsPage from "./pages/BrowseTuitionsPage";
import PricingPage        from "./pages/PricingPage";
import FaqPage            from "./pages/FaqPage";
import AuthPage           from "./components/auth/AuthPage";
import AdminDashboard     from "./components/admin/AdminDashboard";
import TeacherDashboard   from "./components/teacher/TeacherDashboard";
import TutorDashboard     from "./components/tutor/TutorDashboard";
import ParentDashboard    from "./components/parent/ParentDashboard";
import SchoolDashboard    from "./components/school/SchoolDashboard";
import FeedbackWidget     from "./components/common/FeedbackWidget";

export default function App() {
  const [user, setUser]   = useState(null);
  const [page, setPage]   = useState("home");
  const [showWelcome, setShowWelcome] = useState(() => {
    // Show popup only on first visit (not if user is already logged in or has seen it)
    return !localStorage.getItem("acadhr_welcome_seen") && !localStorage.getItem("acadhr_token");
  });

  function closeWelcome() {
    localStorage.setItem("acadhr_welcome_seen", "1");
    setShowWelcome(false);
  }

  function handleRoleSelect(role) {
    closeWelcome();
    setPage("signup");
    // Store selected role so AuthPage pre-selects it
    localStorage.setItem("acadhr_selected_role", role);
  }
  const [token, setToken] = useState(localStorage.getItem("acadhr_token") || "");

  function login(userData, jwt) {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("acadhr_token", jwt);
    localStorage.setItem("acadhr_user",  JSON.stringify(userData));
    setPage("dashboard");
  }

  function logout() {
    setUser(null); setToken("");
    localStorage.removeItem("acadhr_token");
    localStorage.removeItem("acadhr_user");
    setPage("home");
  }

  // Restore session on refresh
  if (!user) {
    const saved = localStorage.getItem("acadhr_user");
    if (saved && token) {
      try { const u = JSON.parse(saved); if (u?.id) setUser(u); } catch {}
    }
  }

  function DashboardRouter() {
    if (!user) { setPage("login"); return null; }
    if (user.role === "admin")   return <AdminDashboard   setPage={setPage} />;
    if (user.role === "teacher") return <TeacherDashboard user={user} setPage={setPage} />;
    if (user.role === "tutor")   return <TutorDashboard   user={user} setPage={setPage} />;
    if (user.role === "school")  return <SchoolDashboard  user={user} setPage={setPage} />;
    if (user.role === "parent")  return <ParentDashboard  user={user} setPage={setPage} />;
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {page === "home"       && <HomePage           setPage={setPage} />}
      {page === "howitworks" && <HowItWorksPage     setPage={setPage} />}
      {page === "jobs"       && <JobsPage           setPage={setPage} />}
      {page === "teachers"   && <BrowseTeachersPage setPage={setPage} />}
      {page === "tutors"     && <BrowseTutorsPage   setPage={setPage} />}
      {page === "tuitions"   && <BrowseTuitionsPage setPage={setPage} />}
      {page === "pricing"    && <PricingPage        setPage={setPage} />}
      {page === "faq"        && <FaqPage            setPage={setPage} />}
      {page === "login"      && <AuthPage           mode="login"  setPage={setPage} />}
      {page === "signup"     && <AuthPage           mode="signup" setPage={setPage} />}
      {page === "dashboard"  && <DashboardRouter />}

      {/* Floating feedback widget — shown on every page */}
      <FeedbackWidget page={page} />
      {/* ── Welcome Role Selection Popup ── */}
      {showWelcome && !user && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.55)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:9999, padding:"16px", backdropFilter:"blur(4px)"
        }} onClick={closeWelcome}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"#fff", borderRadius:24, padding:"32px 28px",
            width:"100%", maxWidth:420, boxShadow:"0 24px 80px rgba(0,0,0,.25)",
            position:"relative", animation:"fadeUp .3s ease"
          }}>
            {/* Close button */}
            <button onClick={closeWelcome} style={{
              position:"absolute", top:16, right:16,
              width:32, height:32, borderRadius:"50%", border:"1px solid #E5E7EB",
              background:"#F9FAFB", cursor:"pointer", fontSize:16, color:"#6B7280",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>✕</button>

            {/* Header */}
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:22, fontWeight:900, color:"#111827", marginBottom:4 }}>
                Join AcadHr
              </h2>
              <p style={{ color:"#6B7280", fontSize:14 }}>Choose how you want to use AcadHr</p>
            </div>

            {/* Role cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              {[
                { val:"teacher", icon:"👩‍🏫", label:"Teacher / Faculty",    desc:"Looking for teaching jobs at schools, colleges or coaching institutes", color:"#1A56DB", bg:"#EBF5FF", border:"#BFDBFE" },
                { val:"tutor",   icon:"🧑‍🎓", label:"Private Tutor",        desc:"Offering home tuition or online tutoring to students",                  color:"#6D28D9", bg:"#F5F3FF", border:"#DDD6FE" },
                { val:"school",  icon:"🏫",   label:"School / Institution", desc:"Hiring teachers, faculty or staff for your school or coaching centre",   color:"#0EA5E9", bg:"#E0F2FE", border:"#BAE6FD" },
                { val:"parent",  icon:"👨‍👩‍👧", label:"Parent / Guardian",   desc:"Looking for a qualified tutor for your child",                          color:"#059669", bg:"#ECFDF5", border:"#A7F3D0" },
              ].map(r => (
                <div key={r.val} onClick={() => handleRoleSelect(r.val)}
                  style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"14px 16px", borderRadius:14,
                    border:`1.5px solid ${r.border}`, background:r.bg,
                    cursor:"pointer", transition:"all .18s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateX(4px)"; e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,.1)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                    {r.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:14, color:r.color, marginBottom:2 }}>{r.label}</div>
                    <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.4 }}>{r.desc}</div>
                  </div>
                  <span style={{ color:r.color, fontSize:18, fontWeight:700 }}>→</span>
                </div>
              ))}
            </div>

            {/* Sign in link */}
            <div style={{ textAlign:"center", fontSize:13, color:"#6B7280" }}>
              Already have an account?{" "}
              <span onClick={() => { closeWelcome(); setPage("login"); }}
                style={{ color:"#1A56DB", fontWeight:700, cursor:"pointer" }}>
                Sign In →
              </span>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
