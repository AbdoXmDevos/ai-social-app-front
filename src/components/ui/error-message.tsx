import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive ${className}`}>
      <AlertCircle className="w-4 h-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
} 