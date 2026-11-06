import '../../styles/states.css';

interface LoadingSpinnerProps {
  label?: string;
}

function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status">
      <span className="loading-spinner-ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;