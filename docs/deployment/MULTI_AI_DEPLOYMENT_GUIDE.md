# 🤖 Multi-AI Provider Deployment Guide

## 🎯 **Overview**

Operator Uplift now supports **6 AI providers** through a secure Netlify Functions proxy:
- **Google Gemini** - Structured tasks and goal breakdown
- **Anthropic Claude** - Motivation and coaching
- **OpenAI GPT** - General advice and productivity
- **Perplexity AI** - Research and productivity insights
- **DeepSeek** - Analysis and problem-solving
- **xAI Grok** - Creative tasks and brainstorming

---

## 🚀 **Deployment Steps**

### **1. GitHub Repository Setup**

```bash
# Create new repository on GitHub
# Clone and push your code
git remote add origin https://github.com/yourusername/operator-uplift.git
git push -u origin main
```

### **2. Netlify Site Creation**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `echo "No build needed - static site"`
   - **Publish directory**: `.`
   - **Base directory**: (leave empty)

### **3. Environment Variables Setup**

In Netlify Dashboard → Site settings → Environment variables:

#### **Firebase Configuration**
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### **AI Provider API Keys**
```
GEMINI_API_KEY=your_gemini_api_key
CLAUDE_API_KEY=your_claude_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
XAI_API_KEY=your_xai_api_key
OPENAI_API_KEY=your_openai_api_key
```

#### **VAPID Keys (Push Notifications)**
```
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

#### **Environment**
```
NODE_ENV=production
```

---

## 🔑 **Getting API Keys**

### **1. Google Gemini**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to Netlify environment variables

### **2. Anthropic Claude**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create a new API key
3. Copy the key to Netlify environment variables

### **3. OpenAI GPT**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to Netlify environment variables

### **4. Perplexity AI**
1. Go to [Perplexity API](https://www.perplexity.ai/settings/api)
2. Create a new API key
3. Copy the key to Netlify environment variables

### **5. DeepSeek**
1. Go to [DeepSeek API](https://platform.deepseek.com/api-keys)
2. Create a new API key
3. Copy the key to Netlify environment variables

### **6. xAI Grok**
1. Go to [xAI Platform](https://console.x.ai/)
2. Create a new API key
3. Copy the key to Netlify environment variables

---

## 🧪 **Testing Your Setup**

### **1. Health Check**
Test your AI proxy at:
```
https://your-site.netlify.app/.netlify/functions/ai-proxy/health
```

**Expected Response:**
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
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### **2. Test AI Request**
```javascript
// Test in browser console
fetch('/.netlify/functions/ai-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }],
    provider: 'gemini',
    userId: 'test-user'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 🔒 **Security Features**

### **✅ Implemented Security**
- **Rate Limiting**: 60 requests/minute, 1000/hour per user
- **Input Validation**: Message format and length validation
- **API Key Protection**: All keys stored in Netlify environment variables
- **CORS Protection**: Proper CORS headers configured
- **Error Handling**: Comprehensive error handling and logging
- **Fallback System**: Automatic fallback to alternative providers

### **🛡️ Additional Security**
- **Request Signing**: All requests are signed with user tokens
- **Usage Tracking**: All AI interactions are logged
- **Credit System**: Users have limited AI credits
- **Provider Isolation**: Each provider is isolated and secure

---

## 📊 **Usage Monitoring**

### **Track API Usage**
- **Netlify Functions**: Monitor function calls and execution time
- **AI Provider Dashboards**: Track usage and costs
- **Firebase Analytics**: Monitor user interactions

### **Set Up Alerts**
- Configure billing alerts for each AI provider
- Set up usage monitoring for cost control
- Monitor error rates and performance

---

## 🎮 **Smart Provider Selection**

The system automatically selects the best AI provider based on the request type:

| Request Type | Provider | Use Case |
|--------------|----------|----------|
| **Motivation** | Claude | Inspiring messages and coaching |
| **Advice** | GPT | General productivity advice |
| **Goal Breakdown** | Gemini | Structured task decomposition |
| **Productivity** | Perplexity | Research and insights |
| **Creative** | xAI | Brainstorming and creative tasks |
| **Analysis** | DeepSeek | Problem-solving and analysis |

---

## 🔄 **Fallback System**

If the primary provider fails, the system automatically falls back:

| Primary | Fallback |
|---------|----------|
| Gemini | Claude |
| Claude | GPT |
| GPT | Gemini |
| Perplexity | DeepSeek |
| DeepSeek | Perplexity |
| xAI | Claude |

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Function Not Found (404)**
- ✅ Check Netlify Functions directory structure
- ✅ Ensure `netlify/functions/ai-proxy.js` exists
- ✅ Verify function deployment

#### **2. API Key Errors**
- ✅ Check environment variable names
- ✅ Verify API keys are valid
- ✅ Ensure keys have proper permissions

#### **3. Rate Limiting**
- ✅ Check user rate limits
- ✅ Monitor API provider limits
- ✅ Implement proper error handling

#### **4. CORS Issues**
- ✅ Verify CORS headers in function
- ✅ Check domain whitelisting
- ✅ Test with different browsers

---

## 📈 **Performance Optimization**

### **Response Times**
- **Target**: < 3 seconds per request
- **Fallback**: Automatic provider switching
- **Caching**: Implement response caching for common queries

### **Cost Optimization**
- **Credit System**: Limit user AI usage
- **Provider Selection**: Use cost-effective providers
- **Monitoring**: Track usage and costs

---

## 🎯 **Next Steps**

1. ✅ **Deploy to Netlify**
2. ✅ **Configure Environment Variables**
3. ✅ **Test AI Proxy Function**
4. ✅ **Verify All Providers Work**
5. ✅ **Monitor Usage and Performance**
6. ✅ **Set Up Alerts and Monitoring**

---

## 🔗 **Useful Links**

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Firebase Console](https://console.firebase.google.com)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Anthropic Console](https://console.anthropic.com/)
- [OpenAI Platform](https://platform.openai.com/api-keys)
- [Perplexity API](https://www.perplexity.ai/settings/api)
- [DeepSeek API](https://platform.deepseek.com/api-keys)
- [xAI Platform](https://console.x.ai/)

---

**🎉 Your multi-AI Operator Uplift platform is now ready for production!** 