const express = require('express');
const router = express.Router();
const VapiService = require('../vapiService');
const TwilioService = require('../twilioService');

// Initialize services with null checks for environment variables
let vapiService = null;
let twilioService = null;

// Only initialize services if environment variables are present
if (process.env.VAPI_API_KEY && process.env.VAPI_ASSISTANT_ID) {
  vapiService = new VapiService(
    process.env.VAPI_API_KEY,
    process.env.VAPI_ASSISTANT_ID
  );
}

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  twilioService = new TwilioService(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
    process.env.TWILIO_PHONE_NUMBER
  );
}

// Home route
router.get('/', (req, res) => {
  res.send('AI Voice Assistant API is running');
});

// Initiate a call using Twilio
router.post('/call', async (req, res) => {
  try {
    if (!twilioService) {
      return res.status(503).json({ 
        error: 'Twilio service not configured', 
        details: 'Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables' 
      });
    }

    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const webhookUrl = `${req.protocol}://${req.get('host')}/vapi-webhook`;
    const call = await twilioService.makeCall(phoneNumber, webhookUrl);

    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call', details: error.message });
  }
});

// Webhook for Twilio to connect to Vapi.ai
router.post('/vapi-webhook', (req, res) => {
  if (!twilioService) {
    return res.status(503).json({ 
      error: 'Twilio service not configured', 
      details: 'Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables' 
    });
  }

  const twimlResponse = twilioService.generateVapiConnection(
    'Connecting you to our AI assistant.'
  );
  
  res.type('text/xml');
  res.send(twimlResponse);
});

// Initiate a call directly with Vapi.ai
router.post('/send-to-vapi', async (req, res) => {
  try {
    if (!vapiService) {
      return res.status(503).json({ 
        error: 'Vapi.ai service not configured', 
        details: 'Please set VAPI_API_KEY and VAPI_ASSISTANT_ID environment variables' 
      });
    }

    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const callData = await vapiService.initiateCall(phoneNumber, message);
    
    res.json({ success: true, callId: callData.call_id });
  } catch (error) {
    console.error('Error sending request to Vapi.ai:', error);
    res.status(500).json({ error: 'Failed to send request to Vapi.ai', details: error.message });
  }
});

// Get call details from Vapi.ai
router.get('/call/:callId', async (req, res) => {
  try {
    if (!vapiService) {
      return res.status(503).json({ 
        error: 'Vapi.ai service not configured', 
        details: 'Please set VAPI_API_KEY and VAPI_ASSISTANT_ID environment variables' 
      });
    }

    const { callId } = req.params;
    const callDetails = await vapiService.getCallDetails(callId);
    
    res.json(callDetails);
  } catch (error) {
    console.error('Error getting call details:', error);
    res.status(500).json({ error: 'Failed to get call details', details: error.message });
  }
});

// End a call on Vapi.ai
router.post('/call/:callId/end', async (req, res) => {
  try {
    if (!vapiService) {
      return res.status(503).json({ 
        error: 'Vapi.ai service not configured', 
        details: 'Please set VAPI_API_KEY and VAPI_ASSISTANT_ID environment variables' 
      });
    }

    const { callId } = req.params;
    const result = await vapiService.endCall(callId);
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error ending call:', error);
    res.status(500).json({ error: 'Failed to end call', details: error.message });
  }
});

// Callback endpoint for Vapi.ai events
router.post('/vapi-callback', async (req, res) => {
  try {
    const { callId, event, data } = req.body;
    
    console.log('Received callback from Vapi.ai:', { callId, event });
    
    // Handle different events from Vapi.ai
    switch (event) {
      case 'call.completed':
        console.log('Call completed');
        break;
      case 'transcription':
        console.log('Transcription:', data.text);
        break;
      // Add more event handlers as needed
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error handling Vapi.ai callback:', error);
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

module.exports = router;