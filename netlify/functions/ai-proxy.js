// AI Proxy Function for Operator Uplift
// Handles multiple AI providers: Gemini, Claude, Perplexity, DeepSeek, xAI, GPT
// Deployed on Netlify Functions for secure API access

const axios = require('axios');

// AI Provider configurations
const AI_PROVIDERS = {
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-pro',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    formatRequest: (messages, apiKey) => ({
      url: `${AI_PROVIDERS.gemini.baseUrl}/${AI_PROVIDERS.gemini.model}:generateContent`,
      headers: AI_PROVIDERS.gemini.headers(apiKey),
      data: {
        contents: messages.map(msg => ({
          parts: [{ text: msg.content }],
          role: msg.role === 'user' ? 'user' : 'model'
        }))
      }
    }),
    formatResponse: (response) => ({
      content: response.data.candidates[0].content.parts[0].text,
      provider: 'gemini',
      model: AI_PROVIDERS.gemini.model
    })
  },

  claude: {
    name: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }),
    formatRequest: (messages, apiKey) => ({
      url: `${AI_PROVIDERS.claude.baseUrl}/messages`,
      headers: AI_PROVIDERS.claude.headers(apiKey),
      data: {
        model: AI_PROVIDERS.claude.model,
        max_tokens: 4000,
        messages: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      }
    }),
    formatResponse: (response) => ({
      content: response.data.content[0].text,
      provider: 'claude',
      model: AI_PROVIDERS.claude.model
    })
  },

  perplexity: {
    name: 'Perplexity AI',
    baseUrl: 'https://api.perplexity.ai',
    model: 'llama-3.1-sonar-small-128k-online',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    formatRequest: (messages, apiKey) => ({
      url: `${AI_PROVIDERS.perplexity.baseUrl}/chat/completions`,
      headers: AI_PROVIDERS.perplexity.headers(apiKey),
      data: {
        model: AI_PROVIDERS.perplexity.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000
      }
    }),
    formatResponse: (response) => ({
      content: response.data.choices[0].message.content,
      provider: 'perplexity',
      model: AI_PROVIDERS.perplexity.model
    })
  },

  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    formatRequest: (messages, apiKey) => ({
      url: `${AI_PROVIDERS.deepseek.baseUrl}/chat/completions`,
      headers: AI_PROVIDERS.deepseek.headers(apiKey),
      data: {
        model: AI_PROVIDERS.deepseek.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000
      }
    }),
    formatResponse: (response) => ({
      content: response.data.choices[0].message.content,
      provider: 'deepseek',
      model: AI_PROVIDERS.deepseek.model
    })
  },

  xai: {
    name: 'xAI Grok',
    baseUrl: 'https://api.x.ai/v1',
    model: 'grok-beta',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    formatRequest: (messages, apiKey) => ({
      url: `${AI_PROVIDERS.xai.baseUrl}/chat/completions`,
      headers: AI_PROVIDERS.xai.headers(apiKey),
      data: {
        model: AI_PROVIDERS.xai.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000
      }
    }),
    formatResponse: (response) => ({
      content: response.data.choices[0].message.content,
      provider: 'xai',
      model: AI_PROVIDERS.xai.model
    })
  },

  openai: {
    name: 'OpenAI GPT',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    formatRequest: (messages, apiKey) => ({
      url: `${AI_PROVIDERS.openai.baseUrl}/chat/completions`,
      headers: AI_PROVIDERS.openai.headers(apiKey),
      data: {
        model: AI_PROVIDERS.openai.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000
      }
    }),
    formatResponse: (response) => ({
      content: response.data.choices[0].message.content,
      provider: 'openai',
      model: AI_PROVIDERS.openai.model
    })
  }
};

// Rate limiting and usage tracking
const rateLimits = new Map();
const USAGE_LIMITS = {
  requests_per_minute: 60,
  requests_per_hour: 1000,
  tokens_per_day: 100000
};

// Validate and sanitize input
function validateInput(messages, provider, userId) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages format');
  }

  if (!provider || !AI_PROVIDERS[provider]) {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  // Validate message structure
  for (const msg of messages) {
    if (!msg.role || !msg.content || typeof msg.content !== 'string') {
      throw new Error('Invalid message structure');
    }
    if (msg.content.length > 4000) {
      throw new Error('Message content too long');
    }
  }

  return true;
}

