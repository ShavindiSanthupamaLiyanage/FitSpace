import type { IconType } from 'react-icons';
import {
  MdOutlineBolt,
  MdOutlineConstruction,
  MdOutlineEmojiEvents,
  MdOutlineSmartphone,
} from 'react-icons/md';
import ProgressBar from './common/ProgressBar';
import underConstructionImage from '../assets/under_construction.png';
import '../styles/under-construction.css';

interface UnderConstructionProps {
  title: string; // the page that is not ready yet, e.g. "Privacy Policy"
  description?: string;
}

interface LaunchHighlight {
  label: string;
  Icon: IconType;
}

const BUILD_PROGRESS_PERCENT = 75;

const LAUNCH_HIGHLIGHTS: LaunchHighlight[] = [
  { label: 'Faster load', Icon: MdOutlineBolt },
  { label: 'New UI', Icon: MdOutlineSmartphone },
  { label: 'Challenges', Icon: MdOutlineEmojiEvents },
];

function UnderConstruction({
  title,
  description = "We're hitting the heavy weights to bring you something extraordinary. This section is currently warming up and will be ready for your workout soon!",
}: UnderConstructionProps) {
  return (
    <section className="under-construction" aria-labelledby="under-construction-title">
      <div className="container">
        <div className="uc-grid">
          <div className="uc-visual">
            <figure className="uc-photo">
              <img
                src={underConstructionImage}
                alt="Athlete in a black vest bending over a loaded barbell in a modern gym"
                className="uc-photo-image"
              />
              <div className="uc-photo-overlay" />
              <figcaption className="uc-photo-caption">
                <div className="uc-photo-heading">
                  <span className="uc-photo-icon" aria-hidden="true">
                    <MdOutlineConstruction />
                  </span>
                  <div>
                    <p className="uc-photo-label">Current set</p>
                    <p className="uc-photo-title">Building muscle</p>
                  </div>
                </div>
                <span className="uc-photo-pill">Optimising performance</span>
              </figcaption>
            </figure>
            {/* <LaunchCountdown startSeconds={COUNTDOWN_START_SECONDS} /> */}
          </div>

          <div className="uc-content">
            <p className="uc-eyebrow">
              <span className="uc-eyebrow-dot" aria-hidden="true" />
              Powering up · {title}
            </p>

            <h1 id="under-construction-title" className="uc-title">
              <span className="visually-hidden">{title}: </span>
              Currently in <span className="uc-title-accent">training.</span>
            </h1>

            <p className="uc-text">{description}</p>

            <section className="uc-progress-card" aria-label="Build progress">
              <div className="uc-progress-header">
                <span className="uc-progress-label">Warming up</span>
                <span className="uc-progress-percent">{BUILD_PROGRESS_PERCENT}% complete</span>
              </div>
              <ProgressBar
                value={BUILD_PROGRESS_PERCENT}
                max={100}
                label={`${title} is ${BUILD_PROGRESS_PERCENT}% built`}
                tone="accent"
              />
              <p className="uc-progress-quote">
                "The only bad workout is the one that didn&apos;t happen. We&apos;re ensuring
                this one is legendary"
              </p>
            </section>

            <ul className="uc-highlights">
              {LAUNCH_HIGHLIGHTS.map(({ label, Icon }) => (
                <li key={label} className="uc-highlight">
                  <Icon className="uc-highlight-icon" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UnderConstruction;