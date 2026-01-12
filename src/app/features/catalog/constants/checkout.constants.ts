import { Department, PaymentInstructions } from '../models/catalog.models';
import { environment } from '../../../../environments/environment';

export const COLOMBIA_DEPARTMENTS: Department[] = [
  { id: 'amazonas', name: 'Amazonas', municipalities: [] },
  { id: 'antioquia', name: 'Antioquia', municipalities: [] },
  { id: 'arauca', name: 'Arauca', municipalities: [] },
  { id: 'atlantico', name: 'Atlántico', municipalities: [] },
  { id: 'bogota', name: 'Bogotá D.C.', municipalities: [] },
  { id: 'bolivar', name: 'Bolívar', municipalities: [] },
  { id: 'boyaca', name: 'Boyacá', municipalities: [] },
  { id: 'caldas', name: 'Caldas', municipalities: [] },
  { id: 'caqueta', name: 'Caquetá', municipalities: [] },
  { id: 'casanare', name: 'Casanare', municipalities: [] },
  { id: 'cauca', name: 'Cauca', municipalities: [] },
  { id: 'cesar', name: 'Cesar', municipalities: [] },
  { id: 'choco', name: 'Chocó', municipalities: [] },
  { id: 'cordoba', name: 'Córdoba', municipalities: [] },
  { id: 'cundinamarca', name: 'Cundinamarca', municipalities: [] },
  { id: 'guainia', name: 'Guainía', municipalities: [] },
  { id: 'guaviare', name: 'Guaviare', municipalities: [] },
  { id: 'huila', name: 'Huila', municipalities: [] },
  { id: 'la-guajira', name: 'La Guajira', municipalities: [] },
  { id: 'magdalena', name: 'Magdalena', municipalities: [] },
  { id: 'meta', name: 'Meta', municipalities: [] },
  { id: 'narino', name: 'Nariño', municipalities: [] },
  { id: 'norte-santander', name: 'Norte de Santander', municipalities: [] },
  { id: 'putumayo', name: 'Putumayo', municipalities: [] },
  { id: 'quindio', name: 'Quindío', municipalities: [] },
  { id: 'risaralda', name: 'Risaralda', municipalities: [] },
  { id: 'san-andres', name: 'San Andrés y Providencia', municipalities: [] },
  { id: 'santander', name: 'Santander', municipalities: [] },
  { id: 'sucre', name: 'Sucre', municipalities: [] },
  { id: 'tolima', name: 'Tolima', municipalities: [] },
  { id: 'valle-del-cauca', name: 'Valle del Cauca', municipalities: [] },
  { id: 'vaupes', name: 'Vaupés', municipalities: [] },
  { id: 'vichada', name: 'Vichada', municipalities: [] }
];

export const PAYMENT_INSTRUCTIONS: PaymentInstructions = {
  breAccount: environment.payment.breAccount,
  whatsappNumber: environment.payment.whatsappNumber,
  steps: [
    {
      stepNumber: 1,
      title: 'Paga por Bre-B',
      description: `Usa la llave: ${environment.payment.breAccount}`
    },
    {
      stepNumber: 2,
      title: 'Guarda el comprobante',
      description: 'Captura o descarga el comprobante del pago aprobado.'
    },
    {
      stepNumber: 3,
      title: 'Confirma por WhatsApp',
      description: 'Abre el chat con Sumak, tu pedido se enviará automáticamente y solo debes adjuntar el comprobante de pago.'
    }
  ]
};

export const CHECKOUT_CONSTANTS = {
  WHATSAPP_BASE_URL: environment.payment.whatsappBaseUrl,
  IDENTIFICATION_TYPES: [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'PP', label: 'Pasaporte' }
  ]
} as const;
