export const policies = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'June 2026',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We collect information you provide when registering (name, email, phone number), booking sessions, and completing questionnaires. We also collect usage data to improve our platform.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'Your information is used to match learners with tutors, process M-Pesa payments, send session reminders, and improve the SomaConnect experience. We do not sell your personal data to third parties.',
      },
      {
        heading: 'Data Storage & Security',
        body: 'All data is stored securely. Payment processing is handled by Safaricom M-Pesa and we do not store card or PIN details. We use industry-standard encryption to protect your information.',
      },
      {
        heading: 'Children\'s Privacy',
        body: 'SomaConnect serves learners of all ages including minors. We collect only the minimum information necessary and require parental consent for learners under 18. Parents/guardians have the right to access, correct, or delete their child\'s information.',
      },
      {
        heading: 'Your Rights',
        body: 'You have the right to access, update, or delete your account information at any time. Contact us at hello@somaconnect.co.ke for any privacy-related requests.',
      },
      {
        heading: 'Contact',
        body: 'For privacy concerns, email us at hello@somaconnect.co.ke or write to us at Nairobi, Kenya.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'June 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By using SomaConnect you agree to these terms. If you do not agree, please do not use the platform.',
      },
      {
        heading: 'Platform Use',
        body: 'SomaConnect is a marketplace connecting learners and tutors. We facilitate bookings and payments but are not responsible for the content of individual tutoring sessions.',
      },
      {
        heading: 'Tutor Responsibilities',
        body: 'Tutors must be qualified in their stated subject areas, maintain punctuality, and uphold professional conduct in all sessions. Tutors agree to our safeguarding policy and background verification process.',
      },
      {
        heading: 'Payments & Refunds',
        body: 'Sessions are paid via M-Pesa. A full refund is issued for cancellations made at least 24 hours before the scheduled session. No refund is given for cancellations within 24 hours unless the tutor cancels.',
      },
      {
        heading: 'Prohibited Conduct',
        body: 'Users must not engage in harassment, share inappropriate content, or attempt to circumvent the platform (e.g. arranging off-platform payments). Violations will result in account suspension.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'SomaConnect is not liable for any indirect or consequential damages arising from use of the platform. Our total liability is limited to the amount paid for the session in question.',
      },
      {
        heading: 'Changes to Terms',
        body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.',
      },
    ],
  },
  safeguarding: {
    title: 'Safeguarding Policy',
    lastUpdated: 'June 2026',
    sections: [
      {
        heading: 'Our Commitment',
        body: 'SomaConnect is committed to the safety and wellbeing of all learners, especially children and young people. The welfare of the learner is our highest priority.',
      },
      {
        heading: 'Tutor Vetting',
        body: 'All tutors undergo an identity verification process before being listed on the platform. We encourage tutors to provide references and professional qualifications. SomaConnect reserves the right to remove any tutor whose conduct is deemed unsafe.',
      },
      {
        heading: 'Online Session Safety',
        body: 'All sessions are conducted via Jitsi Meet — a secure, private video room unique to each booking. Parents are encouraged to be present or nearby during online sessions, especially for young learners. Sessions should never move to unmonitored platforms or private messaging outside SomaConnect.',
      },
      {
        heading: 'Reporting Concerns',
        body: 'If you have a safeguarding concern about a tutor or learner, report it immediately to hello@somaconnect.co.ke with the subject line "Safeguarding Concern". We will respond within 24 hours and escalate to relevant authorities if required.',
      },
      {
        heading: 'Zero Tolerance',
        body: 'Any form of abuse, exploitation, or inappropriate conduct involving a learner will result in immediate removal from the platform and referral to the relevant authorities.',
      },
      {
        heading: 'Data Protection for Minors',
        body: 'We follow strict data minimisation practices for learners under 18. Learner data is never shared with third parties without parental consent.',
      },
    ],
  },
};

export default function PolicyPage({ policy }) {
  const content = policies[policy];
  if (!content) return null;

  return (
    <div className="min-h-screen bg-bg py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">{content.title}</h1>
          <p className="text-sm text-gray-400 mt-1">Last updated: {content.lastUpdated}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-navy mb-2">{section.heading}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          Questions? Email us at{' '}
          <a href="mailto:hello@somaconnect.co.ke" className="text-teal hover:underline">
            hello@somaconnect.co.ke
          </a>
        </p>
      </div>
    </div>
  );
}
