import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type LogoSize = 'sm' | 'md' | 'lg';
export type LogoVariant = 'default' | 'compact';

/**
 * Componente reutilizable del logo SUMAK
 * Optimizado para rendimiento y consistencia visual
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a 
      [routerLink]="linkTo" 
      class="flex items-center"
      [class.space-x-3]="variant === 'default'"
      [class.space-x-2]="variant === 'compact'"
    >
      <!-- Logo circular -->
      <div 
        class="rounded-full overflow-hidden flex items-center justify-center bg-sumak-green/5 shadow-sm border border-gray-100"
        [ngClass]="logoContainerClasses"
      >
        <img 
          src="assets/images/logo_sumak.png" 
          alt="SUMAK Gourmet Logo" 
          class="w-full h-full object-cover rounded-full"
          loading="eager"
        >
      </div>
      
      <!-- Texto del logo -->
      <div *ngIf="variant === 'default'" class="flex flex-col items-center -space-y-1">
        <h1 class="font-angainc font-normal text-sumak-green"[ngClass]="brandTextClasses">
          SUMAK
        </h1>
        <span class="font-garet text-sumak-gold tracking-wider" [ngClass]="taglineTextClasses">
          GOURMET
        </span>
      </div>
    </a>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class LogoComponent {
  @Input() size: LogoSize = 'md';
  @Input() variant: LogoVariant = 'default';
  @Input() linkTo: string = '/';

  get logoContainerClasses(): string {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    return sizeClasses[this.size];
  }

  get brandTextClasses(): string {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl'
    };
    return sizeClasses[this.size];
  }

  get taglineTextClasses(): string {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return sizeClasses[this.size];
  }
}