import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField, { inputCls } from '../components/FormField';
import { validators } from '../utils/validation';
import { IconUser, IconBook, IconBriefcase, IconHeart, IconSun, IconTrophy, IconCheck, IconSettings } from '../components/Icons';
import { incrementLearnerCount } from '../utils/counter';

const STEPS = [
  { id: 1, title: 'Your Details', Icon: IconUser },
  { id: 2, title: 'What You Need', Icon: IconHeart },
  { id: 3, title: 'Your Goals', Icon: IconTrophy },
  { id: 4, title: 'Preferences', Icon: IconSettings },
];

const serviceCards = [
  { id: 'academic', title: 'Academic Tutoring', desc: 'Help with school subjects and exams', Icon: IconBook },
  { id: 'career', title: 'Career Guidance', desc: 'Direction for future studies and career path', Icon: IconBriefcase },
  { id: 'mental', title: 'Mental Health Support', desc: 'Emotional wellbeing and resilience', Icon: IconHeart },
  { id: 'faith', title: 'Faith Mentorship', desc: 'Spiritual guidance and moral growth', Icon: IconSun },
  { id: 'leadership', title: 'Leadership Mentorship', desc: 'Confidence, communication and leadership skills', Icon: IconTrophy },
];

const academicSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kiswahili', 'History', 'Geography', 'Business Studies', 'Computer Studies'];

const gradeOptions = [
  'CBC Grade 1', 'CBC Grade 2', 'CBC Grade 3', 'CBC Grade 4',
  'CBC Grade 5', 'CBC Grade 6', 'CBC Grade 7', 'CBC Grade 8',
  'CBC Grade 9 (Junior Secondary)', 'Grade 10 (Senior Secondary)',
  'Form 3', 'Form 4',
  'University Year 1', 'University Year 2', 'University Year 3+',
  'Working Professional',
];

const academicGoals = [
  'Pass my upcoming exams',
  'Improve my grades consistently',
  'Understand concepts I am struggling with',
  'Prepare for university entry',
  'Catch up on missed work',
  'Get ahead of the curriculum',
];

const mentorshipGoals = [
  'Explore career options and paths',
  'Build my confidence and self-belief',
  'Manage stress and emotional wellbeing',
  'Grow spiritually and morally',
  'Develop leadership and communication skills',
  'Navigate a big life or career decision',
];

