import { MdEvent, MdAccessTime } from 'react-icons/md';

export default function Calendar() {
  const events = [
    { id: 1, title: 'Q3 Townhall', type: 'Company', date: '2026-11-15T10:00:00' },
    { id: 2, title: 'John Doe - Annual Leave', type: 'Leave', date: '2026-11-18T00:00:00' },
    { id: 3, title: 'Payroll Cutoff', type: 'HR', date: '2026-11-25T17:00:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Calendar</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Company events, leaves, and deadlines</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
        <div className="bg-[var(--color-background)] rounded-xl border border-dashed border-[var(--color-border)] p-12 text-center mb-6">
          <MdEvent size={48} className="mx-auto text-[var(--color-text-muted)] opacity-50 mb-4" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Interactive Calendar</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Full calendar grid will render here</p>
        </div>

        <h3 className="font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Upcoming Schedule</h3>
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex items-center p-3 bg-white border border-[var(--color-border)] rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-light)] text-[var(--color-brand-blue)] flex flex-col items-center justify-center mr-4">
                <span className="text-[10px] font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg font-black">{new Date(event.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[var(--color-text-primary)]">{event.title}</h4>
                <div className="flex items-center text-xs text-[var(--color-text-muted)] mt-1">
                  <MdAccessTime size={14} className="mr-1" />
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
