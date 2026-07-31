// import { useState } from "react";
// import { Navbar } from "../components/common/Shared";

// const PLANS = {
//   school: [
//     {
//       name:     "Starter",
//       price:    "Free",
//       period:   "",
//       color:    "#6B7280",
//       bg:       "#F9FAFB",
//       border:   "#E5E7EB",
//       badge:    "",
//       features: [
//         "2 active job postings",
//         "50 applicant views/month",
//         "Basic candidate profiles",
//         "Email support",
//         "AcadHr branding",
//       ],
//       cta: "Get Started Free",
//       ctaStyle: { background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB" },
//     },
//     {
//       name:     "Professional",
//       price:    "₹2,499",
//       period:   "/month",
//       color:    "#1A56DB",
//       bg:       "#EBF5FF",
//       border:   "#93C5FD",
//       badge:    "Most Popular",
//       features: [
//         "10 active job postings",
//         "Unlimited applicant views",
//         "Full candidate profiles + contact",
//         "Resume download",
//         "Priority listing in search",
//         "WhatsApp + email support",
//         "Analytics dashboard",
//       ],
//       cta: "Start Free Trial",
//       ctaStyle: { background:"#1A56DB", color:"#fff" },
//     },
//     {
//       name:     "Enterprise",
//       price:    "₹7,999",
//       period:   "/month",
//       color:    "#6D28D9",
//       bg:       "#F5F3FF",
//       border:   "#C4B5FD",
//       badge:    "Best Value",
//       features: [
//         "Unlimited job postings",
//         "Unlimited applicant access",
//         "Dedicated account manager",
//         "Bulk hiring tools",
//         "Campus connect program",
//         "API access",
//         "Custom branding",
//         "SLA support",
//       ],
//       cta: "Contact Sales",
//       ctaStyle: { background:"#6D28D9", color:"#fff" },
//     },
//   ],
//   teacher: [
//     {
//       name:     "Free",
//       price:    "Free",
//       period:   "Forever",
//       color:    "#6B7280",
//       bg:       "#F9FAFB",
//       border:   "#E5E7EB",
//       badge:    "",
//       features: [
//         "Basic profile",
//         "Apply to 5 jobs/month",
//         "View job listings",
//         "Email alerts",
//       ],
//       cta: "Sign Up Free",
//       ctaStyle: { background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB" },
//     },
//     {
//       name:     "Pro Teacher",
//       price:    "₹299",
//       period:   "/month",
//       color:    "#059669",
//       bg:       "#ECFDF5",
//       border:   "#6EE7B7",
//       badge:    "Recommended",
//       features: [
//         "Unlimited job applications",
//         "Priority profile visibility",
//         "Direct contact from schools",
//         "Resume builder",
//         "Interview tips & resources",
//         "Salary insights",
//         "Career counselling session",
//       ],
//       cta: "Go Pro",
//       ctaStyle: { background:"#059669", color:"#fff" },
//     },
//   ],
// };

// const FAQ = [
//   { q:"Can I cancel anytime?",                    a:"Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
//   { q:"Is there a free trial?",                   a:"Yes! The Professional plan comes with a 14-day free trial. No credit card required." },
//   { q:"How are payments processed?",              a:"We accept all major credit/debit cards and UPI via our secure Razorpay payment gateway." },
//   { q:"Can I upgrade or downgrade my plan?",      a:"Absolutely. You can change your plan anytime from your account settings. Upgrades are instant." },
//   { q:"Do you offer discounts for annual plans?", a:"Yes! Annual billing gives you 2 months free (saves up to 20%). Contact us for annual pricing." },
// ];

// export default function PricingPage({ setPage }) {
//   const [tab, setTab] = useState("school");
//   const [openFaq, setOpenFaq] = useState(null);

//   return (
//     <div style={{ minHeight:"100vh", background:"#F9FAFB" }}>
//       <Navbar setPage={setPage} />
//       <div style={{ paddingTop:90 }}>

