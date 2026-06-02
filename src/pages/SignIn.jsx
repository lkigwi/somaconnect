import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconLock, IconEnvelope } from '../components/Icons';

const ADMIN_EMAIL    = 'admin@somaconnect.co.ke';
const ADMIN_PASSWORD = 'soma2026';
const ADMIN_NAME     = 'Lemayian Kigwi';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [showDemoName, setShowDemoName] = useState(false);
  const [demoName, setDemoName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    setTimeout(() => {
      // Admin account
      if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        signIn({ name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'admin' });
        navigate('/dashboard');
        return;
      }
      // Tutor account (email contains 'tutor')
      const isTutor = email.toLowerCase().includes('tutor');
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      signIn({ name: isTutor ? 'Jane Wanjiku' : name, email, role: isTutor ? 'tutor' : 'parent' });
      navigate(isTutor ? '/tutor-dashboard' : '/dashboard');
    }, 800);
  };

  const handleDemoLogin = () => {
    // First click: show name picker
    if (!showDemoName) {
      setShowDemoName(true);
      return;
    }
    // Second click (after name entered): sign in
    const name = demoName.trim() || ADMIN_NAME;
    setDemoLoading(true);
    setTimeout(() => {
      signIn({ name, email: ADMIN_EMAIL, role: 'admin' });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal flex items-center justify-center mx-auto mb-4">
            <IconLock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-navy">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your SomaConnect account</p>
        </div>

        {/* Demo login block */}
        <div className="mb-5">
          {showDemoName && (
            <div className="mb-2" style={{ animation: 'scaleIn 0.15s ease-out' }}>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Your name for this demo
              </label>
              <input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDemoLogin()}
                placeholder="e.g. Lemayian Kigwi"
                autoFocus
                className="w-full border-2 border-teal rounded-xl px-4 py-3 text-sm outline-none focus:border-teal/80 transition-colors"
              />
            </div>
          )}
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-teal bg-teal/5 text-teal font-bold text-sm hover:bg-teal hover:text-white transition-all duration-200 disabled:opacity-60"
          >
            {demoLoading ? (
              <span className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>🎬</span>
            )}
            {demoLoading ? 'Loading demo...' : showDemoName ? 'Start Demo →' : 'Run Demo (Admin View)'}
          </button>
          {showDemoName && (
            <button
              onClick={() => { setShowDemoName(false); setDemoName(''); }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 mt-1.5 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {redirectMessage && (
          <div className="bg-amber-50 text-amber-700 text-sm rounded-xl px-4 py-3 border border-amber-100 mb-4">
            {redirectMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
            <div className="relative">
              <IconEnvelope className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-teal transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
            <div className="relative">
              <IconLock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-14 py-3 text-sm outline-none focus:border-teal transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-teal transition-colors"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/questionnaire" className="text-teal font-semibold hover:underline">
                Get started
              </Link>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Want to teach on SomaConnect?{' '}
            <Link to="/tutor-signup" className="text-teal font-semibold hover:underline">
              Apply as a tutor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
