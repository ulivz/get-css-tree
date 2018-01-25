import { getHtmlAST } from './ast'
import { getIndent, getUuid } from './utils'

/**
 * Get css tree by html tree
 *
 * @param htmltree
 * @returns {string}
 */

export default function html2scss(html) {
  const AST = getHtmlAST(html)
  const code = []
  const classStack = {}

  function gen(tag, depth, uuid) {
    const indent = getIndent(depth)
    const tagClass = tag.attrs.find(attr => attr.name === 'class')
    const selector = tagClass ? '.' + tagClass.value : tag.tagname
    const selectorKey = uuid + selector
    if (!classStack[selectorKey]) {
      if (tag.nodes.length > 0) {
        code.push(`${indent}${selector} {`)
        let id = getUuid()
        for (const item of tag.nodes) {
          gen(item, depth + 1, id)
        }
        code.push(`${indent}}`)
      } else {
        code.push(`${indent}${selector} {`)
        code.push(`${indent}}`)
      }
      classStack[selectorKey] = selector
    }
  }

  for (const tag of AST) {
    gen(tag, 0, getUuid())
  }
  return code.join('\n')
}
