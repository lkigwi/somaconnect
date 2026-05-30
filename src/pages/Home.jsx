import { Link } from 'react-router-dom';
import {
  IconUser, IconUsers, IconUserPlus, IconSearch, IconCalendar, IconRocket,
  IconBook, IconBriefcase, IconHeart, IconSun, IconTrophy,
  IconShieldCheck, IconLock, IconAcademicCap,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '1,200+', label: 'Learners Enrolled' },
  { value: '340+', label: 'Verified Tutors & Mentors' },
  { value: '5', label: 'Service Categories' },
  { value: '4.8★', label: 'Average Rating' },
];

const steps = [
  { step: '01', title: 'Create your profile', desc: 'Sign up as a Parent, Student, or Tutor/Mentor in under 2 minutes.', Icon: IconUserPlus },
  { step: '02', title: 'Find your match', desc: 'Browse verified tutors and mentors filtered by service, level, and availability.', Icon: IconSearch },
  { step: '03', title: 'Book a session', desc: 'Pick a time slot, pay securely via M-Pesa, and get a Google Meet link instantly.', Icon: IconCalendar },
  { step: '04', title: 'Learn & grow', desc: 'Attend your session, track progress, and rate your experience.', Icon: IconRocket },
];

const services = [
  {
    title: 'Academic Tutoring',
    desc: 'One-on-one and group sessions in Maths, Sciences, English, Kiswahili, and more for all levels.',
    Icon: IconBook,
    tags: ['Maths', 'Sciences', 'English', 'KCSE', 'KCPE'],
  },
  {
    title: 'Career Guidance',
    desc: 'Expert mentors helping students and young professionals chart their career paths with confidence.',
    Icon: IconBriefcase,
    tags: ['CV Writing', 'Interview Prep', 'University Choices'],
  },
  {
    title: 'Mental Health & Wellness',
    desc: 'Licensed counsellors providing safe, confidential support for emotional wellbeing and resilience.',
    Icon: IconHeart,
    tags: ['Counselling', 'Stress Management', 'Peer Support'],
  },
  {
    title: 'Faith & Spiritual Mentorship',
    desc: 'Spiritual mentors grounded in faith traditions offering guidance for personal and moral growth.',
    Icon: IconSun,
    tags: ['Christian', 'Islamic', 'Spiritual Growth'],
  },
  {
    title: 'Leadership Mentorship',
    desc: 'Seasoned leaders equipping the next generation with skills for influence and community impact.',
    Icon: IconTrophy,
    tags: ['Public Speaking', 'Team Building', 'Entrepreneurship'],
  },
];

const tutors = [
  { name: 'Grace Wanjiku', role: 'Tutor', subject: 'Mathematics & Physics', level: 'Form 1–4', rating: 4.9, reviews: 87, rate: 'KSh 800/hr', avatar: 'GW', badge: 'Top Rated' },
  { name: 'Daniel Ochieng', role: 'Mentor', subject: 'Career Guidance', level: 'University & Adults', rating: 4.8, reviews: 54, rate: 'KSh 1,200/hr', avatar: 'DO', badge: 'Mentor' },
  { name: 'Dr. Fatuma Abdalla', role: 'Mentor', subject: 'Mental Health & Wellness', level: 'Teens & Adults', rating: 4.9, reviews: 41, rate: 'KSh 1,500/hr', avatar: 'FA', badge: 'Licensed' },
  { name: 'James Kamau', role: 'Tutor', subject: 'Chemistry & Biology', level: 'KCSE', rating: 4.7, reviews: 63, rate: 'KSh 750/hr', avatar: 'JK', badge: 'Popular' },
  { name: 'Sarah Njoroge', role: 'Mentor', subject: 'Leadership Mentorship', level: 'Teens & Young Adults', rating: 4.9, reviews: 39, rate: 'KSh 1,000/hr', avatar: 'SN', badge: 'Mentor' },
  { name: 'Rev. John Mwangi', role: 'Mentor', subject: 'Faith & Spiritual Mentorship', level: 'All ages', rating: 5.0, reviews: 28, rate: 'KSh 800/hr', avatar: 'JM', badge: 'Faith Guide' },
];

const trustBadges = [
  { Icon: IconShieldCheck, title: 'DCI Background Checks', desc: 'Every tutor is vetted and cleared' },
  { Icon: IconLock, title: 'Secure Payments', desc: 'M-Pesa encrypted transactions' },
  { Icon: IconAcademicCap, title: 'Qualified Educators', desc: 'TSC registered & degree holders' },
  { Icon: IconShieldCheck, title: 'Child Safeguarding', desc: 'Strict safeguarding policy enforced' },
];

