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

  parse: function parse(s, oHandler) {
    var this$1 = this;

    if (oHandler) {
      this.contentHandler = oHandler;
    }

    var lm, rc, index; // eslint-disable-line one-var
    var treatAsChars = false;
    var oThis = this;
    while (s.length > 0) {
      // Comment
      if (s.substring(0, 4) === '<!--') {
        index = s.indexOf('-->');
        if (index !== -1) { // eslint-disable-line no-negated-condition
          this$1.contentHandler.comment(s.substring(4, index));
          s = s.substring(index + 3);
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      } // eslint-disable-line brace-style

      // end tag
      else if (s.substring(0, 2) === '</') {
        if (this$1.endTagRe.test(s)) {
          // lc = RegExp.leftContext
          lm = RegExp.lastMatch;
          rc = RegExp.rightContext;

          lm.replace(this$1.endTagRe, function () {
            return oThis.parseEndTag.apply(oThis, arguments)
          });

          s = rc;
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      } // eslint-disable-line brace-style

      // start tag
      else if (s.charAt(0) === '<') {
        if (this$1.startTagRe.test(s)) {
          // lc = RegExp.leftContext
          lm = RegExp.lastMatch;
          rc = RegExp.rightContext;

          lm.replace(this$1.startTagRe, function () {
            return oThis.parseStartTag.apply(oThis, arguments)
          });

          s = rc;
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      }

      if (treatAsChars) {
        index = s.indexOf('<');
        if (index === -1) {
          this$1.contentHandler.characters(s);
          s = '';
        } else {
          this$1.contentHandler.characters(s.substring(0, index));
          s = s.substring(index);
        }
      }

      treatAsChars = true;
    }
  },

  parseStartTag: function parseStartTag(sTag, sTagName, sRest) {
    var attrs = this.parseAttributes(sTagName, sRest);
    this.contentHandler.startElement(sTagName, attrs);
  },

  parseEndTag: function parseEndTag(sTag, sTagName) {
    this.contentHandler.endElement(sTagName);
  },

  parseAttributes: function parseAttributes(sTagName, s) {
    var oThis = this;
    var attrs = [];
    s.replace(this.attrRe, function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      attrs.push(oThis.parseAttribute.apply(oThis, [ sTagName ].concat( args )));
    });
    return attrs
  },

  parseAttribute: function parseAttribute(sTagName, sAttribute, sName) {
    var value = '';
    if (arguments[7]) {
      value = arguments[8];
    } else if (arguments[5]) {
      value = arguments[6];
    } else if (arguments[3]) {
      value = arguments[4];
    }

    var empty = !value && !arguments[3];
    return { name: sName, value: empty ? null : value }
  }
};

/**
 * Get html tree by parsing
 *
 * @param html
 * @returns {Array}
 */
function getHtmlTree(html) {
  var stack = [];
  var htmltree = [];

  var startElement = function (name, attrs) {
    var top = stack[stack.length - 1];
    var tag = {
      attrs: attrs,
      tagname: name,
      nodes: []
    };
    stack.push(tag);
    if (typeof top === 'undefined') {
      htmltree.push(tag);
    } else {
      top.nodes.push(tag);
    }
  };

  var endElement = function () { return stack.pop(); };

  var noop = function () {
  };

  var parser = new SimpleHtmlParser();
  parser.parse(html, {
    startElement: startElement,
    endElement: endElement,
    characters: noop,
    comment: noop
  });

  return htmltree
}

/**
 * Get css tree by html tree
 *
 * @param htmltree
 * @returns {string}
 */

function getCSSTreeByHtmlTree(htmltree) {
  var code = [];
  var space = '	';

  function getIndent(depth) {
    var indent = '';
    while (depth > 0) {
      indent += space;
      depth--;
    }
    return indent
  }

  function gen(tag, depth) {
    var indent = getIndent(depth);
    var tagClass = tag.attrs.find(function (attr) { return attr.name === 'class'; }).value;
    var selector = tagClass ? '.' + tagClass : tag.tagname;
    if (tag.nodes.length > 0) {
      code.push(("" + indent + selector + " {"));
      for (var i = 0, list = tag.nodes; i < list.length; i += 1) {
        var item = list[i];

        gen(item, depth + 1);
      }
      code.push((indent + "}"));
    } else {
      code.push(("" + indent + selector + " {"));
      code.push((indent + "}"));
    }
  }

  if (Array.isArray(htmltree)) {
    for (var i = 0, list = htmltree; i < list.length; i += 1) {
      var tag = list[i];

      gen(tag, 0);
    }
  } else {
    gen(htmltree, 0);
  }

  return code.join('\n')
}

/**
 * Get css tree by html string
 *
 * @param {string} html
 * @returns {string}
 */

function cssTreeGetter(html) {
  var htmltree = getHtmlTree(html);
  return getCSSTreeByHtmlTree(htmltree)
}

cssTreeGetter.getCSSTreeByHtmlTree = getCSSTreeByHtmlTree;
cssTreeGetter.getHtmlTree = getHtmlTree;

export default cssTreeGetter;
