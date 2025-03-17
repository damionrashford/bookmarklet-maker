
// @ts-check
const fs = require('fs-extra');
const esbuild = require('esbuild');
const config = require('./bookmarklet.config');

// Type definitions for config
/** @typedef {typeof import('./bookmarklet.config')} Config */

async function build() {
    try {
        /** @type {Config} */
        const cfg = config;

        await fs.emptyDir(cfg.outDir);

        await esbuild.build({
            entryPoints: [cfg.entry],
            bundle: true,
            outdir: cfg.outDir,
            target: cfg.tsOptions.target,
            format: cfg.bundleOptions.format,
            sourcemap: cfg.bundleOptions.sourcemap,
            minify: cfg.bundleOptions.minify,
            banner: cfg.banner ? { js: cfg.banner } : undefined,
            legalComments: 'none',
            logLevel: 'info'
        });

        console.log('✅ TypeScript build completed successfully');
    } catch (err) {
        console.error('🚨 Build failed:', err);
        process.exit(1);
    }
}

build();
