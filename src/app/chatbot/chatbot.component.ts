import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  placeholder = 'Type a message...';

  constructor() { }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({ sender: 'bot', text: 'Hello! How can I help you?' });
    }
  }

  sendMessage(): void {
    const userMessage = this.userInput.trim();
    if (!userMessage) return;

    this.messages.push({ sender: 'user', text: userMessage });
    this.userInput = '';

    setTimeout(() => {
      let botResponse = 'Sorry, I can only provide basic information right now.';
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        botResponse = 'Hi there! How can I assist you today?';
      } else if (userMessage.toLowerCase().includes('production')) {
        botResponse = 'You can view production data in the table and chart on the main dashboard.';
      } else if (userMessage.toLowerCase().includes('map') || userMessage.toLowerCase().includes('location')) {
        botResponse = 'The map shows the locations of the wells currently displayed.';
      } else if (userMessage.toLowerCase().includes('bye')) {
        botResponse = 'Goodbye! Have a great day.';
      }
      this.messages.push({ sender: 'bot', text: botResponse });
    }, 500); 
  }
}
