// ─── AcadHr Payment Helper (Razorpay) ─────────────────────────────────────────
// NEW FILE. Self-contained. It reuses your existing apiBase() and getToken().
// It does NOT modify any of your existing files or pages.
//
// Usage from anywhere in your app:
//   import { startPayment } from '../payments';       // adjust the path
//   startPayment('school_professional', {
//     onSuccess: () => alert('You are now on the Professional plan!'),
//   });
//
// The plan id (e.g. 'school_professional') must match a key in the PLANS map
// inside backend/controllers/paymentController.js.

import apiBase from './config/apiBase';
import { getToken } from './api';
import { downloadReceipt, toReceiptData } from './components/common/receiptTemplate'; // ADDED: receipt

// Loads Razorpay's checkout script once (no index.html edit needed)
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Big, centered success card shown after a verified payment.
 * Self-contained (plain DOM) so it works from this helper without any React wiring.
 */
function showPaymentSuccess(order, response) {
  try {
    if (!document.getElementById('acadhr-pay-success-style')) {
      const st = document.createElement('style');
      st.id = 'acadhr-pay-success-style';
      st.textContent =
        '@keyframes acadhrPopIn{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}' +
        '@keyframes acadhrCheckPop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}';
      document.head.appendChild(st);
    }
    const amount = (order && order.amount != null) ? ('₹' + (Number(order.amount) / 100).toLocaleString('en-IN')) : '';
    const label  = (order && order.label) ? String(order.label) : '';

    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(17,24,39,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Nunito,sans-serif;';

    const card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:22px;max-width:460px;width:100%;padding:44px 40px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.28);animation:acadhrPopIn .25s ease-out;';
    card.innerHTML =
      '<div style="width:92px;height:92px;border-radius:50%;background:#ECFDF5;border:3px solid #A7F3D0;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;animation:acadhrCheckPop .4s ease-out;">' +
        '<span style="font-size:48px;color:#059669;font-weight:900;line-height:1;">&#10003;</span>' +
      '</div>' +
      '<div style="font-size:26px;font-weight:800;color:#111827;margin-bottom:8px;">Payment Successful!</div>' +
      '<div style="font-size:15px;color:#6B7280;">Your plan is now active.</div>' +
      (label  ? '<div style="font-size:15px;color:#111827;font-weight:700;margin-top:16px;"></div>' : '') +
      (amount ? '<div style="font-size:30px;font-weight:900;color:#1A56DB;margin:4px 0 14px;font-family:\'Playfair Display\',serif;">' + amount + '</div>' : '<div style="height:14px;"></div>') +
      (order && order.credits ? '<div style="display:inline-block;background:#ECFDF5;color:#059669;border:1px solid #A7F3D0;border-radius:20px;padding:6px 16px;font-size:14px;font-weight:800;margin-bottom:22px;">+' + order.credits + ' credits added</div>' : '<div style="height:8px;"></div>') +
      '<button id="acadhr-pay-receipt" style="width:100%;padding:13px 0;border:1px solid #1A56DB;border-radius:12px;background:#EEF3FE;color:#1A56DB;font-weight:800;font-size:15px;cursor:pointer;font-family:Nunito,sans-serif;margin-bottom:10px;">&#128220; Download Receipt (PDF)</button>' +
      '<button id="acadhr-pay-ok" style="width:100%;padding:14px 0;border:none;border-radius:12px;background:#1A56DB;color:#fff;font-weight:800;font-size:16px;cursor:pointer;font-family:Nunito,sans-serif;">Done</button>';

    // Put the label in via textContent so it can never break the markup
    if (label) {
      const labelEl = card.querySelector('div[style*="margin-top:16px"]');
      if (labelEl) labelEl.textContent = label;
    }

    const close = () => { try { document.body.removeChild(overlay); } catch (e) {} };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    const okBtn = card.querySelector('#acadhr-pay-ok');
    if (okBtn) okBtn.addEventListener('click', close);

    // ADDED: build a receipt from the order + razorpay response and download it as PDF
    const rcBtn = card.querySelector('#acadhr-pay-receipt');
    if (rcBtn) rcBtn.addEventListener('click', function () {
      try {
        const data = toReceiptData({
          amount:              order && order.amount,
          plan_label:          order && order.label,
          credits_added:       order && order.credits,
          currency:            (order && order.currency) || 'INR',
          status:              'paid',
          created_at:          new Date().toISOString(),
          razorpay_payment_id: response && response.razorpay_payment_id,
          razorpay_order_id:   (response && response.razorpay_order_id) || (order && order.order_id),
          user_name:           order && order.prefill_name,
          user_email:          order && order.prefill_email,
        });
        downloadReceipt(data);
      } catch (e) { /* ignore */ }
    });
  } catch (e) {
    alert('✅ Payment successful! Your plan is now active.');
  }
}

/**
 * startPayment(planId, opts)
 * opts.onSuccess(data)  — called after the payment is verified on the backend
 * opts.onDismiss()      — called if the user closes the popup without paying
 */
export async function startPayment(planId, opts = {}) {
  const token = getToken();
  if (!token) {
    alert('Please log in first to make a payment.');
    return;
  }

  const ok = await loadRazorpayScript();
  if (!ok) {
    alert('Could not load the payment gateway. Please check your internet connection and try again.');
    return;
  }

  // 1) Ask OUR backend to create an order (amount is decided server-side)
  let order;
  try {
    const res = await fetch(`${apiBase()}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan_id: planId }),
    });
    order = await res.json();
    if (!res.ok) { alert(order.message || 'Could not start payment.'); return; }
  } catch (e) {
    alert('Network error while starting payment. Please try again.');
    return;
  }

  // 2) Open the Razorpay checkout popup
  const rzp = new window.Razorpay({
    key:         order.key_id,
    amount:      order.amount,
    currency:    order.currency,
    name:        'AcadHr',
    description: order.label,
    order_id:    order.order_id,
    prefill:     { name: order.prefill_name, email: order.prefill_email },
    theme:       { color: '#1A56DB' },
    // 3) After payment, verify it on OUR backend before trusting it
    handler: async function (response) {
      try {
        const vr = await fetch(`${apiBase()}/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...response, plan_id: planId }),
        });
        const vd = await vr.json();
        if (vr.ok && vd.success) {
          showPaymentSuccess(order, response);
          if (opts.onSuccess) opts.onSuccess(vd);
        } else {
          alert(vd.message || 'Payment could not be verified.');
        }
      } catch (e) {
        alert('Payment done, but verification failed to reach the server. Please contact support with your payment id.');
      }
    },
    modal: { ondismiss: () => { if (opts.onDismiss) opts.onDismiss(); } },
  });

  rzp.on('payment.failed', function (resp) {
    alert('Payment failed: ' + ((resp.error && resp.error.description) || 'Unknown error'));
  });

  rzp.open();
}
