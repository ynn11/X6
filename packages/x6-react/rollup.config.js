import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'
import autoExternal from 'rollup-plugin-auto-external'

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'X6React',
      format: 'umd',
      file: 'dist/x6-react.js',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDom',
        '@antv/x6': 'X6',
      },
    },
  ],
  plugins: [
    typescript({ declaration: false }),
    resolve(),
    commonjs(),
    terser(),
    filesize(),
    autoExternal(),
  ],
}
