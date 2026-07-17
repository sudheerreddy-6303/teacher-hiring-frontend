import { useState, useEffect } from "react";
import apiBase from "../config/apiBase";

/* ──────────────────────────────────────────────────────────────────────────
   Public single-profile view. Opened by the WhatsApp share links the admin
   sends (URL: ?profile=<role>&id=<id>). It fetches the matching public list,
   picks out the one record by id, and shows ONLY that person's details.
   Read-only — no editing, no auth required.
─────────────────────────────────────────────────────────────────────────── */

const ROLE_CFG = {
  teacher: {
    endpoint: "teachers", emoji: "👩‍🏫", label: "Teacher Profile", color: "#1A56DB", bg: "#EBF5FF",
    name: (r) => r.full_name || r.name,
    subtitle: (r) => [r.specialization, r.current_location || r.city].filter(Boolean).join(" · "),
    fields: [
      ["Specialization", (r) => r.specialization],
      ["Subjects", (r) => r.subjects],
      ["Qualification", (r) => r.qualification],
      ["Experience", (r) => r.total_experience],
      ["Current Role", (r) => r.current_role],
      ["Current Organisation", (r) => r.current_org],
      ["Location", (r) => r.current_location || r.city],
      ["Preferred Locations", (r) => r.preferred_locations],
      ["Teaching Mode", (r) => r.teaching_mode || r.work_mode],
      ["Languages", (r) => r.languages],
      ["Boards", (r) => r.boards_handled],
      ["Grades", (r) => r.grades_handling],
      ["Email", (r) => r.email],
      ["Phone", (r) => r.mobile || r.phone],
    ],
  },
  tutor: {
    endpoint: "tutors", emoji: "🧑‍🎓", label: "Tutor Profile", color: "#6D28D9", bg: "#F5F3FF",
    name: (r) => r.name,
    subtitle: (r) => [r.subjects || r.subject, r.city || r.location].filter(Boolean).join(" · "),
    fields: [
      ["Subjects", (r) => r.subjects || r.subject],
      ["Qualifications", (r) => r.qualifications || r.qualification],
      ["Experience", (r) => r.experience],
      ["Hourly Rate", (r) => r.hourly_rate],
      ["Teaching Mode", (r) => r.teaching_mode],
      ["Availability", (r) => r.availability],
      ["City", (r) => r.city || r.location],
      ["Bio", (r) => r.bio],
      ["Email", (r) => r.email],
      ["Phone", (r) => r.phone],
    ],
  },
  school: {
    endpoint: "schools", emoji: "🏫", label: "Institution", color: "#0EA5E9", bg: "#E0F2FE",
    name: (r) => r.institute_name || r.name,
    subtitle: (r) => [r.institute_type, r.city].filter(Boolean).join(" · "),
    fields: [
      ["Institution Type", (r) => r.institute_type],
      ["City", (r) => r.city],
      ["Established", (r) => r.est_year],
      ["Students", (r) => r.student_count],
      ["Website", (r) => r.website],
      ["Live Jobs", (r) => r.live_jobs],
      ["Email", (r) => r.email],
      ["Phone", (r) => r.phone],
    ],
  },
  parent: {
    endpoint: "parents", emoji: "👪", label: "Tuition Requirement", color: "#D97706", bg: "#FFFBEB",
    name: (r) => r.name,
    subtitle: (r) => [r.subject, r.location || r.city].filter(Boolean).join(" · "),
    fields: [
      ["Student", (r) => r.student_name],
      ["Class", (r) => r.student_class],
      ["Board", (r) => r.board],
      ["Subject(s)", (r) => r.subject],
      ["Mode", (r) => r.mode],
      ["Preferred Time", (r) => r.preferred_time],
      ["Budget", (r) => r.budget || r.hourly_budget],
      ["Location", (r) => r.location || r.city],
      ["Email", (r) => r.email],
      ["Phone", (r) => r.phone],
    ],
  },
};

