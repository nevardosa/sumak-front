import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) product!: Product;
  @Input() ctaButtonAdded: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<Product>();

  showImageZoom = false;
  currentImageIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  get currentImage(): string {
    if (this.product.images && this.product.images.length > 0) {
      return this.currentImageIndex === 0 ? this.product.imageUrl : this.product.images[this.currentImageIndex - 1];
    }
    return this.product.imageUrl;
  }

  get totalImages(): number {
    return this.product.images ? this.product.images.length + 1 : 1;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.totalImages - 1) {
      this.currentImageIndex++;
      this.cdr.markForCheck();
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.cdr.markForCheck();
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
    this.cdr.markForCheck();
  }

  onClose(): void {
    this.close.emit();
  }

  onAddToCart(): void {
    if (!this.ctaButtonAdded) {
      this.addToCart.emit(this.product);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onImageClick(): void {
    this.showImageZoom = true;
  }

  onCloseImageZoom(): void {
    this.showImageZoom = false;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}