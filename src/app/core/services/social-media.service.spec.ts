import { TestBed } from '@angular/core/testing';
import { SocialMediaService } from './social-media.service';

describe('SocialMediaService', () => {
  let service: SocialMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return social media links', () => {
    const links = service.links;
    expect(links).toBeDefined();
    expect(links.length).toBe(3);
    expect(links.map(l => l.platform)).toEqual(['instagram', 'facebook', 'tiktok']);
  });

  it('should find link by platform', () => {
    const instagramLink = service.getLinkByPlatform('instagram');
    expect(instagramLink).toBeDefined();
    expect(instagramLink?.platform).toBe('instagram');
    expect(instagramLink?.url).toContain('instagram.com');
  });

  it('should return undefined for non-existent platform', () => {
    const link = service.getLinkByPlatform('twitter' as any);
    expect(link).toBeUndefined();
  });

  it('should track social clicks', () => {
    spyOn(console, 'log');
    service.trackSocialClick('instagram');
    expect(console.log).toHaveBeenCalledWith('Social media clicked: instagram');
  });

  it('should open social links securely', () => {
    spyOn(window, 'open');
    service.openSocialLink('facebook');
    expect(window.open).toHaveBeenCalledWith(
      jasmine.stringContaining('facebook.com'),
      '_blank',
      'noopener,noreferrer'
    );
  });
});