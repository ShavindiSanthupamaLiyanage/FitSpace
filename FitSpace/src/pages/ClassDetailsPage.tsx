import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MdCheck, MdOutlinePersonOutline, MdSearchOff, MdStar } from 'react-icons/md';
import BookingPanel from '../components/classes/BookingPanel';
import InstructorCard from '../components/classes/InstructorCard';
import Breadcrumb from '../components/common/Breadcrumb';
import ButtonLink from '../components/common/ButtonLink';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCategoryInfo } from '../constants/classCategories';
import { useAsyncData } from '../hooks/useAsyncData';
import { getClassById } from '../services/classService';
import '../styles/class-details.css';

interface ClassDetailsViewProps {
  classId: number;
}

function ClassDetailsView({ classId }: ClassDetailsViewProps) {
  const fetchClass = useCallback(() => getClassById(classId), [classId]);
  const { state, reload, refresh } = useAsyncData(fetchClass);

  if (state.status === 'loading') {
    return (
      <div className="container">
        <LoadingSpinner label="Loading class details..." />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <ErrorMessage message={state.message} onRetry={reload} />
      </div>
    );
  }

  const fitnessClass = state.data;

  if (fitnessClass === null) {
    return (
      <div className="container">
        <EmptyState
          Icon={MdSearchOff}
          title="Class not found"
          message="This class may have been removed, or the link is incorrect."
        >
          <ButtonLink to="/classes">Browse all classes</ButtonLink>
        </EmptyState>
      </div>
    );
  }

  const category = getCategoryInfo(fitnessClass.category);

  return (
    <div className="container class-details">
      <Breadcrumb items={[{ label: 'Explore Classes', to: '/classes' }, { label: fitnessClass.title }]} />

      <div className="class-details-layout">
        <div className="class-details-main">
          <section className="class-hero">
            {category && (
              <img src={category.image} alt={category.imageAlt} className="class-hero-image" />
            )}
            <div className="class-hero-overlay" />
            <div className="class-hero-content">
              <span className="class-hero-badge">
                {fitnessClass.category} · {fitnessClass.level}
              </span>
              <h1 className="class-hero-title">{fitnessClass.title}</h1>
              <p className="class-hero-meta">
                <span className="class-hero-meta-item">
                  <MdOutlinePersonOutline aria-hidden="true" />
                  {fitnessClass.instructor}
                </span>
                <span className="class-hero-meta-item">
                  <MdStar className="class-hero-star" aria-hidden="true" />
                  {fitnessClass.reviews > 0
                    ? `${fitnessClass.rating} (${fitnessClass.reviews} reviews)`
                    : 'New class'}
                </span>
              </p>
            </div>
          </section>

          <section className="detail-card" aria-labelledby="class-description-title">
            <h2 id="class-description-title" className="detail-card-title">
              Class Description
            </h2>
            <p>{fitnessClass.description}</p>
            <p>
              This {fitnessClass.durationMins}-minute session takes place in {fitnessClass.room} and
              is suited to {fitnessClass.level.toLowerCase()} participants.
            </p>

            {category && (
              <>
                <h3 className="detail-card-subtitle">What to Bring</h3>
                <ul className="bring-list">
                  {category.whatToBring.map((item) => (
                    <li key={item}>
                      <MdCheck className="bring-list-icon" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="detail-card" aria-labelledby="instructor-title">
            <h2 id="instructor-title" className="detail-card-title">
              Instructor
            </h2>
            <InstructorCard
              name={fitnessClass.instructor}
              role={`${fitnessClass.category} Expert | ${fitnessClass.instructorYears}+ Years Experience`}
            />
          </section>
        </div>

        <aside className="class-details-aside">
          <BookingPanel fitnessClass={fitnessClass} onBooked={refresh} />
        </aside>
      </div>
    </div>
  );
}

// Keying by id gives every class a fresh start, so the previous class never flashes on screen
function ClassDetailsPage() {
  const { id } = useParams<{ id: string }>();
  return <ClassDetailsView key={id} classId={Number(id)} />;
}

export default ClassDetailsPage;