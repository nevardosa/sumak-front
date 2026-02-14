# 🎯 SEO BACKLOG EJECUTABLE 2026 - SUMAK GOURMET
## Plan Accionable + SSR/SSG Strategy + Validación

**Dominio**: https://sumakgourmet.co  
**Arquitectura**: Angular 19 Standalone SPA  
**Fecha Auditoría**: Enero 2026  
**Última Actualización**: 2026-01-09  

---

## ⚠️ DISCLAIMER: DATOS Y PROYECCIONES

### Volúmenes de Búsqueda
**TODOS los volúmenes mensuales son ESTIMACIONES NO VERIFICADAS** basadas en:
- Herramientas de terceros (no Google Search Console real)
- Promedios de mercado Colombia
- Análisis de competencia

**Para validar**: Requiere acceso a:
- Google Search Console (datos reales de impresiones)
- Google Keyword Planner (volúmenes verificados)
- GA4 (tráfico orgánico actual)

### Proyecciones de Tráfico
**MODELO POR ESCENARIOS** (requiere validación con datos reales):

#### Escenario Conservador (Probabilidad: 70%)
- Mes 1: +50-100% tráfico orgánico
- Mes 3: +150-200% tráfico orgánico
- Año 1: +300-400% tráfico orgánico

**Supuestos**:
- Competencia media-alta
- Implementación correcta
- Sin penalizaciones
- Dominio con autoridad baja (DA < 30)

#### Escenario Medio (Probabilidad: 20%)
- Mes 1: +100-200% tráfico orgánico
- Mes 3: +300-400% tráfico orgánico
- Año 1: +600-800% tráfico orgánico

**Supuestos**:
- Competencia media
- Implementación excelente
- Backlinks naturales
- Dominio con autoridad media (DA 30-50)

#### Escenario Agresivo (Probabilidad: 10%)
- Mes 1: +200-400% tráfico orgánico
- Mes 3: +500-700% tráfico orgánico
- Año 1: +1000-1500% tráfico orgánico

**Supuestos**:
- Competencia baja
- Implementación perfecta
- Campaña de backlinks
- Dominio con autoridad alta (DA > 50)

### Datos Reales Requeridos para Validar

**Antes de implementar, obtener de Google Search Console**:
```
1. Impresiones actuales (últimos 3 meses)
2. Clicks actuales (últimos 3 meses)
3. CTR promedio
4. Posición promedio por keyword
5. Keywords que ya posicionan (top 100)
```

**Antes de implementar, obtener de GA4**:
```
1. Sesiones orgánicas (últimos 3 meses)
2. Tasa de conversión orgánica
3. Páginas de aterrizaje orgánicas
4. Bounce rate por página
5. Tiempo promedio en página
```

---

## 🏗️ DECISIÓN SSR/SSG PARA ANGULAR SPA

### Análisis Técnico

#### Opción 1: SSR (Server-Side Rendering) con Angular Universal
**Pros**:
- ✅ Contenido dinámico indexable
- ✅ Mejor para páginas que cambian frecuentemente
- ✅ Mejor para contenido personalizado

**Contras**:
- ❌ Requiere servidor Node.js
- ❌ Mayor complejidad de deployment
- ❌ Posibles problemas con browser APIs
- ❌ Mayor costo de infraestructura

**Veredicto**: ❌ NO RECOMENDADO para Sumak
- Catálogo es estático (productos no cambian cada hora)
- Ya tuviste problemas con SSR (IntersectionObserver, window)
- Overhead no justificado

#### Opción 2: SSG (Static Site Generation) con Prerendering
**Pros**:
- ✅ Genera HTML estático en build time
- ✅ Sin servidor Node.js necesario
- ✅ Deploy en CDN (Netlify, Vercel, S3)
- ✅ Performance máximo
- ✅ Sin problemas con browser APIs
- ✅ Costo mínimo

**Contras**:
- ⚠️ Requiere rebuild para actualizar contenido
- ⚠️ No sirve para contenido en tiempo real

**Veredicto**: ✅ **RECOMENDADO** para Sumak

#### Opción 3: Hybrid (SSG + CSR)
**Estrategia**:
- SSG para rutas clave (Home, Catalog, Corporate, About)
- CSR para rutas dinámicas (Cart, Checkout, Profile)

