
module.exports = {
    mainRubyFile: './src/main.rb',
    opalDependencies: {
        corelib: './opal/corelib.min.js',
        compiler: './opal/opal.min.js',
        version: '1.8.0' // Match package.json version
    },
    outputConfig: {
        target: 'es2020',
        minify: true, // Enable minification
        sourcemaps: true
    }
};
