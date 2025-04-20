import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastState } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toastState: ToastState = { message: '', show: false, type: 'info' };
  private toastSubscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastState$.subscribe(state => {
      this.toastState = state;
    });
  }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }

  closeToast() {
    this.toastService.hideToast();
  }
}