export default function PublicProfile({ role, id }) {
  const cfg = ROLE_CFG[role];
  const [record, setRecord] = useState(null);
  const [state, setState]   = useState("loading"); // loading | ok | notfound | error

  useEffect(() => {
    if (!cfg) { setState("notfound"); return; }
    let alive = true;
    fetch(`${apiBase()}/admin/public/${cfg.endpoint}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (!alive) return;
        const found = Array.isArray(rows) ? rows.find((x) => String(x.id) === String(id)) : null;
        if (found) { setRecord(found); setState("ok"); }
        else setState("notfound");
      })
      .catch(() => { if (alive) setState("error"); });
    return () => { alive = false; };
  }, [role, id]);

  const goHome = () => {
    if (typeof window !== "undefined") window.location.href = window.location.origin + window.location.pathname;
  };

  const accent = cfg ? cfg.color : "#1A56DB";

  return (
    <div className="public-profile-page" style={{ minHeight:"100vh", background:"#F8FAFC", fontFamily:"Nunito,sans-serif" }}>
      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div onClick={goHome} style={{ fontWeight:900, fontSize:20, color:"#1A56DB", cursor:"pointer", letterSpacing:.3 }}>
          Acad<span style={{ color:"#0EA5E9" }}>Hr</span>
        </div>
        <button onClick={goHome}
          style={{ background:"#EBF5FF", color:"#1A56DB", border:"1px solid #BFDBFE", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
          Visit AcadHr →
        </button>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"28px 16px 60px" }}>
        {state === "loading" && (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#9CA3AF" }}>
            <div style={{ width:44, height:44, border:"3px solid #E5E7EB", borderTopColor:accent, borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
            Loading profile…
          </div>
        )}

        {state === "notfound" && (
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E5E7EB", padding:"48px 24px", textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
            <div style={{ fontWeight:800, fontSize:18, color:"#111827", marginBottom:8 }}>Profile not available</div>
            <p style={{ color:"#6B7280", fontSize:14, marginBottom:22 }}>This profile may have been removed or the link is incorrect.</p>
            <button onClick={goHome} style={{ background:accent, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Go to AcadHr</button>
          </div>
        )}

        {state === "error" && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:14, padding:"22px", color:"#DC2626", fontWeight:700, textAlign:"center" }}>
            Could not load this profile. Please try again later.
          </div>
        )}

        {state === "ok" && record && cfg && (
          <div style={{ background:"#fff", borderRadius:18, border:"1px solid #E5E7EB", overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,.06)" }}>
            {/* Header */}
            <div style={{ background:`linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, padding:"26px 28px", color:"#fff" }}>
              <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, opacity:.9, marginBottom:6 }}>{cfg.emoji} {cfg.label}</div>
              <div style={{ fontSize:24, fontWeight:900, lineHeight:1.15 }}>{cfg.name(record) || "—"}</div>
              {cfg.subtitle(record) && <div style={{ fontSize:14, opacity:.92, marginTop:6 }}>{cfg.subtitle(record)}</div>}
            </div>

            {/* Details */}
            <div style={{ padding:"20px 28px 28px" }}>
              {cfg.fields
                .map(([label, get]) => [label, get(record)])
                .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
                .map(([label, value]) => (
                  <div key={label} style={{ display:"flex", gap:14, padding:"11px 0", borderBottom:"1px solid #F3F4F6" }}>
                    <div style={{ width:160, flexShrink:0, fontSize:12.5, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.4 }}>{label}</div>
                    <div style={{ fontSize:14, color:"#111827", fontWeight:600, wordBreak:"break-word", flex:1 }}>{String(value)}</div>
                  </div>
                ))}
              <div style={{ marginTop:22, textAlign:"center" }}>
                <button onClick={goHome}
                  style={{ background:accent, color:"#fff", border:"none", borderRadius:10, padding:"11px 26px", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
                  Explore more on AcadHr →
                </button>
              </div>
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", color:"#9CA3AF", fontSize:12, marginTop:22 }}>Shared via AcadHr · India's Education Hiring Platform</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
