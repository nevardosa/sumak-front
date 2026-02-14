import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PdfUploadResponse {
  url: string;
  expiresAt: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfStorageService {
  private readonly http = inject(HttpClient);

  /**
   * Upload PDF to secure storage and get temporary URL
   * @param pdfBase64 - PDF in base64 format
   * @param orderNumber - Order reference
   * @returns Secure temporary URL (expires in 72h)
   */
  async uploadPdfAndGetSecureUrl(pdfBase64: string, orderNumber: string): Promise<string> {
    try {
      // Si existe backend, usar endpoint real
      if (environment.apiUrl && environment.apiUrl !== 'https://api.sumakgourmet.com/api') {
        return await this.uploadToBackend(pdfBase64, orderNumber);
      }
      
      // Fallback: generar URL temporal local (para demo/desarrollo)
      return this.generateLocalSecureUrl(pdfBase64, orderNumber);
    } catch (error) {
      console.error('[PdfStorage] Upload failed:', error);
      throw new Error('Error al generar link del PDF');
    }
  }

  private async uploadToBackend(pdfBase64: string, orderNumber: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const response = await firstValueFrom(
      this.http.post<PdfUploadResponse>(
        `${environment.apiUrl}/orders/upload-pdf`,
        { pdfBase64, orderNumber },
        { headers }
      )
    );

    return response.url;
  }

  /**
   * Fallback: genera URL temporal usando Blob URL
   * En producción, esto debe reemplazarse con backend real
   */
  private generateLocalSecureUrl(pdfBase64: string, orderNumber: string): string {
    try {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Crear URL temporal (válida durante la sesión)
      const blobUrl = URL.createObjectURL(blob);
      
      // En producción real, esto sería una URL del backend con token
      // Ejemplo: https://api.sumakgourmet.com/orders/pdf/ABC123?token=xyz
      return blobUrl;
    } catch (error) {
      throw new Error('Error generando URL temporal del PDF');
    }
  }
}
