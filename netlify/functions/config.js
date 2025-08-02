exports.handler = async function(event, context) {
  // CORS headers with security
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://your-domain.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
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
  console.log('VITE_FIREBASE_API_KEY exists:', !!process.env.VITE_FIREBASE_API_KEY);
  console.log('VITE_FIREBASE_AUTH_DOMAIN exists:', !!process.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log('VITE_FIREBASE_PROJECT_ID exists:', !!process.env.VITE_FIREBASE_PROJECT_ID);

  // Return Firebase configuration from environment variables
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || 'MISSING_API_KEY',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'MISSING_AUTH_DOMAIN',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'MISSING_PROJECT_ID',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'MISSING_STORAGE_BUCKET',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'MISSING_SENDER_ID',
    appId: process.env.VITE_FIREBASE_APP_ID || 'MISSING_APP_ID'
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ firebaseConfig })
  };
}; 