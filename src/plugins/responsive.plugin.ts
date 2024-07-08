import { debounce, on } from 'shuutils'
import { state } from '../state'
import { log } from '../utils/logger.utils'
import { Display } from '../utils/tabs.utils'

const showListUnder = 700

/**
 * Callback called on resize
 */
function onResizeSync () {
  log('on resize, window.innerWidth', window.innerWidth)
  if (window.innerWidth <= showListUnder)
    state.display = Display.Cards
}

const resizeDebounceDelay = 100

const onResize = debounce(onResizeSync, resizeDebounceDelay)

on('resize', onResize)
