import { useState, useRef, useEffect } from 'react';
import { IconCalendar, IconChevronDown } from './Icons';

function parseSessionDateTime(dateStr, timeStr) {
  return new Date(`${dateStr} ${timeStr}`);
}

function parseDuration(dur) {
  if (dur === '45 Minutes') return 0.75;
  if (dur === '1.5 Hours') return 1.5;
  if (dur === '2 Hours') return 2;
  return 1;
}

function toGoogleDate(d) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildCalendarLinks(session) {
  const start = parseSessionDateTime(session.date, session.time);
  const hours = parseDuration(session.duration);
  const end = new Date(start.getTime() + hours * 3600000);
  const personName = session.tutor || session.student || 'Tutor';
  const title = encodeURIComponent(`Soma Connect Session with ${personName}`);
  const details = encodeURIComponent(`${session.subject} session. Join at: https://meet.jit.si/${session.jitsiRoom}`);
  const location = encodeURIComponent('Online (Jitsi Video)');

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toGoogleDate(start)}/${toGoogleDate(end)}&details=${details}&location=${location}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${start.toISOString().split('.')[0]}&enddt=${end.toISOString().split('.')[0]}&body=${details}&location=${location}`,
    ics: [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SomaConnect//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Soma Connect Session with ${personName}`,
      `DTSTART:${toGoogleDate(start)}`,
      `DTEND:${toGoogleDate(end)}`,
      `DESCRIPTION:${session.subject} session via Jitsi\\nJoin: https://meet.jit.si/${session.jitsiRoom}`,
      'LOCATION:Online (Jitsi Video)',
      `UID:${session.id}@somaconnect.co.ke`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n'),
  };
}

export default function CalendarDropdown({ session }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const links = buildCalendarLinks(session);
  const personName = session.tutor || session.student || 'Tutor';

  const downloadIcs = () => {
    const blob = new Blob([links.ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personName.replace(/\s+/g, '_')}_session.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs py-2 px-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
      >
        <IconCalendar className="w-3.5 h-3.5" />
        Add to Calendar
        <IconChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-52">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-medium truncate">Session with {personName}</p>
          </div>
          <a
            href={links.google} target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            Google Calendar
          </a>
          <button
            onClick={downloadIcs}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            Apple Calendar (.ics)
          </button>
          <a
            href={links.outlook} target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            Microsoft Outlook
          </a>
        </div>
      )}
    </div>
  );
}
