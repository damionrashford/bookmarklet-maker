
const fs = require('fs-extra');
const { minify } = require('terser');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

module.exports = async () => {
    try {
        // Clean output directory
        await fs.emptyDir('./dist');

        // Compile Python to JS using Brython
        await exec('brython-cli --make_dist --modules', { cwd: './src' }); // Use --modules for optimized output

        // Combine core + stdlib + compiled code
        const core = await fs.readFile('./src/brython.js', 'utf-8'); // Use compiled brython.js
        const python = await fs.readFile('./src/__target__/main.js', 'utf-8'); // Use compiled main.js

        // Generate final code
        const wrapper = `
    (function(){
      ${core}
      try {
        ${python}
      } catch(err) {
        console.error('Brython error:', err);
      }
      window._bookmarkletCleanup = () => {
        document.getElementById('brython-root').remove();
        __BRYTHON__.modules = {}; // Clear modules
        __BRYTHON__.imported = {}; // Clear imported
      };
    })()`;

        // Minify
        const { code: minified } = await minify(wrapper, {
            mangle: { toplevel: true },
            compress: { drop_console: true }
        });

        await fs.outputFile('./dist/bookmarklet.js', minified);
        console.log('Python bookmarklet built!');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
};
