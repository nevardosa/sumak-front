import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ButtonComponent } from '../../shared/components/button/button.component';
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

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  ngOnInit(): void {
    this.setSeoMetadata();
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setSeoMetadata(): void {
    this.titleService.setTitle('Regalos Corporativos Premium | Sumak Gourmet');
    
    this.metaService.updateTag({
      name: 'description',
      content: 'Regalos corporativos premium con curaduría gastronómica y cobertura nacional. Propuestas a la medida para empresas y equipos. Cotiza en Sumak.'
    });

    this.metaService.updateTag({
      name: 'keywords',
      content: 'regalos corporativos premium, regalos empresariales, propuestas a la medida, Colombia, curaduría gastronómica'
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Regalos Corporativos Premium | Sumak Gourmet'
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: 'Regalos corporativos premium con curaduría gastronómica y cobertura nacional. Propuestas a la medida para empresas y equipos.'
    });

    this.metaService.updateTag({
      property: 'og:type',
      content: 'website'
    });
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
