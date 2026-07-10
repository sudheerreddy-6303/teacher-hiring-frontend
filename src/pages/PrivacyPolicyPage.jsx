import { Navbar, Brand, Divider } from "../components/common/Shared";

const SECTIONS = [
  {
    title: "1. Introduction",
    body: `AcadHr ("we", "us", "our") is operated by DEERAJ TECHNOLOGY PRIVATE LIMITED. AcadHr is an online platform that connects teachers, tutors, schools, coaching institutes and parents for teaching jobs, tutoring and tuition requirements. This Privacy Policy explains what personal information we collect, how we use it, and the choices you have regarding your information when you use our website and services.`,
  },
  {
    title: "2. Information We Collect",
    body: `When you register or use AcadHr, we may collect information such as your name, email address, phone number, gender, date of birth, qualifications, work experience, subjects taught, current location and preferred locations, resume/CV, profile photo, institution details, and any other information you choose to add to your profile. We also automatically collect certain technical information such as IP address, browser type, device information and usage data (pages visited, actions taken) to help us operate and improve the platform.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use the information we collect to: create and manage your account; match teachers/tutors with relevant jobs, tuitions and institutions; display your profile to schools, parents or students as applicable; send you OTPs, notifications and updates about jobs, applications and platform activity; improve and personalise our services; and comply with legal obligations. We do not sell your personal information to third parties.`,
  },
  {
    title: "4. Sharing of Information",
    body: `Your profile information (such as name, subjects, qualifications, experience, location and other details you make public) is shared with schools, parents or students who are searching or browsing on the platform, so that they can contact you regarding job or tuition opportunities. Your phone number and email address are only shared with your consent or when required for facilitating a genuine connection (for example, when you apply to a job or a school/parent chooses to contact you). We may also share information with service providers who help us operate the platform (such as hosting, email/SMS/WhatsApp delivery and analytics providers), and where required by law.`,
  },
  {
    title: "5. Cookies & Similar Technologies",
    body: `We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how the platform is used so we can improve it. You can control cookies through your browser settings; disabling cookies may affect some features of the platform.`,
  },
  {
    title: "6. Data Security",
    body: `We take reasonable technical and organisational measures — including encrypted password storage, access controls and secure connections — to protect your information against unauthorised access, alteration, disclosure or destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "7. Data Retention",
    body: `We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us, subject to any legal or regulatory retention requirements.`,
  },
  {
    title: "8. Your Rights & Choices",
    body: `You can access, update or correct your profile information at any time from your dashboard. You may request that we delete your account and personal data, opt out of promotional notifications, or ask us questions about how your data is used, by contacting us using the details below.`,
  },
  {
    title: "9. Children's Privacy",
    body: `AcadHr is intended for use by adults (teachers, tutors, school representatives and parents). We do not knowingly collect personal information directly from children. Where a parent posts a tuition requirement, only information necessary to find a suitable tutor is collected.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational or regulatory reasons. We will post the updated policy on this page with a revised effective date.`,
  },
];

export default function PrivacyPolicyPage({ setPage }) {
  return (
    <div className="fw-page" style={{ minHeight:"100vh", background:"#F9FAFB" }}>
      <Navbar setPage={setPage} page="privacy" />
      <div className="container" style={{ paddingTop:100, paddingBottom:60, maxWidth:860 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h1 style={{ fontSize:36, fontWeight:900, color:"#111827", marginBottom:10 }}>
            Privacy Policy
          </h1>
          <p style={{ color:"#6B7280", fontSize:15 }}>
            Effective date: 10 July 2026 — Please read this policy carefully to understand how AcadHr handles your information.
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
            <h2 style={{ fontSize:17, fontWeight:800, color:"#111827", marginBottom:8 }}>11. Contact Us</h2>
            <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.75, marginBottom:10 }}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
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
