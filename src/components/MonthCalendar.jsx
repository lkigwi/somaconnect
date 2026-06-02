import { useState } from 'react';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Hardcoded "booked" day-of-month patterns for demo (every Wed + specific dates)
const BOOKED_DAYS = [5, 12, 19]; // specific dates that look booked

export default function MonthCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
  const startPad = firstDayOfMonth.getDay(); // 0 = Sun

  const days = [];
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push(new Date(viewYear, viewMonth, d));
  }

  const isCurrentMonthOrLater =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth >= today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const canGoPrev = () =>
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const isPast = (date) => date < today;
  const isSunday = (date) => date.getDay() === 0;
  const isBooked = (date) => BOOKED_DAYS.includes(date.getDate());
  const isUnavailable = (date) => isPast(date) || isSunday(date) || isBooked(date);

  const isSelected = (date) =>
    selectedDate && date.toDateString() === selectedDate.toDateString();
  const isToday = (date) => date.toDateString() === today.toDateString();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-navy to-teal">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-base">{MONTH_NAMES[viewMonth]}</p>
          <p className="text-white/60 text-xs">{viewYear}</p>
        </div>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-lg font-bold"
        >
          ›
        </button>
      </div>

      <div className="p-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 py-1.5">{d}</div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}

          {days.map((date) => {
            const unavail = isUnavailable(date);
            const sel = isSelected(date);
            const tod = isToday(date);

            let cls = 'w-full aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 ';

            if (sel) {
              cls += 'bg-teal text-white shadow-md shadow-teal/40 scale-110 font-bold';
            } else if (unavail) {
              cls += 'text-gray-300 cursor-not-allowed';
            } else if (tod) {
              cls += 'ring-2 ring-teal text-teal font-bold hover:bg-teal hover:text-white cursor-pointer';
            } else {
              cls += 'text-navy hover:bg-teal/10 hover:text-teal cursor-pointer';
            }

            return (
              <button
                key={date.toDateString()}
                onClick={() => !unavail && onSelect(date)}
                disabled={unavail}
                className={cls}
                title={unavail && isBooked(date) ? 'Already booked' : undefined}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-teal" />
            <span className="text-xs text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-teal" />
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-xs text-gray-400">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
