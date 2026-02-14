import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-concierge-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-concierge-section.component.html',
  styleUrl: './custom-concierge-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomConciergeSectionComponent {
  @Output() requestCustomRitual = new EventEmitter<void>();

  onRequestCustomRitual(): void {
    this.requestCustomRitual.emit();
  }
}
