import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.setSeoMetadata();
  }

  ngOnDestroy(): void {
    this.seoService.removeSchema('breadcrumb-schema');
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetaTags({
      title: 'Política de Tratamiento de Datos Personales | Sumak Gourmet',
      description: 'Política de tratamiento de datos personales de Sumak Gourmet conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia. Protección y privacidad de datos.',
      keywords: 'política de privacidad sumak, tratamiento datos personales, ley 1581 2012, protección datos colombia',
      ogTitle: 'Política de Tratamiento de Datos | Sumak Gourmet',
      ogDescription: 'Conoce cómo protegemos tus datos personales conforme a la legislación colombiana.',
      ogUrl: 'https://sumakgourmet.co/politica-tratamiento-datos',
      canonicalUrl: '/politica-tratamiento-datos'
    });

    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Política de Datos', url: '/politica-tratamiento-datos' }
    ]);
  }
}
