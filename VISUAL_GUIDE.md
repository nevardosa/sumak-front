# 🎨 GUÍA VISUAL DEL REDISEÑO PREMIUM

## Product Card - Antes vs Después

### ❌ ANTES (Diseño Original)
```
┌─────────────────────────────────┐
│  [Badge]                        │
│                                 │
│         IMAGEN                  │
│        (Square)                 │
│                                 │
│    [Ver Detalles Button]       │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  Nombre del Producto            │
│  $150.000                       │
│                                 │
│  Descripción larga del          │
│  producto con múltiples         │
│  líneas de texto...             │
│                                 │
│  EXPERIENCIA SENSORIAL          │
│  Texto sensorial aquí...        │
│                                 │
│  [Ver Más]  [Agregar]          │
└─────────────────────────────────┘
```

### ✅ DESPUÉS (Diseño Premium)
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│         IMAGEN HERO             │
│          (4:5 ratio)            │
│          80% altura             │
│                                 │
│  [PREMIUM] ← hover only         │
│  [Agregar] ← hover only         │
│                                 │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│    Nombre del Producto          │
│         $150.000                │
│         20% altura              │
└─────────────────────────────────┘
```

---

## Product Modal - Antes vs Después

### ❌ ANTES (Layout Tradicional)
```
┌────────────────────────────────────────────────┐
│  Nombre del Producto          [X]              │
│  [Badge Premium]                               │
├────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────────┐  │
│  │          │  │ Descripción              │  │
│  │  IMAGEN  │  │ Texto aquí...            │  │
│  │ (Square) │  │                          │  │
│  │          │  │ Experiencia              │  │
│  │          │  │ Texto aquí...            │  │
│  └──────────┘  │                          │  │
│  $150.000      │ Experiencia Sensorial    │  │
│                │ Texto aquí...            │  │
│                └──────────────────────────┘  │
│                                               │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Ingredientes │  │ Perfil de Afinidad   │ │
│  │ • Item 1     │  │ Temperamento         │ │
│  │ • Item 2     │  │ Paladar              │ │
│  │ • Item 3     │  │ Género               │ │
│  └──────────────┘  └──────────────────────┘ │
│                                               │
│  [Cerrar]  [Agregar al Carrito]              │
└────────────────────────────────────────────────┘
```

### ✅ DESPUÉS (Experiencia Narrativa)
```
┌────────────────────────────────────────────────┐
│                                          [X]   │
│                                                │
│              IMAGEN HERO 16:9                  │
│           (Full width, aspecto cine)           │
│                                                │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│                                                │
│         Nombre del Producto                    │
│         (40px, Against serif)                  │
│                                                │
│    Experiencia sensorial como subtítulo        │
│         (18px, italic, emocional)              │
│                                                │
│              $150.000                          │
│           (discreto, centrado)                 │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│              EL RITUAL                         │
│                                                │
│    Historia aspiracional del producto          │
│    Narrativa que conecta emocionalmente        │
│    con el usuario y cuenta la experiencia      │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │ DESCRIPCIÓN  │  │ INGREDIENTES         │  │
│  │ Texto...     │  │ Item 1               │  │
│  └──────────────┘  │ Item 2               │  │
│                    │ Item 3               │  │
│  ┌──────────────┐  └──────────────────────┘  │
│  │ LÍNEA CURADA │  ┌──────────────────────┐  │
│  │ Texto...     │  │ SUGERENCIA SERVICIO  │  │
│  └──────────────┘  │ Texto...             │  │
│                    └──────────────────────┘  │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│   Ideal para regalos corporativos y eventos    │
│              (señal B2B sutil)                 │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │    Agregar al Carrito          →         │ │
│  └──────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🎯 Interacciones Clave

### Product Card Hover States

```
Estado Normal:
┌─────────────┐
│             │
│   IMAGEN    │  ← Sin efectos
│             │
└─────────────┘
│   Nombre    │
│   Precio    │
└─────────────┘

Estado Hover:
┌─────────────┐
│ [PREMIUM]   │  ← Badge aparece (fade in)
│             │
│   IMAGEN    │  ← Zoom 1.05x
│   (zoom)    │
│             │
│  [Agregar]  │  ← Botón aparece (fade in)
└─────────────┘  ← Card sube 4px
│   Nombre    │
│   Precio    │
└─────────────┘
     ↑
  Sombra más pronunciada
```

### Modal Scroll Behavior

```
Scroll Position: Top
┌────────────────────┐
│ IMAGEN HERO 16:9   │ ← Visible
│                    │
├────────────────────┤
│ TÍTULO GRANDE      │ ← Visible
│ Subtítulo          │
│ Precio             │
└────────────────────┘

Scroll Position: Middle
┌────────────────────┐
│ EL RITUAL          │ ← Visible
│ Historia...        │
│                    │
│ CONTENIDO GRID     │
└────────────────────┘

Scroll Position: Bottom
┌────────────────────┐
│ B2B Hint           │ ← Visible
│                    │
│ [CTA Button]       │
└────────────────────┘
```

---

## 📐 Especificaciones Técnicas

### Espaciado (Spacing Scale)
```
XS:  8px   (gaps pequeños)
SM:  16px  (padding interno)
MD:  24px  (separación elementos)
LG:  32px  (separación secciones)
XL:  48px  (padding modal)
```

### Tipografía (Type Scale)
```
Display:  40px  (Título modal)
H1:       32px  (Títulos móvil)
H2:       24px  (Secciones)
H3:       18px  (Nombre card)
Body:     16px  (Texto principal)
Small:    14px  (Precio, detalles)
Tiny:     12px  (Labels, badges)
```

### Animaciones (Timing)
```
Fast:     200ms  (Hover botones)
Normal:   300ms  (Hover cards, fade in/out)
Slow:     400ms  (Modal open, zoom imagen)

Easing:   cubic-bezier(0.4, 0, 0.2, 1)
```

### Colores (Palette)
```
Primary:    #063A3D  (Verde Sumak)
Secondary:  #8B7355  (Marrón)
Accent:     #C5A572  (Dorado)
Background: #F9F9F9  (Gris claro)
White:      #FFFFFF
Black:      #000000
```

---

## 🚀 Mejoras de Performance

### Antes:
- 12 elementos visibles en card
- 3 botones por card
- Múltiples secciones en modal
- Layout complejo con grids anidados

### Después:
- 4 elementos visibles en card (67% reducción)
- 1 botón principal (hover)
- Estructura lineal en modal
- Layout simplificado

### Impacto:
- ✅ Menor DOM size
- ✅ Menos reflows
- ✅ Animaciones más fluidas
- ✅ Carga más rápida

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
- Card: 1 columna
- Modal padding: 32px → 24px
- Título modal: 40px → 32px
- Grid: 1 columna

Tablet (768px - 1024px):
- Card: 2 columnas
- Modal padding: 48px → 40px
- Grid: 2 columnas

Desktop (> 1024px):
- Card: 3-4 columnas
- Modal padding: 48px
- Grid: 2 columnas
- Max-width: 900px
```

---

**Nota:** Este diseño prioriza la experiencia premium sobre la densidad de información, creando una narrativa aspiracional que conecta emocionalmente con el usuario.
