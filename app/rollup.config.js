import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
    input: 'index.ts',
    output: {
        file: '../www/public/bundle.js',
        format: 'iife', // Use 'iife' for browser, not 'cjs'
        name: 'Liu', // Required for iife format
        sourcemap: true,
        globals: {
            // Add any global dependencies here if needed
        }
    },
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: false,
            mainFields: ['browser', 'module', 'main']
        }),
        commonjs({
            transformMixedEsModules: true,
            // Handle the "this" issue in Supabase modules
            requireReturnsDefault: 'auto'
        }),
        json(), // Add this to handle JSON imports
        typescript({ 
            tsconfig: './tsconfig.json',
            sourceMap: true,
            inlineSources: true
        }),
        // terser() // Uncomment for production
    ],
    // Suppress the "this" warning for known safe modules
    onwarn(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') {
            // Supabase modules use transpiled async/await which triggers this warning
            // It's safe to ignore for these modules
            return;
        }
        warn(warning);
    }
};