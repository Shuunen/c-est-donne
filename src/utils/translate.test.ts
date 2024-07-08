import { expect, it } from 'vitest'
import { $t, getLangFromPath, lang, localePath } from './translate.utils'

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
it('$t F singular / plural : singular', () => { expect($t('isMaxChar', { count: 1, fieldName: 'name' })).toMatchInlineSnapshot('"Le champ name doit contenir au plus un caractère"') })
it('$t G singular / plural : plural', () => { expect($t('isMaxChar', { count: 12, fieldName: 'name' })).toMatchInlineSnapshot('"Le champ name doit contenir au plus 12 caractères"') })
it('$t H none / singular / plural : none', () => { expect($t('isMinChar', { count: 0, fieldName: 'name' })).toMatchInlineSnapshot('"Le champ name doit contenir au moins un caractère"') })
it('$t I none / singular / plural : singular', () => { expect($t('isMinChar', { count: 1, fieldName: 'name' })).toMatchInlineSnapshot('"Le champ name doit contenir plus d\'un caractère"') })
it('$t J none / singular / plural : plural', () => { expect($t('isMinChar', { count: 12, fieldName: 'name' })).toMatchInlineSnapshot('"Le champ name doit contenir au moins 12 caractères"') })
it('$t K missing data for pluralization', () => { expect(() => $t('isMinChar')).toThrowErrorMatchingInlineSnapshot('[Error: missing data for a pluralized traduction]') })
it('$t L missing count in data for pluralization', () => { expect(() => $t('isMinChar', { fieldName: 'name' })).toThrowErrorMatchingInlineSnapshot('[Error: missing "count" in data for a pluralized traduction]') })

it('getLangFromPath A', () => { expect(getLangFromPath('')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath B', () => { expect(getLangFromPath('/')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath C', () => { expect(getLangFromPath('/contact')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath D', () => { expect(getLangFromPath('/en/contact')).toMatchInlineSnapshot('"fr"') })
it('getLangFromPath E', () => { expect(getLangFromPath('/fr/contact')).toMatchInlineSnapshot('"fr"') })
