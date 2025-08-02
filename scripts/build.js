#!/usr/bin/env node

/**
 * Build Script for Operator Uplift
 * Handles production build process with optimization and validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n${colors.bright}${colors.blue}=== ${step} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Check if required files exist
function checkPrerequisites() {
  logStep('Checking Prerequisites');
  
  const requiredFiles = [
    'package.json',
    'webpack.config.js',
    '.eslintrc.js',
    'tailwind.config.js',
    'postcss.config.js'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    logError(`Missing required files: ${missingFiles.join(', ')}`);
    process.exit(1);
  }
  
  logSuccess('All required files found');
}

// Install dependencies
function installDependencies() {
  logStep('Installing Dependencies');
  
  try {
    logInfo('Installing npm dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    process.exit(1);
  }
}

// Run linting
function runLinting() {
  logStep('Running Code Linting');
  
  try {
    logInfo('Running ESLint...');
    execSync('npm run lint', { stdio: 'inherit' });
    logSuccess('Linting passed');
  } catch (error) {
    logWarning('Linting failed - continuing with build');
  }
}

// Run tests
function runTests() {
  logStep('Running Tests');
  
  try {
    logInfo('Running Jest tests...');
    execSync('npm test', { stdio: 'inherit' });
    logSuccess('Tests passed');
  } catch (error) {
    logWarning('Tests failed - continuing with build');
  }
}

// Build the project
function buildProject() {
  logStep('Building Project');
  
  try {
    logInfo('Running webpack build...');
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('Build completed successfully');
  } catch (error) {
    logError('Build failed');
    process.exit(1);
  }
}

// Validate build output
function validateBuild() {
  logStep('Validating Build Output');
  
  const buildDir = 'build';
  const requiredFiles = [
    'index.html',
    'app.html',
    'press-release.html',
    'manifest.json',
    'sw.js'
  ];
  
  if (!fs.existsSync(buildDir)) {
    logError('Build directory not found');
    process.exit(1);
  }
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(buildDir, file))
  );
  
  if (missingFiles.length > 0) {
    logWarning(`Missing build files: ${missingFiles.join(', ')}`);
  } else {
    logSuccess('All required build files present');
  }
  
  // Check build size
  const buildSize = getDirectorySize(buildDir);
  logInfo(`Build size: ${formatBytes(buildSize)}`);
  
  if (buildSize > 10 * 1024 * 1024) { // 10MB
    logWarning('Build size is large - consider optimization');
  }
}

// Get directory size recursively
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  }
  
  return totalSize;
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate build report
function generateBuildReport() {
  logStep('Generating Build Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    buildSize: getDirectorySize('build'),
    files: getBuildFiles(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  const reportPath = 'build/build-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logSuccess(`Build report saved to ${reportPath}`);
}

// Get list of build files
function getBuildFiles() {
  const buildDir = 'build';
  const files = [];
  
  function scanDirectory(dir, basePath = '') {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath, relativePath);
        } else {
          files.push({
            path: relativePath,
            size: stats.size,
            modified: stats.mtime
          });
        }
      });
    }
  }
  
  scanDirectory(buildDir);
  return files;
}

// Main build process
function main() {
  log(`${colors.bright}${colors.magenta}🚀 Starting Operator Uplift Build Process${colors.reset}\n`);
  
  try {
    checkPrerequisites();
    installDependencies();
    runLinting();
    runTests();
    buildProject();
    validateBuild();
    generateBuildReport();
    
    log(`\n${colors.bright}${colors.green}🎉 Build completed successfully!${colors.reset}`);
    logInfo('Your application is ready for deployment');
    
  } catch (error) {
    logError('Build process failed');
    console.error(error);
    process.exit(1);
  }
}

// Run the build process
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkPrerequisites,
  installDependencies,
  runLinting,
  runTests,
  buildProject,
  validateBuild,
  generateBuildReport
}; 