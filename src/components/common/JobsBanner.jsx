// ─── AcadHr <JobsBanner /> ────────────────────────────────────────────────────
// NEW, self-contained. Shows the latest posted (approved) jobs on the Home page as
// a rotating banner. All text comes from the database via the existing public
// /jobs endpoint. The teacher photo changes on every job. Constant height across
// jobs. If there are no approved jobs it renders nothing. Nothing existing is touched.

import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// A pool of people photos so a different face shows on each job.
const PHOTOS = [
  "/job-teacher-1.jpg",
  "/job-teacher-2.jpg",
  "/job-teacher-3.jpg",
  "/job-teacher-4.jpg",
  "/job-teacher-5.jpg",
  "/job-teacher-6.jpg",
  "/job-teacher-7.jpg",
  "/jobs-banner-teacher.jpg",
];

export default function JobsBanner({ setPage, rotateMs = 6000, limit = 6 }) {
  const [jobs, setJobs] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/jobs`)
      .then(r => r.ok ? r.json() : [])
      .then(d => {
        if (!alive) return;
        const approved = (Array.isArray(d) ? d : [])
          .filter(j => String(j.status || "").toLowerCase() === "approved")
          .slice(0, limit);
        setJobs(approved);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [limit]);

  useEffect(() => {
    if (jobs.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % jobs.length), rotateMs);
    return () => clearInterval(t);
  }, [jobs, rotateMs]);

  // ADDED: warm the browser cache so photo rotations are instant (no flash / wait)
  useEffect(() => {
    PHOTOS.forEach(src => { const im = new Image(); im.decoding = "async"; im.src = encodeURI(src); });
  }, []);

  if (jobs.length === 0) return null;

  const j = jobs[idx % jobs.length];
  const photo = PHOTOS[idx % PHOTOS.length];
  const loc = [j.location_city, j.location_state].filter(Boolean).join(", ");
  const title = j.title || `${j.requirement_type || "Teacher"}${j.subject ? " — " + j.subject : ""}`;
  const school = j.institution_name || j.posted_by_name || "AcadHr Partner School";
  const goApply = () => { if (setPage) setPage("jobs"); };

  const NAVY = "#12327A", BLUE = "#1A56DB";
  const dots = "radial-gradient(#9DBBF5 2px, transparent 2px)";

  // one-line rows, so every job keeps the same height
  const Row = ({ icon, label, green }) => (
    <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: "clamp(13px,1.4vw,15.5px)",
      color: green ? "#059669" : "#1F2937", fontWeight: green ? 800 : 500, lineHeight: 1.5 }}>
      <span style={{ flex: "0 0 auto", fontSize: 17 }}>{icon}</span>
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );

  const feats = [
    ["🛡️", "Top Schools & Institutions"],
    ["👥", "Multiple Teaching Roles"],
    ["📈", "Build Your Teaching Career"],
    ["📍", "Opportunities Across India"],
  ];

  return (
    <section style={{ background: "#EEF4FF", padding: "34px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "inline-block", background: "#fff", color: BLUE, fontWeight: 800, fontSize: 12.5, letterSpacing: ".5px", textTransform: "uppercase", padding: "6px 16px", borderRadius: 999, boxShadow: "0 4px 12px rgba(20,50,120,.08)" }}>🔥 Latest Job Openings</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 18px 50px rgba(26,86,219,.14)", border: "1px solid #E7EEF9" }}>
          {/* main row */}
          <div className="jobsbanner-main" style={{ display: "flex", flexWrap: "wrap" }}>

            {/* LEFT — details from the database (does NOT grow, so no empty gap in the middle) */}
            <div style={{ flex: "0 1 540px", minWidth: 0, padding: "clamp(20px,2.4vw,34px)", position: "relative" }}>
              {/* faint dotted accent to fill the left area nicely */}
              <div style={{ position: "absolute", top: 18, right: 22, width: 74, height: 46, backgroundImage: dots, backgroundSize: "12px 12px", opacity: .5, pointerEvents: "none" }} />
              {/* title — reserve 2 lines for constant height */}
              <div style={{ fontSize: "clamp(21px,2.9vw,32px)", fontWeight: 900, color: NAVY, lineHeight: 1.14,
                minHeight: "2.28em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{title}</div>
              <div style={{ fontSize: "clamp(15px,1.8vw,20px)", fontWeight: 800, color: BLUE, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{school}</div>

              {/* rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "16px 0 20px" }}>
                <Row icon="📍" label={loc || "—"} />
                <Row icon="📚" label={j.subject || "—"} />
                <Row icon="🏫" label={`Board: ${j.board || "—"}`} />
                <Row icon="📖" label={`Grades: ${j.grades || "—"}`} />
                <Row icon="🎓" label={`Experience: ${j.experience || "—"}`} />
                <Row icon="📅" label={`Joining: ${j.joining_timeline || "—"}`} />
                <Row icon="👥" label={j.positions ? `${j.positions} position${Number(j.positions) === 1 ? "" : "s"}` : "—"} green />
              </div>

              <button onClick={goApply}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg,#1A56DB,#12327A)", color: "#fff", border: "none", borderRadius: 999, padding: "13px 34px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 22px rgba(26,86,219,.32)" }}>
                Apply Now →
              </button>
            </div>

            {/* RIGHT — photo grows to fill the remaining width (removes the middle white space) */}
            <div className="jobsbanner-photo" style={{ flex: "1 1 380px", minWidth: 0, position: "relative", background: "linear-gradient(135deg,#1A56DB,#12327A)", minHeight: 300, overflow: "hidden" }}>
              <img src={encodeURI(photo)} alt="Teacher" decoding="async"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                onError={e => { e.currentTarget.style.display = "none"; }} />
              {/* dotted grid + doodles over the photo */}
              <div style={{ position: "absolute", top: 16, right: 22, width: 84, height: 54, backgroundImage: dots, backgroundSize: "13px 13px", opacity: .5, zIndex: 2 }} />
              <span style={{ position: "absolute", top: "12%", right: 20, fontSize: 26, opacity: .35, color: "#fff", zIndex: 2 }}>💡</span>
              <span style={{ position: "absolute", top: "40%", right: 18, fontSize: 24, opacity: .3, color: "#fff", zIndex: 2 }}>🌐</span>
              <span style={{ position: "absolute", top: "66%", right: 22, fontSize: 24, opacity: .3, color: "#fff", zIndex: 2 }}>🧪</span>
              {/* curved white swoosh on the left edge */}
              <svg viewBox="0 0 120 300" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: -1, height: "100%", width: 84, zIndex: 3 }}>
                <path d="M120,0 C40,60 40,240 120,300 L0,300 L0,0 Z" fill="#ffffff" />
              </svg>
              <div style={{ position: "absolute", top: -36, left: 26, width: 120, height: 120, borderRadius: "50%", border: "6px solid rgba(255,255,255,.35)", zIndex: 4 }} />
            </div>
          </div>

          {/* bottom feature strip */}
          <div style={{ background: "linear-gradient(90deg,#1A56DB,#12327A)", padding: "15px clamp(16px,3vw,34px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
            {feats.map(([ic, txt]) => (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
                <span style={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{ic}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{txt}</span>
              </div>
            ))}
          </div>
        </div>

        {jobs.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 16 }}>
            {jobs.map((_, i) => (
              <span key={i} onClick={() => setIdx(i)}
                style={{ width: i === idx ? 24 : 9, height: 9, borderRadius: 999, background: i === idx ? BLUE : "#C7D2E0", transition: "all .2s", cursor: "pointer" }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
