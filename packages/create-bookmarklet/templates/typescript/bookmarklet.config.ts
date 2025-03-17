
interface BookmarkletConfig {
    entry: string;
    outDir: string;
    tsOptions: {
        target: 'es2015' | 'es2020' | 'esnext';
        declaration: boolean;
        strict: boolean;
    };
    bundleOptions: {
        format: 'cjs' | 'esm';
        sourcemap: boolean;
        minify: boolean;
    };
    banner?: string;
}

const config: BookmarkletConfig = {
    entry: './src/main.ts',
    outDir: './dist',
    tsOptions: {
        target: 'esnext',
        declaration: true,
        strict: true
    },
    bundleOptions: {
        format: 'esm',
        sourcemap: process.env.NODE_ENV !== 'production',
        minify: true
    },
    banner: `// Bookmarklet generated at ${new Date().toISOString()}`
};

// CommonJS export for Node.js compatibility
module.exports = config;
