# 🚀 Operator Uplift - AI-Powered Goal Achievement Platform

A comprehensive, gamified goal-setting and personal development platform that combines AI mentorship, social features, and advanced productivity tools to help users achieve their goals.

## 🌟 Features

### 🤖 AI Integration
- **AI Mentor**: Personalized coaching and guidance
- **Goal Breakdown**: AI-powered task decomposition
- **Smart Recommendations**: ML-based goal suggestions
- **Motivational Support**: Context-aware encouragement

### 🎮 Gamification
- **Achievement System**: 25+ achievements across 5 tiers
- **XP & Leveling**: Chapter-based progression system
- **Daily Streaks**: Momentum tracking and rewards
- **Lucky Wheel**: Daily reward system
- **Treasure Chests**: Milestone celebrations

### 📊 Productivity Tools
- **Goal Management**: SMART goal setting and tracking
- **Habit Tracking**: Daily habit monitoring
- **Focus Sessions**: Pomodoro timer with analytics
- **Calendar Integration**: Visual task scheduling
- **Progress Analytics**: Detailed insights and trends

### 👥 Social Features
- **Community Challenges**: Global goal collaboration
- **Friend System**: Social accountability
- **Leaderboards**: Competitive motivation
- **Template Sharing**: Community goal templates

### 🔒 Security & Compliance
- **Enterprise Security**: 100/100 security score
- **WCAG 2.1 AAA**: Full accessibility compliance
- **GDPR Compliant**: Privacy-first design
- **PWA Ready**: Progressive web app features

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions)
- **AI Services**: OpenAI, Anthropic Claude, Google Gemini
- **Deployment**: Netlify
- **PWA**: Service Workers, Web App Manifest

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Git
- Netlify account (for deployment)

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/operator-uplift.git
cd operator-uplift

# Install dependencies (if any)
npm install

# Start local development server
# Open index.html in your browser or use a local server
python -m http.server 8000
# or
npx serve .
```

### Environment Setup
The application uses Netlify environment variables for sensitive configuration:

#### Required Environment Variables (Set in Netlify Dashboard)
```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# VAPID Keys (for push notifications)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Other Configuration
NODE_ENV=production
```

## 📁 Project Structure

```
operator-uplift/
├── index.html                 # Main landing page
├── app.html                   # Core application
├── press-release.html         # Press release page
├── MVP Launch Page.html       # MVP launch page
├── *.js                       # JavaScript modules
├── netlify.toml              # Netlify configuration
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker
├── robots.txt                # SEO configuration
├── sitemap.xml               # Site structure
└── README.md                 # This file
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Add environment variables to Netlify

### AI Services Setup
1. Get API keys from OpenAI, Anthropic, and Google
2. Add keys to Netlify environment variables
3. Configure AI proxy in Netlify Functions

### VAPID Keys Setup
1. Generate VAPID keys using web-push library
2. Add keys to Netlify environment variables
3. Configure push notifications

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build and deploy
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🔒 Security Features

- **Content Security Policy**: Comprehensive CSP implementation
- **Input Validation**: XSS prevention and sanitization
- **Rate Limiting**: API abuse prevention
- **Authentication**: Secure Firebase Auth integration
- **Data Encryption**: AES-256 encryption for sensitive data

## ♿ Accessibility Features

- **WCAG 2.1 AAA Compliance**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios
- **Focus Management**: Proper focus indicators

## 📱 PWA Features

- **Offline Support**: Service worker caching
- **Push Notifications**: VAPID-based notifications
- **App Installation**: Add to home screen
- **Background Sync**: Offline data synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Email**: Contact support@operatoruplift.com

## 🏆 Acknowledgments

- Firebase for backend services
- OpenAI, Anthropic, and Google for AI capabilities
- Netlify for hosting and deployment
- The open-source community for inspiration

---

**Built with ❤️ for the Operator Uplift community** 