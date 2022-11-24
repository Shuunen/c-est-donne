export const enum Tabs {
  available = 'available',
  reservedByMe = 'reserved-by-me',
  all = 'all',
  list = 'list',
  cards = 'cards',
}

export type Display = Tabs.cards | Tabs.list

export type Filter = Tabs.all | Tabs.available | Tabs.reservedByMe
