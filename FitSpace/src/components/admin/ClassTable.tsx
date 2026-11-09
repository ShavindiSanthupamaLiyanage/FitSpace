import { MdOutlineDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import Avatar from '../common/Avatar';
import IconButton from '../common/IconButton';
import ProgressBar from '../common/ProgressBar';
import { getCategoryInfo } from '../../constants/classCategories';
import { getFillPercent } from '../../utils/classHelpers';
import {
  formatClassCode,
  formatDate,
  formatPrice,
  formatTimeRange,
} from '../../utils/formatters';
import type { FitnessClass } from '../../types';
import '../../styles/manage-classes.css';

interface ClassTableProps {
  classes: FitnessClass[];
  onEdit: (fitnessClass: FitnessClass) => void;
  onDelete: (fitnessClass: FitnessClass) => void;
}

// The role attributes keep the table readable by screen readers when the CSS
// turns the rows into cards on small screens
function ClassTable({ classes, onEdit, onDelete }: ClassTableProps) {
  return (
    <table className="class-table" role="table">
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">Class</th>
          <th role="columnheader" scope="col">Category</th>
          <th role="columnheader" scope="col">Instructor</th>
          <th role="columnheader" scope="col">Schedule</th>
          <th role="columnheader" scope="col">Capacity</th>
          <th role="columnheader" scope="col">Price</th>
          <th role="columnheader" scope="col">Actions</th>
        </tr>
      </thead>

      <tbody role="rowgroup">
        {classes.map((fitnessClass) => {
          const category = getCategoryInfo(fitnessClass.category);
          const bookedSpots = fitnessClass.capacity - fitnessClass.spotsLeft;

          return (
            <tr key={fitnessClass.id} role="row">
              <td role="cell" className="class-table-main-cell">
                <div className="class-cell">
                  {/* Decorative: the title next to it already names the class */}
                  {category && <img src={category.image} alt="" className="class-cell-image" loading="lazy" />}
                  <div>
                    <p className="class-cell-title">{fitnessClass.title}</p>
                    <p className="class-cell-code">ID: {formatClassCode(fitnessClass.id)}</p>
                  </div>
                </div>
              </td>

              <td role="cell" data-label="Category">
                <span className={`category-badge category-badge-${fitnessClass.category.toLowerCase()}`}>
                  {fitnessClass.category}
                </span>
              </td>

              <td role="cell" data-label="Instructor">
                <div className="instructor-cell">
                  <Avatar name={fitnessClass.instructor} />
                  {fitnessClass.instructor}
                </div>
              </td>

              <td role="cell" data-label="Schedule">
                <div className="schedule-cell">
                  <p className="schedule-date">{formatDate(fitnessClass.date, 'short')}</p>
                  <p className="schedule-time">
                    {formatTimeRange(fitnessClass.startTime, fitnessClass.durationMins)}
                  </p>
                </div>
              </td>

              <td role="cell" data-label="Capacity">
                <div className="capacity-cell">
                  <div className="capacity-cell-text">
                    <span>
                      {bookedSpots}/{fitnessClass.capacity}
                    </span>
                    <span className="capacity-cell-percent">{getFillPercent(fitnessClass)}%</span>
                  </div>
                  <ProgressBar
                    value={bookedSpots}
                    max={fitnessClass.capacity}
                    label={`${fitnessClass.title}: ${bookedSpots} of ${fitnessClass.capacity} spots booked`}
                  />
                </div>
              </td>

              <td role="cell" data-label="Price" className="class-table-price">
                {formatPrice(fitnessClass.price)}
              </td>

              <td role="cell" data-label="Actions">
                <div className="class-table-actions">
                  <IconButton
                    Icon={MdOutlineEdit}
                    label={`Edit ${fitnessClass.title}`}
                    onClick={() => onEdit(fitnessClass)}
                  />
                  <IconButton
                    Icon={MdOutlineDeleteOutline}
                    tone="danger"
                    label={`Delete ${fitnessClass.title}`}
                    onClick={() => onDelete(fitnessClass)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ClassTable;