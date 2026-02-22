# 📚 SISTEMA PDP RITUALES - DOCUMENTACIÓN

## ✅ REFACTORIZACIÓN COMPLETADA

Sistema completo de páginas de detalle de producto (PDP) para rituales, con arquitectura premium, mobile-first y SEO de máximo nivel.

---

## 🏗️ ARQUITECTURA

### Componentes Reutilizables

```
src/app/features/ritual/components/
├── ritual-badges.component.ts          # Badges de decisión
├── ritual-corporate-block.component.ts # Bloque B2B
├── ritual-faq.component.ts             # FAQ por ritual
└── ritual-sticky-cta.component.ts      # CTA sticky móvil
```

### Componente Principal

```
src/app/features/ritual/
├── ritual-detail.component.ts          # Lógica principal
├── ritual-detail.component.html        # Template
└── ritual-detail.component.scss        # Estilos
```

---

## 📋 CÓMO AGREGAR UN NUEVO RITUAL

### 1. Preparar Imagen

```bash
# Ubicación: src/assets/images/
# Nombre: nombre-ritual.jpg
# Tamaño: 1200x1200px
# Formato: JPG optimizado
```

### 2. Agregar Datos en catalog.service.ts

```typescript
{
  id: '15',
  slug: 'nombre-ritual', // URL-friendly, sin tildes
  name: 'Nombre del Ritual',
  price: 350000,
  description: 'Descripción premium del ritual...',
  experience: 'La experiencia que ofrece...',
  ingredients: [
    'Bebida premium incluida',
    'Chocolate 70%...',
    // ...
  ],
  sensorialExperience: 'Perfil sensorial...',
  imageUrl: 'assets/images/nombre-ritual.jpg',
  category: ProductCategory.PREMIUM,
  
  // ⚠️ OBLIGATORIO: SEO
  metaTitle: 'Nombre Ritual - Descripción | Sumak Gourmet',
  metaDescription: 'Descripción de 150-160 caracteres optimizada para búsqueda...',
  keywords: ['nombre ritual', 'keyword2', 'keyword3'],
  ogTitle: 'Nombre Ritual | Sumak Gourmet',
  ogDescription: 'Descripción para redes sociales...',
  ogImage: 'https://sumakgourmet.co/assets/images/nombre-ritual.jpg',
  
  // ⚠️ OBLIGATORIO: Decision Summary
  decisionSummary: {
    badges: [
      'Producción limitada',
      'Entrega express disponible',
      'Presentación premium incluida',
      'Ideal para regalos corporativos'
    ],
    highlightedIngredients: [
      'Chocolate 70% premium',
      'Frutos secos seleccionados',
      'Miel infusionada'
    ]
  },
  
  // OPCIONAL: FAQ específico (3-5 preguntas)
  faqs: [
    {
      question: '¿Este ritual incluye la bebida?',
      answer: 'Sí, incluye bebida premium en presentación original.'
    },
    {
      question: '¿Puedo personalizarlo?',
      answer: 'Sí, ofrecemos personalización para pedidos corporativos.'
    },
    {
      question: '¿Cuál es el tiempo de entrega?',
      answer: 'En Bogotá menos de 24h. Nacional 2-4 días hábiles.'
    }
  ],
  
  // OPCIONAL: Corporate options detallado
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
  },
  
  // Delivery info
  deliveryInfo: {
    bogotaExpress: true,
    nationalShipping: true,
    estimatedDays: '2-4 días hábiles',
    details: 'Empaque premium incluido'
  },
  
  // ... resto de campos estándar
}
```

### 3. Actualizar sitemap.xml

```xml
<url>
  <loc>https://sumakgourmet.co/ritual/nombre-ritual</loc>
  <lastmod>2025-01-XX</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

### 4. Verificar

```bash
# 1. Compilar
npm run build

# 2. Navegar a la PDP
http://localhost:4200/ritual/nombre-ritual

