import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CorporateQuoteFormComponent } from './components/corporate-quote-form/corporate-quote-form.component';

@Component({
  selector: 'app-corporate-quote',
  standalone: true,
  imports: [CommonModule, RouterModule, CorporateQuoteFormComponent],
  templateUrl: './corporate-quote.component.html',
  styleUrls: ['./corporate-quote.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateQuoteComponent {
  readonly showSuccessScreen = signal<boolean>(false);

  onSuccessScreenChange(show: boolean): void {
    this.showSuccessScreen.set(show);
  }
}
