import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';

interface ToastProps {
  type: 'pending' | 'success' | 'error' | 'info';
  message: string;
  description?: string;
}

export function showToast({ type, message, description }: ToastProps) {
  const toastContent = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {type === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        {type === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
        {type === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
        {type === 'info' && <Info className="w-4 h-4 text-primary" />}
        <span className="font-medium">{message}</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground ml-6">{description}</p>
      )}
    </div>
  );

  if (type === 'pending') {
    return toast.loading(toastContent, { duration: Infinity });
  } else if (type === 'success') {
    return toast.success(toastContent, { duration: 5000 });
  } else if (type === 'error') {
    return toast.error(toastContent, { duration: 5000 });
  } else {
    return toast.info(toastContent, { duration: 5000 });
  }
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

// Backward compatibility - keep the old function name
export function showTransactionToast({ type, message }: { type: 'pending' | 'success' | 'error'; message: string; txHash?: string }) {
  return showToast({ type, message });
}
