const twilio = require('twilio');

class TwilioService {
  constructor(accountSid, authToken, phoneNumber) {
    if (!accountSid || !authToken || !phoneNumber) {
      throw new Error('Twilio credentials are required (accountSid, authToken, phoneNumber)');
    }
    
    this.client = twilio(accountSid, authToken);
    this.phoneNumber = phoneNumber;
  }

  // Make a call to a phone number
  async makeCall(to, webhookUrl) {
    try {
      const call = await this.client.calls.create({
        url: webhookUrl,
        to: to,
        from: this.phoneNumber
      });
      
      return call;
    } catch (error) {
      console.error('Error making Twilio call:', error);
      throw error;
    }
  }

  // Send an SMS
  async sendSMS(to, body) {
    try {
      const message = await this.client.messages.create({
        body: body,
        to: to,
        from: this.phoneNumber
      });
      
      return message;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  // Generate TwiML for voice response
  generateVoiceResponse(message) {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'alice' }, message);
    return twiml.toString();
  }

  // Generate TwiML to connect to Vapi.ai
  generateVapiConnection(message) {
    const twiml = new twilio.twiml.VoiceResponse();
    
    if (message) {
      twiml.say({ voice: 'alice' }, message);
    }
    
    // Here you would add the necessary TwiML to connect to Vapi.ai
    // This depends on how Vapi.ai integrates with Twilio
    
    return twiml.toString();
  }
}

module.exports = TwilioService;