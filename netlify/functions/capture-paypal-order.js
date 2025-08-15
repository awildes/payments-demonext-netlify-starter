// Netlify function to capture a PayPal order
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { orderID } = JSON.parse(event.body);
    
    // Validate input
    if (!orderID) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'OrderID is required' })
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

    // Capture PayPal order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const captureData = await captureResponse.json();
    
    if (!captureResponse.ok) {
      throw new Error(`PayPal capture error: ${captureData.error?.message || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(captureData)
    };

  } catch (error) {
    console.error('PayPal order capture error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to capture PayPal order',
        message: error.message 
      })
    };
  }
};
