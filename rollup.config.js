const packageJson = require('./package.json')
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
            exports: 'named',
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
        postcss({
            config: {
                path: './postcss.config.js',
            },
            extensions: ['.css'],
            minimize: true,
            inject: {
                insertAt: 'top',
            },
        }),
        terser(),
    ],
    external: ['react', 'react-dom'],
}
