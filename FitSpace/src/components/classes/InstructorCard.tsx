import Avatar from '../common/Avatar';
import '../../styles/class-details.css';

interface InstructorCardProps {
  name: string;
  role: string; // e.g. "Yoga Expert | 8+ Years Experience"
}

function InstructorCard({ name, role }: InstructorCardProps) {
  return (
    <div className="instructor">
      <Avatar name={name} size="lg" />
      <div>
        <p className="instructor-name">{name}</p>
        <p className="instructor-role">{role}</p>
      </div>
    </div>
  );
}

export default InstructorCard;