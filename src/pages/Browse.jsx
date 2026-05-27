import { useState } from 'react';
import { Link } from 'react-router-dom';

const allProfiles = [
  {
    name: 'Grace Wanjiku', role: 'Tutor', subject: 'Mathematics & Physics', level: 'Form 1–4',
    rating: 4.9, reviews: 87, rate: 800, rateLabel: 'KSh 800/hr', avatar: 'GW', badge: 'Top Rated',
    location: 'Nairobi', mode: 'Online & In-person', category: 'Academic Tutoring',
    subjects: ['Mathematics', 'Physics'],
    bio: 'TSC registered teacher with 8 years experience. Specialises in KCSE Maths and Physics with a 95% improvement rate.',
  },
  {
    name: 'Amina Hassan', role: 'Tutor', subject: 'English & Kiswahili', level: 'All levels',
    rating: 5.0, reviews: 112, rate: 600, rateLabel: 'KSh 600/hr', avatar: 'AH', badge: 'Superstar',
    location: 'Mombasa', mode: 'Online & In-person', category: 'Academic Tutoring',
    subjects: ['English', 'Kiswahili'],
    bio: 'Literature graduate with a passion for language. Perfect rating across 112 sessions — students love her engaging style.',
  },
  {
    name: 'James Kamau', role: 'Tutor', subject: 'Chemistry & Biology', level: 'KCSE',
    rating: 4.7, reviews: 63, rate: 750, rateLabel: 'KSh 750/hr', avatar: 'JK', badge: 'Popular',
    location: 'Nakuru', mode: 'Online', category: 'Academic Tutoring',
    subjects: ['Chemistry', 'Biology'],
    bio: 'BSc Chemistry from UoN. Former lab assistant turned tutor, making science accessible and fun for KCSE candidates.',
  },
  {
    name: 'Brian Otieno', role: 'Tutor', subject: 'Computer Studies & ICT', level: 'Form 2–4 & CBC',
    rating: 4.8, reviews: 71, rate: 900, rateLabel: 'KSh 900/hr', avatar: 'BO', badge: 'Tech Expert',
    location: 'Nairobi', mode: 'Online & In-person', category: 'Academic Tutoring',
    subjects: ['Computer Studies', 'ICT'],
    bio: 'Software developer and educator. Teaches coding, ICT and Computer Studies to secondary students with real-world projects.',
  },
  {
    name: 'Daniel Ochieng', role: 'Mentor', subject: 'Career Guidance', level: 'University & Adults',
    rating: 4.8, reviews: 54, rate: 1200, rateLabel: 'KSh 1,200/hr', avatar: 'DO', badge: 'Career Coach',
    location: 'Kisumu', mode: 'Online', category: 'Career Guidance',
    subjects: ['Career Guidance', 'Leadership'],
    bio: 'MBA holder and corporate trainer with 12 years in talent development. Helps young professionals land their dream jobs.',
  },
  {
    name: 'Peter Ngugi', role: 'Mentor', subject: 'Career & University Guidance', level: 'Form 4 & University',
    rating: 4.7, reviews: 33, rate: 1000, rateLabel: 'KSh 1,000/hr', avatar: 'PN', badge: 'Advisor',
    location: 'Nairobi', mode: 'Online & In-person', category: 'Career Guidance',
    subjects: ['Career Guidance', 'University Applications'],
    bio: 'Former admissions advisor at a leading Kenyan university. Specialises in scholarship applications and career mapping for Form 4 students.',
  },
  {
    name: 'Dr. Fatuma Abdalla', role: 'Mentor', subject: 'Mental Health & Wellness', level: 'Teens & Adults',
    rating: 4.9, reviews: 41, rate: 1500, rateLabel: 'KSh 1,500/hr', avatar: 'FA', badge: 'Licensed',
    location: 'Nairobi', mode: 'Online', category: 'Mental Health & Wellness',
    subjects: ['Mental Health', 'Counselling'],
    bio: 'Licensed clinical psychologist (PhD, UoN) specialising in adolescent mental health, anxiety, and academic stress. Confidential sessions.',
  },
  {
    name: 'Mary Omondi', role: 'Mentor', subject: 'Counselling & Emotional Wellness', level: 'Students & Families',
    rating: 4.8, reviews: 29, rate: 1200, rateLabel: 'KSh 1,200/hr', avatar: 'MO', badge: 'Counsellor',
    location: 'Kisumu', mode: 'Online & In-person', category: 'Mental Health & Wellness',
    subjects: ['Mental Health', 'Resilience'],
    bio: 'Registered counsellor with a focus on grief, identity, and stress management. Warm, empathetic approach tailored to each learner.',
  },
  {
    name: 'Rev. John Mwangi', role: 'Mentor', subject: 'Faith & Spiritual Mentorship', level: 'All ages',
    rating: 5.0, reviews: 28, rate: 800, rateLabel: 'KSh 800/hr', avatar: 'JM', badge: 'Faith Guide',
    location: 'Nairobi', mode: 'Online & In-person', category: 'Faith & Spiritual Mentorship',
    subjects: ['Faith Mentorship', 'Christian Discipleship'],
    bio: 'Ordained pastor and certified life coach. Helps individuals integrate faith with everyday decisions, relationships, and purpose.',
  },
  {
    name: 'Ustadh Ali Hassan', role: 'Mentor', subject: 'Islamic Spiritual Guidance', level: 'Teens & Adults',
    rating: 4.9, reviews: 19, rate: 700, rateLabel: 'KSh 700/hr', avatar: 'AH', badge: 'Islamic Guide',
    location: 'Mombasa', mode: 'Online', category: 'Faith & Spiritual Mentorship',
    subjects: ['Faith Mentorship', 'Islamic Studies'],
    bio: 'Islamic scholar with 15 years of youth mentorship. Provides Quran-grounded guidance on character, purpose, and resilience.',
  },
  {
    name: 'Sarah Njoroge', role: 'Mentor', subject: 'Leadership & Life Skills', level: 'Teens & Young Adults',
    rating: 4.9, reviews: 39, rate: 1000, rateLabel: 'KSh 1,000/hr', avatar: 'SN', badge: 'Leader Coach',
    location: 'Nairobi', mode: 'Online', category: 'Leadership Mentorship',
    subjects: ['Leadership', 'Life Skills'],
    bio: 'Youth empowerment facilitator and published author. Runs workshops for teens navigating school, identity, and future goals.',
  },
  {
    name: 'Collins Maina', role: 'Mentor', subject: 'Entrepreneurship & Leadership', level: 'University & Professionals',
    rating: 4.8, reviews: 22, rate: 1300, rateLabel: 'KSh 1,300/hr', avatar: 'CM', badge: 'Entrepreneur',
    location: 'Nairobi', mode: 'Online & In-person', category: 'Leadership Mentorship',
    subjects: ['Leadership', 'Entrepreneurship'],
    bio: 'Serial entrepreneur and TEDx speaker. Mentors university students and young professionals in building ventures and leadership presence.',
  },
];

