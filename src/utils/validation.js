export const validators = {
  name: (val, minWords = 1) => {
    if (!val || val.trim().length < 2) return 'Please enter a valid name';
    if (/\d/.test(val)) return 'Please enter a valid name';
    if (minWords > 1 && val.trim().split(/\s+/).length < minWords)
      return `Please enter your full name (at least ${minWords} words)`;
    return null;
  },
  phone: (val) => {
    const cleaned = (val || '').replace(/\s+/g, '');
    if (!cleaned.match(/^(07|01)\d{8}$/)) return 'Please enter a valid Kenyan phone number';
    return null;
  },
  email: (val) => {
    if (!val || !val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address';
    return null;
  },
  age: (val, min = 4, max = 100) => {
    const n = Number(val);
    if (!val || isNaN(n) || n < min || n > max) return `Please enter a valid age (${min}–${max})`;
    return null;
  },
  idNumber: (val) => {
    if (!val || !val.match(/^\d{8}$/)) return 'Please enter a valid 8-digit ID number';
    return null;
  },
  required: (val, label = 'This field') => {
    if (!val || val.toString().trim() === '') return `${label} is required`;
    return null;
  },
  password: (val) => {
    if (!val || val.length < 8) return 'Password must be at least 8 characters';
    return null;
  },
  minLength: (val, min, msg) => {
    if (!val || val.trim().length < min) return msg || `Must be at least ${min} characters`;
    return null;
  },
  rate: (val) => {
    const n = Number(val);
    if (!val || isNaN(n) || n < 500) return 'Minimum rate is KES 500';
    return null;
  },
};

export function runValidations(rules) {
  const errors = {};
  for (const [field, fn] of Object.entries(rules)) {
    const err = fn();
    if (err) errors[field] = err;
  }
  return errors;
}
