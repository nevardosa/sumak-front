import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HomeDataService } from '../../core/services/home-data.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let homeDataService: HomeDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        ButtonComponent,
        RouterTestingModule
      ],
      providers: [HomeDataService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    homeDataService = TestBed.inject(HomeDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default state', () => {
    expect(component.currentTestimonial()).toBe(0);
    expect(component.isLoading()).toBe(false);
    expect(component.features.length).toBeGreaterThan(0);
    expect(component.testimonials.length).toBeGreaterThan(0);
    expect(component.stats.length).toBeGreaterThan(0);
  });

  it('should render hero section with correct content', () => {
    const heroTitle = fixture.debugElement.query(By.css('h1'));
    expect(heroTitle.nativeElement.textContent).toContain('Sabores');
    expect(heroTitle.nativeElement.textContent).toContain('Auténticos');
  });

  it('should render all feature cards', () => {
    const featureCards = fixture.debugElement.queryAll(By.css('.card'));
    expect(featureCards.length).toBe(component.features.length);
  });

  it('should render all stats', () => {
    const statElements = fixture.debugElement.queryAll(By.css('.text-4xl'));
    expect(statElements.length).toBe(component.stats.length);
  });

  it('should handle testimonial navigation', () => {
    const initialTestimonial = component.currentTestimonial();
    component.onTestimonialChange(1);
    expect(component.currentTestimonial()).toBe(1);
  });

  it('should auto-rotate testimonials', fakeAsync(() => {
    const initialTestimonial = component.currentTestimonial();
    tick(5100); // Wait for rotation interval + buffer
    expect(component.currentTestimonial()).not.toBe(initialTestimonial);
  }));

  it('should track features correctly', () => {
    const feature = component.features[0];
    const trackResult = component.trackByFeature(0, feature);
    expect(trackResult).toBe(feature.id);
  });

  it('should track testimonials correctly', () => {
    const testimonial = component.testimonials[0];
    const trackResult = component.trackByTestimonial(0, testimonial);
    expect(trackResult).toBe(testimonial.id);
  });

  it('should track stats correctly', () => {
    const stat = component.stats[0];
    const trackResult = component.trackByStat(0, stat);
    expect(trackResult).toBe(stat.id);
  });

  it('should handle feature click', () => {
    spyOn(console, 'log');
    const feature = component.features[0];
    component.onFeatureClick(feature);
    expect(console.log).toHaveBeenCalledWith(`Feature clicked: ${feature.id}`);
  });

  it('should have proper accessibility attributes', () => {
    const testimonialButtons = fixture.debugElement.queryAll(
      By.css('button[aria-label*="Testimonial"]')
    );
    expect(testimonialButtons.length).toBe(component.testimonials.length);
  });

  it('should be responsive', () => {
    const heroSection = fixture.debugElement.query(By.css('.grid.lg\\:grid-cols-2'));
    expect(heroSection).toBeTruthy();
    
    const featuresGrid = fixture.debugElement.query(By.css('.grid.md\\:grid-cols-2.lg\\:grid-cols-3'));
    expect(featuresGrid).toBeTruthy();
  });

  it('should cleanup on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});