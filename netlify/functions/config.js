exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Debug: Log environment variables (without exposing sensitive data)
  console.log('Environment variables check:');
  console.log('FIREBASE_API_KEY exists:', !!process.env.FIREBASE_API_KEY);
  console.log('FIREBASE_AUTH_DOMAIN exists:', !!process.env.FIREBASE_AUTH_DOMAIN);
  console.log('FIREBASE_PROJECT_ID exists:', !!process.env.FIREBASE_PROJECT_ID);

  // Return Firebase configuration from environment variables
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'MISSING_API_KEY',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'MISSING_AUTH_DOMAIN',
    projectId: process.env.FIREBASE_PROJECT_ID || 'MISSING_PROJECT_ID',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'MISSING_STORAGE_BUCKET',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'MISSING_SENDER_ID',
    appId: process.env.FIREBASE_APP_ID || 'MISSING_APP_ID'
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ firebaseConfig })
  };
}; 