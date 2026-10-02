// ─── AcadHr <JobsTicker /> ─────────────────────────────────────────────────────
// NEW, self-contained. A horizontal RIGHT-TO-LEFT auto-scrolling strip taken live
// from the database via the existing public endpoints. Meant to sit just under a
// browse-page banner.
//   type="jobs"     → latest approved jobs        (/jobs)
//   type="tuitions" → latest tuition requirements (/admin/public/tuitions)
//   type="tutors"   → featured tutors             (/admin/public/tutors)
// If there is nothing to show it renders nothing. Nothing existing is touched.

import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CONF = {
  jobs:     { url: `${API}/jobs`,                   label: "Latest Jobs",     ico: "💼", tag: "Hiring",  tagCls: "hiring" },
  tuitions: { url: `${API}/admin/public/tuitions`,  label: "Latest Tuitions", ico: "📚", tag: "Tuition", tagCls: "tuition" },
  tutors:   { url: `${API}/admin/public/tutors`,    label: "Featured Tutors", ico: "🧑‍🎓", tag: "Tutor",   tagCls: "tutor" },
};

const first = (v, n) => {
  const a = String(v || "").split(",").map(s => s.trim()).filter(Boolean);
  return (!n || a.length <= n) ? a.join(", ") : a.slice(0, n).join(", ") + "…";
};

export default function JobsTicker({ setPage, type = "jobs", limit = 12 }) {
  const conf = CONF[type] || CONF.jobs;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let alive = true;
    fetch(conf.url)
      .then(r => (r.ok ? r.json() : []))
      .then(d => {
        if (!alive) return;
        let list = Array.isArray(d) ? d : [];
        if (type === "jobs") {
          list = list.filter(j => String(j.status || "").toLowerCase() === "approved");
        }
        setRows(list.slice(0, limit));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [conf.url, type, limit]);

  if (rows.length === 0) return null;

  const goTo = type === "tuitions" ? "tuitions" : type === "tutors" ? "tutors" : "jobs";
  const go = () => { if (setPage) setPage(goTo); };

  // Build the three display lines per row depending on the type.
  const build = (r) => {
    if (type === "tuitions") {
      const title = [r.student_class ? `Class ${r.student_class}` : "", first(r.subject, 2)].filter(Boolean).join(" ") || "Tuition Requirement";
      const sub = r.name || "Parent / Guardian";
      const loc = r.location || r.user_city || "";
      const extra = r.mode || r.board || "";
      return { title, sub, m1: loc, m1ico: "📍", m2: extra, m2ico: "🎓" };
    }
    if (type === "tutors") {
      const title = r.name || "Private Tutor";
      const sub = first(r.subjects || r.subject, 2) || "Tutor";
      const loc = r.location || r.city || "";
      const exp = r.experience || "";
      return { title, sub, m1: loc, m1ico: "📍", m2: exp, m2ico: "⏳" };
    }
    // jobs
    const title = r.title || `${r.requirement_type || "Teacher"}${r.subject ? " — " + first(r.subject, 1) : ""}`;
    const sub = r.institution_name || r.posted_by_name || "AcadHr Partner School";
    const loc = [r.location_city, r.location_state].filter(Boolean).join(", ");
    const subject = first(r.subject, 2);
    return { title, sub, m1: loc, m1ico: "📍", m2: subject, m2ico: "📚" };
  };

  const Card = ({ r }) => {
    const d = build(r);
    return (
      <div className="jobsticker-card" onClick={go} title="View more">
        <span className="jobsticker-ico">{conf.ico}</span>
        <div className="jobsticker-body">
          <div className="jobsticker-title">{d.title}</div>
          <div className="jobsticker-school">{d.sub}</div>
          <div className="jobsticker-meta">
            {d.m1 && <span>{d.m1ico} {d.m1}</span>}
            {d.m2 && <span>{d.m2ico} {d.m2}</span>}
          </div>
        </div>
        <span className={`jobsticker-tag ${conf.tagCls}`}>{conf.tag}</span>
      </div>
    );
  };

  return (
    <div className="jobsticker">
      <div className="jobsticker-label">
        <span className="jobsticker-dot" /> {conf.label}
      </div>
      <div className="jobsticker-viewport">
        <div className="jobsticker-track">
          {[...rows, ...rows].map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
    </div>
  );
}
