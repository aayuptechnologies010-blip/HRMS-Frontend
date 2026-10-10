export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className = '', 
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-dark)] hover:shadow-md focus:ring-[var(--color-brand-blue)]",
    secondary: "bg-[var(--color-background)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-brand-light)] hover:text-[var(--color-brand-blue)] focus:ring-[var(--color-brand-blue)]",
    danger: "bg-[var(--color-danger)] text-white hover:bg-red-600 focus:ring-red-500",
    ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)] shadow-none"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} className="mr-2" />}
      {children}
    </button>
  );
}