//         {/* Hero */}
//         <div style={{ background:"linear-gradient(135deg,#111827,#1E3A8A)", padding:"60px 0 50px", textAlign:"center" }}>
//           <div className="container">
//             <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.1)", borderRadius:20, padding:"5px 16px", fontSize:13, color:"#93C5FD", fontWeight:600, marginBottom:16 }}>
//               💳 Simple, Transparent Pricing
//             </div>
//             <h1 style={{ fontSize:42, fontWeight:900, color:"#fff", marginBottom:14 }}>Choose Your Plan</h1>
//             <p style={{ color:"#9CA3AF", fontSize:16, maxWidth:500, margin:"0 auto 32px" }}>
//               Whether you're a school hiring teachers or a teacher looking for opportunities — we have a plan for you
//             </p>
//             {/* Toggle */}
//             <div style={{ display:"inline-flex", background:"rgba(255,255,255,.1)", borderRadius:12, padding:4, gap:4 }}>
//               {[["school","🏫 For Schools"],["teacher","👩‍🏫 For Teachers"]].map(([id, label]) => (
//                 <button key={id} onClick={() => setTab(id)}
//                   style={{ padding:"10px 24px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"Nunito,sans-serif", transition:"all .2s",
//                     background: tab===id?"#fff":"transparent",
//                     color:      tab===id?"#111827":"#9CA3AF",
//                     boxShadow:  tab===id?"0 2px 8px rgba(0,0,0,.15)":"none" }}>
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Plans */}
//         <div className="container" style={{ padding:"48px 0" }}>
//           <div style={{ display:"grid", gridTemplateColumns:`repeat(${PLANS[tab].length},1fr)`, gap:24, maxWidth: PLANS[tab].length===2 ? 800 : 1000, margin:"0 auto" }}>
//             {PLANS[tab].map(plan => (
//               <div key={plan.name}
//                 style={{ background:"#fff", borderRadius:20, border:`2px solid ${plan.border}`, padding:32, position:"relative", transition:"all .2s",
//                   boxShadow: plan.badge ? "0 8px 32px rgba(26,86,219,.15)" : "0 2px 8px rgba(0,0,0,.06)" }}
//                 onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>

//                 {plan.badge && (
//                   <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:plan.color, color:"#fff", borderRadius:20, padding:"4px 16px", fontSize:12, fontWeight:800, whiteSpace:"nowrap" }}>
//                     ⭐ {plan.badge}
//                   </div>
//                 )}

//                 <div style={{ background:plan.bg, borderRadius:12, padding:"6px 12px", display:"inline-block", marginBottom:16 }}>
//                   <span style={{ fontSize:12, fontWeight:800, color:plan.color, textTransform:"uppercase", letterSpacing:1 }}>{plan.name}</span>
//                 </div>

//                 <div style={{ marginBottom:24 }}>
//                   <span style={{ fontSize:40, fontWeight:900, color:"#111827" }}>{plan.price}</span>
//                   {plan.period && <span style={{ fontSize:16, color:"#6B7280", fontWeight:600 }}>{plan.period}</span>}
//                 </div>

//                 <ul style={{ listStyle:"none", padding:0, margin:"0 0 28px", display:"flex", flexDirection:"column", gap:10 }}>
//                   {plan.features.map(f => (
//                     <li key={f} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:14, color:"#374151" }}>
//                       <span style={{ color:"#059669", fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>
//                       {f}
//                     </li>
//                   ))}
//                 </ul>

//                 <button onClick={() => setPage("signup")}
//                   style={{ width:"100%", padding:"13px 0", borderRadius:12, border:"none", cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"Nunito,sans-serif", transition:"all .15s", ...plan.ctaStyle }}>
//                   {plan.cta} →
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Trust badges */}
//           <div style={{ display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap", marginTop:48, padding:"28px 0", borderTop:"1px solid #E5E7EB", borderBottom:"1px solid #E5E7EB" }}>
//             {["🔒 Secure Payment","📞 24/7 Support","↩️ 14-day Refund","🇮🇳 Made in India"].map(b => (
//               <div key={b} style={{ fontSize:14, fontWeight:700, color:"#6B7280" }}>{b}</div>
//             ))}
//           </div>

