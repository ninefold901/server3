import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'index.ts',
    output: {
        file: 'dist/server.js',
        format: 'cjs'
    },
    plugins: [
        typescript({
            module: 'es6',
            allowJs: true
        }),
        terser()
    ]
};
