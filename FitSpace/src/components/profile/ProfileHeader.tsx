import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import { AVATAR_ACCEPTED_TYPES } from '../../constants/profileOptions';
import { formatMonthYear } from '../../utils/formatters';
import type { Role } from '../../types';
import '../../styles/profile.css';

interface ProfileHeaderProps {
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
  avatarUrl: string;
  photoError: string;
  onPhotoSelected: (file: File) => void;
  onPhotoRemoved: () => void;
}

function ProfileHeader({
  name,
  email,
  role,
  joinedAt,
  avatarUrl,
  photoError,
  onPhotoSelected,
  onPhotoRemoved,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onPhotoSelected(file);
    event.target.value = ''; // lets the member pick the same file again later
  };

  return (
    <div className="profile-header">
      <div className="profile-avatar-wrap">
        <Avatar name={name} size="xl" imageUrl={avatarUrl || undefined} />
        <IconButton
          Icon={MdOutlinePhotoCamera}
          label="Change profile photo"
          className="profile-camera-button"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={AVATAR_ACCEPTED_TYPES.join(',')}
          hidden
          onChange={handleFileChange}
        />
      </div>

      <div className="profile-identity">
        <h2 className="profile-name">{name}</h2>
        <p className="profile-email">{email}</p>

        <div className="profile-badges">
          <span className="profile-badge profile-badge-dark">
            {role === 'admin' ? 'Administrator' : 'Active member'}
          </span>
          <span className="profile-badge">Joined {formatMonthYear(joinedAt)}</span>
        </div>

        {avatarUrl && (
          <Button variant="light" size="sm" className="profile-remove-photo" onClick={onPhotoRemoved}>
            Remove photo
          </Button>
        )}
        {photoError && (
          <p className="form-error" role="alert">
            {photoError}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;