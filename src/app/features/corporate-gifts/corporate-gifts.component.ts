import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SeoService } from '../../core/services/seo.service';
import { CORPORATE_GIFTS_CONTENT } from './constants/corporate-gifts.constants';

@Component({
  selector: 'app-corporate-gifts',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './corporate-gifts.component.html',
  styleUrls: ['./corporate-gifts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateGiftsComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  readonly content = CORPORATE_GIFTS_CONTENT;

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.setSeoMetadata();
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.seoService.removeSchema('breadcrumb-schema');
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetaTags({
      title: 'Regalos Corporativos Premium | Sumak Gourmet',
      description: 'Rituales gastronómicos curados para empresas. Regalos corporativos premium con presentación impecable y entrega en 24h en Bogotá. Cobertura nacional.',
      keywords: 'regalos corporativos premium, regalos empresariales colombia, detalles corporativos, propuestas a medida, regalos ejecutivos',
      ogTitle: 'Regalos Corporativos Premium | Sumak Gourmet',
      ogDescription: 'Rituales gastronómicos curados para empresas con presentación premium y cobertura nacional.',
      ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
      ogUrl: 'https://sumakgourmet.co/regalos-corporativos',
      canonicalUrl: '/regalos-corporativos'
    });

    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Regalos Corporativos', url: '/regalos-corporativos' }
    ]);
  }

  private initScrollAnimations(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      document.querySelectorAll('.fade-in-section').forEach(el => {
        this.observer?.observe(el);
      });
    }, 100);
  }

  trackBySegmentId(index: number, item: any): string {
    return item.id;
  }

  trackByStepNumber(index: number, item: any): number {
    return item.number;
  }
}
