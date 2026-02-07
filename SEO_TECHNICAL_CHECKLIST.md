# 🚀 CHECKLIST SEO TÉCNICO PREMIUM - SUMAK GOURMET

## 📋 ESTADO ACTUAL Y MEJORAS NECESARIAS

---

## ✅ 1. META TAGS Y OPEN GRAPH

### ✅ Implementado en index.html
- [x] Title tag
- [x] Meta description
- [x] Open Graph (og:title, og:description, og:image, og:url)
- [x] Twitter Card
- [x] Canonical URL base

### 🔧 MEJORAS NECESARIAS

#### A. Meta Tags Dinámicos por Ruta

**Implementar en cada componente de ruta:**

```typescript
// Ejemplo: regalos-corporativos.component.ts
import { SeoService } from '../../core/services/seo.service';

export class RegalosCorporativosComponent implements OnInit, OnDestroy {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateMetaTags({
      title: 'Regalos Corporativos Premium | Sumak Gourmet',
      description: 'Rituales gastronómicos curados para empresas. Regalos corporativos premium con presentación impecable y entrega en 24h en Bogotá.',
      keywords: 'regalos corporativos, regalos empresariales, detalles corporativos, regalos premium colombia',
      ogTitle: 'Regalos Corporativos Premium | Sumak Gourmet',
      ogDescription: 'Rituales gastronómicos curados para empresas',
      ogImage: 'https://sumakgourmet.co/assets/images/og-regalos-corporativos.jpg',
      ogUrl: 'https://sumakgourmet.co/regalos-corporativos',
      canonicalUrl: '/regalos-corporativos'
    });

    this.seo.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Regalos Corporativos', url: '/regalos-corporativos' }
    ]);
  }

  ngOnDestroy(): void {
    this.seo.removeSchema('breadcrumb-schema');
  }
}
```

**Rutas prioritarias para implementar:**
- [ ] `/` (home)
- [ ] `/catalog`
- [ ] `/regalos-corporativos`
- [ ] `/experiencias`
- [ ] `/about`
- [ ] `/contact`
- [ ] `/cotizacion-corporativa`

---

## ✅ 2. STRUCTURED DATA (JSON-LD)

### ✅ Ya Implementado
- [x] Organization schema (en SeoService)
- [x] BreadcrumbList schema (en SeoService)

### 🔧 MEJORAS NECESARIAS

#### A. WebSite Schema con SearchAction

**Ya agregado en SeoService.addWebSiteSchema()** - Implementar en home:

```typescript
// home.component.ts
ngOnInit(): void {
  this.seo.addOrganizationSchema();
  this.seo.addWebSiteSchema(); // ← Agregar esto
}
```

#### B. Product Schema para Catalog

```typescript
// Agregar a SeoService
addProductSchema(product: any): void {
  const script = this.doc.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "url": `https://sumakgourmet.co/catalog/${product.id}`
    }
  });
  this.doc.head.appendChild(script);
}
```

#### C. LocalBusiness Schema (si aplica)

```typescript
// Si Sumak tiene ubicación física
addLocalBusinessSchema(): void {
  const script = this.doc.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sumak Gourmet",
    "image": "https://sumakgourmet.co/assets/images/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bogotá",
      "addressCountry": "CO"
    },
    "telephone": "+57-320-866-3691",
    "priceRange": "$$$$"
  });
  this.doc.head.appendChild(script);
}
```

---

## ✅ 3. SITEMAP Y ROBOTS.TXT

### ✅ Ya Implementado
- [x] sitemap.xml en `/public/`
- [x] robots.txt en `/public/`

### 🔧 VALIDAR Y MEJORAR

#### A. Verificar sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sumakgourmet.co/</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sumakgourmet.co/catalog</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sumakgourmet.co/regalos-corporativos</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sumakgourmet.co/experiencias</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sumakgourmet.co/about</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sumakgourmet.co/contact</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sumakgourmet.co/cotizacion-corporativa</loc>
    <lastmod>2024-02-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

#### B. Verificar robots.txt

```
User-agent: *
Allow: /
Disallow: /auth/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /settings/

