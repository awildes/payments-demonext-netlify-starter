// Netlify function to create a Cash App payment using Square API
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

    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
    
    if (!squareAccessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Square access token not configured' })
      };
    }

    // Create Square payment using Payments API
    const paymentRequest = {
      amount_money: {
        amount: amount, // Amount in cents
        currency: currency
      },
      source_id: 'EXTERNAL_PAYMENT', // For Cash App Pay
      external_details: {
        type: 'CASH_APP_PAY',
        source: 'Cash App Pay Demo',
        source_fee_money: {
          amount: 0,
          currency: currency
        }
      },
      order_id: `payment-demo-${Date.now()}`,
      note: 'Payment Demo - Cash App Pay Transaction',
      app_fee_money: {
        amount: 0,
        currency: currency
      },
      autocomplete: false // Set to false to require manual completion
    };

    const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(paymentRequest)
    });

    const squareData = await squareResponse.json();
    
    if (!squareResponse.ok) {
      throw new Error(`Square API error: ${squareData.errors?.[0]?.detail || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        payment: squareData.payment,
        status: 'created',
        message: 'Cash App payment created successfully'
      })
    };

  } catch (error) {
    console.error('Cash App payment creation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to create Cash App payment',
        message: error.message 
      })
    };
  }
};
