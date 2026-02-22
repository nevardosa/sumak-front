# 🖼️ GUÍA: OPTIMIZACIÓN DE IMÁGENES
## Sumak Gourmet - Performance & SEO

---

## 🎯 OBJETIVOS

- Reducir peso de imágenes 60-80%
- Mejorar LCP (Largest Contentful Paint)
- Acelerar carga de página
- Mejorar SEO de imágenes
- Optimizar para Google Images

**Impacto esperado:** +30% velocidad de carga

---

## 📊 ANÁLISIS ACTUAL

### Imágenes Críticas Identificadas
```
assets/images/
├── hero-animation.GIF (CRÍTICO - Hero)
├── sol_caribeno.jpg (Producto destacado)
├── zipa_real.jpg (Producto destacado)
├── pasion_andina.jpg (Producto destacado)
├── logo.png (Branding)
└── og-cover.jpg (Social sharing)
```

### Problemas Detectados
- ❌ GIF pesado en hero (>2MB estimado)
- ❌ JPGs sin compresión
- ❌ Sin formato WebP
- ❌ Sin lazy loading estratégico
- ❌ Sin responsive images

---

## 🔧 PASO 1: COMPRESIÓN Y CONVERSIÓN

### 1.1 Herramientas Recomendadas

**Online (Gratuitas):**
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app
- ImageOptim: https://imageoptim.com

**CLI (Automatización):**
```bash
# Instalar sharp (Node.js)
npm install sharp --save-dev

# Instalar imagemin
npm install imagemin imagemin-webp --save-dev
```

### 1.2 Script de Optimización

Crear `scripts/optimize-images.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './src/assets/images';
const outputDir = './src/assets/images/optimized';

// Crear directorio de salida
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Procesar imágenes
fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file);
  const ext = path.extname(file).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const baseName = path.basename(file, ext);
    
    // Generar WebP
    sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${baseName}.webp`))
      .then(() => console.log(`✓ ${file} → ${baseName}.webp`));
    
    // Generar AVIF (opcional, mejor compresión)
    sharp(inputPath)
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, `${baseName}.avif`))
      .then(() => console.log(`✓ ${file} → ${baseName}.avif`));
    
    // Optimizar original
    sharp(inputPath)
      .jpeg({ quality: 85, progressive: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(outputDir, file))
      .then(() => console.log(`✓ ${file} optimizado`));
  }
});
```

Agregar a `package.json`:
```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

### 1.3 Ejecutar Optimización
```bash
npm run optimize:images
```

---

## 📐 PASO 2: RESPONSIVE IMAGES

### 2.1 Generar Múltiples Tamaños

Actualizar script para generar tamaños:
```javascript
const sizes = [320, 640, 960, 1280, 1920];

sizes.forEach(width => {
  sharp(inputPath)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(outputDir, `${baseName}-${width}w.webp`));
});
```

### 2.2 Implementar en HTML

**Antes:**
```html
<img src="assets/images/sol_caribeno.jpg" alt="Sol Caribeño">
```

**Después:**
```html
<picture>
  <source 
    type="image/avif"
    srcset="
      assets/images/optimized/sol_caribeno-320w.avif 320w,
      assets/images/optimized/sol_caribeno-640w.avif 640w,
      assets/images/optimized/sol_caribeno-960w.avif 960w"
    sizes="(max-width: 640px) 100vw, 640px">
  <source 
    type="image/webp"
    srcset="
      assets/images/optimized/sol_caribeno-320w.webp 320w,
      assets/images/optimized/sol_caribeno-640w.webp 640w,
      assets/images/optimized/sol_caribeno-960w.webp 960w"
    sizes="(max-width: 640px) 100vw, 640px">
  <img 
    src="assets/images/optimized/sol_caribeno.jpg"
    alt="Sol Caribeño - Ritual gastronómico premium con chocolate y frutos tropicales"
    width="256"
    height="256"
    loading="lazy"
    decoding="async">
</picture>
```

---

## ⚡ PASO 3: LAZY LOADING ESTRATÉGICO

### 3.1 Prioridades de Carga

**Eager (Carga inmediata):**
- Hero image
- Logo
- Primera imagen de producto visible

**Lazy (Carga diferida):**
- Imágenes below the fold
- Productos no visibles
- Imágenes de footer

