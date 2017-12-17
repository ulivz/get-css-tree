import getCSSTree from '../'
import fs from 'fs'
import path from 'path'

test('should get correct css tree', () => {
  const htmlstring = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test.html'), 'utf-8')
  const csstree = getCSSTree(htmlstring)
  expect(csstree).toMatchSnapshot()
})
