import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ToastComponent } from './shared/toast/toast.component'; // Import ToastComponent

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet,
    SidebarComponent,
    ChatbotComponent,
    ToastComponent // Add ToastComponent here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';
}
