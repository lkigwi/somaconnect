import { IconExclamation, IconCheck } from './Icons';

export default function FormField({ label, error, touched, required, children, hint }) {
  const hasError = touched && error;
  const isValid = touched && !error;

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {children}
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <IconCheck className="w-4 h-4 text-emerald-500" />
          </div>
        )}
      </div>
      {hint && !hasError && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
      {hasError && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <IconExclamation className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function inputCls(touched, error) {
  const base = 'w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors pr-9';
  if (touched && error) return `${base} border-red-400 bg-red-50 focus:border-red-400`;
  if (touched && !error) return `${base} border-emerald-400 focus:border-emerald-400`;
  return `${base} border-gray-200 focus:border-teal`;
}
