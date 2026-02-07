import { Component, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../core/services/faq.service';
import { FaqItem, FaqCategory, FaqCategoryId, FaqComponentState } from '../../core/models/faq.models';
import { SeoService } from '../../core/services/seo.service';
import { SeoOptimizedDirective } from '../../shared/directives/seo-optimized.directive';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, SeoOptimizedDirective],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly faqService = inject(FaqService);
  private readonly seoService = inject(SeoService);

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
    this.setSeoMetadata();
  }

  ngOnDestroy(): void {
    this.seoService.removeSchema('breadcrumb-schema');
    this.seoService.removeSchema('faq-schema');
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetaTags({
      title: 'Preguntas Frecuentes | Sumak Gourmet - Rituales Gastronómicos',
      description: 'Resuelve tus dudas sobre rituales gastronómicos, pedidos corporativos, envíos y más. Respuestas rápidas sobre experiencias gourmet premium en Colombia.',
      keywords: 'preguntas frecuentes sumak, faq rituales gastronómicos, dudas pedidos corporativos, envíos colombia, consultas sumak gourmet',
      ogTitle: 'Preguntas Frecuentes | Sumak Gourmet',
      ogDescription: 'Encuentra respuestas sobre nuestros rituales gastronómicos, pedidos corporativos y experiencias premium.',
      ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
      ogUrl: 'https://sumakgourmet.co/faq',
      canonicalUrl: '/faq'
    });

    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Preguntas Frecuentes', url: '/faq' }
    ]);
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

  openEmailClient(): void {
    const subject = encodeURIComponent('Consulta Sumak');
    const body = encodeURIComponent('Hola equipo Sumak,\n\nMe gustaría hacer una consulta:\n\n[Escribe tu consulta aquí]\n\nGracias.');
    const mailtoUrl = `mailto:suumak25@gmail.com?subject=${subject}&body=${body}`;
    
    try {
      window.open(mailtoUrl, '_blank');
    } catch (error) {
      window.location.href = mailtoUrl;
    }
  }
}