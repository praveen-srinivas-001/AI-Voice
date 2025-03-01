const axios = require('axios');

class VapiService {
  constructor(apiKey, assistantId) {
    if (!apiKey || !assistantId) {
      throw new Error('Vapi.ai credentials are required (apiKey, assistantId)');
    }
    
    this.apiKey = apiKey;
    this.assistantId = assistantId;
    this.baseUrl = 'https://api.vapi.ai';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Initiate a phone call using Vapi.ai
  async initiateCall(phoneNumber, initialMessage = null) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/calls`,
        {
          assistant_id: this.assistantId,
          phone_number: phoneNumber,
          initial_message: initialMessage || 'Hello, how can I assist you today?'
        },
        { headers: this.headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error initiating Vapi.ai call:', error);
      throw error;
    }
  }

  // Get call details
  async getCallDetails(callId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/call/${callId}`,
        { headers: this.headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting call details:', error);
      throw error;
    }
  }

  // End an ongoing call
  async endCall(callId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/call/${callId}/end`,
        {},
        { headers: this.headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }

  // Send a message to an ongoing call
  async sendMessage(callId, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/call/${callId}/message`,
        { message },
        { headers: this.headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

module.exports = VapiService;