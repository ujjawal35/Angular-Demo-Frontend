import { Routes } from '@angular/router';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect empty path
    { path: 'dashboard', component: AnalyticsDashboardComponent },
    // Add other routes here if needed
];
