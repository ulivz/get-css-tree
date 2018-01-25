const SPACE = '\t'

export function getIndent(depth) {
  let indent = ''
  while (depth > 0) {
    indent += SPACE
    depth--
  }
  return indent
}

export function getUuid() {
  return new Date().getTime() + Math.random() * 100
}
