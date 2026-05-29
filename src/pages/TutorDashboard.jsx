import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconCheckCircle, IconClock, IconBanknotes, IconStar,
  IconSettings, IconUser, IconCheck, IconShieldCheck, IconPhone, IconId, IconAcademicCap,
} from '../components/Icons';

const pendingRequests = [
  {
    id: 'p1',
    parentName: 'Mary Wambui',
    studentName: 'Amani',
    studentAge: 13,
    subject: 'Mathematics',
    level: 'KCSE',
    date: 'Thu, 28 May 2026',
    time: '4:00 PM',
    amount: 1200,
  },
  {
    id: 'p2',
    parentName: 'John Kariuki',
    studentName: 'Zawadi',
    studentAge: 10,
    subject: 'English',
    level: 'CBC Grade 4',
    date: 'Sat, 30 May 2026',
    time: '10:00 AM',
    amount: 900,
  },
];

const upcomingSessions = [
  {
    id: 1,
    student: 'Amani Wambui',
    avatar: 'AW',
    subject: 'Mathematics',
    date: 'Thu, 29 May 2026',
    time: '4:00 PM',
    duration: '1 Hour',
    amount: 1020,
    jitsiRoom: 'SomaConnect-Demo',
  },
  {
    id: 2,
    student: 'Brian Otieno',
    avatar: 'BO',
    subject: 'Sciences',
    date: 'Fri, 30 May 2026',
    time: '5:00 PM',
    duration: '1.5 Hours',
    amount: 1530,
    jitsiRoom: 'SomaConnect-Demo',
  },
];

const pastSessions = [
  { id: 3, student: 'Amani Wambui', avatar: 'AW', subject: 'Mathematics', date: 'Mon, 20 May 2026', time: '4:00 PM', duration: '1 Hour', amount: 1020, rating: 5 },
  { id: 4, student: 'Brian Otieno', avatar: 'BO', subject: 'Sciences', date: 'Fri, 16 May 2026', time: '5:00 PM', duration: '1.5 Hours', amount: 1530, rating: 4 },
  { id: 5, student: 'Grace Mwangi', avatar: 'GM', subject: 'English', date: 'Wed, 14 May 2026', time: '3:00 PM', duration: '1 Hour', amount: 800, rating: 5 },
  { id: 6, student: 'James Omondi', avatar: 'JO', subject: 'Physics', date: 'Mon, 12 May 2026', time: '4:00 PM', duration: '1 Hour', amount: 1020, rating: 5 },
  { id: 7, student: 'Amani Wambui', avatar: 'AW', subject: 'Mathematics', date: 'Fri, 9 May 2026', time: '4:00 PM', duration: '1 Hour', amount: 1020, rating: 4 },
];

const earningsWeeks = [
  { label: 'Week 1', amount: 8500 },
  { label: 'Week 2', amount: 11200 },
  { label: 'Week 3', amount: 9800 },
  { label: 'Week 4', amount: 8750 },
];

const maxEarning = Math.max(...earningsWeeks.map((w) => w.amount));

const verificationBadges = [
  { label: 'DCI Background Check', Icon: IconShieldCheck },
  { label: 'National ID Verified', Icon: IconId },
  { label: 'Teaching Certificate', Icon: IconAcademicCap },
  { label: 'Phone Verified', Icon: IconPhone },
];

