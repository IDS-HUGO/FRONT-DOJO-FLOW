import { useAlert } from '../contexts/AlertContext';

export function Toast() {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="toast-container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`toast toast-${alert.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {alert.type === 'success' && '✓'}
              {alert.type === 'error' && '✕'}
              {alert.type === 'info' && 'ⓘ'}
              {alert.type === 'warning' && '⚠'}
            </span>
            <span className="toast-message">{alert.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => removeAlert(alert.id)}
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
