import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      *ngIf="show"
      [class]="alertClasses"
      role="alert">
      
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg [class]="iconClasses" fill="currentColor" viewBox="0 0 20 20">
            <path *ngIf="type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            <path *ngIf="type === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            <path *ngIf="type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            <path *ngIf="type === 'info'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium" [class]="textClasses">
            {{ title }}
          </p>
          <p *ngIf="message" class="mt-1 text-sm" [class]="messageClasses">
            {{ message }}
          </p>
          <div *ngIf="suggestion" class="mt-2">
            <button 
              (click)="onSuggestionClick()"
              class="text-sm font-medium underline hover:no-underline focus:outline-none"
              [class]="suggestionClasses">
              ¿Quisiste decir "{{ suggestion }}"?
            </button>
          </div>
        </div>
        
        <div *ngIf="dismissible" class="ml-4 flex-shrink-0">
          <button 
            (click)="onDismiss()"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            [class]="dismissClasses">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,

})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() suggestion = '';
  @Input() show = false;
  @Input() dismissible = true;
  
  @Output() dismissed = new EventEmitter<void>();
  @Output() suggestionClicked = new EventEmitter<string>();

  get alertClasses(): string {
    const baseClasses = 'rounded-lg p-4 shadow-lg border-l-4 transition-all duration-300 ease-in-out';
    
    const typeClasses = {
      success: 'bg-green-50 border-green-400',
      error: 'bg-red-50 border-red-400',
      warning: 'bg-yellow-50 border-yellow-400',
      info: 'bg-blue-50 border-blue-400'
    };
    
    return `${baseClasses} ${typeClasses[this.type]}`;
  }

  get iconClasses(): string {
    const baseClasses = 'h-5 w-5';
    
    const typeClasses = {
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
      info: 'text-blue-400'
    };
    
    return `${baseClasses} ${typeClasses[this.type]}`;
  }

  get textClasses(): string {
    const typeClasses = {
      success: 'text-green-800',
      error: 'text-red-800',
      warning: 'text-yellow-800',
      info: 'text-blue-800'
    };
    
    return typeClasses[this.type];
  }

  get messageClasses(): string {
    const typeClasses = {
      success: 'text-green-700',
      error: 'text-red-700',
      warning: 'text-yellow-700',
      info: 'text-blue-700'
    };
    
    return typeClasses[this.type];
  }

  get suggestionClasses(): string {
    const typeClasses = {
      success: 'text-green-600 hover:text-green-500',
      error: 'text-red-600 hover:text-red-500',
      warning: 'text-yellow-600 hover:text-yellow-500',
      info: 'text-blue-600 hover:text-blue-500'
    };
    
    return typeClasses[this.type];
  }

  get dismissClasses(): string {
    const typeClasses = {
      success: 'text-green-400 hover:bg-green-100 focus:ring-green-600',
      error: 'text-red-400 hover:bg-red-100 focus:ring-red-600',
      warning: 'text-yellow-400 hover:bg-yellow-100 focus:ring-yellow-600',
      info: 'text-blue-400 hover:bg-blue-100 focus:ring-blue-600'
    };
    
    return typeClasses[this.type];
  }

  onDismiss(): void {
    this.show = false;
    this.dismissed.emit();
  }

  onSuggestionClick(): void {
    this.suggestionClicked.emit(this.suggestion);
  }
}