# 3. Verificar meta tags (F12 → Elements → <head>)
# 4. Verificar JSON-LD schemas
# 5. Probar responsive (móvil, tablet, desktop)
# 6. Lighthouse audit (SEO > 90, Performance > 85)
```

---

## 📊 CAMPOS OBLIGATORIOS vs OPCIONALES

### ✅ OBLIGATORIOS

- `id`, `slug`, `name`, `price`
- `description`, `experience`, `ingredients`
- `sensorialExperience`, `imageUrl`, `category`
- `metaTitle`, `metaDescription`, `keywords`
- `decisionSummary.badges`
- `decisionSummary.highlightedIngredients`

### 🔹 OPCIONALES

- `faqs` - Si no se incluye, no se muestra sección FAQ
- `corporateOptions.benefits` - Si no se incluye, usa defaults
- `ogTitle`, `ogDescription`, `ogImage` - Si no se incluye, usa fallbacks
- `deliveryInfo.details`

---

## 🎨 COMPONENTES

### RitualBadgesComponent

**Propósito**: Mostrar badges de decisión

**Input**: `badges: string[]`

**Ejemplo**:
```html
<app-ritual-badges [badges]="ritual().decisionSummary.badges">
</app-ritual-badges>
```

**Iconos automáticos según texto**:
- "limitada" / "exclusiv" → Estrella
- "express" / "entrega" → Rayo
- "premium" / "presentaci" → Caja
- "corporativ" → Maletín

---

### RitualCorporateBlockComponent

**Propósito**: Bloque B2B con beneficios

**Inputs**: 
- `options: CorporateOptions`

**Outputs**:
- `corporateClick: EventEmitter<void>`

**Ejemplo**:
```html
<app-ritual-corporate-block
  [options]="ritual().corporateOptions"
  (corporateClick)="onCorporateInquiry()">
</app-ritual-corporate-block>
```

**Beneficios mostrados**:
1. Si `options.benefits` existe → usa esos
2. Si no → genera defaults basados en flags

---

### RitualFaqComponent

**Propósito**: FAQ específico por ritual

**Input**: `faqs: RitualFAQ[]`

**Ejemplo**:
```html
<app-ritual-faq [faqs]="ritual().faqs"></app-ritual-faq>
```

**Comportamiento**:
- Si `faqs` es undefined o vacío → NO se muestra
- Si hay FAQs → genera FAQ Schema JSON-LD automáticamente

---

### RitualStickyCTAComponent

**Propósito**: Barra sticky inferior en móvil

**Inputs**:
- `price: string`
- `ritualName: string`
- `loading: boolean`

**Outputs**:
- `primaryClick` - CTA "Regalar"
- `secondaryClick` - CTA "Corporativo"

**Ejemplo**:
```html
<app-ritual-sticky-cta
  [price]="formatPrice(ritual().price)"
  [ritualName]="ritual().name"
  [loading]="addingToCart()"
  (primaryClick)="onAddToCart()"
  (secondaryClick)="onCorporateInquiry()">
</app-ritual-sticky-cta>
```

**Responsive**:
- Visible: < 1024px (móvil y tablet)
- Oculto: ≥ 1024px (desktop)

---

## 🔍 SEO

### Meta Tags Generados

```html
<title>Nombre Ritual | Sumak Gourmet</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<link rel="canonical" href="https://sumakgourmet.co/ritual/slug">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### JSON-LD Schemas

**1. Product Schema** (siempre):
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Nombre Ritual",
  "sku": "1",
  "brand": { "@type": "Brand", "name": "Sumak Gourmet" },
  "offers": {
    "@type": "Offer",
    "price": 350000,
    "priceCurrency": "COP",
    "availability": "https://schema.org/InStock"
  }
}
```

**2. Breadcrumb Schema** (siempre):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

**3. FAQ Schema** (condicional):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```
Solo se genera si `product.faqs` existe y tiene elementos.

---

## 📱 RESPONSIVE

### Breakpoints

- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: ≥ 1024px

### Mobile-First Features

1. **Sticky CTA**: Solo visible en móvil
2. **Badges**: Grid 2x2 (móvil) → 4x1 (desktop)
3. **Quick Summary**: Compacto en móvil
4. **Espaciado**: Generoso, touch-friendly (48px mínimo)

---

## 📊 TRACKING

### Eventos Implementados

