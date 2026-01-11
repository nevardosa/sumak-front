import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        type="button"
        class="ml-1 text-sumak-green hover:text-sumak-green/80 focus:outline-none transition-colors"
        (mouseenter)="showTooltip = true"
        (mouseleave)="showTooltip = false"
        (focus)="showTooltip = true"
        (blur)="showTooltip = false">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
      
      <div
        *ngIf="showTooltip"
        class="absolute z-50 w-52 sm:w-60 p-3 font-garet text-xs leading-relaxed text-white bg-sumak-green rounded-lg shadow-lg bottom-6 left-1/2 transform -translate-x-1/2 whitespace-pre-line">
        <div class="relative">
          {{ text }}
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-sumak-green"></div>
        </div>
      </div>
    </div>
  `
})
export class TooltipComponent {
  @Input() text = '';
  showTooltip = false;
}