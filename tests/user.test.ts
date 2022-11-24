import { check, checksRun } from 'shuutils'
import { firstName } from '../src/utils/user'

check('user fistName A', firstName('John Doe'), 'John')
check('user fistName B', firstName('John'), 'John')
check('user fistName C', firstName('John Doe Doe'), 'John')
check('user fistName D', firstName('zoe.doe'), 'zoe')
check('user fistName E', firstName(''), '')

checksRun()
