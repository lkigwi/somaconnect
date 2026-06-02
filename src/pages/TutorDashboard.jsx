import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconCheckCircle, IconClock, IconBanknotes, IconStar,
  IconSettings, IconCheck, IconShieldCheck, IconPhone, IconId, IconAcademicCap,
} from '../components/Icons';
import { getSessionUrl, tutorCanJoin, formatCountdown } from '../utils/jitsi';

const PLATFORM_COMMISSION = 0.15;

const pendingRequests = [
  { id: 'p1', parentName: 'Mary Wambui', studentName: 'Amani', studentAge: 13, subject: 'Mathematics', level: 'KCSE', date: 'Wed, 10 Jun 2026', time: '4:00 PM', amount: 1200 },
  { id: 'p2', parentName: 'John Kariuki', studentName: 'Zawadi', studentAge: 10, subject: 'English', level: 'CBC Grade 4', date: 'Sat, 14 Jun 2026', time: '10:00 AM', amount: 900 },
];

// Reschedule requests from students
const initialRescheduleRequests = [
  { id: 'r1', student: 'Amani Wambui', avatar: 'AW', subject: 'Mathematics', oldDate: 'Wed, 10 Jun 2026', oldTime: '4:00 PM', newDate: 'Thu, 11 Jun 2026', newTime: '3:00 PM' },
];

const upcomingSessions = [
  { id: 1, student: 'Amani Wambui', avatar: 'AW', subject: 'Mathematics', date: 'Wed, 10 Jun 2026', time: '4:00 PM', duration: '1 Hour', amount: 1020, bookingId: 'SC-001' },
  { id: 2, student: 'Brian Otieno', avatar: 'BO', subject: 'Sciences', date: 'Fri, 12 Jun 2026', time: '5:00 PM', duration: '1.5 Hours', amount: 1530, bookingId: 'SC-003' },
];

const pastSessions = [
  { id: 3, student: 'Amani Wambui', avatar: 'AW', subject: 'Mathematics', date: 'Mon, 20 May 2026', time: '4:00 PM', duration: '1 Hour', gross: 1020 },
  { id: 4, student: 'Brian Otieno', avatar: 'BO', subject: 'Sciences', date: 'Fri, 16 May 2026', time: '5:00 PM', duration: '1.5 Hours', gross: 1530 },
  { id: 5, student: 'Grace Mwangi', avatar: 'GM', subject: 'English', date: 'Wed, 14 May 2026', time: '3:00 PM', duration: '1 Hour', gross: 800 },
  { id: 6, student: 'James Omondi', avatar: 'JO', subject: 'Physics', date: 'Mon, 12 May 2026', time: '4:00 PM', duration: '1 Hour', gross: 1020 },
  { id: 7, student: 'Amani Wambui', avatar: 'AW', subject: 'Mathematics', date: 'Fri, 9 May 2026', time: '4:00 PM', duration: '1 Hour', gross: 1020 },
];

const verificationBadges = [
  { label: 'DCI Background Check', Icon: IconShieldCheck },
  { label: 'National ID Verified', Icon: IconId },
  { label: 'Teaching Certificate', Icon: IconAcademicCap },
  { label: 'Phone Verified', Icon: IconPhone },
];

// Compute per-session earnings
const withEarnings = (sessions) =>
  sessions.map((s) => ({
    ...s,
    commission: Math.round(s.gross * PLATFORM_COMMISSION),
    net: Math.round(s.gross * (1 - PLATFORM_COMMISSION)),
  }));

const sessionsWithEarnings = withEarnings(pastSessions);
const totalGross = sessionsWithEarnings.reduce((a, s) => a + s.gross, 0);
const totalCommission = sessionsWithEarnings.reduce((a, s) => a + s.commission, 0);
const totalNet = sessionsWithEarnings.reduce((a, s) => a + s.net, 0);
// Historical all-time total (includes prior months — makes the number realistic)
const ALL_TIME_NET = totalNet + 34680; // prior months earnings

// This-month sessions (May 2026)
const thisMonthSessions = sessionsWithEarnings.filter((s) => s.date.includes('May'));
const thisMonthNet = thisMonthSessions.reduce((a, s) => a + s.net, 0);