Sitemap: https://sumakgourmet.co/sitemap.xml
```

#### C. Enviar a Google Search Console

- [ ] Verificar propiedad en Google Search Console
- [ ] Enviar sitemap.xml
- [ ] Solicitar indexación de URLs clave

---

## ✅ 4. PERFORMANCE (CORE WEB VITALS)

### 🔧 OPTIMIZACIONES NECESARIAS

#### A. Imágenes

**Implementar en todos los componentes:**

```html
<!-- ✅ CORRECTO -->
<img 
  src="assets/images/hero.jpg"
  alt="Rituales gastronómicos premium Sumak Gourmet"
  width="1200"
  height="630"
  loading="lazy"
  decoding="async">

<!-- ❌ INCORRECTO -->
<img src="assets/images/hero.jpg">
```

**Checklist imágenes:**
- [ ] Todas las imágenes tienen `width` y `height`
- [ ] Imágenes below-the-fold tienen `loading="lazy"`
- [ ] Alt text descriptivo y con keywords
- [ ] Formato WebP para imágenes modernas
- [ ] Imágenes optimizadas (< 200KB)

#### B. Fuentes

**Preload fuentes críticas en index.html:**

```html
<head>
  <!-- Preload critical fonts -->
  <link rel="preload" href="/assets/fonts/garet/Garet-Book.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/against_2/against regular.ttf" as="font" type="font/ttf" crossorigin>
</head>
```

#### C. Lazy Loading de Rutas

**Ya implementado con loadComponent en routes:**

```typescript
// ✅ CORRECTO - Ya está así
{
  path: 'catalog',
  loadComponent: () => import('./features/catalog/catalog.component')
}
```

#### D. Preconnect a Dominios Externos

```html
<head>
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://www.google-analytics.com">
  <link rel="preconnect" href="https://connect.facebook.net">
</head>
```

---

## ✅ 5. ANGULAR UNIVERSAL SSR / PRERENDER

### 🎯 RECOMENDACIÓN: Prerender Rutas Críticas

**Opción 1: Angular Universal (SSR completo)**

```bash
ng add @nguniversal/express-engine
```

**Opción 2: Prerender (más simple, recomendado)**

```bash
# angular.json
{
  "projects": {
    "sumak-front": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "prerender": true,
              "prerenderRoutes": [
                "/",
                "/catalog",
                "/regalos-corporativos",
                "/experiencias",
                "/about",
                "/contact"
              ]
            }
          }
        }
      }
    }
  }
}
```

**Beneficios:**
- ✅ HTML estático para bots (Google, Facebook, Twitter)
- ✅ Mejor indexación
- ✅ Open Graph funciona en shares
- ✅ Faster First Contentful Paint

---

## ✅ 6. CANONICAL URLS

### 🔧 IMPLEMENTAR EN CADA RUTA

**Problema actual:** Canonical siempre apunta a root

**Solución:** Ya implementado en SeoService, solo usar:

```typescript
// En cada componente
this.seo.updateMetaTags({
  canonicalUrl: '/ruta-actual' // ← Esto actualiza el canonical
});
```

**Verificar:**
- [ ] Cada ruta tiene su propio canonical
- [ ] No hay canonicals duplicados
- [ ] Canonical usa URL absoluta

---

## ✅ 7. HREFLANG (Si aplica multi-idioma)

**Si Sumak expande a otros países:**

```html
<link rel="alternate" hreflang="es-co" href="https://sumakgourmet.co/" />
<link rel="alternate" hreflang="es-mx" href="https://sumakgourmet.mx/" />
<link rel="alternate" hreflang="x-default" href="https://sumakgourmet.co/" />
```

---

## ✅ 8. MOBILE-FIRST Y RESPONSIVE

### ✅ Ya Implementado
- [x] Viewport meta tag
- [x] Tailwind CSS responsive
- [x] Mobile-first approach

### 🔧 VALIDAR

- [ ] Todas las páginas responsive en móvil
- [ ] Botones táctiles > 44x44px
- [ ] Texto legible sin zoom
- [ ] No hay scroll horizontal

---

## ✅ 9. ACCESIBILIDAD (A11Y)

### 🔧 CHECKLIST

- [ ] Todos los botones tienen `aria-label`
- [ ] Imágenes tienen `alt` descriptivo
- [ ] Contraste de colores WCAG AA
- [ ] Navegación por teclado funciona
- [ ] Focus visible en elementos interactivos
- [ ] Formularios tienen labels

**Ejemplo:**

```html
<!-- ✅ CORRECTO -->
<button 
  aria-label="Contactar por WhatsApp"
  trackEvent="click_whatsapp">
  <svg>...</svg>