export default function Home() {
  const { user } = useAuth();
  const dashboardLink = user?.role === 'tutor' ? '/tutor-dashboard' : '/dashboard';

  return (
    <div className="font-inter">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="flex justify-center mb-6">
            <span className="bg-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full border border-gold/30">
              Kenya's #1 Learning Marketplace
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center leading-tight mb-6">
            Learn.<span className="text-gold"> Grow.</span><br />
            <span className="text-teal">Connect.</span>
          </h1>
          <p className="text-gray-300 text-center text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Find verified tutors and mentors across Kenya. Book sessions online, pay with M-Pesa, and transform your future — one session at a time.
          </p>

          {user ? (
            /* Logged-in hero */
            <div className="max-w-xl mx-auto text-center mb-12">
              <div className="flex justify-center mb-4">
                <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${
                  user.role === 'tutor' ? 'bg-teal text-white' : 'bg-white/20 text-white'
                }`}>
                  {user.role === 'tutor' ? 'Verified Tutor' : user.role === 'parent' ? 'Parent Account' : 'Student'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Welcome back, {user.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-300 text-sm mb-8">Ready to continue your journey?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={dashboardLink} className="btn-primary text-center px-8 py-3">
                  Go to Dashboard
                </Link>
                <Link to="/browse" className="btn-teal text-center px-8 py-3">
                  Browse Tutors & Mentors
                </Link>
              </div>
            </div>
          ) : (
            /* Role cards for logged-out users */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
              {[
                { Icon: IconUsers, title: "I'm a Parent", desc: 'Find the perfect tutor for your child', cta: 'Start Questionnaire', to: '/questionnaire', highlight: true },
                { Icon: IconAcademicCap, title: "I'm a Student", desc: 'Connect with tutors and mentors', cta: 'Find Support', to: '/student-questionnaire', highlight: false },
                { Icon: IconUserPlus, title: "I'm a Tutor / Mentor", desc: 'Join our marketplace and grow your practice', cta: 'Apply Now', to: '/tutor-signup', highlight: false },
              ].map((card) => (
                <Link
                  key={card.title}
                  to={card.to}
                  className={`group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    card.highlight ? 'bg-gold text-navy' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.highlight ? 'bg-navy/20' : 'bg-white/20'}`}>
                    <card.Icon className={`w-6 h-6 ${card.highlight ? 'text-navy' : 'text-white'}`} />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${card.highlight ? 'text-navy' : 'text-white'}`}>{card.title}</h3>
                  <p className={`text-sm mb-4 ${card.highlight ? 'text-navy/70' : 'text-gray-300'}`}>{card.desc}</p>
                  <span className={`text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all ${card.highlight ? 'text-navy' : 'text-gold'}`}>
                    {card.cta} →
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                placeholder="Search by subject, tutor name, or service..."
                className="flex-1 px-4 py-3 text-navy outline-none text-sm rounded-xl bg-transparent"
              />
              <Link to="/browse" className="btn-teal text-sm whitespace-nowrap">Search</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-teal mb-1">{value}</div>
                <div className="text-sm text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-teal text-sm font-semibold text-center uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="section-title">How SomaConnect Works</h2>
          <p className="section-subtitle max-w-xl mx-auto">Get from zero to learning in four easy steps.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-teal/40 to-transparent z-0" />
                )}
                <div className="card p-6 text-center relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
                    <step.Icon className="w-7 h-7 text-teal" />
                  </div>
                  <div className="text-xs font-bold text-teal/60 uppercase tracking-widest mb-2">{step.step}</div>
                  <h3 className="font-bold text-navy text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-teal text-sm font-semibold text-center uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Five areas of support, all available now.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div key={i} className="card p-6 border-2 border-transparent hover:border-teal transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center">
                    <svc.Icon className="w-6 h-6 text-teal" />
                  </div>
                  <span className="badge-available">Available Now</span>
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{svc.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {svc.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-bg text-gray-600 px-2 py-1 rounded-lg font-medium">{tag}</span>
                  ))}
                </div>
                <Link to="/browse" className="btn-teal text-sm block text-center w-full">
                  Browse {svc.title.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TUTORS & MENTORS ───────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-teal text-sm font-semibold text-center uppercase tracking-widest mb-3">Hand-Picked</p>
          <h2 className="section-title">Featured Tutors & Mentors</h2>
          <p className="section-subtitle">Our highest-rated professionals, ready to help you succeed.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {tutors.map((t, i) => (
              <div key={i} className="card overflow-hidden group">
                <div className="bg-gradient-to-br from-navy to-teal p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl border-2 border-white/40">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg leading-tight">{t.name}</div>
                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{t.badge}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      t.role === 'Mentor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>{t.role}</span>
                    <span className="text-xs text-gray-500">{t.level}</span>
                  </div>
                  <p className="text-navy font-semibold text-sm mb-3">{t.subject}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-gold">★</span>
                      <span className="text-sm font-bold text-navy">{t.rating}</span>
                      <span className="text-xs text-gray-400">({t.reviews} reviews)</span>
                    </div>
                    <span className="text-teal font-bold text-sm">{t.rate}</span>
                  </div>
                  <Link
                    to="/booking"
                    className="mt-4 btn-teal text-sm w-full text-center block py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/browse" className="btn-primary inline-block px-10 py-3">
              View All Tutors & Mentors
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ────────────────────────────────────── */}
      <section className="py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Why Families Trust <span className="text-gold">SomaConnect</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center mb-4">
                  <b.Icon className="w-7 h-7 text-teal" />
                </div>
                <h3 className="text-white font-bold mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-teal to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to unlock your potential?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join over 1,200 learners already transforming their futures with SomaConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire" className="btn-primary text-center">Start as a Parent</Link>
            <Link to="/student-questionnaire" className="btn-secondary text-center">Find My Tutor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
