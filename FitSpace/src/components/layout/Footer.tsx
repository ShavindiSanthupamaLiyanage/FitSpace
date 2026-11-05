import { Link } from 'react-router-dom';
import { MdOutlineAccessTime } from 'react-icons/md';
import { CONTACT_DETAILS, SOCIAL_LINKS, type ContactDetail } from '../../constants/siteInfo';
import footerLogo from '../../assets/logo-white-compact.png';
import '../../styles/footer.css';

interface FooterLink {
  label: string;
  to: string;
  scrollTo?: string; // section id to scroll to once the page opens
}

const quickLinks: FooterLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Explore Classes', to: '/classes' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/', scrollTo: 'contact' },
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

const footerContactItems: ContactDetail[] = [
  ...CONTACT_DETAILS,
  { label: 'Opening hours', text: 'Mon – Sun: 6:00 am – 10:00 pm', Icon: MdOutlineAccessTime },
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
              {SOCIAL_LINKS.map(({ name, label, url, Icon }) => (
                <li key={name}>
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
                <li key={link.label}>
                  <Link
                    to={link.to}
                    state={link.scrollTo ? { scrollTo: link.scrollTo } : undefined}
                    className="footer-link"
                  >
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
                <li key={link.label}>
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
              {footerContactItems.map(({ label, Icon, text, href }) => (
                <li key={label} className="footer-contact-item">
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
          <p className="footer-copyright">© {currentYear} FitSpace. All rights reserved.</p>
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