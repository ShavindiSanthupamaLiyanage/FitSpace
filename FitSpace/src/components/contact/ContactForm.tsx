import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextArea';
import { sendContactMessage } from '../../services/contactService';
import { useToastStore } from '../../store/toastStore';
import {
  validateEmail,
  validateMessage,
  validateName,
  validateSubject,
} from '../../utils/validators';

type FieldName = 'name' | 'email' | 'subject' | 'message';

const emptyValues: Record<FieldName, string> = { name: '', email: '', subject: '', message: '' };
const untouchedFields: Record<FieldName, boolean> = {
  name: false,
  email: false,
  subject: false,
  message: false,
};

function ContactForm() {
  const showToast = useToastStore((state) => state.showToast);

  const [values, setValues] = useState(emptyValues);
  const [touched, setTouched] = useState(untouchedFields);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const errors: Record<FieldName, string> = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    subject: validateSubject(values.subject),
    message: validateMessage(values.message),
  };
  const isValid = Object.values(errors).every((message) => message === '');

  const handleChange = (field: FieldName, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const handleBlur = (field: FieldName) =>
    setTouched((previous) => ({ ...previous, [field]: true }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setFormError('');
    try {
      await sendContactMessage(values);
      showToast('success', 'Message sent', { description: 'We will get back to you soon.' });
      setValues(emptyValues);
      setTouched(untouchedFields);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <p className="form-alert" role="alert">
          {formError}
        </p>
      )}

      <FormInput
        id="contact-name"
        label="Full Name"
        placeholder="Enter your full name"
        autoComplete="name"
        value={values.name}
        onChange={(event) => handleChange('name', event.target.value)}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : ''}
      />
      <FormInput
        id="contact-email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => handleChange('email', event.target.value)}
        onBlur={() => handleBlur('email')}
        error={touched.email ? errors.email : ''}
      />
      <FormInput
        id="contact-subject"
        label="Subject"
        placeholder="What is this about?"
        value={values.subject}
        onChange={(event) => handleChange('subject', event.target.value)}
        onBlur={() => handleBlur('subject')}
        error={touched.subject ? errors.subject : ''}
      />
      <FormTextarea
        id="contact-message"
        label="Message"
        placeholder="Tell us more about your inquiry"
        rows={5}
        value={values.message}
        onChange={(event) => handleChange('message', event.target.value)}
        onBlur={() => handleBlur('message')}
        error={touched.message ? errors.message : ''}
      />

      <Button type="submit" loading={submitting} disabled={!isValid} className="btn-block">
        Send Message
      </Button>
    </form>
  );
}

export default ContactForm;