import fs from 'fs'
import path from 'path'
import htmlCssTransformer from '../src'

test('should get correct css output', () => {
  const htmlstring = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test.html'), 'utf-8')
  const csstree = htmlCssTransformer(htmlstring)
  expect(csstree).toMatchSnapshot()
})
