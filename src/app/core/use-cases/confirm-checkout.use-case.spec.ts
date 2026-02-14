import { TestBed } from '@angular/core/testing';
import { ConfirmCheckoutUseCase } from './confirm-checkout.use-case';
import { CartService } from '../../features/catalog/services/cart.service';
import { OrderExportService } from '../../features/catalog/services/order-export.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { PdfStorageService } from '../services/pdf-storage.service';
import { CheckoutAnalyticsService } from '../services/checkout-analytics.service';

describe('ConfirmCheckoutUseCase', () => {
  let useCase: ConfirmCheckoutUseCase;
  let cartService: jasmine.SpyObj<CartService>;
  let orderExport: jasmine.SpyObj<OrderExportService>;
  let whatsappService: jasmine.SpyObj<WhatsAppService>;
  let pdfStorage: jasmine.SpyObj<PdfStorageService>;
  let analytics: jasmine.SpyObj<CheckoutAnalyticsService>;

  beforeEach(() => {
    const cartSpy = jasmine.createSpyObj('CartService', ['validateMilitaryCartIntegrity', 'cart']);
    const orderSpy = jasmine.createSpyObj('OrderExportService', ['exportOrderToPDF', 'downloadPDF']);
    const whatsappSpy = jasmine.createSpyObj('WhatsAppService', ['openWhatsAppOrder']);
    const pdfSpy = jasmine.createSpyObj('PdfStorageService', ['uploadPdfAndGetSecureUrl']);
    const analyticsSpy = jasmine.createSpyObj('CheckoutAnalyticsService', ['track']);

    TestBed.configureTestingModule({
      providers: [
        ConfirmCheckoutUseCase,
        { provide: CartService, useValue: cartSpy },
        { provide: OrderExportService, useValue: orderSpy },
        { provide: WhatsAppService, useValue: whatsappSpy },
        { provide: PdfStorageService, useValue: pdfSpy },
        { provide: CheckoutAnalyticsService, useValue: analyticsSpy }
      ]
    });

    useCase = TestBed.inject(ConfirmCheckoutUseCase);
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    orderExport = TestBed.inject(OrderExportService) as jasmine.SpyObj<OrderExportService>;
    whatsappService = TestBed.inject(WhatsAppService) as jasmine.SpyObj<WhatsAppService>;
    pdfStorage = TestBed.inject(PdfStorageService) as jasmine.SpyObj<PdfStorageService>;
    analytics = TestBed.inject(CheckoutAnalyticsService) as jasmine.SpyObj<CheckoutAnalyticsService>;
  });

  it('should execute complete checkout flow successfully', async () => {
    const mockCustomer = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '3001234567',
      address: 'Calle 123',
      department: 'Bogotá',
      municipality: 'Bogotá',
      identificationType: 'CC',
      identificationNumber: '123456789',
      acceptsDataProcessing: true
    };

    const mockCart = {
      items: [{ product: { name: 'Test', price: 100000 }, quantity: 1 }],
      total: 100000,
      itemCount: 1
    };

    cartService.validateMilitaryCartIntegrity.and.returnValue(Promise.resolve(true));
    cartService.cart.and.returnValue(mockCart as any);
    orderExport.exportOrderToPDF.and.returnValue(Promise.resolve({
      pdfBase64: 'base64data',
      orderNumber: 'ORD-123',
      filename: 'order.pdf'
    }));
    pdfStorage.uploadPdfAndGetSecureUrl.and.returnValue(Promise.resolve('https://example.com/pdf'));

    const result = await useCase.execute(mockCustomer);

    expect(result.success).toBe(true);
    expect(result.pdfUrl).toBe('https://example.com/pdf');
    expect(analytics.track).toHaveBeenCalledWith('checkout_confirm_clicked');
    expect(analytics.track).toHaveBeenCalledWith('pdf_generated', jasmine.any(Object));
    expect(analytics.track).toHaveBeenCalledWith('pdf_downloaded');
    expect(analytics.track).toHaveBeenCalledWith('pdf_link_created');
    expect(analytics.track).toHaveBeenCalledWith('whatsapp_opened');
    expect(analytics.track).toHaveBeenCalledWith('checkout_completed_intent', jasmine.any(Object));
  });

  it('should handle cart integrity failure', async () => {
    const mockCustomer = {} as any;
    cartService.validateMilitaryCartIntegrity.and.returnValue(Promise.resolve(false));

    const result = await useCase.execute(mockCustomer);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(analytics.track).toHaveBeenCalledWith('checkout_error', jasmine.any(Object));
  });

  it('should build premium WhatsApp message with PDF link', async () => {
    const mockCustomer = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '3001234567',
      address: 'Calle 123',
      department: 'Bogotá',
      municipality: 'Bogotá',
      identificationType: 'CC',
      identificationNumber: '123456789',
      acceptsDataProcessing: true
    };

    const mockCart = {
      items: [{ product: { name: 'Café Premium', price: 50000 }, quantity: 2 }],
      total: 100000,
      itemCount: 2
    };

    cartService.validateMilitaryCartIntegrity.and.returnValue(Promise.resolve(true));
    cartService.cart.and.returnValue(mockCart as any);
    orderExport.exportOrderToPDF.and.returnValue(Promise.resolve({
      pdfBase64: 'base64data',
      orderNumber: 'ORD-456',
      filename: 'order.pdf'
    }));
    pdfStorage.uploadPdfAndGetSecureUrl.and.returnValue(Promise.resolve('https://example.com/pdf/456'));

    const result = await useCase.execute(mockCustomer);

    expect(result.whatsappMessage).toContain('PEDIDO SUMAK GOURMET');
    expect(result.whatsappMessage).toContain('ORD-456');
    expect(result.whatsappMessage).toContain('Juan Pérez');
    expect(result.whatsappMessage).toContain('Café Premium');
    expect(result.whatsappMessage).toContain('https://example.com/pdf/456');
    expect(result.whatsappMessage).toContain('@DAVISUMAK');
  });
});
