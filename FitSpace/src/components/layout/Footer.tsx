import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import {
  MdOutlineAccessTime,
  MdOutlineEmail,
  MdOutlineLocationOn,
  MdOutlinePhone,
} from 'react-icons/md';
import footerLogo from '../../assets/logo-white-compact.png';
import '../../styles/footer.css';

interface SocialLink {
  label: string;
  url: string;
  Icon: IconType;
}

interface FooterLink {
  label: string;
  to: string;
}

interface ContactItem {
  Icon: IconType;
  text: string;
  href?: string;
}

// Replace these placeholder addresses with your real pages
const socialLinks: SocialLink[] = [
  { label: 'FitSpace on Facebook', url: 'https://www.facebook.com/', Icon: FaFacebookF },
  { label: 'FitSpace on Instagram', url: 'https://www.instagram.com/', Icon: FaInstagram },
  { label: 'FitSpace on YouTube', url: 'https://www.youtube.com/', Icon: FaYoutube },
  { label: 'FitSpace on TikTok', url: 'https://www.tiktok.com/', Icon: FaTiktok },
];

const quickLinks: FooterLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Explore Classes', to: '/classes' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

// Cookie Policy and Disclaimer have no route on purpose, so they open the 404 page
const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
  { label: 'Disclaimer', to: '/disclaimer' },
];

const bottomBarLinks: FooterLink[] = [
  { label: 'Privacy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms-of-service' },
  { label: 'Sitemap', to: '/sitemap' },
];

const contactItems: ContactItem[] = [
  { Icon: MdOutlineEmail, text: 'info@fitspace.com', href: 'mailto:hello@fitspace.demo' },
  { Icon: MdOutlinePhone, text: '+94 11 234 5678', href: 'tel:+94112345678' },
  { Icon: MdOutlineLocationOn, text: 'Colombo, Sri Lanka' },
  { Icon: MdOutlineAccessTime, text: 'Mon – Sun: 6:00 am – 10:00 pm' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src={footerLogo} alt="FitSpace" className="footer-logo" />
            <p className="footer-description">
              Find your perfect workout space with FitSpace.
            </p>
            <ul className="footer-social" aria-label="Social media">
              {socialLinks.map(({ label, url, Icon }) => (
                <li key={label}>
                  <a
                    href={url}
                    className="footer-social-link"
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-link-list">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-link-list">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="footer-heading">Get in Touch</h3>
            <ul className="footer-link-list">
              {contactItems.map(({ Icon, text, href }) => (
                <li key={text} className="footer-contact-item">
                  <Icon className="footer-contact-icon" aria-hidden="true" />
                  {href ? (
                    <a href={href} className="footer-link">
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} FitSpace. All rights reserved.
          </p>
          <ul className="footer-bottom-links">
            {bottomBarLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;