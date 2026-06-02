import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingModal from '../components/RatingModal';

export default function SessionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const room    = searchParams.get('room')    || 'SomaConnect-Demo';
  const tutor   = searchParams.get('tutor')   || 'Your Tutor';
  const subject = searchParams.get('subject') || 'Session';
  const avatar  = searchParams.get('avatar')  || 'GW';
  const role    = searchParams.get('role')    || 'student';   // 'tutor' | 'student'
  const sessionId = searchParams.get('id')    || '1';

  const jitsiRef  = useRef(null);
  const apiRef    = useRef(null);
  const [apiReady, setApiReady]       = useState(false);
  const [loadError, setLoadError]     = useState(false);
  const [elapsed, setElapsed]         = useState(0);          // seconds
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showRating, setShowRating]   = useState(false);
  const [ended, setEnded]             = useState(false);
  const timerRef = useRef(null);

  /* ── Load Jitsi iFrame API script ── */
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      initJitsi();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = initJitsi;
    script.onerror = () => { console.error('Failed to load Jitsi API'); setLoadError(true); };
    document.head.appendChild(script);

    return () => {
      apiRef.current?.dispose();
      clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line

  const initJitsi = () => {
    if (!jitsiRef.current || apiRef.current) return;

    const displayName = user?.name || (role === 'tutor' ? tutor : 'Student');

    apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName: room,
      parentNode: jitsiRef.current,
      userInfo: { displayName },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,       // skip the pre-join screen
        disableDeepLinking: true,
        requireDisplayName: false,       // no forced login
        enableWelcomePage: false,
        disableThirdPartyRequests: true, // no Google/auth calls
        p2p: { enabled: true },          // peer-to-peer, no server account needed
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 'chat',
          'raisehand', 'videoquality', 'tileview', 'fullscreen',
        ],
      },
    });

    setApiReady(true);

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);

    // If user ends call via Jitsi's own button — intercept
    apiRef.current.addEventListener('readyToClose', () => {
      handleEndSession();
    });
  };

  const handleEndSession = () => {
    clearInterval(timerRef.current);
    apiRef.current?.executeCommand('hangup');
    setEnded(true);
    // Only students need to rate; tutors go straight back
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

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-navy flex flex-col" style={{ zIndex: 9000 }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-navy border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white font-black text-sm shrink-0">
            {avatar}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{tutor}</p>
            <p className="text-white/60 text-xs">{subject}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live timer */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-xs font-mono font-semibold">{fmt(elapsed)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fallback: open in new tab */}
            <a
              href={`https://meet.jit.si/${room}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open video room in new tab (no login needed)"
              className="text-white/50 hover:text-white text-xs px-3 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-colors hidden sm:flex items-center gap-1"
            >
              ↗ New tab
            </a>
            {/* End session button */}
            <button
              onClick={() => setShowEndConfirm(true)}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <span>■</span> End Session
            </button>
          </div>
        </div>
      </div>

      {/* ── Jitsi embed ── */}
      <div
        ref={jitsiRef}
        className="flex-1 w-full"
        style={{ minHeight: 0 }}
      />

      {/* Loading / error state */}
      {!apiReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy z-10 px-6 text-center">
          {loadError ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                <span className="text-amber-400 text-3xl">⚠️</span>
              </div>
              <p className="text-white font-bold text-lg mb-1">Couldn't load video</p>
              <p className="text-white/50 text-sm mb-6 max-w-sm">
                This can happen on restricted networks. Open the room directly in a new tab — no account needed.
              </p>
              <a
                href={`https://meet.jit.si/${room}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal/90 transition-colors mb-3"
              >
                🎥 Open Video Room in New Tab
              </a>
              <p className="text-white/30 text-xs">Room: {room} · No login required</p>
              <button onClick={() => navigate(-1)} className="mt-4 text-white/40 text-sm hover:text-white/70">
                ← Go back
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white font-semibold">Connecting to your session...</p>
              <p className="text-white/50 text-sm mt-1">Room: {room}</p>
              <p className="text-white/30 text-xs mt-3">No Google account required</p>
            </>
          )}
        </div>
      )}

      {/* ── End session confirmation ── */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">■</span>
            </div>
            <h3 className="text-xl font-black text-navy mb-2">End Session?</h3>
            <p className="text-gray-500 text-sm mb-6">
              You've been in the session for <strong className="text-navy">{fmt(elapsed)}</strong>.
              {role === 'student' && " You'll be asked to rate your experience."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors"
              >
                Continue Session
              </button>
              <button
                onClick={() => { setShowEndConfirm(false); handleEndSession(); }}
                className="flex-1 py-3 text-sm bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mandatory rating after session (students only) ── */}
      {showRating && (
        <RatingModal
          session={{ id: sessionId, tutor, subject, avatar }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
