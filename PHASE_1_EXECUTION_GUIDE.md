# 🚀 FASE 1: REGISTRO Y VALIDACIÓN - GUÍA DE EJECUCIÓN
## Sumak Gourmet - Implementación Inmediata

**Tiempo Total:** 2-3 horas
**Prioridad:** CRÍTICA
**Requisitos:** Acceso a email suumak25@gmail.com

---

## ✅ TAREA 1: GOOGLE SEARCH CONSOLE (30 minutos)

### Paso 1: Acceso y Registro (5 min)
```
1. Abrir navegador en modo incógnito
2. Ir a: https://search.google.com/search-console
3. Iniciar sesión con: suumak25@gmail.com
4. Click en "Agregar propiedad"
```

### Paso 2: Seleccionar Tipo de Propiedad (2 min)
```
Opción: PROPIEDAD DE DOMINIO (Recomendado)
Dominio: sumakgourmet.co

✅ Ventaja: Incluye www, http, https automáticamente
```

### Paso 3: Verificación DNS (15 min)

**Opción A: Verificación DNS (Recomendada)**
```
1. Google mostrará un código TXT como:
   google-site-verification=ABC123XYZ456...

2. Ir al panel de tu proveedor de dominio
3. Agregar registro DNS:
   - Tipo: TXT
   - Nombre: @ (o dejar vacío)
   - Valor: [código de Google]
   - TTL: 3600

4. Guardar cambios
5. Esperar 5-15 minutos (propagación DNS)
6. Volver a GSC y click "Verificar"
```

**Opción B: Meta Tag HTML (Alternativa - 5 min)**

Si no tienes acceso al DNS, usa esta opción:

1. Google te dará un meta tag como:
```html
<meta name="google-site-verification" content="ABC123XYZ456..." />
```

2. Agregar a `src/index.html` después de `<head>`:
```html
<head>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="[TU_CÓDIGO_AQUÍ]" />
  
  <!-- Meta Pixel Code -->
  <script>
  ...
```

3. Deploy a producción
4. Volver a GSC y click "Verificar"

### Paso 4: Configuración Inicial (8 min)

**4.1 Enviar Sitemap**
```
1. En GSC, ir a "Sitemaps" (menú izquierdo)
2. Agregar nueva URL de sitemap:
   https://sumakgourmet.co/sitemap.xml
3. Click "Enviar"
4. Verificar estado: "Correcto" (puede tardar 24h)
```

**4.2 Configurar País de Destino**
```
1. Ir a "Configuración" > "Configuración del sitio"
2. Seleccionar: Colombia
3. Guardar
```

**4.3 Activar Notificaciones**
```
1. Ir a "Configuración" > "Preferencias de notificaciones"
2. Activar:
   ✅ Problemas de cobertura
   ✅ Errores de datos estructurados
   ✅ Problemas de seguridad
   ✅ Acciones manuales
3. Guardar
```

### ✅ VERIFICACIÓN TAREA 1
```
□ Propiedad verificada (check verde en GSC)
□ Sitemap enviado
□ País configurado: Colombia
□ Notificaciones activadas
□ Captura de pantalla guardada
```

---

## ✅ TAREA 2: GOOGLE MY BUSINESS (1 hora)

### Paso 1: Crear Perfil (10 min)
```
1. Ir a: https://business.google.com
2. Iniciar sesión con: suumak25@gmail.com
3. Click "Administrar ahora"
4. Click "Agregar empresa"
```

### Paso 2: Información Básica (10 min)

**Nombre del Negocio:**
```
Sumak Gourmet
```

**Categoría Principal:**
```
Tienda de regalos gourmet
```

**Categorías Adicionales:**
```
- Servicio de catering
- Tienda de chocolate
- Servicio de regalos corporativos
```

**Ubicación:**
```
¿Tienes ubicación física?: SÍ

Dirección: [Tu dirección exacta en Bogotá]
Ciudad: Bogotá
Departamento: Cundinamarca
Código postal: 110111
País: Colombia
```

**Área de Servicio:**
```
¿Entregas o visitas a clientes?: SÍ

Áreas de servicio:
- Bogotá (todas las localidades)
- Cundinamarca
- Colombia (envíos nacionales)
```

### Paso 3: Información de Contacto (5 min)

**Teléfono:**
```
+57 320 866 3691
```

**Sitio Web:**
```
URL principal: https://sumakgourmet.co
```

**Horarios:**
```
Lunes:     09:00 - 18:00
Martes:    09:00 - 18:00
Miércoles: 09:00 - 18:00
Jueves:    09:00 - 18:00
Viernes:   09:00 - 18:00
Sábado:    10:00 - 14:00
Domingo:   Cerrado
```

