import fs from 'fs'
import path from 'path'
import cssTreeGetter from '../'

test('should get correct css tree', () => {
  const htmlstring = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test.html'), 'utf-8')
  const csstree = cssTreeGetter(htmlstring)
  expect(csstree).toMatchSnapshot()
})
