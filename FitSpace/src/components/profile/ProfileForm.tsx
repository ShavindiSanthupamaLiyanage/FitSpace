import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { MdOutlineSave } from 'react-icons/md';
import ProfileCompletionCard from './ProfileCompletionCard';
import ProfileHeader from './ProfileHeader';
import Button from '../common/Button';
import ChipToggleGroup from '../common/ChipToggleGroup';
import ConfirmDialog from '../common/ConfirmDialog';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import { CLASS_CATEGORIES } from '../../constants/classCategories';
import { GENDER_OPTIONS } from '../../constants/profileOptions';
import { saveProfile } from '../../services/profileService';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { readFileAsDataUrl, validateAvatarFile } from '../../utils/files';
import { getIsoDateFromToday } from '../../utils/formatters';
import {
  areProfileValuesEqual,
  calculateProfileCompletion,
  normaliseProfileValues,
  profileToFormValues,
} from '../../utils/profileHelpers';
import {
  validateDateOfBirth,
  validateLocation,
  validateName,
  validatePhone,
} from '../../utils/validators';
import type { AuthUser, ClassCategoryName, ProfileFormValues, UserProfile } from '../../types';
import '../../styles/profile.css';

interface ProfileFormProps {
  user: AuthUser;
  profile: UserProfile;
}

type TextField = 'name' | 'phone' | 'gender' | 'dateOfBirth' | 'location';

const interestOptions: ClassCategoryName[] = CLASS_CATEGORIES.map((category) => category.name);

function ProfileForm({ user, profile }: ProfileFormProps) {
  const showToast = useToastStore((state) => state.showToast);
  const updateUserName = useAuthStore((state) => state.updateUserName);

  // "saved" is what the member last saved, "values" is what is on screen right now
  const [savedValues, setSavedValues] = useState<ProfileFormValues>(() =>
    profileToFormValues(user.name, profile),
  );
  const [values, setValues] = useState<ProfileFormValues>(savedValues);
  const [touched, setTouched] = useState<Partial<Record<TextField, boolean>>>({});
  const [photoError, setPhotoError] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const errors = {
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    dateOfBirth: validateDateOfBirth(values.dateOfBirth),
    location: validateLocation(values.location),
  };
  const isValid = Object.values(errors).every((message) => message === '');
  const isDirty = !areProfileValuesEqual(normaliseProfileValues(values), savedValues);
  const completionPercent = calculateProfileCompletion(savedValues, user.email);

  const fieldError = (field: keyof typeof errors): string => (touched[field] ? errors[field] : '');

  // Everything a field needs: its value, how it changes, and when it counts as "touched"
  const bindField = (field: TextField) => ({
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((previous) => ({ ...previous, [field]: event.target.value })),
    onBlur: () => setTouched((previous) => ({ ...previous, [field]: true })),
  });

  const handleInterestToggle = (interest: ClassCategoryName) =>
    setValues((previous) => ({
      ...previous,
      interests: previous.interests.includes(interest)
        ? previous.interests.filter((current) => current !== interest)
        : [...previous.interests, interest],
    }));

  const handlePhotoSelected = async (file: File) => {
    const problem = validateAvatarFile(file);
    if (problem) {
      setPhotoError(problem);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setValues((previous) => ({ ...previous, avatarUrl: dataUrl }));
      setPhotoError('');
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Could not read the image.');
    }
  };

  const handlePhotoRemoved = () => {
    setValues((previous) => ({ ...previous, avatarUrl: '' }));
    setPhotoError('');
  };

  // Step 1: the form is valid and changed, so ask the member to confirm
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isValid && isDirty) setSaveDialogOpen(true);
  };

  // Step 2: the member confirmed, so save
  const handleSave = async () => {
    setSaveDialogOpen(false);
    setSaving(true);
    setFormError('');

    const cleanValues = normaliseProfileValues(values);
    try {
      await saveProfile(user.id, cleanValues);
      updateUserName(cleanValues.name); // the signed-in name changes everywhere
      setSavedValues(cleanValues);
      setValues(cleanValues);
      showToast('success', 'Profile updated', { description: 'Your changes have been saved.' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setValues(savedValues);
    setTouched({});
    setPhotoError('');
    setFormError('');
    setDiscardDialogOpen(false);
  };

  return (
    <>
      <ProfileCompletionCard percent={completionPercent} />

      <section className="profile-card" aria-label="Profile details">
        <ProfileHeader
          name={savedValues.name}
          email={user.email}
          role={user.role}
          joinedAt={profile.joinedAt}
          avatarUrl={values.avatarUrl}
          photoError={photoError}
          onPhotoSelected={handlePhotoSelected}
          onPhotoRemoved={handlePhotoRemoved}
        />

        <form className="profile-body" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="form-alert" role="alert">
              {formError}
            </p>
          )}

          <div className="profile-section">
            <h2 className="profile-section-title">Basic Information</h2>
            <p className="profile-section-text">Update your name and profile details.</p>

            <div className="profile-form-grid">
              <FormInput
                id="profile-name"
                label="Full name"
                autoComplete="name"
                error={fieldError('name')}
                {...bindField('name')}
              />
              <FormInput
                id="profile-email"
                label="Email address"
                type="email"
                readOnly
                value={user.email}
                hint="You sign in with this email, so it cannot be changed here."
              />
              <FormInput
                id="profile-phone"
                label="Phone number"
                type="tel"
                autoComplete="tel"
                placeholder="+94 77 123 4567"
                error={fieldError('phone')}
                {...bindField('phone')}
              />
              <FormSelect
                id="profile-gender"
                label="Gender"
                options={GENDER_OPTIONS}
                {...bindField('gender')}
              />
              <FormInput
                id="profile-birth-date"
                label="Date of birth"
                type="date"
                max={getIsoDateFromToday(0)}
                autoComplete="bday"
                error={fieldError('dateOfBirth')}
                {...bindField('dateOfBirth')}
              />
              <FormInput
                id="profile-location"
                label="Location"
                autoComplete="address-level2"
                placeholder="e.g. Colombo, Sri Lanka"
                error={fieldError('location')}
                {...bindField('location')}
              />
            </div>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Fitness Interests</h2>
            <p className="profile-section-text">Choose the class styles you enjoy most.</p>
            <ChipToggleGroup
              label="Fitness interests"
              options={interestOptions}
              selected={values.interests}
              onToggle={handleInterestToggle}
            />
          </div>

          <div className="profile-actions">
            <Button
              variant="light"
              disabled={!isDirty || saving}
              onClick={() => setDiscardDialogOpen(true)}
            >
              Discard
            </Button>
            <Button
              type="submit"
              loading={saving}
              loadingText="Saving..."
              disabled={!isDirty || !isValid}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </section>

      <ConfirmDialog
        open={saveDialogOpen}
        Icon={MdOutlineSave}
        title="Save your changes?"
        message="Your profile details will be updated."
        confirmText="Save changes"
        cancelText="Go back"
        onConfirm={handleSave}
        onCancel={() => setSaveDialogOpen(false)}
      />

      <ConfirmDialog
        open={discardDialogOpen}
        tone="warning"
        title="Discard your changes?"
        message="Everything you edited since the last save will be lost."
        confirmText="Discard changes"
        cancelText="Keep editing"
        onConfirm={handleDiscard}
        onCancel={() => setDiscardDialogOpen(false)}
      />
    </>
  );
}

export default ProfileForm;