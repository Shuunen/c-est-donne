import { debounce, on } from 'shuutils'
import { state } from '../state'
import { log } from '../utils/logs'
import { Display } from '../utils/tabs'

const showListUnder = 700

function onResizeSync (): void {
  log('on resize, window.innerWidth', window.innerWidth)
  if (window.innerWidth <= showListUnder)
    state.display = Display.Cards
}

const resizeDebounceDelay = 100

const onResize = debounce(onResizeSync, resizeDebounceDelay)

on('resize', onResize)
