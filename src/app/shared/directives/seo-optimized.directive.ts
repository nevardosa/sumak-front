import { Directive, Input, ElementRef, OnInit, inject } from '@angular/core';
import { AdvancedSecurityService } from '../../core/services/advanced-security.service';

@Directive({
  selector: '[appSeoOptimized]',
  standalone: true
})
export class SeoOptimizedDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly security = inject(AdvancedSecurityService);

  @Input() seoRole?: 'main' | 'navigation' | 'complementary' | 'banner' | 'contentinfo';
  @Input() seoSchema?: string;
  @Input() seoImportance?: 'high' | 'medium' | 'low';

  ngOnInit(): void {
    this.optimizeElement();
  }

  private optimizeElement(): void {
    const element = this.el.nativeElement;
    
    if (this.seoRole) {
      element.setAttribute('role', this.seoRole);
    }
    
    if (this.seoSchema) {
      element.setAttribute('itemscope', '');
      element.setAttribute('itemtype', `https://schema.org/${this.seoSchema}`);
    }
    
    if (this.seoImportance === 'high') {
      element.setAttribute('data-seo-priority', 'high');
    }
    
    // Add semantic structure
    this.enhanceSemanticStructure(element);
  }

  private enhanceSemanticStructure(element: HTMLElement): void {
    // Ensure proper heading hierarchy
    if (element.tagName.match(/^H[1-6]$/)) {
      element.setAttribute('data-heading-level', element.tagName.charAt(1));
    }
    
    // Add ARIA labels for better accessibility and SEO
    if (element.tagName === 'SECTION' && !element.getAttribute('aria-label')) {
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        element.setAttribute('aria-labelledby', heading.id || this.generateId());
      }
    }
  }

  private generateId(): string {
    return `seo-${Math.random().toString(36).substr(2, 9)}`;
  }
}