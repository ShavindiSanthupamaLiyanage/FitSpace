import { useToastStore } from '../../store/toastStore';
import Toast from './Toast';

// Shows every active alert or acknowledgement message. Mounted once inside Layout.
function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

export default ToastContainer;