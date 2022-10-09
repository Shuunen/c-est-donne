import { check, checksRun } from 'shuutils'
import { firstName } from '../src/utils/user'

check('user fistName', firstName('John Doe'), 'John')
check('user fistName', firstName('John'), 'John')
check('user fistName', firstName('John Doe Doe'), 'John')
check('user fistName', firstName('zoe.doe'), 'zoe')
check('user fistName', firstName(''), '')

checksRun()
