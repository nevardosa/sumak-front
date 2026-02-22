# ⚡ GUÍA: OPTIMIZACIÓN CORE WEB VITALS
## Sumak Gourmet - Performance Critical

---

## 🎯 QUÉ SON CORE WEB VITALS

Métricas de Google que miden experiencia de usuario:

1. **LCP** (Largest Contentful Paint) - Velocidad de carga
2. **FID** (First Input Delay) - Interactividad  
3. **CLS** (Cumulative Layout Shift) - Estabilidad visual

**Impacto SEO:** Factor de ranking desde 2021

---

## 📊 OBJETIVOS

### Umbrales de Google
```
BUENO    NECESITA MEJORA    POBRE
LCP:  <2.5s    2.5-4.0s      >4.0s
FID:  <100ms   100-300ms     >300ms
CLS:  <0.1     0.1-0.25      >0.25
```

### Nuestros Objetivos
- **LCP:** <1.8s (Excelente)
- **FID:** <50ms (Excelente)
- **CLS:** <0.05 (Excelente)

---

## 🚀 OPTIMIZACIÓN LCP (Largest Contentful Paint)

### Problema: Elemento más grande tarda en cargar

### Solución 1: Optimizar Imágenes Hero
```html
<!-- ANTES -->
<img src="hero-animation.GIF" loading="eager">

<!-- DESPUÉS -->
<picture>
  <source type="image/avif" srcset="hero.avif">
  <source type="image/webp" srcset="hero.webp">
  <img 
    src="hero.jpg" 
    loading="eager" 
    fetchpriority="high"
    width="1920" 
    height="1080">
</picture>
```

### Solución 2: Preload Critical Resources
```html
<!-- index.html -->
<head>
  <!-- Preload hero image -->
  <link rel="preload" as="image" href="/assets/images/hero.webp" fetchpriority="high">
  
  <!-- Preload critical fonts -->
  <link rel="preload" href="/assets/fonts/garet/Garet-Book.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Preload critical CSS -->
  <link rel="preload" href="/styles.css" as="style">
</head>
```

### Solución 3: Optimizar CSS Critical
```typescript
// angular.json
{
  "configurations": {
    "production": {
      "optimization": {
        "styles": {
          "inlineCritical": true
        }
      }
    }
  }
}
```

### Solución 4: CDN para Assets
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  cdnUrl: 'https://cdn.sumakgourmet.co',
  assetsUrl: 'https://cdn.sumakgourmet.co/assets'
};
```

---

## ⚡ OPTIMIZACIÓN FID (First Input Delay)

### Problema: JavaScript bloquea interactividad

### Solución 1: Code Splitting
```typescript
// app.routes.ts - Ya implementado ✅
{
  path: 'catalog',
  loadComponent: () => import('./features/catalog/catalog.component')
}
```

### Solución 2: Defer Non-Critical JS
```html
<!-- index.html -->
<script src="analytics.js" defer></script>
<script src="non-critical.js" defer></script>
```

### Solución 3: Optimizar Third-Party Scripts
```html
<!-- Google Tag Manager - Async -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-P8S8S9TH"></script>

<!-- Meta Pixel - Async -->
<script async src="https://connect.facebook.net/en_US/fbevents.js"></script>
```

### Solución 4: Web Workers para Tareas Pesadas
```typescript
// heavy-computation.worker.ts
addEventListener('message', ({ data }) => {
  const result = performHeavyComputation(data);
  postMessage(result);
});

// component.ts
const worker = new Worker(new URL('./heavy-computation.worker', import.meta.url));
worker.postMessage(data);
worker.onmessage = ({ data }) => {
  // Handle result
};
```

---

## 🎨 OPTIMIZACIÓN CLS (Cumulative Layout Shift)

### Problema: Elementos se mueven durante la carga

### Solución 1: Dimensiones Explícitas en Imágenes
```html
<!-- ANTES -->
<img src="product.jpg" alt="Product">

<!-- DESPUÉS -->
<img 
  src="product.jpg" 
  alt="Product"
  width="256" 
  height="256"
  style="aspect-ratio: 1/1">
