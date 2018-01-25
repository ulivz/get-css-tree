import fs from 'fs'
import path from 'path'
import htmlCssTransformer from '../src'

test('SCSS - should get correct css output', () => {
  const htmlstring = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test.html'), 'utf-8')
  const csstree = htmlCssTransformer.html2scss(htmlstring)
  expect(csstree).toMatchSnapshot()
})
