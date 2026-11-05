import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import { CLASS_CATEGORIES } from '../constants/classCategories';
import ContactSection from '../components/contact/ContactSection';
import { useScrollToSection } from '../hooks/useScrollToSection';

const HERO_VIDEO_SOURCE = `${import.meta.env.BASE_URL}videos/hero.mp4`;

interface HeroStat {
  value: string;
  label: string;
}

interface HowItWorksStep {
  title: string;
  description: string;
  icon: ReactElement;
}

const heroStats: HeroStat[] = [
  { value: String(CLASS_CATEGORIES.length), label: 'Class styles' },
  { value: '3', label: 'Levels' },
  { value: '7', label: 'Days a week' },
];

const howItWorksSteps: HowItWorksStep[] = [
  {
    title: 'Browse',
    description: 'Search by style, level or day and find a class that fits your week.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
    ),
  },
  {
    title: 'Book',
    description: 'Reserve your spot in a few taps and change your plans any time.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    title: 'Attend',
    description: 'Turn up, work hard and enjoy the feeling afterwards.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
  },
];

function HomePage() {
  useScrollToSection();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        {/* muted + playsInline are required for autoplay to work in browsers */}
        <video
          className="hero-video"
          src={HERO_VIDEO_SOURCE}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="hero-overlay" />

        <div className="container hero-inner">
          <span className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Classes for every level
          </span>

          <h1 id="hero-title" className="hero-title">
            Find your class.{' '}
            <span className="hero-title-accent">Book your fitness.</span>
          </h1>

          <p className="hero-text">
            Discover energising classes, reserve your spot in seconds and keep every booking in one
            place.
          </p>

          <div className="hero-actions">
            <Link to="/classes" className="btn btn-accent btn-lg">
              Browse classes
            </Link>
            <Link to="/login" className="btn btn-ghost-light btn-lg">
              Join FitSpace
            </Link>
          </div>

          <dl className="hero-stats">
            {heroStats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <dd className="hero-stat-value">{stat.value}</dd>
                <dt className="hero-stat-label">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section container" aria-labelledby="categories-title">
        <div className="section-heading">
          <span className="section-eyebrow">Explore</span>
          <h2 id="categories-title" className="section-title">
            Pick your style
          </h2>
          <p className="section-subtitle">
            From calm to full throttle, there is a class here for the way you want to move.
          </p>
        </div>

        <div className="category-grid">
          {CLASS_CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={`/classes?category=${category.name}`}
              className="category-tile"
              aria-label={`Browse ${category.name} classes`}
            >
              <img
                src={category.image}
                alt={category.imageAlt}
                className="category-tile-image"
                loading="lazy"
              />
              <span className="category-tile-overlay" aria-hidden="true" />
              <span className="category-tile-body">
                <span className="category-tile-name">{category.name}</span>
                <span className="category-tile-tagline">{category.tagline}</span>
              </span>
              <span className="category-tile-arrow" aria-hidden="true">
                <MdArrowForward />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section steps-section" aria-labelledby="steps-title">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">How it works</span>
            <h2 id="steps-title" className="section-title">
              Three steps from couch to class
            </h2>
          </div>

          <div className="steps-grid">
            {howItWorksSteps.map((step, index) => (
              <article key={step.title} className="step-card">
                <span className="step-card-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <div className="step-card-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

export default HomePage;