import ContactForm from './ContactForm';
import { CONTACT_DETAILS, SOCIAL_LINKS } from '../../constants/siteInfo';
import '../../styles/contact.css';

// id="contact" is what the footer's "Contact Us" link scrolls to
function ContactSection() {
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-title"
      tabIndex={-1}
    >
      <div className="container">
        <div className="contact-heading">
          <h2 id="contact-title" className="section-title">
            Contact Us
          </h2>
          <p className="section-subtitle">Get in touch with us for any questions or support</p>
        </div>

        <div className="contact-layout">
          <div className="contact-form-card">
            <ContactForm />
          </div>

          <div className="contact-side">
            <div className="contact-info-card">
              <h3 className="contact-info-title">Connect With Us</h3>
              <p className="contact-info-text">
                Follow us on social media for class news and updates
              </p>
              <ul className="contact-social-list">
                {SOCIAL_LINKS.map(({ name, label, url, Icon }) => (
                  <li key={name}>
                    <a
                      href={url}
                      className="contact-social-link"
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="contact-icon-badge">
                        <Icon aria-hidden="true" />
                      </span>
                      <span>{name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact-info-card">
              <h3 className="contact-info-title">Other Ways to Reach Us</h3>
              <ul className="contact-detail-list">
                {CONTACT_DETAILS.map(({ label, text, href, Icon }) => (
                  <li key={label} className="contact-detail">
                    <span className="contact-icon-badge contact-icon-badge-square">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <span className="contact-detail-label">{label}</span>
                      {href ? (
                        <a href={href} className="contact-detail-value">
                          {text}
                        </a>
                      ) : (
                        <span className="contact-detail-value">{text}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;