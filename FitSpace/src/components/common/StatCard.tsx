import type { IconType } from 'react-icons';
import ProgressBar from './ProgressBar';
import '../../styles/stat-card.css';

interface StatCardProps {
  label: string;
  value: string | number;
  note?: string; // small coloured text next to the value
  tone?: 'light' | 'dark';
  noteColor?: 'teal' | 'coral';
  Icon?: IconType;
  progress?: { value: number; max: number; label: string };
}

function StatCard({
  label,
  value,
  note,
  tone = 'light',
  noteColor = 'teal',
  Icon,
  progress,
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      {Icon && (
        <span className="stat-card-icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      <div className="stat-card-content">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value-row">
          <span className="stat-card-value">{value}</span>
          {note && <span className={`stat-card-note stat-card-note-${noteColor}`}>{note}</span>}
        </p>
        {progress && <ProgressBar value={progress.value} max={progress.max} label={progress.label} />}
      </div>
    </div>
  );
}

export default StatCard;