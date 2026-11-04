// import { Link } from 'react-router-dom';

// const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/hero.mp4`;

// const steps = [
//   { title: 'Browse', text: 'Explore Yoga, HIIT, Spin, Pilates, Boxing and more.' },
//   { title: 'Book', text: 'Pick a time that suits you and reserve your spot in seconds.' },
//   { title: 'Attend', text: 'Show up, sweat it out and enjoy your fitness journey.' },
// ];

// function HomePage() {
//   return (
//     <>
//       <section className="hero" aria-labelledby="hero-title">
//         {/* Background video: muted + playsInline are required for autoplay to work */}
//         <video
//           className="hero-video"
//           src={VIDEO_SRC}
//           autoPlay
//           muted
//           loop
//           playsInline
//           aria-hidden="true"
//         />
//         <div className="hero-overlay" />

//         <div className="container">
//           <div className="hero-content">
//             <span className="hero-eyebrow">Classes for every level</span>
//             <h1 id="hero-title">
//               Find Your Class. <span>Book Your Fitness.</span>
//             </h1>
//             <p>
//               Discover energising classes, reserve your spot in a few taps and manage all your
//               bookings in one place.
//             </p>
//             <div className="hero-actions">
//               <Link to="/classes" className="btn btn-primary">
//                 Browse Classes
//               </Link>
//               <Link to="/login" className="btn btn-light">
//                 Join Now
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="section container" aria-labelledby="how-title">
//         <h2 id="how-title" className="section-title">
//           How it works
//         </h2>
//         <p className="section-subtitle">Three simple steps from couch to class.</p>
//         <div className="steps-grid">
//           {steps.map((step, index) => (
//             <article key={step.title} className="step-card">
//               <div className="step-number" aria-hidden="true">
//                 {index + 1}
//               </div>
//               <h3>{step.title}</h3>
//               <p>{step.text}</p>
//             </article>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// }

// export default HomePage;




import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

const HERO_VIDEO_SOURCE = `${import.meta.env.BASE_URL}videos/hero.mp4`;

interface HeroStat {
  value: string;
  label: string;
}

interface ClassCategory {
  name: string;
  tagline: string;
  styleClass: string;
}

interface HowItWorksStep {
  title: string;
  description: string;
  icon: ReactElement;
}

const heroStats: HeroStat[] = [
  { value: '6', label: 'Class styles' },
  { value: '3', label: 'Levels' },
  { value: '7', label: 'Days a week' },
];

const classCategories: ClassCategory[] = [
  { name: 'Yoga', tagline: 'Flow, stretch and breathe', styleClass: 'category-tile-yoga' },
  { name: 'HIIT', tagline: 'Short, sharp and sweaty', styleClass: 'category-tile-hiit' },
  { name: 'Spin', tagline: 'Ride to the beat', styleClass: 'category-tile-spin' },
  { name: 'Pilates', tagline: 'Strong core, steady mind', styleClass: 'category-tile-pilates' },
  { name: 'Boxing', tagline: 'Punch out your stress', styleClass: 'category-tile-boxing' },
  { name: 'Zumba', tagline: 'Dance your way fit', styleClass: 'category-tile-zumba' },
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
          {classCategories.map((category) => (
            <Link
              key={category.name}
              to={`/classes?category=${category.name}`}
              className={`category-tile ${category.styleClass}`}
            >
              <span className="category-tile-arrow" aria-hidden="true">
                →
              </span>
              <span className="category-tile-name">{category.name}</span>
              <span className="category-tile-tagline">{category.tagline}</span>
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

      <section className="section container" aria-labelledby="cta-title">
        <div className="cta-band">
          <h2 id="cta-title">Your first class is one tap away.</h2>
          <p>Create a free account and book your spot today.</p>
          <Link to="/login" className="btn btn-accent btn-lg">
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;