### Paso 4: Descripción del Negocio (10 min)

**Descripción Corta (250 caracteres):**
```
Rituales gastronómicos premium con curaduría experta. Regalos corporativos y experiencias gourmet únicas en Colombia. Entrega rápida en Bogotá, envíos nacionales.
```

**Descripción Completa (750 caracteres):**
```
Sumak Gourmet diseña rituales gastronómicos premium que convierten un regalo en una experiencia memorable. No vendemos cajas genéricas, creamos experiencias curadas con chocolate 70% cacao, frutos secos seleccionados y mieles infusionadas de alta calidad.

Especializados en:
• Regalos corporativos premium
• Experiencias gourmet personalizadas
• Rituales para ocasiones especiales
• Detalles empresariales de alto impacto

Entrega rápida en Bogotá (menos de 24h) y envíos seguros a toda Colombia. Presentación premium incluida, lista para regalar sin preocupaciones.

Producción limitada para preservar la calidad y el detalle en cada ritual.
```

### Paso 5: Atributos (5 min)

**Seleccionar todos los aplicables:**
```
✅ Entrega a domicilio
✅ Entrega el mismo día
✅ Pedidos en línea
✅ Apto para regalos
✅ Productos de alta gama
✅ Servicio personalizado
✅ Acepta tarjetas de crédito
✅ Acepta pagos móviles
```

### Paso 6: Fotos (15 min)

**CRÍTICO: Necesitas mínimo 10 fotos profesionales**

**Logo (1 foto):**
```
- Formato: PNG transparente
- Tamaño: 720x720px mínimo
- Archivo: logo.png
```

**Portada (1 foto):**
```
- Formato: JPG
- Tamaño: 1024x576px
- Contenido: Productos premium en ambiente elegante
```

**Productos (8-10 fotos):**
```
- Sol Caribeño
- Zipa Real
- Pasión Andina
- Otros rituales
- Detalles de empaque
- Presentación premium
```

**Cómo subir:**
```
1. En GMB, ir a "Fotos"
2. Click "Agregar fotos"
3. Seleccionar categoría (Logo, Portada, Productos)
4. Subir imágenes
5. Agregar descripción a cada foto
```

### Paso 7: Preguntas y Respuestas (5 min)

**Crear 5 Q&A iniciales:**

```
P: ¿Hacen entregas el mismo día en Bogotá?
R: Sí, entregas en menos de 24h en Bogotá para pedidos antes de las 2pm.

P: ¿Envían a otras ciudades de Colombia?
R: Sí, envíos seguros a toda Colombia con descuento de $25,000.

P: ¿Los rituales vienen listos para regalar?
R: Sí, presentación premium incluida, no necesitas envolver.

P: ¿Hacen personalizaciones para empresas?
R: Sí, ofrecemos propuestas corporativas personalizadas.

P: ¿Cuál es el tiempo de entrega nacional?
R: 2-4 días hábiles según la ciudad de destino.
```

### Paso 8: Verificación (Variable)

**Métodos disponibles:**

**Opción 1: Correo Postal (5-14 días)**
```
1. Google enviará postal con código
2. Esperar llegada
3. Ingresar código en GMB
4. Perfil verificado
```

**Opción 2: Teléfono (Inmediato)**
```
1. Google llama o envía SMS
2. Proporcionar código
3. Verificación inmediata
```

**Opción 3: Email (Si GSC verificado)**
```
1. Recibir email con link
2. Click para verificar
3. Verificación inmediata
```

### ✅ VERIFICACIÓN TAREA 2
```
□ Perfil GMB creado
□ Información completa (100%)
□ 10+ fotos subidas
□ 5 Q&A creadas
□ Verificación solicitada
□ Captura de pantalla guardada
```

---

## ✅ TAREA 3: VALIDACIÓN DE SCHEMAS (30 minutos)

### Paso 1: Rich Results Test (15 min)

**Probar cada página:**

**Home:**
```
1. Ir a: https://search.google.com/test/rich-results
2. Ingresar URL: https://sumakgourmet.co/
3. Click "Probar URL"
4. Verificar schemas detectados:
   ✅ Organization
   ✅ WebSite
   ✅ LocalBusiness
   ✅ Breadcrumb
   ✅ Speakable
   ✅ HowTo
5. Captura de pantalla si todo está verde
```

**Catalog:**
```
1. URL: https://sumakgourmet.co/catalog
2. Verificar:
   ✅ Breadcrumb
   ✅ Product (al abrir modal)
3. Captura de pantalla
```

