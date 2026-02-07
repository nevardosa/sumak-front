# 📊 GUÍA DE CONFIGURACIÓN GOOGLE TAG MANAGER + GA4

## 🎯 OBJETIVO
Configurar GTM para capturar eventos de dataLayer y enviarlos a GA4, midiendo intención comercial real de Sumak Gourmet.

---

## 📋 PREREQUISITOS
- ✅ GTM instalado en index.html (GTM-P8S8S9TH)
- ✅ Cuenta GA4 creada
- ✅ AnalyticsService implementado en Angular

---

## 🔧 CONFIGURACIÓN EN GOOGLE TAG MANAGER

### PASO 1: Crear Variables de DataLayer

En GTM > Variables > Nueva:

1. **DLV - page_path**
   - Tipo: Variable de capa de datos
   - Nombre: `page_path`

2. **DLV - page_title**
   - Tipo: Variable de capa de datos
   - Nombre: `page_title`

3. **DLV - placement**
   - Tipo: Variable de capa de datos
   - Nombre: `placement`

4. **DLV - cta_label**
   - Tipo: Variable de capa de datos
   - Nombre: `cta_label`

5. **DLV - form_id**
   - Tipo: Variable de capa de datos
   - Nombre: `form_id`

---

### PASO 2: Crear Triggers (Activadores)

#### Trigger 1: Page View (SPA)
- Nombre: `CE - page_view`
- Tipo: Evento personalizado
- Nombre del evento: `page_view`
- Se activa en: Todos los eventos personalizados

#### Trigger 2: Click WhatsApp
- Nombre: `CE - click_whatsapp`
- Tipo: Evento personalizado
- Nombre del evento: `click_whatsapp`

#### Trigger 3: Click Email
- Nombre: `CE - click_email`
- Tipo: Evento personalizado
- Nombre del evento: `click_email`

#### Trigger 4: Click Solicitar Propuesta
- Nombre: `CE - click_solicitar_propuesta`
- Tipo: Evento personalizado
- Nombre del evento: `click_solicitar_propuesta`

#### Trigger 5: Form Start Propuesta
- Nombre: `CE - form_start_propuesta`
- Tipo: Evento personalizado
- Nombre del evento: `form_start_propuesta`

#### Trigger 6: Form Submit Propuesta
- Nombre: `CE - form_submit_propuesta`
- Tipo: Evento personalizado
- Nombre del evento: `form_submit_propuesta`

#### Trigger 7: View Regalos Corporativos
- Nombre: `CE - view_regalos_corporativos`
- Tipo: Evento personalizado
- Nombre del evento: `view_regalos_corporativos`

#### Trigger 8: View Contacto
- Nombre: `CE - view_contacto`
- Tipo: Evento personalizado
- Nombre del evento: `view_contacto`

---

### PASO 3: Crear Tags GA4

#### Tag 1: GA4 Configuration (Base)
- Nombre: `GA4 - Configuration`
- Tipo: Configuración de Google Analytics: GA4
- ID de medición: `G-XXXXXXXXXX` (tu Measurement ID)
- Activación: All Pages

**Configuración avanzada:**
- Campos que se deben establecer:
  - `page_path`: `{{DLV - page_path}}`
  - `page_title`: `{{DLV - page_title}}`

#### Tag 2: GA4 Event - Page View
- Nombre: `GA4 - Event - page_view`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `page_view`
- Parámetros del evento:
  - `page_path`: `{{DLV - page_path}}`
  - `page_title`: `{{DLV - page_title}}`
- Activación: `CE - page_view`

#### Tag 3: GA4 Event - Click WhatsApp
- Nombre: `GA4 - Event - click_whatsapp`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `click_whatsapp`
- Parámetros del evento:
  - `placement`: `{{DLV - placement}}`
  - `cta_label`: `{{DLV - cta_label}}`
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - click_whatsapp`

#### Tag 4: GA4 Event - Click Email
- Nombre: `GA4 - Event - click_email`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `click_email`
- Parámetros del evento:
  - `placement`: `{{DLV - placement}}`
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - click_email`

#### Tag 5: GA4 Event - Click Solicitar Propuesta
- Nombre: `GA4 - Event - click_solicitar_propuesta`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `click_solicitar_propuesta`
- Parámetros del evento:
  - `placement`: `{{DLV - placement}}`
  - `cta_label`: `{{DLV - cta_label}}`
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - click_solicitar_propuesta`

#### Tag 6: GA4 Event - Form Start Propuesta
- Nombre: `GA4 - Event - form_start_propuesta`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `form_start_propuesta`
- Parámetros del evento:
  - `form_id`: `{{DLV - form_id}}`
  - `placement`: `{{DLV - placement}}`
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - form_start_propuesta`

#### Tag 7: GA4 Event - Form Submit Propuesta
- Nombre: `GA4 - Event - form_submit_propuesta`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `form_submit_propuesta`
- Parámetros del evento:
  - `form_id`: `{{DLV - form_id}}`
  - `placement`: `{{DLV - placement}}`
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - form_submit_propuesta`

#### Tag 8: GA4 Event - View Regalos Corporativos
- Nombre: `GA4 - Event - view_regalos_corporativos`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `view_regalos_corporativos`
- Parámetros del evento:
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - view_regalos_corporativos`

