# 🚀 Netlify Deployment Guide

## ✅ **Issues Fixed**
- ✅ Content Security Policy updated to allow inline scripts and workers
- ✅ Chart.js integrity check removed
- ✅ Netlify function created for Firebase config
- ✅ Tone.js worker now allowed

## 🔧 **Netlify Environment Variables**

Add these to your Netlify dashboard → Site Settings → Environment Variables:

### **Firebase Configuration:**
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### **AI API Keys:**
```
GEMINI_API_KEY=your_gemini_api_key
CLAUDE_API_KEY=your_claude_api_key
GROK_API_KEY=your_grok_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

## 🚀 **Deployment Steps**

### **1. Push to GitHub**
- Your code is ready to push
- All files are properly configured

### **2. Connect to Netlify**
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your `operator-uplift` repository
5. Build settings:
   - **Build command**: Leave empty
   - **Publish directory**: `/`
6. Click "Deploy site"

### **3. Add Environment Variables**
1. In Netlify dashboard → Site settings
2. Click "Environment variables"
3. Add all the variables listed above
4. Click "Save"

### **4. Configure Firebase**
1. Go to Firebase Console → Authentication → Settings
2. Add your Netlify domain to "Authorized domains"
3. Enable Email/Password authentication

## 🎯 **Test Your Site**
1. Go to your Netlify URL
2. Try registering a new account
3. Test goal creation and AI features
4. Check that login works properly

## 🔍 **Troubleshooting**

### **If login still freezes:**
1. Check browser console for errors
2. Verify Firebase environment variables are set correctly
3. Make sure Firebase project is properly configured
4. Check that Netlify function is working: `https://your-site.netlify.app/.netlify/functions/config`

### **If Netlify function fails:**
1. Check Netlify function logs in dashboard
2. Verify all environment variables are set
3. Make sure function file is in `netlify/functions/config.js`

---
**Status**: ✅ Ready for deployment with Netlify functions! 