// ─── AcadHr <PaymentButton /> ─────────────────────────────────────────────────
// NEW, OPTIONAL component. Drop it anywhere you want a "pay" button, WITHOUT
// changing your PricingPage or any existing logic. Example:
//
//   import PaymentButton from '../components/common/PaymentButton';
//   <PaymentButton planId="school_professional" onSuccess={() => setPage('dashboard')}>
//     Upgrade to Professional
//   </PaymentButton>
//
// planId must match a key in backend/controllers/paymentController.js PLANS map.

import React, { useState } from 'react';
import { startPayment } from '../../payments';

export default function PaymentButton({ planId, children, onSuccess, style }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await startPayment(planId, { onSuccess });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        width: '100%',
        padding: '13px 0',
        borderRadius: 12,
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        fontWeight: 800,
        fontSize: 15,
        fontFamily: 'Nunito,sans-serif',
        background: '#1A56DB',
        color: '#fff',
        opacity: loading ? 0.7 : 1,
        ...style,
      }}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
