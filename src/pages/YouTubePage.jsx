// ─── AcadHr <YouTubePage /> ───────────────────────────────────────────────────
// NEW page. Shows ALL AcadHR YouTube videos as a thumbnail grid; clicking a video
// plays it in a modal (embedded player). Search box filters by title.
// Reached from the navbar "YouTube" link. Nothing existing is changed.

import { useState } from "react";
import { Navbar, Brand, Divider } from "../components/common/Shared";

// Channel URL — update if your handle changes.
const CHANNEL_URL = "https://www.youtube.com/@acadhr/videos";

const VIDEOS = [
  { id: "SO-EBxPhYpc", title: "5 years. Different classrooms. Different students. One big realization." },
  { id: "vlY4XQuZ2jI", title: "One-on-One Online Tuitions for Students in US, UK, Australia and Middle East" },
  { id: "JgayIMA82o8", title: "Whether you're a graduate or passionate educator, there are opportunities waiting for you" },
  { id: "dD0GzdOOoIc", title: "Curriculum Alignment: Targeted Lessons" },
  { id: "pmdcYtWIH1o", title: "READY? OLYMPIAD NOVEMBER 2026 — Are You Ready?" },
  { id: "mTs948Hx0uo", title: "Class 11 Biology students — ye PDF save kar lo!" },
  { id: "Jh-YjhwylCE", title: "Class 11 Biology students — Board exam ke liye chapter" },
  { id: "xBquSE0rZGs", title: "Class 12 Physics Half-Yearly Exams are approaching!" },
  { id: "KKjYvLtaXbs", title: "PCB is too vast to remember everything." },
  { id: "UWwK3fTajTs", title: "From 400 to 600+: The Missing Piece in Your Prep" },
  { id: "3Q_cp0YxaRw", title: "30 days left for exams and syllabus still pending?" },
  { id: "-njCwGWmZfM", title: "Why top tutors are getting booked 3x faster this month" },
  { id: "OQ7jCA-8gz0", title: "Can kids understand EBITDA in 60 seconds?" },
  { id: "Vz8cMeMUnB8", title: "How to make ₹45,000+/month by teaching just 3 hours a day" },
  { id: "QhvjWAzvtfM", title: "Tired of paying ₹1K–2K for invalid contacts or fake student requirements?" },
  { id: "8jhYfiM-U8U", title: "Stop wasting weeks on ghost job postings and unverified agencies" },
  { id: "euRdkNN-GPo", title: "Are you a Teacher or Tutor looking to teach online?" },
  { id: "QIOT75UXTd0", title: "Is your school looking for qualified teachers, lecturers or academic leaders?" },
  { id: "TtdAxVJPioo", title: "Major update for NEET UG aspirants! MCC Round 1 Final Seat Allotment Results" },
  { id: "ffNIjCg0VHw", title: "Class 12 Chemistry Board Exam" },
  { id: "LYw9j9V0zI4", title: "Don't let festive days turn into stressful study backlogs!" },
  { id: "y27YYBxo_S4", title: "Stop wasting 3 minutes per numerical!" },
  { id: "yMH0F925KVc", title: "The first 15 minutes of reading time set the entire pace of your board exam!" },
  { id: "woNwZYnZI6o", title: "CBE = सिर्फ़ रटने की नहीं, समझकर apply करने की तैयारी!" },
  { id: "b6opjenHxio", title: "Assertion-Reason questions cause the most silly mistakes in NTA exams!" },
  { id: "tBr9Us63T6Q", title: "Board examiners spend less than 3 minutes per copy!" },
  { id: "oleot-GhU5I", title: "Board Exam Notifications You Shouldn't Miss!" },
  { id: "qAkB_qDb5nc", title: "Stop wasting hours on low-yield chapters!" },
  { id: "0KPNhwhqIME", title: "NEET 2027 aspirants — Organic Chemistry can become highly scoring with the right strategy" },
  { id: "uyhZVxc2SD4", title: "JEE MAIN 2027 Exam Date Announced!" },
  { id: "tgjGKoRmVko", title: "Important Topics of CBSE Chemistry" },
  { id: "r1O6QcVakaQ", title: "MCC NEET UG Round 1 Seat Allotment — Result 2026 OUT!" },
  { id: "-yR6Cc6YI58", title: "CBSE Class 10 Chemistry — Chemical Reactions & Equations" },
  { id: "E4GfM8mw1bk", title: "CBSE Latest Update: 33% Marks" },
  { id: "fpPgVWApzLk", title: "Board Exam Notifications You Shouldn't Miss" },
  { id: "8m69wLNAqFk", title: "Board Exam Mistakes You Must Avoid" },
  { id: "hBNBQ09oHZ4", title: "CBSE Students & Parents — Important" },
  { id: "iMepNbEtj80", title: "JEE Chemistry: 10 Chapters You CANNOT Ignore!" },
  { id: "JEdIWYy9br0", title: "CBSE Students & Parents — Important" },
  { id: "Jr5kXMzETxM", title: "NEET 2026 result is out. What's next?" },
  { id: "jjnGkxs1nxs", title: "You're a great teacher. But can the right students find you?" },
  { id: "MpqknVYgeew", title: "Applying to teaching jobs but not getting interview calls?" },
  { id: "EtyKZ4FkswE", title: "Applying to teaching jobs but not getting interview calls? Here is the Solution" },
  { id: "5UWOmp-m8mI", title: "Applying to teaching jobs but not getting interview calls? Must watch" },
  { id: "krkYnX4ldWU", title: "Good teachers deserve better opportunities." },
  { id: "HhrdnMh3kdk", title: "Azaadi sirf celebrate karne ki nahi, contribute karne ki bhi hai!" },
  { id: "RkRdFSDaYDw", title: "80 years of Independence, and the journey of building a stronger India continues" },
  { id: "k3FFP_FvBS8", title: "Teaching skills — NEET educator hiring by Mentor Prep" },
  { id: "vOiHdRyqrcs", title: "Your kidneys are working 24/7!" },
  { id: "1x92gSEte8g", title: "She was determined and did her best with AcadHr" },
  { id: "MzXycgHnDKA", title: "Why do we breathe faster after running?" },
  { id: "PehrlFg3Lss", title: "Find the perfect tutor for your learning journey!" },
  { id: "qTcSlgFYJU0", title: "We're Hiring at AcadHR!" },
  { id: "l5E6vtqfV4c", title: "Looking for a Home Tutor? Personalized 1-to-1 home tutoring!" },
  { id: "LmUpwdnJ84c", title: "Did you know? Trees can communicate with each other" },
  { id: "yWIGmjkwo1A", title: "NEET 2027 is OFFICIALLY in Offline" },
  { id: "M-1ipuZtcoQ", title: "NEET UG 2026 Choice Filling Update — Choice Filling has been delayed" },
  { id: "oA6rSFdcrlE", title: "Find teaching jobs, online classes, and tuition opportunities across India" },
  { id: "4pJWwk_IOLM", title: "Teaching jobs, online classes, and tuition opportunities across India with AcadHR" },
  { id: "93kI-WC4iWU", title: "Passionate about teaching NEET Physics or Chemistry?" },
  { id: "99jL6I15Xh4", title: "How to Register Yourself on AcadHR?" },
  { id: "mK7o5OcAEhI", title: "NEET 2027 — Concept in 1 minute" },
  { id: "j29TR1nZxps", title: "Biology with a Plant 😱?" },
  { id: "Qa0AdEWrzMo", title: "Are you a tutor?" },
  { id: "l5io_PzCs_8", title: "3-language scheme by CBSE 😱" },
  { id: "n_93zrLLRyU", title: "DREAM JOB?" },
  { id: "XD8SYujpGps", title: "We are Hiring" },
  { id: "zHoWipx7zfg", title: "Online Tutors Required!" },
  { id: "_PYokDjlvpA", title: "What's your must-have teaching gadget?" },
  { id: "rkch9MYMZ8I", title: "NEET 2026 Counselling — Stay Informed, Stay Ahead!" },
  { id: "TqhDWuXbeZg", title: "NEET Documents Checklist 2026" },
  { id: "bHQWclWyHKQ", title: "NEET Counselling: Don't Miss These Important Points!" },
  { id: "8RG9LBBf3h4", title: "BDS or BAMS? Which is the right choice after NEET 2026?" },
  { id: "YCUad7KSohg", title: "Looking for the right tutor for your child?" },
  { id: "q98_M9H8kxI", title: "Can AI replace teachers?" },
  { id: "qn-dRjLAeqI", title: "NEET UG Counselling 2026" },
  { id: "NiizdhCgNuY", title: "NEET 2027 Mentors Wanted!" },
  { id: "Djbw1ZCBSdo", title: "RE-NEET Counselling: What is your Safe Score?" },
  { id: "goLxXJE8urU", title: "Big Update for NEET & JEE 2027 Aspirants!" },
  { id: "Pjm81Th21HA", title: "Teachers Recruitment Advertisement" },
  { id: "xcfTjnOhL5Y", title: "NEET UG 2026 Results Are Officially OUT!" },
  { id: "KjOQBQvnRAM", title: "CBSE New 3-Language Rule" },
];

