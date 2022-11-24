import { check, checksRun } from 'shuutils'
import { state } from '../src/state'
import { Tabs } from '../src/utils/tabs'
import { Theme } from '../src/utils/theme'
import { EMPTY_USER } from '../src/utils/user'

check('state default theme', state.theme, Theme.light)
check('state default display', state.display, Tabs.list)
check('state default user', state.user.email, EMPTY_USER.email)

checksRun()
