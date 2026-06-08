import { useState } from "react";
import apiBase from "../../config/apiBase";

const CATEGORIES = ["Report an error", "Suggestion", "Other"];

export default function FeedbackWidget({ page }) {
  const [open,       setOpen]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState("");
  const [form, setForm] = useState({ category: CATEGORIES[0], name: "", phone: "", email: "", message: "" });
  const [file, setFile] = useState(null);

  const reset = () => {
    setForm({ category: CATEGORIES[0], name: "", phone: "", email: "", message: "" });
    setFile(null);
    setError("");
    setDone(false);
  };

  const close = () => { setOpen(false); };

  const submit = async () => {
    if (submitting) return;                 // guard against double-submit
    if (!form.message.trim()) { setError("Please describe the issue or feedback."); return; }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("category", form.category);
      fd.append("name",     form.name);
      fd.append("phone",    form.phone);
      fd.append("email",    form.email);
      fd.append("message",  form.message);
      fd.append("page",     page || (typeof window !== "undefined" ? window.location.pathname : ""));
      if (file) fd.append("screenshot", file);

      const res = await fetch(`${apiBase()}/feedback`, { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Server returned ${res.status}`);
      }
      setDone(true);
    } catch (e) {
      setError(e.message || "Could not send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button (bottom-right) */}
      {!open && (
        <button
          onClick={() => { reset(); setOpen(true); }}
          aria-label="Send feedback"
          style={{
            position:"fixed", right:20, bottom:20, zIndex:10000,
            display:"flex", alignItems:"center", gap:8,
            background:"#1A56DB", color:"#fff", border:"none",
            borderRadius:30, padding:"12px 18px", fontSize:14, fontWeight:800,
            fontFamily:"Nunito,sans-serif", cursor:"pointer",
            boxShadow:"0 8px 24px rgba(26,86,219,.35)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>
          💬 Feedback
        </button>
      )}

      {/* Panel */}
      {open && (
        <div style={{
          position:"fixed", right:20, bottom:20, zIndex:10000,
          width:"min(360px, calc(100vw - 32px))",
          background:"#fff", borderRadius:18, border:"1px solid #E5E7EB",
          boxShadow:"0 20px 60px rgba(0,0,0,.22)", overflow:"hidden",
          fontFamily:"Nunito,sans-serif",
        }}>
          {/* Header */}
          <div style={{ background:"#1A56DB", color:"#fff", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontWeight:800, fontSize:15 }}>💬 Send Feedback</div>
            <button onClick={close} aria-label="Close" style={{ background:"transparent", border:"none", color:"#fff", fontSize:18, cursor:"pointer", lineHeight:1 }}>✕</button>
          </div>

          <div style={{ padding:18 }}>
            {done ? (
              <div style={{ textAlign:"center", padding:"18px 6px" }}>
                <div style={{ fontSize:42, marginBottom:10 }}>✅</div>
                <div style={{ fontWeight:800, fontSize:16, color:"#111827", marginBottom:6 }}>Thank you!</div>
                <p style={{ color:"#6B7280", fontSize:13, marginBottom:18 }}>Your feedback has been recorded. We'll look into it.</p>
                <button onClick={close}
                  style={{ background:"#1A56DB", color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <label style={lbl}>Type</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category:e.target.value}))} style={inp}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>

                <label style={lbl}>Your message <span style={{ color:"#DC2626" }}>*</span></label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({...f, message:e.target.value}))}
                  placeholder="Describe the error or share your feedback..."
                  rows={4}
                  style={{ ...inp, resize:"vertical", minHeight:84 }}
                />

                <label style={lbl}>Name (optional)</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Your name" style={inp} />

                <label style={lbl}>Phone number (optional)</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))} placeholder="e.g. 98765 43210" style={inp} />

                <label style={lbl}>Email (optional)</label>
                <input value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="you@example.com" style={inp} />

                <label style={lbl}>Screenshot of the error (optional)</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
                  style={{ ...inp, padding:"8px 10px" }} />
                {file && <div style={{ fontSize:12, color:"#059669", marginTop:-6, marginBottom:8, fontWeight:600 }}>📎 {file.name}</div>}

                {error && (
                  <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"8px 12px", color:"#DC2626", fontSize:12.5, fontWeight:600, marginBottom:10 }}>
                    {error}
                  </div>
                )}

                <button onClick={submit} disabled={submitting}
                  style={{
                    width:"100%", background: submitting ? "#93C5FD" : "#1A56DB", color:"#fff",
                    border:"none", borderRadius:10, padding:"11px 0", fontSize:14, fontWeight:800,
                    cursor: submitting ? "default" : "pointer", fontFamily:"Nunito,sans-serif",
                  }}>
                  {submitting ? "Sending..." : "Submit Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const lbl = { display:"block", fontSize:12, fontWeight:700, color:"#374151", margin:"10px 0 5px" };
const inp = {
  width:"100%", boxSizing:"border-box", border:"1px solid #D1D5DB", borderRadius:9,
  padding:"9px 12px", fontSize:13.5, fontFamily:"Nunito,sans-serif", color:"#111827",
  outline:"none", background:"#fff", marginBottom:8,
};
