import { getInitials } from '../../utils/formatters';
import '../../styles/controls.css';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'lg' | 'xl';
  imageUrl?: string; // when given, the photo replaces the initials
}

function Avatar({ name, size = 'sm', imageUrl }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Profile photo of ${name}`}
        className={`avatar avatar-${size} avatar-image`}
      />
    );
  }

  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}

export default Avatar;