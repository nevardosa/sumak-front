import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ritual-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ritual-badges">
      <div *ngFor="let badge of badges" class="badge">
        <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(badge)"/>
        </svg>
        <span>{{ badge }}</span>
      </div>
    </div>
  `,
  styles: [`
    .ritual-badges {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }

    .badge:hover {
      background: #f3f4f6;
      border-color: var(--sumak-gold, #D4AF37);
    }

    .badge span {
      font-size: 0.8125rem;
      color: #374151;
      font-weight: 500;
      line-height: 1.3;
    }

    .badge-icon {
      width: 18px;
      height: 18px;
      color: var(--sumak-gold, #D4AF37);
      flex-shrink: 0;
    }

    @media (min-width: 768px) {
      .ritual-badges {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RitualBadgesComponent {
  @Input() badges: string[] = [];

  getIconPath(badge: string): string {
    const lowerBadge = badge.toLowerCase();
    
    if (lowerBadge.includes('limitada') || lowerBadge.includes('exclusiv')) {
      return 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z';
    }
    if (lowerBadge.includes('express') || lowerBadge.includes('entrega')) {
      return 'M13 10V3L4 14h7v7l9-11h-7z';
    }
    if (lowerBadge.includes('premium') || lowerBadge.includes('presentaci')) {
      return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
    }
    if (lowerBadge.includes('corporativ')) {
      return 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
    }
    
    return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
  }
}
