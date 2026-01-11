import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="show"
      class="fixed top-4 right-4 sm:right-4 left-4 sm:left-auto z-50 transform transition-all duration-300 ease-in-out"
      [class.translate-x-0]="show"
      [class.translate-x-full]="!show">
      
      <div class="bg-white border-l-4 border-sumak-green rounded-lg shadow-lg p-3 sm:p-4 w-full sm:max-w-sm">
        <div class="flex items-start sm:items-center">
          <div class="flex-shrink-0">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-sumak-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-2 sm:ml-3 flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-medium font-garet text-gray-900 truncate">{{ title }}</p>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ message }}</p>
          </div>
          <button
            *ngIf="!autoClose"
            (click)="onClose()"
            class="ml-2 sm:ml-4 text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() autoClose = true;
  @Input() duration = 3000;
  @Output() closed = new EventEmitter<void>();

  private timeoutId?: number;

  ngOnInit() {
    this.setupAutoClose();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      this.setupAutoClose();
    }
  }

  private setupAutoClose() {
    if (this.autoClose && this.show) {
      this.clearTimeout();
      this.timeoutId = window.setTimeout(() => {
        this.onClose();
      }, this.duration);
    }
  }

  private clearTimeout() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  onClose() {
    this.clearTimeout();
    this.closed.emit();
  }
}