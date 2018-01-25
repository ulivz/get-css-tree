import parse7 from 'parse7'

/**
 * Get html tree by parsing
 *
 * @param html
 * @returns {Array}
 */
function getHtmlTree(html) {
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

/**
 * Get css tree by html tree
 *
 * @param htmltree
 * @returns {string}
 */

function getCSSTreeByHtmlTree(htmltree) {
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
    const tagClass = tag.attrs.find(attr => attr.name === 'class')
    const selector = tagClass ? '.' + tagClass.value : tag.tagname
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
 * Html to Scss
 *
 * @param {string} html string
 * @returns {string} css string
 */

export default function htmlCssTransformer(html) {
  const htmltree = getHtmlTree(html)
  return getCSSTreeByHtmlTree(htmltree)
}
