import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField, { inputCls } from '../components/FormField';
import { validators } from '../utils/validation';
import { IconBook, IconBriefcase, IconHeart, IconSun, IconTrophy, IconCheck } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, title: 'About Your Child', Icon: IconBook },
  { id: 2, title: 'Type of Support', Icon: IconHeart },
  { id: 3, title: 'Subject & Level', Icon: IconBook },
  { id: 4, title: 'Goals', Icon: IconTrophy },
  { id: 5, title: 'Preferences', Icon: IconBriefcase },
  { id: 6, title: 'Review', Icon: IconCheck },
];

const serviceCards = [
  { id: 'academic', title: 'Academic Tutoring', desc: 'Help with school subjects and exams', Icon: IconBook },
  { id: 'career', title: 'Career Guidance', desc: 'Direction for future studies and career path', Icon: IconBriefcase },
  { id: 'mental', title: 'Mental Health Support', desc: 'Emotional wellbeing and resilience', Icon: IconHeart },
  { id: 'faith', title: 'Faith Mentorship', desc: 'Spiritual guidance and moral growth', Icon: IconSun },
  { id: 'leadership', title: 'Leadership Mentorship', desc: 'Confidence, communication and leadership skills', Icon: IconTrophy },
];

const academicSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kiswahili', 'History', 'Geography', 'Business Studies', 'Computer Studies', 'Agriculture', 'CRE/IRE'];

