# 🔍 GUÍA: CONFIGURACIÓN GOOGLE SEARCH CONSOLE
## Sumak Gourmet - Paso a Paso

---

## 📋 REQUISITOS PREVIOS

- Acceso a cuenta Google (suumak25@gmail.com)
- Acceso al hosting/servidor del sitio
- Permisos de administrador del dominio

---

## 🚀 PASO 1: REGISTRO Y VERIFICACIÓN

### 1.1 Acceder a Search Console
1. Ir a: https://search.google.com/search-console
2. Iniciar sesión con cuenta Google
3. Click en "Agregar propiedad"

### 1.2 Seleccionar Tipo de Propiedad
**Opción Recomendada:** Propiedad de dominio
- Dominio: `sumakgourmet.co`
- Ventaja: Incluye www, http, https automáticamente

### 1.3 Verificación DNS (Recomendado)
1. Google proporcionará un registro TXT
2. Agregar al DNS del dominio:
   ```
   Tipo: TXT
   Nombre: @
   Valor: google-site-verification=XXXXXX
   TTL: 3600
   ```
3. Esperar propagación (5-30 minutos)
4. Click en "Verificar"

### 1.4 Verificación Alternativa (HTML Tag)
Si no tienes acceso al DNS:
1. Copiar meta tag de verificación
2. Agregar a `src/index.html` después de `<head>`:
   ```html
   <meta name="google-site-verification" content="XXXXXX" />
   ```
3. Deploy a producción
4. Click en "Verificar"

---

## 📊 PASO 2: CONFIGURACIÓN INICIAL

### 2.1 Enviar Sitemap
1. En Search Console, ir a "Sitemaps"
2. Agregar nueva URL de sitemap:
   ```
   https://sumakgourmet.co/sitemap.xml
   ```
3. Click en "Enviar"
4. Verificar estado: "Correcto"

### 2.2 Configurar Usuarios
1. Ir a "Configuración" > "Usuarios y permisos"
2. Agregar usuarios adicionales:
   - Propietario: suumak25@gmail.com
   - Administrador: [email del equipo]

### 2.3 Configurar Ubicación Geográfica
1. Ir a "Configuración" > "Configuración del sitio"
2. Seleccionar país de destino: **Colombia**

---

## 🔔 PASO 3: CONFIGURAR ALERTAS

### 3.1 Alertas de Email
1. Ir a "Configuración" > "Preferencias de notificaciones"
2. Activar:
   - ✅ Problemas de cobertura
   - ✅ Errores de datos estructurados
   - ✅ Problemas de seguridad
   - ✅ Acciones manuales

### 3.2 Alertas Críticas
Configurar notificaciones para:
- Errores de rastreo
- Problemas de indexación
- Penalizaciones manuales
- Problemas de seguridad

---

## 📈 PASO 4: VALIDAR IMPLEMENTACIONES

### 4.1 Validar Schemas
1. Ir a "Mejoras" > "Datos estructurados"
2. Verificar schemas detectados:
   - Organization
   - LocalBusiness
   - Product
   - FAQPage
   - WebSite
   - Breadcrumb

### 4.2 Probar Rich Results
1. Usar herramienta: https://search.google.com/test/rich-results
2. Probar URLs:
   - https://sumakgourmet.co/ (Home)
   - https://sumakgourmet.co/catalog (Products)
   - https://sumakgourmet.co/faq (FAQ)

### 4.3 Validar Mobile-Friendly
1. Usar: https://search.google.com/test/mobile-friendly
2. Probar todas las páginas principales
3. Corregir errores si existen

---

## 🎯 PASO 5: SOLICITAR INDEXACIÓN

### 5.1 Indexar Páginas Principales
1. Ir a "Inspección de URLs"
2. Ingresar URL y presionar Enter
3. Si no está indexada, click en "Solicitar indexación"

**URLs Prioritarias:**
```
https://sumakgourmet.co/
https://sumakgourmet.co/catalog
https://sumakgourmet.co/regalos-corporativos
https://sumakgourmet.co/faq
https://sumakgourmet.co/about
https://sumakgourmet.co/contact
```

### 5.2 Monitorear Indexación
1. Ir a "Cobertura" > "Válidas"
2. Verificar que páginas se indexen en 24-48h
3. Revisar errores en "Excluidas"

---

## 📊 PASO 6: CONFIGURAR INFORMES

### 6.1 Rendimiento
Monitorear métricas:
- **Clics totales**
- **Impresiones**
- **CTR promedio**
- **Posición promedio**

