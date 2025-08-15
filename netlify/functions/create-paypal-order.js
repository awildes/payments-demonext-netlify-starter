// Netlify function to create a PayPal order
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency } = JSON.parse(event.body);
    
    // Validate input
    if (!amount || !currency) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Amount and currency are required' })
      };
    }

    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_SECRET;
    
    if (!paypalClientId || !paypalSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'PayPal credentials not configured' })
      };
    }

    // Get PayPal access token
    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64');
    
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get PayPal access token');
    }

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount
          },
          description: 'Payment Demo Transaction'
        }],
        application_context: {
          brand_name: 'Payment Demo',
          landing_page: 'NO_PREFERENCE',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW'
        }
      })
    });

    const orderData = await orderResponse.json();
    
    if (!orderResponse.ok) {
      throw new Error(`PayPal API error: ${orderData.error?.message || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(orderData)
    };

  } catch (error) {
    console.error('PayPal order creation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to create PayPal order',
        message: error.message 
      })
    };
  }
};