export default function ParentQuestionnaire() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [accountConfirm, setAccountConfirm] = useState('');
  const [accountError, setAccountError] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [form, setForm] = useState({
    childName: '', childAge: '', childGender: '', parentName: '', parentPhone: '', parentEmail: '',
    services: [],
    level: '', selectedSubjects: [],
    goals: [], urgency: '',
    tutorGender: '', mode: '', budget: '', language: '', additionalNotes: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateField = (field, value) => {
    let err = null;
    if (field === 'childName') err = validators.name(value);
    if (field === 'parentName') err = validators.name(value);
    if (field === 'childAge') err = validators.age(value, 4, 25);
    if (field === 'parentPhone') err = validators.phone(value);
    if (field === 'parentEmail' && value) err = validators.email(value);
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

  const toggleService = (id) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  };

  const toggleSubject = (s) => {
    setForm((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(s)
        ? prev.selectedSubjects.filter((x) => x !== s)
        : [...prev.selectedSubjects, s],
    }));
  };

  const toggleGoal = (g) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(g) ? prev.goals.filter((x) => x !== g) : [...prev.goals, g],
    }));
  };

  const validateStep = () => {
    const newTouched = { ...touched };
    const newErrors = { ...errors };

    const check = (field, fn) => {
      newTouched[field] = true;
      const err = fn(form[field]);
      newErrors[field] = err;
    };

    if (step === 1) {
      check('childName', validators.name);
      check('childAge', (v) => validators.age(v, 4, 25));
      check('parentName', validators.name);
      check('parentPhone', validators.phone);
      if (form.parentEmail) check('parentEmail', validators.email);
    }

    setTouched(newTouched);
    setErrors(newErrors);

    const step1Valid = !newErrors.childName && !newErrors.childAge && !newErrors.parentName && !newErrors.parentPhone && (!form.parentEmail || !newErrors.parentEmail);
    if (step === 1) return step1Valid;
    if (step === 2) return form.services.length > 0;
    if (step === 3) {
      const needsAcademic = form.services.includes('academic');
      return !needsAcademic || (form.level && form.selectedSubjects.length > 0);
    }
    if (step === 4) return form.goals.length > 0;
    if (step === 5) return form.mode && form.budget;
    return true;
  };

  const next = () => {
    if (validateStep()) {
      // Skip step 3 if academic not selected
      if (step === 2 && !form.services.includes('academic')) {
        setStep(4);
      } else {
        setStep(step + 1);
      }
    }
  };

  const back = () => {
    if (step === 4 && !form.services.includes('academic')) setStep(2);
    else setStep(step - 1);
  };

  const totalSteps = STEPS.length;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const mentorshipServices = form.services.filter((s) => s !== 'academic');

  const handleCreateAccount = () => {
    setAccountError('');
    if (!accountEmail || !validators.email(accountEmail) === null) {
      if (!accountEmail) { setAccountError('Please enter your email address.'); return; }
    }
    if (!validators.email(accountEmail)) {
      setAccountError('Please enter a valid email address.');
      return;
    }
    if (accountPassword.length < 8) {
      setAccountError('Password must be at least 8 characters.');
      return;
    }
    if (accountPassword !== accountConfirm) {
      setAccountError('Passwords do not match.');
      return;
    }
    setCreatingAccount(true);
    setTimeout(() => {
      signIn({ name: form.parentName, email: accountEmail, role: 'parent' });
      navigate('/browse');
    }, 600);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-navy mb-3">You're All Set!</h2>
            <p className="text-gray-500 mb-2">
              Thank you, <strong className="text-navy">{form.parentName}</strong>! We've received your request for <strong className="text-teal">{form.childName}</strong>.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Our team will match you with the top 3 professionals within 24 hours on <strong>{form.parentPhone}</strong>.
            </p>
          </div>

          <div className="bg-bg rounded-2xl p-4 mb-6 text-left space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Summary</p>
            {[
              ['Child', `${form.childName}, ${form.childAge} yrs`],
              ['Level', form.level || '—'],
              ['Services', form.services.map((s) => serviceCards.find((c) => c.id === s)?.title).join(', ')],
              ['Mode', form.mode],
              ['Budget', form.budget],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-navy font-medium text-right max-w-xs">{val}</span>
              </div>
            ))}
          </div>

          {/* Account creation */}
          <div className="border-t border-gray-100 pt-6 mb-4">
            <h3 className="font-bold text-navy text-base mb-1">Create Your Account</h3>
            <p className="text-gray-500 text-xs mb-4">Save your preferences and browse matched tutors instantly.</p>
            <div className="space-y-3">
              <input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal transition-colors"
              />
              <input
                type="password"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                placeholder="Create password (min 8 characters)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal transition-colors"
              />
              <input
                type="password"
                value={accountConfirm}
                onChange={(e) => setAccountConfirm(e.target.value)}
                placeholder="Confirm password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal transition-colors"
              />
              {accountError && (
                <p className="text-red-500 text-xs">{accountError}</p>
              )}
              <button
                onClick={handleCreateAccount}
                disabled={creatingAccount}
                className="w-full btn-primary py-3 text-sm disabled:opacity-60"
              >
                {creatingAccount ? 'Creating account...' : 'Create Account and Browse'}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/browse" className="flex-1 text-sm text-center py-3 bg-teal/10 text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition-all">
              Browse Without Account
            </Link>
            <Link to="/" className="flex-1 text-sm text-center py-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Parent Questionnaire
          </div>
          <h1 className="text-3xl font-black text-navy mb-2">Find the Right Support for Your Child</h1>
          <p className="text-gray-500">Answer a few questions for a perfect match.</p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step > s.id ? 'bg-teal text-white' : step === s.id ? 'bg-gold text-navy' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id
                    ? <IconCheck className="w-4 h-4" />
                    : <span className="text-xs font-bold">{s.id}</span>}
                </div>
                <span className="hidden md:block text-xs text-gray-500 mt-1 text-center">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal to-blue-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">Step {step} of {totalSteps}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
              {(() => { const S = STEPS[step - 1]; return <S.Icon className="w-5 h-5 text-teal" />; })()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">{STEPS[step - 1].title}</h2>
              <p className="text-xs text-gray-400">Step {step} of {totalSteps}</p>
            </div>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Child's Name" required error={errors.childName} touched={touched.childName}>
                  <input value={form.childName}
                    onChange={(e) => handleChange('childName', e.target.value)}
                    onBlur={() => handleBlur('childName')}
                    placeholder="e.g. Amani" className={inputCls(touched.childName, errors.childName)} />
                </FormField>
                <FormField label="Child's Age" required error={errors.childAge} touched={touched.childAge}>
                  <input type="number" value={form.childAge}
                    onChange={(e) => handleChange('childAge', e.target.value)}
                    onBlur={() => handleBlur('childAge')}
                    placeholder="e.g. 14" min={4} max={25} className={inputCls(touched.childAge, errors.childAge)} />
                </FormField>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Child's Gender</label>
                <div className="flex gap-3">
                  {['Boy', 'Girl', 'Prefer not to say'].map((g) => (
                    <button key={g} onClick={() => update('childGender', g)}
                      className={`flex-1 py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${form.childGender === g ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600 hover:border-teal/50'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Contact Details</p>

              <FormField label="Your Full Name" required error={errors.parentName} touched={touched.parentName}>
                <input value={form.parentName}
                  onChange={(e) => handleChange('parentName', e.target.value)}
                  onBlur={() => handleBlur('parentName')}
                  placeholder="Full name" className={inputCls(touched.parentName, errors.parentName)} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Phone (M-Pesa)" required error={errors.parentPhone} touched={touched.parentPhone}
                  hint="Start with 07 or 01, 10 digits">
                  <input type="tel" value={form.parentPhone}
                    onChange={(e) => handleChange('parentPhone', e.target.value)}
                    onBlur={() => handleBlur('parentPhone')}
                    placeholder="0712 345 678" className={inputCls(touched.parentPhone, errors.parentPhone)} />
                </FormField>
                <FormField label="Email" error={errors.parentEmail} touched={touched.parentEmail}>
                  <input type="email" value={form.parentEmail}
                    onChange={(e) => handleChange('parentEmail', e.target.value)}
                    onBlur={() => handleBlur('parentEmail')}
                    placeholder="your@email.com" className={inputCls(touched.parentEmail, errors.parentEmail)} />
                </FormField>
              </div>
            </div>
          )}

          {/* ── STEP 2: Service type ── */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">What type of support does your child need? Select all that apply.</p>
              {serviceCards.map(({ id, title, desc, Icon }) => {
                const selected = form.services.includes(id);
                return (
                  <button key={id} onClick={() => toggleService(id)}
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
              {form.services.length === 0 && touched.services && (
                <p className="text-red-500 text-xs">Please select at least one type of support.</p>
              )}
            </div>
          )}

          {/* ── STEP 3: Academic details (if academic selected) ── */}
          {step === 3 && form.services.includes('academic') && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">School Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {['CBC Grade 1–6', 'CBC Grade 7–9', 'KCSE Form 1–4', 'A-Level / 6th Form', 'University', 'Adult Learner'].map((lvl) => (
                    <button key={lvl} onClick={() => update('level', lvl)}
                      className={`py-3 px-4 text-sm rounded-xl border-2 font-medium text-left transition-all ${form.level === lvl ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600 hover:border-teal/50'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">
                  Subjects Needed <span className="text-gray-400 font-normal">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {academicSubjects.map((s) => (
                    <button key={s} onClick={() => toggleSubject(s)}
                      className={`py-2 px-3 text-xs rounded-xl border-2 font-medium transition-all ${form.selectedSubjects.includes(s) ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600 hover:border-teal/50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">Current Performance</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Struggling', 'Average', 'Good, wants to excel'].map((perf) => (
                    <button key={perf} onClick={() => update('currentPerformance', perf)}
                      className={`py-3 text-sm rounded-xl border-2 font-medium transition-all ${form.currentPerformance === perf ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {perf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Goals ── */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">What do you hope to achieve?</p>

              {form.services.includes('academic') && [
                'Pass upcoming exams (KCSE/KCPE/Mock)',
                'Improve grades consistently',
                'Build strong foundational understanding',
                'University / scholarship preparation',
                'Catch up on missed content',
              ].map((g) => (
                <button key={g} onClick={() => toggleGoal(g)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${form.goals.includes(g) ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600 hover:border-teal/40'}`}>
                  <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${form.goals.includes(g) ? 'bg-teal border-teal' : 'border-gray-300'}`}>
                    {form.goals.includes(g) && <IconCheck className="w-3 h-3 text-white" />}
                  </div>
                  {g}
                </button>
              ))}

              {mentorshipServices.length > 0 && [
                'Build confidence and self-esteem',
                'Navigate career or life decisions',
                'Emotional resilience and mental wellness',
                'Spiritual growth and moral development',
                'Leadership and communication skills',
              ].map((g) => (
                <button key={g} onClick={() => toggleGoal(g)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${form.goals.includes(g) ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600 hover:border-teal/40'}`}>
                  <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${form.goals.includes(g) ? 'bg-teal border-teal' : 'border-gray-300'}`}>
                    {form.goals.includes(g) && <IconCheck className="w-3 h-3 text-white" />}
                  </div>
                  {g}
                </button>
              ))}

              {form.goals.length === 0 && <p className="text-gray-400 text-xs">Please select at least one goal.</p>}

              <div className="pt-2">
                <label className="text-xs font-semibold text-gray-600 block mb-2">Urgency</label>
                <div className="grid grid-cols-3 gap-3">
                  {['ASAP (this week)', 'Within 2 weeks', 'Flexible'].map((u) => (
                    <button key={u} onClick={() => update('urgency', u)}
                      className={`py-2.5 text-xs rounded-xl border-2 font-medium transition-all ${form.urgency === u ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Preferences ── */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">Session Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[['Online', '💻'], ['In-Person', '🏠'], ['Either', '↔']].map(([label]) => (
                    <button key={label} onClick={() => update('mode', label)}
                      className={`py-4 flex flex-col items-center gap-2 rounded-xl border-2 font-medium transition-all text-sm ${form.mode === label ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">Budget per hour</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Under KSh 500', 'KSh 500–800', 'KSh 800–1,200', 'Over KSh 1,200'].map((b) => (
                    <button key={b} onClick={() => update('budget', b)}
                      className={`py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${form.budget === b ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">Preferred Professional Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'No Preference'].map((g) => (
                    <button key={g} onClick={() => update('tutorGender', g)}
                      className={`flex-1 py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${form.tutorGender === g ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Additional Notes">
                <textarea value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)}
                  rows={3} placeholder="Any special needs, learning differences, or anything else..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal transition-colors resize-none" />
              </FormField>
            </div>
          )}

          {/* ── STEP 6: Review ── */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="bg-bg rounded-2xl p-5 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Review Your Submission</p>
                {[
                  ["Child's Name", form.childName],
                  ['Age', `${form.childAge} years`],
                  ['Services Needed', form.services.map((s) => serviceCards.find((c) => c.id === s)?.title).join(', ')],
                  ['Level', form.level || '—'],
                  ['Subjects', form.selectedSubjects.join(', ') || '—'],
                  ['Goals', form.goals.slice(0, 2).join('; ') + (form.goals.length > 2 ? `... +${form.goals.length - 2} more` : '')],
                  ['Mode', form.mode],
                  ['Budget', form.budget],
                  ['Parent Name', form.parentName],
                  ['Phone', form.parentPhone],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-start gap-4 text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 shrink-0 w-36">{label}</span>
                    <span className="text-navy font-medium text-right">{val || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="bg-teal/10 rounded-xl p-4 text-sm text-teal font-medium flex items-center gap-2">
                <IconCheck className="w-4 h-4" />
                We'll match you with the top 3 professionals within 24 hours via SMS.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={back}
                className="flex-1 py-3 text-sm border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">
                Back
              </button>
            )}
            {step < 6 ? (
              <button onClick={next}
                className="flex-1 btn-teal py-3 text-sm">
                Continue
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)} className="flex-1 btn-primary py-3 text-sm">
                Submit & Find My Match
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