### 6.2 Consultas Principales
Identificar keywords que generan tráfico:
- "regalos corporativos"
- "rituales gastronómicos"
- "experiencias gourmet"

### 6.3 Páginas Principales
Ver qué páginas reciben más tráfico orgánico

---

## 🔍 PASO 7: INTEGRAR CON ANALYTICS

### 7.1 Vincular Google Analytics
1. En Search Console, ir a "Configuración"
2. Click en "Asociaciones"
3. Vincular con propiedad GA4

### 7.2 Beneficios de Integración
- Datos de búsqueda en GA4
- Análisis completo de tráfico
- Mejor comprensión del comportamiento

---

## 🛠️ PASO 8: HERRAMIENTAS ADICIONALES

### 8.1 Inspección de URLs
Usar para:
- Verificar indexación de páginas nuevas
- Diagnosticar problemas de rastreo
- Ver cómo Google ve la página

### 8.2 Prueba de Robots.txt
1. Ir a "Herramientas antiguas" > "Probador de robots.txt"
2. Verificar que robots.txt funcione correctamente
3. Probar URLs específicas

### 8.3 Eliminación de URLs
Si necesitas eliminar contenido:
1. Ir a "Eliminaciones"
2. Solicitar eliminación temporal
3. Usar para contenido duplicado o antiguo

---

## 📋 CHECKLIST DE VERIFICACIÓN

### Configuración Básica
- [ ] Propiedad verificada
- [ ] Sitemap enviado
- [ ] Usuarios configurados
- [ ] País de destino: Colombia
- [ ] Alertas activadas

### Validaciones Técnicas
- [ ] Schemas validados
- [ ] Rich Results funcionando
- [ ] Mobile-friendly confirmado
- [ ] Core Web Vitals en verde
- [ ] Sin errores de rastreo

### Indexación
- [ ] Home indexada
- [ ] Catalog indexado
- [ ] Corporate gifts indexado
- [ ] FAQ indexado
- [ ] About indexado
- [ ] Contact indexado

### Monitoreo
- [ ] Analytics vinculado
- [ ] Informes configurados
- [ ] Keywords monitoreadas
- [ ] Alertas funcionando

---

## 📊 MÉTRICAS A MONITOREAR

### Diarias
- Errores de rastreo
- Problemas de indexación
- Alertas de seguridad

### Semanales
- Clics y CTR
- Posiciones promedio
- Nuevas keywords
- Páginas indexadas

### Mensuales
- Tendencias de tráfico
- Mejoras en rankings
- Core Web Vitals
- Backlinks nuevos

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: Sitemap no se procesa
**Solución:**
- Verificar formato XML correcto
- Comprobar que sitemap.xml sea accesible
- Revisar robots.txt no bloquee sitemap

### Problema 2: Páginas no se indexan
**Solución:**
- Verificar robots.txt permite rastreo
- Comprobar que no haya noindex
- Solicitar indexación manual
- Verificar calidad del contenido

### Problema 3: Errores de datos estructurados
**Solución:**
- Usar Rich Results Test
- Corregir errores en schemas
- Validar JSON-LD syntax
- Re-solicitar indexación

### Problema 4: Core Web Vitals en rojo
**Solución:**
- Optimizar imágenes
- Reducir JavaScript
- Implementar lazy loading
- Usar CDN

---

## 🎯 OBJETIVOS PRIMEROS 30 DÍAS

### Semana 1
- ✅ Verificación completada
- ✅ Sitemap enviado
- ✅ Páginas principales indexadas
- ✅ Schemas validados

### Semana 2
- [ ] 50+ páginas indexadas
- [ ] 0 errores críticos
- [ ] Rich snippets apareciendo
- [ ] Primeras keywords rankeando

### Semana 3
- [ ] 100+ impresiones diarias
- [ ] CTR >2%
- [ ] Top 50 keywords principales
- [ ] Featured snippets (FAQ)

### Semana 4
- [ ] 500+ impresiones diarias
- [ ] 10+ clics diarios
- [ ] Top 20 keywords principales
- [ ] Local pack visibility

---

## 📞 SOPORTE Y RECURSOS

### Documentación Oficial
- [Search Console Help](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Structured Data Guide](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)

### Herramientas Útiles
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/

### Comunidad
- Google Search Central Community
- Stack Overflow (tag: google-search-console)
- Reddit: r/SEO

---

**Última actualización:** 2025-01-15
**Tiempo estimado de setup:** 30-45 minutos
**Responsable:** Equipo Sumak Gourmet
