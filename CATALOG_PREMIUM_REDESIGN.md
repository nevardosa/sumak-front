# 🎨 REDISEÑO PREMIUM CATÁLOGO - SUMAK GOURMET
## Experiencia de Marca de Lujo (Apple/Louis Vuitton/Tesla Level)

**Fecha**: 2026-01-09  
**Objetivo**: Transformar catálogo en experiencia premium aspiracional  
**Principios**: Minimalismo, Exclusividad, Conversión B2B  

---

## 📊 ANÁLISIS ACTUAL vs OBJETIVO

### Estado Actual (Problema)
- ❌ Cards sobrecargadas de información
- ❌ Descripción larga visible en card
- ❌ Experiencia sensorial en card (rompe minimalismo)
- ❌ Múltiples botones compitiendo
- ❌ Sensación de catálogo masivo
- ❌ No transmite exclusividad

### Estado Objetivo (Solución)
- ✅ Cards minimalistas (imagen + nombre + acción)
- ✅ Información detallada en modal narrativo
- ✅ Espacios en blanco generosos
- ✅ Hover states sofisticados
- ✅ Experiencia de descubrimiento
- ✅ Señales B2B sutiles

---

## 🎯 PRINCIPIOS DE DISEÑO PREMIUM

### 1. Less is More (Minimalismo)
```
Card debe mostrar SOLO:
- Imagen protagonista (80% del espacio)
- Nombre del ritual (elegante, grande)
- Precio (discreto pero visible)
- 1 botón primario: "Descubrir"
- 1 botón secundario: "Agregar" (hover)
```

### 2. Espacios en Blanco Generosos
```
- Padding generoso: 24-32px
- Margin entre cards: 32-48px
- Line-height: 1.6-1.8
- Letter-spacing en títulos: 0.02em
```

### 3. Tipografía Elegante
```
- Títulos: Against (serif elegante)
- Cuerpo: Garet (sans-serif limpia)
- Tamaños: 24-32px títulos, 14-16px cuerpo
- Peso: Light/Regular (no bold excesivo)
```

### 4. Animaciones Sutiles
```
- Duración: 300-400ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Hover: scale(1.02), no scale(1.1)
- Fade: opacity 0.8 → 1.0
```

### 5. Colores Premium
```
- Fondo: #FFFFFF (blanco puro)
- Texto primario: #1A1A1A (casi negro)
- Texto secundario: #6B7280 (gris medio)
- Acento: #C5A572 (dorado Sumak)
- Bordes: #F3F4F6 (gris muy claro)
```

---

## 🎨 COMPONENTE: PRODUCT CARD PREMIUM

