
module.exports = {
    entry: './src/main.jsx',
    outDir: './build',
    reactOptions: {
        jsxRuntime: 'automatic',
        devServer: {
            port: 3000,
            hotReload: true
        }
    },
    bundleSettings: {
        format: 'esm',
        splitting: true
    }
};
