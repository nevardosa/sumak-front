import { Component, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Subject, interval, takeUntil } from 'rxjs';
import { FeatureCard, Testimonial, Stat, HomeComponentState } from '../../core/models';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { HomeDataService } from '../../core/services/home-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly homeDataService = inject(HomeDataService);
  
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

  ngOnInit(): void {
    this.initializeTestimonialRotation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  trackByStat(index: number, stat: Stat): string {
    return stat.id;
  }
}