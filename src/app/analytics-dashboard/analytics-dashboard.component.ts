import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms'; 
import * as L from 'leaflet';
import { DataService, FilterParams, ProductionData } from '../data.service'; 
import { Subscription } from 'rxjs';

export const dateRangeValidator = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return { dateRangeInvalid: true }; 
    }
  }
  return null; 
};

interface ChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    NgxChartsModule, 
    LeafletModule, 
    ReactiveFormsModule 
  ],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  filterForm: FormGroup;

  productionData: ProductionData[] = []; 
  lineChartData: ChartData[] = [];
  mapLayers: L.Layer[] = [];
  
  isLoading = false;
  apiError: string | null = null;
  private dataSub: Subscription | null = null;

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Production';
  colorScheme = 'cool';

  mapOptions: L.MapOptions = {}; 
  mapCenter: L.LatLng = L.latLng(39.8283, -98.5795);
  mapZoom = 4;

  constructor() { 
    this.filterForm = this.fb.group({
      startDate: [''], 
      endDate: [''],
      wellName: [''],
      region: ['']
    }, { validators: dateRangeValidator });
  }

  ngOnInit(): void { 
    this.initializeMapOptions();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.apiError = null;
    this.dataSub?.unsubscribe(); 
    
    this.dataSub = this.dataService.getInitialData().subscribe({
      next: (data) => {
        this.updateDataViews(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
        this.apiError = err.message || 'Failed to load initial data. Please try again later.';
        this.isLoading = false;
        this.productionData = []; 
        this.lineChartData = [];
        this.mapLayers = [];
      }
    });
  }

  updateDataViews(data: ProductionData[]): void {
    this.productionData = data;
    this.formatDataForLineChart(data);
    this.addMarkersToMap(data);
    this.apiError = null;
  }

  initializeMapOptions(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({ iconRetinaUrl, iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41] });
    L.Marker.prototype.options.icon = iconDefault;
    this.mapOptions = { layers: [ L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 3, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }) ], zoom: this.mapZoom, center: this.mapCenter };
  }
  
  addMarkersToMap(data: ProductionData[]): void {
    const markers: L.Marker[] = [];
    for (const item of data) {
      if (item.lat != null && item.lng != null) { 
        const marker = L.marker([item.lat, item.lng]); 
        marker.bindPopup(`<b>${item.wellName}</b><br>${item.region}`); 
        markers.push(marker); 
      }
    }
    this.mapLayers = markers;
  }

  formatDataForLineChart(data: ProductionData[]) {
    const series = data
      .filter(item => item.production != null) 
      .map(item => ({ name: item.date, value: item.production! }));
    this.lineChartData = series.length > 0 ? [{ name: 'Oil Production', series: series }] : [];
  }
  
  onChartSelect(event: any) { console.log('Chart element selected:', event); }

  onSubmit() {
    this.filterForm.markAllAsTouched(); 
    
    if (this.filterForm.valid) {
      const filters: FilterParams = this.filterForm.value;
      console.log('Submitting filters:', filters);
      this.isLoading = true;
      this.apiError = null;
      this.dataSub?.unsubscribe();
      
      this.dataSub = this.dataService.getProductionData(filters).subscribe({
        next: (data) => {
          console.log('Received filtered data:', data);
          this.updateDataViews(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error submitting filter data:', err);
          this.apiError = err.message || 'Failed to load filtered data. Please try again later.';
          this.isLoading = false;
          this.productionData = []; 
          this.lineChartData = [];
          this.mapLayers = [];
        }
      });
    } else {
      console.log('Form is invalid. Errors:', this.filterForm.errors); 
    }
  }
  
  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }
}
