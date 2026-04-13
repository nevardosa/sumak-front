import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadDirective } from '../../directives/lazy-load.directive';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule, LazyLoadDirective],
  template: `
    <picture>
      <source 
        *ngFor="let source of sources"
        [srcset]="source.srcset"
        [type]="source.type"
        [sizes]="source.sizes">
      <img 
        [appLazyLoad]="src"
        [alt]="alt"
        [width]="width"
        [height]="height"
        [class]="imgClass"
        [loading]="loading"
        [fetchpriority]="priority">
    </picture>
  `,
  styles: [`
    picture {
      display: block;
      width: 100%;
    }
    img {
      width: 100%;
      height: auto;
      display: block;
    }
    img.loaded {
      animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedImageComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() imgClass: string = '';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() priority: 'high' | 'low' | 'auto' = 'auto';
  @Input() sizes: string = '(max-width: 768px) 100vw, 50vw';

  get sources(): Array<{srcset: string, type: string, sizes: string}> {
    if (!this.src) return [];

    const baseUrl = this.src.replace(/\.(jpg|jpeg|png)$/i, '');
    const ext = this.src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';

    return [
      {
        srcset: `${baseUrl}-400w.webp 400w, ${baseUrl}-800w.webp 800w, ${baseUrl}-1200w.webp 1200w`,
        type: 'image/webp',
        sizes: this.sizes
      },
      {
        srcset: `${baseUrl}-400w${ext} 400w, ${baseUrl}-800w${ext} 800w, ${baseUrl}-1200w${ext} 1200w`,
        type: `image/${ext.replace('.', '')}`,
        sizes: this.sizes
      }
    ];
  }
}
