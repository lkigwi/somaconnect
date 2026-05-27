import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconChevronDown } from './Icons';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSignOut = () => {
    signOut();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const dashboardLink = user?.role === 'tutor' ? '/tutor-dashboard' : '/dashboard';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
  ];

  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <nav className="bg-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <span style={{ background: 'white', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Soma Connect" style={{ height: '40px' }} />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === to ? 'text-gold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <Link
                to={dashboardLink}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === dashboardLink ? 'text-gold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link to="/questionnaire" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                For Parents
              </Link>
            )}
          </div>

          {/* CTA / User */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-xs font-black text-white">
                    {initials}
                  </div>
                  <span className="text-sm font-medium">{firstName}</span>
                  <IconChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <Link
                      to={dashboardLink}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={user.role === 'tutor' ? '/tutor-signup' : '/questionnaire'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
                  Sign In
                </Link>
                <Link to="/questionnaire" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-navy/95 border-t border-white/10 px-4 py-4 space-y-2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to ? 'text-gold bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to={dashboardLink}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 py-2 px-3">
                  <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center text-xs font-black text-white">{initials}</div>
                  <span className="text-sm text-white font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-red-400 text-center py-2 hover:text-red-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/questionnaire"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                For Parents
              </Link>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 text-center py-2">
                  Sign In
                </Link>
                <Link to="/questionnaire" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center py-2">
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
