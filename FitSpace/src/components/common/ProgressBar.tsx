import '../../styles/controls.css';

type ProgressTone = 'auto' | 'primary' | 'accent';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string; // read out by screen readers
  tone?: ProgressTone; // "auto" suits capacity: teal, then coral when nearly full, then red when full
}

const getLevel = (percent: number): 'normal' | 'high' | 'full' => {
  if (percent >= 100) return 'full';
  if (percent >= 85) return 'high';
  return 'normal';
};

// A native <progress> element: it needs no inline styles and is understood by screen readers
function ProgressBar({ value, max, label, tone = 'auto' }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const colorClass = tone === 'auto' ? getLevel(percent) : tone;

  return (
    <progress
      className={`progress-bar progress-bar-${colorClass}`}
      value={value}
      max={max}
      aria-label={label}
    />
  );
}

export default ProgressBar;