import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'index.ts',
    output: {
        // file: 'dist/server.js',
        format: 'cjs',
        dir: 'dist'
    },
    plugins: [
        commonjs(),
        typescript({
            module: 'es6',
            allowJs: true
        }),
        terser()
    ]
};