```typescript
// Vista de ritual
analyticsService.trackRitualView(name, id, price);

// Agregar al carrito
analyticsService.trackAddToCart(name, id, price);

// Click WhatsApp
analyticsService.trackWhatsAppClick(name, 'pdp');

// Consulta corporativa
analyticsService.trackCorporateInquiry(name);
```

---

## ✅ CHECKLIST DE CALIDAD

### Antes de Publicar

- [ ] Imagen optimizada (1200x1200px, < 200KB)
- [ ] Slug único (sin espacios, sin tildes)
- [ ] Meta title < 60 caracteres
- [ ] Meta description 150-160 caracteres
- [ ] Keywords relevantes (3-5)
- [ ] Decision summary badges (4)
- [ ] Highlighted ingredients (2-3)
- [ ] FAQs específicos (3-5) o ninguno
- [ ] Corporate benefits si aplica
- [ ] Sitemap actualizado
- [ ] Prueba en móvil
- [ ] Prueba en desktop
- [ ] Lighthouse SEO > 90
- [ ] Lighthouse Performance > 85

---

## 🚨 ERRORES COMUNES

### ❌ Slug con espacios
```typescript
slug: 'Nuevo Ritual' // MAL
slug: 'nuevo-ritual' // BIEN
```

### ❌ Slug con tildes
```typescript
slug: 'pasión-andina' // MAL
slug: 'pasion-andina' // BIEN
```

### ❌ FAQ hardcodeado en template
```html
<!-- MAL -->
<div class="faq-item">
  <h3>¿Pregunta?</h3>
  <p>Respuesta...</p>
</div>

<!-- BIEN -->
<app-ritual-faq [faqs]="ritual().faqs"></app-ritual-faq>
```

### ❌ Badges hardcodeados
```html
<!-- MAL -->
<div class="badge">Producción limitada</div>

<!-- BIEN -->
<app-ritual-badges [badges]="ritual().decisionSummary.badges">
</app-ritual-badges>
```

---

## 🎯 PRINCIPIOS DE DISEÑO

### Mantenidos de Sumak

- **Colores**: Verde #1a4d2e, Dorado #D4AF37
- **Tipografías**: Against (títulos), Garet (cuerpo)
- **Tono**: Sobrio, minimalista, premium
- **Espaciado**: Generoso, respira elegancia
- **Interacciones**: Sutiles, sin exageraciones

### NO Hacer

- ❌ Agregar colores nuevos
- ❌ Sombras exageradas
- ❌ Animaciones llamativas
- ❌ Componentes extravagantes
- ❌ Hardcodear contenido
- ❌ Inventar testimonios o clientes

---

## 📈 PERFORMANCE

### Optimizaciones Implementadas

- ✅ Change detection OnPush
- ✅ Lazy loading de rutas
- ✅ Imágenes con width/height
- ✅ Loading eager en hero
- ✅ Fetchpriority high
- ✅ Componentes standalone

### Core Web Vitals Esperados

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: 0

---

## 🔒 SEGURIDAD

### Mantenida

- ✅ SecuritySanitizerService activo
- ✅ Sanitización de inputs
- ✅ Validación de precios
- ✅ Protección XSS
- ✅ Sin manipulación DOM directa

---

## 📞 SOPORTE

### Archivos de Referencia

- `COMPLETE_PDP_REFACTORING_GUIDE.md` - Guía técnica completa
- `PREMIUM_PDP_REFACTORING.md` - Refactorización premium
- `TECHNICAL_AUDIT_REPORT.md` - Auditoría técnica
- Este README - Documentación de uso

### Estructura de Archivos

```
src/app/features/ritual/
├── components/
│   ├── ritual-badges.component.ts
│   ├── ritual-corporate-block.component.ts
│   ├── ritual-faq.component.ts
│   └── ritual-sticky-cta.component.ts
├── ritual-detail.component.ts
├── ritual-detail.component.html
└── ritual-detail.component.scss
```

---

**Última actualización**: Enero 2025
**Estado**: ✅ Producción Ready
**Arquitectura**: Premium + Mobile-First + SEO Optimizado