#### Tag 9: GA4 Event - View Contacto
- Nombre: `GA4 - Event - view_contacto`
- Tipo: Evento de Google Analytics: GA4
- Etiqueta de configuración: `GA4 - Configuration`
- Nombre del evento: `view_contacto`
- Parámetros del evento:
  - `page_path`: `{{DLV - page_path}}`
- Activación: `CE - view_contacto`

---

## 🧪 TESTING Y VALIDACIÓN

### 1. GTM Preview Mode

1. En GTM, click en **Vista previa**
2. Ingresa la URL: `http://localhost:4200` (o tu URL de desarrollo)
3. Navega por la aplicación y verifica:
   - ✅ Eventos aparecen en el panel de GTM Preview
   - ✅ Variables se populan correctamente
   - ✅ Tags se disparan en el momento correcto

### 2. GA4 DebugView

1. En GA4, ve a **Configurar > DebugView**
2. Con GTM Preview activo, navega por la app
3. Verifica en tiempo real:
   - ✅ Eventos llegan a GA4
   - ✅ Parámetros se capturan correctamente
   - ✅ No hay errores

### 3. Network Tab Validation

1. Abre DevTools > Network
2. Filtra por `google-analytics.com`
3. Verifica:
   - ✅ Requests a `https://www.google-analytics.com/g/collect`
   - ✅ Status 204 (success)
   - ✅ Payload contiene event name y parameters

### 4. DataLayer Console Check

En la consola del navegador:

```javascript
// Ver todos los eventos en dataLayer
console.table(window.dataLayer);

// Ver último evento
console.log(window.dataLayer[window.dataLayer.length - 1]);
```

---

## 🎯 CONFIGURAR CONVERSIONES (KEY EVENTS) EN GA4

### Eventos Clave para Marcar como Conversiones:

1. **click_solicitar_propuesta** (Alta intención)
   - GA4 > Configurar > Eventos
   - Busca `click_solicitar_propuesta`
   - Toggle "Marcar como conversión"

2. **form_submit_propuesta** (Conversión real)
   - GA4 > Configurar > Eventos
   - Busca `form_submit_propuesta`
   - Toggle "Marcar como conversión"

3. **click_whatsapp** (Intención media-alta)
   - GA4 > Configurar > Eventos
   - Busca `click_whatsapp`
   - Toggle "Marcar como conversión"

---

## 📊 REPORTES RECOMENDADOS EN GA4

### 1. Embudo de Conversión

Crear exploración personalizada:
1. view_regalos_corporativos
2. click_solicitar_propuesta
3. form_start_propuesta
4. form_submit_propuesta

### 2. Análisis de Placements

Dimensión personalizada: `placement`
Métrica: Eventos por placement

### 3. Análisis de CTAs

Dimensión personalizada: `cta_label`
Métrica: Clicks por CTA

---

## ⚠️ TROUBLESHOOTING

### Problema: Eventos no llegan a GA4

**Solución:**
1. Verifica que GTM esté publicado (no solo en Preview)
2. Confirma Measurement ID correcto en GA4 Configuration tag
3. Revisa que triggers estén configurados correctamente
4. Usa DebugView para ver errores en tiempo real

### Problema: Parámetros undefined

**Solución:**
1. Verifica que variables DLV estén creadas con nombres exactos
2. Confirma que AnalyticsService envía los parámetros
3. Revisa dataLayer en consola: `window.dataLayer`

### Problema: Doble conteo de page_view

**Solución:**
1. Desactiva "Enhanced Measurement" en GA4 para page_views
2. O elimina el tag GA4 page_view y deja solo el automático

### Problema: PII en eventos

**Solución:**
1. Revisa AnalyticsService sanitization
2. Ejecuta tests: `npm test -- analytics.service.spec.ts`
3. Verifica en Network tab que no se envíe PII

---

## ✅ CHECKLIST FINAL

- [ ] GTM container publicado
- [ ] GA4 Measurement ID configurado
- [ ] 5 variables DLV creadas
- [ ] 8 triggers creados
- [ ] 9 tags GA4 creados
- [ ] Preview mode testeado
- [ ] DebugView validado
- [ ] Network requests 204 OK
- [ ] Conversiones marcadas en GA4
- [ ] No se envía PII
- [ ] Tests unitarios pasando

---

## 📈 MÉTRICAS CLAVE A MONITOREAR

1. **Tasa de conversión**: form_submit_propuesta / view_regalos_corporativos
2. **Engagement por placement**: Eventos por ubicación
3. **Efectividad de CTAs**: Clicks por cta_label
4. **Abandono de formulario**: form_start vs form_submit
5. **Canal preferido**: click_whatsapp vs click_email

---

## 🔐 PRIVACIDAD Y CUMPLIMIENTO

- ✅ No se envía PII (email, phone, name, message)
- ✅ Sanitización automática en AnalyticsService
- ✅ Consent mode implementado (setConsent method)
- ✅ Tests de sanitización incluidos
- ✅ Cumple GDPR/CCPA best practices

---

## 📞 SOPORTE

Si necesitas ayuda:
1. Revisa esta guía completa
2. Ejecuta tests: `npm test`
3. Verifica consola del navegador
4. Usa GTM Preview + GA4 DebugView
