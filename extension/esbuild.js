const esbuild = require('esbuild');
const path = require("path")

esbuild.build({
    entryPoints: [path.join(__dirname, 'src/extension.ts')],
    bundle: true,
    outfile: path.join(__dirname, 'dist/extension.js'),
    external: ['vscode'],
    platform: "node",
    format: "cjs",
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)
        },
    },
    sourcemap: true
}).catch(err => {
    process.stderr.write(err.stderr)
    process.exit(1)
})