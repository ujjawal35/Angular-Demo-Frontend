import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

export interface ProductionData {
  date: string;
  wellName: string;
  region: string;
  oilVolume: number; // Assuming oil volume is needed for the chart later
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  // Use @Input() if data comes from parent, or define mock data here
  @Input() productionData: ProductionData[] = [
    { date: '2024-01', wellName: 'Well A', region: 'North', oilVolume: 1200 },
    { date: '2024-02', wellName: 'Well B', region: 'East', oilVolume: 1350 },
    { date: '2024-03', wellName: 'Well C', region: 'West', oilVolume: 1400 },
    { date: '2024-04', wellName: 'Well D', region: 'North', oilVolume: 1650 },
    { date: '2024-05', wellName: 'Well E', region: 'South', oilVolume: 1800 },
    // Add more mock data if needed
  ];

  // You could alternatively fetch this data from a service
}