const categoryOptions = ['All Categories', 'Academic Tutoring', 'Career Guidance', 'Mental Health & Wellness', 'Faith & Spiritual Mentorship', 'Leadership Mentorship'];
const roleOptions = ['All Roles', 'Tutor', 'Mentor'];
const modeOptions = ['All Modes', 'Online', 'In-person'];
const locationOptions = ['All Locations', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'];

export default function Browse() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [role, setRole] = useState('All Roles');
  const [mode, setMode] = useState('All Modes');
  const [location, setLocation] = useState('All Locations');
  const [maxRate, setMaxRate] = useState(2000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allProfiles.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.subject.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All Categories' || p.category === category;
    const matchRole = role === 'All Roles' || p.role === role;
    const matchMode = mode === 'All Modes' || p.mode.includes(mode);
    const matchLocation = location === 'All Locations' || p.location === location;
    const matchRate = p.rate <= maxRate;
    return matchSearch && matchCategory && matchRole && matchMode && matchLocation && matchRate;
  });

  return (
    <div className="min-h-screen bg-bg">
      <div className="gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Find Your Perfect <span className="text-gold">Tutor or Mentor</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">Browse {allProfiles.length} verified professionals across all 5 service categories</p>
          <div className="max-w-2xl mx-auto flex gap-2 bg-white rounded-2xl p-2 shadow-2xl">
            <input
              type="text" placeholder="Search by name or subject..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-navy outline-none text-sm rounded-xl"
            />
            <button className="btn-teal text-sm px-6">Search</button>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full border-2 transition-all ${
                category === cat ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600 hover:border-teal/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 font-medium">
            Showing <span className="text-teal font-bold">{filtered.length}</span> of {allProfiles.length} professionals
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-white border border-gray-200 text-navy text-sm font-medium px-4 py-2 rounded-xl shadow-sm"
          >
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 sticky top-24">
              <h3 className="font-bold text-navy text-base">Filters</h3>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Role</label>
                <div className="flex flex-col gap-2">
                  {roleOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="role" checked={role === opt} onChange={() => setRole(opt)} className="accent-teal" />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-teal text-navy">
                  {modeOptions.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Location</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-teal text-navy">
                  {locationOptions.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Max Rate: <span className="text-teal">KSh {maxRate.toLocaleString()}/hr</span>
                </label>
                <input type="range" min={200} max={2000} step={50} value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))} className="w-full accent-teal" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>KSh 200</span><span>KSh 2,000</span>
                </div>
              </div>

              <button
                onClick={() => { setSearch(''); setCategory('All Categories'); setRole('All Roles'); setMode('All Modes'); setLocation('All Locations'); setMaxRate(2000); }}
                className="w-full text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No results found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p, i) => (
                  <div key={i} className="card overflow-hidden group flex flex-col">
                    <div className="bg-gradient-to-br from-navy to-teal p-5 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl border-2 border-white/40">
                        {p.avatar}
                      </div>
                      <div>
                        <div className="text-white font-bold text-base leading-tight">{p.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{p.badge}</span>
                          <span className="text-xs text-white/70">{p.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.role === 'Mentor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>{p.role}</span>
                        <span className="text-xs text-gray-500">{p.mode}</span>
                      </div>
                      <p className="text-navy font-semibold text-sm mb-1">{p.subject}</p>
                      <p className="text-xs text-gray-500 mb-1">{p.level}</p>
                      <span className="text-xs text-teal/70 font-medium mb-3">{p.category}</span>
                      <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-1">{p.bio}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gold text-sm">★</span>
                          <span className="text-sm font-bold text-navy">{p.rating}</span>
                          <span className="text-xs text-gray-400">({p.reviews})</span>
                        </div>
                        <span className="text-teal font-bold text-sm">{p.rateLabel}</span>
                      </div>
                      <Link to="/booking" className="btn-teal text-sm text-center py-2.5 block">Book Now</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
