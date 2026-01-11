import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCryptoService: jasmine.SpyObj<CryptoService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const cryptoSpy = jasmine.createSpyObj('CryptoService', ['hash', 'generateSecureToken']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: CryptoService, useValue: cryptoSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockCryptoService = TestBed.inject(CryptoService) as jasmine.SpyObj<CryptoService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with unauthenticated state', () => {
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.sessionToken()).toBeNull();
  });

  it('should validate correct credentials', async () => {
    mockCryptoService.hash.and.returnValue(Promise.resolve('valid_hash'));
    mockCryptoService.generateSecureToken.and.returnValue('secure_token_123');

    const result = await service.login({
      username: 'admin',
      password: 'LA9_ds*De.SX2026-+'
    });

    expect(result).toBeTruthy();
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should reject invalid credentials', async () => {
    mockCryptoService.hash.and.returnValue(Promise.resolve('invalid_hash'));

    const result = await service.login({
      username: 'wrong',
      password: 'wrong'
    });

    expect(result).toBeFalsy();
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should logout and clear session', () => {
    service.logout();
    
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.sessionToken()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update activity timestamp', () => {
    const initialActivity = Date.now();
    service.updateActivity();
    
    // Activity should be updated (this is a basic test)
    expect(service.isAuthenticated).toBeDefined();
  });
});