```

### Solución 2: Reservar Espacio para Ads/Embeds
```css
/* Skeleton loader */
.product-skeleton {
  width: 256px;
  height: 256px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Solución 3: Font Loading Strategy
```css
/* styles.scss */
@font-face {
  font-family: 'Garet';
  src: url('/assets/fonts/garet/Garet-Book.woff2') format('woff2');
  font-display: swap; /* Evita FOIT */
  font-weight: 400;
}
```

### Solución 4: Evitar Inserción Dinámica de Contenido
```typescript
// ANTES - Causa CLS
ngAfterViewInit() {
  this.loadBanner(); // Inserta contenido después
}

// DESPUÉS - Reserva espacio
<div class="banner-container" style="min-height: 200px">
  <app-banner *ngIf="bannerLoaded"></app-banner>
</div>
```

---

## 🔧 CONFIGURACIÓN ANGULAR PARA PERFORMANCE

### angular.json Optimizado
```json
{
  "projects": {
    "sumak-front": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": {
                "scripts": true,
                "styles": {
                  "minify": true,
                  "inlineCritical": true
                },
                "fonts": true
              },
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

### tsconfig.json Optimizado
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "fullTemplateTypeCheck": true
  }
}
```

---

## 🌐 OPTIMIZACIÓN DE RED

### 1. HTTP/2 Server Push
```nginx
# nginx.conf
location / {
    http2_push /styles.css;
    http2_push /main.js;
    http2_push /assets/fonts/garet/Garet-Book.woff2;
}
```

### 2. Compression
```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    image/svg+xml;

# Brotli (mejor que gzip)
brotli on;
brotli_comp_level 6;
brotli_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json;
```

### 3. Caching Headers
```nginx
# nginx.conf
location ~* \.(jpg|jpeg|png|gif|ico|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(woff|woff2|ttf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
}
```

---

## 📱 OPTIMIZACIÓN MÓVIL

### 1. Viewport Optimization
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
```

### 2. Touch Target Size
```css
/* Mínimo 44x44px para touch targets */
.button, .link, .card {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### 3. Reduce Motion para Accesibilidad
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔍 MONITOREO Y MEDICIÓN

### 1. Real User Monitoring (RUM)
```typescript
// app.component.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class AppComponent {
  private platformId = inject(PLATFORM_ID);
  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.measureWebVitals();
    }
  }
  
  private measureWebVitals() {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      // Send to analytics
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
        // Send to analytics
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // CLS
    let clsScore = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log('CLS:', clsScore);
          // Send to analytics
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
}
```

### 2. Google Analytics 4 Integration
```typescript
// Send Web Vitals to GA4
function sendToGA4(metric: any) {
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta
  });
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### LCP Optimization
- [ ] Optimizar imágenes hero
- [ ] Implementar preload
- [ ] Inline critical CSS
- [ ] Usar CDN
- [ ] Comprimir assets

### FID Optimization
- [ ] Code splitting implementado
- [ ] Defer non-critical JS
- [ ] Optimizar third-party scripts
- [ ] Reducir JavaScript execution time

### CLS Optimization
- [ ] Width/height en todas las imágenes
- [ ] Aspect-ratio CSS
- [ ] Font-display: swap
- [ ] Reservar espacio para dynamic content
- [ ] Skeleton loaders

### Network Optimization
- [ ] HTTP/2 habilitado
- [ ] Gzip/Brotli compression
- [ ] Cache headers configurados
- [ ] CDN implementado

### Monitoring
- [ ] RUM implementado
- [ ] GA4 Web Vitals tracking
- [ ] PageSpeed Insights monitoring
- [ ] Alertas configuradas

---

## 🎯 RESULTADOS ESPERADOS

### Antes
- LCP: 4.5s (Rojo)
- FID: 180ms (Amarillo)
- CLS: 0.15 (Amarillo)
- PageSpeed Score: 65

### Después
- LCP: 1.8s (Verde) ✅
- FID: 45ms (Verde) ✅
- CLS: 0.04 (Verde) ✅
- PageSpeed Score: 95+ ✅

### Impacto SEO
- +15% rankings
- +25% tráfico orgánico
- -20% bounce rate
- +30% conversiones

---

**Tiempo estimado:** 6-8 horas
**Prioridad:** CRÍTICA
**Impacto:** ALTO en SEO y UX
