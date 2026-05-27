import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconCheckCircle, IconClock, IconBanknotes, IconStar, IconCheck } from '../components/Icons';
import CalendarDropdown from '../components/CalendarDropdown';

// ── Data ─────────────────────────────────────────────────────
const upcomingSessions = [
  {
    id: 1, tutor: 'Grace Wanjiku', avatar: 'GW', subject: 'Mathematics',
    date: 'Thu, 29 May 2026', time: '4:00 PM', duration: '1 Hour', mode: 'Online (Jitsi)',
    amount: 850, status: 'confirmed', jitsiRoom: 'SC-MATH-2026-A1B2',
  },
  {
    id: 2, tutor: 'Amina Hassan', avatar: 'AH', subject: 'English Literature',
    date: 'Sat, 31 May 2026', time: '10:00 AM', duration: '1.5 Hours', mode: 'Online (Jitsi)',
    amount: 1200, status: 'pending', jitsiRoom: 'SC-ENG-2026-C3D4',
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [ratingModal, setRatingModal] = useState(null);
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  const submitRating = (sessionId, rating) => {
    setRatings((prev) => ({ ...prev, [sessionId]: rating }));
    setRatingModal(null);
  };

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
                  {tab === 'upcoming' ? `Upcoming (${upcomingSessions.length})` : `Past (${pastSessions.length})`}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activeTab === 'upcoming' && upcomingSessions.map((s) => (
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
                      <a href={`https://meet.jit.si/${s.jitsiRoom}`} target="_blank" rel="noopener noreferrer"
                        className="btn-teal text-xs py-2 px-4 flex items-center gap-1.5">
                        Join Session
                      </a>
                      <CalendarDropdown session={s} />
                      <button className="text-xs py-2 px-3 text-red-400 hover:text-red-600 transition-colors font-medium">Cancel</button>
                    </div>
                  </div>
                </div>
              ))}

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
                  { label: 'Parent Portal', to: '/questionnaire', color: 'bg-gold text-navy' },
                ].map(({ label, to, color }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${color} font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5`}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Next session reminder */}
            {upcomingSessions[0] && (
              <div className="bg-gradient-to-br from-navy to-teal rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Next Session</p>
                <p className="font-bold">{upcomingSessions[0].tutor}</p>
                <p className="text-blue-100 text-sm">{upcomingSessions[0].subject}</p>
                <p className="text-white/70 text-xs mt-1">{upcomingSessions[0].date} at {upcomingSessions[0].time}</p>
                <a href={`https://meet.jit.si/${upcomingSessions[0].jitsiRoom}`} target="_blank" rel="noopener noreferrer"
                  className="mt-3 block bg-white text-teal text-xs font-bold py-2 px-4 rounded-xl text-center hover:bg-blue-50 transition-colors">
                  Join When Ready
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating modal */}
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
    </div>
  );
}
