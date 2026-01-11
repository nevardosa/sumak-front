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
      question: '¿Qué es Sumak Gourmet?',
      answer: 'Sumak Gourmet es una plataforma especializada en productos gastronómicos premium de Colombia, conectando sabores auténticos con paladares exigentes.',
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
      question: '¿Cuáles son los tiempos de entrega?',
      answer: 'Los tiempos de entrega varían según tu ubicación. En Bogotá: 1-2 días hábiles. Otras ciudades principales: 2-4 días hábiles. Municipios: 3-7 días hábiles.',
      category: APP_CONSTANTS.FAQ.CATEGORIES.SHIPPING,
      priority: 1
    },
    {
      id: '4',
      question: '¿Los productos son artesanales?',
      answer: 'Sí, trabajamos directamente con productores locales que mantienen técnicas tradicionales y artesanales transmitidas de generación en generación.',
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
