import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'

const root = fileURLToPath(new URL('../src/', import.meta.url))
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const errors = []
const files = fs.readdirSync(root, { recursive: true })
  .filter(file => /\.(ts|vue)$/.test(file))

function checkImport(file, specifier) {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return
  const target = specifier.startsWith('@/')
    ? path.resolve(root, specifier.slice(2))
    : path.resolve(root, path.dirname(file), specifier)
  const relative = path.relative(root, target).split('?')[0]
  const [fromLayer, fromSlice] = file.split(path.sep)
  const [toLayer, toSlice] = relative.split(path.sep)
  if (!layers.includes(toLayer)) {
    errors.push(`${file}: import outside FSD layers: ${specifier}`)
    return
  }
  if (layers.indexOf(toLayer) < layers.indexOf(fromLayer)) {
    errors.push(`${file}: upward import: ${specifier}`)
  }
  if (fromLayer === toLayer) {
    if (!['app', 'shared'].includes(fromLayer) && fromSlice !== toSlice) {
      errors.push(`${file}: cross-slice import: ${specifier}`)
    }
    return
  }
  if (!['app', 'shared'].includes(toLayer) && !/^[^/]+\/[^/]+(?:\/index(?:\.ts)?)?$/.test(relative)) {
    errors.push(`${file}: use the slice public API: ${specifier}`)
  }
}

for (const file of files) {
  if (!layers.includes(file.split(path.sep)[0])) {
    errors.push(`${file}: source must belong to an FSD layer`)
    continue
  }
  let source = fs.readFileSync(path.join(root, file), 'utf8')
  if (file.endsWith('.vue')) {
    const { descriptor } = parse(source)
    source = [descriptor.script?.content, descriptor.scriptSetup?.content].filter(Boolean).join('\n')
  }
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      checkImport(file, node.moduleSpecifier.text)
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      checkImport(file, node.arguments[0].text)
    }
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      checkImport(file, node.argument.literal.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`FSD boundaries passed (${files.length} TypeScript/Vue files).`)
}
