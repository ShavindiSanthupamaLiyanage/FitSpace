import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { MdOutlineEmail, MdOutlineLocationOn, MdOutlinePhone } from 'react-icons/md';

export interface SocialLink {
  name: string;
  label: string; // used as the accessible name of the link
  url: string;
  Icon: IconType;
}

export interface ContactDetail {
  label: string;
  text: string;
  href?: string;
  Icon: IconType;
}

// Placeholder addresses: replace them with the real FitSpace pages
export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', label: 'FitSpace on Facebook', url: 'https://www.facebook.com/', Icon: FaFacebookF },
  { name: 'Instagram', label: 'FitSpace on Instagram', url: 'https://www.instagram.com/', Icon: FaInstagram },
  { name: 'YouTube', label: 'FitSpace on YouTube', url: 'https://www.youtube.com/', Icon: FaYoutube },
  { name: 'TikTok', label: 'FitSpace on TikTok', url: 'https://www.tiktok.com/', Icon: FaTiktok },
];

export const CONTACT_DETAILS: ContactDetail[] = [
  { label: 'Email', text: 'info@fitspace.com', href: 'mailto:info@fitspace.com', Icon: MdOutlineEmail },
  { label: 'Phone', text: '+94 11 234 5678', href: 'tel:+94112345678', Icon: MdOutlinePhone },
  { label: 'Address', text: 'Colombo 03, Sri Lanka', Icon: MdOutlineLocationOn },
];