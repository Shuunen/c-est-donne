import { expect, it } from 'vitest'
import { $t, getLangFromPath, lang, localePath } from '../src/utils/translate.utils'

it('localePath A', () => { expect(localePath('')).toMatchInlineSnapshot('""') })
it('localePath B', () => { expect(localePath('/')).toMatchInlineSnapshot('"/"') })
it('localePath C', () => { expect(localePath('/contact', 'en')).toMatchInlineSnapshot('"/en/contact"') })
it('localePath D', () => { expect(localePath('/en/contact', 'en')).toMatchInlineSnapshot('"/en/contact"') })
it('localePath E', () => { expect(localePath('/fr/contact', 'en')).toMatchInlineSnapshot('"/en/contact"') })
it('localePath F', () => { expect(localePath('/contact', 'fr')).toMatchInlineSnapshot('"/contact"') })

it('lang A', () => { expect(lang.value).toMatchInlineSnapshot('"fr"') })

it('$t A root non-existing translation key', () => { expect($t('hello')).toMatchInlineSnapshot('"hello"') })
it('$t B nested non-existing translation key', () => { expect($t('general.switch-lang')).toMatchInlineSnapshot('"general.switch-lang"') })
it('$t C nested non-existing translation key with data', () => { expect($t('general.switch-lang', { lang: 'en' })).toMatchInlineSnapshot('"general.switch-lang"') })
it('$t D root existing translation key', () => { expect($t('login')).toMatchInlineSnapshot('"Se connecter"') })
it('$t E root existing translation key with data', () => { expect($t('item-added-on', { time: 'jour de la baguette' })).toMatchInlineSnapshot('"Objet ajouté le jour de la baguette"') })

it('getLangFromPath A', () => { expect(getLangFromPath('')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath B', () => { expect(getLangFromPath('/')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath C', () => { expect(getLangFromPath('/contact')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath D', () => { expect(getLangFromPath('/en/contact')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath E', () => { expect(getLangFromPath('/fr/contact')).toMatchInlineSnapshot('"fr"') })
