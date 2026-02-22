# 🏗️ REFACTORIZACIÓN COMPLETA PREMIUM - SISTEMA PDP RITUALES

## ✅ ESTADO: IMPLEMENTACIÓN EN PROGRESO

---

## 📋 COMPONENTES CREADOS

### 1. RitualBadgesComponent ✅
**Ubicación**: `src/app/features/ritual/components/ritual-badges.component.ts`

**Propósito**: Mostrar badges de decisión (producción limitada, entrega express, etc.)

**Input**: `badges: string[]`

**Características**:
- Grid responsive (2 columnas móvil, 4 desktop)
- Iconos dinámicos según texto del badge
- Hover effects premium
- Change detection OnPush

---

### 2. RitualCorporateBlockComponent ✅
**Ubicación**: `src/app/features/ritual/components/ritual-corporate-block.component.ts`

**Propósito**: Bloque B2B con beneficios corporativos reales

**Input**: `options: CorporateOptions`
**Output**: `corporateClick: EventEmitter<void>`

**Beneficios mostrados** (data-driven):
- Personalización
- Descuentos por volumen
- Multi-destino
- Facturación empresarial
- SLA garantizado

---

### 3. RitualFaqComponent ✅
**Ubicación**: `src/app/features/ritual/components/ritual-faq.component.ts`

**Propósito**: FAQ específico por ritual (NO hardcodeado)

**Input**: `faqs: RitualFAQ[]`

**Características**:
- Solo se muestra si hay FAQs
- Diseño premium consistente
- Data-driven (cada ritual tiene sus propias preguntas)

---

### 4. RitualStickyCTAComponent ✅
**Ubicación**: `src/app/features/ritual/components/ritual-sticky-cta.component.ts`

**Propósito**: Barra sticky inferior en móvil

**Inputs**:
- `price: string`
- `ritualName: string`
- `loading: boolean`

**Outputs**:
- `primaryClick` - "Regalar"
- `secondaryClick` - "Propuesta corporativa"

**Características**:
- Solo visible en móvil (< 1024px)
- Accesible (aria-labels)
- No tapa contenido
- CTAs claros

---

## 📊 MODELO DE DATOS ACTUALIZADO

### Product Interface (catalog.models.ts) ✅

```typescript
export interface Product {
  // ... campos existentes ...
  
  // SEO completo
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  
  // Decision summary
  decisionSummary?: DecisionSummary;
  
  // FAQ por ritual
  faqs?: RitualFAQ[];
  
  // Corporate options mejorado
  corporateOptions?: CorporateOptions;
}

export interface DecisionSummary {
  badges: string[];
  highlightedIngredients: string[];
}

export interface RitualFAQ {
  question: string;
  answer: string;
}

export interface CorporateOptions {
  available: boolean;
  minQuantity?: number;
  customization: boolean;
  bulkDiscount?: number;
  benefits?: string[]; // ← NUEVO
  multiDestination?: boolean; // ← NUEVO
  invoicing?: boolean; // ← NUEVO
  sla?: string; // ← NUEVO
}
```

---

## 🔄 PRÓXIMOS PASOS PARA COMPLETAR

### PASO 3: Actualizar ritual-detail.component.ts

**Cambios necesarios**:
1. Importar nuevos componentes
2. Usar RitualBadgesComponent
3. Usar RitualCorporateBlockComponent
4. Usar RitualFaqComponent
5. Usar RitualStickyCTAComponent
6. Implementar tracking de eventos
7. Mejorar setupSEO con todos los campos

### PASO 4: Actualizar ritual-detail.component.html

**Estructura nueva**:
```html
<!-- Hero Image -->
<section class="ritual-hero">...</section>

<!-- Main Content -->
<section class="ritual-content">
  <!-- Header con breadcrumbs -->
  <header class="ritual-header">
    <nav class="breadcrumb">...</nav>
    <h1>{{ ritual().name }}</h1>
    <p class="tagline">Diseñado para ocasiones donde no puedes equivocarte.</p>
    <div class="price">{{ formatPrice(ritual().price) }}</div>
    <p class="value-note">Incluye presentación premium lista para entregar.</p>
  </header>

  <!-- Decision Summary Badges -->
  <app-ritual-badges 
    *ngIf="ritual().decisionSummary?.badges"
    [badges]="ritual().decisionSummary.badges">
  </app-ritual-badges>

  <!-- Quick Summary -->
  <div class="quick-summary">
    <div class="summary-item">
      <strong>Sensación:</strong> {{ ritual().sensorialExperience }}
    </div>
    <div class="summary-item" *ngIf="ritual().decisionSummary?.highlightedIngredients">
      <strong>Incluye:</strong> {{ getHighlightedIngredients() }}
    </div>
  </div>

  <!-- CTA Desktop -->
  <div class="ritual-cta ritual-cta--desktop">
    <app-button (clicked)="onAddToCart()">Regalar este ritual</app-button>
    <app-button variant="outline" (clicked)="onCorporateInquiry()">
      Propuesta corporativa
    </app-button>
  </div>

  <!-- Secciones (accordion en móvil) -->
  <section class="ritual-section">
    <h2>La Experiencia</h2>
    <p>{{ ritual().experience }}</p>
  </section>

  <section class="ritual-section">
    <h2>Qué Incluye</h2>
    <ul>
      <li *ngFor="let ingredient of ritual().ingredients">{{ ingredient }}</li>
    </ul>
  </section>

  <!-- ... más secciones ... -->

  <!-- Corporate Block -->
  <app-ritual-corporate-block
    [options]="ritual().corporateOptions"
    (corporateClick)="onCorporateInquiry()">
  </app-ritual-corporate-block>

  <!-- FAQ -->
  <app-ritual-faq [faqs]="ritual().faqs"></app-ritual-faq>
</section>

<!-- Sticky CTA Mobile -->
<app-ritual-sticky-cta
  [price]="formatPrice(ritual().price)"
  [ritualName]="ritual().name"
  [loading]="addingToCart()"
  (primaryClick)="onAddToCart()"
  (secondaryClick)="onCorporateInquiry()">
</app-ritual-sticky-cta>
```

