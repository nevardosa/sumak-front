import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SeoService } from '../../core/services/seo.service';
import { EXPERIENCES_CONTENT } from './constants/experiences.constants';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperiencesComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  readonly content = EXPERIENCES_CONTENT;

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
      title: 'Experiencias Gastronómicas Premium | Sumak Gourmet',
      description: 'Rituales gastronómicos que transforman el acto de regalar en una experiencia sensorial y emocional. Curaduría experta, presentación impecable.',
      keywords: 'experiencias gastronómicas premium, rituales sensoriales, regalos con intención, curaduría gastronómica colombia',
      ogTitle: 'Experiencias Gastronómicas Premium | Sumak Gourmet',
      ogDescription: 'Rituales gastronómicos que transforman el acto de regalar en una experiencia sensorial y emocional.',
      ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
      ogUrl: 'https://sumakgourmet.co/experiencias',
      canonicalUrl: '/experiencias'
    });

    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Experiencias', url: '/experiencias' }
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

  trackByIndex(index: number): number {
    return index;
  }

  trackById(index: number, item: any): string {
    return item.id;
  }

  trackByNumber(index: number, item: any): number {
    return item.number;
  }
}
