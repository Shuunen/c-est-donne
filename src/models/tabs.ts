export const enum Tabs {
  available = 'available',
  reservedByMe = 'reserved-by-me',
  all = 'all',
  list = 'list',
  cards = 'cards',
}

export type Display = Tabs.list | Tabs.cards

export type Filter = Tabs.available | Tabs.reservedByMe | Tabs.all
