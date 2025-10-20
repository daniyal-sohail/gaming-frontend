"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback(
        (message, duration) => {
            addToast(message, "success", duration);
        },
        [addToast]
    );

    const error = useCallback(
        (message, duration) => {
            addToast(message, "error", duration);
        },
        [addToast]
    );

    const info = useCallback(
        (message, duration) => {
            addToast(message, "info", duration);
        },
        [addToast]
    );

    return (
        <ToastContext.Provider value={{ success, error, info, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { type, message } = toast;

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: "bg-emerald-950/95",
            borderColor: "border-emerald-800",
            iconColor: "text-emerald-400",
            textColor: "text-emerald-100",
        },
        error: {
            icon: AlertCircle,
            bgColor: "bg-red-950/95",
            borderColor: "border-red-800",
            iconColor: "text-red-400",
            textColor: "text-red-100",
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-950/95",
            borderColor: "border-blue-800",
            iconColor: "text-blue-400",
            textColor: "text-blue-100",
        },
    };

    const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

    return (
        <div
            className={`${bgColor} ${textColor} ${borderColor} border backdrop-blur-sm rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md pointer-events-auto animate-slide-in`}
        >
            <div className="flex items-start gap-3">
                <Icon className={`${iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
                <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ToastContext;