### PASO 5: Actualizar catalog.service.ts

**Agregar datos completos a cada ritual**:

```typescript
{
  id: '1',
  slug: 'kuntur-dorado',
  name: 'Kuntur Dorado',
  // ... campos existentes ...
  
  // SEO completo
  metaTitle: 'Kuntur Dorado - Ritual Gastronómico Premium | Sumak Gourmet',
  metaDescription: 'Ritual premium con bebida incluida, chocolate 70% cítrico...',
  keywords: ['kuntur dorado', 'ritual premium', 'regalo corporativo'],
  ogTitle: 'Kuntur Dorado | Sumak Gourmet',
  ogDescription: 'Ritual gastronómico premium...',
  ogImage: 'https://sumakgourmet.co/assets/images/kuntur_dorado.jpg',
  
  // Decision summary
  decisionSummary: {
    badges: [
      'Producción limitada',
      'Entrega express disponible',
      'Presentación premium incluida',
      'Ideal para regalos corporativos'
    ],
    highlightedIngredients: [
      'Chocolate 70% naranja y limón',
      'Pistachos naturales',
      'Miel infusionada con maracuyá'
    ]
  },
  
  // FAQ específico
  faqs: [
    {
      question: '¿Este ritual incluye la bebida?',
      answer: 'Sí, incluye bebida premium en presentación original.'
    },
    {
      question: '¿Puedo personalizarlo para mi empresa?',
      answer: 'Sí, ofrecemos personalización para pedidos corporativos desde 10 unidades.'
    },
    {
      question: '¿Cuál es el tiempo de entrega?',
      answer: 'En Bogotá menos de 24h express. Nacional 2-4 días hábiles.'
    }
  ],
  
  // Corporate options mejorado
  corporateOptions: {
    available: true,
    minQuantity: 10,
    customization: true,
    bulkDiscount: 15,
    benefits: [
      'Personalización con logo empresarial',
      'Descuentos progresivos por volumen',
      'Envío a múltiples destinos',
      'Facturación empresarial',
      'SLA garantizado de entrega',
      'Soporte dedicado'
    ],
    multiDestination: true,
    invoicing: true,
    sla: '24-48 horas'
  }
}
```

### PASO 6: Actualizar SeoService

**Mejorar setupSEO en ritual-detail.component.ts**:

```typescript
private setupSEO(product: Product): void {
  const title = product.metaTitle || `${product.name} | Sumak Gourmet`;
  const description = product.metaDescription || product.description;
  const url = `https://sumakgourmet.co/ritual/${product.slug}`;

  this.seoService.updateMetaTags({
    title,
    description,
    keywords: product.keywords?.join(', '),
    ogTitle: product.ogTitle || title,
    ogDescription: product.ogDescription || description,
    ogImage: product.ogImage || `https://sumakgourmet.co/${product.imageUrl}`,
    ogUrl: url,
    canonicalUrl: `/ritual/${product.slug}`
  });

  // Product Schema
  this.seoService.addProductSchema(product);

  // Breadcrumb Schema
  this.seoService.addBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Catálogo', url: '/catalog' },
    { name: product.name, url: `/ritual/${product.slug}` }
  ]);

  // FAQ Schema (solo si hay FAQs)
  if (product.faqs && product.faqs.length > 0) {
    this.seoService.addFAQSchema(product.faqs);
  }
}
```

### PASO 7: Implementar Tracking

**En ritual-detail.component.ts**:

```typescript
// Track view_item
private trackRitualView(product: Product): void {
  this.analyticsService.trackRitualView(
    product.name, 
    product.id, 
    product.price
  );
}

// Track CTA clicks
onAddToCart(): void {
  const product = this.ritual();
  if (!product) return;

  this.addingToCart.set(true);
  this.cartService.addToCart(product);
  
  // Track event
  this.analyticsService.trackAddToCart(
    product.name, 
    product.id, 
    product.price
  );
  
  setTimeout(() => {
    this.addingToCart.set(false);
  }, 600);
}

