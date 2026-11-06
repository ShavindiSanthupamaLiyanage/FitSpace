import { Link } from 'react-router-dom';
import { MdOutlineAccessTime, MdOutlineCalendarToday, MdOutlineGroups } from 'react-icons/md';
import AvailabilityBadge from './AvailabilityBadge';
import Button from '../common/Button';
import ButtonLink from '../common/ButtonLink';
import { getCategoryInfo } from '../../constants/classCategories';
import { countAttendees } from '../../utils/classHelpers';
import { formatDate, formatPrice, formatTimeRange } from '../../utils/formatters';
import type { FitnessClass } from '../../types';
import '../../styles/class-card.css';

interface ClassCardProps {
  fitnessClass: FitnessClass;
}

function ClassCard({ fitnessClass }: ClassCardProps) {
  const category = getCategoryInfo(fitnessClass.category);
  const isFull = fitnessClass.spotsLeft <= 0;
  const detailsPath = `/classes/${fitnessClass.id}`;

  return (
    <article className="class-card">
      <div className="class-card-media">
        {category && (
          <img
            src={category.image}
            alt={category.imageAlt}
            className="class-card-image"
            loading="lazy"
          />
        )}
        <AvailabilityBadge spotsLeft={fitnessClass.spotsLeft} />
      </div>

      <div className="class-card-body">
        <div className="class-card-heading">
          <h3 className="class-card-title">
            <Link to={detailsPath} className="class-card-title-link">
              {fitnessClass.title}
            </Link>
          </h3>
          <span className="class-card-price">{formatPrice(fitnessClass.price)}</span>
        </div>

        <p className="class-card-description">{fitnessClass.description}</p>

        <ul className="class-card-meta">
          <li>
            <MdOutlineCalendarToday className="class-card-meta-icon" aria-hidden="true" />
            {formatDate(fitnessClass.date)}
          </li>
          <li>
            <MdOutlineAccessTime className="class-card-meta-icon" aria-hidden="true" />
            {formatTimeRange(fitnessClass.startTime, fitnessClass.durationMins)}
          </li>
          <li>
            <MdOutlineGroups className="class-card-meta-icon" aria-hidden="true" />
            {countAttendees(fitnessClass)}/{fitnessClass.capacity} members
          </li>
        </ul>

        <div className="class-card-actions">
          {isFull ? (
            <Button variant="outline" className="btn-block" disabled>
              Fully Booked
            </Button>
          ) : (
            <ButtonLink
              to={detailsPath}
              variant="outline"
              className="btn-block"
              aria-label={`Book Class: ${fitnessClass.title}`}
            >
              Book Class
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}

export default ClassCard;