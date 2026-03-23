interface StatusMessageProps {
  type?: "info" | "error";
  message: string;
}

export function StatusMessage({ type = "info", message }: StatusMessageProps) {
  return <p className={`status-message ${type}`}>{message}</p>;
}
