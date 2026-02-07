import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let dataLayerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
    
    // Mock dataLayer
    (window as any).dataLayer = [];
    dataLayerSpy = spyOn((window as any).dataLayer, 'push');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('PII Sanitization', () => {
    it('should block email field', () => {
      service.track('click_solicitar_propuesta', {
        email: 'test@example.com',
        placement: 'hero'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.email).toBeUndefined();
      expect(pushedData.placement).toBe('hero');
    });

    it('should block phone field', () => {
      service.track('form_submit_propuesta', {
        phone: '+573208663691',
        form_id: 'contact_form'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.phone).toBeUndefined();
      expect(pushedData.form_id).toBe('contact_form');
    });

    it('should block name fields', () => {
      service.track('form_start_propuesta', {
        firstname: 'John',
        lastname: 'Doe',
        name: 'John Doe',
        placement: 'section'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.firstname).toBeUndefined();
      expect(pushedData.lastname).toBeUndefined();
      expect(pushedData.name).toBeUndefined();
      expect(pushedData.placement).toBe('section');
    });

    it('should block message field', () => {
      service.track('form_submit_propuesta', {
        message: 'This is a private message',
        form_id: 'contact_form'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.message).toBeUndefined();
      expect(pushedData.form_id).toBe('contact_form');
    });

    it('should block email pattern in string values', () => {
      service.track('click_whatsapp', {
        custom_field: 'Contact me at test@example.com',
        placement: 'floating'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.custom_field).toBeUndefined();
      expect(pushedData.placement).toBe('floating');
    });

    it('should block phone pattern in string values', () => {
      service.track('click_email', {
        custom_field: 'Call me at +57 320 866 3691',
        placement: 'footer'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.custom_field).toBeUndefined();
      expect(pushedData.placement).toBe('footer');
    });

    it('should allow safe parameters', () => {
      service.track('click_solicitar_propuesta', {
        placement: 'hero',
        cta_label: 'Solicitar Propuesta',
        page_path: '/regalos-corporativos'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.placement).toBe('hero');
      expect(pushedData.cta_label).toBe('Solicitar Propuesta');
      expect(pushedData.page_path).toBe('/regalos-corporativos');
    });
  });

  describe('Event Tracking', () => {
    it('should push event to dataLayer', () => {
      service.track('click_whatsapp', {
        placement: 'floating'
      });

      expect(dataLayerSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          event: 'click_whatsapp',
          placement: 'floating'
        })
      );
    });

    it('should add page_path automatically if not provided', () => {
      spyOnProperty(window.location, 'pathname', 'get').and.returnValue('/catalog');
      
      service.track('view_catalog', {});

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.page_path).toBe('/catalog');
    });

    it('should not override provided page_path', () => {
      service.track('view_regalos_corporativos', {
        page_path: '/custom-path'
      });

      const pushedData = dataLayerSpy.calls.mostRecent().args[0];
      expect(pushedData.page_path).toBe('/custom-path');
    });
  });

  describe('Page View Tracking', () => {
    it('should track page view with path and title', () => {
      service.trackPageView('/about', 'About Us');

      expect(dataLayerSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          event: 'page_view',
          page_path: '/about',
          page_title: 'About Us'
        })
      );
    });
  });

  describe('Consent Management', () => {
    it('should set consent to granted', () => {
      service.setConsent(true);

      expect(dataLayerSpy).toHaveBeenCalledWith({
        event: 'consent_update',
        consent: {
          analytics_storage: 'granted',
          ad_storage: 'granted'
        }
      });
    });

    it('should set consent to denied', () => {
      service.setConsent(false);

      expect(dataLayerSpy).toHaveBeenCalledWith({
        event: 'consent_update',
        consent: {
          analytics_storage: 'denied',
          ad_storage: 'denied'
        }
      });
    });
  });
});
