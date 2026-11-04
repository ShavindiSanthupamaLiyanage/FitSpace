import showcaseImage from '../../assets/login.png';

interface AuthShowcaseProps {
  firstLine: string;
  secondLine: string;
  accent: string; // the highlighted word at the end of the headline
  text: string;
}

// The image panel shared by the Sign In / Sign Up page and the Forgot Password page
function AuthShowcase({ firstLine, secondLine, accent, text }: AuthShowcaseProps) {
  return (
    <aside className="auth-showcase">
      <img
        src={showcaseImage}
        alt="Woman in teal workout wear holding a standing yoga lunge with her arms raised in a bright fitness studio"
        className="auth-showcase-image"
      />
      <div className="auth-showcase-overlay" />

      <div className="auth-showcase-content">
        <p className="auth-showcase-title">
          {firstLine}
          <br />
          {secondLine} <span className="auth-showcase-title-accent">{accent}</span>
        </p>
        <p className="auth-showcase-text">{text}</p>
      </div>
    </aside>
  );
}

export default AuthShowcase;