**Veredicto**: ⭐ **ÓPTIMO** para Sumak

---

### Implementación Recomendada: Angular Prerendering

#### Paso 1: Configurar Prerendering

```json
// angular.json
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
                "/faq",
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

#### Paso 2: Generar Rutas Dinámicas

```typescript
// prerender-routes.ts
export const PRERENDER_ROUTES = [
  '/',
  '/catalog',
  '/regalos-corporativos',
  '/experiencias',
  '/about',
  '/faq',
  '/contact',
  // Rutas de profesiones (agregar después)
  '/regalos-para-medicos',
  '/regalos-para-ingenieros',
  '/regalos-para-abogados'
];
```

#### Paso 3: Build Command

```bash
# package.json
{
  "scripts": {
    "build:prerender": "ng build --configuration production && ng run sumak-front:prerender:production"
  }
}
```

**Resultado**: HTML estático generado para cada ruta, indexable por Google.

---

## 📋 BACKLOG EJECUTABLE

### Prioridades
- **P0**: Crítico (bloquea SEO básico)
- **P1**: Alta (impacto inmediato)
- **P2**: Media (mejora incremental)

---

## 🔴 P0: CRÍTICO (Semana 1)

### P0.1: Actualizar Meta Tags Principales

**Archivos**:
- `src/app/features/home/home.component.ts`
- `src/app/features/catalog/catalog.component.ts`
- `src/app/features/corporate-gifts/corporate-gifts.component.ts`

**Cambios**:
```typescript
// home.component.ts
ngOnInit(): void {
  this.seoService.updateMetaTags({
    title: 'Regalos Gourmet Premium y Corporativos en Colombia | Sumak Gourmet',
    description: 'Regalos gourmet para hombres, mujeres, profesionales y empresas. Chocolate artesanal, vinos premium y frutos secos. Regalos corporativos, cumpleaños, aniversarios. Entrega Bogotá 24h.',
    keywords: 'regalos gourmet, regalos premium, regalos corporativos, chocolate artesanal, vinos, regalos Colombia',
    canonicalUrl: '/',
    ogTitle: 'Regalos Gourmet Premium | Sumak Gourmet',
    ogDescription: 'Rituales gastronómicos premium con chocolate, vinos y frutos secos. Regalos para personas y empresas.',
    ogImage: 'https://sumakgourmet.co/assets/images/og-home.jpg'
  });
}
```

**Definition of Done**:
- [ ] Titles actualizados en 3 páginas principales
- [ ] Meta descriptions < 160 caracteres
- [ ] Keywords incluidas naturalmente
- [ ] Canonical URLs configurados
- [ ] Open Graph tags completos
- [ ] Verificado en view-source de cada página
- [ ] Test: `npm run test:seo-meta`

**Tests**:
```typescript
// home.component.spec.ts
it('should set correct SEO meta tags', () => {
  component.ngOnInit();
  const title = titleService.getTitle();
  expect(title).toContain('Regalos Gourmet Premium');
  expect(title).toContain('Colombia');
});
```

**Tiempo**: 2 horas  
**Riesgo**: Bajo  
**Impacto**: +30% CTR en SERPs

---

### P0.2: Agregar Bloque SEO en Home

**Archivo**: `src/app/features/home/home.component.html`

**Ubicación**: Después del Hero, antes de Beneficios (línea ~35)

**Código**:
```html
<!-- SEO Content Block -->
<section class="section-padding bg-white">
  <div class="container-sumak max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-against text-sumak-green mb-6">
        Regalos Gourmet con Intención
      </h2>
    </div>
    
    <div class="grid md:grid-cols-2 gap-12 items-start">
      <!-- Para Personas -->
      <div>
        <h3 class="text-xl font-semibold text-sumak-green mb-4">
          Para Personas Especiales
        </h3>
        <p class="text-text-body leading-relaxed mb-4">
          Diseñamos <strong>regalos gourmet premium</strong> para hombres y mujeres 
          que valoran la calidad y el significado. Cada ritual gastronómico combina 
          chocolate artesanal, vinos seleccionados y frutos secos curados, ideales 
          para cumpleaños, aniversarios o celebraciones personales.
        </p>
        <p class="text-text-body leading-relaxed">
          Perfectos como <strong>regalos para profesionales</strong> —médicos, 
          ingenieros, abogados— o para personas en momentos especiales: grados, 
          ascensos o reconocimientos.
        </p>
      </div>
      
      <!-- Para Empresas -->
      <div>
        <h3 class="text-xl font-semibold text-sumak-green mb-4">
          Para Empresas y Organizaciones
        </h3>
        <p class="text-text-body leading-relaxed mb-4">
          Nuestros <strong>regalos corporativos</strong> están diseñados para empresas 
          que buscan diferenciarse. Detalles premium para clientes, directivos y 
          equipos de trabajo.
        </p>
        <p class="text-text-body leading-relaxed">
          Ideales para reconocimientos laborales, eventos corporativos o temporadas 
          especiales como Navidad y fin de año.
        </p>
      </div>
    </div>
    
    <!-- Entrega -->
    <div class="mt-12 text-center p-6 bg-gray-50 rounded-xl">
      <p class="text-text-body">
        <strong>Entrega en Bogotá en menos de 24 horas.</strong> Envíos a toda Colombia. 
        Presentación premium lista para regalar.
      </p>
    </div>
  </div>
