import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const dashboardLink = user?.role === 'tutor' ? '/tutor-dashboard' : '/dashboard';

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-teal/20 mb-2">404</div>
        <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-2xl font-black text-navy mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            <Link to={dashboardLink} className="btn-teal px-8 py-3 text-sm">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/signin" className="btn-teal px-8 py-3 text-sm">
              Sign In
            </Link>
          )}
          <Link to="/" className="btn-secondary bg-navy text-white px-8 py-3 text-sm rounded-xl font-semibold hover:bg-navy/90 transition-all">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
