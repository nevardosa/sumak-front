import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  protected get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  protected post<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  protected put<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  protected patch<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  protected delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  protected getPaginated<T>(endpoint: string, page: number = 1, limit: number = 10, options?: RequestOptions): Observable<PaginatedResponse<T>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    const requestOptions = {
      ...options,
      params: options?.params ? { ...options.params, ...params } : params
    };

    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, requestOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}