</section>
```

**Definition of Done**:
- [ ] Bloque agregado después del Hero
- [ ] Keywords integradas naturalmente (densidad < 2%)
- [ ] Responsive en mobile/tablet/desktop
- [ ] No afecta Lighthouse Performance (> 90)
- [ ] No afecta diseño premium
- [ ] Test: `npm run test:e2e:home`

**Tests**:
```typescript
// home.e2e.spec.ts
it('should display SEO content block', () => {
  cy.visit('/');
  cy.contains('Regalos Gourmet con Intención').should('be.visible');
  cy.contains('regalos gourmet premium').should('exist');
  cy.contains('regalos corporativos').should('exist');
});
```

**Tiempo**: 1 hora  
**Riesgo**: Bajo  
**Impacto**: +50% cobertura keywords Home

---

### P0.3: Actualizar H1 y Subtitle en Catalog

**Archivo**: `src/app/features/catalog/catalog.component.html`

**Cambio**:
```html
<!-- ANTES -->
<h1 class="title-primary mb-4">Catálogo de Rituales Gastronómicos</h1>
<p class="subtitle text-text-secondary max-w-3xl mx-auto">
  Descubre nuestras experiencias gastronómicas premium...
</p>

<!-- DESPUÉS -->
<h1 class="title-primary mb-4">
  Regalos Gourmet Premium y Experiencias Gastronómicas en Colombia
</h1>
<p class="subtitle text-text-secondary max-w-4xl mx-auto leading-relaxed">
  Rituales gastronómicos curados con chocolate artesanal, vinos premium, 
  frutos secos seleccionados y productos gourmet. Regalos para hombres, 
  mujeres, profesionales y empresas. Presentación premium lista para regalar.
