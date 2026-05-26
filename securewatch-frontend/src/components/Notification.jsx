import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Notification = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  const Icons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle
  };

  const Icon = Icons[type] || Icons.error;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg border text-xs font-medium shadow-lg transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${styles[type]}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 hover:bg-black/5 rounded transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Notification;
