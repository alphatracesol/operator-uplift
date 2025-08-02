module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    serviceworker: true
  },
  extends: [
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  plugins: [
    'security'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Error prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    
    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    
    // Security
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    
    // Best practices
    'eqeqeq': 'error',
    'curly': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Styling
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error'
  },
  globals: {
    // Firebase
    'firebase': 'readonly',
    'firebaseui': 'readonly',
    
    // External libraries
    'Chart': 'readonly',
    'gsap': 'readonly',
    'tsParticles': 'readonly',
    'Tone': 'readonly',
    
    // Service Worker
    'self': 'readonly',
    'caches': 'readonly',
    'fetch': 'readonly',
    'Request': 'readonly',
    'Response': 'readonly',
    'Headers': 'readonly',
    'URL': 'readonly',
    'URLSearchParams': 'readonly',
    
    // Browser APIs
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'indexedDB': 'readonly',
    'navigator': 'readonly',
    'location': 'readonly',
    'history': 'readonly',
    'document': 'readonly',
    'window': 'readonly',
    'console': 'readonly',
    'setTimeout': 'readonly',
    'setInterval': 'readonly',
    'clearTimeout': 'readonly',
    'clearInterval': 'readonly',
    'Promise': 'readonly',
    'JSON': 'readonly',
    'Math': 'readonly',
    'Date': 'readonly',
    'Array': 'readonly',
    'Object': 'readonly',
    'String': 'readonly',
    'Number': 'readonly',
    'Boolean': 'readonly',
    'Function': 'readonly',
    'RegExp': 'readonly',
    'Error': 'readonly',
    'TypeError': 'readonly',
    'ReferenceError': 'readonly',
    'SyntaxError': 'readonly',
    'RangeError': 'readonly',
    'EvalError': 'readonly',
    'URIError': 'readonly'
  }
}; 