import { useCallback } from 'react';
import ProfileForm from '../components/profile/ProfileForm';
// import DemoNote from '../components/common/DemoNote';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAsyncData } from '../hooks/useAsyncData';
import { getProfile } from '../services/profileService';
import { useAuthStore } from '../store/authStore';
import type { AuthUser } from '../types';
import '../styles/profile.css';

interface ProfileContentProps {
  user: AuthUser;
}

function ProfileContent({ user }: ProfileContentProps) {
  const fetchProfile = useCallback(() => getProfile(user.id), [user.id]);
  const { state, reload } = useAsyncData(fetchProfile);

  const renderContent = () => {
    if (state.status === 'loading') {
      return <LoadingSpinner label="Loading your profile..." />;
    }
    if (state.status === 'error') {
      return <ErrorMessage message={state.message} onRetry={reload} />;
    }
    return <ProfileForm user={user} profile={state.data} />;
  };

  return (
    <div className="container profile-page">
      <div className="profile-page-header">
        <h1 className="profile-page-title">My Profile</h1>
        <p className="profile-page-subtitle">Manage your personal details and preferences</p>
      </div>

      {renderContent()}

      {/* <DemoNote /> */}
    </div>
  );
}

// Keying by user id gives every member a fresh start when someone else signs in
function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  // ProtectedRoute already keeps signed-out visitors away from this page
  if (!user) return null;

  return <ProfileContent key={user.id} user={user} />;
}

export default ProfilePage;