onCorporateInquiry(): void {
  const ritual = this.ritual();
  
  // Track event
  this.analyticsService.trackCorporateInquiry(ritual?.name);
  
  this.router.navigate(['/cotizacion-corporativa'], {
    queryParams: { ritual: ritual?.slug }
  });
}
```

---

## 📱 RESPONSIVE & MOBILE-FIRST

### Breakpoints
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Features
1. ✅ Sticky CTA solo en móvil
2. ✅ Badges en grid 2x2 (móvil) → 4x1 (desktop)
3. ✅ Accordion sections en móvil (opcional)
4. ✅ Espaciado generoso
5. ✅ Touch-friendly (48px mínimo)

---

## 🎨 DISEÑO PREMIUM MANTENIDO

### Colores Sumak
- Verde: `#1a4d2e`
- Dorado: `#D4AF37`
- Grises: `#374151`, `#6b7280`, `#f9fafb`

### Tipografías
- Títulos: `Against` (serif)
- Cuerpo: `Garet` (sans-serif)

### Principios
- Minimalista
- Sobrio
- Elegante
- Sin sombras exageradas
- Espaciado generoso

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Componentes
- [x] RitualBadgesComponent
- [x] RitualCorporateBlockComponent
- [x] RitualFaqComponent
- [x] RitualStickyCTAComponent
- [ ] Actualizar ritual-detail.component.ts
- [ ] Actualizar ritual-detail.component.html
- [ ] Actualizar ritual-detail.component.scss

### Datos
- [x] Actualizar Product interface
- [ ] Agregar decisionSummary a cada ritual
- [ ] Agregar FAQs específicos por ritual
- [ ] Agregar benefits corporativos por ritual
- [ ] Completar campos SEO

### SEO
- [ ] Implementar setupSEO completo
- [ ] Agregar FAQ Schema condicional
- [ ] Validar meta tags
- [ ] Validar JSON-LD schemas
- [ ] Probar con Lighthouse

### Tracking
- [ ] Track view_item
- [ ] Track add_to_cart
- [ ] Track corporate_inquiry
- [ ] Track whatsapp_click

### Testing
- [ ] Responsive móvil
- [ ] Responsive tablet
- [ ] Responsive desktop
- [ ] Sticky CTA funcional
- [ ] Badges mostrándose
- [ ] FAQ condicional
- [ ] Corporate block
- [ ] SEO validation
- [ ] Performance (Lighthouse)

---

## 📚 DOCUMENTACIÓN PARA EL EQUIPO

### Cómo agregar un nuevo ritual

1. **Agregar en catalog.service.ts**:
```typescript
{
  id: '15',
  slug: 'nuevo-ritual',
  name: 'Nuevo Ritual',
  price: 350000,
  description: '...',
  // ... campos básicos ...
  
  // OBLIGATORIO: SEO
  metaTitle: 'Nuevo Ritual | Sumak Gourmet',
  metaDescription: 'Descripción de 150-160 caracteres...',
  keywords: ['nuevo ritual', 'keyword2', 'keyword3'],
  
  // OBLIGATORIO: Decision Summary
  decisionSummary: {
    badges: ['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4'],
    highlightedIngredients: ['Item 1', 'Item 2', 'Item 3']
  },
  
  // OPCIONAL: FAQ (3-5 preguntas específicas)
  faqs: [
    { question: '...', answer: '...' },
    { question: '...', answer: '...' }
  ],
  
  // OPCIONAL: Corporate benefits específicos
  corporateOptions: {
    available: true,
    benefits: ['Benefit 1', 'Benefit 2', ...]
  }
}
```

2. **Agregar imagen**: `src/assets/images/nuevo-ritual.jpg`

3. **Actualizar sitemap.xml**:
```xml
<url>
  <loc>https://sumakgourmet.co/ritual/nuevo-ritual</loc>
  <lastmod>2025-01-XX</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

4. **Verificar**:
- [ ] Navegar a `/ritual/nuevo-ritual`
- [ ] Verificar meta tags (F12 → Elements → head)
- [ ] Verificar JSON-LD (buscar `<script type="application/ld+json">`)
- [ ] Probar en móvil
- [ ] Lighthouse score > 90

---

## 🚀 ESTADO FINAL ESPERADO

### Arquitectura
- ✅ Componentes reutilizables
- ✅ Data-driven (no hardcoded)
- ✅ SOLID principles
- ✅ Clean code
- ✅ Sin código muerto

### SEO
- ✅ Meta tags completos
- ✅ JSON-LD schemas
- ✅ FAQ Schema condicional
- ✅ Indexable (SSR ready)
- ✅ Lighthouse > 90

### UX
- ✅ Mobile-first
- ✅ Sticky CTA
- ✅ Decision summary
- ✅ Corporate block B2B
- ✅ FAQ por ritual
- ✅ Accesible

### Performance
- ✅ Change detection OnPush
- ✅ Lazy loading
- ✅ Optimized images
- ✅ Core Web Vitals

---

**Próximo paso**: Completar la implementación en ritual-detail.component siguiendo esta guía.
