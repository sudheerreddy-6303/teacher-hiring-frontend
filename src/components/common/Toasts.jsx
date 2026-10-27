// ─────────────────────────────────────────────────────────────────────────────
// ADDED: App-wide toast popups (success / info / warning / error).
// Purely additive — nothing existing is removed. Use it from anywhere:
//
//     import { toast } from "../common/Toasts";
//     toast.success("Resume / CV added", "ananya_resume.pdf");
//     toast.warning("Please accept the Terms & Conditions");
//     toast.error("Could not save", "Please try again");
//     toast.info("Full name is required");
//
// <ToastHost/> is mounted once in App.jsx and renders the stack. The global
// window.alert is also routed through this (see App.jsx), so every existing
// alert(...) in the app automatically shows as a toast too.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

// --- tiny global emitter (module-level, no external deps) ---
const _listeners = new Set();
let _seq = 0;

export function toast(type, title, msg, ms) {
  const t = {
    id: ++_seq,
    type: type || "info",
    title: title == null ? "" : String(title),
    msg: msg == null ? "" : String(msg),
    ms: ms || 4000,
  };
  _listeners.forEach((fn) => { try { fn(t); } catch (e) {} });
  return t.id;
}
toast.success = (title, msg, ms) => toast("success", title, msg, ms);
toast.error   = (title, msg, ms) => toast("error",   title, msg, ms);
toast.info    = (title, msg, ms) => toast("info",    title, msg, ms);
toast.warning = (title, msg, ms) => toast("warning", title, msg, ms);

// Classify a plain alert() string into a toast {type,title,msg}
export function toastFromAlert(message) {
  const s = String(message == null ? "" : message).trim();
  const low = s.toLowerCase();
  let type = "info";
  if (/(error|failed|could not|couldn't|unable|went wrong|try again)/.test(low)) type = "error";
  else if (/(required|please|invalid|wrong|not allowed|too large|must |cannot|can't|at least|only )/.test(low)) type = "warning";
  else if (/(✅|success|successful|successfully|added|saved|updated|sent|approved|unlocked|applied|created|posted|deleted|removed|copied)/.test(low)) type = "success";
  // strip leading emoji/symbols, split first line as the title
  const cleaned = s.replace(/^[\s✅⚠️❌✕✓ℹ️🎉👍]+/u, "");
  const lines = cleaned.split("\n").map((x) => x.trim()).filter(Boolean);
  return { type, title: lines[0] || s, msg: lines.slice(1).join("  ") };
}

const ICON = { success: "✓", error: "✕", info: "i", warning: "!" };
const CLS  = { success: "t-ok", error: "t-err", info: "t-info", warning: "t-warn" };

function ToastItem({ t, onClose }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setOut(true); setTimeout(onClose, 300); }, t.ms);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line
  const close = () => { setOut(true); setTimeout(onClose, 300); };
  return (
    <div className={`acad-toast ${CLS[t.type] || "t-info"}${out ? " out" : ""}`}>
      <div className="ic">{ICON[t.type] || "i"}</div>
      <div className="mid">
        <div className="tt">{t.title}</div>
        {t.msg ? <div className="ms">{t.msg}</div> : null}
      </div>
      <button className="cl" aria-label="close" onClick={close}>×</button>
      <div className="bar" style={{ animation: `acadToastShrink ${t.ms}ms linear forwards` }} />
    </div>
  );
}

export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const add = (t) => setItems((cur) => [...cur, t]);
    _listeners.add(add);
    return () => { _listeners.delete(add); };
  }, []);
  const remove = (id) => setItems((cur) => cur.filter((t) => t.id !== id));
  return (
    <>
      <style>{`
        .acad-toast-stack{position:fixed;top:18px;right:18px;z-index:100000;display:flex;flex-direction:column;gap:12px;max-width:360px;pointer-events:none}
        .acad-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid #EEF2F7;border-left-width:5px;border-radius:14px;padding:13px 14px;box-shadow:0 12px 30px rgba(16,42,120,.18);min-width:250px;max-width:360px;width:100%;position:relative;overflow:hidden;animation:acadToastIn .35s cubic-bezier(.2,.8,.2,1)}
        .acad-toast.out{animation:acadToastOut .3s ease forwards}
        @keyframes acadToastIn{from{opacity:0;transform:translateX(40px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes acadToastOut{to{opacity:0;transform:translateX(40px) scale(.96)}}
        @keyframes acadToastShrink{from{width:100%}to{width:0}}
        .acad-toast .ic{width:28px;height:28px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:900;margin-top:1px}
        .acad-toast .mid{flex:1;min-width:0}
        .acad-toast .tt{font-weight:800;font-size:13.5px;line-height:1.35;color:#111827;word-break:break-word}
        .acad-toast .ms{font-size:12.5px;color:#6B7280;margin-top:2px;word-break:break-word}
        .acad-toast .cl{background:none;border:none;color:#9CA3AF;font-size:17px;line-height:1;cursor:pointer;flex:0 0 auto;padding:0 2px}
        .acad-toast .bar{position:absolute;left:0;bottom:0;height:3px;opacity:.5}
        .acad-toast.t-ok{border-left-color:#16A34A} .acad-toast.t-ok .ic{background:#16A34A} .acad-toast.t-ok .bar{background:#16A34A}
        .acad-toast.t-err{border-left-color:#DC2626} .acad-toast.t-err .ic{background:#DC2626} .acad-toast.t-err .bar{background:#DC2626}
        .acad-toast.t-info{border-left-color:#2563EB} .acad-toast.t-info .ic{background:#2563EB} .acad-toast.t-info .bar{background:#2563EB}
        .acad-toast.t-warn{border-left-color:#D97706} .acad-toast.t-warn .ic{background:#D97706} .acad-toast.t-warn .bar{background:#D97706}
        @media(max-width:520px){ .acad-toast-stack{left:12px;right:12px;top:12px;max-width:none} }
      `}</style>
      <div className="acad-toast-stack">
        {items.map((t) => <ToastItem key={t.id} t={t} onClose={() => remove(t.id)} />)}
      </div>
    </>
  );
}

export default ToastHost;
