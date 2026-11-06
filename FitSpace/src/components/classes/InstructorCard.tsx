import { getInitials } from '../../utils/formatters';
import '../../styles/class-details.css';

interface InstructorCardProps {
  name: string;
  role: string; // e.g. "Yoga Expert | 8+ Years Experience"
}

function InstructorCard({ name, role }: InstructorCardProps) {
  return (
    <div className="instructor">
      <span className="instructor-avatar" aria-hidden="true">
        {getInitials(name)}
      </span>
      <div>
        <p className="instructor-name">{name}</p>
        <p className="instructor-role">{role}</p>
      </div>
    </div>
  );
}

export default InstructorCard;