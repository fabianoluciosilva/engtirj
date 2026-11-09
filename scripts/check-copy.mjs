// Verifica o vocabulário do texto visível (app, components, lib).
// Uso: node scripts/check-copy.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const roots = ['app', 'components', 'lib']
// Arquivos que não são texto visível do site (geração do blog, schema, este script).
const skip = [/blog-topics\.ts$/, /blog-generator\.ts$/, /JsonLd\.tsx$/, /check-copy/]
const files = []
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(f) && !skip.some((r) => r.test(p))) files.push(p)
  }
}
roots.forEach(walk)
const text = files.map((f) => readFileSync(f, 'utf8')).join('\n')

const banned = [/\bdores?\b/gi]
const limited = [
  [/alta performance/gi, 2],
  [/projetos pesados/gi, 2],
  [/especializad[oa]s?/gi, 2],
  [/exclusivamente/gi, 2],
]

let fail = false
for (const re of banned) {
  const n = (text.match(re) ?? []).length
  if (n) {
    console.error(`FAIL ${re}: ${n} ocorrências (máx 0)`)
    fail = true
  }
}
for (const [re, max] of limited) {
  const n = (text.match(re) ?? []).length
  if (n > max) {
    console.error(`FAIL ${re}: ${n} ocorrências (máx ${max})`)
    fail = true
  }
}
if (fail) process.exit(1)
console.log('copy OK')
