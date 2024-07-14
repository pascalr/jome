import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/editor.js'],
  bundle: true,
  outfile: 'docs/bundle.js',
  sourcemap: true,
})