</button>

<!-- ❌ INCORRECTO -->
<button trackEvent="click_whatsapp">
  <svg>...</svg>
</button>
```

---

## ✅ 10. SEGURIDAD

### ✅ Ya Implementado
- [x] HTTPS (sumakgourmet.co)
- [x] No hay secrets en frontend

### 🔧 VALIDAR

- [ ] Content Security Policy headers
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Referrer-Policy

**Configurar en servidor (Nginx/Apache):**

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📊 HERRAMIENTAS DE VALIDACIÓN

### 1. Google PageSpeed Insights
- URL: https://pagespeed.web.dev/
- Target: Score > 90 en móvil y desktop

### 2. Google Search Console
- Verificar indexación
- Revisar Core Web Vitals
- Monitorear errores

### 3. Schema Markup Validator
- URL: https://validator.schema.org/
- Validar JSON-LD

### 4. Mobile-Friendly Test
- URL: https://search.google.com/test/mobile-friendly

### 5. Lighthouse (Chrome DevTools)
- Performance > 90
- Accessibility > 90
- Best Practices > 90
- SEO > 90

---

## ✅ CHECKLIST FINAL SEO

### Técnico
- [ ] Meta tags dinámicos por ruta
- [ ] Canonical URLs correctos
- [ ] Structured data (Organization, WebSite, Breadcrumb)
- [ ] Sitemap.xml actualizado y enviado
- [ ] Robots.txt configurado
- [ ] Prerender o SSR implementado

### Performance
- [ ] Imágenes optimizadas con lazy loading
- [ ] Fuentes preloaded
- [ ] Core Web Vitals > 75
- [ ] Lighthouse score > 90

### Contenido
- [ ] Keywords research hecho
- [ ] Títulos únicos por página
- [ ] Descripciones únicas por página
- [ ] Alt text en todas las imágenes
- [ ] Contenido de calidad y original

### Indexación
- [ ] Google Search Console configurado
- [ ] Sitemap enviado
- [ ] URLs clave indexadas
- [ ] No hay errores de rastreo

---

## 🎯 PRIORIDADES (Orden de Implementación)

### 🔴 ALTA PRIORIDAD (Hacer YA)
1. Meta tags dinámicos en rutas clave
2. Canonical URLs correctos
3. WebSite schema en home
4. Imágenes con width/height/lazy loading
5. Preconnect a dominios externos

### 🟡 MEDIA PRIORIDAD (Esta semana)
6. Prerender rutas críticas
7. Product schema en catalog
8. Optimización de imágenes (WebP)
9. Preload de fuentes
10. Enviar sitemap a GSC

### 🟢 BAJA PRIORIDAD (Próximo mes)
11. Angular Universal SSR completo
12. LocalBusiness schema
13. Hreflang (si multi-país)
14. CSP headers
15. A11Y audit completo

---

## 📈 MÉTRICAS DE ÉXITO

- **Indexación:** 100% de páginas clave indexadas en 2 semanas
- **Performance:** Lighthouse > 90 en todas las métricas
- **Tráfico orgánico:** +50% en 3 meses
- **Posicionamiento:** Top 3 para "regalos corporativos premium colombia"
- **CTR:** > 5% en SERPs

---

## 📞 RECURSOS

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Web.dev](https://web.dev/)
- [Angular SEO Guide](https://angular.io/guide/seo)
