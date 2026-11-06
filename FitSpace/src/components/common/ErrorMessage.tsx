import { MdErrorOutline } from 'react-icons/md';
import Button from './Button';
import '../../styles/states.css';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ title = 'Something went wrong', message, onRetry }: ErrorMessageProps) {
  return (
    <div className="state-panel state-panel-error" role="alert">
      <span className="state-panel-icon" aria-hidden="true">
        <MdErrorOutline />
      </span>
      <h2 className="state-panel-title">{title}</h2>
      <p className="state-panel-message">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export default ErrorMessage;