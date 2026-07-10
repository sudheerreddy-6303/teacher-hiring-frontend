import { Navbar, Brand, Divider } from "../components/common/Shared";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `These Terms and Conditions ("Terms") govern your access to and use of AcadHr, a platform operated by DEERAJ TECHNOLOGY PRIVATE LIMITED that connects teachers, tutors, schools, coaching institutes and parents for teaching jobs, tutoring and tuition requirements. By creating an account or using AcadHr in any way, you agree to be bound by these Terms. If you do not agree, please do not use the platform.`,
  },
  {
    title: "2. Description of Service",
    body: `AcadHr is an online job portal and connection platform for the education sector. Schools and institutions can post job vacancies and search teacher/tutor profiles. Teachers and tutors can create profiles, browse jobs and apply. Parents can post tuition requirements, and tutors can respond to them. AcadHr facilitates these connections but is not a recruitment consultancy, employer, or party to any employment or tutoring arrangement made between users.`,
  },
  {
    title: "3. Eligibility & Account Registration",
    body: `You must be at least 18 years old to register an account on AcadHr. When creating an account, you agree to provide accurate, current and complete information and to keep it updated. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Notify us immediately of any unauthorised use of your account.`,
  },
  {
    title: "4. User Responsibilities",
    body: `Teachers and tutors are responsible for the accuracy of the qualifications, experience and other details on their profile. Schools and institutions are responsible for the accuracy of job postings and for conducting their own due diligence (such as verifying credentials and references) before hiring. Parents posting tuition requirements are responsible for verifying tutors before engaging them. AcadHr does not guarantee the accuracy of information posted by users and is not liable for any misrepresentation by a user.`,
  },
  {
    title: "5. No Guarantee of Employment or Outcomes",
    body: `AcadHr provides a platform to connect users but does not guarantee that any teacher will be hired, that any job posting will be filled, or that any tuition requirement will be fulfilled. Any employment, tutoring or business relationship formed between users is strictly between those users, and AcadHr is not responsible for the terms, conduct, performance or outcome of such relationships.`,
  },
  {
    title: "6. Fees & Payments",
    body: `Certain features of AcadHr (such as the plans described on our Pricing page) may require payment of fees. Fees, where applicable, are clearly displayed before purchase and are non-refundable except as required by law or as otherwise stated at the time of purchase. Any salary, tuition fee or payment agreed between a teacher/tutor and a school/parent is a private arrangement between those parties and is not processed or guaranteed by AcadHr.`,
  },
  {
    title: "7. Prohibited Conduct",
    body: `You agree not to: post false, misleading or fraudulent information; impersonate any person or entity; use the platform for any unlawful purpose; harass, abuse or harm other users; upload viruses or malicious code; scrape or copy data from the platform without permission; or attempt to gain unauthorised access to any part of AcadHr. We reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    title: "8. Content & Intellectual Property",
    body: `You retain ownership of the content you submit (such as your profile details, resume and photos), but you grant AcadHr a licence to use, display and share that content on the platform for the purpose of providing our services (for example, showing your profile to schools or parents). The AcadHr name, logo, design and platform content (excluding user-submitted content) are the property of DEERAJ TECHNOLOGY PRIVATE LIMITED and may not be copied or used without permission.`,
  },
  {
    title: "9. Third-Party Links & Services",
    body: `AcadHr may contain links to third-party websites or use third-party services (such as WhatsApp, email or SMS providers) for communication. We are not responsible for the content, policies or practices of any third-party site or service.`,
  },
  {
    title: "10. Disclaimer of Warranties",
    body: `AcadHr is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. We do not warrant that the platform will be uninterrupted, error-free or completely secure, or that any information on the platform is accurate or complete.`,
  },
  {
    title: "11. Limitation of Liability",
    body: `To the maximum extent permitted by law, DEERAJ TECHNOLOGY PRIVATE LIMITED and AcadHr shall not be liable for any indirect, incidental, special or consequential damages, or for any loss of income, opportunity, or data, arising out of or related to your use of the platform or any interaction with another user.`,
  },
  {
    title: "12. Termination",
    body: `You may stop using AcadHr and request deletion of your account at any time. We may suspend or terminate your account if you violate these Terms, provide false information, or engage in conduct that we determine, in our sole discretion, to be harmful to other users or to the platform.`,
  },
  {
    title: "13. Governing Law",
    body: `These Terms are governed by the laws of India. Any disputes arising out of or relating to these Terms or your use of AcadHr shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.`,
  },
  {
    title: "14. Changes to These Terms",
    body: `We may update these Terms from time to time to reflect changes in our services or for legal or operational reasons. Continued use of AcadHr after changes are posted constitutes your acceptance of the updated Terms.`,
  },
];

export default function TermsAndConditionsPage({ setPage }) {
  return (
    <div className="fw-page" style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="terms" />
      <div className="container" style={{ paddingTop:100, paddingBottom:60, maxWidth:860 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h1 style={{ fontSize:36, fontWeight:900, color:"#111827", marginBottom:10 }}>
            Terms & Conditions
          </h1>
          <p style={{ color:"#6B7280", fontSize:15 }}>
            Effective date: 10 July 2026 — Please read these terms carefully before using AcadHr.
          </p>
        </div>

        {/* Sections */}
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, padding:"36px 32px", display:"flex", flexDirection:"column", gap:26 }}>
          {SECTIONS.map(s => (
            <div key={s.title}>
              <h2 style={{ fontSize:17, fontWeight:800, color:"#111827", marginBottom:8 }}>{s.title}</h2>
              <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.75 }}>{s.body}</p>
            </div>
          ))}

          <div>
            <h2 style={{ fontSize:17, fontWeight:800, color:"#111827", marginBottom:8 }}>15. Contact Us</h2>
            <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.75, marginBottom:10 }}>
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <p style={{ color:"#374151", fontSize:14, lineHeight:1.9, fontWeight:600 }}>
              DEERAJ TECHNOLOGY PRIVATE LIMITED<br/>
              📍 Fn. 709, 7th Floor, D Block, Petbasheerabad Village, Kutbullapur, Hyderabad, Telangana – 500055<br/>
              📞 <a href="tel:+919849876783" style={{ color:"#1A56DB", textDecoration:"none" }}>+91 98498 76783</a><br/>
              ✉️ <a href="mailto:acadhire01@gmail.com" style={{ color:"#1A56DB", textDecoration:"none" }}>acadhire01@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div style={{ textAlign:"center", marginTop:32 }}>
          <button className="btn btn-outline" onClick={() => setPage("home")}>← Back to Home</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="flexb" style={{ flexWrap:"wrap", gap:20 }}>
            <div>
              <Brand size={22} onClick={() => setPage("home")} />
              <p style={{ color:"#6B7280", fontSize:13, marginTop:6 }}>India's Premier Education Hiring Platform</p>
            </div>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
              {["Privacy Policy","Terms of Service","Contact Us","About"].map(l => (
                <span key={l} style={{ fontSize:13, color:"#6B7280", cursor:"pointer" }}
                  onClick={() => { if (l === "Privacy Policy") setPage("privacy"); if (l === "Terms of Service") setPage("terms"); }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <Divider />
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <p style={{ color:"#6B7280", fontSize:12.5, marginBottom:6, lineHeight:1.6 }}>
              📍 Fn. 709, 7th Floor, D Block, Petbasheerabad Village, Kutbullapur, Hyderabad, Telangana – 500055
            </p>
            <p style={{ color:"#6B7280", fontSize:12.5 }}>
              📞 <a href="tel:+919849876783" style={{ color:"#6B7280", textDecoration:"none" }}>+91 98498 76783</a>
            </p>
          </div>
          <p style={{ color:"#9CA3AF", fontSize:12, textAlign:"center" }}>© 2025 AcadHr. All rights reserved by DEERAJ TECHNOLOGY PRIVATE LIMITED. Made with ❤️ in Hyderabad, India.</p>
        </div>
      </footer>
    </div>
  );
}