//           {/* FAQ */}
//           <div style={{ maxWidth:680, margin:"48px auto 0" }}>
//             <h2 style={{ fontSize:26, fontWeight:900, color:"#111827", textAlign:"center", marginBottom:32 }}>Frequently Asked Questions</h2>
//             {FAQ.map((item, i) => (
//               <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, marginBottom:10, overflow:"hidden" }}>
//                 <div onClick={() => setOpenFaq(openFaq===i ? null : i)}
//                   style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", cursor:"pointer", fontWeight:700, fontSize:15, color:"#111827" }}>
//                   <span>{item.q}</span>
//                   <span style={{ color:"#6B7280", fontSize:18, transition:"transform .2s", transform:openFaq===i?"rotate(180deg)":"none" }}>▾</span>
//                 </div>
//                 {openFaq===i && (
//                   <div style={{ padding:"0 20px 16px", fontSize:14, color:"#6B7280", lineHeight:1.7, borderTop:"1px solid #F3F4F6" }}>
//                     {item.a}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* CTA Banner */}
//           <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", borderRadius:20, padding:"40px 36px", marginTop:48, textAlign:"center" }}>
//             <h2 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:10 }}>Ready to get started?</h2>
//             <p style={{ color:"#93C5FD", fontSize:15, marginBottom:24 }}>Join 12,400+ educators and 3,200+ schools already on AcadHr</p>
//             <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
//               <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}
//                 style={{ background:"#fff", color:"#1A56DB", fontWeight:800 }}>
//                 Start Free Today →
//               </button>
//               <button onClick={() => setPage("howitworks")}
//                 style={{ background:"transparent", border:"2px solid rgba(255,255,255,.4)", color:"#fff", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:15, fontFamily:"Nunito,sans-serif" }}>
//                 See How It Works
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Navbar } from "../components/common/Shared";
import { useAuth } from "../context/AuthContext";
import apiBase from "../config/apiBase";

