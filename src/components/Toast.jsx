import { useEffect, useState, useCallback } from 'react';
import { registerToastDispatcher } from '../toast';

const TOAST_DURATION = 3500;
let toastIdCounter = 0;

const ToastItem = ({ message, type, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onRemove, 300);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-orangered-500',
    info: 'bg-navy-600',
  };

  const icons = {
    success: '\u2713',
    error: '\u2717',
    info: '\u2139',
  };

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium
        ${colors[type]}
        ${exiting ? 'opacity-0 translate-x-8 transition-all duration-300' : 'animate-slide-in-right duration-300 ease-out'}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button onClick={() => { setExiting(true); setTimeout(onRemove, 300); }}
        className="ml-2 text-white/70 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    registerToastDispatcher(addToast);
    return () => registerToastDispatcher(null);
  }, [addToast]);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 min-w-[300px] max-w-[420px]">
      {toasts.map((t) => (
        <ToastItem key={t.id} message={t.message} type={t.type} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
