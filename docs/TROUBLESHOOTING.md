# 🔧 Troubleshooting Guide

## 🚨 **Current Issues & Solutions**

### **1. Chart.js Import Error**
**Error**: `Cannot use import statement outside a module`

**✅ Fixed**: Changed from `chart.min.js` to `chart.umd.js`
- Updated in both `app.html` and `Operator_Uplift_Complete.html`

### **2. Firebase Invalid API Key**
**Error**: `Firebase: Error (auth/invalid-api-key)`

**🔧 Solution**: Environment variables not set up correctly

## 🚀 **Quick Fix Steps**

### **Step 1: Check Netlify Function**
1. Go to your Netlify dashboard
2. Click on your site
3. Go to **Functions** tab
4. Check the logs for the `config` function
5. Look for the debug messages about environment variables

### **Step 2: Verify Environment Variables**
In Netlify dashboard → Site settings → Environment variables, make sure you have:

```
FIREBASE_API_KEY=your_actual_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### **Step 3: Test Netlify Function**
Visit: `https://your-site.netlify.app/.netlify/functions/config`

You should see JSON like:
```json
{
  "firebaseConfig": {
    "apiKey": "your_api_key",
    "authDomain": "your_project.firebaseapp.com",
    ...
  }
}
```

If you see `"MISSING_API_KEY"`, the environment variables aren't set.

### **Step 4: Redeploy**
1. Make a small change to trigger redeploy
2. Or manually redeploy from Netlify dashboard

## 🔍 **Debug Steps**

### **Check Function Logs:**
1. Netlify dashboard → Functions → config function
2. Look for console.log messages
3. Check if environment variables are being read

### **Test Function Directly:**
```bash
curl https://your-site.netlify.app/.netlify/functions/config
```

### **Check Environment Variables:**
1. Netlify dashboard → Site settings → Environment variables
2. Make sure all Firebase variables are set
3. Check for typos in variable names

## 🎯 **Expected Result**
After fixing:
- ✅ Chart.js loads without import errors
- ✅ Firebase initializes successfully
- ✅ Login/registration works
- ✅ App functions normally

---
**Status**: 🔧 **Fixing environment variable issues** 