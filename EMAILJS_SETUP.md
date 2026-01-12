# Configuración de EmailJS para Sumak

## 🚨 PROBLEMA IDENTIFICADO
Los emails no se están enviando porque la configuración de EmailJS tiene valores placeholder.

## 📧 Configuración Actual (Modo Desarrollo)
```typescript
emailjs: {
  serviceId: 'service_sumak_secure',
  templateId: 'template_order_csv',
  publicKey: 'DEVELOPMENT_MODE', // ← PLACEHOLDER - NO FUNCIONAL
  adminEmail: 'suumak25@gmail.com'
}
```

## ✅ SOLUCIÓN: Configurar EmailJS Real

### Paso 1: Crear Cuenta EmailJS
1. Visita: https://www.emailjs.com/
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar Servicio de Email
1. Ve a "Email Services" en tu dashboard
2. Haz clic en "Add New Service"
3. Selecciona "Gmail" (recomendado para suumak25@gmail.com)
4. Autoriza tu cuenta de Gmail
5. Copia el **Service ID** generado

### Paso 3: Crear Template de Email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este template:

```html
Asunto: [SUMAK] Nuevo Pedido Seguro - {{timestamp}}

Hola,

Has recibido un nuevo pedido seguro de Sumak:

📧 Email: {{to_email}}
🔐 Nivel de Seguridad: {{security_level}}
🔑 Huella de Clave: {{key_fingerprint}}
⏰ Timestamp: {{timestamp}}
🔄 Intento: {{attempt}}
🛡️ Hash de Integridad: {{integrity_hash}}

📦 DATOS ENCRIPTADOS:
{{encrypted_data}}

🔐 FIRMA DIGITAL:
{{signature}}

🔢 NONCE:
{{nonce}}

🔐 IV:
{{iv}}

Este email contiene datos encriptados con AES-GCM 256-bit.
Solo el sistema Sumak puede desencriptar esta información.

---
Sistema de Seguridad Militar Sumak
Generado automáticamente
```

4. Guarda el template y copia el **Template ID**

### Paso 4: Obtener Public Key
1. Ve a "Account" → "General"
2. Copia tu **Public Key**

### Paso 5: Actualizar Configuración
Reemplaza en `src/environments/environment.ts`:

```typescript
emailjs: {
  serviceId: 'TU_SERVICE_ID_REAL',      // Del paso 2
  templateId: 'TU_TEMPLATE_ID_REAL',    // Del paso 3
  publicKey: 'TU_PUBLIC_KEY_REAL',      // Del paso 4
  adminEmail: 'suumak25@gmail.com'
}
```

## 🔧 Configuración de Gmail (Importante)

### Para suumak25@gmail.com:
1. Habilita "Verificación en 2 pasos"
2. Genera una "Contraseña de aplicación" específica para EmailJS
3. Usa esta contraseña en la configuración de EmailJS

## 🧪 Modo de Desarrollo Actual

Mientras tanto, el sistema está en **modo desarrollo**:
- ✅ Los PDFs se generan correctamente
- ✅ Los PDFs se descargan correctamente  
- ✅ Los mensajes de WhatsApp funcionan
- ⚠️ Los emails se simulan (no se envían realmente)
- 📝 Se registra toda la actividad en consola

## 📊 Verificación de Funcionamiento

Cuando configures EmailJS correctamente, verás en la consola:
```
✅ Email enviado exitosamente
📧 Destinatario: suumak25@gmail.com
🔐 Datos encriptados enviados
```

En lugar de:
```
⚠️ EmailJS en modo desarrollo - Los emails no se enviarán realmente
📧 MODO DESARROLLO - Simulando envío de email
```

## 🛡️ Seguridad Mantenida

El sistema mantiene todos los niveles de seguridad:
- 🔐 Encriptación AES-GCM 256-bit
- 🔑 Derivación de claves PBKDF2+HKDF
- ✍️ Firmas HMAC-SHA256
- 🛡️ Validación SSL/TLS
- 📊 Auditoría de seguridad completa

## 💰 Costos EmailJS

- **Plan Gratuito**: 200 emails/mes
- **Plan Personal**: $15/mes - 1,000 emails/mes
- **Plan Business**: $50/mes - 10,000 emails/mes

Para Sumak, el plan gratuito debería ser suficiente inicialmente.