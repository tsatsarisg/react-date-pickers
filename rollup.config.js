const packageJson = require('./package.json')
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'esm',
            sourcemap: false,
            exports: 'named',
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        typescript({
            tsconfig: './tsconfig.json',
            useTsconfigDeclarationDir: true,
        }),
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
