import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 bg-white border border-stone-200 rounded-2xl shadow-xl flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-[#EBF0ED] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#1B3B36]" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-semibold text-xs text-[#1A1918] uppercase tracking-wide">
              {toast.title}
            </h4>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 hover:bg-stone-100 rounded-full cursor-pointer transition-colors text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
