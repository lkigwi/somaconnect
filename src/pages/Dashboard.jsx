import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconCheckCircle, IconClock, IconBanknotes, IconStar, IconCheck } from '../components/Icons';

// ── Chat bubble icon ──────────────────────────────────────────
function ChatBubbleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

// ── Session data ──────────────────────────────────────────────
const INITIAL_UPCOMING = [
  {
    id: 1, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Mathematics',
    date: 'Thu, 29 May 2026', time: '4:00 PM', duration: '1 Hour', mode: 'Online (Google Meet)',
    amount: 850, status: 'confirmed',
  },
  {
    id: 2, tutor: 'Amina Hassan', avatar: 'AH', subject: 'English Literature',
    date: 'Sat, 31 May 2026', time: '10:00 AM', duration: '1.5 Hours', mode: 'Online (Google Meet)',
    amount: 1200, status: 'pending',
  },
];

const pastSessions = [
  { id: 3, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Mathematics', date: 'Mon, 20 May 2026', time: '4:00 PM', duration: '1 Hour', amount: 850, rating: 5 },
  { id: 4, tutor: 'James Kamau', avatar: 'JK', subject: 'Chemistry', date: 'Fri, 16 May 2026', time: '2:00 PM', duration: '1 Hour', amount: 800, rating: 4 },
  { id: 5, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Physics', date: 'Mon, 13 May 2026', time: '4:00 PM', duration: '1.5 Hours', amount: 1200, rating: 5 },
];

const statCards = [
  { label: 'Sessions Completed', value: '12', Icon: IconCheckCircle, colorCls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Hours Learned', value: '14.5', Icon: IconClock, colorCls: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Total Spent', value: 'KSh 11,400', Icon: IconBanknotes, colorCls: 'bg-purple-50 text-purple-600 border-purple-100' },
  { label: 'Avg. Rating', value: '4.9 ★', Icon: IconStar, colorCls: 'bg-amber-50 text-amber-600 border-amber-100' },
];

const subjectProgress = [
  { subject: 'Mathematics', sessions: 6, progress: 75, trend: '+18%' },
  { subject: 'Physics', sessions: 4, progress: 60, trend: '+12%' },
  { subject: 'Chemistry', sessions: 2, progress: 40, trend: '+8%' },
];

// Pre-loaded chat seeds per session id
const CHAT_SEEDS = {
  1: [
    { id: 1, sender: 'Grace Wanjiku', text: 'Hello! Ready to start our Mathematics session?', time: '3:58 PM' },
    { id: 2, sender: 'You', text: 'Yes, I have my textbook ready.', time: '3:59 PM' },
  ],
  2: [
    { id: 1, sender: 'Amina Hassan', text: 'Hi! Looking forward to our English session.', time: '9:58 AM' },
  ],
};

// ── Chat modal ────────────────────────────────────────────────
function ChatModal({ session, messages, onSend, onClose }) {
  const [input, setInput] = useState('');
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    onSend({ id: Date.now(), sender: 'You', text, time });
    setInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col" style={{ height: '480px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-navy to-teal rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session.avatar}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{session.tutor}</p>
              <p className="text-white/70 text-xs">{session.subject}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.sender === 'You' ? 'bg-teal text-white' : 'bg-gray-100 text-navy'
              }`}>
                {m.text}
              </div>
              <span className="text-xs text-gray-400 mt-1">{m.sender} · {m.time}</span>
            </div>
          ))}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-3 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal transition-colors"
          />
          <button
            onClick={send}
            className="bg-teal text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-teal/90 transition-colors shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [ratingModal, setRatingModal] = useState(null);
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [upcoming, setUpcoming] = useState(INITIAL_UPCOMING);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [chatMessages, setChatMessages] = useState(CHAT_SEEDS);

  const submitRating = (sessionId, rating) => {
    setRatings((prev) => ({ ...prev, [sessionId]: rating }));
    setRatingModal(null);
  };

  const confirmCancel = () => {
    setUpcoming((prev) => prev.filter((s) => s.id !== cancelConfirm));
    setCancelConfirm(null);
    setCancelSuccess(true);
  };

  const sendChatMessage = (msg) => {
    setChatMessages((prev) => ({
      ...prev,
      [chatSession]: [...(prev[chatSession] || []), msg],
    }));
  };

  useEffect(() => {
    if (!cancelSuccess) return;
    const t = setTimeout(() => setCancelSuccess(false), 2000);
    return () => clearTimeout(t);
  }, [cancelSuccess]);

  const activeChatSession = chatSession ? upcoming.find((s) => s.id === chatSession) : null;

  return (
    <div className="min-h-screen bg-bg">
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
          {statCards.map(({ label, value, Icon, colorCls }) => (
            <div key={label} className={`bg-white rounded-2xl shadow-sm p-5 border ${colorCls.split(' ')[2]}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorCls.split(' ')[0]}`}>
                <Icon className={`w-5 h-5 ${colorCls.split(' ')[1]}`} />
              </div>
              <div className="text-2xl font-black text-navy">{value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions */}
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
              {activeTab === 'upcoming' && upcoming.map((s) => (
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
                      s.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-navy'
                    }`}>
                      {s.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[['Date', s.date], ['Time', s.time], ['Duration', s.duration], ['Amount', `KSh ${s.amount.toLocaleString()}`]].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                          <p className={`font-medium text-xs ${label === 'Amount' ? 'text-teal font-bold' : 'text-navy'}`}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href="https://meet.google.com/abc-defg-hij"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-teal text-xs py-2 px-4 flex items-center gap-1.5"
                      >
                        Join Session
                      </a>
                      <button
                        onClick={() => setChatSession(s.id)}
                        className="flex items-center gap-1.5 text-xs py-2 px-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
                        title="Open chat"
                      >
                        <ChatBubbleIcon className="w-3.5 h-3.5" />
                        Chat
                      </button>
                      <button
                        onClick={() => setCancelConfirm(s.id)}
                        className="text-xs py-2 px-3 text-red-400 hover:text-red-600 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'upcoming' && upcoming.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                  <p className="text-gray-400 text-sm">No upcoming sessions.</p>
                  <Link to="/browse" className="btn-teal text-sm mt-4 inline-block px-6 py-2.5">Browse Tutors</Link>
                </div>
              )}

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
                          <p className={`font-medium text-xs ${label === 'Amount' ? 'text-teal font-bold' : 'text-navy'}`}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Rating:</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((star) => (
                            <span key={star} className={`text-sm ${star <= (ratings[s.id] || s.rating) ? 'text-gold' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setRatingModal(s.id)}
                          className="text-xs py-1.5 px-3 border-2 border-gray-200 rounded-lg text-navy font-semibold hover:border-teal transition-colors">
                          {ratings[s.id] ? 'Edit Rating' : 'Rate Session'}
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

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-navy text-base mb-4">Subject Progress</h3>
              <div className="space-y-4">
                {subjectProgress.map(({ subject, sessions, progress, trend }) => (
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

            {/* Next session reminder */}
            {upcoming[0] && (
              <div className="bg-gradient-to-br from-navy to-teal rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Next Session</p>
                <p className="font-bold">{upcoming[0].tutor}</p>
                <p className="text-blue-100 text-sm">{upcoming[0].subject}</p>
                <p className="text-white/70 text-xs mt-1">{upcoming[0].date} at {upcoming[0].time}</p>
                <a
                  href="https://meet.google.com/abc-defg-hij"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block bg-white text-teal text-xs font-bold py-2 px-4 rounded-xl text-center hover:bg-blue-50 transition-colors"
                >
                  Join When Ready
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Chat modal ─────────────────────────────────────────── */}
      {chatSession && activeChatSession && (
        <ChatModal
          session={activeChatSession}
          messages={chatMessages[chatSession] || []}
          onSend={sendChatMessage}
          onClose={() => setChatSession(null)}
        />
      )}

      {/* ── Cancel confirmation modal ───────────────────────────── */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">✕</span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Cancel Session?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to cancel this session?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
              >
                Keep Session
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 text-sm bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rating modal ───────────────────────────────────────── */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-bold text-navy mb-2">Rate Your Session</h3>
            <p className="text-gray-500 text-sm mb-6">How was your experience?</p>
            <div className="flex justify-center gap-3 mb-4">
              {[1,2,3,4,5].map((star) => (
                <button key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => submitRating(ratingModal, star)}
                  className={`text-4xl transition-transform hover:scale-125 ${star <= (hoverRating || ratings[ratingModal] || 0) ? 'text-gold' : 'text-gray-200'}`}>
                  ★
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 h-5 mb-6">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][hoverRating] || (ratings[ratingModal] ? ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][ratings[ratingModal]] : 'Click a star to rate')}
            </p>
            <button onClick={() => setRatingModal(null)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Cancel success toast ────────────────────────────────── */}
      {cancelSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
            <IconCheck className="w-4 h-4" />
            Session cancelled
          </div>
        </div>
      )}
    </div>
  );
}
