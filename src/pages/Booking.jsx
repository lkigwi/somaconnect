import { useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarDropdown from '../components/CalendarDropdown';
import MonthCalendar from '../components/MonthCalendar';
import { getJitsiUrl } from '../utils/jitsi';

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];
const UNAVAILABLE_SLOTS = ['8:00 AM', '11:00 AM', '3:00 PM'];

const formatDay = (d) =>
  d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const BOOKING_STEPS = ['Pick Date & Time', 'Session Details', 'Payment', 'Confirmed'];

const tutor = {
  name: 'Grace Wanjiku',
  subject: 'Mathematics & Physics',
  level: 'Form 1–4',
  rating: 4.9,
  reviews: 87,
  rate: 'KSh 800/session',
  avatar: 'GW',
  badge: 'Top Rated',
};

const prices = {
  '45 Minutes': 600,
  '1 Hour': 800,
  '1.5 Hours': 1150,
  '2 Hours': 1500,
};

export default function Booking() {
  const [bStep, setBStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionType, setSessionType] = useState('1 Hour');
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [payError, setPayError] = useState('');
  const [bookingId] = useState(() => `${Date.now().toString().slice(-8)}`);

  const jitsiUrl = getJitsiUrl(bookingId);

  const handlePayment = () => {
    if (!phone.match(/^(\+254|07|01)\d{8,9}$/)) {
      setPayError('Please enter a valid M-Pesa number (e.g. 0712345678)');
      return;
    }
    setPayError('');
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setConfirmed(true);
      setBStep(3);
    }, 3000);
  };

  const downloadReceipt = () => {
    const content = [
      '========================================',
      '         SOMACONNECT RECEIPT',
      '         somaconnect.co.ke',
      '========================================',
      '',
      `Receipt No: SC-${bookingId}`,
      `Date: ${new Date().toLocaleDateString('en-KE')}`,
      '',
      '--- SESSION DETAILS ---',
      `Tutor:    ${tutor.name}`,
      `Subject:  ${tutor.subject}`,
      `Date:     ${selectedDate ? formatDay(selectedDate) : 'N/A'}`,
      `Time:     ${selectedSlot}`,
      `Duration: ${sessionType}`,
      '',
      '--- PAYMENT ---',
      `Session fee:   KSh ${prices[sessionType].toLocaleString()}`,
      `Platform fee:  KSh 50`,
      `TOTAL PAID:    KSh ${(prices[sessionType] + 50).toLocaleString()}`,
      `Method:        M-Pesa`,
      '',
      '--- VIDEO SESSION ---',
      `Join via Jitsi: ${jitsiUrl}`,
      `Room:           SomaConnect-${bookingId}`,
      '',
      '========================================',
      'Thank you for choosing SomaConnect!',
      'hello@somaconnect.co.ke | +254 707 506 650',
      '========================================',
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SomaConnect_Receipt_SC-${bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── CONFIRMATION SCREEN ─────────────────────────────── */
  if (confirmed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center" style={{ animation: 'scaleIn 0.3s ease-out' }}>
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-navy mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-500 text-sm mb-2">
            Your session with <strong className="text-navy">{tutor.name}</strong> is confirmed.
          </p>
          <p className="text-xs text-teal font-semibold mb-6">
            🎥 Room: SomaConnect-{bookingId}
          </p>

          <div className="bg-bg rounded-2xl p-5 mb-6 text-left space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Details</p>
            {[
              ['Tutor', tutor.name],
              ['Date', selectedDate ? formatDay(selectedDate) : '—'],
              ['Time', selectedSlot],
              ['Duration', sessionType],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-navy font-medium">{val}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t border-gray-100 pt-2 mt-1">
              <span className="text-gray-500 font-semibold">Total Paid</span>
              <span className="text-emerald-600 font-black">KSh {(prices[sessionType] + 50).toLocaleString()}</span>
            </div>
          </div>

          {/* Jitsi join */}
          <div className="bg-teal/5 border-2 border-teal/20 rounded-2xl p-4 mb-5 text-left">
            <p className="text-xs font-bold text-teal uppercase tracking-wider mb-2">🎥 Your Video Room</p>
            <p className="text-xs text-gray-500 mb-3">
              Your private Jitsi room is ready. Join at your scheduled time.
            </p>
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-teal text-white text-sm font-bold py-3 px-4 rounded-xl text-center hover:bg-teal/90 transition-colors"
            >
              Join Video Session →
            </a>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={downloadReceipt}
              className="flex-1 text-sm py-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
            >
              Download Receipt
            </button>
            <div className="flex-1">
              <CalendarDropdown session={{
                id: `SC-${bookingId}`,
                tutor: tutor.name,
                subject: tutor.subject,
                date: selectedDate ? formatDay(selectedDate) : '',
                time: selectedSlot || '',
                duration: sessionType,
              }} />
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-5">A confirmation SMS has been sent to your M-Pesa number.</p>
          <Link to="/dashboard" className="text-sm text-teal font-semibold hover:underline">
            View in Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  /* ── MAIN BOOKING FLOW ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-navy mb-2 text-center">Book a Session</h1>
        <p className="text-gray-500 text-center mb-8">Select your time, confirm details, and pay with M-Pesa.</p>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {BOOKING_STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === bStep ? 'bg-teal text-white' : i < bStep ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < bStep ? '✓ ' : `${i + 1}. `}{s}
              </div>
              {i < BOOKING_STEPS.length - 1 && <span className="text-gray-300 hidden sm:block">→</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── Step 0: Pick date & time ── */}
            {bStep === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-navy text-lg mb-5">📅 Select a Date</h2>

                <MonthCalendar
                  selectedDate={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
                />

                {selectedDate && (
                  <div className="mt-6">
                    <h2 className="font-bold text-navy text-base mb-4">
                      ⏰ Time Slots for <span className="text-teal">{selectedDate.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {TIME_SLOTS.map((slot) => {
                        const busy = UNAVAILABLE_SLOTS.includes(slot);
                        return (
                          <button
                            key={slot}
                            disabled={busy}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                              busy
                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                : selectedSlot === slot
                                ? 'border-teal bg-teal text-white shadow-md shadow-teal/30'
                                : 'border-gray-200 text-gray-700 hover:border-teal/60 hover:text-teal'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                      <span className="w-3 h-3 inline-block bg-gray-100 border border-gray-200 rounded" />
                      Crossed out = already booked by another student
                    </p>
                  </div>
                )}

                <button
                  onClick={() => selectedDate && selectedSlot && setBStep(1)}
                  disabled={!selectedDate || !selectedSlot}
                  className={`w-full mt-6 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    selectedDate && selectedSlot
                      ? 'bg-teal text-white hover:-translate-y-0.5 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ── Step 1: Session details ── */}
            {bStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-navy text-lg">📝 Session Details</h2>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-3">
                    Session Duration
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(prices).map(([dur, price]) => (
                      <button key={dur} onClick={() => setSessionType(dur)}
                        className={`py-3.5 px-4 rounded-xl border-2 text-sm font-medium flex justify-between items-center transition-all ${
                          sessionType === dur ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600 hover:border-teal/40'
                        }`}>
                        <span>{dur}</span>
                        <span className="font-bold">KSh {price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-bg rounded-xl p-4 text-sm space-y-2.5">
                  {[
                    ['Date', formatDay(selectedDate)],
                    ['Time', selectedSlot],
                    ['Subject', tutor.subject],
                    ['Mode', 'Online (Jitsi Video)'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-navy">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setBStep(0)} className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                    ← Back
                  </button>
                  <button onClick={() => setBStep(2)} className="flex-1 btn-teal py-3 text-sm">
                    Proceed to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {bStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-navy text-lg">💚 M-Pesa Payment</h2>

                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-xl">M</span>
                  </div>
                  <div>
                    <p className="text-emerald-800 font-bold">Pay via M-Pesa STK Push</p>
                    <p className="text-emerald-600 text-xs">Enter your Safaricom number. You'll receive a PIN prompt on your phone.</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">M-Pesa Phone Number</label>
                  <div className="flex gap-2">
                    <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 shrink-0">🇰🇪 +254</div>
                    <input
                      type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712 345 678"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                  {payError && <p className="text-red-500 text-xs mt-1">{payError}</p>}
                </div>

                <div className="bg-bg rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Session ({sessionType})</span><span className="text-navy font-medium">KSh {prices[sessionType].toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Platform fee</span><span className="text-navy font-medium">KSh 50</span></div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span className="text-navy">Total</span>
                    <span className="text-teal">KSh {(prices[sessionType] + 50).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 font-medium flex items-start gap-2">
                  <span>🔒</span>
                  Your payment is secured and encrypted. You will only be charged once your tutor confirms the session.
                </div>

                {paying ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">STK Push sent to your phone...</p>
                    <p className="text-gray-400 text-sm">Enter your M-Pesa PIN to complete payment.</p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setBStep(1)} className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                      ← Back
                    </button>
                    <button onClick={handlePayment} className="flex-1 btn-primary py-3 text-sm">
                      Pay KSh {(prices[sessionType] + 50).toLocaleString()} via M-Pesa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Tutor summary card ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
              <div className="bg-gradient-to-br from-navy to-teal p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl border-2 border-white/40">
                  {tutor.avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{tutor.name}</div>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{tutor.badge}</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-sm font-semibold text-navy">{tutor.subject}</div>
                <div className="text-xs text-gray-500">{tutor.level}</div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gold">★</span>
                  <span className="font-bold text-navy">{tutor.rating}</span>
                  <span className="text-gray-400 text-xs">({tutor.reviews} reviews)</span>
                </div>
                <div className="text-teal font-bold">{tutor.rate}</div>
                <hr className="border-gray-100" />

                {selectedDate && (
                  <div className="text-sm space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Session</p>
                    <div className="flex justify-between"><span className="text-gray-500 text-xs">Date</span><span className="text-navy font-medium text-xs">{formatDay(selectedDate)}</span></div>
                    {selectedSlot && <div className="flex justify-between"><span className="text-gray-500 text-xs">Time</span><span className="text-navy font-medium text-xs">{selectedSlot}</span></div>}
                    {bStep >= 1 && <div className="flex justify-between"><span className="text-gray-500 text-xs">Duration</span><span className="text-navy font-medium text-xs">{sessionType}</span></div>}
                    {bStep >= 1 && (
                      <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-100">
                        <span className="text-navy">Total</span>
                        <span className="text-teal">KSh {(prices[sessionType] + 50).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-teal/10 rounded-xl p-3 text-xs text-teal">
                  <strong>🎥 Online via Jitsi Meet</strong><br />
                  You'll get a private video room after payment.
                </div>

                <div className="flex gap-2 text-xs text-gray-400">
                  <span>✅</span> Free cancellation 24hrs before
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
