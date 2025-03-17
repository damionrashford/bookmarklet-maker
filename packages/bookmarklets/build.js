// efficiency-bookmarklets/build.js
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function buildAll() {
    try {
        const packagesDir = path.join(__dirname, 'packages');
        const packageDirs = await fs.readdir(packagesDir);

        for (const packageDir of packageDirs) {
            const fullPackagePath = path.join(packagesDir, packageDir);
            if (fs.statSync(fullPackagePath).isDirectory()) {
                console.log(`Building package: ${packageDir}`);
                execSync('npm run build', { cwd: fullPackagePath, stdio: 'inherit' });
            }
        }

        console.log('✅ All bookmarklets built successfully!');

    } catch (err) {
        console.error('🚨 Build failed:', err);
        process.exit(1);
    }
}

buildAll();