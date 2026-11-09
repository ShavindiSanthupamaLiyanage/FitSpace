import { useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MdClose, MdOutlineAddCircleOutline, MdOutlineEdit } from 'react-icons/md';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import FormTextarea from '../common/FormTextArea';
import { CLASS_CATEGORIES } from '../../constants/classCategories';
import { CLASS_LEVELS, CLASS_ROOMS } from '../../constants/classOptions';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import { createClass, updateClass } from '../../services/adminClassService';
import { useToastStore } from '../../store/toastStore';
import { parseClassCategory, parseClassLevel } from '../../utils/classHelpers';
import {
  formatDate,
  formatPrice,
  formatTimeRange,
  getIsoDateFromToday,
} from '../../utils/formatters';
import {
  validateCapacity,
  validateClassDate,
  validateClassTime,
  validateClassTitle,
  validateDescription,
  validateDuration,
  validatePrice,
} from '../../utils/validators';
import type { ClassInput, FitnessClass, Instructor, SelectOption } from '../../types';
import '../../styles/dialog.css';
import '../../styles/manage-classes.css';

interface ClassFormModalProps {
  classToEdit: FitnessClass | null; // null means "create a new class"
  instructors: Instructor[]; // loaded from instructors.json by the page
  onClose: () => void;
  onSaved: () => void; // lets the page reload the list
}

// Every field is kept as text while typing, then converted to numbers on save
interface ClassFormValues {
  title: string;
  category: string;
  level: string;
  instructor: string;
  room: string;
  date: string;
  startTime: string;
  durationMins: string;
  capacity: string;
  price: string;
  description: string;
}

type ClassFormField = keyof ClassFormValues;

const categoryOptions: SelectOption[] = CLASS_CATEGORIES.map((category) => ({
  value: category.name,
  label: category.name,
}));
const levelOptions: SelectOption[] = CLASS_LEVELS.map((level) => ({ value: level, label: level }));
const roomOptions: SelectOption[] = CLASS_ROOMS.map((room) => ({ value: room, label: room }));

const getInitialValues = (
  classToEdit: FitnessClass | null,
  instructorOptions: SelectOption[],
): ClassFormValues => {
  if (classToEdit) {
    return {
      title: classToEdit.title,
      category: classToEdit.category,
      level: classToEdit.level,
      instructor: classToEdit.instructor,
      room: classToEdit.room,
      date: classToEdit.date,
      startTime: classToEdit.startTime,
      durationMins: String(classToEdit.durationMins),
      capacity: String(classToEdit.capacity),
      price: String(classToEdit.price),
      description: classToEdit.description,
    };
  }
  return {
    title: '',
    category: categoryOptions[0].value,
    level: levelOptions[0].value,
    instructor: instructorOptions[0].value,
    room: roomOptions[0].value,
    date: '',
    startTime: '',
    durationMins: '60',
    capacity: '20',
    price: '',
    description: '',
  };
};

const toClassInput = (values: ClassFormValues): ClassInput => ({
  title: values.title.trim(),
  category: parseClassCategory(values.category),
  level: parseClassLevel(values.level),
  instructor: values.instructor,
  room: values.room,
  date: values.date,
  startTime: values.startTime,
  durationMins: Number(values.durationMins),
  capacity: Number(values.capacity),
  price: Number(values.price),
  description: values.description.trim(),
});

