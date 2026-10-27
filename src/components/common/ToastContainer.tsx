import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        };

        const bgColors = {
          success: 'bg-white border-emerald-200 text-slate-800 shadow-lg shadow-emerald-500/5',
          info: 'bg-white border-sky-200 text-slate-800 shadow-lg shadow-sky-500/5',
          warning: 'bg-white border-amber-200 text-slate-800 shadow-lg shadow-amber-500/5',
          error: 'bg-white border-rose-200 text-slate-800 shadow-lg shadow-rose-500/5'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border text-sm font-medium ${bgColors[toast.type]} transition-all animate-in slide-in-from-right-4 duration-200`}
          >
            {icons[toast.type]}
            <p className="flex-1 text-xs leading-relaxed text-slate-700">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
