import { getHtmlAST } from './ast'
import { getIndent } from './utils'

/**
 * Get css tree by html tree
 *
 * @param htmltree
 * @returns {string}
 */

export default function html2stylus(html) {
  const AST = getHtmlAST(html)
  const code = []

  function gen(tag, depth) {
    const indent = getIndent(depth)
    const tagClass = tag.attrs.find(attr => attr.name === 'class')
    const selector = tagClass ? '.' + tagClass.value : tag.tagname
    if (tag.nodes.length > 0) {
      code.push(`${indent}${selector}`)
      for (const item of tag.nodes) {
        gen(item, depth + 1)
      }
      code.push(`${indent}`)
    } else {
      code.push(`${indent}${selector}`)
      code.push(`${indent}`)
    }
  }

  for (const tag of AST) {
    gen(tag, 0)
  }
  return code.join('\n')
}
