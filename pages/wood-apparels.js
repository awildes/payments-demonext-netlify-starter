import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';

export default function WoodApparels() {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  // Initialize PayPal SDK
  const initializePayPal = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: async (data, actions) => {
          try {
            const response = await fetch('/.netlify/functions/create-paypal-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: '10.00', currency: 'USD' })
            });
            const order = await response.json();
            return order.id;
          } catch (error) {
            console.error('Error creating PayPal order:', error);
            setPaymentStatus('Error creating PayPal order');
          }
        },
        onApprove: async (data, actions) => {
          try {
            const response = await fetch('/.netlify/functions/capture-paypal-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID })
            });
            const result = await response.json();
            if (result.status === 'COMPLETED') {
              setPaymentStatus('PayPal payment completed successfully!');
              setPaymentResult(result);
            } else {
              setPaymentStatus('PayPal payment failed');
            }
          } catch (error) {
            console.error('Error capturing PayPal order:', error);
            setPaymentStatus('Error processing PayPal payment');
          }
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          setPaymentStatus('PayPal payment error');
        },
        onCancel: (data) => {
          setPaymentStatus('PayPal payment cancelled');
        }
      }).render('#paypal-button-container');
    }
  };

  // Handle Cash App Payment
  const handleCashAppPayment = async () => {
    try {
      setPaymentStatus('Processing Cash App payment...');
      const response = await fetch('/.netlify/functions/create-cashapp-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000, currency: 'USD' }) // 1000 cents = $10.00
      });
      const result = await response.json();
      
      if (result.payment && result.payment.id) {
        // In a real implementation, you would redirect to Cash App or show QR code
        setPaymentStatus(`Cash App payment initiated. Payment ID: ${result.payment.id}`);
        setPaymentResult(result);
      } else {
        setPaymentStatus('Failed to create Cash App payment');
      }
    } catch (error) {
      console.error('Error creating Cash App payment:', error);
      setPaymentStatus('Error creating Cash App payment');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Wood Apparels - WOOD CREATIONZ</title>
        <meta name="description" content="Wood Apparels e-commerce with payment integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* PayPal SDK */}
      <Script
        src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"
        onLoad={initializePayPal}
      />

      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            <img src="/favicon.ico" alt="WOOD CREATIONZ" className="logo-img" />
          </Link>
          <nav className="nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/wood-apparels" className="nav-link active">Wood Apparels</Link>
            <Link href="#" className="nav-link">Fix My Fork</Link>
            <Link href="#" className="nav-link">Wood Music</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="sidebar">
          <h3>Categories</h3>
          <ul className="category-menu">
            <li><a href="#">IT IS WRITTEN</a></li>
            <li><a href="#">Husband and Wife</a></li>
            <li><a href="#">Business</a></li>
            <li><a href="#">Inspirational</a></li>
            <li><a href="#">Seasonal</a></li>
            <li><a href="#">Custom Orders</a></li>
          </ul>
        </div>

        <div className="content">
          <h1 className="title">Wood Apparels Store</h1>
          
          <div className="payment-section">
            <h2>Pay with PayPal</h2>
            <div id="paypal-button-container"></div>
          </div>

          <div className="payment-section">
            <h2>Pay with Cash App</h2>
            <button 
              className="cashapp-button"
              onClick={handleCashAppPayment}
            >
              Pay with Cash App - $10.00
            </button>
          </div>

          {paymentStatus && (
            <div className="payment-status">
              <h3>Payment Status:</h3>
              <p>{paymentStatus}</p>
            </div>
          )}

          {paymentResult && (
            <div className="payment-result">
              <h3>Payment Details:</h3>
              <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        .header {
          background: white;
          border-bottom: 1px solid #e0e0e0;
          padding: 1rem 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #b8860b;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .logo-img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }

        .nav {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.3s;
        }

        .nav-link:hover {
          background: #f5f5f5;
          color: #b8860b;
        }

        .nav-link.active {
          background: #b8860b;
          color: white;
        }

        .main {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          min-height: calc(100vh - 100px);
        }

        .sidebar {
          width: 250px;
          background: #f9f9f9;
          border-right: 1px solid #e0e0e0;
          padding: 2rem;
        }

        .sidebar h3 {
          color: #333;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #b8860b;
        }

        .category-menu {
          list-style: none;
          padding: 0;
        }

        .category-menu li {
          margin-bottom: 0.5rem;
        }

        .category-menu a {
          text-decoration: none;
          color: #555;
          padding: 0.5rem;
          display: block;
          border-radius: 4px;
          transition: all 0.3s;
        }

        .category-menu a:hover {
          background: #e0e0e0;
          color: #b8860b;
        }

        .content {
          flex: 1;
          padding: 2rem;
        }

        .title {
          margin: 0 0 2rem 0;
          line-height: 1.15;
          font-size: 2.5rem;
          color: #333;
          border-bottom: 3px solid #b8860b;
          padding-bottom: 1rem;
        }

        .payment-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .payment-section h2 {
          margin-top: 0;
          color: #555;
        }

        .cashapp-button {
          background: #00d632;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          transition: background 0.3s;
        }

        .cashapp-button:hover {
          background: #00b82c;
        }

        .payment-status {
          margin-top: 2rem;
          padding: 1rem;
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          border-radius: 4px;
        }

        .payment-result {
          margin-top: 1rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 14px;
        }

        .payment-result pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        #paypal-button-container {
          min-height: 50px;
        }
      `}</style>
    </div>
  );
}