const PLANS = {
  school: [
    {
      name:     "Basic Recruitment",
      icon:     "🎖️",
      price:    "₹4,999",
      period:   "/month per school",
      prices: {
        "1m": { price: "₹4,999",  period: "/month per school" },
        "3m": { price: "₹14,250", period: "/3 months per school", note: "≈ ₹4,750/mo · save 5%" },
        "6m": { price: "₹26,995", period: "/6 months per school", note: "≈ ₹4,499/mo · save 10%" },
      },
      color:    "#374151",
      bg:       "#F3F4F6",
      border:   "#E5E7EB",
      badge:    "",
      features: [
        "Post up to 5 jobs",
        "Faculty Resume Database Access",
        "Candidate Search Filters",
        "Email & WhatsApp Candidate Alerts",
        "School Profile Page",
        "Applicant Tracking Dashboard",
        "Basic Recruitment Reports",
      ],
      cta: "Get Started",
      ctaStyle: { background:"#4B5563", color:"#fff" },
    },
    {
      name:      "Professional Hiring",
      icon:      "🎖️",
      price:     "₹15,000",
      period:    "/month per school",
      prices: {
        "1m": { price: "₹15,000", period: "/month per school" },
        "3m": { price: "₹42,750", period: "/3 months per school", note: "≈ ₹14,250/mo · save 5%" },
        "6m": { price: "₹81,000", period: "/6 months per school", note: "≈ ₹13,500/mo · save 10%" },
      },
      color:     "#1A56DB",
      bg:        "#EBF5FF",
      border:    "#93C5FD",
      badge:     "Most Popular",
      badgeIcon: "⭐",
      featuresHeading: "Everything in Basic plus:",
      features: [
         "Post Up to 10 jobs/month",
        "Dedicated Recruitment Coordinator",
        "Candidate Screening Support",
       
        "Interview Coordination",
        
        
        "Priority Access to Top Faculty",
        "Subject-wise Talent Pool",
        "Principals",
        "Vice Principals",
        "Academic Directors",
        "Coordinators",
        "Featured School Profile",
        "Featured Job Listings",
        
      ],
      cta: "Start Hiring",
      ctaStyle: { background:"#1A56DB", color:"#fff" },
    },
    {
      name:      "Enterprise Chain School",
      icon:      "🎖️",
      price:     "₹25,000 – ₹1,00,000",
      period:    "/month",
      note:      "Ideal for groups with 5+ schools",
      color:     "#6D28D9",
      bg:        "#F5F3FF",
      border:    "#C4B5FD",
      badge:     "Enterprise",
      badgeIcon: "💎",
      featuresHeading: "Everything in Professional plus:",
      features: [
        "Dedicated Recruiter , Single Point of Contact",
        "Monthly Recruitment Planning",
        
        
        "Requirement Collection",
        
        
        
        "Demo Classes Scheduling",
        
        "Joining Tracking",
        "Principals",
        "Vice Principals",
        "Academic Heads",
        "Deans",
        "HODs",
        "Counselors",
      ],
      cta: "Contact Sales",
      ctaStyle: { background:"#6D28D9", color:"#fff" },
    },
  ],
  teacher: [
    {
      name:     "Inaugural Offer",
      price:    "Free",
      period:   "Limited launch offer",
      color:    "#059669",
      bg:       "#ECFDF5",
      border:   "#A7F3D0",
      badge:    "Free",
      badgeIcon:"🎉",
      features: [
        "Basic profile",
        "Apply to up to 5 jobs",
        "View job listings",
        "Job alerts",
      ],
      cta: "Get Started Free",
      ctaStyle: { background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB" },
    },
    {
      name:     "Starter",
      color:    "#1A56DB",
      bg:        "#EFF5FF",
      border:    "#BFDBFE",
      badge:     "",
      prices: {
        "1m": { price:"₹1,500", period:"+ GST / month" },
        "3m": { price:"₹4,050", period:"+ GST / 3 months", note:"≈ ₹1,350/mo · save 10%" },
      },
      features: [
        "Apply to up to 10 jobs",
        "Priority profile visibility",
        "Resume building",
        "Access to shortlisted jobs",
        { text:"Regular job alerts", highlight:true },
      ],
      cta: "Choose Starter",
      ctaStyle: { background:"#1A56DB", color:"#fff" },
    },
    {
      name:     "Premium",
      color:    "#4F46E5",
      bg:        "#EEF2FF",
      border:    "#C7D2FE",
      badge:     "Most Popular",
      badgeIcon: "⭐",
      prices: {
        "1m": { price:"₹2,000", period:"+ GST / month" },
        "3m": { price:"₹5,400", period:"+ GST / 3 months", note:"≈ ₹1,800/mo · save 10%" },
      },
      features: [
        "Top priority visibility",
        "Direct interview opportunities from schools",
        "Dedicated profile promotion",
        { text:"Early alerts to high-paying roles", highlight:true },
      ],
      cta: "Go Premium",
      ctaStyle: { background:"#4F46E5", color:"#fff" },
    },
    {
      name:     "Prestige",
      subtitle: "Exclusively for leadership roles",
      color:    "#B45309",
      bg:        "#FFFBEB",
      border:    "#FDE68A",
      badge:     "Leadership",
      badgeIcon: "👑",
      prices: {
        "1m": { price:"₹2,500", period:"+ GST / month" },
        "3m": { price:"₹6,750", period:"+ GST / 3 months", note:"≈ ₹2,250/mo · save 10%" },
      },
      features: [
        "Dedicated HR for interviews",
        "Profile boosting",
        { text:"Early job alerts", highlight:true },
      ],
      cta: "Go Prestige",
      ctaStyle: { background:"#B45309", color:"#fff" },
    },
  ],
  tutor: [
    {
      name:     "Inaugural Offer",
      color:    "#0891B2",
      bg:        "#ECFEFF",
      border:    "#67E8F9",
      badge:     "Launch Offer",
      badgeIcon: "🎉",
      prices: {
        "1m": { price:"₹1,500", period:"+ GST / month" },
        "3m": { price:"₹4,050", period:"+ GST / 3 months", note:"≈ ₹1,350/mo · save 10%" },
      },
      features: [
        "Apply to up to 10 profiles",
        "Improved profile visibility",
        { text:"Shortlisted job alerts", highlight:true },
      ],
      cta: "Get the Offer",
      ctaStyle: { background:"#0891B2", color:"#fff" },
    },
    {
      name:      "Pro Tutor",
      color:     "#0E7490",
      bg:        "#CFFAFE",
      border:    "#22D3EE",
      badge:     "Most Popular",
      badgeIcon: "⭐",
      prices: {
        "1m": { price:"₹3,000", period:"+ GST / month" },
        "3m": { price:"₹8,100", period:"+ GST / 3 months", note:"≈ ₹2,700/mo · save 10%" },
      },
      features: [
        "Up to 20 job applications",
        "Priority profile shown to parents",
        "Direct recruiter support",
        { text:"Highlighted profile", highlight:true },
      ],
      cta: "Go Pro",
      ctaStyle: { background:"#0E7490", color:"#fff" },
    },
  ],
  parent: [
    {
      name:     "Inaugural Offer",
      price:    "Free",
      period:   "Limited launch offer",
      color:    "#059669",
      bg:       "#ECFDF5",
      border:   "#A7F3D0",
      badge:    "Launch Offer",
      badgeIcon:"🎉",
      features: [
        "Post 1 tuition request",
        "View tutor profiles",
        "Academic updates",
        { text:"20 free credits", highlight:true },
      ],
      cta: "Get Started Free",
      ctaStyle: { background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB" },
    },
    {
      name:     "Starter",
      color:    "#DB2777",
      bg:       "#FDF2F8",
      border:   "#F9A8D4",
      badge:    "Most Popular",
      badgeIcon:"⭐",
      prices: {
        "1m": { price:"₹1,000", period:"+ GST / month" },
        "3m": { price:"₹2,700", period:"+ GST / 3 months", note:"≈ ₹900/mo · save 10%" },
      },
      features: [
        "2–3 tuition requests",
        "Access tutor profiles",
        { text:"60 unlock credits", highlight:true },
      ],
      cta: "Choose Starter",
      ctaStyle: { background:"#DB2777", color:"#fff" },
    },
    {
      name:     "Premium",
      color:    "#7C3AED",
      bg:       "#F5F3FF",
      border:   "#DDD6FE",
      badge:    "",
      prices: {
        "1m": { price:"₹2,000", period:"+ GST / month" },
        "3m": { price:"₹5,400", period:"+ GST / 3 months", note:"≈ ₹1,800/mo · save 10%" },
      },
      features: [
        "4–5 tuition requests",
        { text:"100 unlock credits", highlight:true },
        "Dedicated recruiter support",
        "Demo class scheduling",
        "One month dedicated support",
      ],
      cta: "Choose Premium",
      ctaStyle: { background:"#7C3AED", color:"#fff" },
    },
  ],
};

const FAQ = [
  { q:"Can I cancel anytime?",                    a:"Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
  { q:"Is there a free trial?",                   a:"Yes! The Professional plan comes with a 14-day free trial. No credit card required." },
  { q:"How are payments processed?",              a:"We accept all major credit/debit cards and UPI via our secure Razorpay payment gateway." },
  { q:"Can I upgrade or downgrade my plan?",      a:"Absolutely. You can change your plan anytime from your account settings. Upgrades are instant." },
  { q:"Do you offer discounts for annual plans?", a:"Yes! Annual billing gives you 2 months free (saves up to 20%). Contact us for annual pricing." },
];

export default function PricingPage({ setPage }) {
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);
  const [cs, setCs] = useState({ school_name:"", contact_person:"", phone:"", email:"", num_schools:"", message:"" });
  const [csStatus, setCsStatus] = useState({ loading:false, ok:"", err:"" });
  const submitContact = async () => {
    if (!cs.school_name.trim() || !cs.phone.trim() || !cs.email.trim()) {
      setCsStatus({ loading:false, ok:"", err:"Please fill school name, mobile number and email." });
      return;
    }
    setCsStatus({ loading:true, ok:"", err:"" });
    try {
      const r = await fetch(`${apiBase()}/contact-sales`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...cs, plan:"Enterprise" }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.message || "Could not submit. Please try again.");
      setCsStatus({ loading:false, ok: d.message || "Thanks! Our team will contact you shortly.", err:"" });
      setCs({ school_name:"", contact_person:"", phone:"", email:"", num_schools:"", message:"" });
    } catch (e) {
      setCsStatus({ loading:false, ok:"", err: e.message });
    }
  };
  const [tab, setTab] = useState("school");
  const [openFaq, setOpenFaq] = useState(null);
  const [billing, setBilling] = useState("1m");

  // Apply the selected billing period (monthly / 3 months / yearly) to plans that offer pricing
  const plans = PLANS[tab].map(p => {
    if (!p.prices) return p;
    if (billing === "12m" && tab === "school") {
      const monthly = parseInt((p.prices["1m"].price || "").replace(/[^\d]/g, ""), 10) || 0;
      const yearly = monthly * 10; // pay for 10 months — 2 months free
      return { ...p, price: "₹" + yearly.toLocaleString("en-IN"), period: "+ GST / year", note: "2 months free" };
    }
    const pr = p.prices[billing] || p.prices["1m"];
    return { ...p, price: pr.price, period: pr.period, note: pr.note || p.note };
  });

  return (
    <div className="fw-page" style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="pricing" />
      {showContact && (
        <div onClick={() => setShowContact(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:18, padding:28, width:"100%", maxWidth:440, boxShadow:"0 20px 60px rgba(0,0,0,.3)", fontFamily:"Nunito,sans-serif", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:0 }}>Contact Sales</h3>
              <button onClick={() => setShowContact(false)} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:"#9CA3AF", lineHeight:1 }}>×</button>
            </div>
            <p style={{ fontSize:13, color:"#6B7280", marginTop:0, marginBottom:18 }}>Tell us about your group and our team will reach out.</p>
            {csStatus.ok ? (
              <div style={{ background:"#ECFDF5", color:"#059669", borderRadius:10, padding:"16px", fontWeight:700, fontSize:14, textAlign:"center" }}>{csStatus.ok}</div>
            ) : (
              <>
                {[
                  ["School / Group Name *","school_name","text","e.g. PV Group of Schools"],
                  ["Contact Person","contact_person","text","Your name"],
                  ["Mobile Number *","phone","tel","10-digit mobile"],
                  ["School Email ID *","email","email","name@school.com"],
                  ["Number of Schools","num_schools","text","e.g. 5"],
                ].map(([label,key,type,ph]) => (
                  <div key={key} style={{ marginBottom:12 }}>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:5 }}>{label}</label>
                    <input type={type} value={cs[key]} onChange={e => setCs(s => ({ ...s, [key]:e.target.value }))} placeholder={ph}
                      style={{ width:"100%", padding:"10px 12px", border:"1px solid #E5E7EB", borderRadius:10, fontSize:14, fontFamily:"Nunito,sans-serif", boxSizing:"border-box" }} />
                  </div>
                ))}
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:5 }}>Message</label>
                  <textarea value={cs.message} onChange={e => setCs(s => ({ ...s, message:e.target.value }))} placeholder="Anything you'd like us to know..." rows={3}
                    style={{ width:"100%", padding:"10px 12px", border:"1px solid #E5E7EB", borderRadius:10, fontSize:14, fontFamily:"Nunito,sans-serif", boxSizing:"border-box", resize:"vertical" }} />
                </div>
                {csStatus.err && <div style={{ color:"#DC2626", fontSize:13, fontWeight:600, marginBottom:12 }}>{csStatus.err}</div>}
                <button onClick={submitContact} disabled={csStatus.loading}
                  style={{ width:"100%", padding:"13px 0", borderRadius:12, border:"none", cursor: csStatus.loading?"default":"pointer", fontWeight:800, fontSize:15, fontFamily:"Nunito,sans-serif", background:"#6D28D9", color:"#fff", opacity: csStatus.loading?0.7:1 }}>
                  {csStatus.loading ? "Submitting..." : "Submit →"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div style={{ paddingTop:90 }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#111827,#1E3A8A)", padding:"60px 0 50px", textAlign:"center" }}>
          <div className="container">
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.1)", borderRadius:20, padding:"5px 16px", fontSize:13, color:"#93C5FD", fontWeight:600, marginBottom:16 }}>
              💳 Simple, Transparent Pricing
            </div>
            <h1 style={{ fontSize:42, fontWeight:900, color:"#fff", marginBottom:14 }}>Choose Your Plan</h1>
            <p style={{ color:"#9CA3AF", fontSize:16, maxWidth:500, margin:"0 auto 32px" }}>
              Whether you're a school hiring teachers or a teacher looking for opportunities — we have a plan for you
            </p>
            {/* Toggle */}
            <div style={{ display:"inline-flex", flexWrap:"wrap", justifyContent:"center", background:"rgba(255,255,255,.1)", borderRadius:12, padding:4, gap:4 }}>
              {[["school","🏫 For Schools"],["teacher","👩‍🏫 For Teachers"],["tutor","📚 For Tutors"],["parent","👪 For Parents"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{ padding:"10px 20px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"Nunito,sans-serif", transition:"all .2s",
                    background: tab===id?"#fff":"transparent",
                    color:      tab===id?"#111827":"#9CA3AF",
                    boxShadow:  tab===id?"0 2px 8px rgba(0,0,0,.15)":"none" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="container" style={{ padding:"48px 0" }}>

          {/* Billing period toggle — shown for plans that offer monthly / 3-monthly */}
          {plans.some(p => p.prices) && (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:30 }}>
              <div style={{ display:"inline-flex", flexWrap:"wrap", background:"#fff", borderRadius:12, padding:4, gap:4, border:"1px solid #E5E7EB", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
                {[["1m","1 Month"],["3m", tab === "school" ? "3 Months · save 5%" : "3 Months · save 10%"], ...(tab === "school" ? [["6m","6 Months · save 10%"],["12m","Yearly · 2 months free"]] : [])].map(([id, label]) => (
                  <button key={id} onClick={() => setBilling(id)}
                    style={{ padding:"9px 20px", borderRadius:9, border:"none", cursor:"pointer", fontWeight:700, fontSize:13.5, fontFamily:"Nunito,sans-serif", transition:"all .2s",
                      background: billing===id ? "#1A56DB" : "transparent",
                      color:      billing===id ? "#fff" : "#6B7280" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pricing-grid" style={{ display:"grid", gridTemplateColumns:`repeat(${plans.length},1fr)`, gap:24, maxWidth: plans.length===2 ? 800 : plans.length>=4 ? 1280 : 1000, margin:"0 auto" }}>
            {plans.map(plan => (
              <div key={plan.name}
                style={{ background:"#fff", borderRadius:20, border:`2px solid ${plan.border}`, padding:32, position:"relative", transition:"all .2s",
                  boxShadow: plan.badge ? "0 8px 32px rgba(26,86,219,.15)" : "0 2px 8px rgba(0,0,0,.06)" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>

                {plan.badge && (
                  <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:plan.color, color:"#fff", borderRadius:20, padding:"4px 16px", fontSize:12, fontWeight:800, whiteSpace:"nowrap" }}>
                    {plan.badgeIcon || "⭐"} {plan.badge}
                  </div>
                )}

                <div style={{ background:plan.bg, borderRadius:12, padding:"6px 12px", display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
                  {plan.icon && <span style={{ fontSize:13 }}>{plan.icon}</span>}
                  <span style={{ fontSize:12, fontWeight:800, color:plan.color, textTransform:"uppercase", letterSpacing:1 }}>{plan.name}</span>
                </div>

                {plan.subtitle && (
                  <p style={{ fontSize:13, color:"#6B7280", fontWeight:600, margin:"0 0 16px" }}>{plan.subtitle}</p>
                )}

                <div style={{ marginBottom: plan.note ? 8 : 24 }}>
                  {plan.oldPrice && (
                    <div style={{ fontSize:16, color:"#9CA3AF", fontWeight:700, textDecoration:"line-through", marginBottom:2 }}>
                      {plan.oldPrice}{plan.period}
                    </div>
                  )}
                  <div style={{ fontSize: plan.price.length > 10 ? 27 : 36, fontWeight:900, color:"#111827", lineHeight:1.15 }}>{plan.price}</div>
                  {plan.period && <div style={{ fontSize:14, color:"#6B7280", fontWeight:600, marginTop:4 }}>{plan.period}</div>}
                </div>

                {plan.note && (
                  <p style={{ fontSize:13, color:"#9CA3AF", fontWeight:500, margin:"0 0 20px" }}>{plan.note}</p>
                )}

                {plan.featuresHeading && (
                  <p style={{ fontSize:14, fontWeight:800, color:"#111827", margin:"0 0 14px" }}>{plan.featuresHeading}</p>
                )}

                <ul style={{ listStyle:"none", padding:0, margin:"0 0 28px", display:"flex", flexDirection:"column", gap:10 }}>
                  {plan.features.map((f, i) => {
                    const text      = typeof f === "object" ? f.text : f;
                    const highlight = typeof f === "object" && f.highlight;
                    return (
                      <li key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:14, color: highlight ? "#C2410C" : "#374151", fontWeight: highlight ? 700 : 400 }}>
                        <span style={{ color: highlight ? "#EA580C" : "#059669", fontWeight:800, flexShrink:0, marginTop:1 }}>{highlight ? "🔥" : "✓"}</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>

                <button onClick={() => { if (plan.cta === "Contact Sales") { setCsStatus({ loading:false, ok:"", err:"" }); setShowContact(true); return; } setPage(user ? "dashboard" : "login"); }}
                  style={{ width:"100%", padding:"13px 0", borderRadius:12, border:"none", cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"Nunito,sans-serif", transition:"all .15s", ...plan.ctaStyle }}>
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap", marginTop:48, padding:"28px 0", borderTop:"1px solid #E5E7EB", borderBottom:"1px solid #E5E7EB" }}>
            {["🔒 Secure Payment","📞 24/7 Support","↩️ 14-day Refund","🇮🇳 Made in India"].map(b => (
              <div key={b} style={{ fontSize:14, fontWeight:700, color:"#6B7280" }}>{b}</div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ maxWidth:680, margin:"48px auto 0" }}>
            <h2 style={{ fontSize:26, fontWeight:900, color:"#111827", textAlign:"center", marginBottom:32 }}>Frequently Asked Questions</h2>
            {FAQ.map((item, i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, marginBottom:10, overflow:"hidden" }}>
                <div onClick={() => setOpenFaq(openFaq===i ? null : i)}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", cursor:"pointer", fontWeight:700, fontSize:15, color:"#111827" }}>
                  <span>{item.q}</span>
                  <span style={{ color:"#6B7280", fontSize:18, transition:"transform .2s", transform:openFaq===i?"rotate(180deg)":"none" }}>▾</span>
                </div>
                {openFaq===i && (
                  <div style={{ padding:"0 20px 16px", fontSize:14, color:"#6B7280", lineHeight:1.7, borderTop:"1px solid #F3F4F6" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div style={{ background:"linear-gradient(135deg,#1E429F,#1A56DB)", borderRadius:20, padding:"40px 36px", marginTop:48, textAlign:"center" }}>
            <h2 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:10 }}>Ready to get started?</h2>
            <p style={{ color:"#93C5FD", fontSize:15, marginBottom:24 }}>Join 12,400+ educators and 3,200+ schools already on AcadHr</p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}
                style={{ background:"#fff", color:"#1A56DB", fontWeight:800 }}>
                Start Free Today →
              </button>
              <button onClick={() => setPage("collaboration")}
                style={{ background:"transparent", border:"2px solid rgba(255,255,255,.4)", color:"#fff", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:15, fontFamily:"Nunito,sans-serif" }}>
                How We Collaborate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}