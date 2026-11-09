import { Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFormatQuote, MdOutlineFitnessCenter } from 'react-icons/md';
import notFoundImage from '../assets/not_found.png';
import type { ClassCategoryName } from '../types';
import '../styles/controls.css';
import '../styles/not-found.css';

// Each one opens Explore Classes already filtered to that style
const SUGGESTED_CATEGORIES: ClassCategoryName[] = ['Yoga', 'HIIT', 'Boxing'];

function NotFoundPage() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <MdOutlineFitnessCenter className="not-found-decor not-found-decor-top" aria-hidden="true" />
      <MdFavoriteBorder className="not-found-decor not-found-decor-bottom" aria-hidden="true" />

      <div className="container">
        <div className="not-found-grid">
          <div className="not-found-content">
            <p className="not-found-eyebrow">
              <span className="not-found-eyebrow-dot" aria-hidden="true" />
              Error 404
            </p>

            <h1 id="not-found-title" className="not-found-title">
              Lost your <span className="not-found-title-accent">momentum?</span>
            </h1>

            <p className="not-found-text">
              This page is out of breath and couldn't be found. Even the best athletes take a
              wrong turn - let's get you back on track to your personal best.
            </p>

            <nav aria-labelledby="not-found-suggestions">
              <p id="not-found-suggestions" className="not-found-suggestions-label">
                Maybe you were looking for:
              </p>
              <div className="chip-group">
                {SUGGESTED_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/classes?category=${category}`}
                    className="chip chip-link"
                  >
                    {category} classes
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <figure className="not-found-card">
            <img
              src={notFoundImage}
              alt="A trail runner stands on a hilltop at sunset, looking at a signpost whose two arrows both read 404"
              className="not-found-image"
            />
            <figcaption className="not-found-tip">
              <div className="not-found-tip-header">
                <span className="not-found-tip-icon" aria-hidden="true">
                  <MdFormatQuote />
                </span>
                <span className="not-found-tip-title">Pro Tip</span>
              </div>
              <p className="not-found-tip-text">
                "Getting lost is just an unscheduled part of the adventure. Refocus and keep
                moving forward."
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;