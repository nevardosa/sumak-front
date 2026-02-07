# SEO Best Practices - Sumak Gourmet

## ✅ IMPLEMENTADO

### 1. Meta Tags Dinámicos
Todas las páginas principales tienen meta tags únicos y optimizados:
- Home
- Catalog
- Regalos Corporativos
- Experiencias
- About
- Contact
- FAQ
- Privacy Policy

### 2. Canonical URLs
Cada página setea su canonical URL para evitar contenido duplicado.

### 3. Datos Estructurados (Schema.org)
- **Organization Schema**: Información de empresa en todas las páginas
- **Breadcrumb Schema**: Navegación jerárquica en cada página

### 4. Archivos SEO Esenciales
- ✅ robots.txt
- ✅ sitemap.xml (9 URLs indexables)

### 5. Optimización de Imágenes
- Lazy loading implementado
- Alt text descriptivo y rico en keywords

---

## 📋 CHECKLIST PARA NUEVAS PÁGINAS

Cuando crees una nueva página, asegúrate de:

### 1. Importar SeoService
```typescript
import { SeoService } from '../../core/services/seo.service';
```

### 2. Inyectar en Constructor
```typescript
constructor(private readonly seoService: SeoService) {}
```

### 3. Implementar OnInit y OnDestroy
```typescript
ngOnInit(): void {
  this.setSeoMetadata();
}

ngOnDestroy(): void {
  this.seoService.removeSchema('breadcrumb-schema');
}
```

### 4. Configurar Meta Tags
```typescript
private setSeoMetadata(): void {
  this.seoService.updateMetaTags({
    title: 'Título Único | Sumak Gourmet',
    description: 'Descripción única de 150-160 caracteres con keywords naturales.',
    keywords: 'keyword1, keyword2, keyword3',
    ogTitle: 'Título para redes sociales',
    ogDescription: 'Descripción para redes sociales',
    ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
    ogUrl: 'https://sumakgourmet.co/ruta',
    canonicalUrl: '/ruta'
  });

  this.seoService.addBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Nombre Página', url: '/ruta' }
  ]);
}
```

### 5. Optimizar Imágenes
```html
<img
  src="ruta/imagen.jpg"
  alt="Descripción detallada con keywords naturales"
  loading="lazy"
  width="800"
  height="600"
  class="..."
/>
```

---

## 🎯 KEYWORDS PRINCIPALES

### Primarias
- rituales gastronómicos
- regalos corporativos premium
- experiencias gourmet Colombia
- chocolate premium
- curaduría gastronómica

### Secundarias
- regalos empresariales
- rituales premium
- chocolate 70% cacao
- frutos secos seleccionados
- mieles infusionadas
- regalos con intención

### Long-tail
- rituales gastronómicos para empresas
- regalos corporativos con curaduría
- experiencias gastronómicas premium Colombia
- chocolate premium para regalar
- rituales gourmet personalizados

---

## 📊 ESTRUCTURA DE TÍTULOS

### Formato Recomendado
```
[Keyword Principal] | Sumak Gourmet [- Complemento]
```

### Ejemplos
- ✅ "Rituales Gastronómicos Premium | Sumak Gourmet Colombia"
- ✅ "Regalos Corporativos Premium | Sumak Gourmet"
- ✅ "Catálogo de Rituales Gastronómicos | Sumak Gourmet"

### Longitud
- Título: 50-60 caracteres
- Description: 150-160 caracteres

---

## 🔍 OPTIMIZACIÓN PARA IA

### Estructura de Contenido
1. **Definición clara**: "¿Qué es X?"
2. **Diferenciación**: "¿Por qué elegir Sumak?"
3. **Proceso**: "¿Cómo funciona?"
4. **Beneficios**: Listados claros y concisos

### Lenguaje
- Declarativo y estructurado
- Evitar ambigüedades
- Respuestas explícitas
- Contexto completo

---

## 🚀 PRÓXIMAS MEJORAS RECOMENDADAS

### Alta Prioridad
1. **Implementar SSR/Prerendering**
   ```bash
   ng add @angular/ssr
   ```

2. **Agregar FAQ Schema** para páginas con preguntas frecuentes

3. **Optimizar Core Web Vitals**
   - LCP < 2.5s
   - CLS < 0.1
   - INP < 200ms

### Media Prioridad
4. **Implementar Product Schema** en catálogo

5. **Agregar LocalBusiness Schema** si aplica

6. **Optimizar fuentes** con font-display: swap

### Baja Prioridad
7. **Implementar AMP** para páginas clave

8. **Agregar Review Schema** (solo si hay reviews legítimos)

---

## 📱 REDES SOCIALES

### Open Graph Configurado
- og:title
- og:description
- og:image (1200x630px)
- og:url
- og:type
- og:locale (es_CO)
- og:site_name

### Twitter Cards Configurado
- twitter:card (summary_large_image)
- twitter:title
- twitter:description
- twitter:image

---

## 🔗 ENLACES ÚTILES

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Core Web Vitals](https://web.dev/vitals/)

---

## 📝 NOTAS IMPORTANTES

1. **Actualizar sitemap.xml** cuando agregues nuevas páginas
2. **Mantener consistencia** en keywords y messaging
3. **Evitar keyword stuffing** - usar keywords naturalmente
4. **Actualizar lastmod** en sitemap cuando cambies contenido
5. **Monitorear** Google Search Console regularmente

---

Última actualización: 2024-01-15
