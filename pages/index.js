import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
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
        <title>Payment Demo - PayPal & Cash App</title>
        <meta name="description" content="Payment integration demo with PayPal and Cash App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* PayPal SDK */}
      <Script 
        src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"
        onLoad={initializePayPal}
      />

      <main className="main">
        <h1 className="title">Payment Demo</h1>
        
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
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        .main {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .title {
          margin: 0 0 2rem 0;
          line-height: 1.15;
          font-size: 2.5rem;
          text-align: center;
          color: #333;
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