// Render this with key={class id or "new"} so the form starts fresh every time it opens
function ClassFormModal({ classToEdit, instructors, onClose, onSaved }: ClassFormModalProps) {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const instructorOptions: SelectOption[] = instructors.map((instructor) => ({
    value: instructor.name,
    label: `${instructor.name} (${instructor.specialty})`,
  }));

  const isEditing = classToEdit !== null;
  const bookedSpots = classToEdit ? classToEdit.capacity - classToEdit.spotsLeft : 0;

  const [values, setValues] = useState<ClassFormValues>(() =>
    getInitialValues(classToEdit, instructorOptions),
  );
  const [touched, setTouched] = useState<Partial<Record<ClassFormField, boolean>>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useDialogBehavior({ open: true, dialogRef, onClose, canClose: !saving });

  const errors: Partial<Record<ClassFormField, string>> = {
    title: validateClassTitle(values.title),
    date: validateClassDate(values.date),
    startTime: validateClassTime(values.startTime, values.date),
    durationMins: validateDuration(values.durationMins),
    capacity: validateCapacity(values.capacity, bookedSpots),
    price: validatePrice(values.price),
    description: validateDescription(values.description),
  };
  const isValid = Object.values(errors).every((message) => message === '');

  const fieldError = (field: ClassFormField): string => (touched[field] ? (errors[field] ?? '') : '');

  // Everything a field needs: its value, how it changes, and when it counts as "touched"
  const bindField = (field: ClassFormField) => ({
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((previous) => ({ ...previous, [field]: event.target.value })),
    onBlur: () => setTouched((previous) => ({ ...previous, [field]: true })),
  });

  // Step 1: the form is valid, so ask the admin to confirm
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isValid) setConfirmOpen(true);
  };

  // Step 2: the admin confirmed, so save
  const handleConfirm = async () => {
    setConfirmOpen(false);
    setSaving(true);
    setFormError('');

    try {
      const input = toClassInput(values);

      if (classToEdit) {
        const updated = await updateClass(classToEdit.id, input);
        showToast('success', 'Class updated', {
          description: `${updated.title} · ${formatDate(updated.date, 'short')}`,
        });
      } else {
        const created = await createClass(input);
        showToast('success', 'Class published', {
          description: `${created.title} · ${formatDate(created.date, 'short')}`,
          action: { label: 'View class', onClick: () => navigate(`/classes/${created.id}`) },
        });
      }

      onSaved();
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <>
      {createPortal(
        <div className="dialog-backdrop">
          <div
            ref={dialogRef}
            className="dialog dialog-wide"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <form className="dialog-form" onSubmit={handleSubmit} noValidate>
              <div className="dialog-header">
                <h2 id={titleId} className="dialog-title-large">
                  {isEditing ? 'Edit Class' : 'Add New Class'}
                </h2>
                <button
                  type="button"
                  className="dialog-close"
                  aria-label="Close dialog"
                  disabled={saving}
                  onClick={onClose}
                >
                  <MdClose aria-hidden="true" />
                </button>
              </div>

              <div className="dialog-scroll">
                {formError && (
                  <p className="form-alert" role="alert">
                    {formError}
                  </p>
                )}

                <div className="class-form-grid">
                  <div className="class-form-wide">
                    <FormInput
                      id="class-title"
                      label="Class name"
                      placeholder="e.g. Advanced Vinyasa"
                      autoComplete="off"
                      data-autofocus
                      error={fieldError('title')}
                      {...bindField('title')}
                    />
                  </div>

                  <FormSelect id="class-category" label="Category" options={categoryOptions} {...bindField('category')} />
                  <FormSelect id="class-level" label="Level" options={levelOptions} {...bindField('level')} />
                  <FormSelect id="class-instructor" label="Instructor" options={instructorOptions} {...bindField('instructor')} />
                  <FormSelect id="class-room" label="Room" options={roomOptions} {...bindField('room')} />

                  <FormInput
                    id="class-date"
                    label="Date"
                    type="date"
                    min={getIsoDateFromToday(0)}
                    error={fieldError('date')}
                    {...bindField('date')}
                  />
                  <FormInput
                    id="class-time"
                    label="Start time"
                    type="time"
                    error={fieldError('startTime')}
                    {...bindField('startTime')}
                  />

                  <div className="class-form-third">
                    <FormInput
                      id="class-duration"
                      label="Duration (mins)"
                      type="number"
                      inputMode="numeric"
                      min={15}
                      max={180}
                      step={5}
                      placeholder="60"
                      error={fieldError('durationMins')}
                      {...bindField('durationMins')}
                    />
                  </div>
                  <div className="class-form-third">
                    <FormInput
                      id="class-capacity"
                      label="Max capacity"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={100}
                      placeholder="20"
                      error={fieldError('capacity')}
                      {...bindField('capacity')}
                    />
                  </div>
                  <div className="class-form-third">
                    <FormInput
                      id="class-price"
                      label="Class price (Rs.)"
                      type="number"
                      inputMode="decimal"
                      min={1}
                      max={500}
                      step={0.5}
                      placeholder="25.00"
                      error={fieldError('price')}
                      {...bindField('price')}
                    />
                  </div>

                  <div className="class-form-wide">
                    <FormTextarea
                      id="class-description"
                      label="Description"
                      rows={4}
                      placeholder="What will members do in this class?"
                      error={fieldError('description')}
                      {...bindField('description')}
                    />
                  </div>
                </div>
              </div>

              <div className="dialog-footer">
                <Button variant="light" disabled={saving} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving} loadingText="Saving..." disabled={!isValid}>
                  {isEditing ? 'Save Changes' : 'Create Class'}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}

      <ConfirmDialog
        open={confirmOpen}
        Icon={isEditing ? MdOutlineEdit : MdOutlineAddCircleOutline}
        title={isEditing ? 'Save your changes?' : 'Publish this class?'}
        message={
          isEditing
            ? 'Members who booked this class will see the updated details.'
            : 'It will appear on Explore Classes straight away.'
        }
        confirmText={isEditing ? 'Save changes' : 'Publish class'}
        cancelText="Go back"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      >
        {confirmOpen && (
          <div className="dialog-detail">
            <div>
              <p className="dialog-detail-title">{values.title.trim()}</p>
              <p className="dialog-detail-text">
                {formatDate(values.date, 'short')} ·{' '}
                {formatTimeRange(values.startTime, Number(values.durationMins))}
              </p>
            </div>
            <span className="dialog-detail-badge">{formatPrice(Number(values.price), true)}</span>
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}

export default ClassFormModal;