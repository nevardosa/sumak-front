export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: FaqCategory;
  readonly priority: number;
}

export interface FaqCategory {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
}

export type FaqCategoryId = 'general' | 'orders' | 'shipping' | 'products' | 'payments';

export interface FaqComponentState {
  readonly selectedCategory: FaqCategoryId | 'all';
  readonly expandedItems: readonly string[];
  readonly searchQuery: string;
}