interface StatusMessageProps {
  type?: "info" | "error";
  message: string;
}

export function StatusMessage({ type = "info", message }: StatusMessageProps) {
  return <p className={`status-message status-message-${type} surface-glass`}>{message}</p>;
}
