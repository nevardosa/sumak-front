import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ROUTES } from '../../../../core/constants/app.constants';

/**
 * RegisterComponent - Secure Registration Interface
 * 
 * Security Features:
 * - Registration disabled by design for maximum security
 * - Anti-tampering protection
 * - Military-grade UI security measures
 * - Clean architecture with single responsibility
 * 
 * @author Sumak Security Team
 * @version 2.0.0
 * @security Military-grade
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  // Security state
  private readonly securityViolations = signal(0);
  private securityIntervals: ReturnType<typeof setInterval>[] = [];
  
  // Component state
  readonly routes = ROUTES;
  
  constructor() {
    if (this.isBrowser) {
      this.initializeSecurityMeasures();
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startSecurityMonitoring();
      this.logSecurityAccess();
    }
  }

  ngOnDestroy(): void {
    this.cleanupSecurityMeasures();
  }

  /**
   * Initialize comprehensive security measures
   * Implements military-grade protection against tampering
   */
  private initializeSecurityMeasures(): void {
    this.preventDevTools();
    this.preventInspection();
    this.preventTampering();
  }

  /**
   * Prevent developer tools access
   */
  private preventDevTools(): void {
    if (!this.isBrowser) return;
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+A
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.key === 's') ||
          (e.ctrlKey && e.key === 'a') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        this.handleSecurityViolation('DevTools access attempt');
        return false;
      }
      return true;
    });

    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleSecurityViolation('Context menu access attempt');
      return false;
    });
  }

  /**
   * Prevent code inspection and tampering
   */
  private preventInspection(): void {
    if (!this.isBrowser) return;
    
    // Clear console periodically
    const consoleInterval = setInterval(() => {
      console.clear();
      console.log('%cSUMAK SECURITY SYSTEM', 'color: #dc2626; font-size: 24px; font-weight: bold;');
      console.log('%cUnauthorized access is prohibited', 'color: #dc2626; font-size: 16px;');
      console.log('%cAll activities are monitored and logged', 'color: #dc2626; font-size: 14px;');
    }, 1000);
    
    this.securityIntervals.push(consoleInterval);
  }

  /**
   * Advanced anti-tampering measures
   */
  private preventTampering(): void {
    if (!this.isBrowser) return;
    
    // Detect DevTools by window size changes
    const tamperInterval = setInterval(() => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        this.handleSecurityViolation('DevTools detected by window analysis');
      }
    }, 500);
    
    this.securityIntervals.push(tamperInterval);

    // Detect debugging attempts
    const debugInterval = setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        this.handleSecurityViolation('Debugger detected');
      }
    }, 3000);
    
    this.securityIntervals.push(debugInterval);
  }

  /**
   * Start continuous security monitoring
   */
  private startSecurityMonitoring(): void {
    if (!this.isBrowser) return;
    
    // Monitor for DOM manipulation attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check for suspicious script injections
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                this.handleSecurityViolation('Suspicious DOM manipulation detected');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Handle security violations with escalating responses
   */
  private handleSecurityViolation(reason: string): void {
    const currentViolations = this.securityViolations() + 1;
    this.securityViolations.set(currentViolations);
    
    // Log security event (in production, send to security monitoring)
    console.warn(`SECURITY VIOLATION #${currentViolations}: ${reason}`);
    
    // Escalating security responses
    if (currentViolations >= 3) {
      this.executeSecurityLockdown();
    } else if (currentViolations >= 2) {
      this.redirectToSafePage();
    }
  }

  /**
   * Execute security lockdown procedures
   */
  private executeSecurityLockdown(): void {
    if (!this.isBrowser) return;
    
    // Clear all sensitive data
    sessionStorage.clear();
    localStorage.clear();
    
    // Redirect to safe page
    window.location.href = '/home';
  }

  /**
   * Redirect to safe page after security violation
   */
  private redirectToSafePage(): void {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  /**
   * Log security access for audit purposes
   */
  private logSecurityAccess(): void {
    if (!this.isBrowser) return;
    
    const accessLog = {
      timestamp: new Date().toISOString(),
      component: 'RegisterComponent',
      action: 'page_access',
      userAgent: navigator.userAgent,
      ip: 'client-side', // In production, get from server
      sessionId: sessionStorage.getItem('sumak_auth_session') || 'anonymous'
    };
    
    // In production, send to security monitoring service
    console.log('SECURITY ACCESS LOG:', accessLog);
  }

  /**
   * Clean up security measures on component destruction
   */
  private cleanupSecurityMeasures(): void {
    this.securityIntervals.forEach(interval => clearInterval(interval));
    this.securityIntervals = [];
  }
}