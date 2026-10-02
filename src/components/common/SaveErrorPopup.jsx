// ADDED: Centered error popup shown when a profile fails to save (validation or server error).
// Mirrors SuccessPopup's styling but in a red/warning theme. Self-contained so it renders
// correctly from any dashboard. Nothing existing is changed by adding this file.
export default function SaveErrorPopup({
  show,
  onClose,
  title = "Couldn't save your changes",
  message = "Please try again.",
}) {
  if (!show) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(17,24,39,.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10001, padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 18, padding: "34px 38px",
          maxWidth: 420, width: "100%", textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,.28)",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 34,
          }}
        >
          ⚠️
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
            background: "#DC2626", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
