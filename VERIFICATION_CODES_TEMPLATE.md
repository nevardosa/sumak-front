# 🔐 CÓDIGOS DE VERIFICACIÓN
## Sumak Gourmet - Plantillas

---

## GOOGLE SEARCH CONSOLE

### Opción 1: Meta Tag HTML
```html
<!-- Agregar en src/index.html después de <head> -->
<head>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="[REEMPLAZAR_CON_TU_CÓDIGO]" />
```

### Opción 2: Registro DNS TXT
```
Tipo: TXT
Nombre: @ (o dejar vacío)
Valor: google-site-verification=[REEMPLAZAR_CON_TU_CÓDIGO]
TTL: 3600
```

**Dónde obtener el código:**
1. https://search.google.com/search-console
2. Agregar propiedad
3. Copiar código proporcionado

---

## BING WEBMASTER TOOLS

### Meta Tag HTML
```html
<!-- Agregar en src/index.html después de GSC -->
<head>
  <!-- Bing Webmaster Verification -->
  <meta name="msvalidate.01" content="[REEMPLAZAR_CON_TU_CÓDIGO]" />
```

**Dónde obtener el código:**
1. https://www.bing.com/webmasters
2. Agregar sitio
3. Copiar código proporcionado

---

## EJEMPLO COMPLETO index.html

```html
<!doctype html>
<html lang="es">
<head>
  <!-- Verificaciones de Webmaster Tools -->
  <meta name="google-site-verification" content="ABC123XYZ456..." />
  <meta name="msvalidate.01" content="DEF789UVW012..." />
  
  <!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  ...
```

---

## INSTRUCCIONES DE IMPLEMENTACIÓN

### Si usas Meta Tag:

1. Obtener código de GSC/Bing
2. Copiar código completo
3. Abrir `src/index.html`
4. Pegar después de `<head>`
5. Guardar archivo
6. Deploy a producción
7. Volver a GSC/Bing
8. Click "Verificar"

### Si usas DNS:

1. Obtener código TXT de GSC
2. Ir a panel de tu proveedor de dominio
3. Agregar registro TXT
4. Esperar 5-30 minutos (propagación)
5. Verificar propagación: https://dnschecker.org
6. Volver a GSC
7. Click "Verificar"

---

## VERIFICAR IMPLEMENTACIÓN

### Método 1: Ver código fuente
```
1. Ir a: https://sumakgourmet.co
2. Click derecho > "Ver código fuente"
3. Buscar: google-site-verification
4. Verificar que el código esté presente
```

### Método 2: Consola del navegador
```
1. F12 para abrir DevTools
2. Ir a "Elements" o "Inspector"
3. Buscar en <head>
4. Verificar meta tags
```

---

## TROUBLESHOOTING

### "No se pudo verificar"
- Esperar 24-48h
- Verificar que código esté en producción
- Limpiar caché del navegador
- Intentar método alternativo

### "DNS no propagado"
- Esperar más tiempo (hasta 48h)
- Verificar en https://dnschecker.org
- Contactar proveedor de dominio

### "Código no encontrado"
- Verificar deploy exitoso
- Revisar que no haya errores de sintaxis
- Verificar que esté en <head>, no en <body>

---

**Última actualización:** 2025-01-15
**Soporte:** Revisar PHASE_1_EXECUTION_GUIDE.md
