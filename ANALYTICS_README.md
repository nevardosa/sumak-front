# 📊 ANALYTICS IMPLEMENTATION - MAINTENANCE GUIDE

## 🎯 OVERVIEW

Sistema de analytics GA4 implementado con Google Tag Manager para Sumak Gourmet.
Mide eventos de intención comercial con máxima seguridad (sin PII) y estándares de calidad.

---

## 📁 ARQUITECTURA

```
src/app/
├── core/
│   ├── services/
│   │   ├── analytics.service.ts          # ⭐ Core service
│   │   ├── analytics.service.spec.ts     # Tests
│   │   └── analytics-examples.ts         # Ejemplos de uso
│   └── providers/
│       └── analytics-route-tracking.provider.ts  # Auto-tracking SPA
├── shared/
│   └── directives/
│       └── track-event.directive.ts      # Directiva reutilizable
```

---

## 🚀 CÓMO AGREGAR NUEVOS EVENTOS

### Paso 1: Agregar Evento al Union Type

```typescript
// analytics.service.ts
export type AnalyticsEventName =
  | 'page_view'
  | 'click_whatsapp'
  | 'click_email'
  | 'click_solicitar_propuesta'
  | 'form_start_propuesta'
  | 'form_submit_propuesta'
  | 'view_regalos_corporativos'
  | 'view_contacto'
  | 'view_experiencias'
  | 'view_catalog'
  | 'tu_nuevo_evento';  // ← Agregar aquí
```

### Paso 2: Usar en Componente

**Opción A: Con Directiva (Recomendado)**

```html
<button
  trackEvent="tu_nuevo_evento"
  trackPlacement="hero"
  trackLabel="Mi CTA">
  Click Me
</button>
```

**Opción B: Programático**

```typescript
constructor(private analytics: AnalyticsService) {}

onAction(): void {
  this.analytics.track('tu_nuevo_evento', {
    placement: 'section',
    custom_param: 'valor'
  });
}
```

### Paso 3: Configurar en GTM

1. Crear Trigger: `CE - tu_nuevo_evento`
2. Crear Tag GA4: `GA4 - Event - tu_nuevo_evento`
3. Publicar container

### Paso 4: Validar

1. GTM Preview mode
2. GA4 DebugView
3. Network tab (status 204)

---

## 📋 NAMING CONVENTIONS

### Event Names
- **Formato:** `snake_case`
- **Prefijos:**
  - `click_` - Interacciones de click
  - `view_` - Vistas de página/sección
  - `form_` - Eventos de formulario
  - `scroll_` - Eventos de scroll (si aplica)

**Ejemplos:**
- ✅ `click_solicitar_propuesta`
- ✅ `form_submit_contacto`
- ✅ `view_regalos_corporativos`
- ❌ `clickSolicitarPropuesta` (camelCase)
- ❌ `CLICK_WHATSAPP` (UPPER_CASE)

### Parameters
- **Formato:** `snake_case`
- **Estándar:**
  - `page_path` - Ruta de la página
  - `page_title` - Título de la página
  - `placement` - Ubicación del elemento
  - `cta_label` - Texto del CTA
  - `form_id` - ID del formulario

### Placements
- `navbar` - Header/navigation
- `hero` - Hero section
- `floating` - Botón flotante
- `footer` - Footer
- `section` - Sección genérica
- `contact_card` - Tarjeta de contacto
- `cta_section` - Sección de CTA

---

## 🔒 SEGURIDAD Y PII

### ❌ NUNCA Enviar

- Emails
- Teléfonos
- Nombres completos
- Mensajes de formularios
- Direcciones
- Datos de pago
- Tokens/passwords

### ✅ Sanitización Automática

El `AnalyticsService` bloquea automáticamente:
- Campos con nombres: `email`, `phone`, `name`, `message`, etc.
- Valores que contienen patrones de email
- Valores que contienen patrones de teléfono

### 🧪 Tests de Sanitización

```bash
npm test -- analytics.service.spec.ts
```

Verifica que todos los tests pasen antes de deploy.

---

## 📊 EVENTOS ACTUALES

| Evento | Descripción | Parámetros | Conversión |
|--------|-------------|------------|------------|
| `page_view` | Vista de página SPA | page_path, page_title | No |
| `click_whatsapp` | Click en WhatsApp | placement, cta_label | Sí |
| `click_email` | Click en email | placement | No |
| `click_solicitar_propuesta` | Click en CTA principal | placement, cta_label | Sí |
| `form_start_propuesta` | Inicio de formulario | form_id, placement | No |
| `form_submit_propuesta` | Envío de formulario | form_id, placement | Sí |
| `view_regalos_corporativos` | Vista página corporativos | page_path | No |
| `view_contacto` | Vista página contacto | page_path | No |
| `view_experiencias` | Vista página experiencias | page_path | No |
| `view_catalog` | Vista catálogo | page_path | No |

