export default function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'won':
      case 'on time':
        return 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]';
      case 'in progress':
      case 'proposal':
        return 'bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info-border)]';
      case 'blocked':
      case 'danger':
        return 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger-border)]';
      case 'contacted':
      case 'late arrival':
      case 'warning':
        return 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]';
      case 'negotiation':
      case 'in review':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-[var(--color-background)] text-[var(--color-text-muted)] border-[var(--color-border)]';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStyles()}`}>
      {status}
    </span>
  );
}
