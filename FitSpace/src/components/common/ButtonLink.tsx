import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import type { ButtonSize, ButtonVariant } from '../../types';
import { buildButtonClassName } from '../../utils/buttonClasses';

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function ButtonLink({ variant = 'primary', size = 'md', className = '', ...rest }: ButtonLinkProps) {
  return <Link className={buildButtonClassName(variant, size, className)} {...rest} />;
}

export default ButtonLink;