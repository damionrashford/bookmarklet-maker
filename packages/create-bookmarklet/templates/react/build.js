
const esbuild = require('esbuild');
const config = require('./bookmarklet.config');
const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        await fs.emptyDir(config.outDir);

        await esbuild.build({
            entryPoints: [config.entry],
            bundle: true,
            outdir: config.outDir,
            minify: true,
            format: 'iife', // or 'esm' if you prefer
            define: {
                'process.env.NODE_ENV': '"production"' // Optimize React
            },
            jsxFactory: 'jsx',  // Use custom JSX runtime
            jsxFragment: 'Fragment', // Use custom JSX runtime
            inject: [path.resolve(__dirname, '../../shared/jsx-runtime.js')], // Inject JSX runtime.  Correct path!
            outfile: path.join(config.outDir, 'bookmarklet.js')
        });

        console.log('✅ React build completed successfully');
    } catch (err) {
        console.error('🚨 Build failed:', err);
        process.exit(1);
    }
}

build();
