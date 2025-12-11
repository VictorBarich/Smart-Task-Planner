// Attribution: ChatGPT helped create this complex context wrapper which overlays toasts on the rest of the app
import { createContext, useContext, useState, useCallback } from "react";

import "./Toast.css";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info") => {
        const id = Date.now();

        setToasts(prev => [...prev, { id, message, type, leaving: false }]);

        // Start exit animation after 3s
        setTimeout(() => {
            setToasts(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, leaving: true } : t
                )
            );

            // Remove toast AFTER exit animation duration
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 250); // duration of exit animation
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`toast toast-${t.type} ${t.leaving ? "toast-exit" : ""}`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