### Estructura Visual

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         IMAGEN PRODUCTO         │
│         (Aspect 4:5)            │
│                                 │
│                                 │
│  [Badge Corporativo] (hover)    │
│                                 │
├─────────────────────────────────┤
│                                 │
│   Nombre del Ritual             │
│   (24px, Against, elegante)     │
│                                 │
│   $180.000                      │
│   (16px, discreto)              │
│                                 │
│   [Descubrir]  [+] (hover)      │
│                                 │
└─────────────────────────────────┘
```

### Implementación TypeScript

```typescript
// product-card-premium.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-card-premium',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card-premium.component.html',
  styleUrl: './product-card-premium.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardPremiumComponent {
  @Input({ required: true }) product!: Product;
  @Output() discover = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  readonly isHovered = signal(false);

  onDiscover(): void {
    this.discover.emit(this.product);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  get isCorporate(): boolean {
    return this.product.tags?.includes('corporativo') || 
           this.product.category === 'premium' ||
           this.product.category === 'exclusive';
  }
}
```

### Template HTML Premium

```html
<!-- product-card-premium.component.html -->
<article 
  class="product-card-premium group"
  (mouseenter)="isHovered.set(true)"
  (mouseleave)="isHovered.set(false)"
  (click)="onDiscover()">
  
  <!-- Image Container -->
  <div class="image-container">
    <img
      [src]="product.imageUrl"
      [alt]="product.name"
      class="product-image"
      loading="lazy"
      width="400"
      height="500">
    
    <!-- Corporate Badge (Hover Only) -->
    <div class="corporate-badge" *ngIf="isCorporate">
      <span class="badge-text">Ideal para regalos corporativos</span>
    </div>

    <!-- Overlay Gradient (Hover) -->
    <div class="image-overlay"></div>
  </div>

  <!-- Content -->
  <div class="card-content">
    <!-- Product Name -->
    <h3 class="product-name">
      {{ product.name }}
    </h3>

    <!-- Price -->
    <p class="product-price">
      {{ formatPrice(product.price) }}
    </p>

    <!-- Actions -->
    <div class="card-actions">
      <!-- Primary Button -->
      <button
        type="button"
        (click)="onDiscover()"
        class="btn-discover"
        aria-label="Descubrir {{ product.name }}">
        Descubrir
      </button>

      <!-- Secondary Button (Hover Only) -->
      <button
        type="button"
        (click)="onAddToCart($event)"
        class="btn-add"
        aria-label="Agregar {{ product.name }} al carrito">
        <svg class="icon-add" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      </button>
    </div>
  </div>
</article>
```

### Estilos SCSS Premium

```scss
// product-card-premium.component.scss

.product-card-premium {
  position: relative;
  background: #FFFFFF;
  border-radius: 0; // Minimalismo: sin bordes redondeados
  overflow: hidden;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);

  // Hover: Elevación sutil
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  // Focus: Accesibilidad
  &:focus-within {
    outline: 2px solid #C5A572;
    outline-offset: 4px;
  }
}

// Image Container
.image-container {
  position: relative;
  aspect-ratio: 4 / 5; // Proporción elegante (no cuadrado)
  overflow: hidden;
  background: #F9FAFB;

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);

    .product-card-premium:hover & {
      transform: scale(1.05); // Zoom sutil
    }
  }

  // Corporate Badge (Hover Only)
  .corporate-badge {
    position: absolute;
    top: 24px;
    left: 24px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 24px;
    opacity: 0;
    transform: translateY(-8px);
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

    .product-card-premium:hover & {
      opacity: 1;
      transform: translateY(0);
    }

    .badge-text {
      font-family: 'Garet', sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: #1A1A1A;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
  }

  // Overlay Gradient (Hover)
  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.3) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);

    .product-card-premium:hover & {
      opacity: 1;
    }
  }
}

// Content
.card-content {
  padding: 32px 24px; // Espacios generosos
  text-align: center;
}

// Product Name
.product-name {
  font-family: 'Against', serif;
  font-size: 24px;
  font-weight: 400; // Light, no bold
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: #1A1A1A;
  margin: 0 0 12px 0;
  
  // Truncate elegante
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Price
.product-price {
  font-family: 'Garet', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #6B7280; // Gris discreto
  margin: 0 0 24px 0;
}

// Actions
.card-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

// Button: Descubrir (Primary)
.btn-discover {
  flex: 1;
  max-width: 200px;
  padding: 14px 32px;
  font-family: 'Garet', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #1A1A1A;
  border: none;
  border-radius: 0; // Minimalismo
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #2D2D2D;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid #C5A572;
    outline-offset: 2px;
  }
}

// Button: Agregar (Secondary, Hover Only)
.btn-add {
  width: 48px;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

  .product-card-premium:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: #F9FAFB;
    border-color: #C5A572;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  .icon-add {
    width: 20px;
    height: 20px;
    color: #1A1A1A;
  }
}

