import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SUBS } from "../../constants";
import { COUNTRIES, INDIAN_STATES, citiesForState } from "../../locationData"; // ADDED: location dropdown data
import { Toast, Spinner, JobCard, OtpBoxes, InlineBrowseJobs, FilterBar } from "../../components/common/Shared";
import './Auth.css';

// Tutor multi-select chip styles
const tutorChipWrap = { display:"flex", flexWrap:"wrap", gap:8 };
const tutorChipBox  = { display:"flex", flexWrap:"wrap", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:"12px", background:"#FAFBFC" };
const tutorUpload   = { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, textAlign:"center", border:"1.5px dashed #C7D2FE", borderRadius:12, padding:"18px 14px", background:"#F8FAFF", cursor:"pointer" };
const tutorChip = (on) => ({
  padding:"7px 13px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", userSelect:"none",
  border: on ? "1.5px solid #1A56DB" : "1.5px solid #E5E7EB",
  background: on ? "#EBF5FF" : "#fff", color: on ? "#1A56DB" : "#374151", transition:"all .15s",
});

function AuthPage({ mode, setPage }) {
  const { login } = useAuth();
  const [form, setForm] = useState(() => {
    const savedRole = localStorage.getItem("acadhr_selected_role") || "teacher";
    return { name:"", email:"", password:"", role: savedRole, phone:"", city:"", subject:"", experience:"", qualification:"", bio:"", institute_type:"", est_year:"", student_count:"", website:"", hourly_rate:"", teaching_mode:"Both", subjects:[], qualifications:[], availability:[], address:"", tutor_location:"", pincode:"", class_link:"", tutor_courses:[], demo_class_link:"", about_yourself:"", tutor_terms_accepted:false, resume_base64:"", resume_name:"", resume_type:"", preferred_times:[], parent_subjects:[], parent_courses:[], parent_days:[], parent_pincode:"", parent_state:"", parent_landmark:"", hourly_budget:"", institute_name:"", gender:"", tutor_photo_base64:"", tutor_photo_name:"", tutor_photo_type:"", classes_taught:[], state:"", country:"India", city_other:"", state_other:"" };
  });
  const [step, setStep]           = useState(1);
  const [err,  setErr]            = useState("");
  const [loading, setLoading]     = useState(false);

  // OTP state
  const [otpInput,    setOtpInput]    = useState(["","","","","",""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpErr,      setOtpErr]      = useState("");
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent,     setOtpSent]     = useState(false);

  // Login OTP state (separate from signup OTP)
  const [loginStep,      setLoginStep]      = useState(1); // 1=credentials, 2=otp
  const [loginOtpInput,  setLoginOtpInput]  = useState(["","","","","",""]);
  const [loginOtpErr,    setLoginOtpErr]    = useState("");
  const [loginOtpLoading,setLoginOtpLoading]= useState(false);
  const [loginResendTimer,setLoginResendTimer] = useState(0);

  // Forgot-password state (mode stays "login"; this is a sub-flow)
  const [forgotMode,    setForgotMode]    = useState(false);
  const [forgotStep,    setForgotStep]    = useState(1); // 1=enter email, 2=otp+new password, 3=success
  const [forgotEmail,   setForgotEmail]   = useState("");
  const [forgotOtp,     setForgotOtp]     = useState(["","","","","",""]);
  const [forgotNewPw,   setForgotNewPw]   = useState("");
  const [forgotErr,     setForgotErr]     = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotTimer,   setForgotTimer]   = useState(0);

  const [roleSelected, setRoleSelected] = useState(() => {
    // If role was pre-selected from welcome popup, skip role selection screen
    const saved = localStorage.getItem("acadhr_selected_role");
    if (saved) {
      localStorage.removeItem("acadhr_selected_role"); // clean up
      return true;  // go straight to signup form
    }
    return false;
  });

  function up(k, v) { setForm(f => ({...f, [k]:v})); }

  // Toggle a value in an array-valued form field (multi-select chips)
  function toggleMulti(key, val) {
    const arr = Array.isArray(form[key]) ? form[key] : [];
    up(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }
  // Toggle a value in a comma-separated string field (multi-select chips, stored as text)
  function toggleCsv(key, val) {
    const arr = (form[key] || "").split(",").map(x => x.trim()).filter(Boolean);
    up(key, (arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]).join(", "));
  }
  // Read an uploaded resume file into the form as base64
  function onResume(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      up("resume_base64", reader.result);
      up("resume_name", file.name);
      up("resume_type", file.type || "application/octet-stream");
    };
    reader.readAsDataURL(file);
  }
  // ADDED: read an uploaded tutor photo into the form as base64
  function onTutorPhoto(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("Photo must be under 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      up("tutor_photo_base64", reader.result);
      up("tutor_photo_name", file.name);
      up("tutor_photo_type", file.type || "image/jpeg");
    };
    reader.readAsDataURL(file);
  }
  // ADDED: multi-select toggle with a maximum pick limit (used for "Which Class Can Teach", max 3)
  function toggleMultiMax(key, val, max) {
    const arr = form[key] || [];
    if (arr.includes(val)) { up(key, arr.filter(x => x !== val)); return; }
    if (arr.length >= max) { setErr(`You can select up to ${max} only.`); return; }
    setErr("");
    up(key, [...arr, val]);
  }

  // ── Resend countdown ────────────────────────────────────────────────────────
  function startResendTimer(setter) {
    setter(30);
    const t = setInterval(() => setter(s => { if (s <= 1) { clearInterval(t); return 0; } return s - 1; }), 1000);
  }

  // ── OTP input helpers (shared) ──────────────────────────────────────────────
  function handleOtpChange(val, idx, setter, arr) {
    if (!/^\d?$/.test(val)) return;
    const next = [...arr]; next[idx] = val; setter(next);
    // Use setTimeout so DOM update completes before we shift focus
    if (val && idx < 5) {
      setTimeout(() => document.getElementById(`otp-${mode}-${idx+1}`)?.focus(), 0);
    }
  }
  function handleOtpKeyDown(e, idx, setter, arr) {
    if (e.key === "Backspace" && !arr[idx] && idx > 0) {
      setTimeout(() => document.getElementById(`otp-${mode}-${idx-1}`)?.focus(), 0);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LOGIN FLOW
  // ════════════════════════════════════════════════════════════════════════════
  async function handleSendLoginOtp(e) {
    e.preventDefault(); setErr(""); setLoginOtpLoading(true);
    try {
      const res = await import('../../api.js').then(m => m.authAPI.sendLoginOtp(form.email, form.password));
      setLoginStep(2);
      if (res.dev) setErr("⚠️ Dev mode: OTP is printed in the server console (no email configured).");
      startResendTimer(setLoginResendTimer);
    } catch (ex) { setErr(ex.message); }
    finally { setLoginOtpLoading(false); }
  }

  async function handleVerifyLoginOtp() {
    const otp = loginOtpInput.join("");
    if (otp.length < 6) { setLoginOtpErr("Please enter all 6 digits."); return; }
    setLoginOtpLoading(true); setLoginOtpErr("");
    try {
      const data = await import('../../api.js').then(m => m.authAPI.verifyLoginOtp(form.email, otp));
      login(data.user, data.token);
      setPage("dashboard");
    } catch (ex) {
      setLoginOtpErr(ex.message);
      setLoginOtpInput(["","","","","",""]);
      document.getElementById(`otp-login-0`)?.focus();
    } finally { setLoginOtpLoading(false); }
  }

  async function handleResendLoginOtp() {
    try {
      await import('../../api.js').then(m => m.authAPI.resendOtp(form.email, form.name || "", "login"));
      setLoginOtpInput(["","","","","",""]);
      setLoginOtpErr("");
      startResendTimer(setLoginResendTimer);
    } catch (ex) { setLoginOtpErr(ex.message); }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FORGOT PASSWORD FLOW
  // ════════════════════════════════════════════════════════════════════════════
  // Dedicated OTP helpers for the forgot flow (prefix "forgot")
  function handleForgotOtpChange(val, idx, setter, arr) {
    if (!/^\d?$/.test(val)) return;
    const next = [...arr]; next[idx] = val; setter(next);
    if (val && idx < 5) {
      setTimeout(() => document.getElementById(`otp-forgot-${idx+1}`)?.focus(), 0);
    }
  }
  function handleForgotOtpKeyDown(e, idx, setter, arr) {
    if (e.key === "Backspace" && !arr[idx] && idx > 0) {
      setTimeout(() => document.getElementById(`otp-forgot-${idx-1}`)?.focus(), 0);
    }
  }

  function openForgot() {
    setForgotMode(true);
    setForgotStep(1);
    setForgotEmail(form.email || "");
    setForgotOtp(["","","","","",""]);
    setForgotNewPw("");
    setForgotErr("");
  }

  function closeForgot() {
    setForgotMode(false);
    setForgotStep(1);
    setForgotOtp(["","","","","",""]);
    setForgotNewPw("");
    setForgotErr("");
  }

  async function handleSendForgotOtp(e) {
    if (e) e.preventDefault();
    setForgotErr(""); setForgotLoading(true);
    try {
      const res = await import('../../api.js').then(m => m.authAPI.sendForgotOtp(forgotEmail));
      setForgotStep(2);
      setForgotOtp(["","","","","",""]);
      if (res.dev) setForgotErr("⚠️ Dev mode: OTP is printed in the server console (no email configured).");
      startResendTimer(setForgotTimer);
    } catch (ex) { setForgotErr(ex.message); }
    finally { setForgotLoading(false); }
  }

  async function handleResetPassword() {
    const otp = forgotOtp.join("");
    if (otp.length < 6) { setForgotErr("Please enter all 6 digits."); return; }
    if (forgotNewPw.length < 8) { setForgotErr("Password must be at least 8 characters."); return; }
    setForgotLoading(true); setForgotErr("");
    try {
      await import('../../api.js').then(m => m.authAPI.resetPassword(forgotEmail, otp, forgotNewPw));
      setForgotStep(3);
    } catch (ex) {
      setForgotErr(ex.message);
      setForgotOtp(["","","","","",""]);
      document.getElementById(`otp-forgot-0`)?.focus();
    } finally { setForgotLoading(false); }
  }

  async function handleResendForgotOtp() {
    try {
      await import('../../api.js').then(m => m.authAPI.sendForgotOtp(forgotEmail));
      setForgotOtp(["","","","","",""]);
      setForgotErr("");
      startResendTimer(setForgotTimer);
    } catch (ex) { setForgotErr(ex.message); }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SIGNUP FLOW
  // ════════════════════════════════════════════════════════════════════════════
  async function handleSignupNext(e) {
    e.preventDefault(); setErr("");
    if (step === 1) {
      // Validate mandatory phone
      if (!form.phone.trim()) { setErr("Phone number is required."); return; }
      if (!form.email.trim()) { setErr("Email address is required."); return; }
      // ADDED (mandatory fields): all step-1 fields are required
      if (!form.name.trim())     { setErr("Full name is required."); return; }
      if (!form.city.trim())     { setErr("City is required."); return; }
      // ADDED (mandatory fields): tutors must also pick State & Country
      if (form.role === "tutor" && !String(form.state === "Other" ? form.state_other : form.state || "").trim()) { setErr("State is required."); return; }
      if (form.role === "tutor" && !String(form.country || "").trim()) { setErr("Country is required."); return; }
      if (!form.password.trim()) { setErr("Password is required."); return; }
      setStep(2); return;
    }
    if (step === 2) {
      // Validate parent-specific required fields
      if (form.role === "parent") {
        if (!form.student_name.trim()) { setErr("Please enter your child's name."); return; }
        if (!form.student_class)       { setErr("Please select your child's class."); return; }
        if (!(form.parent_subjects && form.parent_subjects.length)) { setErr("Please select at least one subject."); return; }
        // ADDED (mandatory fields): remaining parent fields are required too
        if (form.parent_courses !== undefined && !(form.parent_courses && form.parent_courses.length)) { setErr("Please select at least one course."); return; }
        if (form.board_pref !== undefined && !String(form.board_pref || "").trim())     { setErr("Please select a board preference."); return; }
        if (form.location_pref !== undefined && !String(form.location_pref || "").trim()) { setErr("Please enter your location preference."); return; }
      }
      // Validate tutor-specific required fields
      if (form.role === "tutor") {
        // ADDED (mandatory fields): photo & classes are required
        if (!String(form.tutor_photo_base64 || "").trim()) { setErr("Please upload your photo."); return; }
        if (!(form.classes_taught && form.classes_taught.length)) { setErr("Please select which class you can teach (up to 3)."); return; }
        if (!(form.subjects && form.subjects.length)) { setErr("Please select at least one subject."); return; }
        // ADDED (mandatory fields): all tutor fields are required
        if (!String(form.qualification || "").trim() && !(form.qualifications && form.qualifications.length)) { setErr("Please select your qualification."); return; }
        // ADDED (mandatory fields): experience is required
        if (!String(form.experience || "").trim()) { setErr("Please select your experience."); return; }
        if (!(form.availability && form.availability.length)) { setErr("Please select your availability."); return; }
        if (!String(form.hourly_rate || "").trim())    { setErr("Hourly rate is required."); return; }
        /* CHANGED per request (NOT deleted — kept here, deactivated): these four fields are now OPTIONAL
        if (!String(form.address || "").trim())        { setErr("Address is required."); return; }
        if (!String(form.tutor_location || "").trim()) { setErr("Location/area is required."); return; }
        if (!String(form.pincode || "").trim())        { setErr("Pincode is required."); return; }
        if (!String(form.class_link || "").trim())     { setErr("Online class link is required."); return; }
        */
        if (!String(form.gender || "").trim())         { setErr("Please select your gender."); return; }
        // ADDED (mandatory fields): resume & bio are required
        if (!String(form.resume_base64 || "").trim()) { setErr("Please upload your resume / CV."); return; }
        // ADDED (mandatory fields): course selection & about-yourself (~300 words)
        if (!(form.tutor_courses && form.tutor_courses.length)) { setErr("Please select at least one course."); return; }
        if (!String(form.about_yourself || "").trim()) { setErr("Please write about yourself (around 300 words)."); return; }
        // ADDED (mandatory): tutor must accept the Terms & Conditions
        if (!form.tutor_terms_accepted) { setErr("Please accept the Terms & Conditions to continue."); return; }
        /* CHANGED per request (NOT deleted — deactivated): Short Bio is no longer required for tutors
        if (!String(form.bio || "").trim()) { setErr("Please write a short bio."); return; }
        */
      }
      // ADDED (mandatory fields): teacher fields are required
      if (form.role === "teacher") {
        if (!String(form.subject || "").trim())       { setErr("Please select at least one subject."); return; }
        if (!String(form.experience || "").trim())    { setErr("Experience is required."); return; }
        if (!String(form.qualification || "").trim()) { setErr("Qualification is required."); return; }
        if (!String(form.bio || "").trim())           { setErr("Please write a short bio."); return; }
      }
      // ADDED (mandatory fields): school fields are required
      if (form.role === "school") {
        if (!String(form.institute_type || "").trim()) { setErr("Institute type is required."); return; }
        if (!String(form.est_year || "").trim())       { setErr("Establishment year is required."); return; }
        if (!String(form.student_count || "").trim())  { setErr("Student count is required."); return; }
      }
      // Send OTP to email
      setOtpLoading(true);
      try {
        const otpRes = await import('../../api.js').then(m => m.authAPI.sendSignupOtp(form.name, form.email, form.role));
        setOtpSent(true);
        setStep(3);
        startResendTimer(setResendTimer);
        if (otpRes.dev) setErr("⚠️ Dev mode: OTP is printed in the server console (no email configured).");
      } catch (ex) { setErr(ex.message); }
      finally { setOtpLoading(false); }
      return;
    }
  }

  async function handleVerifySignupOtp() {
    const otp = otpInput.join("");
    if (otp.length < 6) { setOtpErr("Please enter all 6 digits."); return; }
    setOtpLoading(true); setOtpErr("");
    try {
      // Just verify on backend by including OTP in signup call
      // First check OTP is correct by trying signup
      const payload = {
        ...form, otp,
        // parent fields mapping
        student_name:      form.student_name,
        student_class:     form.student_class,
        board:             form.board_pref,
        subject:           form.role === "parent" ? (form.parent_subjects||[]).join(", ") : form.subject,
        courses:           (form.parent_courses||[]).join(", "),
        preferred_days:    (form.parent_days||[]).join(", "),
        location:          form.location_pref,
        mode:              form.mode_pref,
        preferred_time:    Array.isArray(form.preferred_times) ? form.preferred_times.join(", ") : form.preferred_time,
        budget:            form.budget,
        tutor_gender_pref: form.tutor_gender_pref,
        experience_req:    form.experience_req,
        notes:             form.lead_notes,
        // ADDED: tutor extras — classes (max 3, joined), resolved state, country
        classes_taught:    (form.classes_taught||[]).join(", "),
        state:             form.state === "Other" ? (form.state_other || "Other") : form.state,
        country:           form.country,
      };
      const data = await import('../../api.js').then(m => m.authAPI.signup(payload));
      login(data.user, data.token);
      setPage("dashboard");
    } catch (ex) {
      setOtpErr(ex.message);
      setOtpInput(["","","","","",""]);
      document.getElementById(`otp-signup-0`)?.focus();
    } finally { setOtpLoading(false); }
  }

  async function handleResendSignupOtp() {
    try {
      await import('../../api.js').then(m => m.authAPI.resendOtp(form.email, form.name, "signup"));
      setOtpInput(["","","","","",""]);
      setOtpErr("");
      startResendTimer(setResendTimer);
    } catch (ex) { setOtpErr(ex.message); }
  }

  const SUBS   = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Zoology"];
  const EXPS   = ["Fresher (0-1 year)","1-3 years","3-5 years","5-10 years","10+ years"];
  // ADDED: classes a tutor can teach (up to Class 12 + competitive courses) — max 3 selections
  const CLASSES = ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","JEE","NEET","FOUNDATION","IPMAT","CA FOUNDATION"];
  const QUALS  = ["B.Sc","M.Sc","B.Tech","M.Tech","B.Ed","M.Ed","PhD","Diploma","B.A","M.A","B.Com","M.Com","B.E","BCA","MCA","BBA","MBA","M.Phil"];
  const ITYPES = ["School (CBSE)","School (ICSE)","School (State Board)","Junior College","Degree College","Coaching Institute","Tuition Centre","Online Platform"];
  const stepLabels = ["Your Info","Details","Verify Email"];



  return (
    <div className="auth-layout">

      {/* ── Left panel ── */}
      <div className="auth-panel-left" style={{ background:"linear-gradient(160deg,#1E429F 0%,#1A56DB 100%)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 52px" }}>
        <div className="brand" style={{ cursor:"pointer", background:"#fff", display:"inline-block", padding:"10px 18px", borderRadius:12 }} onClick={() => setPage("home")}>
          <img src="/acadhr-logo.png" alt="AcadHr" style={{ height:64, objectFit:"contain", display:"block" }} />
        </div>
        <h2 style={{ fontSize:30, marginTop:30, marginBottom:12, color:"#fff" }}>{mode==="login" ? "Welcome back." : "Join AcadHr."}</h2>
        <p style={{ color:"#BFDBFE", lineHeight:1.85, fontSize:15, maxWidth:320 }}>
          {mode==="login" ? "Sign in to access your dashboard and continue your career journey." : "Create your free account and connect with India's best schools and educators."}
        </p>
        <div style={{ marginTop:40 }}>
          {[["🏫","3,200+ verified institutes"],["👩‍🏫","12,400+ active educators"],["✅","Moderated and trusted platform"],["🔒","Email-verified accounts only"]].map(([i,t]) => (
            <div key={t} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14, color:"#BFDBFE", fontSize:14 }}>
              <span style={{ fontSize:18 }}>{i}</span>{t}
            </div>
          ))}
        </div>
        {mode==="login" && (
          <div style={{  }}>
            {/* <div style={{ fontWeight:800, marginBottom:5, color:"#fff", fontSize:13 }}>Demo Accounts</div>
            {[["admin@acadhr.com","admin123"],["teacher@test.com","test123"],["tutor@test.com","test123"],["school@test.com","test123"]].map(([e,p]) => (
              <div key={e}><span style={{ fontFamily:"Fira Code,monospace", color:"#93C5FD", fontWeight:500 }}>{e}</span> / {p}</div>
            ))} */}
          </div>
        )}
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-panel-right" style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"60px 52px", background:"#F9FAFB", overflowY:"auto" }}>
        <div className="auth-card-inner" style={{ maxWidth:420 }}>

          {/* Back button */}
          <button
            onClick={() => {
              if (mode==="login" && forgotMode) {
                if (forgotStep===2) { setForgotStep(1); setForgotErr(""); return; }
                closeForgot(); return;
              }
              if (mode==="login" && loginStep===2) { setLoginStep(1); return; }
              if (mode==="signup" && step>1) { setStep(s => s-1); setErr(""); return; }
              if (mode==="signup" && step===1 && roleSelected) { setRoleSelected(false); setErr(""); return; }
              setPage("home");
            }}
            style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#6B7280", fontSize:13, fontWeight:600, marginBottom:18, padding:0 }}
            onMouseEnter={e => e.currentTarget.style.color="#1A56DB"}
            onMouseLeave={e => e.currentTarget.style.color="#6B7280"}
          >
            <span style={{ fontSize:16 }}>←</span>
            {mode==="login" && forgotMode && forgotStep===2 ? "Back to email" :
             mode==="login" && forgotMode ? "Back to sign in" :
             mode==="login" && loginStep===2 ? "Back to credentials" :
             mode==="signup" && step===2 ? "Back to basic info" :
             mode==="signup" && step===3 ? "Back to details" :
             mode==="signup" && roleSelected ? "Back to role selection" :
             "Back to Home"}
          </button>

          {/* Header */}
          {!(mode==="signup" && !roleSelected) && (
            <h3 style={{ fontSize:22, marginBottom:4, color:"#111827" }}>
              {mode==="login"
                ? (forgotMode
                    ? (forgotStep===1 ? "Forgot Password" : forgotStep===2 ? "Reset Password" : "Password Reset")
                    : (loginStep===1 ? "Sign In" : "Enter Verification Code"))
                : (step===1 ? "Create Your Account" : step===2 ? "Professional Details" : "Verify Your Email")}
            </h3>
          )}
          {mode==="signup" && !roleSelected && (
            <h3 style={{ fontSize:22, marginBottom:4, color:"#111827" }}>Join AcadHr</h3>
          )}
          {!(mode==="signup" && !roleSelected) && (
            <p style={{ color:"#9CA3AF", marginBottom:20, fontSize:14 }}>
              {mode==="signup" ? `Step ${step} of 3 — ${stepLabels[step-1]}` : forgotMode ? (forgotStep===1 ? "Enter your registered email to receive a reset code" : forgotStep===2 ? `Code sent to ${forgotEmail}` : "All done!") : loginStep===1 ? "Enter your credentials to continue" : `Code sent to ${form.email}`}
            </p>
          )}

          {/* Progress bar (signup) */}
          {mode==="signup" && roleSelected && (
            <div style={{ display:"flex", gap:6, marginBottom:24 }}>
              {[1,2,3].map(s => (
                <div key={s} style={{ flex:1 }}>
                  <div style={{ height:4, borderRadius:2, background: step>=s?"#1A56DB":"#E5E7EB", transition:"background .3s" }} />
                  <div style={{ fontSize:10, color: step>=s?"#1A56DB":"#9CA3AF", fontWeight:700, marginTop:5, textAlign:"center" }}>{stepLabels[s-1]}</div>
                </div>
              ))}
            </div>
          )}

          {err && <div className={`alert ${err.startsWith('⚠️') ? 'a-warn' : 'a-err'}`}>{err}</div>}

          {/* ════════════════════════════════════════════════════════════════
              LOGIN MODE
          ════════════════════════════════════════════════════════════════ */}
          {mode==="login" && !forgotMode && (
            <>
              {loginStep===1 && (
                <form onSubmit={handleSendLoginOtp}>
                  <div className="fg"><label className="flabel">Email Address</label>
                    <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => up("email", e.target.value)} required />
                  </div>
                  <div className="fg"><label className="flabel">Password</label>
                    <input className="input" type="password" placeholder="Enter password" value={form.password} onChange={e => up("password", e.target.value)} required />
                  </div>
                  <div style={{ textAlign:"right", marginTop:-8, marginBottom:14 }}>
                    <span onClick={openForgot}
                      style={{ color:"#1A56DB", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      Forgot password?
                    </span>
                  </div>
                  <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px", marginTop:4 }} disabled={loginOtpLoading}>
                    {loginOtpLoading ? <Spinner /> : "Send Verification Code →"}
                  </button>
                </form>
              )}

              {loginStep===2 && (
                <div>
                  <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:22 }}>📧</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#1E429F" }}>Check your inbox</div>
                      <div style={{ fontSize:13, color:"#1A56DB" }}>{form.email}</div>
                      <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>Enter the 6-digit code to complete login.</div>
                    </div>
                  </div>

                  <div className="fg">
                    <label className="flabel">6-Digit Verification Code</label>
                    <OtpBoxes arr={loginOtpInput} setter={setLoginOtpInput} prefix="login" disabled={loginOtpLoading} onChangeFn={handleOtpChange} onKeyDownFn={handleOtpKeyDown} />
                  </div>

                  {loginOtpErr && <div className="alert a-err">{loginOtpErr}</div>}

                  <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px", marginBottom:12 }}
                    disabled={loginOtpLoading} onClick={handleVerifyLoginOtp}>
                    {loginOtpLoading ? <Spinner /> : "Verify & Sign In ✓"}
                  </button>

                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#9CA3AF" }}>
                    <span style={{ cursor:"pointer", color:"#374151" }} onClick={() => { setLoginStep(1); setLoginOtpInput(["","","","","",""]); setLoginOtpErr(""); }}>
                      ← Use different email
                    </span>
                    {loginResendTimer > 0
                      ? <span>Resend in {loginResendTimer}s</span>
                      : <span style={{ color:"#1A56DB", cursor:"pointer", fontWeight:700 }} onClick={handleResendLoginOtp}>Resend Code</span>
                    }
                  </div>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              FORGOT PASSWORD MODE
          ════════════════════════════════════════════════════════════════ */}
          {mode==="login" && forgotMode && (
            <>
              {/* Step 1 — enter registered email */}
              {forgotStep===1 && (
                <form onSubmit={handleSendForgotOtp}>
                  <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:22 }}>🔒</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#1E429F" }}>Reset your password</div>
                      <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>We'll send a 6-digit code to your registered email.</div>
                    </div>
                  </div>
                  <div className="fg"><label className="flabel">Registered Email Address</label>
                    <input className="input" type="email" placeholder="your@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                  </div>
                  {forgotErr && <div className={`alert ${forgotErr.startsWith('⚠️') ? 'a-warn' : 'a-err'}`}>{forgotErr}</div>}
                  <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px", marginTop:4 }} disabled={forgotLoading}>
                    {forgotLoading ? <Spinner /> : "Send Reset Code →"}
                  </button>
                  <div style={{ textAlign:"center", marginTop:16, fontSize:13 }}>
                    <span style={{ cursor:"pointer", color:"#374151", fontWeight:600 }} onClick={closeForgot}>← Back to Sign In</span>
                  </div>
                </form>
              )}

              {/* Step 2 — enter OTP + new password */}
              {forgotStep===2 && (
                <div>
                  <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:22 }}>📧</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#1E429F" }}>Check your inbox</div>
                      <div style={{ fontSize:13, color:"#1A56DB" }}>{forgotEmail}</div>
                      <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>Enter the 6-digit code and set a new password.</div>
                    </div>
                  </div>

                  <div className="fg">
                    <label className="flabel">6-Digit Verification Code</label>
                    <OtpBoxes arr={forgotOtp} setter={setForgotOtp} prefix="forgot" disabled={forgotLoading} onChangeFn={handleForgotOtpChange} onKeyDownFn={handleForgotOtpKeyDown} />
                  </div>

                  <div className="fg"><label className="flabel">New Password</label>
                    <input className="input" type="password" placeholder="Min. 8 characters" value={forgotNewPw} onChange={e => setForgotNewPw(e.target.value)} minLength={8} required />
                  </div>

                  {forgotErr && <div className={`alert ${forgotErr.startsWith('⚠️') ? 'a-warn' : 'a-err'}`}>{forgotErr}</div>}

                  <button type="button" className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px", marginBottom:12 }}
                    disabled={forgotLoading} onClick={handleResetPassword}>
                    {forgotLoading ? <Spinner /> : "Reset Password ✓"}
                  </button>

                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#9CA3AF" }}>
                    <span style={{ cursor:"pointer", color:"#374151" }} onClick={() => { setForgotStep(1); setForgotOtp(["","","","","",""]); setForgotErr(""); }}>
                      ← Use different email
                    </span>
                    {forgotTimer > 0
                      ? <span>Resend in {forgotTimer}s</span>
                      : <span style={{ color:"#1A56DB", cursor:"pointer", fontWeight:700 }} onClick={handleResendForgotOtp}>Resend Code</span>
                    }
                  </div>
                </div>
              )}

              {/* Step 3 — success */}
              {forgotStep===3 && (
                <div>
                  <div style={{ background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:12, padding:"20px 18px", marginBottom:20, display:"flex", gap:12, alignItems:"flex-start" }}>
                    <span style={{ fontSize:24 }}>✅</span>
                    <div>
                      <div style={{ fontWeight:800, fontSize:15, color:"#065F46", marginBottom:3 }}>Password reset successful</div>
                      <div style={{ fontSize:13, color:"#047857", lineHeight:1.6 }}>Your password has been updated. You can now sign in with your new password.</div>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px" }}
                    onClick={() => { closeForgot(); up("password", ""); }}>
                    Back to Sign In →
                  </button>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              SIGNUP MODE
          ════════════════════════════════════════════════════════════════ */}
          {mode==="signup" && !roleSelected && (
            /* ── Role selection screen ── */
            <div>
              <p style={{ color:"#6B7280", fontSize:14, marginBottom:24 }}>Choose how you want to use AcadHr</p>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { val:"teacher", icon:"👩‍🏫", label:"Teacher / Faculty",     desc:"Looking for teaching jobs at schools, colleges or coaching institutes",  color:"#1A56DB", bg:"#EBF5FF", border:"#BFDBFE" },
                  { val:"tutor",   icon:"🧑‍🎓", label:"Private Tutor",         desc:"Offering home tuition or online tutoring to students",                   color:"#6D28D9", bg:"#F5F3FF", border:"#DDD6FE" },
                  { val:"school",  icon:"🏫",   label:"School / Institution",  desc:"Hiring teachers, faculty or staff for your school or coaching centre",    color:"#0EA5E9", bg:"#E0F2FE", border:"#BAE6FD" },
                  { val:"parent",  icon:"👨‍👩‍👧", label:"Parent / Guardian",    desc:"Looking for a qualified tutor for your child",                           color:"#059669", bg:"#ECFDF5", border:"#A7F3D0" },
                ].map(r => (
                  <div key={r.val}
                    onClick={() => { up("role", r.val); setRoleSelected(true); setErr(""); }}
                    style={{ display:"flex", alignItems:"center", gap:18, padding:"18px 20px", borderRadius:14, border:`2px solid ${r.border}`, background:r.bg, cursor:"pointer", transition:"all .18s", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateX(4px)"; e.currentTarget.style.boxShadow=`0 4px 20px ${r.border}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.04)"; }}
                  >
                    <div style={{ width:52, height:52, borderRadius:14, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0, boxShadow:`0 2px 8px ${r.border}` }}>
                      {r.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:r.color, marginBottom:3 }}>{r.label}</div>
                      <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.5 }}>{r.desc}</div>
                    </div>
                    <span style={{ color:r.color, fontSize:20, flexShrink:0 }}>→</span>
                  </div>
                ))}
              </div>
              <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:"#9CA3AF" }}>
                Already have an account?{" "}
                <span style={{ color:"#1A56DB", fontWeight:700, cursor:"pointer" }} onClick={() => setPage("login")}>Sign In →</span>
              </p>
            </div>
          )}

          {mode==="signup" && roleSelected && (
            <form onSubmit={handleSignupNext}>

              {/* Selected role badge */}
              {step===1 && (
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:10, padding:"10px 14px", marginBottom:18 }}>
                  <span style={{ fontSize:20 }}>
                    {form.role==="teacher"?"👩‍🏫":form.role==="tutor"?"🧑‍🎓":form.role==="school"?"🏫":"👨‍👩‍👧"}
                  </span>
                  <span style={{ fontWeight:700, fontSize:13, color:"#065F46" }}>
                    Registering as: {form.role==="teacher"?"Teacher / Faculty":form.role==="tutor"?"Private Tutor":form.role==="school"?"School / Institution":"Parent / Guardian"}
                  </span>
                  <button type="button" onClick={() => { setRoleSelected(false); setStep(1); }}
                    style={{ marginLeft:"auto", background:"none", border:"none", color:"#059669", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                    Change
                  </button>
                </div>
              )}

              {/* Step 1 — Basic info */}
              {step===1 && (
                <>
                  <div className="fg"><label className="flabel">{form.role==="school"?"Institute Name":"Full Name"} *</label>
                    <input className="input" placeholder={form.role==="school"?"e.g. Delhi Public School":form.role==="tutor"?"e.g. Ananya Singh":form.role==="parent"?"e.g. Rajesh Sharma":"e.g. Priya Sharma"} value={form.name} onChange={e => up("name", e.target.value)} required />
                  </div>
                  <div className="fg"><label className="flabel">Email Address *</label>
                    <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => up("email", e.target.value)} required />
                  </div>
                  <div className="grid2">
                    <div className="fg">
                      <label className="flabel">Phone Number *</label>
                      <input className="input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => up("phone", e.target.value)} required pattern="[0-9+\s\-]{7,15}" title="Enter a valid phone number" />
                    </div>
                    <div className="fg"><label className="flabel">City *</label>
                      {/* ADDED: City is now a dropdown (filtered by selected State). "Other" reveals the original text input below — nothing removed. */}
                      <select className="input" value={citiesForState(form.state).includes(form.city) ? form.city : (form.city ? "Other" : "")} onChange={e => { const v = e.target.value; if (v === "Other") { up("city", form.city_other || ""); up("city_other", form.city_other || " "); } else { up("city", v); up("city_other", ""); } }}>
                        <option value="">Select City</option>
                        {citiesForState(form.state).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {(form.city_other !== "" || (form.city && !citiesForState(form.state).includes(form.city))) && (
                        <input className="input" style={{ marginTop:8 }} placeholder="Hyderabad" value={form.city} onChange={e => { up("city", e.target.value); up("city_other", e.target.value || " "); }} />
                      )}
                    </div>
                  </div>
                  {/* ADDED: State & Country dropdowns shown right after City */}
                  <div className="grid2">
                    <div className="fg"><label className="flabel">State *</label>
                      <select className="input" value={form.state} onChange={e => { up("state", e.target.value); }}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {form.state === "Other" && (
                        <input className="input" style={{ marginTop:8 }} placeholder="Enter your state" value={form.state_other} onChange={e => up("state_other", e.target.value)} />
                      )}
                    </div>
                    <div className="fg"><label className="flabel">Country *</label>
                      <select className="input" value={form.country} onChange={e => up("country", e.target.value)}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fg"><label className="flabel">Password *</label>
                    <input className="input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => up("password", e.target.value)} required minLength={8} />
                  </div>
                </>
              )}

              {/* Step 2 — Professional details */}
              {step===2 && (form.role==="teacher" || form.role==="tutor") && (
                <>
                  {form.role==="teacher" && (
                    <>
                      <div className="fg"><label className="flabel">Subject Specialization (select one or more)</label>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:8, border:"1px solid #E5E7EB", borderRadius:10, padding:"12px", background:"#FAFBFC" }}>
                          {SUBS.map(s => {
                            const sel = form.subject ? form.subject.split(",").map(x=>x.trim()).filter(Boolean) : [];
                            const on = sel.includes(s);
                            return (
                              <span key={s} onClick={() => up("subject", (on ? sel.filter(x=>x!==s) : [...sel, s]).join(", "))} style={{ ...tutorChip(on), textAlign:"center" }}>{s}</span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid2">
                        <div className="fg"><label className="flabel">Experience</label>
                          <select className="input" value={form.experience} onChange={e => up("experience", e.target.value)}>{EXPS.map(s => <option key={s}>{s}</option>)}</select>
                        </div>
                        <div className="fg"><label className="flabel">Qualification (select one or more)</label>
                          <div style={tutorChipBox}>
                            {QUALS.map(q => (
                              <span key={q} onClick={() => toggleCsv("qualification", q)} style={tutorChip((form.qualification||"").split(",").map(x=>x.trim()).filter(Boolean).includes(q))}>{q}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {form.role==="tutor" && (
                    <>
                      {/* ADDED: Tutor photo upload */}
                      <div className="fg"><label className="flabel">Tutor Photo *</label>
                        <label style={tutorUpload}>
                          <input type="file" accept="image/*" onChange={e => onTutorPhoto(e.target.files && e.target.files[0])} style={{ display:"none" }} />
                          {form.tutor_photo_base64
                            ? <img src={form.tutor_photo_base64} alt="Tutor" style={{ width:84, height:84, borderRadius:"50%", objectFit:"cover", border:"3px solid #C7D2FE" }} />
                            : <span style={{ fontSize:22 }}>📷</span>}
                          <span style={{ fontSize:13, color:"#374151", fontWeight:700 }}>{form.tutor_photo_name ? "Change photo" : "Tap to upload your photo"}</span>
                          <span style={{ fontSize:11, color:"#9CA3AF" }}>JPG or PNG, max 5 MB</span>
                        </label>
                        {form.tutor_photo_name && <div style={{ fontSize:12, color:"#059669", marginTop:7, fontWeight:700 }}>✓ {form.tutor_photo_name} attached</div>}
                      </div>

                      {/* ADDED: Which class can teach — multi select, maximum 3 */}
                      <div className="fg"><label className="flabel">Which Class Can Teach * (select up to 3)</label>
                        <div style={tutorChipBox}>
                          {CLASSES.map(c => (
                            <span key={c} onClick={() => toggleMultiMax("classes_taught", c, 3)} style={tutorChip((form.classes_taught||[]).includes(c))}>{c}</span>
                          ))}
                        </div>
                        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:6 }}>{(form.classes_taught||[]).length}/3 selected</div>
                      </div>

                      <div className="fg"><label className="flabel">Subjects * (select one or more)</label>
                        <div style={tutorChipBox}>
                          {SUBS.map(s => (
                            <span key={s} onClick={() => toggleMulti("subjects", s)} style={tutorChip((form.subjects||[]).includes(s))}>{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="fg"><label className="flabel">Qualifications * (select one or more)</label>
                        <div style={tutorChipBox}>
                          {QUALS.filter(Boolean).map(q => (
                            <span key={q} onClick={() => toggleMulti("qualifications", q)} style={tutorChip((form.qualifications||[]).includes(q))}>{q}</span>
                          ))}
                        </div>
                      </div>

                      <div className="grid2">
                        <div className="fg"><label className="flabel">Experience *</label>
                          <select className="input" value={form.experience} onChange={e => up("experience", e.target.value)}><option value="">Select Experience</option>{EXPS.map(s => <option key={s}>{s}</option>)}</select>
                        </div>
                        <div className="fg"><label className="flabel">Hourly Charges *</label>
                          <input className="input" placeholder="e.g. ₹800/hr" value={form.hourly_rate} onChange={e => up("hourly_rate", e.target.value)} />
                        </div>
                      </div>

                      <div className="grid2">
                        <div className="fg"><label className="flabel">Gender *</label>
                          <select className="input" value={form.gender} onChange={e => up("gender", e.target.value)}>
                            <option value="">Select</option>
                            <option>Male</option><option>Female</option><option>Other</option>
                          </select>
                        </div>
                        <div className="fg"><label className="flabel">Teaching Mode *</label>
                          <select className="input" value={form.teaching_mode} onChange={e => up("teaching_mode", e.target.value)}>
                            <option>Online</option><option>Offline</option><option>Both</option>
                          </select>
                        </div>
                      </div>

                      <div className="fg"><label className="flabel">Available Timings * (select one or more)</label>
                        <div style={tutorChipBox}>
                          {["Morning","Afternoon","Evening","Any Time"].map(t => (
                            <span key={t} onClick={() => toggleMulti("availability", t)} style={tutorChip((form.availability||[]).includes(t))}>{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="fg"><label className="flabel">Address (Optional)</label>
                        <input className="input" placeholder="House no., street, area" value={form.address} onChange={e => up("address", e.target.value)} />
                      </div>

                      <div className="grid2">
                        <div className="fg"><label className="flabel">Location (Optional)</label>
                          <input className="input" placeholder="e.g. Banjara Hills, Hyderabad" value={form.tutor_location} onChange={e => up("tutor_location", e.target.value)} />
                        </div>
                        <div className="fg"><label className="flabel">Pincode (Optional)</label>
                          <input className="input" placeholder="e.g. 500034" value={form.pincode} onChange={e => up("pincode", e.target.value)} />
                        </div>
                      </div>

                      <div className="fg"><label className="flabel">Class Link (Google Meet / Zoom) (Optional)</label>
                        <input className="input" placeholder="https://meet.google.com/..." value={form.class_link} onChange={e => up("class_link", e.target.value)} />
                      </div>

                      {/* ADDED: Courses — multi-select (JEE / FOUNDATION / NEET / IP MAT / CA FOUNDATION) */}
                      <div className="fg"><label className="flabel">Courses * (select one or more)</label>
                        <div style={tutorChipBox}>
                          {["JEE","FOUNDATION","NEET","IP MAT","CA FOUNDATION"].map(c => (
                            <span key={c} onClick={() => toggleMulti("tutor_courses", c)} style={tutorChip((form.tutor_courses||[]).includes(c))}>{c}</span>
                          ))}
                        </div>
                      </div>

                      {/* ADDED: Demo class link (YouTube / Instagram) */}
                      <div className="fg"><label className="flabel">Demo Class Link (YouTube / Instagram) (Optional)</label>
                        <input className="input" placeholder="https://youtube.com/...  or  https://instagram.com/..." value={form.demo_class_link} onChange={e => up("demo_class_link", e.target.value)} />
                      </div>

                      {/* ADDED: Write about yourself in ~300 words (required) */}
                      <div className="fg"><label className="flabel">Write About Yourself (in 300 words) *</label>
                        <textarea className="input" rows={7} placeholder="Tell students & parents about your teaching journey, style, achievements, and what makes you a great tutor... (aim for around 300 words)" value={form.about_yourself} onChange={e => up("about_yourself", e.target.value)} />
                        {(() => {
                          const wc = (form.about_yourself || "").trim().split(/\s+/).filter(Boolean).length;
                          const over = wc > 300;
                          return <div style={{ fontSize:12, marginTop:6, fontWeight:700, color: over ? "#DC2626" : (wc >= 250 ? "#059669" : "#9CA3AF") }}>{wc} / 300 words{over ? " — a little over 300, please trim" : ""}</div>;
                        })()}
                      </div>

                      <div className="fg"><label className="flabel">Resume / CV *</label>
                        <label style={tutorUpload}>
                          <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={e => onResume(e.target.files && e.target.files[0])} style={{ display:"none" }} />
                          <span style={{ fontSize:22 }}>📄</span>
                          <span style={{ fontSize:13, color:"#374151", fontWeight:700 }}>{form.resume_name ? "Change file" : "Tap to upload your resume"}</span>
                          <span style={{ fontSize:11, color:"#9CA3AF" }}>PDF, DOC or image</span>
                        </label>
                        {form.resume_name && <div style={{ fontSize:12, color:"#059669", marginTop:7, fontWeight:700 }}>✓ {form.resume_name} attached</div>}
                      </div>

                      {/* ADDED: Tutor Registration — Terms & Conditions (must be accepted) */}
                      <div className="fg"><label className="flabel">Terms &amp; Conditions *</label>
                        <div style={{ border:"1px solid #E5E7EB", borderRadius:12, padding:"14px 16px", background:"#FAFBFC", maxHeight:220, overflowY:"auto" }}>
                          <div style={{ fontSize:14, fontWeight:800, color:"#111827", marginBottom:10 }}>Tutor Registration – Terms &amp; Conditions</div>
                          <ol style={{ margin:0, paddingLeft:20, color:"#374151", fontSize:13, lineHeight:1.7 }}>
                            <li>I confirm that the information provided during registration is true and accurate.</li>
                            <li>I agree to upload only valid and genuine documents.</li>
                            <li>My profile will be reviewed and approved by the AcadHR team before it becomes active.</li>
                            <li>Registering on AcadHR does not guarantee job placement or student assignments.</li>
                            <li>I agree to maintain professional and respectful behavior with students, parents, and schools.</li>
                            <li>I understand that my profile information (such as my name, qualifications, subjects, experience, location, and contact details, where applicable) may be shared with parents or schools to help them find suitable tutors. I consent to this sharing.</li>
                            <li>I will keep my profile and contact information updated.</li>
                            <li>I am responsible for all activities carried out through my account.</li>
                            <li>AcadHR reserves the right to reject, suspend, or remove my profile if any false information or policy violation is found.</li>
                            <li>By registering, I accept these Terms &amp; Conditions and the AcadHR Privacy Policy.</li>
                          </ol>
                        </div>
                        <label style={{ display:"flex", alignItems:"flex-start", gap:10, marginTop:12, cursor:"pointer" }}>
                          <input type="checkbox" checked={!!form.tutor_terms_accepted} onChange={e => up("tutor_terms_accepted", e.target.checked)} style={{ width:18, height:18, marginTop:2, cursor:"pointer", flexShrink:0 }} />
                          <span style={{ fontSize:13, color:"#374151", fontWeight:600 }}>I have read and agree to the Terms &amp; Conditions. *</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* CHANGED per request: Short Bio hidden for tutors (kept for teachers — not deleted) */}
                  {form.role !== "tutor" && (
                  <div className="fg"><label className="flabel">{(form.role==="teacher" || form.role==="tutor") ? "Short Bio *" : "Short Bio (Optional)"}</label>
                    <textarea className="input" rows={3} placeholder="Tell schools about yourself..." value={form.bio} onChange={e => up("bio", e.target.value)} />
                  </div>
                  )}
                </>
              )}
              {step===2 && form.role==="school" && (
                <>
                  <div className="fg"><label className="flabel">Institute Type</label>
                    <select className="input" value={form.institute_type} onChange={e => up("institute_type", e.target.value)}>{ITYPES.map(s => <option key={s}>{s}</option>)}</select>
                  </div>
                  <div className="grid2">
                    <div className="fg"><label className="flabel">Est. Year</label><input className="input" type="number" placeholder="e.g. 1995" value={form.est_year} onChange={e => up("est_year", e.target.value)} /></div>
                    <div className="fg"><label className="flabel">No. of Students</label>
                      <select className="input" value={form.student_count} onChange={e => up("student_count", e.target.value)}>
                        <option>Under 500</option><option>500-1,000</option><option>1,000-3,000</option><option>3,000+</option>
                      </select>
                    </div>
                  </div>
                  <div className="fg"><label className="flabel">Website (Optional)</label><input className="input" placeholder="https://yourschool.edu.in" value={form.website} onChange={e => up("website", e.target.value)} /></div>
                </>
              )}

              {step===2 && form.role==="parent" && (
                <>
                  <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#1E429F", fontWeight:600 }}>
                    👨‍👩‍👧 Tell us about your child & tutor requirement
                  </div>

                  <div className="grid2">
                    <div className="fg"><label className="flabel">Student Name *</label>
                      <input className="input" placeholder="Child's full name" value={form.student_name} onChange={e => up("student_name",e.target.value)} required />
                    </div>
                    <div className="fg"><label className="flabel">Class / Grade *</label>
                      <select className="input" value={form.student_class} onChange={e => up("student_class",e.target.value)} required>
                        <option value="">Select class</option>
                        {["Pre-Primary (Nursery–KG)","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5",
                          "Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Degree"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Course(s) (select all that apply)</label>
                    <div style={tutorChipBox}>
                      {["JEE","NEET","Foundation","Olympiad","School Tuition","Spoken English","Coding / Programming","Competitive Exams","Abacus / Vedic Maths","Hobby Classes"].map(c => (
                        <span key={c} onClick={() => toggleMulti("parent_courses", c)} style={tutorChip((form.parent_courses||[]).includes(c))}>{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Board</label>
                    <select className="input" value={form.board_pref} onChange={e => up("board_pref",e.target.value)}>
                      <option value="">Select board</option>
                      <option>CBSE</option><option>ICSE</option><option>State Board (AP)</option>
                      <option>State Board (TS)</option><option>IB</option><option>IGCSE</option>
                    </select>
                  </div>

                  <div className="fg"><label className="flabel">Subject(s) Required * (select all that apply)</label>
                    <div style={tutorChipBox}>
                      {SUBS.map(s => (
                        <span key={s} onClick={() => toggleMulti("parent_subjects", s)} style={tutorChip((form.parent_subjects||[]).includes(s))}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Location / Area</label>
                    <input className="input" placeholder="e.g. Banjara Hills, Hyderabad" value={form.location_pref} onChange={e => up("location_pref",e.target.value)} />
                  </div>

                  <div className="grid2">
                    <div className="fg"><label className="flabel">State</label>
                      <input className="input" placeholder="e.g. Telangana" value={form.parent_state} onChange={e => up("parent_state",e.target.value)} />
                    </div>
                    <div className="fg"><label className="flabel">Pincode</label>
                      <input className="input" placeholder="e.g. 500034" value={form.parent_pincode} onChange={e => up("parent_pincode",e.target.value)} />
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Landmark / Area</label>
                    <input className="input" placeholder="e.g. Near City Center Mall" value={form.parent_landmark} onChange={e => up("parent_landmark",e.target.value)} />
                  </div>

                  <div className="fg"><label className="flabel">School / College / Institute Name</label>
                    <input className="input" placeholder="e.g. Delhi Public School" value={form.institute_name} onChange={e => up("institute_name",e.target.value)} />
                  </div>

                  <div className="fg"><label className="flabel">Tutoring Mode</label>
                    <div style={{ display:"flex", gap:10, marginTop:6 }}>
                      {["Home","Online","Offline & Online"].map(m => (
                        <label key={m} onClick={() => up("mode_pref",m)}
                          style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"9px 0", borderRadius:10, border:`2px solid ${form.mode_pref===m?"#1A56DB":"#E5E7EB"}`, background:form.mode_pref===m?"#EBF5FF":"#F9FAFB", cursor:"pointer", fontSize:13, fontWeight:700, color:form.mode_pref===m?"#1A56DB":"#6B7280", userSelect:"none" }}>
                          {m==="Home"?"🏠":m==="Online"?"💻":"🔄"} {m}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Preferred Time (select all that apply)</label>
                    <div style={tutorChipBox}>
                      {["Morning","Afternoon","Evening","Any time"].map(t => (
                        <span key={t} onClick={() => toggleMulti("preferred_times", t)} style={tutorChip((form.preferred_times||[]).includes(t))}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Preferred Days (select all that apply)</label>
                    <div style={tutorChipBox}>
                      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
                        <span key={d} onClick={() => toggleMulti("parent_days", d)} style={tutorChip((form.parent_days||[]).includes(d))}>{d}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid2">
                    <div className="fg"><label className="flabel">Monthly Budget (₹)</label>
                      <select className="input" value={form.budget} onChange={e => up("budget",e.target.value)}>
                        <option value="">Select range</option>
                        <option>Under ₹2,000</option><option>₹2,000–₹4,000</option>
                        <option>₹4,000–₹6,000</option><option>₹6,000–₹10,000</option>
                        <option>Above ₹10,000</option>
                      </select>
                    </div>
                    <div className="fg"><label className="flabel">Hourly Budget (₹)</label>
                      <input className="input" type="number" min="0" placeholder="e.g. 500" value={form.hourly_budget} onChange={e => up("hourly_budget",e.target.value)} />
                    </div>
                  </div>

                  <div className="grid2">
                    <div className="fg"><label className="flabel">Tutor Gender Preference</label>
                      <select className="input" value={form.tutor_gender_pref} onChange={e => up("tutor_gender_pref",e.target.value)}>
                        <option value="">No Preference</option>
                        <option>Male</option><option>Female</option>
                      </select>
                    </div>
                    <div className="fg"><label className="flabel">Experience Required</label>
                      <select className="input" value={form.experience_req} onChange={e => up("experience_req",e.target.value)}>
                        <option value="">Any</option>
                        <option>Fresher OK</option><option>1+ Years</option>
                        <option>2+ Years</option><option>3+ Years</option><option>5+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div className="fg"><label className="flabel">Additional Notes</label>
                    <textarea className="input" rows={3} placeholder="Any special requirements or notes..." value={form.lead_notes} onChange={e => up("lead_notes",e.target.value)} />
                  </div>
                </>
              )}

              {/* Step 3 — OTP verification */}
              {step===3 && (
                <div>
                  <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:22 }}>📧</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#1E429F" }}>OTP sent to your email</div>
                      <div style={{ fontSize:13, color:"#1A56DB" }}>{form.email}</div>
                      <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>Enter the 6-digit code to verify and create your account.</div>
                    </div>
                  </div>

                  <div className="fg">
                    <label className="flabel">6-Digit Verification Code</label>
                    <OtpBoxes arr={otpInput} setter={setOtpInput} prefix="signup" disabled={otpLoading} onChangeFn={handleOtpChange} onKeyDownFn={handleOtpKeyDown} />
                  </div>

                  {otpErr && <div className="alert a-err">{otpErr}</div>}

                  <button type="button" className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px", marginBottom:12, background:"#059669" }}
                    disabled={otpLoading} onClick={handleVerifySignupOtp}>
                    {otpLoading ? <Spinner /> : "Verify & Create Account 🎉"}
                  </button>

                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#9CA3AF" }}>
                    <span style={{ cursor:"pointer", color:"#374151" }} onClick={() => { setStep(2); setOtpInput(["","","","","",""]); setOtpErr(""); setOtpSent(false); }}>
                      ← Back
                    </span>
                    {resendTimer > 0
                      ? <span>Resend in {resendTimer}s</span>
                      : <span style={{ color:"#1A56DB", cursor:"pointer", fontWeight:700 }} onClick={handleResendSignupOtp}>Resend OTP</span>
                    }
                  </div>
                </div>
              )}

              {/* Nav buttons (steps 1 & 2) */}
              {step < 3 && (
                <div style={{ display:"flex", gap:10, marginTop:16 }}>
                  {step===2 && <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:"center" }} onClick={() => { setStep(1); setErr(""); }}>← Back</button>}
                  <button className="btn btn-primary" style={{ flex:2, justifyContent:"center", padding:"13px" }} disabled={otpLoading || loading}>
                    {otpLoading ? <Spinner /> : step===1 ? "Continue →" : "Send OTP & Verify →"}
                  </button>
                </div>
              )}
            </form>
          )}

          <div style={{ textAlign:"center", marginTop:22, color:"#9CA3AF", fontSize:13 }}>
            {mode==="login"
              ? <span>New to AcadHr? <span style={{ color:"#1A56DB", cursor:"pointer", fontWeight:700 }} onClick={() => setPage("signup")}>Create free account</span></span>
              : <span>Already have an account? <span style={{ color:"#1A56DB", cursor:"pointer", fontWeight:700 }} onClick={() => setPage("login")}>Sign in</span></span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════════════════════════════════════════ */

// ── Reusable FilterBar component ─────────────────────────────────────────────

export default AuthPage;

