import { expect, it } from 'vitest'
import { error, log } from '../src/utils/logger.utils'

it('error A', () => {
  expect(error('an-error-occurred')).toMatchInlineSnapshot('false')
})

it('log A', () => {
  expect(log('plop')).toMatchInlineSnapshot('false')
})

