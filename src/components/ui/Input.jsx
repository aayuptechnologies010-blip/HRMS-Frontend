import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', icon: Icon, ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-[var(--color-text-primary)] block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-[var(--color-background)] border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger-border)]' 
              : 'border-[var(--color-border)] focus:border-[var(--color-brand-blue)] focus:ring-[var(--color-brand-light)]'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[var(--color-danger)] font-medium mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
