import { Link } from 'react-router-dom';
import { IconMapPin, IconEnvelope, IconPhone } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
                <span className="text-white font-black text-base">S</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Soma</span>
                <span className="text-gold font-bold text-lg">Connect</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Connecting learners with trusted tutors and mentors across Kenya.
            </p>
            <p className="text-xs text-gray-500 italic">Learn. Grow. Connect.</p>
            <p className="text-xs text-gray-500 mt-1">somaconnect.co.ke</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Academic Tutoring', 'Career Guidance', 'Mental Health & Wellness', 'Faith Mentorship', 'Leadership Mentorship'].map((s) => (
                <li key={s}><Link to="/browse" className="text-gray-400 hover:text-gold transition-colors text-xs">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-gold transition-colors text-xs">Home</Link></li>
              <li><Link to="/browse" className="text-gray-400 hover:text-gold transition-colors text-xs">Browse Tutors</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-gold transition-colors text-xs">Parent Portal</Link></li>
              <li><Link to="/student-questionnaire" className="text-gray-400 hover:text-gold transition-colors text-xs">Student Portal</Link></li>
              <li><Link to="/tutor-signup" className="text-gray-400 hover:text-gold transition-colors text-xs">Become a Tutor</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-gold transition-colors text-xs">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-gray-400">
                <IconMapPin className="w-4 h-4 text-teal shrink-0" />
                <span className="text-xs">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <IconEnvelope className="w-4 h-4 text-teal shrink-0" />
                <span className="text-xs">hello@somaconnect.co.ke</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <IconPhone className="w-4 h-4 text-teal shrink-0" />
                <span className="text-xs">+254 707 506 650</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {['X', 'in', 'f', 'IG'].map((icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs text-gray-300 hover:bg-teal hover:text-white transition-all duration-200">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 SomaConnect. All rights reserved. | Nairobi, Kenya</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link to="/safeguarding" className="hover:text-gold transition-colors">Safeguarding Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
