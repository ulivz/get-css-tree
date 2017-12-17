/*!
 * HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

/*
 var handler ={
 startElement:   function (sTagName, oAttrs) {},
 endElement:     function (sTagName) {},
 characters:		function (s) {},
 comment:		function (s) {}
 };
 */

function SimpleHtmlParser() {
}

SimpleHtmlParser.prototype = {

  handler: null,

  // regexps

  startTagRe: /^<([^>\s/]+)((\s+[^=>\s]+(\s*=\s*(("[^"]*")|('[^']*')|[^>\s]+))?)*)\s*\/?\s*>/m,
  endTagRe: /^<\/([^>\s]+)[^>]*>/m,
  attrRe: /([^=\s]+)(\s*=\s*(("([^"]*)")|('([^']*)')|[^>\s]+))?/gm,

  parse(s, oHandler) {
    if (oHandler) {
      this.contentHandler = oHandler
    }

    let lm, rc, index // eslint-disable-line one-var
    let treatAsChars = false
    const oThis = this
    while (s.length > 0) {
      // Comment
      if (s.substring(0, 4) === '<!--') {
        index = s.indexOf('-->')
        if (index !== -1) { // eslint-disable-line no-negated-condition
          this.contentHandler.comment(s.substring(4, index))
          s = s.substring(index + 3)
          treatAsChars = false
        } else {
          treatAsChars = true
        }
      } // eslint-disable-line brace-style

      // end tag
      else if (s.substring(0, 2) === '</') {
        if (this.endTagRe.test(s)) {
          // lc = RegExp.leftContext
          lm = RegExp.lastMatch
          rc = RegExp.rightContext

          lm.replace(this.endTagRe, function () {
            return oThis.parseEndTag.apply(oThis, arguments)
          })

          s = rc
          treatAsChars = false
        } else {
          treatAsChars = true
        }
      } // eslint-disable-line brace-style

      // start tag
      else if (s.charAt(0) === '<') {
        if (this.startTagRe.test(s)) {
          // lc = RegExp.leftContext
          lm = RegExp.lastMatch
          rc = RegExp.rightContext

          lm.replace(this.startTagRe, function () {
            return oThis.parseStartTag.apply(oThis, arguments)
          })

          s = rc
          treatAsChars = false
        } else {
          treatAsChars = true
        }
      }

      if (treatAsChars) {
        index = s.indexOf('<')
        if (index === -1) {
          this.contentHandler.characters(s)
          s = ''
        } else {
          this.contentHandler.characters(s.substring(0, index))
          s = s.substring(index)
        }
      }

      treatAsChars = true
    }
  },

  parseStartTag(sTag, sTagName, sRest) {
    const attrs = this.parseAttributes(sTagName, sRest)
    this.contentHandler.startElement(sTagName, attrs)
  },

  parseEndTag(sTag, sTagName) {
    this.contentHandler.endElement(sTagName)
  },

  parseAttributes(sTagName, s) {
    const oThis = this
    const attrs = []
    s.replace(this.attrRe, (...args) => {
      attrs.push(oThis.parseAttribute(sTagName, ...args))
    })
    return attrs
  },

  parseAttribute(sTagName, sAttribute, sName) {
    let value = ''
    if (arguments[7]) {
      value = arguments[8]
    } else if (arguments[5]) {
      value = arguments[6]
    } else if (arguments[3]) {
      value = arguments[4]
    }

    const empty = !value && !arguments[3]
    return { name: sName, value: empty ? null : value }
  }
}

export default SimpleHtmlParser
