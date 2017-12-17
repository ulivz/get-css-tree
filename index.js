import htmlparser from 'htmlparser2'

/**
 * Get html tree by parsing
 *
 * @param html
 * @returns {Array}
 */
export function getHtmlTree(html) {
  const stack = []
  const htmltree = []

  const onopentag = (name, attribs) => {
    const top = stack[stack.length - 1]
    const tag = {
      tagname: name,
      class: attribs.class,
      nodes: []
    }
    stack.push(tag)
    if (typeof top === 'undefined') {
      htmltree.push(tag)
    } else {
      top.nodes.push(tag)
    }
  }

  const onclosetag = () => stack.pop()

  const parser = new htmlparser.Parser(
    { onopentag, onclosetag },
    { decodeEntities: true }
  )

  parser.write(html)
  parser.end()

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
    const selector = tag.class ? '.' + tag.class : tag.tagname
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
