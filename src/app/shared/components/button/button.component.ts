import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIcon = 'whatsapp' | 'send' | 'check' | 'none';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon: ButtonIcon = 'none';
  @Input() customClass = '';
  
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-garet font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';
    
    const variantClasses = {
      primary: 'bg-sumak-green hover:bg-sumak-green/90 text-white focus:ring-sumak-gold',
      secondary: 'bg-sumak-gold hover:bg-sumak-gold/90 text-sumak-green focus:ring-sumak-green',
      danger: 'bg-sumak-wine hover:bg-sumak-wine/90 text-white focus:ring-sumak-wine',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      outline: 'border-2 border-sumak-green bg-white hover:bg-sumak-green hover:text-white text-sumak-green focus:ring-sumak-gold'
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-6 py-3 text-sm min-h-[44px]',
      lg: 'px-8 py-4 text-base min-h-[48px]'
    };
    
    const widthClass = this.fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${widthClass} ${this.customClass}`.trim();
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}