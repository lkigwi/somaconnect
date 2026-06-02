import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingModal from '../components/RatingModal';

/* ── SVG Icons ──────────────────────────────────────────────── */
const IconMicOn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1.5 15.93A8.001 8.001 0 0 1 4 11H2a10 10 0 0 0 9 9.95V23h2v-2.05A10 10 0 0 0 22 11h-2a8 8 0 0 1-6.5 5.93v-1.93z"/>
  </svg>
);
const IconMicOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19 11a7 7 0 0 1-.149 1.424l-1.685-1.685A5 5 0 0 0 17 11V5a5 5 0 0 0-9.95-.49L5.586 3.05A7 7 0 0 1 19 5v6zm-7 9.9A9.001 9.001 0 0 1 3.063 12H5.08a7 7 0 0 0 9.131 5.957l1.517 1.517A9.025 9.025 0 0 1 12 20.9zm-5.45-8.461L2.1 7.994 3.515 6.58l14.142 14.142-1.414 1.414-3.243-3.243V21h-2v-2.05A9.001 9.001 0 0 1 3 11H5a7 7 0 0 0 .55 2.757z"/>
  </svg>
);
const IconCamOn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);
const IconCamOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21 6.5l-4 4V7a1 1 0 0 0-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12c.28 0 .53-.11.71-.29l2.56 2.56L20.73 22 3.27 2z"/>
  </svg>
);
const IconScreenShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconPeople = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconMore = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
  </svg>
);
const IconEndCall = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 1l9 4v6c0 5.25-3.75 10.15-9 11.25C6.75 21.15 3 16.25 3 11V5l9-4zm-1 14l6-6-1.4-1.4L11 12.2l-2.6-2.6L7 11l4 4z"/>
  </svg>
);
const IconSignal = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M1.29 7.3A15.9 15.9 0 0 1 12 3c4.17 0 7.96 1.6 10.71 4.3l-1.42 1.41A13.9 13.9 0 0 0 12 5C8.48 5 5.3 6.37 2.71 8.71L1.29 7.3zM12 9c2.76 0 5.26 1.12 7.07 2.93l-1.41 1.41A7.9 7.9 0 0 0 12 11a7.9 7.9 0 0 0-5.66 2.34L4.93 11.93A9.9 9.9 0 0 1 12 9zm0 4c1.38 0 2.63.56 3.54 1.46l-3.54 3.54-3.54-3.54A5 5 0 0 1 12 13z"/>
  </svg>
);

