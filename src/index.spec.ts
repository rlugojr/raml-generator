import test = require('blue-tape')
import { generator } from './index'

test('raml generator', t => {
  t.test('basic generator', t => {
    const generate = generator({
      templates: {
        'test.js': function () {
          return
        }
      }
    })

    console.log(generate)

    t.end()
  })
})
