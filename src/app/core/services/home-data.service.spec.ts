import { TestBed } from '@angular/core/testing';
import { HomeDataService } from './home-data.service';

describe('HomeDataService', () => {
  let service: HomeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return features', () => {
    const features = service.features;
    expect(features).toBeDefined();
    expect(features.length).toBeGreaterThan(0);
    expect(features[0]).toHaveProperty('id');
    expect(features[0]).toHaveProperty('title');
    expect(features[0]).toHaveProperty('description');
    expect(features[0]).toHaveProperty('icon');
    expect(features[0]).toHaveProperty('route');
  });

  it('should return testimonials', () => {
    const testimonials = service.testimonials;
    expect(testimonials).toBeDefined();
    expect(testimonials.length).toBeGreaterThan(0);
    expect(testimonials[0]).toHaveProperty('id');
    expect(testimonials[0]).toHaveProperty('name');
    expect(testimonials[0]).toHaveProperty('role');
    expect(testimonials[0]).toHaveProperty('content');
    expect(testimonials[0]).toHaveProperty('rating');
  });

  it('should return stats', () => {
    const stats = service.stats;
    expect(stats).toBeDefined();
    expect(stats.length).toBeGreaterThan(0);
    expect(stats[0]).toHaveProperty('id');
    expect(stats[0]).toHaveProperty('value');
    expect(stats[0]).toHaveProperty('label');
  });

  it('should find feature by id', () => {
    const feature = service.getFeatureById('catalog');
    expect(feature).toBeDefined();
    expect(feature?.id).toBe('catalog');
  });

  it('should return undefined for non-existent feature', () => {
    const feature = service.getFeatureById('non-existent');
    expect(feature).toBeUndefined();
  });

  it('should find testimonial by id', () => {
    const testimonial = service.getTestimonialById('1');
    expect(testimonial).toBeDefined();
    expect(testimonial?.id).toBe('1');
  });

  it('should return undefined for non-existent testimonial', () => {
    const testimonial = service.getTestimonialById('non-existent');
    expect(testimonial).toBeUndefined();
  });
});