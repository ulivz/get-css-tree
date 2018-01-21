# html-css-transformer

[![NPM version](https://img.shields.io/npm/v/html-css-transformer.svg?style=flat)](https://npmjs.com/package/html-css-transformer) [![NPM downloads](https://img.shields.io/npm/dm/html-css-transformer.svg?style=flat)](https://npmjs.com/package/html-css-transformer) [![CircleCI](https://circleci.com/gh/ULIVZ/html-css-transformer/tree/master.svg?style=shield)](https://circleci.com/gh/ULIVZ/html-css-transformer/tree/master)  [![codecov](https://codecov.io/gh/ULIVZ/html-css-transformer/branch/master/graph/badge.svg)](https://codecov.io/gh/ULIVZ/html-css-transformer)
 [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/ULIVZ/donate)

## Install

```bash
npm i html-css-transformer
```

## Usage

```js
const htmlCssTransformer = require('html-css-transformer')
htmlCssTransformer(/* input string */)
```

For example, input:

```html
<div class="wrapper">
  <div class="sidebar"></div>
  <div class="content"></div>
</div>
```

Then the output will be:

```scss
.wrapper {
	.sidebar {
	}
	.content {
	}
}
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**html-css-transformer** © [ulivz](https://github.com/ULIVZ), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by ulivz with help from contributors ([list](https://github.com/ULIVZ/html-css-transformer/contributors)).

> [github.com/ulivz](https://github.com/ulivz) · GitHub [@ulivz](https://github.com/ULIVZ)