export default function TutorDashboard() {
  const [requests, setRequests] = useState(pendingRequests);
  const [activeTab, setActiveTab] = useState('upcoming');

  const acceptRequest = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));
  const declineRequest = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="gradient-hero py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shrink-0">
                <span className="text-navy font-black text-2xl">JW</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black text-white">Jane Wanjiku</h1>
                  <span className="text-xs font-semibold bg-teal text-white px-3 py-1 rounded-full">Verified Tutor</span>
                </div>
                <p className="text-gray-300 text-sm">Mathematics & Physics · Nairobi, Kenya</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">Profile completion</span>
                    <span className="text-xs font-bold text-gold">85%</span>
                  </div>
                  <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
            <Link
              to="/tutor-signup"
              className="flex items-center gap-2 border-2 border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors self-start md:self-auto"
            >
              <IconSettings className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Stats ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: '47', color: 'bg-teal/10 text-teal border-teal/20' },
            { label: 'This Month', value: 'KES 38,250', color: 'bg-gold/10 text-gold border-gold/20' },
            { label: 'Avg Rating', value: '4.9 ★', color: 'bg-amber-50 text-amber-600 border-amber-100' },
            { label: 'Profile Views', value: '124', color: 'bg-purple-50 text-purple-600 border-purple-100' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-white rounded-2xl shadow-sm p-5 border ${color.split(' ')[2]}`}>
              <div className={`text-2xl font-black ${color.split(' ')[1]} mb-1`}>{value}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main content ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending requests */}
            {requests.length > 0 && (
              <div>
                <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                  Pending Booking Requests
                  <span className="bg-gold text-navy text-xs font-black px-2 py-0.5 rounded-full">{requests.length}</span>
                </h2>
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-gold">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-navy text-sm">{req.parentName}</p>
                          <p className="text-xs text-gray-500 mb-3">
                            For: {req.studentName} (age {req.studentAge})
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-teal/10 text-teal px-2.5 py-1 rounded-lg font-medium">{req.subject}</span>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{req.level}</span>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{req.date}</span>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{req.time}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-teal font-black text-lg">KES {req.amount.toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(req.id)}
                              className="bg-teal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-teal/90 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => declineRequest(req.id)}
                              className="border-2 border-red-300 text-red-500 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sessions tabs */}
            <div>
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
                          <p className="text-white font-bold text-sm">{s.student}</p>
                          <p className="text-white/70 text-xs">{s.subject}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500 text-white">Confirmed</span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {[['Date', s.date], ['Time', s.time], ['Duration', s.duration], ['Earning', `KES ${s.amount.toLocaleString()}`]].map(([label, val]) => (
                          <div key={label}>
                            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                            <p className={`font-medium text-xs ${label === 'Earning' ? 'text-teal font-bold' : 'text-navy'}`}>{val}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <a
                          href="https://8x8.vc/vpaas-magic-cookie-free/SomaConnectDemo"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-teal text-xs py-2 px-4"
                        >
                          Join Session
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'past' && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Earned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastSessions.map((s) => (
                            <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs shrink-0">{s.avatar}</div>
                                  <span className="text-navy font-medium text-xs">{s.student}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3.5 text-xs text-gray-600">{s.subject}</td>
                              <td className="px-3 py-3.5 text-xs text-gray-500">{s.date}</td>
                              <td className="px-3 py-3.5 text-xs text-gray-500">{s.duration}</td>
                              <td className="px-5 py-3.5 text-right">
                                <span className="text-teal font-bold text-xs">KES {s.amount.toLocaleString()}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Earnings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-bold text-navy text-lg">Earnings This Month</h3>
                  <p className="text-xs text-gray-500 mt-0.5">28 sessions completed</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-teal">KES 38,250</div>
                  <p className="text-xs text-gray-400 mt-0.5">Commission: <span className="text-red-400">KES 6,750</span></p>
                </div>
              </div>

              <div className="flex items-end gap-3 h-32">
                {earningsWeeks.map((week) => {
                  const heightPct = (week.amount / maxEarning) * 100;
                  return (
                    <div key={week.label} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500 font-medium">
                        {(week.amount / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-teal to-blue-400 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-xs text-gray-400">{week.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Profile status */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-navy text-base mb-4">Profile Status</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">Active</span>
                <div className="flex items-center gap-1">
                  <span className="text-gold text-sm">★</span>
                  <span className="font-bold text-navy text-sm">4.9</span>
                  <span className="text-xs text-gray-400">(47 reviews)</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {verificationBadges.map(({ label, Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-navy text-base mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'View My Profile', to: '/browse', color: 'bg-teal text-white' },
                  { label: 'Browse Platform', to: '/browse', color: 'bg-navy text-white' },
                  { label: 'Update Availability', to: '/tutor-signup', color: 'bg-gold text-navy' },
                ].map(({ label, to, color }) => (
                  <Link key={label} to={to}
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
                <p className="font-bold">{upcomingSessions[0].student}</p>
                <p className="text-blue-100 text-sm">{upcomingSessions[0].subject}</p>
                <p className="text-white/70 text-xs mt-1">{upcomingSessions[0].date} at {upcomingSessions[0].time}</p>
                <a
                  href="https://8x8.vc/vpaas-magic-cookie-free/SomaConnectDemo"
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
    </div>
  );
}
