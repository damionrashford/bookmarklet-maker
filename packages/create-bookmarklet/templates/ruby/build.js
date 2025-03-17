
const fs = require('fs-extra');
const { minify } = require('terser');
const { compile } = require('opal-compiler');
const path = require('path');

module.exports = async () => {
    try {
        // 1. Clean output directory
        await fs.emptyDir('./dist');

        // 2. Read Ruby source files
        const [mainCode, helloCode] = await Promise.all([
            fs.readFile('./src/main.rb', 'utf-8'),
            fs.readFile('./src/features/hello.rb', 'utf-8')
        ]);

        // 3. Compile Ruby to JavaScript with advanced options
        const compiled = compile(`
            require 'corelib'
            ${helloCode}
            ${mainCode}
        `, {
            arity_check: false,
            dynamic_require_severity: 'ignore',
            method_missing: true,
            esm: true,
            requirable: false
        });

        // 4. Optimize compiled output
        const optimized = compiled
            .replace(/Opal\.constants\s*=\s*.+?};/s, '')
            .replace(/Opal\.version\s*=\s*'[^']+';/, '');

        // 5. Load Opal runtime
        const [opalRuntime, opalCorelib] = await Promise.all([
            fs.readFile('./opal/opal.min.js', 'utf-8'),
            fs.readFile('./opal/corelib.min.js', 'utf-8')
        ]);

        // 6. Generate final code with enhanced cleanup
        const wrapper = `
        (function(){
            'use strict';
            ${opalRuntime}
            ${opalCorelib}
            var __cleanup = function() {
                if(typeof Opal.Bookmarklet !== 'undefined' &&
                   typeof Opal.Bookmarklet.Application !== 'undefined') {
                    Opal.Bookmarklet.Application.$unmount();
                }
                if(Opal.gc) Opal.gc(true);
            };
            ${optimized}
            window._bookmarkletCleanup = __cleanup;
        })()`.trim();

        // 7. Advanced minification
        const { code: minified } = await minify(wrapper, { mangle: {
                reserved: [ 'Opal',
                    '__cleanup',
                    '_bookmarkletCleanup',
                    '$document',
                    'unmount',
                    'Application',
                    'Hello'
                ],
                properties: { regex: /^_/ }
            },
            compress: {
                sequences: true,
                dead_code: true,
                drop_console: true,
                drop_debugger: true,
                unsafe: true,
                passes: 3
            },
            format: {
                comments: false
            }
        });

        // 8. Write final output
        await fs.writeFile('./dist/bookmarklet.js', minified);
        console.log('✅ Ruby bookmarklet built successfully!');
        console.log('📦 Final size:', Buffer.byteLength(minified), 'bytes');

    } catch (err) {
        console.error('🚨 Build failed:', err);
        process.exit(1);
    }
};
