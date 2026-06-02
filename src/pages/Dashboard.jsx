import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconCheckCircle, IconClock, IconBanknotes, IconStar, IconCheck } from '../components/Icons';
import RatingModal from '../components/RatingModal';
import RescheduleModal from '../components/RescheduleModal';
import { getJitsiUrl, tutorCanJoin, studentCanJoin, formatCountdown } from '../utils/jitsi';

function ChatBubbleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

// Sessions with future dates for proper demo experience
const INITIAL_UPCOMING = [
  {
    id: 1, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Mathematics',
    date: 'Wed, 10 Jun 2026', time: '4:00 PM', duration: '1 Hour', mode: 'Online (Jitsi)',
    amount: 850, status: 'confirmed', bookingId: 'SC-001',
  },
  {
    id: 2, tutor: 'Amina Hassan', avatar: 'AH', subject: 'English Literature',
    date: 'Sat, 14 Jun 2026', time: '10:00 AM', duration: '1.5 Hours', mode: 'Online (Jitsi)',
    amount: 1200, status: 'pending', bookingId: 'SC-002',
  },
];

// One session left unrated to demo the mandatory rating feature
const INITIAL_PAST = [
  { id: 3, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Mathematics', date: 'Mon, 20 May 2026', time: '4:00 PM', duration: '1 Hour', amount: 850, rating: 5, rated: true },
  { id: 4, tutor: 'James Kamau', avatar: 'JK', subject: 'Chemistry', date: 'Fri, 16 May 2026', time: '2:00 PM', duration: '1 Hour', amount: 800, rating: null, rated: false },
  { id: 5, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Physics', date: 'Mon, 13 May 2026', time: '4:00 PM', duration: '1.5 Hours', amount: 1200, rating: 5, rated: true },
];

const STAT_CARDS = [
  { label: 'Sessions Completed', value: '12', Icon: IconCheckCircle, colorCls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Hours Learned', value: '14.5', Icon: IconClock, colorCls: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Total Spent', value: 'KSh 11,400', Icon: IconBanknotes, colorCls: 'bg-purple-50 text-purple-600 border-purple-100' },
  { label: 'Avg. Rating', value: '4.9 ★', Icon: IconStar, colorCls: 'bg-amber-50 text-amber-600 border-amber-100' },
];

const SUBJECT_PROGRESS = [
  { subject: 'Mathematics', sessions: 6, progress: 75, trend: '+18%' },
  { subject: 'Physics', sessions: 4, progress: 60, trend: '+12%' },
  { subject: 'Chemistry', sessions: 2, progress: 40, trend: '+8%' },
];

const CHAT_SEEDS = {
  1: [
    { id: 1, sender: 'Grace Wanjiku', text: 'Hello! Ready for our Mathematics session?', time: '3:58 PM' },
    { id: 2, sender: 'You', text: 'Yes, textbook ready!', time: '3:59 PM' },
  ],
  2: [
    { id: 1, sender: 'Amina Hassan', text: 'Hi! Looking forward to our English session.', time: '9:58 AM' },
  ],
};

/* ── Chat modal ─────────────────────────────────────────── */
function ChatModal({ session, messages, onSend, onClose }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    onSend({ id: Date.now(), sender: 'You', text, time });
    setInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col" style={{ height: '480px', animation: 'scaleIn 0.2s ease-out' }}>
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-navy to-teal rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">{session.avatar}</div>
            <div>
              <p className="text-white font-bold text-sm">{session.tutor}</p>
              <p className="text-white/70 text-xs">{session.subject}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.sender === 'You' ? 'bg-teal text-white' : 'bg-gray-100 text-navy'}`}>{m.text}</div>
              <span className="text-xs text-gray-400 mt-1">{m.sender} · {m.time}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t border-gray-100 p-3 flex gap-2 shrink-0">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message..."
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal" />
          <button onClick={send} className="bg-teal text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-teal/90">Send</button>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────── */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState(INITIAL_UPCOMING);
  const [pastSessions, setPastSessions] = useState(INITIAL_PAST);

  // Rating
  const [ratingModal, setRatingModal] = useState(null);        // session object
  const [mandatoryRating, setMandatoryRating] = useState(null); // session object (can't dismiss)

  // Cancel
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [lateCancelWarning, setLateCancelWarning] = useState(false);

  // Reschedule
  const [rescheduleSession, setRescheduleSession] = useState(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Chat
  const [chatSession, setChatSession] = useState(null);
  const [chatMessages, setChatMessages] = useState(CHAT_SEEDS);

  // On mount: check for unrated past sessions → show mandatory rating
  useEffect(() => {
    const unrated = pastSessions.find((s) => !s.rated);
    if (unrated) setMandatoryRating(unrated);
  }, []); // eslint-disable-line

  // Cancel success toast
  useEffect(() => {
    if (!cancelSuccess && !rescheduleSuccess) return;
    const t = setTimeout(() => { setCancelSuccess(false); setRescheduleSuccess(false); }, 3000);
    return () => clearTimeout(t);
  }, [cancelSuccess, rescheduleSuccess]);

  /* Handlers */
  const handleRatingSubmit = ({ sessionId, rating, comment }) => {
    setPastSessions((prev) =>
      prev.map((s) => s.id === sessionId ? { ...s, rating, rated: true } : s)
    );
    if (mandatoryRating?.id === sessionId) setMandatoryRating(null);
    setRatingModal(null);
  };

  const openCancelConfirm = (session) => {
    // Check if within 24hrs (for demo: sessions with "Confirmed" status show warning)
    const isLate = session.status === 'confirmed';
    setLateCancelWarning(isLate);
    setCancelConfirm(session.id);
  };

  const confirmCancel = () => {
    setUpcoming((prev) => prev.filter((s) => s.id !== cancelConfirm));
    setCancelConfirm(null);
    setLateCancelWarning(false);
    setCancelSuccess(true);
  };

  const handleReschedule = ({ sessionId, newDate, newTime }) => {
    setUpcoming((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, date: newDate, time: newTime, status: 'reschedule_pending' }
          : s
      )
    );
    setRescheduleSession(null);
    setRescheduleSuccess(true);
  };

  const sendChatMessage = (msg) => {
    setChatMessages((prev) => ({
      ...prev,
      [chatSession]: [...(prev[chatSession] || []), msg],
    }));
  };

  const activeChatSess = chatSession ? upcoming.find((s) => s.id === chatSession) : null;

  return (
    <div className="min-h-screen bg-bg">

      {/* ── Mandatory rating blocks everything ── */}
      {mandatoryRating && (
        <RatingModal session={mandatoryRating} onSubmit={handleRatingSubmit} />
      )}

      {/* Header */}
      <div className="gradient-hero py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shrink-0">
                <span className="text-navy font-black text-xl">AM</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Welcome back, Amani!</h1>
                <p className="text-gray-300 text-sm">Student · Nairobi, Kenya</p>
              </div>
            </div>
            <Link to="/browse" className="btn-primary text-sm">+ Book New Session</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, Icon, colorCls }) => {
            const [bg, text, border] = colorCls.split(' ');
            return (
              <div key={label} className={`bg-white rounded-2xl shadow-sm p-5 border ${border}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <div className="text-2xl font-black text-navy">{value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Sessions ── */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 bg-white rounded-2xl shadow-sm p-1.5 mb-5 w-fit">
              {['upcoming', 'past'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl capitalize transition-all ${activeTab === tab ? 'bg-teal text-white shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
                  {tab === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${pastSessions.length})`}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Upcoming sessions */}
              {activeTab === 'upcoming' && upcoming.map((s) => {
                const jitsiUrl = getJitsiUrl(s.bookingId);
                const canJoin = studentCanJoin(s.date, s.time);
                const countdown = formatCountdown(s.date, s.time);
                const isPending = s.status === 'reschedule_pending';

                return (
                  <div key={s.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-navy to-teal px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">{s.avatar}</div>
                        <div>
                          <p className="text-white font-bold text-sm">{s.tutor}</p>
                          <p className="text-white/70 text-xs">{s.subject}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isPending ? 'bg-amber-400 text-navy' :
                        s.status === 'confirmed' ? 'bg-emerald-500 text-white' :
                        'bg-amber-400 text-navy'
                      }`}>
                        {isPending ? '🔄 Reschedule Pending' : s.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {[['Date', s.date], ['Time', s.time], ['Duration', s.duration], ['Amount', `KSh ${s.amount.toLocaleString()}`]].map(([label, val]) => (
                          <div key={label}>
                            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                            <p className={`font-semibold text-xs ${label === 'Amount' ? 'text-teal' : 'text-navy'}`}>{val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Join countdown pill */}
                      {countdown && (
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 ${
                          canJoin ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <span>{canJoin ? '🟢' : '⏱'}</span>
                          {countdown}
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {canJoin ? (
                          <a href={jitsiUrl} target="_blank" rel="noopener noreferrer"
                            className="btn-teal text-xs py-2 px-4 flex items-center gap-1.5">
                            🎥 Join Session
                          </a>
                        ) : (
                          <button disabled title="Available at session start time"
                            className="text-xs py-2 px-4 bg-gray-100 text-gray-400 rounded-xl font-semibold cursor-not-allowed flex items-center gap-1.5">
                            🎥 Join Session
                          </button>
                        )}
                        <button onClick={() => setChatSession(s.id)}
                          className="flex items-center gap-1.5 text-xs py-2 px-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                          <ChatBubbleIcon className="w-3.5 h-3.5" /> Chat
                        </button>
                        {!isPending && (
                          <button onClick={() => setRescheduleSession(s)}
                            className="flex items-center gap-1.5 text-xs py-2 px-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                            🔄 Reschedule
                          </button>
                        )}
                        <button onClick={() => openCancelConfirm(s)}
                          className="text-xs py-2 px-3 text-red-400 hover:text-red-600 transition-colors font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {activeTab === 'upcoming' && upcoming.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                  <p className="text-gray-400 text-sm">No upcoming sessions.</p>
                  <Link to="/browse" className="btn-teal text-sm mt-4 inline-block px-6 py-2.5">Browse Tutors</Link>
                </div>
              )}

              {/* Past sessions */}
              {activeTab === 'past' && pastSessions.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-navy to-teal px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">{s.avatar}</div>
                      <div>
                        <p className="text-white font-bold text-sm">{s.tutor}</p>
                        <p className="text-white/70 text-xs">{s.subject}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">Completed</span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[['Date', s.date], ['Time', s.time], ['Duration', s.duration], ['Amount', `KSh ${s.amount.toLocaleString()}`]].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                          <p className={`font-semibold text-xs ${label === 'Amount' ? 'text-teal' : 'text-navy'}`}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Rating:</span>
                        {s.rated ? (
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((star) => (
                              <span key={star} className={`text-sm ${star <= s.rating ? 'text-gold' : 'text-gray-200'}`}>★</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">⭐ Rating required</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setRatingModal(s)}
                          className="text-xs py-1.5 px-3 border-2 border-gray-200 rounded-lg text-navy font-semibold hover:border-teal transition-colors">
                          {s.rated ? 'Edit Rating' : 'Rate Session'}
                        </button>
                        <Link to="/booking" className="text-xs py-1.5 px-3 bg-teal/10 text-teal rounded-lg font-semibold hover:bg-teal hover:text-white transition-all">
                          Book Again
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-navy text-base mb-4">Subject Progress</h3>
              <div className="space-y-4">
                {SUBJECT_PROGRESS.map(({ subject, sessions, progress, trend }) => (
                  <div key={subject}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-navy">{subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-500 font-semibold">{trend}</span>
                        <span className="text-xs text-gray-400">{sessions} sessions</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal to-blue-400 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Estimated proficiency: {progress}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-navy text-base mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Book a Session', to: '/booking', color: 'bg-teal text-white' },
                  { label: 'Browse Tutors', to: '/browse', color: 'bg-navy text-white' },
                  { label: 'Parent Portal', to: '/dashboard', color: 'bg-gold text-navy' },
                ].map(({ label, to, color }) => (
                  <Link key={label} to={to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${color} font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5`}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Next session */}
            {upcoming[0] && (
              <div className="bg-gradient-to-br from-navy to-teal rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Next Session</p>
                <p className="font-bold">{upcoming[0].tutor}</p>
                <p className="text-blue-100 text-sm">{upcoming[0].subject}</p>
                <p className="text-white/70 text-xs mt-1">{upcoming[0].date} at {upcoming[0].time}</p>
                {studentCanJoin(upcoming[0].date, upcoming[0].time) ? (
                  <a href={getJitsiUrl(upcoming[0].bookingId)} target="_blank" rel="noopener noreferrer"
                    className="mt-3 block bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl text-center hover:bg-emerald-600 transition-colors">
                    🎥 Join Now
                  </a>
                ) : (
                  <div className="mt-3 bg-white/10 text-white/60 text-xs font-medium py-2 px-4 rounded-xl text-center">
                    {formatCountdown(upcoming[0].date, upcoming[0].time) || 'Join When Ready'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Optional (dismissible) rating for past sessions */}
      {ratingModal && !mandatoryRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <h3 className="text-xl font-bold text-navy mb-2">Rate Your Session</h3>
            <p className="text-gray-500 text-sm mb-6">How was your experience with <strong>{ratingModal.tutor}</strong>?</p>
            <div className="flex justify-center gap-3 mb-6">
              {[1,2,3,4,5].map((star) => (
                <button key={star} onClick={() => {
                  setPastSessions((prev) => prev.map((s) => s.id === ratingModal.id ? { ...s, rating: star, rated: true } : s));
                  setRatingModal(null);
                }}
                  className="text-4xl transition-transform hover:scale-125 text-gray-200 hover:text-gold">★</button>
              ))}
            </div>
            <button onClick={() => setRatingModal(null)} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">✕</span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Cancel Session?</h3>
            {lateCancelWarning && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
                <p className="text-amber-700 text-xs font-semibold">⚠️ Late cancellation</p>
                <p className="text-amber-600 text-xs mt-1">
                  This session is confirmed and within 24 hours. A cancellation fee may apply per our policy.
                </p>
              </div>
            )}
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to cancel this session?</p>
            <div className="flex gap-3">
              <button onClick={() => { setCancelConfirm(null); setLateCancelWarning(false); }}
                className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                Keep Session
              </button>
              <button onClick={confirmCancel}
                className="flex-1 py-3 text-sm bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule modal */}
      {rescheduleSession && (
        <RescheduleModal
          session={rescheduleSession}
          onConfirm={handleReschedule}
          onClose={() => setRescheduleSession(null)}
        />
      )}

      {/* Chat modal */}
      {chatSession && activeChatSess && (
        <ChatModal session={activeChatSess} messages={chatMessages[chatSession] || []}
          onSend={sendChatMessage} onClose={() => setChatSession(null)} />
      )}

      {/* Toasts */}
      {cancelSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
            <IconCheck className="w-4 h-4" /> Session cancelled
          </div>
        </div>
      )}
      {rescheduleSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="bg-teal text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
            🔄 Reschedule request sent to tutor
          </div>
        </div>
      )}
    </div>
  );
}
