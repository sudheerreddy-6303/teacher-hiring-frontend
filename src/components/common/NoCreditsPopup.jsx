// ─── AcadHr <NoCreditsPopup /> ────────────────────────────────────────────────
// Shown when a user tries to apply / post a job with 0 credits.
// "OK" calls onGoPricing, which each dashboard wires to open its Pricing tab.
// Self-contained, additive — does not change any existing logic.

export default function NoCreditsPopup({ show, onGoPricing }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(17,24,39,.55)", zIndex:100000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"Nunito,sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:20, maxWidth:420, width:"100%", padding:"36px 30px", textAlign:"center", boxShadow:"0 24px 60px rgba(0,0,0,.28)" }}>
        <div style={{ width:76, height:76, borderRadius:"50%", background:"#FFF7ED", border:"3px solid #FDE68A", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:38 }}>🪙</div>
        <div style={{ fontSize:22, fontWeight:800, color:"#111827", marginBottom:8 }}>Your credits are zero</div>
        <div style={{ fontSize:14, color:"#6B7280", marginBottom:24, lineHeight:1.5 }}>You've run out of credits. Please buy a plan to continue.</div>
        <button onClick={onGoPricing}
          style={{ width:"100%", padding:"13px 0", border:"none", borderRadius:12, background:"#1A56DB", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
          OK
        </button>
      </div>
    </div>
  );
}
