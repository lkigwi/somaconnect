import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_MESSAGES = [
  { id: 1, sender: 'Tutor', text: 'Hello! Ready to start our Mathematics session?', time: '3:58 PM' },
  { id: 2, sender: 'Student', text: 'Yes, I have my textbook ready.', time: '3:59 PM' },
];

function ChatBubbleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

export default function Session() {
  const navigate = useNavigate();
  const jitsiContainer = useRef(null);
  const jitsiApi = useRef(null);
  const scriptRef = useRef(null);
  const messagesEnd = useRef(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const roomName = 'SomaConnect-' + Date.now();

    const initJitsi = () => {
      if (!jitsiContainer.current || jitsiApi.current) return;
      jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: jitsiContainer.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          enableWelcomePage: false,
          enableClosePage: false,
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: ['microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'hangup', 'chat'],
        },
      });
    };

    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initJitsi;
      document.head.appendChild(script);
      scriptRef.current = script;
    }

    const waitTimer = setTimeout(() => setWaiting(false), 30000);

    return () => {
      clearTimeout(waitTimer);
      if (jitsiApi.current) {
        try { jitsiApi.current.dispose(); } catch {}
        jitsiApi.current = null;
      }
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chatOpen) {
      messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'You', text, time }]);
    setInput('');
  };

  return (
    <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Main video area ─────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Toolbar */}
        <div className="bg-navy flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold text-sm">Session in Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setChatOpen((o) => !o)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                chatOpen ? 'bg-teal text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ChatBubbleIcon className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              Leave Session
            </button>
          </div>
        </div>

        {/* Waiting banner */}
        {waiting && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center shrink-0">
            <span className="text-amber-700 text-xs font-medium">
              ⏳ Waiting for the other participant to join...
            </span>
          </div>
        )}

        {/* Jitsi mount point */}
        <div ref={jitsiContainer} className="flex-1 w-full bg-gray-900" />
      </div>

      {/* ── Chat panel ──────────────────────────────────── */}
      {chatOpen && (
        <div className="w-80 shrink-0 flex flex-col bg-white border-l border-gray-200 shadow-2xl">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 bg-navy shrink-0">
            <div className="flex items-center gap-2">
              <ChatBubbleIcon className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">Session Chat</span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/60 hover:text-white text-lg leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.sender === 'You' ? 'bg-teal text-white' : 'bg-gray-100 text-navy'
                }`}>
                  {m.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{m.sender} · {m.time}</span>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-teal transition-colors"
            />
            <button
              onClick={sendMessage}
              className="bg-teal text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal/90 transition-colors shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
