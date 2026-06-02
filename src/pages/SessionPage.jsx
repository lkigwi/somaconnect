import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingModal from '../components/RatingModal';

export default function SessionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tutor     = searchParams.get('tutor')   || 'Grace Wanjiku';
  const subject   = searchParams.get('subject') || 'Mathematics';
  const avatar    = searchParams.get('avatar')  || 'GW';
  const role      = searchParams.get('role')    || 'student';
  const sessionId = searchParams.get('id')      || '1';

  const localVideoRef  = useRef(null);
  const streamRef      = useRef(null);
  const timerRef       = useRef(null);

  const [elapsed, setElapsed]             = useState(0);
  const [micOn, setMicOn]                 = useState(true);
  const [camOn, setCamOn]                 = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showRating, setShowRating]       = useState(false);
  const [camError, setCamError]           = useState(false);
  const [connected, setConnected]         = useState(false);

  /* ── Start camera + timer ── */
  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        // Small delay to simulate "connecting"
        setTimeout(() => { if (mounted) setConnected(true); }, 1200);
      })
      .catch(() => {
        if (mounted) { setCamError(true); setConnected(true); }
      });

    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    return () => {
      mounted = false;
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

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
    if (role === 'student') {
      setShowRating(true);
    } else {
      navigate('/tutor-dashboard');
    }
  };

  const handleRatingSubmit = () => {
    setShowRating(false);
    navigate('/dashboard');
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const otherName  = role === 'student' ? tutor : 'Student';
  const otherInit  = role === 'student' ? avatar : 'ST';

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col select-none" style={{ zIndex: 9000 }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-white/10 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white font-black text-sm shrink-0">
            {avatar}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{tutor}</p>
            <p className="text-white/50 text-xs">{subject}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
            connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
            {connected ? fmt(elapsed) : 'Connecting…'}
          </div>
          <button
            onClick={() => setShowEndConfirm(true)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <span className="text-base leading-none">■</span> End Session
          </button>
        </div>
      </div>

      {/* ── Video area ── */}
      <div className="flex-1 relative overflow-hidden bg-gray-950">

        {/* Remote "participant" — big panel */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal to-navy flex items-center justify-center shadow-2xl border-4 border-white/10">
              <span className="text-white font-black text-5xl">{otherInit}</span>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">{otherName}</p>
              <p className="text-white/40 text-sm mt-1">
                {connected ? 'In session · audio only' : 'Connecting…'}
              </p>
            </div>
          </div>
        </div>

        {/* Local camera — picture-in-picture corner */}
        <div className="absolute bottom-24 right-4 sm:bottom-28 sm:right-6 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-800">
          {camError || !camOn ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
              <span className="text-3xl mb-1">👤</span>
              <p className="text-white/40 text-xs">
                {camError ? 'No camera' : 'Camera off'}
              </p>
            </div>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}
          {/* Name label */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs font-semibold px-2 py-1 truncate">
            {user?.name?.split(' ')[0] || 'You'}
          </div>
        </div>

        {/* Connecting overlay */}
        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 z-20">
            <div className="w-14 h-14 border-4 border-teal border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white font-semibold">Connecting to session…</p>
            <p className="text-white/40 text-xs mt-1">{subject} with {tutor}</p>
          </div>
        )}
      </div>

      {/* ── Controls bar ── */}
      <div className="bg-gray-900 border-t border-white/10 px-6 py-4 flex items-center justify-center gap-4 shrink-0">
        {/* Mic */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
            micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white'
          }`}
          title={micOn ? 'Mute mic' : 'Unmute mic'}
        >
          {micOn ? '🎤' : '🔇'}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCam}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
            camOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white'
          }`}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {camOn ? '📷' : '📵'}
        </button>

        {/* End call (big red) */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-2xl transition-all shadow-lg"
          title="End session"
        >
          📵
        </button>

        {/* Chat placeholder */}
        <button
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl text-white transition-all"
          title="Chat (coming soon)"
        >
          💬
        </button>

        {/* Timer label */}
        <div className="text-white/40 text-xs font-mono ml-2 hidden sm:block">
          {fmt(elapsed)}
        </div>
      </div>

      {/* ── End session confirmation ── */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-3xl">📵</div>
            <h3 className="text-xl font-black text-navy mb-2">End Session?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Duration: <strong className="text-navy">{fmt(elapsed)}</strong>
              {role === 'student' && <span className="block mt-1 text-xs">You'll be asked to rate your experience.</span>}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                Continue
              </button>
              <button onClick={() => { setShowEndConfirm(false); handleEndSession(); }}
                className="flex-1 py-3 text-sm bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mandatory rating ── */}
      {showRating && (
        <RatingModal
          session={{ id: sessionId, tutor, subject, avatar }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