// Responsive
@media (max-width: 768px) {
  .card-content {
    padding: 24px 16px;
  }

  .product-name {
    font-size: 20px;
  }

  .product-price {
    font-size: 14px;
  }

  .btn-discover {
    padding: 12px 24px;
    font-size: 13px;
  }

  // En mobile, mostrar botón agregar siempre
  .btn-add {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 🎭 COMPONENTE: PRODUCT DETAIL MODAL PREMIUM

### Experiencia Narrativa

```
┌────────────────────────────────────────┐
│  [X]                                   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │      IMAGEN HERO GRANDE          │ │
│  │      (Aspect 16:9)               │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Nombre del Ritual                     │
│  (40px, Against, protagonista)         │
│                                        │
│  "Una experiencia sensorial..."        │
│  (18px, italic, emocional)             │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│  Historia del Ritual                   │
│  Párrafo narrativo aspiracional...     │
│                                        │
│  Experiencia Sensorial                 │
│  Descripción detallada...              │
│                                        │
│  Contenido                             │
│  • Chocolate artesanal...              │
│  • Vinos premium...                    │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│  $180.000                              │
│  (32px, destacado)                     │
│                                        │
│  [Agregar al Carrito]                  │
│  (Full width, prominente)              │
│                                        │
│  Ideal para:                           │
│  • Regalos corporativos                │
│  • Reconocimientos empresariales       │
│                                        │
└────────────────────────────────────────┘
```

### Implementación TypeScript

```typescript
// product-detail-modal.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailModalComponent {
  @Input({ required: true }) product!: Product;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<Product>();

  readonly isClosing = signal(false);

  constructor() {
    // Prevenir scroll cuando modal está abierto
    effect(() => {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  onClose(): void {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isClosing.set(false);
      this.close.emit();
    }, 300); // Duración de animación
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  get corporateOccasions(): string[] {
    return [
      'Regalos corporativos para clientes',
      'Reconocimientos empresariales',
      'Agradecimientos a aliados',
      'Celebraciones de equipo',
      'Cierres de negocio'
    ];
  }
}
```

### Template HTML Modal

```html
<!-- product-detail-modal.component.html -->
<div 
  class="modal-backdrop"
  [class.is-open]="isOpen"
  [class.is-closing]="isClosing()"
  (click)="onBackdropClick($event)"
  *ngIf="isOpen">
  
  <div class="modal-container">
    <!-- Close Button -->
    <button
      type="button"
      (click)="onClose()"
      class="btn-close"
      aria-label="Cerrar">
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Modal Content -->
    <div class="modal-content">
      <!-- Hero Image -->
      <div class="hero-image">
        <img
          [src]="product.imageUrl"
          [alt]="product.name"
          loading="eager">
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <!-- Product Name -->
        <h2 class="product-title">
          {{ product.name }}
        </h2>

        <!-- Emotional Subtitle -->
        <p class="product-subtitle">
          {{ product.sensorialExperience }}
        </p>

        <div class="divider"></div>

        <!-- Story Section -->
        <section class="story-section">
          <h3 class="section-title">El Ritual</h3>
          <p class="section-text">
            {{ product.description }}
          </p>
        </section>

        <!-- Content List -->
        <section class="content-section-list" *ngIf="product.content?.length">
          <h3 class="section-title">Contenido</h3>
          <ul class="content-list">
            <li *ngFor="let item of product.content" class="content-item">
              {{ item }}
            </li>
          </ul>
        </section>

        <div class="divider"></div>

        <!-- Price & CTA -->
        <div class="purchase-section">
          <p class="price-large">
            {{ formatPrice(product.price) }}
          </p>

          <button
            type="button"
            (click)="onAddToCart()"
            class="btn-add-to-cart">
            Agregar al Carrito
          </button>
        </div>

        <!-- Corporate Occasions -->
        <section class="corporate-section">
          <h4 class="corporate-title">Ideal para:</h4>
          <ul class="corporate-list">
            <li *ngFor="let occasion of corporateOccasions" class="corporate-item">
              {{ occasion }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</div>
```

---

