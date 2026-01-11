import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../core/services/faq.service';
import { FaqItem, FaqCategory, FaqCategoryId, FaqComponentState } from '../../core/models/faq.models';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent implements OnInit {
  private readonly faqService = inject(FaqService);

  readonly state = signal<FaqComponentState>({
    selectedCategory: 'all',
    expandedItems: [],
    searchQuery: ''
  });

  readonly categories = computed(() => this.faqService.allCategories);
  
  readonly filteredFaqs = computed(() => {
    const currentState = this.state();
    let faqs = this.faqService.allFaqItems;

    // Filter by search query
    if (currentState.searchQuery.trim()) {
      faqs = this.faqService.searchFaqs(currentState.searchQuery);
    }

    // Filter by category
    if (currentState.selectedCategory !== 'all') {
      faqs = faqs.filter(faq => faq.category.id === currentState.selectedCategory);
    }

    return faqs;
  });

  ngOnInit(): void {
    // Component initialization if needed
  }

  onCategoryChange(categoryId: FaqCategoryId | 'all'): void {
    this.state.update(current => ({
      ...current,
      selectedCategory: categoryId,
      expandedItems: [] // Collapse all when changing category
    }));
  }

  onCategoryClick(category: FaqCategory): void {
    this.onCategoryChange(category.id as FaqCategoryId);
  }

  onSearchChange(query: string): void {
    this.state.update(current => ({
      ...current,
      searchQuery: query,
      expandedItems: [] // Collapse all when searching
    }));
  }

  toggleFaqItem(itemId: string): void {
    this.state.update(current => {
      const isExpanded = current.expandedItems.includes(itemId);
      const expandedItems = isExpanded
        ? current.expandedItems.filter(id => id !== itemId)
        : [...current.expandedItems, itemId];
      
      return {
        ...current,
        expandedItems
      };
    });
  }

  isItemExpanded(itemId: string): boolean {
    return this.state().expandedItems.includes(itemId);
  }

  trackByFaq(index: number, faq: FaqItem): string {
    return faq.id;
  }

  trackByCategory(index: number, category: FaqCategory): string {
    return category.id;
  }
}