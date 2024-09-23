import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/light_editor.js'],
  bundle: true,
  outfile: 'docs/bundle.js',
  sourcemap: true,
  loader: {'.svg': 'text'}
})