### 3.2 Implementación

```html
<!-- Hero - EAGER -->
<img 
  src="hero.webp" 
  loading="eager" 
  fetchpriority="high">

<!-- Productos visibles - AUTO -->
<img 
  src="product1.webp" 
  loading="auto">

<!-- Below fold - LAZY -->
<img 
  src="product2.webp" 
  loading="lazy" 
  decoding="async">
```

### 3.3 Intersection Observer (Avanzado)

Para control total:
```typescript
// image-lazy-load.directive.ts
@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  @Input() appLazyLoad!: string;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = this.appLazyLoad;
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(this.el.nativeElement);
  }
}
```

---

## 🎨 PASO 4: OPTIMIZACIÓN HERO GIF

### 4.1 Problema Actual
```
hero-animation.GIF
- Peso estimado: 2-5MB
- Formato: GIF (ineficiente)
- Impacto: LCP alto
```

### 4.2 Solución: Convertir a Video

**Ventajas:**
- 90% menos peso
- Mejor calidad
- Autoplay sin audio permitido
- Mejor performance

**Conversión:**
```bash
# Instalar ffmpeg
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg

# Convertir GIF a MP4
ffmpeg -i hero-animation.GIF -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" hero-animation.mp4

# Convertir a WebM (mejor compresión)
ffmpeg -i hero-animation.GIF -c:v libvpx-vp9 -b:v 0 -crf 30 hero-animation.webm
```

**Implementación:**
```html
<!-- Reemplazar img con video -->
<video 
  autoplay 
  loop 
  muted 
  playsinline
  poster="assets/images/hero-poster.jpg"
  class="w-full h-full object-cover">
  <source src="assets/videos/hero-animation.webm" type="video/webm">
  <source src="assets/videos/hero-animation.mp4" type="video/mp4">
</video>
```

---

## 📝 PASO 5: ALT TEXT OPTIMIZADO

### 5.1 Fórmula SEO
```
[Producto] - [Característica principal] [Beneficio] [Ubicación]
```

### 5.2 Ejemplos Optimizados

**Antes:**
```html
<img src="sol_caribeno.jpg" alt="Sol Caribeño">
```

**Después:**
```html
<img 
  src="sol_caribeno.webp" 
  alt="Sol Caribeño - Ritual gastronómico premium con chocolate 70% cacao y frutos tropicales, entrega rápida en Bogotá"
  title="Ritual Sol Caribeño | Sumak Gourmet">
```

### 5.3 Alt Text para Todas las Imágenes

```typescript
// Actualizar en catalog
const altTexts = {
  'sol_caribeno': 'Sol Caribeño - Ritual gastronómico premium con chocolate y frutos tropicales, ideal para regalos corporativos en Colombia',
  'zipa_real': 'Zipa Real - Ritual gastronómico exclusivo con ingredientes premium seleccionados, perfecto para ejecutivos',
  'pasion_andina': 'Pasión Andina - Ritual gastronómico con sabores andinos colombianos, experiencia gourmet única'
};
```

---

## 🗺️ PASO 6: IMAGE SITEMAP

### 6.1 Crear sitemap-images.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://sumakgourmet.co/</loc>
    <image:image>
      <image:loc>https://sumakgourmet.co/assets/images/hero-animation.jpg</image:loc>
      <image:caption>Rituales gastronómicos premium Sumak Gourmet Colombia</image:caption>
      <image:title>Hero Sumak Gourmet</image:title>
    </image:image>
  </url>
  
  <url>
    <loc>https://sumakgourmet.co/catalog</loc>
    <image:image>
      <image:loc>https://sumakgourmet.co/assets/images/sol_caribeno.jpg</image:loc>
      <image:caption>Sol Caribeño - Ritual gastronómico premium</image:caption>
      <image:title>Ritual Sol Caribeño</image:title>
      <image:geo_location>Bogotá, Colombia</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://sumakgourmet.co/assets/images/zipa_real.jpg</image:loc>
      <image:caption>Zipa Real - Ritual gastronómico exclusivo</image:caption>
      <image:title>Ritual Zipa Real</image:title>
      <image:geo_location>Bogotá, Colombia</image:geo_location>
    </image:image>
  </url>
