import { Injectable, signal, computed, inject } from '@angular/core';
import { SecuritySanitizerService } from '../../../core/services/security-sanitizer.service';
import { MilitaryCartIntegrityService, MilitarySecureCartItem } from '../../../core/services/cart-integrity.service';
import { Cart, CartItem, Product, Order, OrderStatus, PaymentInfo } from '../models/catalog.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly securityService = inject(SecuritySanitizerService);
  private readonly militaryIntegrity = inject(MilitaryCartIntegrityService);
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
    this.cacheCleanupTimer = window.setInterval(() => {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      for (const [key, cached] of this.decryptionCache.entries()) {
        if (now - cached.timestamp > fiveMinutes) {
          this.decryptionCache.delete(key);
        }
      }
    }, 60000);
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
    accountNumber: '1234-5678-9012-3456',
    bankName: 'Banco SUMAK Gourmet'
  };

  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    if (!product || !product.id) {
      console.warn('[MILITARY SECURITY] Invalid product data');
      return;
    }

    const quantityValidation = this.securityService.validateQuantity(quantity);
    if (!quantityValidation.isValid) {
      console.warn('[MILITARY SECURITY] Invalid quantity:', quantityValidation.errors);
      return;
    }

    const validatedQuantity = Number(quantityValidation.sanitizedValue);
    const sanitizedProduct = this.sanitizeProduct(product);
    
    try {
      const currentItems = this.militaryCartItems();
      const existingItemIndex = currentItems.findIndex(item => item.productId === sanitizedProduct.id);

      if (existingItemIndex >= 0) {
        const existingItem = currentItems[existingItemIndex];
        const decrypted = await this.militaryIntegrity.decryptMilitaryItem(existingItem);
        
        if (!decrypted.isValid) {
          console.error('[MILITARY SECURITY] Existing item decryption failed');
          return;
        }

        const newQuantity = decrypted.quantity + validatedQuantity;
        const newQuantityValidation = this.securityService.validateQuantity(newQuantity);
        
        if (!newQuantityValidation.isValid) {
          console.warn('[MILITARY SECURITY] Total quantity exceeds limit');
          return;
        }

        const updatedMilitaryItem = await this.militaryIntegrity.createMilitarySecureItem(
          sanitizedProduct.id,
          sanitizedProduct.name,
          sanitizedProduct.price,
          Number(newQuantityValidation.sanitizedValue)
        );

        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = updatedMilitaryItem;
        this.militaryCartItems.set(updatedItems);
        await this.updateDecryptionCache(updatedMilitaryItem);
      } else {
        const militaryItem = await this.militaryIntegrity.createMilitarySecureItem(
          sanitizedProduct.id,
          sanitizedProduct.name,
          sanitizedProduct.price,
          validatedQuantity
        );
        
        this.militaryCartItems.set([...currentItems, militaryItem]);
        await this.updateDecryptionCache(militaryItem);
      }
      
      this.syncCartState();
    } catch (error) {
      console.error('[MILITARY SECURITY] Failed to add item to cart:', error);
    }
  }

  async removeFromCart(productId: string): Promise<void> {
    if (!productId || typeof productId !== 'string') {
      console.warn('[MILITARY SECURITY] Invalid product ID for removal');
      return;
    }

    const currentItems = this.militaryCartItems();
    this.militaryCartItems.set(currentItems.filter(item => item.productId !== productId));
    this.decryptionCache.delete(productId);
    this.syncCartState();
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (!productId || typeof productId !== 'string') {
      console.warn('[MILITARY SECURITY] Invalid product ID');
      return;
    }

    const quantityValidation = this.securityService.validateQuantity(quantity);
    if (!quantityValidation.isValid) {
      if (quantity <= 0) {
        await this.removeFromCart(productId);
        return;
      }
      console.warn('[MILITARY SECURITY] Invalid quantity update:', quantityValidation.errors);
      return;
    }

    try {
      const validatedQuantity = Number(quantityValidation.sanitizedValue);
      const currentItems = this.militaryCartItems();
      const itemIndex = currentItems.findIndex(item => item.productId === productId);
      
      if (itemIndex >= 0) {
        const existingItem = currentItems[itemIndex];
        const decrypted = await this.militaryIntegrity.decryptMilitaryItem(existingItem);
        
        if (!decrypted.isValid) {
          console.error('[MILITARY SECURITY] Item decryption failed during update');
          return;
        }
        
        const updatedMilitaryItem = await this.militaryIntegrity.createMilitarySecureItem(
          existingItem.productId,
          decrypted.name,
          decrypted.price,
          validatedQuantity
        );

        const updatedItems = [...currentItems];
        updatedItems[itemIndex] = updatedMilitaryItem;
        this.militaryCartItems.set(updatedItems);
        await this.updateDecryptionCache(updatedMilitaryItem);
        this.syncCartState();
      }
    } catch (error) {
      console.error('[MILITARY SECURITY] Failed to update quantity:', error);
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

  async generateMilitarySecureOrder(customerData: any): Promise<string> {
    try {
      const militaryOrder = await this.militaryIntegrity.createMilitarySecureOrder(this.militaryCartItems());
      const whatsappMessage = await this.militaryIntegrity.generateMilitaryWhatsAppMessage(militaryOrder, customerData);
      
      this.clearCart();
      return whatsappMessage;
    } catch (error) {
      console.error('[MILITARY SECURITY] Order generation failed:', error);
      throw new Error('Error de seguridad militar: No se pudo generar el pedido.');
    }
  }

  async validateMilitaryCartIntegrity(): Promise<boolean> {
    try {
      const items = this.militaryCartItems();
      for (const item of items) {
        const decrypted = await this.militaryIntegrity.decryptMilitaryItem(item);
        if (!decrypted.isValid) {
          console.error('[MILITARY SECURITY] Cart integrity check failed for item:', item.productId);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('[MILITARY SECURITY] Cart integrity validation error:', error);
      return false;
    }
  }

  private async getDecryptedItemFromCacheAsync(militaryItem: MilitarySecureCartItem) {
    const cached = this.decryptionCache.get(militaryItem.productId);
    
    if (cached && cached.timestamp === militaryItem.timestamp && cached.cartItem) {
      return cached;
    }
    
    if (!cached || cached.timestamp !== militaryItem.timestamp) {
      await this.updateDecryptionCache(militaryItem);
      return this.decryptionCache.get(militaryItem.productId);
    }
    
    return null;
  }

  private getDecryptedItemFromCache(militaryItem: MilitarySecureCartItem) {
    const cached = this.decryptionCache.get(militaryItem.productId);
    
    // Validación estricta de timestamp para prevenir cache stale
    if (cached && cached.timestamp === militaryItem.timestamp && cached.cartItem) {
      return cached;
    }
    
    return null;
  }

  private async updateDecryptionCache(militaryItem: MilitarySecureCartItem): Promise<void> {
    try {
      const decrypted = await this.militaryIntegrity.decryptMilitaryItem(militaryItem);
      if (decrypted.isValid) {
        const cartItem: CartItem = {
          product: {
            id: militaryItem.productId,
            name: decrypted.name,
            price: decrypted.price,
            description: '',
            experience: '',
            ingredients: [],
            sensorialExperience: '',
            imageUrl: '',
            category: 'classic' as any,
            curatedLine: '',
            occasions: [],
            affinity: { temperament: [], palate: [], genderAffinity: '' },
            servingSuggestion: ''
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
    } catch (error) {
      console.error('[MILITARY SECURITY] Cache update failed:', error);
    }
  }

  formatPrice(price: number): string {
    const validation = this.securityService.validatePrice(price);
    
    if (!validation.isValid) {
      console.warn('[MILITARY SECURITY] Price formatting failed:', validation.errors);
      return '$0';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(validation.sanitizedValue));
  }
}