export default function TutorDashboard() {
  const [requests, setRequests] = useState(pendingRequests);
  const [rescheduleRequests, setRescheduleRequests] = useState(initialRescheduleRequests);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeEarningsTab, setActiveEarningsTab] = useState('breakdown');
  const [rescheduleToast, setRescheduleToast] = useState('');

  const acceptRequest = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));
  const declineRequest = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));

  const acceptReschedule = (id) => {
    const req = rescheduleRequests.find((r) => r.id === id);
    setRescheduleRequests((prev) => prev.filter((r) => r.id !== id));
    setRescheduleToast(`✅ Reschedule accepted — moved to ${req?.newDate} at ${req?.newTime}`);
    setTimeout(() => setRescheduleToast(''), 4000);
  };
  const declineReschedule = (id) => {
    setRescheduleRequests((prev) => prev.filter((r) => r.id !== id));
    setRescheduleToast('❌ Reschedule request declined — original schedule kept');
    setTimeout(() => setRescheduleToast(''), 4000);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
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
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Profile completion</span>
                  <span className="text-xs font-bold text-gold">85%</span>
                  <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => alert('Profile editing will be available in the next release. Contact support@somaconnect.co.ke to update your profile.')}
              className="flex items-center gap-2 border-2 border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors self-start md:self-auto">
              <IconSettings className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: '47', color: 'text-teal border-teal/20 bg-teal/5' },
            { label: 'This Month Net', value: `KES ${thisMonthNet.toLocaleString()}`, color: 'text-gold border-gold/20 bg-gold/5', sub: `of KES ${ALL_TIME_NET.toLocaleString()} all-time` },
            { label: 'Avg Rating', value: '4.9 ★', color: 'text-amber-600 border-amber-100 bg-amber-50' },
            { label: 'Profile Views', value: '124', color: 'text-purple-600 border-purple-100 bg-purple-50' },
          ].map(({ label, value, color }) => {
            const [textCls, borderCls, bgCls] = color.split(' ');
            return (
              <div key={label} className={`bg-white rounded-2xl shadow-sm p-5 border ${borderCls}`}>
                <div className={`text-2xl font-black ${textCls} mb-1`}>{value}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* Reschedule requests */}
            {rescheduleRequests.length > 0 && (
              <div>
                <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                  🔄 Reschedule Requests
                  <span className="bg-amber-400 text-navy text-xs font-black px-2 py-0.5 rounded-full">{rescheduleRequests.length}</span>
                </h2>
                <div className="space-y-3">
                  {rescheduleRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-amber-400">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs">{req.avatar}</div>
                            <div>
                              <p className="font-bold text-navy text-sm">{req.student}</p>
                              <p className="text-xs text-gray-500">{req.subject}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Current: <span className="text-navy font-medium">{req.oldDate} at {req.oldTime}</span></p>
                            <p>Requested: <span className="text-teal font-semibold">{req.newDate} at {req.newTime}</span></p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => acceptReschedule(req.id)}
                            className="bg-teal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-teal/90 transition-colors">
                            Accept
                          </button>
                          <button onClick={() => declineReschedule(req.id)}
                            className="border-2 border-red-300 text-red-500 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending booking requests */}
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
                          <p className="text-xs text-gray-500 mb-3">For: {req.studentName} (age {req.studentAge})</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {[req.subject, req.level, req.date, req.time].map((tag, i) => (
                              <span key={i} className={`px-2.5 py-1 rounded-lg font-medium ${i === 0 ? 'bg-teal/10 text-teal' : 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-teal font-black text-lg">KES {req.amount.toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button onClick={() => acceptRequest(req.id)} className="bg-teal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-teal/90">Accept</button>
                            <button onClick={() => declineRequest(req.id)} className="border-2 border-red-300 text-red-500 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-50">Decline</button>
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
                {activeTab === 'upcoming' && upcomingSessions.map((s) => {
                  const sessionUrl = getSessionUrl({ bookingId: s.bookingId, tutor: `${s.student} (Student)`, subject: s.subject, avatar: s.avatar, role: 'tutor', sessionId: s.id });
                  const canJoin = tutorCanJoin(s.date, s.time);
                  const countdown = formatCountdown(s.date, s.time);

                  return (
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {[['Date', s.date], ['Time', s.time], ['Duration', s.duration], ['Your Earning', `KES ${Math.round(s.amount * 0.85).toLocaleString()}`]].map(([label, val]) => (
                            <div key={label}>
                              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                              <p className={`font-semibold text-xs ${label === 'Your Earning' ? 'text-teal' : 'text-navy'}`}>{val}</p>
                            </div>
                          ))}
                        </div>
                        {countdown && (
                          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 ${
                            canJoin ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <span>{canJoin ? '🟢' : '⏱'}</span> {canJoin ? 'Ready — join now' : countdown}
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          {canJoin ? (
                            <Link to={sessionUrl} className="btn-teal text-xs py-2 px-4">
                              🎥 Join Session
                            </Link>
                          ) : (
                            <button disabled className="text-xs py-2 px-4 bg-gray-100 text-gray-400 rounded-xl font-semibold cursor-not-allowed">
                              🎥 Join Session
                            </button>
                          )}
                          <p className="text-xs text-gray-400 self-center">
                            Tutor joins 10 min early · Student joins at start time
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activeTab === 'past' && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Session</th>
                            <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-red-400">Fee (15%)</th>
                            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-teal">You Earned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionsWithEarnings.map((s) => (
                            <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs shrink-0">{s.avatar}</div>
                                  <span className="text-navy font-medium text-xs">{s.student}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3.5 text-xs text-gray-600">{s.subject}</td>
                              <td className="px-3 py-3.5 text-xs text-gray-500 whitespace-nowrap">{s.date}</td>
                              <td className="px-3 py-3.5 text-right text-xs text-navy font-medium">KES {s.gross.toLocaleString()}</td>
                              <td className="px-3 py-3.5 text-right text-xs text-red-400 font-medium">-KES {s.commission.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-right">
                                <span className="text-teal font-bold text-xs">KES {s.net.toLocaleString()}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-teal/5 border-t-2 border-teal/20">
                            <td colSpan={3} className="px-4 py-4 text-sm font-bold text-navy">Total (All Time)</td>
                            <td className="px-3 py-4 text-right text-sm font-bold text-navy">KES {totalGross.toLocaleString()}</td>
                            <td className="px-3 py-4 text-right text-sm font-bold text-red-400">-KES {totalCommission.toLocaleString()}</td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-teal font-black text-sm">KES {totalNet.toLocaleString()}</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Earnings Dashboard ── */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Top hero strip */}
              <div className="bg-gradient-to-r from-navy to-teal p-6">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Your Earnings This Month</p>
                <p className="text-white font-black text-4xl mb-1">KES {thisMonthNet.toLocaleString()}</p>
                <p className="text-blue-200 text-xs">
                  {thisMonthSessions.length} sessions · Platform commission: KES {thisMonthSessions.reduce((a, s) => a + s.commission, 0).toLocaleString()}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-4 border-b border-gray-100">
                {['breakdown', 'weekly'].map((t) => (
                  <button key={t} onClick={() => setActiveEarningsTab(t)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${activeEarningsTab === t ? 'bg-teal text-white' : 'text-gray-500 hover:text-navy'}`}>
                    {t === 'breakdown' ? 'Per Session' : 'Weekly Chart'}
                  </button>
                ))}
              </div>

              {activeEarningsTab === 'breakdown' && (
                <div className="p-5">
                  <div className="space-y-3">
                    {thisMonthSessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs shrink-0">{s.avatar}</div>
                          <div>
                            <p className="text-navy font-semibold text-sm">{s.student}</p>
                            <p className="text-gray-500 text-xs">{s.subject} · {s.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-teal font-black text-sm">KES {s.net.toLocaleString()}</p>
                          <p className="text-gray-400 text-xs">of KES {s.gross.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                    <span className="text-navy font-bold text-sm">This Month Total</span>
                    <span className="text-teal font-black text-xl">KES {thisMonthNet.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>All-time earned</span>
                    <span className="font-semibold text-navy">KES {ALL_TIME_NET.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {activeEarningsTab === 'weekly' && (
                <div className="p-5">
                  {(() => {
                    const weeks = [
                      { label: 'Week 1', gross: 8500 },
                      { label: 'Week 2', gross: 11200 },
                      { label: 'Week 3', gross: 9800 },
                      { label: 'Week 4', gross: 8750 },
                    ].map((w) => ({ ...w, net: Math.round(w.gross * 0.85) }));
                    const maxNet = Math.max(...weeks.map((w) => w.net));
                    return (
                      <>
                        <div className="flex items-end gap-4 h-36 mb-4">
                          {weeks.map((w) => (
                            <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-xs text-teal font-bold">{(w.net / 1000).toFixed(1)}k</span>
                              <div className="w-full rounded-t-xl bg-gradient-to-t from-teal to-blue-400 transition-all"
                                style={{ height: `${(w.net / maxNet) * 100}%` }} />
                              <span className="text-xs text-gray-400">{w.label}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 text-center">Net earnings after 15% platform commission</p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
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

            {/* Next session */}
            {upcomingSessions[0] && (
              <div className="bg-gradient-to-br from-navy to-teal rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Next Session</p>
                <p className="font-bold">{upcomingSessions[0].student}</p>
                <p className="text-blue-100 text-sm">{upcomingSessions[0].subject}</p>
                <p className="text-white/70 text-xs mt-1">{upcomingSessions[0].date} at {upcomingSessions[0].time}</p>
                <p className="text-white/50 text-xs mt-1">You can join 10 minutes early</p>
                {tutorCanJoin(upcomingSessions[0].date, upcomingSessions[0].time) ? (
                  <Link to={getSessionUrl({ bookingId: upcomingSessions[0].bookingId, tutor: upcomingSessions[0].student, subject: upcomingSessions[0].subject, avatar: upcomingSessions[0].avatar, role: 'tutor', sessionId: upcomingSessions[0].id })}
                    className="mt-3 block bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl text-center hover:bg-emerald-600 transition-colors">
                    🎥 Join Now
                  </Link>
                ) : (
                  <div className="mt-3 bg-white/10 text-white/60 text-xs font-medium py-2 px-4 rounded-xl text-center">
                    {formatCountdown(upcomingSessions[0].date, upcomingSessions[0].time) || 'Join 10 min before'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule toast */}
      {rescheduleToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="bg-navy text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold">
            {rescheduleToast}
          </div>
        </div>
      )}
    </div>
  );
}
