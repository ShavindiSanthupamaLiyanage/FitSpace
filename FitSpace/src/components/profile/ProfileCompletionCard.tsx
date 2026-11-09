import { MdOutlineAutoAwesome, MdOutlineCheckCircle } from 'react-icons/md';
import ProgressBar from '../common/ProgressBar';
import '../../styles/profile.css';

interface ProfileCompletionCardProps {
  percent: number;
}

function ProfileCompletionCard({ percent }: ProfileCompletionCardProps) {
  const isComplete = percent === 100;
  const Icon = isComplete ? MdOutlineCheckCircle : MdOutlineAutoAwesome;

  return (
    <section
      className={isComplete ? 'completion-card completion-card-done' : 'completion-card'}
      aria-label="Profile completion"
    >
      <span className="completion-card-icon" aria-hidden="true">
        <Icon />
      </span>

      <div>
        <h2 className="completion-card-title">
          {isComplete ? 'Your profile is complete' : 'Complete your profile'}
        </h2>
        <p className="completion-card-description">
          {isComplete
            ? 'Thank you! Your details help us personalise your fitness experience.'
            : 'Adding your details helps us personalise your fitness experience.'}
        </p>
      </div>

      <div className="completion-card-progress">
        <p className="completion-card-percent">{percent}% complete</p>
        <ProgressBar
          value={percent}
          max={100}
          label={`Profile ${percent}% complete`}
          tone={isComplete ? 'primary' : 'accent'}
        />
      </div>
    </section>
  );
}

export default ProfileCompletionCard;