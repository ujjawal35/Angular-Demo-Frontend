import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from './shared/toast.service'; // Import ToastService

export interface ProductionData {
  date: string;
  wellName: string;
  region: string;
  production?: number | null;
  lat?: number | null;
  lng?: number | null;
}

export interface FilterParams {
  startDate?: string | null;
  endDate?: string | null;
  wellName?: string | null;
  region?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private http = inject(HttpClient);
  private toastService = inject(ToastService); // Inject ToastService
  private apiUrl = 'http://localhost:8000/api'; 

  constructor() { }

  getProductionData(filters: FilterParams): Observable<ProductionData[]> {
    const url = `${this.apiUrl}/data`;
    return this.http.post<ProductionData[]>(url, filters).pipe(
      tap(data => console.log('DataService: Received data from backend:', data)),
      catchError(this.handleError('getProductionData')) 
    );
  }

  getInitialData(): Observable<ProductionData[]> {
    const url = `${this.apiUrl}/data`;
    return this.http.post<ProductionData[]>(url, {}).pipe(
      tap(data => console.log('DataService: Received initial data from backend:', data)),
      catchError(this.handleError('getInitialData'))
    );
  }

  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = 'An unknown error occurred!';
      let userMessage = `Operation ${operation} failed.`;
      
      // Check for specific network errors like connection refused
      if (error.status === 0 || error.error instanceof ProgressEvent) { 
        errorMessage = `Network error: Could not connect to the server. ${error.message}`;
        userMessage = "Something went wrong: Cannot connect to the backend service.";
        // Show the specific toast for connection errors
        this.toastService.showToast(userMessage, 'error'); 
      } else {
        // Backend returned an error code (4xx, 5xx)
        errorMessage = `Server error: ${error.status} ${error.statusText}. ${error.error?.detail || error.message}`;
        userMessage = `An error occurred while fetching data (${error.status}).`;
        // Optionally show a generic error toast for other server errors
        // this.toastService.showToast(userMessage, 'error'); 
      }

      console.error(`${operation} failed: ${errorMessage}`, error);
      // Throw an error containing the user-friendly message for the component
      return throwError(() => new Error(userMessage));
    };
  }
}
