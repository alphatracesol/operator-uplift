const fs = require('fs');
const path = require('path');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log('Created build directory');
}

// Copy HTML files
const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));
htmlFiles.forEach(file => {
    const sourcePath = path.join(rootDir, file);
    const destPath = path.join(buildDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file}`);
});

// Copy assets directory
const assetsDir = path.join(rootDir, 'assets');
if (fs.existsSync(assetsDir)) {
    const buildAssetsDir = path.join(buildDir, 'assets');
    if (!fs.existsSync(buildAssetsDir)) {
        fs.mkdirSync(buildAssetsDir, { recursive: true });
    }
    
    function copyDir(src, dest) {
        const items = fs.readdirSync(src);
        items.forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            const stat = fs.statSync(srcPath);
            
            if (stat.isDirectory()) {
                if (!fs.existsSync(destPath)) {
                    fs.mkdirSync(destPath, { recursive: true });
                }
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }
    
    copyDir(assetsDir, buildAssetsDir);
    console.log('Copied assets directory');
}

// Copy individual files
const filesToCopy = ['manifest.json', 'sw.js', 'site.webmanifest'];
filesToCopy.forEach(file => {
    const sourcePath = path.join(rootDir, file);
    if (fs.existsSync(sourcePath)) {
        const destPath = path.join(buildDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file}`);
    } else {
        console.log(`${file} not found, skipping`);
    }
});

console.log('File copying completed successfully!'); 