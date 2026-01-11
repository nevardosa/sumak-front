import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html'
})
export class LoadingComponent {
  @Input() size: LoadingSize = 'md';
  @Input() message = '';
  @Input() overlay = false;
  @Input() center = true;

  get containerClasses(): string {
    const baseClasses = 'flex flex-col items-center';
    const centerClass = this.center ? 'justify-center' : '';
    const overlayClass = this.overlay ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : '';
    
    return `${baseClasses} ${centerClass} ${overlayClass}`.trim();
  }

  get spinnerClasses(): string {
    const baseClasses = 'animate-spin text-primary-600';
    
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  get messageClasses(): string {
    const baseClasses = 'text-gray-600 font-medium';
    
    const sizeClasses = {
      sm: 'text-xs mt-1',
      md: 'text-sm mt-2',
      lg: 'text-base mt-3',
      xl: 'text-lg mt-4'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }
}