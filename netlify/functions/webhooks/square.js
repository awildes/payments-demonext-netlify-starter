// Netlify function to handle Square webhook events for Cash App Pay
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const headers = event.headers;
    
    // Log the webhook event for debugging
    console.log('Square webhook received:', {
      type: payload.type,
      data: payload.data,
      event_id: payload.event_id
    });

    // In production, you would verify the webhook signature here
    // const isValidSignature = verifySquareWebhookSignature(payload, headers);
    // if (!isValidSignature) {
    //   return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
    // }

    // Handle different Square webhook events
    switch (payload.type) {
      case 'payment.created':
        console.log('Payment created:', payload.data.object);
        // Handle payment creation
        break;
        
      case 'payment.updated':
        const payment = payload.data.object;
        console.log('Payment updated:', {
          id: payment.id,
          status: payment.status,
          amount: payment.amount_money
        });
        
        if (payment.status === 'COMPLETED') {
          console.log('Cash App payment completed successfully');
          // Here you would update your database with the successful payment
          // Example: await updatePaymentStatus(payment.id, 'completed');
        } else if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
          console.log('Cash App payment failed or canceled');
          // Handle failed/canceled payment
          // Example: await updatePaymentStatus(payment.id, 'failed');
        }
        break;
        
      case 'refund.created':
        console.log('Refund created:', payload.data.object);
        // Handle refund creation
        break;
        
      case 'refund.updated':
        const refund = payload.data.object;
        console.log('Refund updated:', {
          id: refund.id,
          status: refund.status,
          amount: refund.amount_money
        });
        
        if (refund.status === 'COMPLETED') {
          console.log('Refund completed successfully');
          // Handle successful refund
        }
        break;
        
      case 'dispute.created':
        console.log('Dispute created:', payload.data.object);
        // Handle dispute creation
        break;
        
      default:
        console.log('Unhandled Square webhook event:', payload.type);
    }

    // Send success response to Square
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Webhook received successfully',
        event_type: payload.type 
      })
    };

  } catch (error) {
    console.error('Square webhook processing error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Webhook processing failed',
        message: error.message 
      })
    };
  }
};

// Helper function to verify Square webhook signature (implement in production)
// function verifySquareWebhookSignature(payload, headers) {
//   // Implementation would use Square's webhook signature verification
//   // https://developer.squareup.com/docs/webhooks/step3verify
//   return true; // Simplified for demo
// }
