import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { WHATSAPP_CONFIG } from '../../../core/config/whatsapp.config';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss'
})
export class WhatsappButtonComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  showButton = signal(true);
  whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage || '')}`;

  ngOnInit() {
    this.updateVisibility(this.router.url);
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateVisibility(event.url);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateVisibility(url: string) {
    this.showButton.set(!url.includes('catalog'));
  }
}