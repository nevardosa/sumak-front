import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private readonly seoService: SeoService) {}

  readonly values = [
    {
      title: 'Curaduría',
      description: 'Cada ritual nace de una selección cuidadosa donde sabores, texturas y aromas se eligen por su afinidad sensorial.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
      title: 'Calidad',
      description: 'Trabajamos con ingredientes premium como chocolate 70% de cacao, frutos secos seleccionados y mieles infusionadas de alta calidad.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    },
    {
      title: 'Tradición',
      description: 'Honramos la riqueza cultural de Colombia, inspirándonos en la diversidad de nuestras regiones y tradiciones ancestrales.',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  ngOnInit() {
    this.setSeoMetadata();
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('.fade-in-section').forEach(el => {
        this.observer?.observe(el);
      });
    }, 100);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.seoService.removeSchema('breadcrumb-schema');
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetaTags({
      title: 'Sobre Sumak Gourmet | Rituales Gastronómicos Premium Colombia',
      description: 'Conoce la historia de Sumak Gourmet. Rituales gastronómicos inspirados en la cultura colombiana, diseñados con curaduría experta y calidad premium.',
      keywords: 'sobre sumak, historia sumak gourmet, rituales gastronómicos Colombia, curaduría gastronómica, chocolate premium Colombia',
      ogTitle: 'Sobre Sumak Gourmet | Nuestra Historia',
      ogDescription: 'Sumak nace del respeto profundo por el sabor y la convicción de que regalar es un acto cargado de intención.',
      ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
      ogUrl: 'https://sumakgourmet.co/about',
      canonicalUrl: '/about'
    });

    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Sobre Sumak', url: '/about' }
    ]);
  }
}
