# Tests Directory

This directory contains test files and utilities for development and debugging purposes. These files are not part of the production application.

## Files in this Directory

### **SECURITY_TEST.html**
- **Purpose**: Comprehensive security test suite for the application
- **Usage**: Run to test security implementations, authentication, and validation
- **Notes**: Shows warnings in local development environment

### **test-ai-proxy.html**
- **Purpose**: Test file for AI proxy functionality
- **Usage**: Test AI proxy authentication and input validation
- **Notes**: Development tool for debugging AI integration

### **test-firebase.html**
- **Purpose**: Test file for Firebase integration
- **Usage**: Test Firebase authentication and database connections
- **Notes**: Development tool for debugging Firebase functionality

### **update-sw.html**
- **Purpose**: Service worker update utility
- **Usage**: Test and update service worker functionality
- **Notes**: Development tool for PWA features

## Usage Guidelines

1. **Development only** - These files are for development and testing
2. **Not for production** - Do not deploy these files to production
3. **Debugging tools** - Use to troubleshoot specific functionality
4. **Security testing** - Run security tests before deployment

## Testing Workflow

1. **Local Development**: Run tests locally to verify functionality
2. **Pre-deployment**: Run security tests before deploying changes
3. **Debugging**: Use specific test files to isolate issues
4. **Documentation**: Update test files as functionality changes

## Security Notes

- Test files may contain development-specific configurations
- Do not include hardcoded secrets in test files
- Use environment variables for sensitive data
- Clean up test data after use 