</p>
```

**Definition of Done**:
- [ ] H1 actualizado con keywords transaccionales
- [ ] Subtitle expandido con productos específicos
- [ ] Mantiene tono premium
- [ ] No rompe diseño responsive
- [ ] Test: `npm run test:catalog`

**Tiempo**: 30 minutos  
**Riesgo**: Bajo  
**Impacto**: +60% visibilidad Catalog

---

### P0.4: Configurar Prerendering

**Archivo**: `angular.json`

**Cambio**:
```json
{
  "projects": {
    "sumak-front": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [...],
              "prerender": true,
              "prerenderRoutes": [
                "/",
                "/catalog",
                "/regalos-corporativos",
                "/experiencias",
                "/about",
                "/faq",
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

**Definition of Done**:
- [ ] Prerendering habilitado en production
- [ ] 7 rutas principales prerenderizadas
- [ ] HTML estático generado en dist/
- [ ] Verificar view-source muestra contenido completo
- [ ] No errores en build
- [ ] Test: `npm run build:prerender && npm run test:prerender`

**Tests**:
```bash
# test-prerender.sh
#!/bin/bash
echo "Testing prerendered routes..."
for route in "" "catalog" "regalos-corporativos"; do
  if [ -f "dist/sumak-front/browser/$route/index.html" ]; then
    echo "✓ $route prerendered"
  else
    echo "✗ $route NOT prerendered"
    exit 1
  fi
done
```

**Tiempo**: 2 horas  
**Riesgo**: Medio (puede romper build)  
**Impacto**: +80% indexabilidad

---

## 🟡 P1: ALTA PRIORIDAD (Semana 2-3)

### P1.1: Agregar Intro SEO en Catalog

**Archivo**: `src/app/features/catalog/catalog.component.html`

**Ubicación**: Después del subtitle, antes de filtros

**Código**:
```html
<div class="max-w-5xl mx-auto mb-12 px-4">
  <div class="grid md:grid-cols-3 gap-6 text-center">
    <!-- Para Quién -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold text-sumak-green mb-3">
        ¿Para quién?
      </h3>
      <p class="text-sm text-text-body leading-relaxed">
        Regalos para <strong>hombres</strong>, <strong>mujeres</strong>, 
        <strong>parejas</strong>, <strong>profesionales</strong> 
        (médicos, ingenieros, abogados) y <strong>equipos corporativos</strong>.
      </p>
    </div>
    
    <!-- Para Qué Ocasión -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold text-sumak-green mb-3">
        ¿Para qué ocasión?
      </h3>
      <p class="text-sm text-text-body leading-relaxed">
        <strong>Cumpleaños</strong>, <strong>aniversarios</strong>, 
        <strong>grados</strong>, <strong>ascensos</strong>, 
        <strong>Navidad</strong>, <strong>San Valentín</strong>.
      </p>
    </div>
    
    <!-- Qué Incluye -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold text-sumak-green mb-3">
        ¿Qué incluye?
      </h3>
      <p class="text-sm text-text-body leading-relaxed">
        <strong>Chocolate artesanal</strong>, <strong>vinos premium</strong>, 
        <strong>frutos secos</strong> y productos gourmet curados.
      </p>
    </div>
  </div>
</div>
```

**Definition of Done**:
- [ ] 3 bloques informativos agregados
- [ ] Keywords long-tail incluidas
- [ ] Responsive
- [ ] No afecta performance
- [ ] Test: `npm run test:e2e:catalog`

**Tiempo**: 1.5 horas  
**Riesgo**: Bajo  
**Impacto**: +80% cobertura long-tail

---

### P1.2: Implementar Schema Product

**Archivo**: `src/app/features/catalog/catalog.component.ts`

**Código**:
```typescript
private addProductListSchema(): void {
  if (!this.isBrowser) return;

  const products = this.filteredProducts.slice(0, 10).map(p => ({
    "@type": "Product",
    "name": p.name,
    "description": p.description || `Ritual gastronómico premium ${p.name}`,
    "image": `https://sumakgourmet.co${p.image}`,
    "brand": {
      "@type": "Brand",
      "name": "Sumak Gourmet"
    },
    "offers": {
      "@type": "Offer",
      "price": p.price,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "url": `https://sumakgourmet.co/catalog#${p.id}`
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": p
    }))
  };

  const script = this.doc.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  script.id = 'product-list-schema';
  
  // Remove existing
  const existing = this.doc.getElementById('product-list-schema');
  if (existing) existing.remove();
  
  this.doc.head.appendChild(script);
}

ngOnInit(): void {
  // ... existing code
  if (this.isBrowser) {
    this.addProductListSchema();
  }
}
```

**Definition of Done**:
- [ ] Schema agregado en catalog
- [ ] Validado en Google Rich Results Test
- [ ] No errores en consola
- [ ] SSR safe (isPlatformBrowser)
- [ ] Test: `npm run test:schema`

**Tests**:
```typescript
it('should add product list schema', () => {
  component.ngOnInit();
  const script = document.getElementById('product-list-schema');
  expect(script).toBeTruthy();
  const schema = JSON.parse(script!.textContent!);
  expect(schema['@type']).toBe('ItemList');
});
```

**Tiempo**: 3 horas  
**Riesgo**: Medio  
**Impacto**: Rich Results en Google

---


### P1.3: Reescribir Corporate Gifts Hero

**Archivo**: `src/app/features/corporate-gifts/corporate-gifts.component.html`

**Cambio**:
```html
<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-sumak-green via-sumak-green/95 to-sumak-brown overflow-hidden">
  <div class="absolute inset-0 bg-sumak-pattern opacity-10"></div>
  <div class="relative container-sumak section-padding">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl lg:text-6xl font-against text-white mb-6 leading-tight">
        Regalos Corporativos Premium en Colombia
      </h1>
      
      <p class="text-xl text-gray-200 mb-8 leading-relaxed">
        Detalles empresariales y regalos para clientes que reflejan el valor de tu marca. 
        Rituales gastronómicos curados para empresas, directivos y equipos de trabajo.
      </p>
      
      <ul class="space-y-3 mb-10 text-left max-w-2xl mx-auto">
        <li class="flex items-start text-gray-200">
          <svg class="w-6 h-6 text-sumak-gold mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-lg">
            <strong>Regalos para clientes y aliados estratégicos</strong> 
            con presentación premium
          </span>
        </li>
        <li class="flex items-start text-gray-200">
          <svg class="w-6 h-6 text-sumak-gold mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-lg">
            <strong>Detalles para directivos, gerentes y equipos</strong> 
            en reconocimientos y celebraciones
          </span>
        </li>
        <li class="flex items-start text-gray-200">
          <svg class="w-6 h-6 text-sumak-gold mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-lg">
            Volúmenes desde <strong>10 unidades</strong>. 
            Cotización en menos de 24 horas
          </span>
        </li>
      </ul>
    </div>
  </div>
