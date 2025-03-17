
const fs = require('fs-extra');
const { minify } = require('terser');
const esbuild = require('esbuild');
const path = require('path');
const config = require('./bookmarklet.config');

module.exports = async () => {
    try {
        // 1. Clean output directory
        await fs.emptyDir(config.outputDir);

        // 2. Bundle with esbuild (no minification)
        await esbuild.build({
            entryPoints: [config.entry],
            bundle: true,
            format: 'iife',
            outfile: path.join(config.outputDir, '_temp.js'), // Use path.join
            metafile: true,
            minify: false,
            legalComments: 'none'
        });

        // 3. Read bundled code and add banner
        let code = await fs.readFile(path.join(config.outputDir, '_temp.js'), 'utf-8'); // Use path.join
        code = `${config.banner}\n${code}`;

        // 4. Advanced minification with Terser
        const { code: minified } = await minify(code, {
            mangle: {
                toplevel: true,
                reserved: ['_bookmarkletCleanup'] // Ensure _bookmarkletCleanup is preserved
            },
            compress: {
                sequences: true,
                dead_code: true,
                drop_console: config.minify,
                drop_debugger: true,
                unsafe: true
            },
            format: {
                comments: false
            }
        });

        // 5. Write final output
        await fs.outputFile(path.join(config.outputDir, 'bookmarklet.js'), minified); // Use path.join
        await fs.remove(path.join(config.outputDir, '_temp.js')); // Cleanup

        console.log('✅ Build complete!');
        console.log('📦 Final size:', Buffer.byteLength(minified), 'bytes');

    } catch (err) {
        console.error('🚨 Build failed:', err);
        process.exit(1); // Exit with error code
    }
};