</urlset>
```

### 6.2 Agregar a robots.txt
```txt
Sitemap: https://sumakgourmet.co/sitemap.xml
Sitemap: https://sumakgourmet.co/sitemap-images.xml
```

---

## 🎯 PASO 7: STRUCTURED DATA PARA IMÁGENES

### 7.1 ImageObject Schema

Agregar a Product Schema:
```typescript
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Sol Caribeño",
  "image": [
    {
      "@type": "ImageObject",
      "url": "https://sumakgourmet.co/assets/images/sol_caribeno.jpg",
      "width": 1200,
      "height": 1200,
      "caption": "Sol Caribeño - Ritual gastronómico premium"
    }
  ]
}
```

---

## 📊 PASO 8: MEDICIÓN Y VALIDACIÓN

### 8.1 Herramientas de Medición

**PageSpeed Insights:**
```
https://pagespeed.web.dev/
- Analizar antes/después
- Objetivo: 90+ móvil, 95+ desktop
```

**WebPageTest:**
```
https://www.webpagetest.org/
- Filmstrip view
- Waterfall analysis
```

### 8.2 Métricas Objetivo

**Antes de Optimización:**
- LCP: ~4.5s (Rojo)
- Peso total imágenes: ~8MB
- Requests: 25+

**Después de Optimización:**
- LCP: <2.5s (Verde)
- Peso total imágenes: <2MB
- Requests: 15-20

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Preparación
- [ ] Backup de imágenes originales
- [ ] Instalar herramientas (sharp, imagemin)
- [ ] Crear directorio optimized/

### Optimización
- [ ] Comprimir todas las JPG/PNG
- [ ] Generar versiones WebP
- [ ] Generar versiones AVIF
- [ ] Crear múltiples tamaños (responsive)
- [ ] Convertir GIF hero a video

### Implementación
- [ ] Actualizar HTML con <picture>
- [ ] Implementar lazy loading
- [ ] Optimizar alt text
- [ ] Agregar width/height
- [ ] Implementar fetchpriority

### SEO
- [ ] Crear sitemap de imágenes
- [ ] Agregar ImageObject schema
- [ ] Optimizar nombres de archivo
- [ ] Validar en Google Images

### Validación
- [ ] Test en PageSpeed Insights
- [ ] Verificar LCP <2.5s
- [ ] Comprobar peso total <2MB
- [ ] Validar en móvil

---

## 🚀 SCRIPT COMPLETO DE AUTOMATIZACIÓN

```javascript
// scripts/optimize-all-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const config = {
  inputDir: './src/assets/images',
  outputDir: './src/assets/images/optimized',
  sizes: [320, 640, 960, 1280, 1920],
  formats: ['webp', 'avif', 'jpg'],
  quality: {
    webp: 85,
    avif: 80,
    jpg: 85
  }
};

async function optimizeImage(inputPath, filename) {
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  
  console.log(`Processing: ${filename}`);
  
  // Generate responsive sizes
  for (const size of config.sizes) {
    for (const format of config.formats) {
      const outputPath = path.join(
        config.outputDir,
        `${baseName}-${size}w.${format}`
      );
      
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        [format]({ quality: config.quality[format] })
        .toFile(outputPath);
      
      console.log(`  ✓ ${baseName}-${size}w.${format}`);
    }
  }
}

async function main() {
  // Create output directory
  await fs.mkdir(config.outputDir, { recursive: true });
  
  // Read all files
  const files = await fs.readdir(config.inputDir);
  
  // Process each image
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(config.inputDir, file);
      await optimizeImage(inputPath, file);
    }
  }
  
  console.log('\n✅ All images optimized!');
}

main().catch(console.error);
```

---

## 🎯 RESULTADOS ESPERADOS

### Performance
- **LCP:** 4.5s → 1.8s (-60%)
- **Peso total:** 8MB → 1.5MB (-81%)
- **PageSpeed Score:** 65 → 95 (+46%)

### SEO
- **Google Images:** Mejor ranking
- **Rich Results:** Imágenes en snippets
- **Mobile Score:** 100/100

### UX
- **Carga percibida:** Más rápida
- **Bounce rate:** -15%
- **Engagement:** +25%

---

**Tiempo estimado:** 3-4 horas
**Prioridad:** ALTA
**Impacto:** CRÍTICO para Core Web Vitals
