import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const success = (msg) => showToast(msg, "success");
  const error = (msg) => showToast(msg, "error");

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-bold min-w-[280px] max-w-sm ${
                t.type === "success" 
                  ? "bg-white text-gray-800 border-[1px] border-green-500/20 dark:bg-gray-800 dark:text-white" 
                  : "bg-white text-gray-800 border-[1px] border-red-500/20 dark:bg-gray-800 dark:text-white"
              }`}
            >
              {t.type === "success" ? <FaCheckCircle className="text-green-500 text-2xl" /> : <FaExclamationCircle className="text-red-500 text-2xl" />}
              <span className="flex-1 text-sm">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
