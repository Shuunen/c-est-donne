import { check, checksRun } from 'shuutils'
import { state } from '../src/state'
import { Tab } from '../src/utils/tabs'
import { Theme } from '../src/utils/theme'
import { emptyUser } from '../src/utils/user'

check('state default theme', state.theme, Theme.Light)
check('state default display', state.display, Tab.List)
check('state default user', state.user.email, emptyUser.email)

checksRun()
