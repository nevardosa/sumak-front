import { Injectable } from '@angular/core';
import { FeatureCard, Testimonial, Stat } from '../models/home.models';

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {
  private readonly _features: readonly FeatureCard[] = [
    {
      id: 'catalog',
      title: 'Curaduría Gastronómica',
      description: 'Cada ritual nace de una curaduría cuidadosa: sabores, texturas y aromas equilibrados para una experiencia memorable.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      route: '/catalog'
    },
    {
      id: 'quality',
      title: 'Ingredientes Premium',
      description: 'Chocolates de alto cacao, frutos secos seleccionados, mieles infusionadas y bebidas de calidad, priorizando el origen, la frescura y el carácter.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      route: '/catalog'
    },
    {
      id: 'delivery',
      title: 'Entrega cuidada y puntual',
      description: 'Entregas cuidadas y puntuales para que cada ritual llegue en el momento indicado, con una presentación impecable. Envíos de 1 a 3 días hábiles, según destino.',
      icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
      route: '/catalog'
    }
  ] as const;

  private readonly _testimonials: readonly Testimonial[] = [
    {
      id: '1',
      name: 'María González',
      role: 'Cliente Premium',
      content: 'La calidad de los productos es excepcional. Sumak ha transformado mi experiencia culinaria.',
      rating: 5
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      role: 'Chef Profesional',
      content: 'Como chef, valoro la autenticidad y calidad. Sumak supera mis expectativas.',
      rating: 5
    },
    {
      id: '3',
      name: 'Ana Martínez',
      role: 'Amante de la Cocina',
      content: 'Productos únicos que no encuentras en otro lugar. Excelente servicio.',
      rating: 5
    }
  ] as const;

  private readonly _stats: readonly Stat[] = [
    { id: 'products', value: '14', label: 'Rituales premium diseñados', type: 'numeric' },
    { id: 'customers', value: '50', label: 'Proyectos y reconocimientos entregados', type: 'numeric' },
    { id: 'regions', value: '32', label: 'Departamentos cubiertos', type: 'numeric' }
  ] as const;

  get features(): readonly FeatureCard[] {
    return this._features;
  }

  get testimonials(): readonly Testimonial[] {
    return this._testimonials;
  }

  get stats(): readonly Stat[] {
    return this._stats;
  }

  getFeatureById(id: string): FeatureCard | undefined {
    return this._features.find(feature => feature.id === id);
  }

  getTestimonialById(id: string): Testimonial | undefined {
    return this._testimonials.find(testimonial => testimonial.id === id);
  }
}
