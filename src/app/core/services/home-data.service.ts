import { Injectable } from '@angular/core';
import { FeatureCard, Testimonial, Stat } from '../models/home.models';

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {
  private readonly _features: readonly FeatureCard[] = [
    {
      id: 'catalog',
      title: 'Catálogo Gourmet',
      description: 'Descubre nuestra selección premium de productos artesanales y gourmet.',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6m-10 0h10',
      route: '/catalog'
    },
    {
      id: 'quality',
      title: 'Calidad Premium',
      description: 'Productos seleccionados con los más altos estándares de calidad.',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      route: '/catalog'
    },
    {
      id: 'delivery',
      title: 'Entrega Rápida',
      description: 'Recibe tus productos favoritos en la comodidad de tu hogar.',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
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
    { id: 'products', value: '500+', label: 'Productos Premium' },
    { id: 'customers', value: '10K+', label: 'Clientes Satisfechos' },
    { id: 'years', value: '5+', label: 'Años de Experiencia' },
    { id: 'regions', value: '32', label: 'Departamentos' }
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