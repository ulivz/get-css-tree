import SimpleHtmlParser from './src/html-parser'

/**
 * Get html tree by parsing
 *
 * @param html
 * @returns {Array}
 */
export function getHtmlTree(html) {
  const stack = []
  const htmltree = []

  const startElement = (name, attrs) => {
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

  const endElement = () => stack.pop()

  const noop = () => {
  }

  const parser = new SimpleHtmlParser()
  parser.parse(html, {
    startElement,
    endElement,
    characters: noop,
    comment: noop
  })

  return htmltree
}

/**
 * Get css tree by html tree
 *
 * @param htmltree
 * @returns {string}
 */

export function getCSSTreeByHtmlTree(htmltree) {
  const code = []
  const space = '	'

  function getIndent(depth) {
    let indent = ''
    while (depth > 0) {
      indent += space
      depth--
    }
    return indent
  }

  function gen(tag, depth) {
    const indent = getIndent(depth)
    const tagClass = tag.attrs.find(attr => attr.name === 'class').value
    const selector = tagClass ? '.' + tagClass : tag.tagname
    if (tag.nodes.length > 0) {
      code.push(`${indent}${selector} {`)
      for (const item of tag.nodes) {
        gen(item, depth + 1)
      }
      code.push(`${indent}}`)
    } else {
      code.push(`${indent}${selector} {`)
      code.push(`${indent}}`)
    }
  }

  if (Array.isArray(htmltree)) {
    for (const tag of htmltree) {
      gen(tag, 0)
    }
  } else {
    gen(htmltree, 0)
  }

  return code.join('\n')
}

/**
 * Get css tree by html string
 *
 * @param {string} html
 * @returns {string}
 */

export default function getCSSTree(html) {
  const htmltree = getHtmlTree(html)
  return getCSSTreeByHtmlTree(htmltree)
}
