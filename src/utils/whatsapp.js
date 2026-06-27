// ───────────────────────────────────────────────────────────────────────────
// WhatsApp click-to-chat helpers (Option 1 — free, no API / no Meta approval)
// Builds standard https://wa.me/<number>?text=<message> links.
// Phone numbers are normalized to the Indian format expected by wa.me:
//   digits only, no "+", no spaces, no leading 0, with 91 country code.
// ───────────────────────────────────────────────────────────────────────────

/**
 * Normalize a raw phone string into a wa.me-ready number (digits only).
 * Examples:
 *   "+91 98765 43210" -> "919876543210"
 *   "09876543210"     -> "919876543210"
 *   "9876543210"      -> "919876543210"
 *   "919876543210"    -> "919876543210"
 * Returns "" if no usable digits are found.
 */
export function normalizeIndianPhone(raw) {
  if (raw === undefined || raw === null) return "";
  let digits = String(raw).replace(/\D/g, ""); // keep only 0-9
  if (!digits) return "";

  // Drop a single leading 0 (e.g. 09876543210 -> 9876543210)
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

  // Already has 91 country code (12 digits) -> use as-is
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  // Plain 10-digit Indian mobile -> add 91
  if (digits.length === 10) return "91" + digits;

  // Fallback: return whatever digits we have (lets other formats through)
  return digits;
}

/**
 * Build a wa.me click-to-chat URL.
 * @param {string} phone   raw phone number (any format)
 * @param {string} message message body to pre-fill
 * @returns {string} the wa.me URL, or "" if the phone has no usable digits
 */
export function buildWhatsAppLink(phone, message) {
  const num = normalizeIndianPhone(phone);
  if (!num) return "";
  const text = encodeURIComponent(message == null ? "" : String(message));
  return `https://wa.me/${num}?text=${text}`;
}

/**
 * Open a WhatsApp chat with the given phone + message in a new tab.
 * @returns {boolean} true if a link was opened, false if the phone was invalid
 */
export function openWhatsApp(phone, message) {
  const url = buildWhatsAppLink(phone, message);
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}
