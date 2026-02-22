# Guía Rápida: Agregar Nuevo Ritual

## 🚀 Pasos Rápidos (5 minutos)

### 1️⃣ Preparar Imagen
```bash
# Nombre: nombre-del-ritual.jpg
# Ubicación: src/assets/images/
# Tamaño recomendado: 1200x1200px
# Formato: JPG optimizado
```

### 2️⃣ Agregar en catalog.service.ts

Copiar y modificar este template:

```typescript
{
  id: '15', // Siguiente número disponible
  slug: 'nombre-del-ritual', // Sin espacios, sin tildes, minúsculas
  name: 'Nombre del Ritual',
  price: 350000, // Precio en COP
  description: 'Descripción premium que conecta emocionalmente con el cliente. Habla de la experiencia, no solo del producto.',
  experience: 'La experiencia sensorial que ofrece este ritual.',
  ingredients: [
    'Bebida premium incluida en presentación original',
    'Chocolate 70% con...',
    'Frutos secos premium',
    'Miel o mermelada especial'
  ],
  sensorialExperience: 'Perfil de sabor: dulce, cítrico, intenso, etc.',
  imageUrl: 'assets/images/nombre-del-ritual.jpg',
  category: ProductCategory.PREMIUM, // CLASSIC, PREMIUM, o EXCLUSIVE
  
  // SEO - MUY IMPORTANTE
  metaTitle: 'Nombre del Ritual - Descripción Corta | Sumak Gourmet',
  metaDescription: 'Descripción de 150-160 caracteres optimizada para Google. Incluye palabras clave naturalmente.',
  keywords: ['palabra clave 1', 'palabra clave 2', 'palabra clave 3', 'regalo premium colombia'],
  
  // Entrega
  deliveryInfo: {
    bogotaExpress: true,
    nationalShipping: true,
    estimatedDays: '2-4 días hábiles'
  },
  
  // Opciones Corporativas
  corporateOptions: {
    available: true,
    minQuantity: 10,
    customization: true,
    bulkDiscount: 15 // Porcentaje
  },
  
  // Curaduría (para el equipo)
  curatedLine: 'Recomendado para: tipo de cliente, ocasión, perfil.',
  occasions: [
    'Ocasión específica 1',
    'Ocasión específica 2',
    'Ocasión específica 3'
  ],
  affinity: {
    temperament: ['perfil psicográfico 1', 'perfil 2'],
    palate: ['perfil de sabor 1', 'perfil 2'],
    genderAffinity: 'Unisex' // o 'Predominio masculino', 'Predominio femenino'
  },
  servingSuggestion: 'Orden recomendado de degustación para maximizar la experiencia.'
}
```

### 3️⃣ Actualizar sitemap.xml

Agregar antes del cierre de `</urlset>`:

```xml
  <url>
    <loc>https://sumakgourmet.co/ritual/nombre-del-ritual</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
```

### 4️⃣ Verificar

```bash
# 1. Compilar
npm run build

# 2. Verificar en navegador
# - Ir a /catalog
# - Click en el nuevo ritual
# - Verificar que carga /ritual/nombre-del-ritual
# - Revisar que todo se ve bien en móvil y desktop

# 3. Verificar SEO
# - F12 → Elements → <head>
# - Buscar <title>, <meta name="description">
# - Buscar <script type="application/ld+json">
```

## ✅ Checklist de Calidad

- [ ] Imagen optimizada y cargando
- [ ] Slug único (sin espacios, sin tildes)
- [ ] Precio correcto
- [ ] Descripción premium (no técnica)
- [ ] Meta title < 60 caracteres
- [ ] Meta description 150-160 caracteres
- [ ] Keywords relevantes (3-5)
- [ ] Ingredientes completos
- [ ] Categoría correcta
- [ ] Sitemap actualizado
- [ ] Prueba en móvil
- [ ] Prueba en desktop
- [ ] CTAs funcionando

## 🎨 Tips de Copywriting

### Descripción
❌ "Este ritual incluye whisky, chocolate y frutos secos"
✅ "Hay sabores que siempre están. Este ritual representa la confianza, la memoria y la tradición."

### Meta Description
❌ "Ritual con whisky y chocolate"
✅ "Ritual premium con whisky añejo, chocolate artesanal y frutos nobles. Ideal para celebraciones especiales. Envío express en Bogotá."

### Keywords
✅ Incluir:
- Nombre del ritual
- Tipo de bebida
- Ocasión de uso
- "regalo premium colombia"
- "ritual gastronómico"

## 🔍 SEO Best Practices

1. **Title**: Incluir nombre + beneficio + marca
2. **Description**: Incluir CTA implícito + diferenciador
3. **Keywords**: Naturales, no stuffing
4. **Slug**: Corto, descriptivo, memorable
5. **Image Alt**: Descriptivo para accesibilidad

## 🚨 Errores Comunes

❌ Slug con espacios: `'Nuevo Ritual'`
✅ Slug correcto: `'nuevo-ritual'`

❌ Slug con tildes: `'pasión-andina'`
✅ Slug correcto: `'pasion-andina'`

❌ ID duplicado
✅ ID único secuencial

❌ Precio como string: `'350000'`
✅ Precio como número: `350000`

❌ Imagen no existe
✅ Verificar ruta antes de commit

## 📱 Preview Checklist

### Móvil
- [ ] Imagen hero se ve bien (1:1)
- [ ] Título legible
- [ ] Precio visible
- [ ] CTAs accesibles
- [ ] Sticky CTA funciona
- [ ] WhatsApp abre correctamente

### Desktop
- [ ] Imagen hero panorámica
- [ ] Layout espacioso
- [ ] CTAs en línea
- [ ] Sin CTA sticky
- [ ] Breadcrumbs visibles

## 🎯 Tiempo Estimado

- Preparar imagen: 5 min
- Agregar código: 10 min
- Actualizar sitemap: 2 min
- Verificar: 5 min

**Total: ~20 minutos por ritual**

## 📞 ¿Dudas?

Revisar:
1. `RITUAL_PDP_REFACTORING.md` (documentación completa)
2. `catalog.service.ts` (ejemplos existentes)
3. Rituales existentes como referencia

---

**Última actualización**: Enero 2025
