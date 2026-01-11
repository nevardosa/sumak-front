import { TestBed } from '@angular/core/testing';
import { FaqService } from './faq.service';

describe('FaqService', () => {
  let service: FaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all categories', () => {
    const categories = service.allCategories;
    expect(categories).toBeDefined();
    expect(categories.length).toBe(5);
    expect(categories.map(c => c.id)).toEqual(['general', 'orders', 'shipping', 'products', 'payments']);
  });

  it('should return all FAQ items sorted by priority', () => {
    const faqs = service.allFaqItems;
    expect(faqs).toBeDefined();
    expect(faqs.length).toBeGreaterThan(0);
    
    // Check if sorted by priority
    for (let i = 1; i < faqs.length; i++) {
      expect(faqs[i].priority).toBeGreaterThanOrEqual(faqs[i - 1].priority);
    }
  });

  it('should filter FAQs by category', () => {
    const orderFaqs = service.getFaqsByCategory('orders');
    expect(orderFaqs.every(faq => faq.category.id === 'orders')).toBeTruthy();
  });

  it('should search FAQs by query', () => {
    const results = service.searchFaqs('pedido');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(faq => 
      faq.question.toLowerCase().includes('pedido') || 
      faq.answer.toLowerCase().includes('pedido')
    )).toBeTruthy();
  });

  it('should return all FAQs for empty search query', () => {
    const results = service.searchFaqs('');
    expect(results.length).toBe(service.allFaqItems.length);
  });

  it('should find FAQ by ID', () => {
    const faq = service.getFaqById('1');
    expect(faq).toBeDefined();
    expect(faq?.id).toBe('1');
  });

  it('should return undefined for non-existent FAQ ID', () => {
    const faq = service.getFaqById('non-existent');
    expect(faq).toBeUndefined();
  });
});