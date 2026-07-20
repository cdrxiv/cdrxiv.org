import { copyFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const pdfjsDirectory = dirname(require.resolve('pdfjs-dist/package.json'))

copyFileSync(
  join(pdfjsDirectory, 'build/pdf.worker.min.mjs'),
  join(process.cwd(), 'public/pdf.worker.min.mjs'),
)
