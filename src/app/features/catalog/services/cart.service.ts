import { Injectable, signal, inject, OnDestroy } from '@angular/core';
import { SecuritySanitizerService } from '../../../core/services/security-sanitizer.service';
import { MilitaryCartIntegrityService, MilitarySecureCartItem } from '../../../core/services/cart-integrity.service';
import { Cart, CartItem, Product, PaymentInfo, CustomerData } from '../models/catalog.models';
import { CatalogService } from './catalog.service';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  private readonly securityService = inject(SecuritySanitizerService);
  private readonly militaryIntegrity = inject(MilitaryCartIntegrityService);
  private readonly catalogService = inject(CatalogService);
  
  private readonly CACHE_CLEANUP_INTERVAL = 60000; // 1 minute
  private readonly CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
  
  private readonly priceFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });
  private readonly militaryCartItems = signal<MilitarySecureCartItem[]>([]);
  
  // Signal reactivo para el estado del carrito (sin computed)
  private readonly cartState = signal<Cart>({ items: [], total: 0, itemCount: 0 });
  readonly cart = this.cartState.asReadonly();
  
  // Cache optimizado con limpieza automática
  private decryptionCache = new Map<string, { cartItem: CartItem; price: number; quantity: number; timestamp: number }>();
  private cacheCleanupTimer?: number;

  constructor() {
    this.setupCacheCleanup();
  }

  private setupCacheCleanup(): void {
    // Only setup cleanup in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    this.cacheCleanupTimer = window.setInterval(() => {
      const now = Date.now();
      
      for (const [key, cached] of this.decryptionCache.entries()) {
        if (now - cached.timestamp > this.CACHE_EXPIRATION_TIME) {
          this.decryptionCache.delete(key);
        }
      }
    }, this.CACHE_CLEANUP_INTERVAL);
  }

  ngOnDestroy(): void {
    if (this.cacheCleanupTimer) {
      clearInterval(this.cacheCleanupTimer);
    }
  }

  private syncCartState(): void {
    const militaryItems = this.militaryCartItems();
    const items: CartItem[] = [];
    let total = 0;
    let itemCount = 0;

    for (const militaryItem of militaryItems) {
      const cached = this.getDecryptedItemFromCache(militaryItem);
      if (cached && cached.cartItem) {
        items.push(cached.cartItem);
        total += cached.price * cached.quantity;
        itemCount += cached.quantity;
      }
    }
    
    this.cartState.set({ items, total, itemCount });
  }

  readonly paymentInfo: PaymentInfo = {
    bankAccount: 'Cuenta de Ahorros',
    accountType: 'Ahorros', 
    accountNumber: '****-****-****-3456',
    bankName: 'Banco SUMAK Gourmet'
  };

  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    if (!product?.id) return;

    const quantityValidation = this.securityService.validateQuantity(quantity);
    if (!quantityValidation.isValid) return;

    const validatedQuantity = Number(quantityValidation.sanitizedValue);
    const sanitizedProduct = this.sanitizeProduct(product);
    const currentItems = this.militaryCartItems();
    
    try {
      const existingItemIndex = currentItems.findIndex(item => item.productId === sanitizedProduct.id);

      if (existingItemIndex >= 0) {
        const existingItem = currentItems[existingItemIndex];
        const decrypted = await this.militaryIntegrity.decryptMilitaryItem(existingItem);
        
        if (!decrypted.isValid) return;

        const newQuantity = decrypted.quantity + validatedQuantity;
        const newQuantityValidation = this.securityService.validateQuantity(newQuantity);
        
        if (!newQuantityValidation.isValid) return;

        const updatedMilitaryItem = await this.militaryIntegrity.createMilitarySecureItem(
          sanitizedProduct.id,
          sanitizedProduct.name,
          sanitizedProduct.price,
          Number(newQuantityValidation.sanitizedValue)
        );

        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = updatedMilitaryItem;
        this.militaryCartItems.set(updatedItems);
        await this.updateDecryptionCache(updatedMilitaryItem, sanitizedProduct);
      } else {
        const militaryItem = await this.militaryIntegrity.createMilitarySecureItem(
          sanitizedProduct.id,
          sanitizedProduct.name,
          sanitizedProduct.price,
          validatedQuantity
        );
        
        this.militaryCartItems.set([...currentItems, militaryItem]);
        await this.updateDecryptionCache(militaryItem, sanitizedProduct);
      }
      
      this.syncCartState();
    } catch {
      // Silent fail for security
    }
  }

  async removeFromCart(productId: string): Promise<void> {
    if (!productId || typeof productId !== 'string') return;

    const currentItems = this.militaryCartItems();
    this.militaryCartItems.set(currentItems.filter(item => item.productId !== productId));
    this.decryptionCache.delete(productId);
    this.syncCartState();
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (!productId || typeof productId !== 'string') return;

    const quantityValidation = this.securityService.validateQuantity(quantity);
    if (!quantityValidation.isValid) {
      if (quantity <= 0) {
        await this.removeFromCart(productId);
      }
      return;
    }

    try {
      const validatedQuantity = Number(quantityValidation.sanitizedValue);
      const currentItems = this.militaryCartItems();
      const itemIndex = currentItems.findIndex(item => item.productId === productId);
      
      if (itemIndex >= 0) {
        const existingItem = currentItems[itemIndex];
        const decrypted = await this.militaryIntegrity.decryptMilitaryItem(existingItem);
        
        if (!decrypted.isValid) return;
        
        const updatedMilitaryItem = await this.militaryIntegrity.createMilitarySecureItem(
          existingItem.productId,
          decrypted.name,
          decrypted.price,
          validatedQuantity
        );

        const updatedItems = [...currentItems];
        updatedItems[itemIndex] = updatedMilitaryItem;
        this.militaryCartItems.set(updatedItems);
        await this.updateDecryptionCache(updatedMilitaryItem, this.getOriginalProduct(existingItem.productId));
        this.syncCartState();
      }
    } catch {
      // Silent fail for security
    }
  }

  clearCart(): void {
    this.militaryCartItems.set([]);
    this.decryptionCache.clear();
    this.cartState.set({ items: [], total: 0, itemCount: 0 });
  }

  private sanitizeProduct(product: Product): Product {
    const nameValidation = this.securityService.validateProductName(product.name);
    const priceValidation = this.securityService.validatePrice(product.price);
    
    return {
      ...product,
      name: nameValidation.sanitizedValue || 'Producto',
      price: Number(priceValidation.sanitizedValue) || 0,
      description: this.securityService.sanitizeDescription(product.description)
    };
  }

  async generateMilitarySecureOrder(customerData: CustomerData): Promise<string> {
    try {
      const militaryOrder = await this.militaryIntegrity.createMilitarySecureOrder(this.militaryCartItems());
      const whatsappMessage = await this.militaryIntegrity.generateMilitaryWhatsAppMessage(militaryOrder, customerData);
      
      this.clearCart();
      return whatsappMessage;
    } catch {
      throw new Error('Error de seguridad militar: No se pudo generar el pedido.');
    }
  }

  async validateMilitaryCartIntegrity(): Promise<boolean> {
    try {
      const items = this.militaryCartItems();
      for (const item of items) {
        const decrypted = await this.militaryIntegrity.decryptMilitaryItem(item);
        if (!decrypted.isValid) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  private getOriginalProduct(productId: string): Product | undefined {
    try {
      return this.catalogService.getProductById(productId);
    } catch {
      return undefined;
    }
  }

  private getDecryptedItemFromCache(militaryItem: MilitarySecureCartItem) {
    const cached = this.decryptionCache.get(militaryItem.productId);
    
    // Validación estricta de timestamp para prevenir cache stale
    if (cached && cached.timestamp === militaryItem.timestamp && cached.cartItem) {
      return cached;
    }
    
    return null;
  }

  private async updateDecryptionCache(militaryItem: MilitarySecureCartItem, originalProduct?: Product): Promise<void> {
    try {
      const decrypted = await this.militaryIntegrity.decryptMilitaryItem(militaryItem);
      if (decrypted.isValid) {
        const cartItem: CartItem = {
          product: {
            id: militaryItem.productId,
            name: decrypted.name,
            price: decrypted.price,
            description: originalProduct?.description || '',
            experience: originalProduct?.experience || '',
            ingredients: originalProduct?.ingredients || [],
            sensorialExperience: originalProduct?.sensorialExperience || '',
            imageUrl: originalProduct?.imageUrl || '',
            category: originalProduct?.category || 'classic' as any,
            curatedLine: originalProduct?.curatedLine || '',
            occasions: originalProduct?.occasions || [],
            affinity: originalProduct?.affinity || { temperament: [], palate: [], genderAffinity: '' },
            servingSuggestion: originalProduct?.servingSuggestion || ''
          },
          quantity: decrypted.quantity,
          addedAt: new Date(militaryItem.timestamp)
        };
        
        this.decryptionCache.set(militaryItem.productId, {
          cartItem,
          price: decrypted.price,
          quantity: decrypted.quantity,
          timestamp: militaryItem.timestamp
        });
      }
    } catch {
      // Silent fail for security
    }
  }

  formatPrice(price: number): string {
    const validation = this.securityService.validatePrice(price);
    
    if (!validation.isValid) {
      return '$0';
    }

    return this.priceFormatter.format(Number(validation.sanitizedValue));
  }
}