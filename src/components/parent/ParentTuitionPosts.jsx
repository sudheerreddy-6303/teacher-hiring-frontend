// ─── AcadHr <ParentTuitionPosts /> ────────────────────────────────────────────
// NEW, self-contained. Lets a parent post MULTIPLE tuition requirements, limited
// by their plan (Free=1, Starter=3, Premium=5). The parent's existing single
// "My Requirement" counts as post #1; this manages the extra posts (#2..N).
// Nothing existing is changed by adding this.

import { useState, useEffect } from "react";

const CLASSES = ["Pre-Primary (Nursery–KG)","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Degree"];
const SUBS    = ["Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science","Computer Science","Economics","Commerce","Physical Education","Sanskrit","Zoology"];
const MODES   = ["Home","Online","Offline & Online"];

const EMPTY = { student_name:"", student_class:"", subject:"", location:"", mode:"", budget:"", preferred_time:"", notes:"" };

export default function ParentTuitionPosts({ setPage }) {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const token = () => localStorage.getItem("acadhr_token");

  const [posts, setPosts]     = useState([]);
  const [limit, setLimit]     = useState(1);
  const [used, setUsed]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [err, setErr]         = useState("");
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    fetch(API + "/parent-tuitions", { headers: { Authorization: "Bearer " + token() } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) { setPosts(Array.isArray(d.posts) ? d.posts : []); setLimit(d.limit || 1); setUsed(d.used || 1); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openAdd  = () => { setEditId(null); setForm(EMPTY); setErr(""); setShowForm(true); };
  const openEdit = (p) => { setEditId(p.id); setForm({ student_name:p.student_name||"", student_class:p.student_class||"", subject:p.subject||"", location:p.location||"", mode:p.mode||"", budget:p.budget||"", preferred_time:p.preferred_time||"", notes:p.notes||"" }); setErr(""); setShowForm(true); };

  const save = async () => {
    if (!form.subject.trim() && !form.student_class.trim()) { setErr("Please add at least a class or subject."); return; }
    setSaving(true); setErr("");
    try {
      const url = editId ? `${API}/parent-tuitions/${editId}` : `${API}/parent-tuitions`;
      const method = editId ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type":"application/json", Authorization:"Bearer "+token() }, body: JSON.stringify(form) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 402) { setErr(d.message || "You've reached your plan's post limit."); return; }
      if (!r.ok) throw new Error(d.message || "Could not save the post.");
      setShowForm(false); setForm(EMPTY); setEditId(null); load();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this tuition post?")) return;
    try {
      await fetch(`${API}/parent-tuitions/${id}`, { method:"DELETE", headers:{ Authorization:"Bearer "+token() } });
      load();
    } catch (e) { /* ignore */ }
  };

  const atLimit = used >= limit;
  const planName = limit >= 5 ? "Premium" : limit >= 3 ? "Starter" : "Free";

  const input = { width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #E5E7EB", fontSize:14, fontFamily:"Nunito,sans-serif", background:"#fff" };
  const lbl = { fontSize:12, fontWeight:700, color:"#6B7280", marginBottom:6, display:"block" };

  return (
    <div className="fadeUp">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div className="page-title">My Tuition Posts</div>
          <div className="page-sub">Post multiple tuition requirements — your plan decides how many</div>
        </div>
        <button className="btn btn-primary btn-sm" disabled={atLimit} onClick={openAdd}
          style={atLimit ? { opacity:.5, cursor:"not-allowed" } : undefined}>
          ➕ Add Tuition Post
        </button>
      </div>

      {/* usage bar */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:"12px 16px", margin:"16px 0" }}>
        <span style={{ fontSize:13, fontWeight:800, color:"#111827" }}>Posts used: {used} / {limit}</span>
        <span style={{ fontSize:12, fontWeight:700, color:"#6D28D9", background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:999, padding:"3px 10px" }}>{planName} plan</span>
        {atLimit && (
          <span style={{ fontSize:12, color:"#B91C1C", fontWeight:700 }}>
            Limit reached —{" "}
            <span onClick={() => setPage && setPage("pricing")} style={{ color:"#1A56DB", cursor:"pointer", textDecoration:"underline" }}>upgrade to post more</span>
          </span>
        )}
      </div>

      {/* add / edit form */}
      {showForm && (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:20, marginBottom:20 }}>
          <div style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:14 }}>{editId ? "Edit Tuition Post" : "New Tuition Post"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
            <div><label style={lbl}>Student Name</label><input style={input} value={form.student_name} onChange={e=>up("student_name",e.target.value)} placeholder="e.g. Aarav" /></div>
            <div><label style={lbl}>Class</label>
              <select style={input} value={form.student_class} onChange={e=>up("student_class",e.target.value)}>
                <option value="">Select class</option>{CLASSES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Subject</label>
              <select style={input} value={form.subject} onChange={e=>up("subject",e.target.value)}>
                <option value="">Select subject</option>{SUBS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Tutoring Mode</label>
              <select style={input} value={form.mode} onChange={e=>up("mode",e.target.value)}>
                <option value="">Select mode</option>{MODES.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Location / Area</label><input style={input} value={form.location} onChange={e=>up("location",e.target.value)} placeholder="e.g. Banjara Hills" /></div>
            <div><label style={lbl}>Budget (₹)</label><input style={input} value={form.budget} onChange={e=>up("budget",e.target.value)} placeholder="e.g. 4000/month" /></div>
            <div><label style={lbl}>Preferred Time</label><input style={input} value={form.preferred_time} onChange={e=>up("preferred_time",e.target.value)} placeholder="e.g. Evening, 5-6 PM" /></div>
          </div>
          <div style={{ marginTop:14 }}><label style={lbl}>Notes</label><textarea style={{ ...input, minHeight:70 }} value={form.notes} onChange={e=>up("notes",e.target.value)} placeholder="Any special requirements..." /></div>
          {err && <div style={{ marginTop:12, background:"#FEF2F2", border:"1px solid #FECACA", color:"#B91C1C", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:600 }}>{err}</div>}
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <button className="btn btn-ghost" onClick={() => { setShowForm(false); setErr(""); }}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : (editId ? "Save Changes ✓" : "Post Tuition ✓")}</button>
          </div>
        </div>
      )}

      {/* primary requirement note */}
      <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#1E429F" }}>
        📋 Post #1 is your main requirement in the <strong>“My Requirement”</strong> tab. Extra posts below count toward your plan limit.
      </div>

      {/* posts list */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#9CA3AF" }}>Loading your posts…</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#9CA3AF" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>📝</div>
          <div style={{ fontWeight:700, color:"#374151" }}>No extra posts yet</div>
          <div style={{ fontSize:13, marginTop:5 }}>Use “Add Tuition Post” to post another requirement.</div>
        </div>
      ) : (
        <div className="grid2">
          {posts.map((p, i) => (
            <div key={p.id} className="card" style={{ padding:20 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
                <div style={{ fontWeight:800, fontSize:15, color:"#111827" }}>
                  {[p.student_class, p.subject].filter(Boolean).join(" · ") || "Tuition Post"}
                </div>
                <span style={{ fontSize:11, fontWeight:800, color:"#065F46", background:"#D1FAE5", borderRadius:999, padding:"3px 10px", whiteSpace:"nowrap" }}>{p.status || "Open"}</span>
              </div>
              {p.student_name && <div style={{ fontSize:13, color:"#6B7280", marginTop:3 }}>👧 {p.student_name}</div>}
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, margin:"12px 0" }}>
                {p.location && <span style={{ fontSize:11.5, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:20, padding:"3px 10px", color:"#374151" }}>📍 {p.location}</span>}
                {p.mode && <span style={{ fontSize:11.5, background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:20, padding:"3px 10px", color:"#1A56DB", fontWeight:700 }}>💻 {p.mode}</span>}
                {p.budget && <span style={{ fontSize:11.5, background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:20, padding:"3px 10px", color:"#047857", fontWeight:700 }}>💰 {p.budget}</span>}
                {p.preferred_time && <span style={{ fontSize:11.5, background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:20, padding:"3px 10px", color:"#92400E" }}>⏰ {p.preferred_time}</span>}
              </div>
              {p.notes && <div style={{ fontSize:12.5, color:"#6B7280", marginBottom:12 }}>{p.notes}</div>}
              <div style={{ display:"flex", gap:10, borderTop:"1px solid #F3F4F6", paddingTop:12 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ color:"#DC2626" }} onClick={() => remove(p.id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
