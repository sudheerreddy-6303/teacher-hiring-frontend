// ─── AcadHr <ReceiptModal /> ──────────────────────────────────────────────────
// NEW, self-contained component. Shows a payment receipt on screen and lets the
// user download it as a PDF. Renders the SAME markup used for the PDF, so the
// preview and the file always match. Nothing existing is changed by adding this.

import { useState } from "react";
import { toReceiptData, buildReceiptHTML, downloadReceipt } from "./receiptTemplate";

export default function ReceiptModal({ payment, user = {}, onClose }) {
  const [busy, setBusy] = useState(false);
  if (!payment) return null;
  const data = toReceiptData(payment, user);

  async function handleDownload() {
    setBusy(true);
    try { await downloadReceipt(data); }
    finally { setBusy(false); }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(17,24,39,.6)", zIndex: 10002,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: 20, overflowY: "auto",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840, width: "100%", margin: "auto" }}>
        {/* action bar */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 12 }}>
          <button
            onClick={handleDownload}
            disabled={busy}
            style={{
              padding: "10px 18px", borderRadius: 10, border: "none", background: "#1A56DB",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: busy ? "wait" : "pointer",
            }}
          >
            {busy ? "Preparing…" : "⬇  Download Receipt (PDF)"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 18px", borderRadius: 10, border: "1px solid #E5E7EB",
              background: "#fff", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
        {/* the receipt itself */}
        <div
          style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.3)" }}
          dangerouslySetInnerHTML={{ __html: buildReceiptHTML(data) }}
        />
      </div>
    </div>
  );
}
