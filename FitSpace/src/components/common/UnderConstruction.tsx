import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface UnderConstructionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

function UnderConstruction({
  title,
  description = 'We are working hard to bring you this page. Please check back soon.',
  children,
}: UnderConstructionProps) {
  return (
    <section className="page-center">
      <div>
        <div className="construction-stripe" aria-hidden="true" />
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default UnderConstruction;