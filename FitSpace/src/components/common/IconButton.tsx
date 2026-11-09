import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';
import '../../styles/controls.css';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  Icon: IconType;
  label: string; // becomes the accessible name and the tooltip
  tone?: 'default' | 'danger';
}

function IconButton({ Icon, label, tone = 'default', className = '', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={`icon-button icon-button-${tone} ${className}`.trim()}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}

export default IconButton;