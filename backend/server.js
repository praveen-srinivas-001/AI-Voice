require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Check for required environment variables
const checkEnvVariables = () => {
  const requiredVapiVars = ['VAPI_API_KEY', 'VAPI_ASSISTANT_ID'];
  const requiredTwilioVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];
  
  const missingVapiVars = requiredVapiVars.filter(varName => !process.env[varName]);
  const missingTwilioVars = requiredTwilioVars.filter(varName => !process.env[varName]);
  
  if (missingVapiVars.length > 0) {
    console.warn(`⚠️ Missing Vapi.ai environment variables: ${missingVapiVars.join(', ')}`);
    console.warn('Vapi.ai integration will be disabled.');
  }
  
  if (missingTwilioVars.length > 0) {
    console.warn(`⚠️ Missing Twilio environment variables: ${missingTwilioVars.join(', ')}`);
    console.warn('Twilio integration will be disabled.');
  }
  
  if (missingVapiVars.length > 0 && missingTwilioVars.length > 0) {
    console.warn('⚠️ Both Vapi.ai and Twilio integrations are disabled.');
    console.warn('Please set the required environment variables in your .env file.');
    console.warn('See .env.example for the required variables.');
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  checkEnvVariables();
});