// Check rate limits
function checkRateLimit(userId, provider) {
  const now = Date.now();
  const userKey = `${userId}:${provider}`;
  
  if (!rateLimits.has(userKey)) {
    rateLimits.set(userKey, {
      requests: [],
      tokens: 0,
      lastReset: now
    });
  }

  const userLimits = rateLimits.get(userKey);
  
  // Reset counters if needed
  if (now - userLimits.lastReset > 3600000) { // 1 hour
    userLimits.requests = [];
    userLimits.tokens = 0;
    userLimits.lastReset = now;
  }

  // Check minute limit
  const minuteAgo = now - 60000;
  const recentRequests = userLimits.requests.filter(time => time > minuteAgo);
  
  if (recentRequests.length >= USAGE_LIMITS.requests_per_minute) {
    throw new Error('Rate limit exceeded: too many requests per minute');
  }

  // Check hour limit
  const hourAgo = now - 3600000;
  const hourlyRequests = userLimits.requests.filter(time => time > hourAgo);
  
  if (hourlyRequests.length >= USAGE_LIMITS.requests_per_hour) {
    throw new Error('Rate limit exceeded: too many requests per hour');
  }

  // Update usage
  userLimits.requests.push(now);
  
  return true;
}

// Get API key for provider
function getApiKey(provider) {
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  const apiKey = process.env[envKey];
  
  if (!apiKey) {
    throw new Error(`API key not configured for ${provider}`);
  }
  
  return apiKey;
}

// Make AI request
async function makeAIRequest(provider, messages, apiKey) {
  const providerConfig = AI_PROVIDERS[provider];
  const requestConfig = providerConfig.formatRequest(messages, apiKey);
  
  try {
    const response = await axios({
      method: 'POST',
      url: requestConfig.url,
      headers: requestConfig.headers,
      data: requestConfig.data,
      timeout: 30000 // 30 second timeout
    });
    
    return providerConfig.formatResponse(response);
  } catch (error) {
    console.error(`AI request failed for ${provider}:`, error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      throw new Error(`Rate limit exceeded for ${provider}`);
    } else if (error.response?.status === 401) {
      throw new Error(`Invalid API key for ${provider}`);
    } else if (error.response?.status === 400) {
      throw new Error(`Invalid request to ${provider}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error(`Request timeout for ${provider}`);
    } else {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

// Main handler function
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  try {
    // Parse request
    const body = JSON.parse(event.body);
    const { messages, provider, userId, fallbackProvider } = body;

    // Validate input
    validateInput(messages, provider, userId);

    // Check rate limits
    checkRateLimit(userId, provider);

    // Get API key
    const apiKey = getApiKey(provider);

    // Make AI request
    const result = await makeAIRequest(provider, messages, apiKey);

    // Log successful request
    console.log(`AI request successful: ${provider} for user ${userId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
        usage: {
          provider,
          timestamp: new Date().toISOString(),
          userId
        }
      })
    };

  } catch (error) {
    console.error('AI proxy error:', error);

    // Handle fallback provider if specified
    if (event.body && error.message.includes('API key not configured')) {
      try {
        const body = JSON.parse(event.body);
        const { messages, fallbackProvider, userId } = body;
        
        if (fallbackProvider && fallbackProvider !== body.provider) {
          console.log(`Attempting fallback to ${fallbackProvider}`);
          
          const fallbackApiKey = getApiKey(fallbackProvider);
          const result = await makeAIRequest(fallbackProvider, messages, fallbackApiKey);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: result,
              fallback: true,
              originalProvider: body.provider,
              usage: {
                provider: fallbackProvider,
                timestamp: new Date().toISOString(),
                userId
              }
            })
          };
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }

    return {
      statusCode: error.message.includes('Rate limit') ? 429 : 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Health check endpoint
exports.health = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const providers = Object.keys(AI_PROVIDERS).map(provider => ({
    name: provider,
    configured: !!process.env[`${provider.toUpperCase()}_API_KEY`],
    status: !!process.env[`${provider.toUpperCase()}_API_KEY`] ? 'configured' : 'not_configured'
  }));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'healthy',
      providers,
      timestamp: new Date().toISOString()
    })
  };
}; 