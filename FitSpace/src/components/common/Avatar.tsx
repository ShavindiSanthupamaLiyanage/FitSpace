import { getInitials } from '../../utils/formatters';
import '../../styles/controls.css';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'lg';
}

function Avatar({ name, size = 'sm' }: AvatarProps) {
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}

export default Avatar;