import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  
  @Input({ required: true }) product!: Product;
  @Output() productClick = new EventEmitter<Product>();

  onDiscoverRitual(): void {
    // Always navigate to PDP for SEO and consistency
    this.router.navigate(['/ritual', this.product.slug]);
  }
}