import { useState } from 'react';
import MonthCalendar from './MonthCalendar';

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];
const BOOKED_SLOTS = ['8:00 AM', '11:00 AM', '3:00 PM'];

const fmt = (d) =>
  d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export default function RescheduleModal({ session, onConfirm, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sending, setSending] = useState(false);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot || sending) return;
    setSending(true);
    setTimeout(() => {
      onConfirm({ sessionId: session.id, newDate: fmt(selectedDate), newTime: selectedSlot });
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column', animation: 'scaleIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-teal px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-white font-bold text-lg">Reschedule Session</h3>
            <p className="text-blue-200 text-xs mt-0.5">
              {session.tutor} · {session.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Current schedule */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Current Schedule</p>
            <p className="text-navy font-medium">{session.date} at {session.time}</p>
          </div>

          {/* Calendar */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select New Date</p>
            <MonthCalendar
              selectedDate={selectedDate}
              onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
            />
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Select New Time
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const busy = BOOKED_SLOTS.includes(slot);
                  return (
                    <button
                      key={slot}
                      disabled={busy}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        busy
                          ? 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                          : selectedSlot === slot
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-gray-200 text-gray-700 hover:border-teal/60 hover:text-teal'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedSlot && (
            <div className="bg-teal/5 border-2 border-teal/20 rounded-xl p-4">
              <p className="text-xs font-bold text-teal uppercase tracking-wider mb-1">New Schedule</p>
              <p className="text-navy font-semibold text-sm">{fmt(selectedDate)} at {selectedSlot}</p>
              <p className="text-gray-500 text-xs mt-1">
                Request will be sent to {session.tutor} for approval.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedSlot || sending}
            className={`flex-1 py-3 text-sm rounded-xl font-bold transition-all ${
              selectedDate && selectedSlot && !sending
                ? 'bg-teal text-white hover:bg-teal/90 hover:-translate-y-0.5 shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Request →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
