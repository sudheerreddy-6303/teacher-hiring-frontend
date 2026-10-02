// ─── AcadHr <PaymentHistory /> ────────────────────────────────────────────────
// NEW, self-contained component. Shows the logged-in user's payment history
// (or ALL payments when admin={true}). It only READS data from endpoints that
// already exist (/api/payments/mine and /api/payments/all) and does not touch
// or change any existing dashboard logic.

import { useState, useEffect } from "react";
import apiBase from "../../config/apiBase";
import { getToken } from "../../api";
import ReceiptModal from "./ReceiptModal"; // ADDED: downloadable receipt
import { toReceiptData } from "./receiptTemplate"; // ADDED: to match by receipt number

export default function PaymentHistory({ admin = false, user = {} }) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [receiptFor, setReceiptFor] = useState(null); // ADDED: row whose receipt is open
  const [q, setQ] = useState(""); // ADDED: admin search query
  const [showAnalytics, setShowAnalytics] = useState(false); // ADDED: charts toggle

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = getToken();
        const res = await fetch(`${apiBase()}/payments/${admin ? "all" : "mine"}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load payments.");
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [admin]);

  const inr  = (paise) => "₹" + ((Number(paise) || 0) / 100).toLocaleString("en-IN");
  const when = (d) => { try { return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); } catch { return d; } };
  const st   = (s) => s === "paid"
    ? { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0", text: "Paid" }
    : s === "failed"
      ? { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", text: "Failed" }
      : { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", text: "Pending" };

  // ADDED: figure out the audience/role of a payment row (from the user's role,
  // falling back to the plan id prefix e.g. "school_pro_1m" → school).
  const roleOf = (r) => {
    const role = (r.user_role || "").toLowerCase();
    if (["school", "teacher", "tutor", "parent"].includes(role)) return role;
    const pid = (r.plan_id || "").toLowerCase();
    if (pid.startsWith("school"))  return "school";
    if (pid.startsWith("teacher")) return "teacher";
    if (pid.startsWith("tutor"))   return "tutor";
    if (pid.startsWith("parent"))  return "parent";
    return "other";
  };

  // ADDED: client-side search across user, plan, status and amount.
  const needle = q.trim().toLowerCase();
  const receiptNoOf = (r) => { try { return toReceiptData(r, user).receiptNo; } catch { return ""; } };
  const filtered = !needle ? rows : rows.filter((r) => {
    const amt = ((Number(r.amount) || 0) / 100).toString();
    return [r.user_name, r.user_email, r.plan_label, r.plan_id, r.status, roleOf(r), amt,
            receiptNoOf(r), r.razorpay_payment_id, r.razorpay_order_id]
      .filter(Boolean).join(" ").toLowerCase().includes(needle);
  });

  // ADDED: role counts (respect the current search filter).
  const counts = filtered.reduce((a, r) => { const k = roleOf(r); a[k] = (a[k] || 0) + 1; return a; }, {});
  const tiles = [
    { key: "total",   label: "Total",    value: filtered.length, color: "#1A56DB", bg: "#EEF3FE" },
    { key: "school",  label: "Schools",  value: counts.school  || 0, color: "#7C3AED", bg: "#F3EEFE" },
    { key: "teacher", label: "Teachers", value: counts.teacher || 0, color: "#0369A1", bg: "#E6F4FB" },
    { key: "tutor",   label: "Tutors",   value: counts.tutor   || 0, color: "#059669", bg: "#E7F6EE" },
    { key: "parent",  label: "Parents",  value: counts.parent  || 0, color: "#D97706", bg: "#FEF6E7" },
  ];

  // ADDED: colour per role (used to tint the per-plan cards)
  const roleColor = (role) => ({
    school:  { color: "#7C3AED", bg: "#F3EEFE" },
    teacher: { color: "#0369A1", bg: "#E6F4FB" },
    tutor:   { color: "#059669", bg: "#E7F6EE" },
    parent:  { color: "#D97706", bg: "#FEF6E7" },
  }[role] || { color: "#1A56DB", bg: "#EEF3FE" });

  // ADDED: group the (filtered) payments by pricing plan → one card per plan.
  const byPlan = {};
  filtered.forEach((r) => {
    const name = r.plan_label || r.plan_id || "Other";
    if (!byPlan[name]) byPlan[name] = { name, role: roleOf(r), count: 0, paid: 0, revenue: 0 };
    const b = byPlan[name];
    b.count += 1;
    if (r.status === "paid") { b.paid += 1; b.revenue += Number(r.amount) || 0; }
  });
  const planCards = Object.values(byPlan).sort((a, b) => b.count - a.count);

  return (
    <div style={{ padding: "28px 28px" }} className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Payment History</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 22 }}>
        {admin ? "All payments made across AcadHr." : "Your past payments and plan purchases."}
      </p>

      {/* ADDED (admin): role count tiles + search bar */}
      {admin && !loading && !error && rows.length > 0 && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            {tiles.map((t) => (
              <div key={t.key} style={{ flex: "1 1 120px", minWidth: 120, background: t.bg, border: `1px solid ${t.color}22`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: t.color, fontVariantNumeric: "tabular-nums" }}>{t.value}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".5px", marginTop: 2 }}>{t.label}</div>
              </div>
            ))}
          </div>
          <div style={{ position: "relative", marginBottom: 18, maxWidth: 420 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 15 }}>🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by receipt no., name, email, plan, role or status…"
              style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", background: "#fff" }}
            />
            {q && (
              <button onClick={() => setQ("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#9CA3AF", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* ADDED: Analytics button — reveals bar + pie charts */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => setShowAnalytics((v) => !v)}
              style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #1A56DB", background: showAnalytics ? "#1A56DB" : "#EEF3FE", color: showAnalytics ? "#fff" : "#1A56DB", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              {showAnalytics ? "✕ Hide Analytics" : "📊 Analytics"}
            </button>
          </div>

          {showAnalytics && planCards.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, marginBottom: 24 }}>
              {/* Bar chart — payments by plan */}
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Payments by plan</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {planCards.map((p) => {
                    const maxCount = Math.max(...planCards.map((x) => x.count), 1);
                    const c = roleColor(p.role);
                    return (
                      <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 130, flex: "0 0 auto", fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.name}>{p.name}</div>
                        <div style={{ flex: 1, minWidth: 0, background: "#F3F4F6", borderRadius: 6, height: 18 }}>
                          <div style={{ width: `${(p.count / maxCount) * 100}%`, background: c.color, height: "100%", borderRadius: 6, transition: "width .4s" }} />
                        </div>
                        <div style={{ width: 26, flex: "0 0 auto", textAlign: "right", fontSize: 12.5, fontWeight: 800, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{p.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pie chart — share by role */}
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Payments by role</div>
                {(() => {
                  const roleList = ["school", "teacher", "tutor", "parent", "other"].filter((k) => counts[k]);
                  const total = roleList.reduce((s, k) => s + counts[k], 0) || 1;
                  let acc = 0;
                  const stops = roleList.map((k) => {
                    const start = (acc / total) * 100; acc += counts[k];
                    const end = (acc / total) * 100;
                    return `${roleColor(k).color} ${start}% ${end}%`;
                  });
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ width: 150, height: 150, borderRadius: "50%", background: `conic-gradient(${stops.join(",")})`, flex: "0 0 auto", position: "relative" }}>
                        <div style={{ position: "absolute", inset: 38, background: "#fff", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{total}</div>
                          <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" }}>Total</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
                        {roleList.map((k) => (
                          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                            <span style={{ width: 12, height: 12, borderRadius: 3, background: roleColor(k).color, flex: "0 0 auto" }} />
                            <span style={{ color: "#374151", textTransform: "capitalize", flex: 1 }}>{k}</span>
                            <span style={{ fontWeight: 800, color: "#111827" }}>{counts[k]}</span>
                            <span style={{ color: "#9CA3AF", width: 42, textAlign: "right" }}>{Math.round((counts[k] / total) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}

      {loading && <div style={{ color: "#6B7280", fontSize: 14 }}>Loading…</div>}

      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 12, padding: "14px 16px", fontSize: 14 }}>
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>🧾</div>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>No payments yet</div>
          <div style={{ fontSize: 13 }}>Completed payments will appear here.</div>
        </div>
      )}

      {!loading && !error && rows.length > 0 && filtered.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "34px 24px", textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>No matching payments</div>
          <div style={{ fontSize: 13 }}>Try a different search.</div>
        </div>
      )}

      {/* ADDED: records as a table that fits without a horizontal scrollbar */}
      {!loading && !error && filtered.length > 0 && (
        <div className="ph-table-wrap" style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          <table className="ph-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", color: "#6B7280", textAlign: "left" }}>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "12%" }}>Date</th>
                {admin && <th style={{ padding: "11px 12px", fontWeight: 700, width: "16%" }}>User</th>}
                <th style={{ padding: "11px 12px", fontWeight: 700, width: admin ? "15%" : "20%" }}>Plan</th>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "9%" }}>Amount</th>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "7%" }}>Credits</th>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "14%" }}>Receipt No.</th>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "13%" }}>Txn ID</th>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "8%" }}>Status</th>
                <th style={{ padding: "11px 12px", fontWeight: 700, width: "10%" }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const s = st(r.status);
                return (
                  <tr key={r.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td data-label="Date" style={{ padding: "11px 12px", color: "#374151" }}>{when(r.created_at)}</td>
                    {admin && (
                      <td data-label="User" style={{ padding: "11px 12px", color: "#374151", overflow: "hidden" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>{r.user_name || "—"}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.user_email || ""}</div>
                      </td>
                    )}
                    <td data-label="Plan" style={{ padding: "11px 12px", color: "#111827", fontWeight: 600 }}>{r.plan_label || r.plan_id || "—"}</td>
                    <td data-label="Amount" style={{ padding: "11px 12px", color: "#111827", fontWeight: 700 }}>{inr(r.amount)}</td>
                    <td data-label="Credits" style={{ padding: "11px 12px" }}>
                      {r.credits_added ? <span style={{ background: "#EEF3FE", color: "#1A56DB", fontWeight: 700, borderRadius: 8, padding: "2px 8px" }}>+{r.credits_added}</span> : <span style={{ color: "#9CA3AF" }}>—</span>}
                    </td>
                    <td data-label="Receipt No." style={{ padding: "11px 12px", color: "#374151", fontFamily: "monospace", fontSize: 11, wordBreak: "break-all" }}>{r.status === "paid" ? receiptNoOf(r) : "—"}</td>
                    <td data-label="Txn ID" style={{ padding: "11px 12px", color: "#374151", fontFamily: "monospace", fontSize: 11, wordBreak: "break-all" }}>{r.razorpay_payment_id || "—"}</td>
                    <td data-label="Status" style={{ padding: "11px 12px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>{s.text}</span>
                    </td>
                    <td data-label="Receipt" style={{ padding: "11px 12px" }}>
                      {r.status === "paid" ? (
                        <button onClick={() => setReceiptFor(r)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #C7D7FE", background: "#EEF3FE", color: "#1A56DB", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>🧾 Receipt</button>
                      ) : (
                        <span style={{ color: "#9CA3AF", fontSize: 12 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {receiptFor && (
        <ReceiptModal payment={receiptFor} user={user} onClose={() => setReceiptFor(null)} />
      )}
    </div>
  );
}
