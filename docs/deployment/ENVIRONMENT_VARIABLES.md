# 🔑 Environment Variables Setup Guide

## 🌐 **Netlify Environment Variables Configuration**

This guide shows you how to set up all the required environment variables in Netlify for Operator Uplift to work with multiple AI providers.

### 📍 **Where to Set Environment Variables**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add each variable below

---

## 🔥 **Firebase Configuration**

### **Required Firebase Variables**
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### **How to Get Firebase Keys**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project settings** → **General**
4. Scroll down to **Your apps** section
5. Copy the configuration values

---

## 🤖 **AI Provider API Keys**

### **1. Google Gemini**
```
GEMINI_API_KEY=your_gemini_api_key
```
**How to get:** [Google AI Studio](https://makersuite.google.com/app/apikey)

### **2. Anthropic Claude**
```
CLAUDE_API_KEY=your_claude_api_key
```
**How to get:** [Anthropic Console](https://console.anthropic.com/)

### **3. Perplexity AI**
```
PERPLEXITY_API_KEY=your_perplexity_api_key
```
**How to get:** [Perplexity API](https://www.perplexity.ai/settings/api)

### **4. DeepSeek**
```
DEEPSEEK_API_KEY=your_deepseek_api_key
```
**How to get:** [DeepSeek API](https://platform.deepseek.com/api-keys)

### **5. xAI Grok**
```
XAI_API_KEY=your_xai_api_key
```
**How to get:** [xAI Platform](https://console.x.ai/)

### **6. OpenAI GPT**
```
OPENAI_API_KEY=your_openai_api_key
```
**How to get:** [OpenAI Platform](https://platform.openai.com/api-keys)

---

## 📱 **VAPID Keys (Push Notifications)**

### **Generate VAPID Keys**
```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

### **Add to Netlify**
```
VAPID_PUBLIC_KEY=your_generated_public_key
VAPID_PRIVATE_KEY=your_generated_private_key
```

---

## ⚙️ **Other Configuration**

### **Environment**
```
NODE_ENV=production
```

### **Optional: Custom Domain**
```
CUSTOM_DOMAIN=your-domain.com
```

---

## 🔒 **Security Best Practices**

### **✅ Do's**
- ✅ Use strong, unique API keys
- ✅ Rotate API keys regularly
- ✅ Monitor API usage
- ✅ Set up billing alerts
- ✅ Use environment-specific keys

### **❌ Don'ts**
- ❌ Never commit API keys to Git
- ❌ Don't share API keys publicly
- ❌ Don't use the same key for multiple services
- ❌ Don't hardcode keys in your application

---

## 🧪 **Testing Your Configuration**

### **Health Check Endpoint**
After deployment, test your AI proxy at:
```
https://your-site.netlify.app/.netlify/functions/ai-proxy/health
```

### **Expected Response**
```json
{
  "status": "healthy",
  "providers": [
    {
      "name": "gemini",
      "configured": true,
      "status": "configured"
    },
    {
      "name": "claude",
      "configured": true,
      "status": "configured"
    }
    // ... other providers
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. API Key Not Working**
- ✅ Check if the key is correctly copied
- ✅ Verify the key has proper permissions
- ✅ Check if the service is available in your region

#### **2. Rate Limiting**
- ✅ Check your API usage limits
- ✅ Implement proper rate limiting in your app
- ✅ Consider upgrading your API plan

#### **3. CORS Issues**
- ✅ Ensure your domain is whitelisted
- ✅ Check Netlify function configuration
- ✅ Verify request headers

#### **4. Function Timeout**
- ✅ Check function execution time
- ✅ Optimize your AI requests
- ✅ Consider using streaming responses

---

## 📊 **Usage Monitoring**

### **Track API Usage**
Monitor your API usage through:
- **Firebase Console**: For Firebase services
- **AI Provider Dashboards**: For API usage
- **Netlify Analytics**: For function calls

### **Set Up Alerts**
- Configure billing alerts for each AI provider
- Set up usage monitoring for cost control
- Monitor error rates and performance

---

## 🔄 **Environment-Specific Configuration**

### **Production**
```
NODE_ENV=production
```

### **Preview/Staging**
```
NODE_ENV=preview
```

### **Development**
```
NODE_ENV=development
```

---

## 📝 **Complete Environment Variables List**

Here's the complete list of all environment variables you need:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Provider API Keys
GEMINI_API_KEY=your_gemini_api_key
CLAUDE_API_KEY=your_claude_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
XAI_API_KEY=your_xai_api_key
OPENAI_API_KEY=your_openai_api_key

# VAPID Keys
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Environment
NODE_ENV=production
```

---

## 🎯 **Next Steps**

1. ✅ Set up all environment variables in Netlify
2. ✅ Test the health check endpoint
3. ✅ Deploy your application
4. ✅ Test AI functionality
5. ✅ Monitor usage and performance

---

**🔒 Remember: Keep your API keys secure and never expose them in your code!** 