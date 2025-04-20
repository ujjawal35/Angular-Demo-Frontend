import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastState {
  message: string;
  show: boolean;
  type: 'error' | 'success' | 'info'; // Added type for styling
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastState = new BehaviorSubject<ToastState>({ message: '', show: false, type: 'info' });
  toastState$ = this.toastState.asObservable();

  showToast(message: string, type: 'error' | 'success' | 'info' = 'info', duration: number = 4000) {
    this.toastState.next({ message, show: true, type });

    // Automatically hide after duration
    setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast() {
    this.toastState.next({ ...this.toastState.value, show: false });
  }
}
