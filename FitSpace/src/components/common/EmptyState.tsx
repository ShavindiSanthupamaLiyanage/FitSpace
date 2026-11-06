import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { MdOutlineInbox } from 'react-icons/md';
import '../../styles/states.css';

interface EmptyStateProps {
  title: string;
  message: string;
  Icon?: IconType;
  children?: ReactNode; // optional action, such as a Button or ButtonLink
}

function EmptyState({ title, message, Icon = MdOutlineInbox, children }: EmptyStateProps) {
  return (
    <div className="state-panel">
      <span className="state-panel-icon" aria-hidden="true">
        <Icon />
      </span>
      <h2 className="state-panel-title">{title}</h2>
      <p className="state-panel-message">{message}</p>
      {children}
    </div>
  );
}

export default EmptyState;