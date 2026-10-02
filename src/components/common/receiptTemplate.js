// ─── AcadHr Receipt Template ──────────────────────────────────────────────────
// NEW FILE. Self-contained. Builds a printable HTML receipt from a payment record
// and downloads it as a PDF. Nothing existing is changed by adding this file.
//
// It is used by <ReceiptModal /> (on-screen view) and by the "Download Receipt"
// buttons in Payment History and on the payment-success popup.

// ── Indian-numbering number → words (whole rupees) ───────────────────────────
function numberToWords(num) {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return "Zero";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (n) => n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
  const three = (n) => {
    const h = Math.floor(n / 100), r = n % 100;
    return (h ? a[h] + " Hundred" + (r ? " and " : "") : "") + (r ? two(r) : "");
  };
  let out = "";
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh  = Math.floor(num / 100000);   num %= 100000;
  const thou  = Math.floor(num / 1000);     num %= 1000;
  const hund  = num;
  if (crore) out += three(crore) + " Crore ";
  if (lakh)  out += three(lakh)  + " Lakh ";
  if (thou)  out += three(thou)  + " Thousand ";
  if (hund)  out += three(hund);
  return out.trim();
}

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const inr = (paise) => "₹" + ((Number(paise) || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Normalise a raw payment row (+ optional user) into receipt fields ────────
export function toReceiptData(p = {}, user = {}) {
  const totalPaise = Number(p.amount) || 0;
  const rupees     = totalPaise / 100;
  const subtotal   = rupees / 1.18;          // treat the paid amount as GST-inclusive
  const gst        = rupees - subtotal;
  const created    = p.created_at ? new Date(p.created_at) : new Date();
  const year       = created.getFullYear();
  const idNum      = String(p.id || p.receipt_seq || Math.floor(Date.now() / 1000)).padStart(6, "0");
  const role       = (p.user_role || user.role || "").toString();
  const acct       = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Customer";

  return {
    receiptNo:  `ACAD-RCPT-${year}-${idNum}`,
    dateStr:    created.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST",
    billedName: p.user_name  || user.name  || "Customer",
    billedEmail:p.user_email || user.email || "",
    billedPhone:p.user_phone || user.phone || "",
    accountType:acct,
    planLabel:  p.plan_label || p.plan_id || "AcadHr Plan",
    credits:    Number(p.credits_added != null ? p.credits_added : (p.credits || 0)) || 0,
    totalPaise,
    subtotalStr: inr(Math.round(subtotal * 100)),
    gstStr:      inr(Math.round(gst * 100)),
    totalStr:    inr(totalPaise),
    unitStr:     inr(totalPaise),
    words:       "Rupees " + numberToWords(rupees) + " Only",
    paymentId:  p.razorpay_payment_id || p.payment_id || "—",
    orderId:    p.razorpay_order_id   || p.order_id   || "—",
    method:     "UPI · Razorpay",
    statusPaid: (p.status || "paid") === "paid" || (p.status || "").toLowerCase() === "captured",
  };
}

// ── Build the receipt sheet markup (inline styles so it renders in a modal and
//    inside html2pdf/html2canvas identically) ────────────────────────────────
export function buildReceiptHTML(d, logoSrc) {
  const origin = (typeof window !== "undefined" && window.location) ? window.location.origin : "";
  // CHANGED (additive): accept an embedded logo (data URL) so it always renders in
  // the PDF. When none is passed (e.g. on-screen preview) fall back to the URL.
  const logo   = logoSrc || (origin + "/acadhr-logo.png");
  const BLUE = "#1A56DB", NAVY = "#0f2a5c", INK = "#0f172a", MUT = "#64748b",
        LINE = "#e4e8f0", SOFT = "#eef3fe", OK = "#0f9d58", OKS = "#e7f6ee";
  const statusPill = d.statusPaid
    ? `<span style="display:inline-flex;align-items:center;gap:7px;background:${OKS};color:${OK};font-weight:800;font-size:14px;padding:5px 14px;border-radius:999px;"><span style="width:9px;height:9px;border-radius:50%;background:${OK};display:inline-block;"></span>Paid</span>`
    : `<span style="display:inline-flex;background:#FFFBEB;color:#D97706;font-weight:800;font-size:14px;padding:5px 14px;border-radius:999px;">Pending</span>`;

  const stamp = `
    <div style="width:120px;height:120px;border:3px solid ${OK};border-radius:50%;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);opacity:.9;">
      <div style="border-top:2px solid ${OK};border-bottom:2px solid ${OK};padding:6px 0;width:104px;text-align:center;">
        <div style="font-family:Georgia,serif;font-weight:800;font-size:30px;letter-spacing:3px;color:${OK};line-height:1;">PAID</div>
      </div>
    </div>`;

  return `
  <div class="acadhr-receipt" style="width:800px;max-width:100%;margin:0 auto;background:#fff;color:${INK};font-family:'Segoe UI',Arial,sans-serif;border:1px solid ${LINE};">
    <!-- header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding:26px 34px 18px;border-bottom:3px solid ${BLUE};">
      <div style="display:flex;align-items:center;gap:14px;">
        <img src="${logo}" alt="AcadHr" style="height:64px;width:auto;" crossorigin="anonymous"
             onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block';"/>
        <div style="display:none;">
          <div style="font-size:26px;font-weight:800;letter-spacing:-.5px;"><span style="color:${NAVY}">Acad</span><span style="color:#f59e0b">HR</span></div>
          <div style="font-size:11px;font-weight:700;color:${BLUE};letter-spacing:1px;">Connect · Hire · Train · Grow</div>
        </div>
      </div>
      <div style="text-align:right;font-size:12.5px;color:${MUT};line-height:1.7;">
        <div style="font-size:15px;font-weight:800;color:${INK};">Deeraj Technology Pvt. Ltd.</div>
        <div>Hyderabad, India</div>
        <div>www.acadhr.com</div>
        <div>support@acadhr.com</div>
      </div>
    </div>

    <!-- receipt band -->
    <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;background:${SOFT};padding:18px 34px;">
      <div style="font-size:34px;font-weight:800;letter-spacing:1px;color:${INK};">RECEIPT</div>
      <div style="font-size:17px;font-weight:800;color:${NAVY};font-variant-numeric:tabular-nums;">${esc(d.receiptNo)}</div>
    </div>

    <!-- billed to + meta -->
    <div style="display:flex;gap:26px;padding:24px 34px;border-bottom:1px solid ${LINE};flex-wrap:wrap;">
      <div style="flex:1;min-width:220px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.3px;color:${BLUE};margin-bottom:8px;">BILLED TO</div>
        <div style="font-size:19px;font-weight:800;color:${INK};margin-bottom:4px;">${esc(d.billedName)}</div>
        <div style="font-size:13.5px;color:${MUT};line-height:1.7;">${esc(d.billedEmail)}${d.billedPhone ? "<br>" + esc(d.billedPhone) : ""}</div>
      </div>
      <div style="flex:1;min-width:240px;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <tbody>
            <tr><td style="padding:7px 0;color:${BLUE};font-weight:700;font-size:11px;letter-spacing:1px;width:42%;vertical-align:top;">PAYMENT DATE</td><td style="padding:7px 0;color:${INK};font-weight:600;">${esc(d.dateStr)}</td></tr>
            <tr><td style="padding:7px 0;color:${BLUE};font-weight:700;font-size:11px;letter-spacing:1px;border-top:1px solid ${LINE};">ACCOUNT TYPE</td><td style="padding:7px 0;color:${INK};border-top:1px solid ${LINE};">${esc(d.accountType)}</td></tr>
            <tr><td style="padding:7px 0;color:${BLUE};font-weight:700;font-size:11px;letter-spacing:1px;border-top:1px solid ${LINE};">RECEIPT NO.</td><td style="padding:7px 0;color:${INK};border-top:1px solid ${LINE};font-variant-numeric:tabular-nums;">${esc(d.receiptNo)}</td></tr>
            <tr><td style="padding:9px 0;color:${BLUE};font-weight:700;font-size:11px;letter-spacing:1px;border-top:1px solid ${LINE};">STATUS</td><td style="padding:9px 0;border-top:1px solid ${LINE};">${statusPill}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- items -->
    <div style="padding:22px 34px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
        <thead>
          <tr style="background:${NAVY};color:#fff;">
            <th style="padding:12px 12px;text-align:left;font-size:11px;letter-spacing:1px;border-radius:8px 0 0 0;">#</th>
            <th style="padding:12px 12px;text-align:left;font-size:11px;letter-spacing:1px;">DESCRIPTION</th>
            <th style="padding:12px 12px;text-align:center;font-size:11px;letter-spacing:1px;">QTY</th>
            <th style="padding:12px 12px;text-align:right;font-size:11px;letter-spacing:1px;">UNIT PRICE (₹)</th>
            <th style="padding:12px 12px;text-align:right;font-size:11px;letter-spacing:1px;border-radius:0 8px 0 0;">AMOUNT (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:16px 12px;border-bottom:1px solid ${LINE};vertical-align:top;">1</td>
            <td style="padding:16px 12px;border-bottom:1px solid ${LINE};vertical-align:top;">
              <div style="font-weight:800;color:${INK};font-size:15px;">${esc(d.planLabel)}</div>
              <div style="color:${MUT};font-size:12.5px;margin-top:3px;">Job-posting credits pack · billed one-time</div>
              ${d.credits ? `<div style="display:inline-block;margin-top:8px;background:${SOFT};color:${BLUE};font-size:12px;font-weight:700;padding:4px 11px;border-radius:7px;">+ ${d.credits} credits added</div>` : ""}
            </td>
            <td style="padding:16px 12px;border-bottom:1px solid ${LINE};text-align:center;vertical-align:top;">1</td>
            <td style="padding:16px 12px;border-bottom:1px solid ${LINE};text-align:right;vertical-align:top;font-variant-numeric:tabular-nums;">${esc(d.unitStr)}</td>
            <td style="padding:16px 12px;border-bottom:1px solid ${LINE};text-align:right;vertical-align:top;font-variant-numeric:tabular-nums;font-weight:600;">${esc(d.totalStr)}</td>
          </tr>
          <tr>
            <td colspan="3" style="border:none;"></td>
            <td style="padding:10px 12px;text-align:right;color:${MUT};">Subtotal</td>
            <td style="padding:10px 12px;text-align:right;font-variant-numeric:tabular-nums;font-weight:600;">${esc(d.subtotalStr)}</td>
          </tr>
          <tr>
            <td colspan="3" style="border:none;"></td>
            <td style="padding:10px 12px;text-align:right;color:${MUT};">GST (18%)</td>
            <td style="padding:10px 12px;text-align:right;font-variant-numeric:tabular-nums;font-weight:600;">${esc(d.gstStr)}</td>
          </tr>
          <tr>
            <td colspan="3" style="border:none;"></td>
            <td style="padding:14px 12px;text-align:right;font-weight:800;font-size:17px;color:${INK};background:${SOFT};border-radius:0 0 0 8px;">Total Paid</td>
            <td style="padding:14px 12px;text-align:right;font-variant-numeric:tabular-nums;font-weight:800;font-size:17px;color:${BLUE};background:${SOFT};border-radius:0 0 8px 0;">${esc(d.totalStr)}</td>
          </tr>
        </tbody>
      </table>

      <div style="display:flex;gap:14px;align-items:center;border:1px solid ${LINE};border-radius:8px;padding:12px 14px;margin-top:16px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:${MUT};white-space:nowrap;">AMOUNT IN WORDS</div>
        <div style="font-size:13.5px;color:${INK};font-weight:600;">${esc(d.words)}</div>
      </div>
    </div>

    <!-- payment details + stamp -->
    <div style="display:flex;justify-content:space-between;align-items:center;gap:20px;padding:24px 34px;flex-wrap:wrap;">
      <div style="flex:1;min-width:260px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.3px;color:${BLUE};margin-bottom:10px;">PAYMENT DETAILS</div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tbody>
            <tr><td style="padding:8px 0;color:${MUT};width:40%;">Payment ID</td><td style="padding:8px 0;color:${INK};font-weight:600;">${esc(d.paymentId)}</td></tr>
            <tr><td style="padding:8px 0;color:${MUT};border-top:1px solid ${LINE};">Order ID</td><td style="padding:8px 0;color:${INK};font-weight:600;border-top:1px solid ${LINE};">${esc(d.orderId)}</td></tr>
            <tr><td style="padding:8px 0;color:${MUT};border-top:1px solid ${LINE};">Payment Method</td><td style="padding:8px 0;color:${INK};font-weight:600;border-top:1px solid ${LINE};">${esc(d.method)}</td></tr>
            <tr><td style="padding:8px 0;color:${MUT};border-top:1px solid ${LINE};">Payment Status</td><td style="padding:8px 0;color:${INK};font-weight:600;border-top:1px solid ${LINE};">${d.statusPaid ? "Captured &amp; Verified" : "Pending"}</td></tr>
          </tbody>
        </table>
      </div>
      <div style="flex:0 0 auto;">${d.statusPaid ? stamp : ""}</div>
    </div>

    <!-- thank you -->
    <div style="display:flex;gap:14px;align-items:center;background:${SOFT};padding:20px 34px;">
      <div style="width:42px;height:42px;border-radius:50%;background:${BLUE};color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;flex:0 0 auto;">✓</div>
      <div>
        <div style="font-size:17px;font-weight:800;color:${NAVY};">Thank you for your payment!</div>
        <div style="font-size:13px;color:${MUT};margin-top:2px;">Your ${esc(d.planLabel)}${d.credits ? " is now active. You can start using " + d.credits + " credits." : " is now active."}</div>
      </div>
    </div>

    <div style="padding:14px 34px 22px;text-align:center;color:${MUT};font-size:11.5px;border-top:1px solid ${LINE};">
      This is a computer-generated receipt and does not require a signature.<br>
      For any support or queries, contact support@acadhr.com · www.acadhr.com
    </div>
  </div>`;
}

// ── Load html2pdf (CDN, runs in the user's browser) once ─────────────────────
function ensureHtml2Pdf() {
  return new Promise((resolve) => {
    if (window.html2pdf) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
    s.onload  = () => resolve(!!window.html2pdf);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ── Fetch the logo and return it as a base64 data URL (so it always shows in the
//    PDF — a plain <img src="/acadhr-logo.png"> can be missed by html2canvas if it
//    hasn't finished loading, or dropped on cross-origin). Returns null on failure.
async function fetchLogoDataUrl() {
  try {
    if (typeof window === "undefined" || !window.location) return null;
    const res = await fetch(window.location.origin + "/acadhr-logo.png", { cache: "force-cache" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload  = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch (e) { return null; }
}

// ── Download the receipt as a PDF (single page; falls back to a print window) ──
export async function downloadReceipt(data) {
  const d = data && data.receiptNo ? data : toReceiptData(data || {});
  const logoData = await fetchLogoDataUrl();               // embed logo so it never goes missing
  const html = buildReceiptHTML(d, logoData || undefined);
  const ok = await ensureHtml2Pdf();

  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;left:-99999px;top:0;width:800px;background:#fff;";
  holder.innerHTML = html;
  document.body.appendChild(holder);
  const node = holder.firstElementChild;

  // wait for the logo image to finish decoding before we snapshot the node
  await new Promise((resolve) => {
    const img = node && node.querySelector("img");
    if (!img || img.complete) return resolve();
    img.onload = img.onerror = () => resolve();
    setTimeout(resolve, 1500);
  });

  const H2C   = window.html2canvas;
  const JSPDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);

  try {
    // Preferred: render once, then place on ONE A4 page scaled to fit (never spills
    // onto a second page).
    if (H2C && JSPDF) {
      const canvas  = await H2C(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf     = new JSPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;
      let imgW = availW;
      let imgH = (canvas.height * imgW) / canvas.width;
      if (imgH > availH) { imgH = availH; imgW = (canvas.width * imgH) / canvas.height; } // fit height → single page
      const x = (pageW - imgW) / 2;
      pdf.addImage(imgData, "JPEG", x, margin, imgW, imgH);
      pdf.save(`${d.receiptNo}.pdf`);
      return;
    }

    // Fallback: html2pdf, told to avoid page breaks so it stays on one page
    if (ok && window.html2pdf) {
      await window.html2pdf().set({
        margin: 6,
        filename: `${d.receiptNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all"] },
      }).from(node).save();
      return;
    }
  } catch (e) {
    /* fall through to the print-window fallback below */
  } finally {
    setTimeout(() => { try { document.body.removeChild(holder); } catch (e) {} }, 400);
  }

  // Last resort: open a print window so the user can "Save as PDF"
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${d.receiptNo}</title></head><body style="margin:0;background:#fff;">${html}<script>setTimeout(function(){window.print();},350);<\/script></body></html>`);
  w.document.close();
}
