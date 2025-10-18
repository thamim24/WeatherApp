import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-card">
      <div className="footer-content">
        <p className="footer-text">
          Made with ❤️ by <strong>Thamimul Ansari M</strong>
        </p>
        <p className="footer-year">© {currentYear} AI Weather App. All rights reserved.</p>
        <p className="footer-tech">
          Built with Java, React, Spring Boot, Groq API & OpenWeatherMap API
        </p>
      </div>
    </footer>
  );
}

export default Footer;