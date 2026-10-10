import { forwardRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Select = forwardRef(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-[var(--color-text-primary)] block">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`appearance-none w-full bg-[var(--color-background)] border rounded-xl px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:ring-2
            ${error 
              ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger-border)]' 
              : 'border-[var(--color-border)] focus:border-[var(--color-brand-blue)] focus:ring-[var(--color-brand-light)]'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
          <MdKeyboardArrowDown size={20} />
        </div>
      </div>
      {error && (
        <p className="text-xs text-[var(--color-danger)] font-medium mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
