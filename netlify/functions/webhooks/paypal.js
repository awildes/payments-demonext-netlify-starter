// Netlify function to handle PayPal webhook events
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
    console.log('PayPal webhook received:', {
      event_type: payload.event_type,
      resource_type: payload.resource_type,
      summary: payload.summary,
      resource_id: payload.resource?.id
    });

    // In production, you would verify the webhook signature here
    // const isValidSignature = verifyPayPalWebhookSignature(payload, headers);
    // if (!isValidSignature) {
    //   return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
    // }

    // Handle different PayPal webhook events
    switch (payload.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment capture completed:', payload.resource);
        // Here you would update your database with the successful payment
        // Example: await updatePaymentStatus(payload.resource.id, 'completed');
        break;
        
      case 'PAYMENT.CAPTURE.DECLINED':
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('Payment capture failed:', payload.resource);
        // Handle failed payment
        // Example: await updatePaymentStatus(payload.resource.id, 'failed');
        break;
        
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('Order approved:', payload.resource);
        // Order was approved by the customer
        break;
        
      case 'CHECKOUT.ORDER.COMPLETED':
        console.log('Order completed:', payload.resource);
        // Order was completed
        break;
        
      case 'PAYMENT.AUTHORIZATION.CREATED':
        console.log('Payment authorized:', payload.resource);
        // Payment was authorized but not yet captured
        break;
        
      default:
        console.log('Unhandled PayPal webhook event:', payload.event_type);
    }

    // Send success response to PayPal
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Webhook received successfully',
        event_type: payload.event_type 
      })
    };

  } catch (error) {
    console.error('PayPal webhook processing error:', error);
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

// Helper function to verify PayPal webhook signature (implement in production)
// function verifyPayPalWebhookSignature(payload, headers) {
//   // Implementation would use PayPal's webhook signature verification
//   // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
//   return true; // Simplified for demo
// }
