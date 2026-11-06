import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceBreakdown from './PriceBreakdown';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import { MAX_SPOTS_PER_BOOKING } from '../../constants/bookingSettings';
import { createBooking } from '../../services/bookingService';
import { useToastStore } from '../../store/toastStore';
import { calculateBookingTotals } from '../../utils/bookingPricing';
import { formatDate, formatPrice, formatTimeRange } from '../../utils/formatters';
import { validateEmail, validateName, validateSpots } from '../../utils/validators';
import type { FitnessClass, SelectOption } from '../../types';
import { MdOutlineCalendarToday } from 'react-icons/md';

interface BookingFormProps {
    fitnessClass: FitnessClass;
    initialName: string;
    initialEmail: string;
    onBooked: () => void; // lets the page refresh the spots left
}

type FieldName = 'name' | 'email';

function BookingForm({ fitnessClass, initialName, initialEmail, onBooked }: BookingFormProps) {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    const maxSpots = Math.min(MAX_SPOTS_PER_BOOKING, fitnessClass.spotsLeft);
    const spotOptions: SelectOption[] = Array.from({ length: maxSpots }, (_, index) => ({
        value: String(index + 1),
        label: `${index + 1} ${index === 0 ? 'spot' : 'spots'}`,
    }));

    const [values, setValues] = useState({ name: initialName, email: initialEmail });
    const [touched, setTouched] = useState<Record<FieldName, boolean>>({ name: false, email: false });
    const [spots, setSpots] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const errors = {
        name: validateName(values.name),
        email: validateEmail(values.email),
        spots: validateSpots(spots, maxSpots),
    };
    const isValid = !errors.name && !errors.email && !errors.spots;
    const totals = calculateBookingTotals(fitnessClass.price, spots);

    const handleChange = (field: FieldName, value: string) =>
        setValues((previous) => ({ ...previous, [field]: value }));

    const handleBlur = (field: FieldName) =>
        setTouched((previous) => ({ ...previous, [field]: true }));

    // Step 1: the form is valid, so ask the user to confirm
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (isValid) setConfirmOpen(true);
    };

    // Step 2: the user confirmed, so create the booking
    const handleConfirm = async () => {
        setConfirmOpen(false);
        setSubmitting(true);
        setFormError('');

        try {
            await createBooking({
                classId: fitnessClass.id,
                memberName: values.name.trim(),
                email: values.email.trim(),
                spots,
            });
            showToast('success', 'Booking confirmed', {
                description: `${fitnessClass.title} · ${formatDate(fitnessClass.date)}`,
                action: { label: 'View my bookings', onClick: () => navigate('/my-bookings') },
            });
            setSpots(1);
            onBooked();
        } catch (error) {
            setFormError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const spotsWord = spots === 1 ? 'spot' : 'spots';

    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                {formError && (
                    <p className="form-alert" role="alert">
                        {formError}
                    </p>
                )}

                <FormSelect
                    id="booking-spots"
                    label="Number of spots"
                    options={spotOptions}
                    value={String(spots)}
                    onChange={(event) => setSpots(Number(event.target.value))}
                    error={errors.spots}
                />

                <PriceBreakdown pricePerSpot={fitnessClass.price} spots={spots} />

                <FormInput
                    id="booking-name"
                    label="Full Name"
                    placeholder="John Doe"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={touched.name ? errors.name : ''}
                />
                <FormInput
                    id="booking-email"
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={touched.email ? errors.email : ''}
                />

                <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="btn-block"
                    loading={submitting}
                    disabled={!isValid}
                >
                    Confirm Booking
                </Button>
            </form>

            <ConfirmDialog
                open={confirmOpen}
                Icon={MdOutlineCalendarToday}
                title="Confirm your booking"
                message={`You are about to reserve ${spots} ${spotsWord}. You can manage it later from My Bookings.`}
                confirmText="Confirm booking"
                cancelText="Go back"
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
            >
                <div className="dialog-detail">
                    <div>
                        <p className="dialog-detail-title">{fitnessClass.title}</p>
                        <p className="dialog-detail-text">
                            {formatDate(fitnessClass.date, 'short')} · {formatTimeRange(fitnessClass.startTime, fitnessClass.durationMins)}
                        </p>
                    </div>
                    <span className="dialog-detail-badge">{formatPrice(totals.total, true)}</span>
                </div>
            </ConfirmDialog>
        </>
    );
}

export default BookingForm;