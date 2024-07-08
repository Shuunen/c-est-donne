import { clone, storage } from 'shuutils'
import { watch } from 'vue'
import { state } from '../state'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
watch(() => clone(state), (stateAfter, stateBefore) => {
  if (stateBefore.display !== stateAfter.display) storage.set('display', stateAfter.display)
  if (stateBefore.filter !== stateAfter.filter) storage.set('filter', stateAfter.filter)
  if (stateBefore.theme !== stateAfter.theme) storage.set('theme', stateAfter.theme)
  if (stateBefore.locale !== stateAfter.locale) storage.set('locale', stateAfter.locale)
})
