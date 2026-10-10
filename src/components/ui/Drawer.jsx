import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

export default function Drawer({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <section className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300">
          <div className="h-full flex flex-col bg-[var(--color-surface)] shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)]">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)] transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-surface)]">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
