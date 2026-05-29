export default function Footer() {
  return (
    <footer className="cm-footer">
      <span>
        &copy; {new Date().getFullYear()} CoverMe — Craig Ondevilla
      </span>
      <div className="cm-footer__links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="https://craigo.live">Craig Ondevilla</a>
        <span>v2.6.2</span>
      </div>
    </footer>
  );
}