/* ── Control button component ───────────────────────────────── */
function CtrlBtn({ onClick, active = true, danger = false, children, label, className = '' }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        title={label}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
          ${danger
            ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/40 scale-110'
            : active
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 ring-1 ring-red-500/50'
          }
          ${className}
        `}
      >
        {children}
      </button>
      {label && <span className="text-white/40 text-[10px] font-medium tracking-wide">{label}</span>}
    </div>
  );
}

/* ── Participant tile ───────────────────────────────────────── */
function ParticipantTile({ name, initials, isSelf, videoRef, camOn, micOn, speaking }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gray-800 flex items-center justify-center transition-all duration-300 ${
      speaking ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-gray-950' : ''
    }`}>
      {/* Video / Avatar */}
      {isSelf && camOn ? (
        <video
          ref={videoRef}
          autoPlay muted playsInline
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className={`rounded-full flex items-center justify-center font-black text-white shadow-2xl
            ${isSelf ? 'w-20 h-20 text-3xl bg-gradient-to-br from-teal to-blue-600'
                     : 'w-24 h-24 text-4xl bg-gradient-to-br from-navy to-teal'}`}>
            {initials}
          </div>
          {isSelf && !camOn && (
            <p className="text-white/30 text-xs mt-3">Camera off</p>
          )}
        </div>
      )}

      {/* Bottom bar: name + status */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {!micOn && (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <IconMicOff />
            </div>
          )}
          <span className="text-white text-xs font-semibold drop-shadow">{name}{isSelf ? ' (You)' : ''}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 opacity-70">
          <IconSignal />
        </div>
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div className="absolute top-3 right-3 flex gap-0.5 items-end h-4">
          {[1,2,3].map((b) => (
            <div key={b} className="w-1 bg-emerald-400 rounded-full animate-bounce"
              style={{ height: `${b * 4}px`, animationDelay: `${b * 0.1}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Session Page ──────────────────────────────────────── */
export default function SessionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tutor     = searchParams.get('tutor')   || 'Grace Wanjiku';
  const subject   = searchParams.get('subject') || 'Mathematics';
  const avatar    = searchParams.get('avatar')  || 'GW';
  const role      = searchParams.get('role')    || 'student';
  const sessionId = searchParams.get('id')      || '1';

  const localVideoRef = useRef(null);
  const streamRef     = useRef(null);
  const timerRef      = useRef(null);

  const [elapsed, setElapsed]               = useState(0);
  const [micOn, setMicOn]                   = useState(true);
  const [camOn, setCamOn]                   = useState(true);
  const [connected, setConnected]           = useState(false);
  const [camError, setCamError]             = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showRating, setShowRating]         = useState(false);
  const [activeSpeaker, setActiveSpeaker]   = useState('other'); // simulate other person speaking
  const [chatOpen, setChatOpen]             = useState(false);
  const [chatMessages, setChatMessages]     = useState([
    { id: 1, from: tutor, text: 'Hello! Ready to start?', time: 'now' },
  ]);
  const [chatInput, setChatInput]           = useState('');

  /* ── Camera + timer ── */
  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setTimeout(() => { if (mounted) setConnected(true); }, 1400);
      })
      .catch(() => { if (mounted) { setCamError(true); setConnected(true); } });

    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    // Simulate other speaker occasionally talking
    const speakTimer = setInterval(() => {
      setActiveSpeaker(Math.random() > 0.6 ? 'self' : 'other');
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(timerRef.current);
      clearInterval(speakTimer);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []); // eslint-disable-line

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !micOn; });
    setMicOn((v) => !v);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !camOn; });
    setCamOn((v) => !v);
  };

  const handleEndSession = () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setShowEndConfirm(false);
    if (role === 'student') setShowRating(true);
    else navigate('/tutor-dashboard');
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { id: Date.now(), from: user?.name?.split(' ')[0] || 'You', text: chatInput.trim(), time: now }]);
    setChatInput('');
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const myName    = user?.name?.split(' ')[0] || 'You';
  const myInitials = (user?.name || 'Y').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const otherName = role === 'student' ? tutor.split(' ')[0] : 'Student';

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-950" style={{ zIndex: 9000, fontFamily: 'Inter, sans-serif' }}>

      {/* ═══ TOP BAR ══════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900/90 backdrop-blur-sm border-b border-white/5 shrink-0">
        {/* Left: brand + session info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <IconShield />
            <span className="text-xs font-semibold text-white/50">Encrypted</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/70 text-xs font-medium">{subject}</span>
        </div>

        {/* Centre: timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono font-bold transition-all ${
          connected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'
        }`}>
          {connected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          {connected ? fmt(elapsed) : 'Connecting…'}
        </div>

        {/* Right: participants + end */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
            <IconPeople />
            <span className="text-white/60 text-xs font-semibold">2</span>
          </div>
          <button
            onClick={() => setShowEndConfirm(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-500/20"
          >
            <IconEndCall />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </div>

      {/* ═══ MAIN AREA ════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Video grid */}
        <div className="flex-1 p-3 sm:p-4 grid gap-3" style={{
          gridTemplateColumns: chatOpen ? '1fr' : 'repeat(2, 1fr)',
          gridTemplateRows: chatOpen ? 'repeat(2, 1fr)' : '1fr',
          maxHeight: '100%',
        }}>
          {/* Other participant tile */}
          <ParticipantTile
            name={otherName}
            initials={avatar}
            isSelf={false}
            camOn={true}
            micOn={true}
            speaking={connected && activeSpeaker === 'other'}
          />

          {/* Self tile */}
          <ParticipantTile
            name={myName}
            initials={myInitials}
            isSelf={true}
            videoRef={localVideoRef}
            camOn={camOn && !camError}
            micOn={micOn}
            speaking={connected && activeSpeaker === 'self'}
          />
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="w-72 bg-gray-900 border-l border-white/5 flex flex-col shrink-0" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">In-session chat</span>
              <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.from === myName ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === myName ? 'bg-teal text-white' : 'bg-white/10 text-white'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-white/30 text-[10px] mt-1">{m.from} · {m.time}</span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Message…"
                className="flex-1 bg-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:bg-white/15 placeholder-white/30 transition-colors"
              />
              <button onClick={sendChat} className="bg-teal text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-teal/90">
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connecting overlay */}
      {!connected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal to-blue-600 flex items-center justify-center text-white font-black text-3xl">
              {avatar}
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-teal/30 animate-ping" />
          </div>
          <p className="text-white font-semibold text-lg">Joining session…</p>
          <p className="text-white/40 text-sm mt-1">{subject} with {tutor.split(' ')[0]}</p>
        </div>
      )}

      {/* ═══ BOTTOM TOOLBAR ═══════════════════════════════════ */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-t border-white/5 px-6 py-4 flex items-center justify-center gap-3 sm:gap-5 shrink-0">
        <CtrlBtn onClick={toggleMic} active={micOn} label={micOn ? 'Mute' : 'Unmute'}>
          {micOn ? <IconMicOn /> : <IconMicOff />}
        </CtrlBtn>

        <CtrlBtn onClick={toggleCam} active={camOn} label={camOn ? 'Stop video' : 'Start video'}>
          {camOn ? <IconCamOn /> : <IconCamOff />}
        </CtrlBtn>

        <CtrlBtn onClick={() => {}} label="Share screen" className="hidden sm:flex">
          <IconScreenShare />
        </CtrlBtn>

        <CtrlBtn onClick={() => setChatOpen((v) => !v)} active={!chatOpen} label="Chat"
          className={chatOpen ? 'ring-2 ring-teal' : ''}>
          <IconChat />
        </CtrlBtn>

        <CtrlBtn onClick={() => {}} label="Participants">
          <IconPeople />
        </CtrlBtn>

        {/* End call — big red centrepiece */}
        <div className="flex flex-col items-center gap-1.5 mx-2">
          <button
            onClick={() => setShowEndConfirm(true)}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-white transition-all shadow-xl shadow-red-500/40 hover:scale-105"
            title="End session"
          >
            <IconEndCall />
          </button>
          <span className="text-white/40 text-[10px] font-medium">End</span>
        </div>

        <CtrlBtn onClick={() => {}} label="More">
          <IconMore />
        </CtrlBtn>
      </div>

      {/* ═══ END CONFIRM MODAL ════════════════════════════════ */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/10" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <IconEndCall />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Leave session?</h3>
            <p className="text-white/50 text-sm mb-1">Session duration: <strong className="text-white">{fmt(elapsed)}</strong></p>
            {role === 'student' && <p className="text-white/40 text-xs mb-6">You'll be asked to rate your experience.</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 text-sm border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors">
                Stay
              </button>
              <button onClick={handleEndSession}
                className="flex-1 py-3 text-sm bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold transition-colors">
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ RATING MODAL ═════════════════════════════════════ */}
      {showRating && (
        <RatingModal
          session={{ id: sessionId, tutor, subject, avatar }}
          onSubmit={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
