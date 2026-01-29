import { Component, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';
import { Subject, interval, takeUntil } from 'rxjs';
import { FeatureCard, Testimonial, Stat, HomeComponentState } from '../../core/models';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { HomeDataService } from '../../core/services/home-data.service';

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
  private observer!: IntersectionObserver;
  
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
  readonly animatedStats = signal<{ id: string; value: number; label: string }[]>(
    this.stats.map(s => ({ ...s, value: 0 }))
  );
  private statsAnimated = false;

  ngOnInit(): void {
    this.initializeTestimonialRotation();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initScrollAnimations(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate benefit items with stagger
            const benefitItems = entry.target.querySelectorAll('.benefit-item');
            benefitItems.forEach((item) => {
              item.classList.add('animate-in');
            });
            
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
      this.observer.observe(section);
    });
  }

  private animateStats(): void {
    this.stats.forEach((stat, index) => {
      const targetValue = parseInt(stat.value);
      const duration = 2500;
      const steps = 80;
      const increment = targetValue / steps;
      let currentValue = 0;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentValue = targetValue * easeOut;
        
        if (currentStep >= steps) {
          currentValue = targetValue;
          clearInterval(timer);
        }
        
        this.animatedStats.update(stats => {
          const newStats = [...stats];
          newStats[index] = { ...stat, value: Math.floor(currentValue) };
          return newStats;
        });
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

  trackByStat(index: number, stat: { id: string; value: number; label: string }): string {
    return stat.id;
  }
}