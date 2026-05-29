import { useNavigate } from 'react-router-dom';

export default function Session() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Toolbar */}
      <div className="bg-navy flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold text-sm">Session in Progress</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          Leave Session
        </button>
      </div>

      {/* Jitsi iframe */}
      <iframe
        src="https://meet.jit.si/SomaConnect-Demo"
        allow="camera; microphone; fullscreen; display-capture"
        allowFullScreen
        className="flex-1 w-full border-0"
        title="Soma Connect Video Session"
      />
    </div>
  );
}
