import { Component, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy, inject, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';

import { Subject, interval, takeUntil } from 'rxjs';
import { FeatureCard, Testimonial, Stat, HomeComponentState } from '../../core/models';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { HomeDataService } from '../../core/services/home-data.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, SocialLinksComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly destroy$ = new Subject<void>();
  private readonly homeDataService = inject(HomeDataService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private observer?: IntersectionObserver;
  
  @ViewChild('statsSection') statsSection!: ElementRef;
  
  readonly state = signal<HomeComponentState>({
    isLoading: false,
    currentTestimonial: 0,
    isTestimonialAutoPlay: true
  });
  
  readonly currentTestimonial = computed(() => this.state().currentTestimonial);
  readonly isLoading = computed(() => this.state().isLoading);
  
  readonly features = this.homeDataService.features;
  readonly testimonials = this.homeDataService.testimonials;
  readonly stats = this.homeDataService.stats;
  readonly animatedStats = signal<Stat[]>(
    this.stats.map(s => ({ ...s }))
  );
  private statsAnimated = false;

  ngOnInit(): void {
    this.setSeoMetadata();
    if (this.isBrowser) {
      this.initializeTestimonialRotation();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initScrollAnimations();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
    this.seoService.removeSchema('breadcrumb-schema');
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetaTags({
      title: 'Rituales Gastronómicos Premium | Sumak Gourmet Colombia',
      description: 'Rituales gastronómicos premium con curaduría experta. Regalos corporativos y experiencias gourmet únicas en Colombia. Chocolate 70% cacao, frutos secos seleccionados, mieles infusionadas.',
      keywords: 'rituales gastronómicos, regalos corporativos premium, experiencias gourmet Colombia, chocolate premium, curaduría gastronómica, regalos empresariales',
      ogTitle: 'Rituales Gastronómicos Premium | Sumak Gourmet',
      ogDescription: 'Experiencias gastronómicas curadas para empresas y personas que valoran el detalle, la intención y el significado.',
      ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
      ogUrl: 'https://sumakgourmet.co/',
      canonicalUrl: '/'
    });

    this.seoService.addOrganizationSchema();
    this.seoService.addWebSiteSchema(); // ← Agregar WebSite schema
    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' }
    ]);
  }

  private initScrollAnimations(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate benefit items with stagger
            if (entry.target.classList.contains('benefits-section')) {
              const benefitItems = entry.target.querySelectorAll('.benefit-item');
              benefitItems.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add('animate-in');
                }, index * 100);
              });
            }
            
            if (entry.target === this.statsSection?.nativeElement && !this.statsAnimated) {
              this.statsAnimated = true;
              this.animateStats();
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('fade-in-section');
      this.observer?.observe(section);
    });
  }

  private animateStats(): void {
    if (!this.isBrowser) {
      return;
    }
    
    this.stats.forEach((stat, index) => {
      // Solo animar métricas numéricas
      if (stat.type === 'qualitative') {
        return;
      }
      
      const numericValue = parseInt(stat.value);
      
      if (isNaN(numericValue)) {
        return;
      }
      
      const targetValue = numericValue;
      const duration = 2500;
      const steps = 80;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = targetValue * easeOut;
        
        if (currentStep >= steps) {
          clearInterval(timer);
          this.animatedStats.update(stats => {
            const newStats = [...stats];
            newStats[index] = { ...stat, value: targetValue.toString() };
            return newStats;
          });
        } else {
          this.animatedStats.update(stats => {
            const newStats = [...stats];
            newStats[index] = { ...stat, value: Math.floor(currentValue).toString() };
            return newStats;
          });
        }
      }, duration / steps);
    });
  }

  private initializeTestimonialRotation(): void {
    interval(APP_CONSTANTS.HOME.TESTIMONIAL_ROTATION_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.state().isTestimonialAutoPlay) {
          this.nextTestimonial();
        }
      });
  }

  private nextTestimonial(): void {
    this.state.update(current => ({
      ...current,
      currentTestimonial: (current.currentTestimonial + 1) % this.testimonials.length
    }));
  }

  onFeatureClick(feature: FeatureCard): void {
    // Analytics tracking could be added here
    console.log(`Feature clicked: ${feature.id}`);
  }

  onTestimonialChange(index: number): void {
    if (!this.isBrowser) return;
    
    this.state.update(current => ({
      ...current,
      currentTestimonial: index,
      isTestimonialAutoPlay: false
    }));
    
    // Resume autoplay after 10 seconds
    setTimeout(() => {
      this.state.update(current => ({
        ...current,
        isTestimonialAutoPlay: true
      }));
    }, 10000);
  }

  trackByFeature(index: number, feature: FeatureCard): string {
    return feature.id;
  }

  trackByTestimonial(index: number, testimonial: Testimonial): string {
    return testimonial.id;
  }

  trackByStat(index: number, stat: Stat): string {
    return stat.id;
  }
}