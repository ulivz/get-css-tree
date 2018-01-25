import parse7 from 'parse7'

/**
 * Get html AST by parsing
 *
 * @param {string} html
 * @returns {Array}
 */
export function getHtmlAST(html) {
  const stack = []
  const htmltree = []

  const tagStart = (name, attrs) => {
    const top = stack[stack.length - 1]
    const tag = {
      attrs,
      tagname: name,
      nodes: []
    }
    stack.push(tag)
    if (typeof top === 'undefined') {
      htmltree.push(tag)
    } else {
      top.nodes.push(tag)
    }
  }

  const tagEnd = () => stack.pop()
  parse7(html, { tagStart, tagEnd })
  return htmltree
}
