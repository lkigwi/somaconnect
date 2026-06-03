import { useState } from 'react';
import { Link } from 'react-router-dom';

const POLICIES = [
  {
    id: 'privacy',
    label: 'Privacy Policy',
    path: '/privacy',
    summary: 'We collect your name, email and phone to match you with tutors. We never sell your data.',
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    path: '/terms',
    summary: 'Sessions are paid via M-Pesa. Free cancellation 24 hrs before. No off-platform payments.',
  },
  {
    id: 'safeguarding',
    label: 'Safeguarding Policy',
    path: '/safeguarding',
    summary: 'All tutors are DCI-vetted. Sessions run via Jitsi Meet. Report concerns to hello@somaconnect.co.ke.',
  },
];

export default function PolicyAcceptModal({ onAccept, onClose }) {
  const [accepted, setAccepted] = useState({ privacy: false, terms: false, safeguarding: false });
  const [expanded, setExpanded] = useState(null);

  const allAccepted = Object.values(accepted).every(Boolean);

  const toggle = (id) =>
    setAccepted((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4 py-6">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: 'scaleIn 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-teal px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h2 className="text-white font-black text-lg">Before you continue</h2>
              <p className="text-blue-200 text-xs mt-0.5">Please read and accept our policies</p>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="p-6 space-y-3 max-h-[55vh] overflow-y-auto">
          {POLICIES.map((policy) => (
            <div
              key={policy.id}
              className={`rounded-2xl border-2 transition-all ${
                accepted[policy.id]
                  ? 'border-teal bg-teal/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Main row */}
              <div className="flex items-start gap-3 p-4">
                <button
                  onClick={() => toggle(policy.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    accepted[policy.id]
                      ? 'bg-teal border-teal text-white'
                      : 'border-gray-300 hover:border-teal'
                  }`}
                >
                  {accepted[policy.id] && (
                    <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-navy font-semibold text-sm">{policy.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={policy.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal text-xs font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read full →
                      </Link>
                      <button
                        onClick={() => setExpanded(expanded === policy.id ? null : policy.id)}
                        className="text-gray-400 hover:text-navy text-xs transition-colors"
                      >
                        {expanded === policy.id ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {expanded === policy.id && (
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                      {policy.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <p className="text-xs text-gray-400 text-center pt-1">
            By clicking "I Agree & Continue" you confirm you are 18+ or have parental consent.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
            >
              Go Back
            </button>
          )}
          <button
            onClick={onAccept}
            disabled={!allAccepted}
            className={`flex-1 py-3 text-sm rounded-xl font-bold transition-all ${
              allAccepted
                ? 'bg-gradient-to-r from-teal to-blue-600 text-white hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-teal/30'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {allAccepted ? '✅ I Agree & Continue' : `Accept all 3 policies to continue`}
          </button>
        </div>
      </div>
    </div>
  );
}
