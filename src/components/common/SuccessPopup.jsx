// Simple centered success popup shown after a profile is saved.
// Self-contained styling so it renders correctly from any dashboard or modal.
export default function SuccessPopup({
  show,
  onClose,
  title = "Profile updated successfully!",
  message = "Your changes have been saved.",
}) {
  if (!show) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(17,24,39,.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10000, padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 18, padding: "34px 38px",
          maxWidth: 400, width: "100%", textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,.28)",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%", background: "#ECFDF5",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 34,
          }}
        >
          ✅
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 22, lineHeight: 1.5 }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            minWidth: 130, padding: "10px 22px", borderRadius: 10, border: "none",
            background: "#1A56DB", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
