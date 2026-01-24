import { Injectable } from '@angular/core';
import { FaqItem, FaqCategory, FaqCategoryId } from '../models/faq.models';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private readonly categories: readonly FaqCategory[] = [
    APP_CONSTANTS.FAQ.CATEGORIES.GENERAL,
    APP_CONSTANTS.FAQ.CATEGORIES.ORDERS,
    APP_CONSTANTS.FAQ.CATEGORIES.SHIPPING,
    APP_CONSTANTS.FAQ.CATEGORIES.PRODUCTS,
    APP_CONSTANTS.FAQ.CATEGORIES.PAYMENTS
  ] as const;

  private readonly faqItems: readonly FaqItem[] = [
    {
      id: '1',
      question: '¿Qué es Sumak?',
      answer: 'Sumak es una marca de rituales gastronómicos pensados para regalar con intención. Diseñamos experiencias que combinan sabor, curaduría y significado.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.GENERAL,
      priority: 1
    },
    {
      id: '2',
      question: '¿Cómo realizo un pedido?',
      answer: 'Puedes realizar tu pedido navegando por nuestro catálogo, agregando productos al carrito y siguiendo el proceso de checkout. También puedes contactarnos por WhatsApp.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.ORDERS,
      priority: 1
    },
    {
      id: '3',
      question: '¿Cuándo llega mi pedido?',
      answer: 'En Bogotá, los pedidos pueden entregarse el mismo día o dentro de un plazo máximo de 24 horas, según disponibilidad.\n\nPara envíos fuera de Bogotá, el plazo de entrega es de hasta 4 días hábiles. En estos casos, el costo de envío es asumido por el cliente y, como apoyo, Sumak otorga un bono de $25.000 COP que se descuenta directamente del valor del ritual.\n\nCada pedido se prepara con cuidado para que llegue en perfectas condiciones, listo para regalar.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.SHIPPING,
      priority: 1
    },
    {
      id: '4',
      question: '¿Qué tipo de productos incluye Sumak?',
      answer: 'Cada ritual combina ingredientes seleccionados por su afinidad sensorial y equilibrio, pensados como una experiencia completa, no como productos aislados.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.PRODUCTS,
      priority: 1
    },
    {
      id: '5',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos por Bre-B unicamente. El proceso de pago se confirma vía WhatsApp.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.PAYMENTS,
      priority: 1
    },
    {
      id: '6',
      question: '¿Hacen envíos a todo Colombia?',
      answer: 'Sí, realizamos envíos a los 32 departamentos de Colombia. Los costos y tiempos varían según la ubicación.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.SHIPPING,
      priority: 2
    },
    {
      id: '7',
      question: '¿Qué es Bre-B?',
      answer: 'Bre-B es el sistema de pagos inmediatos interoperable de Colombia, que permite transferir dinero entre cualquier entidad financiera del país de forma instantánea y segura.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.PAYMENTS,
      priority: 2
    },
    {
      id: '8',
      question: '¿Cómo puedo pagar por Bre-B desde mi banco?',
      answer: 'Para pagar con Bre-B: 1) Elige Bre-B como medio de pago en Sumak, 2) Ingresa a tu app bancaria, 3) Selecciona "Transferencias" o "Pagos inmediatos (Bre-B)", 4) Confirma el pago y lo recibimos al instante. Si tienes dudas, nuestro equipo te acompaña paso a paso por WhatsApp.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.PAYMENTS,
      priority: 3
    }
  ] as const;

  get allCategories(): readonly FaqCategory[] {
    return this.categories;
  }

  get allFaqItems(): readonly FaqItem[] {
    return [...this.faqItems].sort((a: FaqItem, b: FaqItem) => a.priority - b.priority);
  }

  getFaqsByCategory(categoryId: FaqCategoryId): readonly FaqItem[] {
    return [...this.faqItems]
      .filter(item => item.category.id === categoryId)
      .sort((a: FaqItem, b: FaqItem) => a.priority - b.priority);
  }

  searchFaqs(query: string): readonly FaqItem[] {
    if (!query.trim()) return this.allFaqItems;

    const searchTerm = query.toLowerCase().trim();
    return [...this.faqItems].filter(item =>
      item.question.toLowerCase().includes(searchTerm) ||
      item.answer.toLowerCase().includes(searchTerm)
    );
  }

  getFaqById(id: string): FaqItem | undefined {
    return this.faqItems.find(item => item.id === id);
  }
}
