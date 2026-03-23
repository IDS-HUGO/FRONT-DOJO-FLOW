import React, { createContext, useContext, useState, useCallback } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  duration?: number;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (message: string, type: AlertType, duration?: number) => void;
  removeAlert: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (message: string, type: AlertType, duration = 4000) => {
      const id = Date.now().toString();
      const newAlert: Alert = { id, message, type, duration };
      
      setAlerts((prev) => [...prev, newAlert]);

      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }
    },
    [removeAlert]
  );

  const success = useCallback((message: string, duration?: number) => {
    showAlert(message, 'success', duration);
  }, [showAlert]);

  const error = useCallback((message: string, duration?: number) => {
    showAlert(message, 'error', duration ?? 5000);
  }, [showAlert]);

  const info = useCallback((message: string, duration?: number) => {
    showAlert(message, 'info', duration);
  }, [showAlert]);

  const warning = useCallback((message: string, duration?: number) => {
    showAlert(message, 'warning', duration);
  }, [showAlert]);

  return (
    <AlertContext.Provider
      value={{ alerts, showAlert, removeAlert, success, error, info, warning }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}
