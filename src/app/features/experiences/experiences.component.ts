import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ButtonComponent } from '../../shared/components/button/button.component';
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
    this.titleService.setTitle('Experiencias | Sumak Gourmet');
    
    this.metaService.updateTag({
      name: 'description',
      content: 'Experiencias gastronómicas premium para regalar con intención. Rituales curados, presentación impecable y propuestas corporativas a la medida.'
    });

    this.metaService.updateTag({
      name: 'keywords',
      content: 'experiencias gastronómicas, rituales premium, regalos con intención, curaduría gastronómica, Colombia'
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Experiencias | Sumak Gourmet'
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: 'Experiencias gastronómicas premium para regalar con intención. Rituales curados, presentación impecable y propuestas corporativas a la medida.'
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