---

## 🎯 CONVERSIONES (KEY EVENTS)

Eventos marcados como conversiones en GA4:
1. **click_solicitar_propuesta** - Alta intención
2. **form_submit_propuesta** - Conversión real
3. **click_whatsapp** - Intención media-alta

---

## 🧪 TESTING

### Unit Tests

```bash
# Run all tests
npm test

# Run analytics tests only
npm test -- analytics.service.spec.ts

# Run with coverage
npm test -- --coverage
```

### Manual Testing

1. **Local Development:**
   ```bash
   npm start
   ```

2. **Open DevTools Console:**
   ```javascript
   // Ver dataLayer
   console.table(window.dataLayer);
   
   // Ver último evento
   window.dataLayer[window.dataLayer.length - 1];
   ```

3. **GTM Preview:**
   - Activar Preview en GTM
   - Navegar por la app
   - Verificar eventos en panel

4. **GA4 DebugView:**
   - Configurar > DebugView
   - Ver eventos en tiempo real

---

## 🐛 TROUBLESHOOTING

### Problema: Eventos no se disparan

**Diagnóstico:**
```javascript
// En consola del navegador
console.log('dataLayer:', window.dataLayer);
console.log('GTM loaded:', typeof window.google_tag_manager !== 'undefined');
```

**Soluciones:**
1. Verificar que GTM esté cargado
2. Revisar que el evento esté en el union type
3. Confirmar que la directiva esté importada
4. Ver errores en consola

### Problema: Parámetros undefined en GA4

**Diagnóstico:**
```javascript
// Ver último evento con parámetros
const lastEvent = window.dataLayer[window.dataLayer.length - 1];
console.log('Event:', lastEvent.event);
console.log('Params:', lastEvent);
```

**Soluciones:**
1. Verificar que variables DLV existan en GTM
2. Confirmar nombres exactos de parámetros
3. Revisar que se envíen desde el código

### Problema: PII en eventos

**Diagnóstico:**
```bash
# Ejecutar tests
npm test -- analytics.service.spec.ts
```

**Soluciones:**
1. Revisar que sanitización esté activa
2. Agregar campo a PII_KEYS si es necesario
3. Verificar en Network tab

---

## 📈 MÉTRICAS Y REPORTES

### Dashboards Recomendados en GA4

1. **Embudo de Conversión**
   - view_regalos_corporativos → click_solicitar_propuesta → form_submit_propuesta

2. **Análisis de Placements**
   - Dimensión: placement
   - Métrica: Eventos

3. **Efectividad de CTAs**
   - Dimensión: cta_label
   - Métrica: Clicks

4. **Tasa de Abandono de Formulario**
   - form_start_propuesta vs form_submit_propuesta

---

## 🔄 MANTENIMIENTO

### Semanal
- [ ] Revisar GA4 para errores
- [ ] Verificar que conversiones se registren
- [ ] Monitorear tasa de abandono

### Mensual
- [ ] Ejecutar tests completos
- [ ] Revisar nuevos eventos necesarios
- [ ] Actualizar documentación
- [ ] Optimizar eventos poco usados

### Trimestral
- [ ] Audit completo de analytics
- [ ] Revisar cumplimiento de privacidad
- [ ] Actualizar GTM container
- [ ] Capacitar equipo en nuevos eventos

---

## 📚 RECURSOS

- [Guía GTM + GA4](./ANALYTICS_GTM_GA4_SETUP.md)
- [Ejemplos de Código](./src/app/core/services/analytics-examples.ts)
- [Tests](./src/app/core/services/analytics.service.spec.ts)
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GTM Documentation](https://support.google.com/tagmanager)

---

## 👥 EQUIPO

**Responsables:**
- Analytics Lead: [Nombre]
- Developer: [Nombre]
- QA: [Nombre]

**Contacto:**
- Slack: #analytics
- Email: analytics@sumakgourmet.co

---

## 📝 CHANGELOG

### v1.0.0 (2024-02-07)
- ✅ Implementación inicial
- ✅ 10 eventos core
- ✅ Sanitización PII
- ✅ Tests unitarios
- ✅ Documentación completa
- ✅ GTM + GA4 configurado

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] AnalyticsService creado
- [x] Route tracking provider
- [x] TrackEvent directive
- [x] Tests unitarios
- [x] Sanitización PII
- [x] GTM configurado
- [x] GA4 configurado
- [x] Conversiones marcadas
- [x] Documentación completa
- [ ] Prerender/SSR (opcional)
- [ ] Consent mode (si aplica)

---

**Última actualización:** 2024-02-07
**Versión:** 1.0.0
**Status:** ✅ Production Ready
