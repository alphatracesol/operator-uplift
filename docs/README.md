# Operator Uplift 🚀

**AI-Powered Self-Progression Platform** - Transform your ambitions into epic quests with gamified productivity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)
[![Security](https://img.shields.io/badge/Security-Audited-green.svg)](https://github.com/operatoruplift/operator-uplift/security)

## 🌟 Overview

Operator Uplift bridges the execution gap for high-agency operators by breaking down complex goals into psychologically optimized "quick wins" and motivation-focused action plans. Leveraging advanced AI models and a personalized AI mentor, it replaces fragmented traditional task managers with a unified, dynamic platform focused on intrinsic motivation, strategic clarity, and sustained momentum.

## ✨ Features

- 🤖 **AI-Driven Goal Deconstruction** - Breaks goals into tactical phases enriched with engagement elements
- 🎯 **Psychological Quick Wins** - Crafts tasks designed for immediate motivation surges and addictive progress
- 🧠 **Personalized AI Mentor** - Adaptive guidance and real-time adjustments
- 🏆 **Gamified Progress Tracking** - Earn Essence, unlock achievements, and level up your life
- 🔄 **Real-time Synchronization** - Seamless data sync across devices with offline support
- 🎨 **Beautiful UI/UX** - Modern, responsive design with smooth animations
- 🔒 **Enterprise Security** - Comprehensive security with Firebase Authentication and Firestore
- 📱 **Progressive Web App** - Install as native app with offline capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/operatoruplift/operator-uplift.git
   cd operator-uplift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
operator-uplift/
├── assets/                    # Static assets
│   ├── images/               # Image files
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript modules
│   └── fonts/                # Custom fonts
├── components/               # Reusable components
├── pages/                    # Additional pages
├── docs/                     # Documentation
├── tests/                    # Test files
├── build/                    # Build output
├── config/                   # Configuration files
├── netlify/                  # Netlify functions
│   └── functions/           # Serverless functions
├── index.html               # Landing page
├── app.html                 # Main application
├── press-release.html       # Press release page
├── manifest.json            # PWA manifest
├── sw.js                    # Service worker
├── firestore.rules          # Firestore security rules
├── netlify.toml             # Netlify configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server with live reload
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run deploy` - Deploy to production
- `npm run security:audit` - Run security audit
- `npm run performance:audit` - Run performance audit

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom CSS Variables
- **Animations**: GSAP, CSS Animations
- **Charts**: Chart.js
- **Audio**: Tone.js
- **Particles**: tsParticles
- **Backend**: Firebase (Authentication, Firestore)
- **Serverless**: Netlify Functions
- **Deployment**: Netlify
- **PWA**: Service Worker, Web App Manifest

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Netlify Functions
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
ALLOWED_ORIGIN=https://your-domain.netlify.app

# AI Configuration
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-4
AI_MAX_TOKENS=2000

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
FACEBOOK_PIXEL_ID=your_pixel_id
```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Add your web app to Firebase
4. Update `firestore.rules` with your security rules
5. Set up environment variables

### Netlify Setup

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Set environment variables in Netlify dashboard
4. Deploy

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
├── fixtures/      # Test data
└── utils/         # Test utilities
```

## 🔒 Security

### Security Features

- ✅ Content Security Policy (CSP)
- ✅ Firebase Authentication
- ✅ Firestore Security Rules
- ✅ Input Validation
- ✅ XSS Prevention
- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ Secure Headers

### Security Audit

```bash
npm run security:audit
```

## 📊 Performance

### Performance Features

- ✅ Service Worker Caching
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Lazy Loading
- ✅ Gzip Compression
- ✅ CDN Integration
- ✅ PWA Optimization

### Performance Audit

```bash
npm run performance:audit
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deploy to Netlify

```bash
npm run deploy
```

### Manual Deployment

1. Build the project: `npm run build`
2. Upload `build/` directory to your hosting provider
3. Configure your domain and SSL

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📧 Email: operatoruplift@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/operatoruplift/operator-uplift/issues)
- 📖 Documentation: [Docs](docs/)
- 💬 Community: [Discussions](https://github.com/operatoruplift/operator-uplift/discussions)

### FAQ

See our [FAQ](docs/FAQ.md) for common questions and answers.

## 🗺️ Roadmap

### Upcoming Features

- [ ] Discipline Points system
- [ ] Advanced AI mentor capabilities
- [ ] Community features
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

### Version History

See [CHANGELOG.md](docs/CHANGELOG.md) for a complete version history.

## 🙏 Acknowledgments

- **The Residency** - Delta Sprint program
- **Firebase** - Backend infrastructure
- **Netlify** - Hosting and serverless functions
- **OpenAI** - AI capabilities
- **Community** - Beta testers and feedback

---

**Made with ❤️ by the Operator Uplift Team**

*Deconstruct Your Ambition. Engineer Your Ascent.* 