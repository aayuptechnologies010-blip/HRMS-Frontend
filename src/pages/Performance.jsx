import { useState } from 'react';
import { MdOutlineStarRate, MdTrendingUp, MdCheckCircle, MdAssignment } from 'react-icons/md';

export default function Performance() {
  const [reviews] = useState([
    { id: 1, type: 'Quarterly Review', status: 'Pending', dueDate: '2026-12-01', manager: 'Sarah Jenkins' },
    { id: 2, type: 'Annual Appraisal', status: 'Completed', dueDate: '2025-12-01', manager: 'Sarah Jenkins', score: '4.5/5.0' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Performance</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Track reviews, goals, and appraisals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <MdOutlineStarRate size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)] font-bold">Latest Rating</p>
              <h2 className="text-2xl font-black text-[var(--color-text-primary)]">4.5<span className="text-sm text-[var(--color-text-muted)]">/5.0</span></h2>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">Top 15% in the department</p>
        </div>

        <div className="md:col-span-2 bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Review Cycles</h3>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {reviews.map(review => (
              <div key={review.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-background)] transition-colors">
                <div className="flex items-center space-x-3">
                  {review.status === 'Completed' ? (
                    <MdCheckCircle className="text-[var(--color-success)]" size={24} />
                  ) : (
                    <MdAssignment className="text-[var(--color-warning)]" size={24} />
                  )}
                  <div>
                    <h4 className="font-bold text-[var(--color-text-primary)] text-sm">{review.type}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">Manager: {review.manager}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${review.status === 'Completed' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'}`}>
                    {review.status}
                  </span>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-semibold uppercase">{review.status === 'Completed' ? `Score: ${review.score}` : `Due: ${new Date(review.dueDate).toLocaleDateString()}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
