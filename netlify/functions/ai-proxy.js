const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: require('firebase-admin/app').cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Fallback to default credentials if available
    try {
      initializeApp();
    } catch (fallbackError) {
      console.error('Firebase Admin fallback initialization failed:', fallbackError);
    }
  }
}

const auth = getAuth();
const db = getFirestore();

exports.handler = async function(event, context) {
  // Enhanced CORS headers with security
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://your-domain.netlify.app';
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    const body = JSON.parse(event.body);
    const { provider, messages, userId, timestamp } = body;

    // Validate required fields
    if (!provider || !messages || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Provider, messages, and userId are required' })
      };
    }

    // Validate messages format
    console.log('Messages type:', typeof messages);
    console.log('Messages is array:', Array.isArray(messages));
    console.log('Messages length:', messages?.length);
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages must be a non-empty array' })
      };
    }

    // Validate each message
    for (const message of messages) {
      if (!message.role || !message.content || 
          typeof message.role !== 'string' || 
          typeof message.content !== 'string' ||
          message.role.length > 50 ||
          message.content.length > 10000) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid message format' })
        };
      }
    }

    // Authenticate user
    const authHeader = event.headers.authorization;
    console.log('Auth header present:', !!authHeader);
    console.log('Auth header starts with Bearer:', authHeader?.startsWith('Bearer '));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authorization header required' })
      };
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
      if (decodedToken.uid !== userId) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'User ID mismatch' })
        };
      }
    } catch (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid authentication token' })
      };
    }

    // Check rate limiting
    const rateLimitResult = await checkRateLimit(userId);
    if (!rateLimitResult.allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Rate limit exceeded', 
          waitTime: rateLimitResult.waitTime 
        })
      };
    }

    // Check AI credits
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    const userData = userDoc.data();
    if (userData.stats.aiCredits <= 0) {
      return {
        statusCode: 402,
        headers,
        body: JSON.stringify({ error: 'No AI credits remaining' })
      };
    }

    // Call AI provider
    let response;
    switch (provider.toLowerCase()) {
      case 'claude':
        response = await callClaude(messages);
        break;
      case 'gemini':
        response = await callGemini(messages);
        break;
      case 'perplexity':
        response = await callPerplexity(messages);
        break;
      case 'xai':
        response = await callXAI(messages);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Unsupported AI provider' })
        };
    }

    // Deduct AI credit
    await db.collection('users').doc(userId).update({
      'stats.aiCredits': require('firebase-admin/firestore').FieldValue.increment(-1)
    });

    // Log interaction
    await logInteraction(userId, 'chat', messages, response.content);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: response.content })
    };

  } catch (error) {
    console.error('AI Proxy Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function checkRateLimit(userId) {
  const rateLimitRef = db.collection('aiRateLimits').doc(userId);
  const now = new Date();
  const timeWindow = 60; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute

  try {
    const doc = await rateLimitRef.get();
    if (doc.exists) {
      const data = doc.data();
      const recentRequests = data.requests.filter(req => 
        (now - req.timestamp.toDate()) < timeWindow * 1000
      );

      if (recentRequests.length >= maxRequests) {
        const oldestRequest = recentRequests[0];
        const waitTime = Math.ceil((timeWindow * 1000 - (now - oldestRequest.timestamp.toDate())) / 1000);
        return { allowed: false, waitTime };
      }

      recentRequests.push({ timestamp: require('firebase-admin/firestore').FieldValue.serverTimestamp() });
      await rateLimitRef.set({ requests: recentRequests }, { merge: true });
    } else {
      await rateLimitRef.set({ 
        requests: [{ timestamp: require('firebase-admin/firestore').FieldValue.serverTimestamp() }] 
      });
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true }; // Allow on error
  }
}

async function logInteraction(userId, type, input, output) {
  try {
    await db.collection('aiInteractions').add({
      userId,
      type,
      input,
      output,
      timestamp: require('firebase-admin/firestore').FieldValue.serverTimestamp(),
      provider: 'ai-proxy'
    });
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
}

async function callClaude(messages, model = 'claude-3-sonnet-20240229', maxTokens = 1000, temperature = 0.7) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('Claude API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: maxTokens,
      temperature: temperature,
      messages: messages
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    provider: 'claude',
    content: data.content[0].text,
    usage: data.usage
  };
}

async function callGemini(messages, model = 'gemini-pro', maxTokens = 1000, temperature = 0.7) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  // Convert messages to Gemini format
  const contents = messages.map(msg => ({
    parts: [{ text: msg.content }],
    role: msg.role === 'user' ? 'user' : 'model'
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    provider: 'gemini',
    content: data.candidates[0].content.parts[0].text,
    usage: data.usageMetadata
  };
}

async function callPerplexity(messages, model = 'llama-3.1-sonar-small-128k-online', maxTokens = 1000, temperature = 0.7) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('Perplexity API key not configured');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    provider: 'perplexity',
    content: data.choices[0].message.content,
    usage: data.usage
  };
}

async function callXAI(messages, model = 'grok-beta', maxTokens = 1000, temperature = 0.7) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error('XAI API key not configured');
  }

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`XAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    provider: 'xai',
    content: data.choices[0].message.content,
    usage: data.usage
  };
} 