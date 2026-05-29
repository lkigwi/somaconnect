import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField, { inputCls } from '../components/FormField';
import { validators } from '../utils/validation';
import {
  IconUser, IconBook, IconBriefcase, IconHeart, IconSun, IconTrophy,
  IconSettings, IconCheck, IconAcademicCap, IconUpload, IconCamera, IconDocument,
} from '../components/Icons';

const STEPS = [
  { id: 1, title: 'Personal Info', Icon: IconUser },
  { id: 2, title: 'Your Service', Icon: IconBook },
  { id: 3, title: 'Set Your Rate', Icon: IconBriefcase },
  { id: 4, title: 'Qualifications', Icon: IconAcademicCap },
  { id: 5, title: 'Your Profile', Icon: IconUser },
  { id: 6, title: 'Agreement', Icon: IconCheck },
];

const serviceOptions = [
  { id: 'academic', label: 'Academic Tutoring', Icon: IconBook },
  { id: 'career', label: 'Career Guidance', Icon: IconBriefcase },
  { id: 'mental', label: 'Mental Health & Wellness', Icon: IconHeart },
  { id: 'faith', label: 'Faith & Spiritual Mentorship', Icon: IconSun },
  { id: 'leadership', label: 'Leadership Mentorship', Icon: IconTrophy },
];

const academicSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kiswahili', 'History', 'Geography', 'Business Studies', 'Computer Studies', 'Agriculture', 'CRE/IRE', 'French', 'Music'];
const gradeLevels = [
  'CBC Grade 1', 'CBC Grade 2', 'CBC Grade 3', 'CBC Grade 4',
  'CBC Grade 5', 'CBC Grade 6', 'CBC Grade 7', 'CBC Grade 8',
  'CBC Grade 9 (Junior Secondary)', 'Grade 10 (Senior Secondary)',
  'Form 3', 'Form 4', 'A-Level', 'University', 'Adult Learning',
];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const educationLevels = ["Bachelor's Degree", "Master's Degree", 'PhD / Doctorate', 'Diploma / Certificate', 'Other'];