**FAQ:**
```
1. URL: https://sumakgourmet.co/faq
2. Verificar:
   ✅ FAQPage
   ✅ Breadcrumb
3. Captura de pantalla
```

### Paso 2: Mobile-Friendly Test (5 min)
```
1. Ir a: https://search.google.com/test/mobile-friendly
2. Probar: https://sumakgourmet.co/
3. Verificar: "La página es compatible con dispositivos móviles"
4. Captura de pantalla
```

### Paso 3: PageSpeed Insights (10 min)
```
1. Ir a: https://pagespeed.web.dev/
2. Analizar: https://sumakgourmet.co/
3. Documentar scores:
   - Móvil: __/100
   - Desktop: __/100
   - LCP: __s
   - FID: __ms
   - CLS: __
4. Captura de pantalla
```

### ✅ VERIFICACIÓN TAREA 3
```
□ Home schemas validados (6 schemas)
□ Catalog schemas validados
□ FAQ schemas validados
□ Mobile-friendly: PASS
□ PageSpeed baseline documentado
□ 5 capturas de pantalla guardadas
```

---

## ✅ TAREA 4: BING WEBMASTER TOOLS (20 minutos) - OPCIONAL

### Paso 1: Registro (5 min)
```
1. Ir a: https://www.bing.com/webmasters
2. Iniciar sesión con: suumak25@gmail.com
3. Click "Agregar sitio"
```

### Paso 2: Importar desde GSC (10 min)
```
1. Seleccionar: "Importar desde Google Search Console"
2. Autorizar acceso
3. Seleccionar: sumakgourmet.co
4. Importar configuración
5. Confirmar
```

### Paso 3: Enviar Sitemap (5 min)
```
1. Ir a "Sitemaps"
2. Agregar: https://sumakgourmet.co/sitemap.xml
3. Enviar
```

### ✅ VERIFICACIÓN TAREA 4
```
□ Sitio agregado en Bing
□ Configuración importada desde GSC
□ Sitemap enviado
□ Captura de pantalla guardada
```

---

## 📊 RESULTADOS ESPERADOS FASE 1

### Inmediato (Hoy)
- ✅ GSC activo y monitoreando
- ✅ GMB perfil creado (pendiente verificación)
- ✅ Schemas validados sin errores
- ✅ Baseline de performance documentado

### 24-48 horas
- ✅ Sitemap procesado por Google
- ✅ Primeras páginas indexadas
- ✅ Schemas apareciendo en GSC
- ✅ GMB visible en Maps (si verificado)

### 7 días
- ✅ 50+ páginas indexadas
- ✅ Rich snippets activos
- ✅ GMB verificado y activo
- ✅ Primeras impresiones en búsquedas

---

## 📋 CHECKLIST FINAL FASE 1

### Google Search Console
- [ ] Propiedad verificada
- [ ] Sitemap enviado
- [ ] País: Colombia
- [ ] Notificaciones activadas
- [ ] Captura guardada

### Google My Business
- [ ] Perfil creado
- [ ] Info completa (100%)
- [ ] 10+ fotos subidas
- [ ] 5 Q&A creadas
- [ ] Verificación solicitada
- [ ] Captura guardada

### Validación Schemas
- [ ] Home validado (6 schemas)
- [ ] Catalog validado
- [ ] FAQ validado
- [ ] Mobile-friendly: PASS
- [ ] PageSpeed documentado
- [ ] 5 capturas guardadas

### Bing (Opcional)
- [ ] Sitio agregado
- [ ] Config importada
- [ ] Sitemap enviado
- [ ] Captura guardada

---

## 🎯 PRÓXIMA ACCIÓN

**Después de completar Fase 1:**

1. Esperar 24h para que Google procese
2. Revisar GSC para errores
3. Comenzar Fase 2: Optimización de Imágenes
4. Solicitar primeras reviews en GMB

---

## 📞 SOPORTE

**Si encuentras problemas:**

1. **GSC no verifica:**
   - Verificar DNS propagado: https://dnschecker.org
   - Intentar método alternativo (meta tag)
   - Esperar 24h y reintentar

2. **GMB no acepta dirección:**
   - Usar dirección exacta con número
   - Verificar en Google Maps primero
   - Contactar soporte GMB

3. **Schemas con errores:**
   - Revisar consola del navegador
   - Validar JSON-LD syntax
   - Verificar que código esté en producción

---

**Tiempo total:** 2-3 horas
**Dificultad:** Baja-Media
**Impacto:** CRÍTICO para SEO

¡Éxito con la implementación! 🚀
