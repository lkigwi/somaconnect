import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconLock, IconEnvelope } from '../components/Icons';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const isTutor = email.toLowerCase().includes('tutor');
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      signIn({ name: isTutor ? 'Jane Wanjiku' : name, email, role: isTutor ? 'tutor' : 'parent' });
      navigate(isTutor ? '/tutor-dashboard' : '/dashboard');
    }, 800);
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-teal transition-colors"
              />
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