export default function TutorSignup() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    fullName: '', idNumber: '', phone: '', email: '', password: '',
    // Step 2
    services: [],
    academicSubjects: [], gradeLevels: [],
    careerIndustry: '', careerYears: '',
    mentalSpecialty: '', mentalCredentials: '',
    faithTradition: '', faithApproach: '',
    leadershipBackground: '', leadershipTargetAge: '',
    // Step 3
    hourlyRate: '', availability: [], sessionMode: 'Online',
    // Step 4
    education: '', experienceYears: '',
    idFile: '', certFile: '',
    ref1Name: '', ref1Phone: '', ref2Name: '', ref2Phone: '',
    // Step 5
    headline: '', bio: '', photoFile: '',
    // Step 6
    agreeTerms: false, confirmAccurate: false,
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateField = (field, value) => {
    let err = null;
    if (field === 'fullName') err = validators.name(value, 3);
    if (field === 'idNumber') err = validators.idNumber(value);
    if (field === 'phone') err = validators.phone(value);
    if (field === 'email') err = validators.email(value);
    if (field === 'password') err = validators.password(value);
    if (field === 'hourlyRate') err = validators.rate(value);
    if (field === 'headline') err = validators.minLength(value, 10, 'Headline must be at least 10 characters');
    if (field === 'bio') err = validators.minLength(value, 50, 'Bio must be at least 50 characters');
    if (field === 'ref1Phone') err = validators.phone(value);
    if (field === 'ref2Phone' && value) err = validators.phone(value);
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
      check('fullName', (v) => validators.name(v, 3));
      check('idNumber', validators.idNumber);
      check('phone', validators.phone);
      check('email', validators.email);
      check('password', validators.password);
    }
    if (step === 3) {
      check('hourlyRate', validators.rate);
    }
    if (step === 4) {
      check('ref1Phone', validators.phone);
    }
    if (step === 5) {
      check('headline', (v) => validators.minLength(v, 10, 'Headline must be at least 10 characters'));
      check('bio', (v) => validators.minLength(v, 50, 'Bio must be at least 50 characters'));
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (step === 1) return !newErrors.fullName && !newErrors.idNumber && !newErrors.phone && !newErrors.email && !newErrors.password;
    if (step === 2) return form.services.length > 0;
    if (step === 3) return !newErrors.hourlyRate && form.availability.length > 0 && form.sessionMode;
    if (step === 4) return form.education && form.experienceYears && !newErrors.ref1Phone;
    if (step === 5) return !newErrors.headline && !newErrors.bio;
    if (step === 6) return form.agreeTerms && form.confirmAccurate;
    return true;
  };

  const next = () => {
    if (validateStep()) {
      if (step === 6) { setSubmitted(true); return; }
      setStep(step + 1);
    }
  };

  const commission = Math.round(Number(form.hourlyRate) * 0.85);
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconCheck className="w-10 h-10 text-teal" />
          </div>
          <h2 className="text-2xl font-black text-navy mb-3">Application Submitted!</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Thank you, <strong className="text-navy">{form.fullName.split(' ')[0]}</strong>! Our team will verify your credentials within <strong className="text-teal">48 hours</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            You will receive an SMS confirmation on <strong>{form.phone}</strong>.
          </p>
          <div className="bg-bg rounded-2xl p-4 mb-8 text-left space-y-2 text-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What happens next?</p>
            {['Document verification (24–48 hrs)', 'Background check via DCI', 'Profile review by our team', 'SMS/call to activate your account'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  <span className="text-teal text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link to="/signin" className="btn-teal flex-1 text-sm text-center py-3">Sign In to Your Dashboard</Link>
            <Link to="/" className="flex-1 text-sm text-center py-3 border-2 border-gray-200 rounded-xl text-navy font-semibold hover:border-teal transition-colors">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-navy/10 text-navy text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Tutor / Mentor Application
          </div>
          <h1 className="text-3xl font-black text-navy mb-2">Join SomaConnect</h1>
          <p className="text-gray-500">Fill in your details. Our team verifies all applications within 48 hours.</p>
        </div>

        {/* Step indicators */}
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
            <div className="h-full bg-gradient-to-r from-navy to-teal rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">Step {step} of {STEPS.length}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
              {(() => { const S = STEPS[step - 1]; return <S.Icon className="w-5 h-5 text-navy" />; })()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">{STEPS[step - 1].title}</h2>
              <p className="text-xs text-gray-400">Step {step} of {STEPS.length}</p>
            </div>
          </div>

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <FormField label="Full Legal Name" required error={errors.fullName} touched={touched.fullName}
                hint="Minimum 3 words — must match your National ID">
                <input value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="e.g. Grace Wanjiku Kamau"
                  className={inputCls(touched.fullName, errors.fullName)} />
              </FormField>

              <FormField label="National ID Number" required error={errors.idNumber} touched={touched.idNumber}
                hint="Exactly 8 digits">
                <input value={form.idNumber} maxLength={8}
                  onChange={(e) => handleChange('idNumber', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('idNumber')}
                  placeholder="12345678"
                  className={inputCls(touched.idNumber, errors.idNumber)} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Phone Number" required error={errors.phone} touched={touched.phone}
                  hint="Start with 07 or 01">
                  <input type="tel" value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="0712 345 678"
                    className={inputCls(touched.phone, errors.phone)} />
                </FormField>
                <FormField label="Email Address" required error={errors.email} touched={touched.email}>
                  <input type="email" value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="you@email.com"
                    className={inputCls(touched.email, errors.email)} />
                </FormField>
              </div>

              <FormField label="Password" required error={errors.password} touched={touched.password}
                hint="Minimum 8 characters">
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="Create a strong password"
                    className={`${inputCls(touched.password, errors.password)} pr-16`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-navy font-medium">
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
              </FormField>
            </div>
          )}

          {/* ── STEP 2: Service ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-2">Which services do you offer? Select all that apply.</p>

              {serviceOptions.map(({ id, label, Icon }) => {
                const selected = form.services.includes(id);
                return (
                  <div key={id}>
                    <button onClick={() => toggleArr('services', id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selected ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-teal/40'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-teal text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`font-semibold text-sm flex-1 ${selected ? 'text-teal' : 'text-navy'}`}>{label}</span>
                      {selected && <IconCheck className="w-5 h-5 text-teal shrink-0" />}
                    </button>

                    {/* Conditional sub-fields */}
                    {selected && id === 'academic' && (
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-teal/30 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Subjects you teach</p>
                          <div className="flex flex-wrap gap-2">
                            {academicSubjects.map((s) => (
                              <button key={s} onClick={() => toggleArr('academicSubjects', s)}
                                className={`text-xs py-1.5 px-3 rounded-lg border-2 font-medium transition-all ${form.academicSubjects.includes(s) ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Grade levels you cover</p>
                          <div className="flex flex-wrap gap-2">
                            {gradeLevels.map((g) => (
                              <button key={g} onClick={() => toggleArr('gradeLevels', g)}
                                className={`text-xs py-1.5 px-3 rounded-lg border-2 font-medium transition-all ${form.gradeLevels.includes(g) ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600'}`}>
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selected && id === 'career' && (
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-teal/30 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Industry / Field</label>
                          <input value={form.careerIndustry} onChange={(e) => update('careerIndustry', e.target.value)}
                            placeholder="e.g. Finance, Tech, Law" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Years of experience</label>
                          <input type="number" min={0} value={form.careerYears} onChange={(e) => update('careerYears', e.target.value)}
                            placeholder="e.g. 10" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                      </div>
                    )}

                    {selected && id === 'mental' && (
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-teal/30 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Specialty</label>
                          <input value={form.mentalSpecialty} onChange={(e) => update('mentalSpecialty', e.target.value)}
                            placeholder="e.g. Adolescent anxiety" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Credentials / Licence</label>
                          <input value={form.mentalCredentials} onChange={(e) => update('mentalCredentials', e.target.value)}
                            placeholder="e.g. Licensed Psychologist" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                      </div>
                    )}

                    {selected && id === 'faith' && (
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-teal/30 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Faith Tradition</label>
                          <input value={form.faithTradition} onChange={(e) => update('faithTradition', e.target.value)}
                            placeholder="e.g. Christian, Islamic" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Approach / Methodology</label>
                          <input value={form.faithApproach} onChange={(e) => update('faithApproach', e.target.value)}
                            placeholder="e.g. Discipleship, Coaching" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                      </div>
                    )}

                    {selected && id === 'leadership' && (
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-teal/30 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Leadership Background</label>
                          <input value={form.leadershipBackground} onChange={(e) => update('leadershipBackground', e.target.value)}
                            placeholder="e.g. Corporate, NGO, Sports" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Target Age Group</label>
                          <input value={form.leadershipTargetAge} onChange={(e) => update('leadershipTargetAge', e.target.value)}
                            placeholder="e.g. Teens, Young Adults" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {form.services.length === 0 && (
                <p className="text-red-400 text-xs">Please select at least one service.</p>
              )}
            </div>
          )}

          {/* ── STEP 3: Rate & Availability ── */}
          {step === 3 && (
            <div className="space-y-5">
              <FormField label="Rate per Session (KES)" required error={errors.hourlyRate} touched={touched.hourlyRate}
                hint="Minimum KES 500. You keep 85% after platform commission.">
                <input type="number" min={500} value={form.hourlyRate}
                  onChange={(e) => handleChange('hourlyRate', e.target.value)}
                  onBlur={() => handleBlur('hourlyRate')}
                  placeholder="e.g. 800"
                  className={inputCls(touched.hourlyRate, errors.hourlyRate)} />
              </FormField>

              {form.hourlyRate >= 500 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                  <p className="text-emerald-700 font-semibold">Earnings Preview</p>
                  <p className="text-emerald-600 text-xs mt-1">
                    You will earn <strong>KES {commission.toLocaleString()}</strong> per session after 15% platform commission.
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">
                  Available Days <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS.map((day) => (
                    <button key={day} onClick={() => toggleArr('availability', day)}
                      className={`py-2 text-xs rounded-xl border-2 font-medium transition-all ${form.availability.includes(day) ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600 hover:border-teal/50'}`}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2.5">
                  Session Mode <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Online'].map((m) => (
                    <button key={m} onClick={() => update('sessionMode', m)}
                      className={`py-3 text-sm rounded-xl border-2 font-medium transition-all ${form.sessionMode === m ? 'border-teal bg-teal/10 text-teal' : 'border-gray-200 text-gray-600'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Qualifications ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                    Highest Education Level <span className="text-red-400">*</span>
                  </label>
                  <select value={form.education} onChange={(e) => update('education', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal text-navy">
                    <option value="">Select level...</option>
                    {educationLevels.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                    Years of Experience <span className="text-red-400">*</span>
                  </label>
                  <input type="number" min={0} value={form.experienceYears}
                    onChange={(e) => update('experienceYears', e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Upload National ID</label>
                  <button
                    onClick={() => {
                      const fn = `ID_${form.idNumber || 'XXXXXXXX'}.jpg`;
                      update('idFile', fn);
                    }}
                    className="w-full flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-teal hover:text-teal transition-colors"
                  >
                    <IconUpload className="w-4 h-4 shrink-0" />
                    <span className="truncate">{form.idFile || 'Choose file...'}</span>
                  </button>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Upload Certificate</label>
                  <button
                    onClick={() => {
                      const fn = `Certificate_${form.fullName?.split(' ')[0] || 'Tutor'}.pdf`;
                      update('certFile', fn);
                    }}
                    className="w-full flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-teal hover:text-teal transition-colors"
                  >
                    <IconDocument className="w-4 h-4 shrink-0" />
                    <span className="truncate">{form.certFile || 'Choose file...'}</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Reference Contacts</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Reference 1 — Name</label>
                      <input value={form.ref1Name} onChange={(e) => update('ref1Name', e.target.value)}
                        placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal" />
                    </div>
                    <FormField label="Reference 1 — Phone" required error={errors.ref1Phone} touched={touched.ref1Phone}>
                      <input type="tel" value={form.ref1Phone}
                        onChange={(e) => { update('ref1Phone', e.target.value); if (touched.ref1Phone) validateField('ref1Phone', e.target.value); }}
                        onBlur={() => handleBlur('ref1Phone')}
                        placeholder="0712 345 678"
                        className={inputCls(touched.ref1Phone, errors.ref1Phone)} />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Reference 2 — Name</label>
                      <input value={form.ref2Name} onChange={(e) => update('ref2Name', e.target.value)}
                        placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal" />
                    </div>
                    <FormField label="Reference 2 — Phone" error={errors.ref2Phone} touched={touched.ref2Phone}>
                      <input type="tel" value={form.ref2Phone}
                        onChange={(e) => { update('ref2Phone', e.target.value); if (touched.ref2Phone) validateField('ref2Phone', e.target.value); }}
                        onBlur={() => handleBlur('ref2Phone')}
                        placeholder="0712 345 678"
                        className={inputCls(touched.ref2Phone, errors.ref2Phone)} />
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Profile ── */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="flex flex-col items-center mb-2">
                <button
                  onClick={() => update('photoFile', `Photo_${form.fullName?.split(' ')[0] || 'Tutor'}.jpg`)}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-teal flex flex-col items-center justify-center text-gray-400 hover:text-teal transition-colors mb-2"
                >
                  <IconCamera className="w-7 h-7" />
                  <span className="text-xs mt-1">Upload</span>
                </button>
                {form.photoFile && <p className="text-xs text-emerald-600 font-medium">{form.photoFile}</p>}
                <p className="text-xs text-gray-400">Profile photo (optional but recommended)</p>
              </div>

              <FormField label="Profile Headline" required error={errors.headline} touched={touched.headline}
                hint="Min 10 characters. e.g. 'Expert KCSE Maths Tutor with 8 Years Experience'">
                <input value={form.headline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  onBlur={() => handleBlur('headline')}
                  placeholder="Your professional headline..."
                  className={inputCls(touched.headline, errors.headline)} />
              </FormField>

              <FormField label="Professional Bio" required error={errors.bio} touched={touched.bio}>
                <div>
                  <textarea value={form.bio}
                    onChange={(e) => { handleChange('bio', e.target.value); }}
                    onBlur={() => handleBlur('bio')}
                    rows={5}
                    placeholder="Tell learners about your background, teaching style, achievements and what makes you the right choice..."
                    className={`${inputCls(touched.bio, errors.bio)} resize-none`} />
                  <div className="flex justify-between mt-1">
                    <span />
                    <span className={`text-xs font-medium ${form.bio.length >= 50 ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {form.bio.length} / 50 min
                    </span>
                  </div>
                </div>
              </FormField>
            </div>
          )}

          {/* ── STEP 6: Agreement ── */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="bg-bg rounded-2xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">What SomaConnect Will Verify</p>
                <div className="space-y-3">
                  {[
                    'National ID authenticity via Government database',
                    'Academic certificates and professional credentials',
                    'DCI background check for criminal records',
                    'Reference contacts will be called',
                    'Profile photo and identity match',
                    'Safeguarding policy agreement and understanding',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                        <IconCheck className="w-3.5 h-3.5 text-teal" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.agreeTerms ? 'border-teal bg-teal/5' : 'border-gray-200'}`}>
                  <input type="checkbox" checked={form.agreeTerms} onChange={(e) => update('agreeTerms', e.target.checked)}
                    className="mt-0.5 accent-teal shrink-0" />
                  <span className="text-sm text-gray-700">
                    I agree to SomaConnect's <span className="text-teal font-medium">Terms of Service</span>, <span className="text-teal font-medium">Privacy Policy</span>, and <span className="text-teal font-medium">Safeguarding Policy</span>.
                  </span>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.confirmAccurate ? 'border-teal bg-teal/5' : 'border-gray-200'}`}>
                  <input type="checkbox" checked={form.confirmAccurate} onChange={(e) => update('confirmAccurate', e.target.checked)}
                    className="mt-0.5 accent-teal shrink-0" />
                  <span className="text-sm text-gray-700">
                    I confirm that all information provided in this application is <strong>accurate and truthful</strong>. I understand that providing false information may result in permanent account suspension.
                  </span>
                </label>
              </div>

              {(!form.agreeTerms || !form.confirmAccurate) && (
                <p className="text-amber-600 text-xs font-medium">Please check both boxes above to submit your application.</p>
              )}
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
            <button onClick={next}
              className={`flex-1 py-3 text-sm rounded-xl font-semibold transition-all ${
                step === 6
                  ? form.agreeTerms && form.confirmAccurate ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'btn-teal'
              }`}
              disabled={step === 6 && (!form.agreeTerms || !form.confirmAccurate)}
            >
              {step === 6 ? 'Submit Application' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
