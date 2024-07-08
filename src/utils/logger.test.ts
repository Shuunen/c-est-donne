import { expect, it } from 'vitest'
import { error, log } from './logger.utils'

it('error A', () => {
  expect(error('an-error-occurred')).toMatchInlineSnapshot('false')
})

it('log A', () => {
  expect(log('plop')).toMatchInlineSnapshot('false')
})