export default function StudentQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '', age: '', grade: '', phone: '', email: '',
    services: [],
    selectedSubjects: [], struggleWith: '', academicGoals: [],
    mentorshipGoals: [], mentorshipDesc: '',
    mode: 'Online', schedule: '', budget: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateField = (field, value) => {
    let err = null;
    if (field === 'fullName') err = validators.name(value, 2);
    if (field === 'age') err = validators.age(value, 10, 35);
    if (field === 'phone') err = validators.phone(value);
    if (field === 'email' && value) err = validators.email(value);
    setErrors((prev) => ({ ...prev, [field]: err }));
    return !err;
  };

  const handleChange = (field, value) => {
    update(field, value);
    if (touched[field]) validateField(field, value);
  };

  const handleBlur = (field) => {
    touch(field);
    validateField(field, form[field]);
  };

  const toggleArr = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter((x) => x !== val) : [...prev[field], val],
    }));
  };

  const validateStep = () => {
    const newTouched = { ...touched };
    const newErrors = { ...errors };

    const check = (field, fn) => {
      newTouched[field] = true;
      newErrors[field] = fn(form[field]);
    };

    if (step === 1) {
      check('fullName', (v) => validators.name(v, 2));
      check('age', (v) => validators.age(v, 10, 35));
      check('phone', validators.phone);
      if (form.email) check('email', validators.email);
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (step === 1) {
      return !newErrors.fullName && !newErrors.age && !newErrors.phone && (!form.email || !newErrors.email) && form.grade;
    }
    if (step === 2) return form.services.length > 0;
    if (step === 3) {
      const hasAcademic = form.services.includes('academic');
      const hasMentorship = form.services.some((s) => s !== 'academic');
      if (hasAcademic && form.selectedSubjects.length === 0) return false;
      if (hasMentorship && form.mentorshipDesc.trim().length < 30) return false;
      return true;
    }
    if (step === 4) return form.mode && form.budget;
    return true;
  };

  const next = () => {
    if (validateStep()) {
      if (step === 4) {
        // Save preferences for smart tutor filtering
        localStorage.setItem('soma_user_prefs', JSON.stringify({
          category: form.services[0] || 'academic',
          subjects: form.subjects || [],
        }));
        incrementLearnerCount();
        setSubmitted(true);
        setTimeout(() => navigate('/browse'), 3000);
      } else {
        setStep(step + 1);
      }
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;
  const hasAcademic = form.services.includes('academic');
  const hasMentorship = form.services.some((s) => s !== 'academic');

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconCheck className="w-10 h-10 text-teal" />
          </div>
          <h2 className="text-2xl font-black text-navy mb-3">Great, {form.fullName.split(' ')[0]}!</h2>
          <p className="text-gray-500 mb-2">We have your preferences. Let's find your perfect match.</p>
          <p className="text-gray-400 text-sm mb-6">Redirecting you to browse tutors and mentors...</p>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <Link to="/browse" className="btn-teal inline-block mt-6 px-8 py-3 text-sm">Browse Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Student Questionnaire
          </div>
          <h1 className="text-3xl font-black text-navy mb-2">Find the Right Support for You</h1>
          <p className="text-gray-500">Tell us what you need — we'll match you with the best tutor or mentor.</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  step > s.id ? 'bg-teal text-white' : step === s.id ? 'bg-gold text-navy' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <IconCheck className="w-4 h-4" /> : <span className="text-xs font-bold">{s.id}</span>}
                </div>
                <span className="hidden md:block text-xs text-gray-500 mt-1 text-center">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal to-blue-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">Step {step} of {STEPS.length}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
              {(() => { const S = STEPS[step - 1]; return <S.Icon className="w-5 h-5 text-teal" />; })()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">{STEPS[step - 1].title}</h2>
              <p className="text-xs text-gray-400">Step {step} of {STEPS.length}</p>
            </div>
          </div>

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <FormField label="Your Full Name" required error={errors.fullName} touched={touched.fullName}
                hint="Minimum 2 words">
                <input value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="e.g. Amani Wanjiku"
                  className={inputCls(touched.fullName, errors.fullName)} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Age" required error={errors.age} touched={touched.age} hint="Must be 10–35">
                  <input type="number" min={10} max={35} value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    onBlur={() => handleBlur('age')}
                    placeholder="e.g. 17"
                    className={inputCls(touched.age, errors.age)} />
                </FormField>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                    Grade / Level <span className="text-red-400">*</span>
                  </label>
                  <select value={form.grade} onChange={(e) => update('grade', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal text-navy">
                    <option value="">Select...</option>
                    {gradeOptions.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Phone Number" required error={errors.phone} touched={touched.phone}
                  hint="Start with 07 or 01">
                  <input type="tel" value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="0712 345 678"
                    className={inputCls(touched.phone, errors.phone)} />
                </FormField>
                <FormField label="Email (optional)" error={errors.email} touched={touched.email}>
                  <input type="email" value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="you@email.com"
                    className={inputCls(touched.email, errors.email)} />
                </FormField>
              </div>
            </div>
          )}

          {/* ── STEP 2: Service selection ── */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">What kind of support are you looking for? Select all that apply.</p>
              {serviceCards.map(({ id, title, desc, Icon }) => {
                const selected = form.services.includes(id);
                return (
                  <button key={id} onClick={() => toggleArr('services', id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selected ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-teal/40'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-teal text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${selected ? 'text-teal' : 'text-navy'}`}>{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    {selected && <IconCheck className="w-5 h-5 text-teal shrink-0" />}
                  </button>
                );
              })}
              {form.services.length === 0 && (
                <p className="text-gray-400 text-xs">Please select at least one option.</p>
              )}
            </div>
          )}

          {/* ── STEP 3: Goals ── */}
          {step === 3 && (
            <div className="space-y-5">
              {hasAcademic && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Academic — Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {academicSubjects.map((s) => (
                        <button key={s} onClick={() => toggleArr('selectedSubjects', s)}
                          className={`text-xs py-2 px-3 rounded-xl border-2 font-medium transition-all ${form.selectedSubjects.includes(s) ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600 hover:border-teal/50'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {form.selectedSubjects.length === 0 && (
                      <p className="text-red-400 text-xs mt-1">Please select at least one subject.</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      What specific topic or concept are you struggling with?
                    </label>
                    <input value={form.struggleWith} onChange={(e) => update('struggleWith', e.target.value)}
                      placeholder="e.g. Trigonometry, essay writing, organic chemistry..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Academic Goal</p>
                    <div className="space-y-2">
                      {academicGoals.map((g) => (
                        <label key={g} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.academicGoals.includes(g) ? 'border-teal bg-teal/5' : 'border-gray-200'}`}>
                          <input type="checkbox" checked={form.academicGoals.includes(g)}
                            onChange={() => toggleArr('academicGoals', g)} className="accent-teal" />
                          <span className="text-sm text-navy">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasMentorship && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Mentorship Goals</p>
                    <div className="space-y-2">
                      {mentorshipGoals.map((g) => (
                        <label key={g} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.mentorshipGoals.includes(g) ? 'border-teal bg-teal/5' : 'border-gray-200'}`}>
                          <input type="checkbox" checked={form.mentorshipGoals.includes(g)}
                            onChange={() => toggleArr('mentorshipGoals', g)} className="accent-teal" />
                          <span className="text-sm text-navy">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      Describe what you are looking for <span className="text-red-400">*</span>
                    </label>
                    <textarea value={form.mentorshipDesc}
                      onChange={(e) => update('mentorshipDesc', e.target.value)}
                      rows={4}
                      placeholder="Tell us more about what you hope to get from a mentor. Minimum 30 characters."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal resize-none transition-colors" />
                    <div className="flex justify-between mt-1">
                      {form.mentorshipDesc.length < 30
                        ? <p className="text-red-400 text-xs">Please write at least 30 characters.</p>
                        : <p className="text-emerald-500 text-xs flex items-center gap-1"><IconCheck className="w-3 h-3" /> Looks good!</p>}
                      <span className={`text-xs font-medium ${form.mentorshipDesc.length >= 30 ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {form.mentorshipDesc.length}/30 min
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: Preferences ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">
                  Session Mode <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Online'].map((m) => (
                    <button key={m} onClick={() => update('mode', m)}
                      className={`py-3 text-sm rounded-xl border-2 font-medium transition-all ${form.mode === m ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">Schedule Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Weekday mornings', 'Weekday evenings', 'Weekends', 'Flexible / Anytime'].map((s) => (
                    <button key={s} onClick={() => update('schedule', s)}
                      className={`py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${form.schedule === s ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">
                  Budget per Session <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Under KSh 500', 'KSh 500–800', 'KSh 800–1,200', 'Over KSh 1,200'].map((b) => (
                    <button key={b} onClick={() => update('budget', b)}
                      className={`py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${form.budget === b ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                Back
              </button>
            )}
            <button onClick={next} className="flex-1 btn-teal py-3 text-sm">
              {step === 4 ? 'Find My Match' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
