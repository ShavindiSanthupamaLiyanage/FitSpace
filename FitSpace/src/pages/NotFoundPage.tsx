import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="page-center">
      <div>
        <div className="error-code" aria-hidden="true">
          404
        </div>
        <h1>Page not found</h1>
        <p>Oops! The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Take me home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;