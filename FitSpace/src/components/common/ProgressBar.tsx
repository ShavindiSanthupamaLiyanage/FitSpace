import '../../styles/controls.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string; // read out by screen readers
}

const getLevel = (percent: number): 'normal' | 'high' | 'full' => {
  if (percent >= 100) return 'full';
  if (percent >= 85) return 'high';
  return 'normal';
};

// A native <progress> element: it needs no inline styles and is understood by screen readers
function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <progress className={`progress-bar progress-bar-${getLevel(percent)}`} value={value} max={max} aria-label={label} />
  );
}

export default ProgressBar;