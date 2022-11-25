export const enum Tab {
  Available = 'available',
  ReservedByMe = 'reserved-by-me',
  All = 'all',
  List = 'list',
  Cards = 'cards',
}

export type Display = Tab.Cards | Tab.List

export type Filter = Tab.All | Tab.Available | Tab.ReservedByMe
