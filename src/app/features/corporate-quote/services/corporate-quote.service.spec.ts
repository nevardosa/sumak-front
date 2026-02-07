import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CorporateQuoteService } from './corporate-quote.service';
import { CorporateQuoteForm } from '../models/corporate-quote.interface';

describe('CorporateQuoteService', () => {
  let service: CorporateQuoteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CorporateQuoteService]
    });
    service = TestBed.inject(CorporateQuoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Security: Honeypot', () => {
    it('should reject submission if honeypot is filled', (done) => {
      const formData: CorporateQuoteForm = {
        nombreCompleto: 'Juan Pérez',
        empresa: 'Test Corp',
        email: 'test@test.com',
        telefono: '3001234567',
        cantidad: 50,
        honeypot: 'bot-filled-this'
      };

      service.submitQuote(formData).subscribe({
        error: (error) => {
          expect(error.message).toBe('Solicitud inválida');
          done();
        }
      });
    });
  });

  describe('Security: Sanitization', () => {
    it('should sanitize XSS attempts in text fields', () => {
      const malicious = '<script>alert("xss")</script>Test';
      const sanitized = service['sanitizeText'](malicious, 2, 80);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    it('should remove dangerous characters', () => {
      const dangerous = 'Test<>"\\'`javascript:';
      const sanitized = service['sanitizeText'](dangerous, 2, 80);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain('javascript:');
    });

    it('should normalize whitespace', () => {
      const text = 'Test    multiple   spaces';
      const sanitized = service['sanitizeText'](text, 2, 80);
      expect(sanitized).toBe('Test multiple spaces');
    });
  });

  describe('Security: Email Validation', () => {
    it('should accept valid email', () => {
      const email = 'test@example.com';
      const sanitized = service['sanitizeEmail'](email);
      expect(sanitized).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      expect(() => service['sanitizeEmail']('invalid-email')).toThrow();
      expect(() => service['sanitizeEmail']('test@')).toThrow();
      expect(() => service['sanitizeEmail']('@test.com')).toThrow();
    });

    it('should convert email to lowercase', () => {
      const email = 'TEST@EXAMPLE.COM';
      const sanitized = service['sanitizeEmail'](email);
      expect(sanitized).toBe('test@example.com');
    });
  });

  describe('Security: Phone Validation', () => {
    it('should normalize Colombian phone with +57', () => {
      const phone = '3001234567';
      const sanitized = service['sanitizePhone'](phone);
      expect(sanitized).toBe('+573001234567');
    });

    it('should accept phone already with country code', () => {
      const phone = '573001234567';
      const sanitized = service['sanitizePhone'](phone);
      expect(sanitized).toBe('+573001234567');
    });

    it('should reject invalid Colombian phone', () => {
      expect(() => service['sanitizePhone']('1234567890')).toThrow();
      expect(() => service['sanitizePhone']('300123')).toThrow();
    });
  });

  describe('Security: Quantity Validation', () => {
    it('should accept valid quantity', () => {
      const quantity = service['sanitizeQuantity'](50);
      expect(quantity).toBe(50);
    });

    it('should reject quantity below minimum', () => {
      expect(() => service['sanitizeQuantity'](5)).toThrow();
    });

    it('should reject quantity above maximum', () => {
      expect(() => service['sanitizeQuantity'](6000)).toThrow();
    });

    it('should reject non-integer quantity', () => {
      expect(() => service['sanitizeQuantity'](50.5)).toThrow();
    });
  });

  describe('Anti-spam: Cooldown', () => {
    it('should enforce cooldown between submissions', (done) => {
      const formData: CorporateQuoteForm = {
        nombreCompleto: 'Juan Pérez',
        empresa: 'Test Corp',
        email: 'test@test.com',
        telefono: '3001234567',
        cantidad: 50
      };

      service.submitQuote(formData).subscribe();
      
      const req = httpMock.expectOne('https://formspree.io/f/xykdyzga');
      req.flush({});

      // Immediate second submission should fail
      service.submitQuote(formData).subscribe({
        error: (error) => {
          expect(error.message).toContain('espera unos segundos');
          done();
        }
      });
    });
  });

  describe('WhatsApp Message Generation', () => {
    it('should generate properly formatted message', () => {
      const payload = {
        nombreCompleto: 'Juan Pérez',
        empresa: 'Test Corp',
        cargo: 'Gerente',
        email: 'test@test.com',
        telefono: '+573001234567',
        cantidad: 50,
        nota: 'Test note'
      };

      const message = service.generateWhatsAppMessage(payload);
      
      expect(message).toContain('COTIZACIÓN CORPORATIVA SUMAK');
      expect(message).toContain('Juan Pérez');
      expect(message).toContain('Test Corp');
      expect(message).toContain('50 unidades');
    });
  });
});