export default function YouTubePage({ setPage }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null); // selected video object

  const q = query.trim().toLowerCase();
  const list = q ? VIDEOS.filter(v => v.title.toLowerCase().includes(q)) : VIDEOS;

  return (
    <div className="fw-page" style={{ paddingTop: 90, background: "#F9FAFB", minHeight: "100vh" }}>
      <Navbar setPage={setPage} page="youtube" />

      {/* Header */}
      <section style={{ background: "linear-gradient(135deg,#B91C1C,#EF4444)", padding: "48px 0 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 30, padding: "7px 18px", marginBottom: 16, color: "#fff", fontWeight: 800, fontSize: 13 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
            AcadHR on YouTube
          </div>
          <h1 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: "#fff", margin: "0 0 10px" }}>Watch Our Videos</h1>
          <p style={{ color: "#FEE2E2", fontSize: 15.5, maxWidth: 560, margin: "0 auto 20px", lineHeight: 1.7 }}>
            Exam tips, hiring updates, tutor stories and more — click any video to play it right here.
          </p>
          <a href={CHANNEL_URL} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#B91C1C", fontWeight: 800, borderRadius: 30, padding: "11px 22px", textDecoration: "none", fontSize: 14.5 }}>
            ▶ Visit our Channel
          </a>

          {/* ADDED: right-to-left auto-scrolling strip of all videos */}
          <div className="yt-marquee" style={{ marginTop: 32 }}>
            <div className="yt-marquee-track">
              {[...VIDEOS, ...VIDEOS].map((v, i) => (
                <div className="yt-mq-card" key={i} onClick={() => setActive(v)} title={v.title}>
                  <div className="yt-mq-thumb">
                    <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" />
                    <div className="yt-mq-play"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span></div>
                  </div>
                  <div className="yt-mq-title">{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="container" style={{ padding: "26px 0 6px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search videos…"
            style={{ width: "100%", padding: "12px 44px 12px 16px", borderRadius: 30, border: "1px solid #E5E7EB", fontSize: 14, fontFamily: "Nunito,sans-serif", outline: "none", background: "#fff", boxShadow: "0 2px 8px rgba(16,42,120,.05)" }}
          />
          <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>🔍</span>
        </div>
        <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13, marginTop: 10 }}>{list.length} video{list.length === 1 ? "" : "s"}</div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: "16px 0 70px" }}>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: "50px 0" }}>No videos match “{query}”.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
            {list.map(v => (
              <div key={v.id} onClick={() => setActive(v)}
                style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 3px 12px rgba(16,42,120,.05)", transition: "all .18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(16,42,120,.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(16,42,120,.05)"; }}>
                <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#000" }}>
                  <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 54, height: 38, borderRadius: 10, background: "rgba(220,38,38,.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,.35)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "12px 14px 14px", fontSize: 13.5, fontWeight: 700, color: "#1F2937", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.8em" }}>
                  {v.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player modal */}
      {active && (
        <div onClick={() => setActive(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 10050, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 900 }}>
            <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#000", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.5)" }}>
              <iframe
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, flex: 1, minWidth: 0 }}>{active.title}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`https://www.youtube.com/watch?v=${active.id}`} target="_blank" rel="noreferrer"
                  style={{ background: "#DC2626", color: "#fff", borderRadius: 24, padding: "8px 16px", fontWeight: 800, fontSize: 13.5, textDecoration: "none", whiteSpace: "nowrap" }}>
                  ▶ Watch on YouTube
                </a>
                <button onClick={() => setActive(null)} style={{ background: "#fff", color: "#111827", border: "none", borderRadius: 24, padding: "8px 16px", fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}>Close ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="flexb" style={{ flexWrap: "wrap", gap: 20 }}>
            <div>
              <Brand size={22} onClick={() => setPage("home")} />
              <p style={{ color: "#6B7280", fontSize: 13, marginTop: 6 }}>India's Premier Education Hiring Platform</p>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms of Service", "Contact Us", "About"].map(l => (
                <span key={l} style={{ fontSize: 13, color: "#6B7280", cursor: "pointer" }}
                  onClick={() => { if (l === "Privacy Policy") setPage("privacy"); if (l === "Terms of Service") setPage("terms"); }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <Divider />
          <p style={{ color: "#9CA3AF", fontSize: 12, textAlign: "center" }}>© 2025 AcadHr. All rights reserved by DEERAJ TECHNOLOGY PRIVATE LIMITED. Made with ❤️ in Hyderabad, India.</p>
        </div>
      </footer>
    </div>
  );
}
