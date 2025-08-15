import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>WOOD CREATIONZ - Premium Wood Crafts & Services</title>
        <meta name="description" content="Central hub for WOOD CREATIONZ services including Wood Apparels, Fix My Fork, and Wood Music" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo-title">WOOD CREATIONZ</h1>
          </div>
          <div className="logo-image">
            <img src="/favicon.ico" alt="WOOD CREATIONZ Logo" className="logo-img" />
          </div>
        </div>
      </header>

      <nav className="navigation">
        <div className="nav-content">
          <Link href="/wood-apparels" className="nav-item">
            <div className="nav-card">
              <h2>Fix My Fork</h2>
              <p>Professional utensil repair and restoration services</p>
              <span className="nav-arrow">→</span>
            </div>
          </Link>
          
          <Link href="/wood-apparels" className="nav-item">
            <div className="nav-card active">
              <h2>Wood Apparels</h2>
              <p>Custom wood-themed clothing and accessories</p>
              <span className="nav-arrow">→</span>
            </div>
          </Link>
          
          <Link href="/wood-apparels" className="nav-item">
            <div className="nav-card">
              <h2>Wood Music</h2>
              <p>Handcrafted wooden instruments and music accessories</p>
              <span className="nav-arrow">→</span>
            </div>
          </Link>
        </div>
      </nav>

      <main className="main">
        <section className="hero">
          <h2 className="hero-title">Welcome to WOOD CREATIONZ</h2>
          <p className="hero-description">
            Your premier destination for artisanal wood crafts and specialized services. 
            From custom apparel to instrument restoration, we bring creativity and quality to every project.
          </p>
        </section>

        <section className="services-preview">
          <div className="service-highlight">
            <h3>Featured Service</h3>
            <div className="highlight-card">
              <h4>Wood Apparels Collection</h4>
              <p>Discover our exclusive line of wood-themed clothing featuring unique designs and premium materials.</p>
              <Link href="/wood-apparels" className="cta-button">
                Shop Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 WOOD CREATIONZ. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        .header {
          background: white;
          padding: 2rem 0;
          border-bottom: 3px solid #b8860b;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo-section {
          flex: 1;
        }

        .logo-title {
          color: #b8860b;
          font-size: 3rem;
          font-weight: bold;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          letter-spacing: 2px;
        }

        .logo-image {
          display: flex;
          align-items: center;
        }

        .logo-img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .navigation {
          background: #f8f8f8;
          padding: 3rem 0;
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0 2rem;
        }

        .nav-item {
          text-decoration: none;
          color: inherit;
        }

        .nav-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .nav-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #b8860b;
        }

        .nav-card.active {
          border-color: #b8860b;
          background: linear-gradient(135deg, #fff9e6 0%, white 100%);
        }

        .nav-card h2 {
          color: #333;
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .nav-card p {
          color: #666;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .nav-arrow {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: #b8860b;
          font-size: 1.5rem;
          font-weight: bold;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .nav-card:hover .nav-arrow {
          opacity: 1;
          transform: translateX(5px);
        }

        .main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .hero-title {
          color: #333;
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          font-weight: 300;
        }

        .hero-description {
          color: #666;
          font-size: 1.2rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .services-preview {
          display: flex;
          justify-content: center;
        }

        .service-highlight {
          max-width: 500px;
          width: 100%;
        }

        .service-highlight h3 {
          color: #b8860b;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.5rem;
        }

        .highlight-card {
          background: linear-gradient(135deg, #fff9e6 0%, white 100%);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #b8860b;
          text-align: center;
        }

        .highlight-card h4 {
          color: #333;
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }

        .highlight-card p {
          color: #666;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .cta-button {
          display: inline-block;
          background: #b8860b;
          color: white;
          padding: 1rem 2rem;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(184, 134, 11, 0.3);
        }

        .cta-button:hover {
          background: #9a7209;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(184, 134, 11, 0.4);
        }

        .footer {
          background: #333;
          color: white;
          text-align: center;
          padding: 2rem;
          margin-top: 4rem;
        }

        .footer p {
          margin: 0;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .logo-title {
            font-size: 2rem;
          }

          .nav-content {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
