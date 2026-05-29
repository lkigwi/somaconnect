import { useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarDropdown from '../components/CalendarDropdown';

const timeSlots = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

const unavailableSlots = ['8:00 AM', '11:00 AM', '3:00 PM'];

const today = new Date();
const getDays = () => {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const formatDay = (d) =>
  d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' });

const BOOKING_STEPS = ['Pick Date & Time', 'Session Details', 'Payment', 'Confirmed'];

export default function Booking() {
  const [bStep, setBStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionType, setSessionType] = useState('1 Hour');
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [payError, setPayError] = useState('');

  const days = getDays();

  const prices = {
    '45 Minutes': 600,
    '1 Hour': 800,
    '1.5 Hours': 1150,
    '2 Hours': 1500,
  };

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

  const downloadReceipt = () => {
    const receiptDate = selectedDate ? formatDay(selectedDate) : 'N/A';
    const content = [
      '========================================',
      '         SOMACONNECT RECEIPT',
      '         somaconnect.co.ke',
      '========================================',
      '',
      `Receipt No: SC-${Date.now().toString().slice(-6)}`,
      `Date: ${new Date().toLocaleDateString('en-KE')}`,
      '',
      '--- SESSION DETAILS ---',
      `Tutor:    ${tutor.name}`,
      `Subject:  ${tutor.subject}`,
      `Date:     ${receiptDate}`,
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
      `Join: https://meet.jit.si/SomaConnect-Demo`,
      '',
      '========================================',
      'Thank you for choosing SomaConnect!',
      'hello@somaconnect.co.ke | +254 700 000 000',
      '========================================',
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SomaConnect_Receipt_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-navy mb-2">Payment Successful</h2>
          <p className="text-gray-500 text-sm mb-6">Your session with <strong className="text-navy">{tutor.name}</strong> is confirmed.</p>

          <div className="bg-bg rounded-2xl p-5 mb-6 text-left space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Details</p>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Tutor</span><span className="text-navy font-medium">{tutor.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="text-navy font-medium">{selectedDate && formatDay(selectedDate)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span className="text-navy font-medium">{selectedSlot}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="text-navy font-medium">{sessionType}</span></div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-2 mt-1">
              <span className="text-gray-500 font-semibold">Total Paid</span>
              <span className="text-emerald-600 font-black">KSh {(prices[sessionType] + 50).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <a
              href="https://meet.jit.si/SomaConnect-Demo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal flex-1 text-sm text-center py-3"
            >
              Join Video Session
            </a>
            <button
              onClick={downloadReceipt}
              className="flex-1 text-sm py-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
            >
              Download Receipt
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <CalendarDropdown session={{
              id: `SC-${Date.now()}`,
              tutor: tutor.name,
              subject: tutor.subject,
              date: selectedDate
                ? selectedDate.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                : '',
              time: selectedSlot || '',
              duration: sessionType,
              jitsiRoom: 'SomaConnect-Demo',
            }} />
          </div>

          <p className="text-xs text-gray-400 mb-5">A confirmation SMS has been sent to your M-Pesa number.</p>

          <Link to="/dashboard" className="text-sm text-teal font-semibold hover:underline">
            View in Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-navy mb-2 text-center">Book a Session</h1>
        <p className="text-gray-500 text-center mb-8">Select your time, confirm details, and pay with M-Pesa.</p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {BOOKING_STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === bStep ? 'bg-teal text-white' : i < bStep ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < bStep ? '✓ ' : `${i + 1}. `}{s}
              </div>
              {i < BOOKING_STEPS.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Step 0: Pick date & time */}
            {bStep === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-navy text-lg mb-5">📅 Select Date</h2>
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                      className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border-2 text-xs transition-all ${
                        selectedDate?.toDateString() === d.toDateString()
                          ? 'border-teal bg-teal text-white'
                          : i === 0
                          ? 'border-gold bg-gold/10 text-navy'
                          : 'border-gray-200 text-gray-600 hover:border-teal/50'
                      }`}
                    >
                      <span className="font-semibold">{d.toLocaleDateString('en-KE', { weekday: 'short' })}</span>
                      <span className="font-black text-base">{d.getDate()}</span>
                      <span>{d.toLocaleDateString('en-KE', { month: 'short' })}</span>
                      {i === 0 && <span className="text-gold text-xs font-bold">Today</span>}
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <>
                    <h2 className="font-bold text-navy text-lg mb-4">⏰ Select Time Slot</h2>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => {
                        const busy = unavailableSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            disabled={busy}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                              busy
                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                : selectedSlot === slot
                                ? 'border-teal bg-teal text-white'
                                : 'border-gray-200 text-gray-700 hover:border-teal/50'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-1" />
                      Crossed out = already booked
                    </p>
                  </>
                )}

                <button
                  onClick={() => selectedDate && selectedSlot && setBStep(1)}
                  disabled={!selectedDate || !selectedSlot}
                  className={`w-full mt-6 py-3 rounded-xl text-sm font-semibold transition-all ${selectedDate && selectedSlot ? 'btn-teal' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 1: Session details */}
            {bStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-navy text-lg">📝 Session Details</h2>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-2.5">Session Duration</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(prices).map(([dur, price]) => (
                      <button key={dur} onClick={() => setSessionType(dur)}
                        className={`py-3 px-4 rounded-xl border-2 text-sm font-medium flex justify-between items-center transition-all ${sessionType === dur ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                        <span>{dur}</span>
                        <span className="font-bold">KSh {price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-bg rounded-xl p-4 text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-navy">{formatDay(selectedDate)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium text-navy">{selectedSlot}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Subject</span><span className="font-medium text-navy">{tutor.subject}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="font-medium text-navy">Online (Jitsi)</span></div>
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

            {/* Step 2: Payment */}
            {bStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-navy text-lg">💚 M-Pesa Payment</h2>

                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
                    <span className="text-white font-black text-xl">M</span>
                  </div>
                  <div>
                    <p className="text-emerald-800 font-bold">Pay via M-Pesa STK Push</p>
                    <p className="text-emerald-600 text-xs">Enter your Safaricom number. You'll receive a PIN prompt on your phone.</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">M-Pesa Phone Number</label>
                  <div className="flex gap-2">
                    <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 shrink-0">🇰🇪 +254</div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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

          {/* Tutor summary card */}
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
                  <div className="text-sm space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Session</p>
                    <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-navy font-medium">{formatDay(selectedDate)}</span></div>
                    {selectedSlot && <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="text-navy font-medium">{selectedSlot}</span></div>}
                    {bStep >= 1 && <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="text-navy font-medium">{sessionType}</span></div>}
                    {bStep >= 1 && (
                      <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-100">
                        <span className="text-navy">Total</span>
                        <span className="text-teal">KSh {(prices[sessionType] + 50).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-teal/10 rounded-xl p-3 text-xs text-teal">
                  <strong>🎥 Online via Jitsi</strong><br />
                  You'll receive a unique video room link after payment.
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
