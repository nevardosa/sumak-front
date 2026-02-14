import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutStatus } from '../../../core/use-cases/confirm-checkout.use-case';

@Component({
  selector: 'app-checkout-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-status-modal.component.html',
  styleUrl: './checkout-status-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutStatusModalComponent {
  @Input({ required: true }) status!: CheckoutStatus;
  @Input() pdfUrl?: string;
  @Input() whatsappMessage?: string;
  
  @Output() close = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  @Output() openWhatsApp = new EventEmitter<void>();
  @Output() copyLink = new EventEmitter<void>();
  @Output() copyMessage = new EventEmitter<void>();

  getTitle(): string {
    switch (this.status.step) {
      case 'completed':
        return 'Tu pedido está siendo atendido';
      case 'error':
        return 'Algo salió mal';
      case 'generating_pdf':
        return 'Preparando tu comprobante';
      case 'sending_whatsapp':
        return 'Conectando con tu asesor';
      default:
        return 'Procesando tu pedido';
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }

  onOpenWhatsApp(): void {
    this.openWhatsApp.emit();
  }

  onCopyLink(): void {
    this.copyLink.emit();
  }

  onCopyMessage(): void {
    this.copyMessage.emit();
  }
}
