import '../../styles/stat-card.css';

interface StatCardProps {
  label: string;
  value: string | number;
  note?: string; // small coloured text next to the value
  tone?: 'light' | 'dark';
  noteColor?: 'teal' | 'coral';
}

function StatCard({ label, value, note, tone = 'light', noteColor = 'teal' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value-row">
        <span className="stat-card-value">{value}</span>
        {note && <span className={`stat-card-note stat-card-note-${noteColor}`}>{note}</span>}
      </p>
    </div>
  );
}

export default StatCard;