</section>
```

**Definition of Done**:
- [ ] H1 actualizado con keywords B2B
- [ ] Bullets optimizados
- [ ] Mantiene diseño premium
- [ ] Responsive
- [ ] Test: `npm run test:corporate`

**Tiempo**: 1.5 horas  
**Riesgo**: Bajo  
**Impacto**: +70% visibilidad B2B

---

## 🟢 P2: MEDIA PRIORIDAD (Mes 2-3)

### P2.1: Crear Página "Regalos por Profesión"

**Archivos Nuevos**:
- `src/app/features/gifts-by-profession/gifts-by-profession.component.ts`
- `src/app/features/gifts-by-profession/gifts-by-profession.component.html`
- `src/app/features/gifts-by-profession/gifts-by-profession.component.scss`

**Ruta**: `/regalos-por-profesion`

**Estructura**:
```html
<h1>Regalos Gourmet por Profesión</h1>

<section>
  <h2>Regalos para Profesionales de la Salud</h2>
  <ul>
    <li>Regalos para médicos</li>
    <li>Regalos para enfermeras</li>
  </ul>
</section>

<section>
  <h2>Regalos para Ingenieros</h2>
  <!-- ... -->
</section>
```

**Definition of Done**:
- [ ] Página creada con 8 categorías profesionales
- [ ] Ruta agregada a app.routes.ts
- [ ] Agregada a prerenderRoutes
- [ ] Schema Breadcrumb implementado
- [ ] Interlinking desde Home y Catalog
- [ ] Test: `npm run test:e2e:professions`

**Tiempo**: 6 horas  
**Riesgo**: Bajo  
**Impacto**: +50% cobertura profesiones

---

### P2.2: Optimizar FAQ con Schema

**Archivo**: `src/app/features/faq/faq.component.ts`

**Código**:
```typescript
private addFAQSchema(): void {
  const faqs = [
    {
      question: "¿Qué tipo de regalos gourmet ofrece Sumak?",
      answer: "Sumak ofrece rituales gastronómicos premium que combinan chocolate artesanal, vinos seleccionados, frutos secos y frutas deshidratadas. Ideales como regalos para hombres, mujeres, profesionales y empresas."
    },
    {
      question: "¿Hacen regalos corporativos en volumen?",
      answer: "Sí. Ofrecemos regalos corporativos desde 10 unidades para empresas, directivos, clientes y equipos de trabajo. Cotización en menos de 24 horas."
    },
    {
      question: "¿Entregan en Bogotá?",
      answer: "Sí. Entregamos en Bogotá en menos de 24 horas. También hacemos envíos a toda Colombia."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const script = this.doc.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  script.id = 'faq-schema';
  this.doc.head.appendChild(script);
}
```

**Definition of Done**:
- [ ] FAQ Schema implementado
- [ ] Validado en Rich Results Test
- [ ] Preguntas optimizadas con keywords
- [ ] Test: `npm run test:faq-schema`

**Tiempo**: 3 horas  
**Riesgo**: Bajo  
**Impacto**: Featured Snippets

---

## 📅 ROADMAP REALISTA

### Semana 1 (P0: Crítico)
**Tiempo Total**: 5.5 horas

| Día | Tarea | Tiempo | Responsable |
|-----|-------|--------|-------------|
| Lun | P0.1: Meta Tags | 2h | Frontend Dev |
| Mar | P0.2: Bloque SEO Home | 1h | Frontend Dev |
| Mié | P0.3: H1 Catalog | 0.5h | Frontend Dev |
| Jue | P0.4: Prerendering | 2h | DevOps + Frontend |
| Vie | Testing + Validación | - | QA |

**Entregables**:
- ✅ Meta tags actualizados
- ✅ Bloque SEO en Home
- ✅ H1 optimizado en Catalog
- ✅ Prerendering configurado

**Validación**:
- [ ] Lighthouse SEO > 95
- [ ] View-source muestra contenido
- [ ] No errores en consola
- [ ] Performance > 90

---

### Semana 2-3 (P1: Alta)
**Tiempo Total**: 9 horas

| Semana | Tarea | Tiempo |
|--------|-------|--------|
| 2 | P1.1: Intro SEO Catalog | 1.5h |
| 2 | P1.2: Schema Product | 3h |
| 3 | P1.3: Corporate Hero | 1.5h |
| 3 | Testing + Ajustes | 3h |

**Entregables**:
- ✅ Intro SEO en Catalog
- ✅ Schema Product/ItemList
- ✅ Corporate Gifts optimizado

**Validación**:
- [ ] Rich Results Test pasa
- [ ] Keywords posicionan (Search Console)
- [ ] CTR mejora > 20%

---

### Mes 2-3 (P2: Media)
**Tiempo Total**: 15 horas

| Mes | Tarea | Tiempo |
|-----|-------|--------|
| 2 | P2.1: Página Profesiones | 6h |
| 2 | P2.2: FAQ Schema | 3h |
| 3 | Landing Navidad | 4h |
| 3 | Testing + Optimización | 2h |

**Entregables**:
- ✅ Página "Regalos por Profesión"
- ✅ FAQ con Schema
- ✅ Landing estacional

**Validación**:
- [ ] Tráfico orgánico +100%
- [ ] Keywords top 10: +50
- [ ] Conversión orgánica +30%

---

## ✅ CHECKLIST DE VALIDACIÓN

### Pre-Implementación

**Google Search Console**:
```
[ ] Obtener impresiones actuales (últimos 3 meses)
[ ] Obtener clicks actuales
[ ] Obtener CTR promedio
[ ] Obtener posición promedio
[ ] Exportar keywords actuales (top 100)
[ ] Verificar cobertura de índice
[ ] Verificar errores de rastreo
```

**GA4**:
```
[ ] Obtener sesiones orgánicas (últimos 3 meses)
[ ] Obtener tasa de conversión orgánica
[ ] Obtener páginas de aterrizaje orgánicas
[ ] Obtener bounce rate por página
[ ] Obtener tiempo promedio en página
```

---

### Post-Implementación (Semana 1)

**Lighthouse**:
```
[ ] Performance > 90
[ ] SEO > 95
[ ] Best Practices > 90
[ ] Accessibility > 90
```

**Search Console**:
```
[ ] Solicitar indexación de páginas modificadas
[ ] Verificar que no hay errores de rastreo nuevos
[ ] Verificar que prerendering funciona (view-source)
```

**Rich Results Test**:
```
[ ] Home: Organization Schema válido
[ ] Catalog: Product Schema válido
[ ] FAQ: FAQ Schema válido
```

---

### Post-Implementación (Mes 1)

**Search Console**:
```
[ ] Impresiones +50% vs baseline
[ ] Clicks +30% vs baseline
[ ] CTR +20% vs baseline
[ ] Keywords top 100: +30 nuevas
```

**GA4**:
```
[ ] Sesiones orgánicas +50% vs baseline
[ ] Bounce rate < 60%
[ ] Tiempo en página > 2 min
[ ] Conversión orgánica +20%
```

---

### Post-Implementación (Mes 3)

**Search Console**:
```
[ ] Impresiones +150% vs baseline
[ ] Clicks +100% vs baseline
[ ] CTR +30% vs baseline
[ ] Keywords top 100: +80 nuevas
[ ] Keywords top 10: +20 nuevas
```

**GA4**:
```
[ ] Sesiones orgánicas +150% vs baseline
[ ] Conversión orgánica +40%
[ ] Páginas/sesión > 3
[ ] Valor por sesión orgánica +50%
```

---

## ⚠️ RIESGOS Y MITIGACIONES

### Riesgo 1: Prerendering Rompe Build
**Probabilidad**: Media (30%)  
**Impacto**: Alto

**Mitigación**:
- Probar en local antes de deploy
- Tener rollback plan
- Implementar en staging primero
- Monitorear errores en build

**Plan B**: Si falla, usar meta tags dinámicos sin prerendering

---

### Riesgo 2: Keywords No Posicionan
**Probabilidad**: Media (40%)  
**Impacto**: Alto

**Causas Posibles**:
- Competencia muy alta
- Dominio con baja autoridad
- Backlinks insuficientes

**Mitigación**:
- Enfocarse en long-tail keywords
- Crear contenido de calidad
- Conseguir backlinks naturales
- Monitorear Search Console semanalmente

**Plan B**: Pivotar a keywords de menor competencia

---

### Riesgo 3: Performance Degradation
**Probabilidad**: Baja (20%)  
**Impacto**: Crítico

**Causas Posibles**:
- Bloques SEO muy pesados
- Schemas mal implementados
- Prerendering lento

**Mitigación**:
- Monitorear Lighthouse en cada deploy
- Lazy load de contenido no crítico
- Optimizar imágenes
- CDN para assets

**Plan B**: Remover bloques que afecten performance

---

### Riesgo 4: Penalización por Keyword Stuffing
**Probabilidad**: Baja (10%)  
**Impacto**: Crítico

**Mitigación**:
- Mantener densidad < 2%
- Usar sinónimos y variaciones
- Contenido natural y editorial
- Review manual antes de deploy

**Plan B**: Reescribir contenido más natural

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs Principales

**Mes 1**:
- Impresiones Search Console: +50%
- Clicks orgánicos: +30%
- CTR: +20%
- Keywords top 100: +30

**Mes 3**:
- Impresiones: +150%
- Clicks: +100%
- CTR: +30%
- Keywords top 100: +80
- Keywords top 10: +20

**Año 1**:
- Tráfico orgánico: +300-400% (conservador)
- Conversión orgánica: +50%
- Leads orgánicos: +200%
- Revenue orgánico: +150%

---

## 🔧 COMANDOS ÚTILES

### Testing
```bash
# Test SEO meta tags
npm run test:seo-meta

# Test schemas
npm run test:schema

# Test prerendering
npm run build:prerender && npm run test:prerender

# E2E tests
npm run test:e2e:home
npm run test:e2e:catalog
npm run test:e2e:corporate

# Lighthouse CI
npm run lighthouse:ci
```

### Validación
```bash
# Verificar prerendered HTML
cat dist/sumak-front/browser/index.html | grep "Regalos Gourmet"

# Verificar schemas
cat dist/sumak-front/browser/catalog/index.html | grep "application/ld+json"

# Test local
npm run serve:prerender
```

---

## 📚 RECURSOS

### Herramientas de Validación
- Google Search Console: https://search.google.com/search-console
- Rich Results Test: https://search.google.com/test/rich-results
- Lighthouse: https://pagespeed.web.dev
- Schema Validator: https://validator.schema.org

### Documentación
- Angular Prerendering: https://angular.dev/guide/prerendering
- Schema.org: https://schema.org
- Google SEO Guide: https://developers.google.com/search/docs

---

## ✅ CONCLUSIÓN

### Estado Actual
- SEO Técnico: 9.5/10 ✅
- SEO Semántico: 4/10 🔴
- Prerendering: No implementado 🔴

### Estado Objetivo (Mes 3)
- SEO Técnico: 9.5/10 ✅
- SEO Semántico: 8/10 ✅
- Prerendering: Implementado ✅
- Tráfico orgánico: +150-200% ✅

### Inversión
- **Tiempo**: 30 horas (3 meses)
- **Costo**: $0 (tiempo interno)
- **ROI Esperado**: +300-400% tráfico (conservador)

### Próximo Paso
**Implementar P0 esta semana (5.5 horas)**

---

**Documento creado**: 2026-01-09  
**Última actualización**: 2026-01-09  
**Versión**: 1.0  
**Responsable**: SEO Team + Frontend Team
