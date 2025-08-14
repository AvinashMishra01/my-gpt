import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatHistoryEntry, ChatHistorySession, ChatMessage } from '../../model/chat-history-modae';
import { HistoryService } from '../../service/history-Service/history.service';
interface ChatHistoryGroup {
  date: string;
  messages: ChatMessage[];
}


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
   chatHistoryGrouped: ChatHistorySession[] = [];
userProfile = {
  name: 'Avinash Mishra',  
  role:'Admin',                      
  avatarUrl: 'https://picsum.photos/seed/picsum/200/300' 
};
   constructor(private chatHistoryService: HistoryService){}
  ngOnInit() {
    this.loadChatHistory();
  }

  loadHistory(entry: ChatHistoryEntry) {
    // Send selected entry to chat window
    this.chatHistoryService.selectEntry(entry);
  }

//   loadChatHistory() {
//   const historyStr = localStorage.getItem('chatHistory');
//   console.log('local history', historyStr);

//   if (historyStr) {
//     const history: ChatHistorySession[] = JSON.parse(historyStr);

//     // Group by date (optional if already grouped by date)
//     const grouped: { [date: string]: ChatHistoryEntry[] } = {};
//     history.forEach(session => {
//       const dateKey = new Date(session.date).toLocaleDateString();
//       if (!grouped[dateKey]) grouped[dateKey] = [];
//       grouped[dateKey].push(...session.messages);
//     });

//     // Convert to array for your UI
//     this.chatHistoryGrouped = Object.keys(grouped).map(date => ({
//       date,
//       messages: grouped[date] // each item has userMessage + botResponse
//     }));

//     console.log('grouped date is ', this.chatHistoryGrouped);
//   }
// }

loadChatHistory() {
  const historyStr = localStorage.getItem('chatHistory');
  if (historyStr) {
    const history: ChatHistorySession[] = JSON.parse(historyStr);

    const grouped: { [date: string]: ChatHistoryEntry[] } = {};
    history.forEach(session => {
      const dateKey = new Date(session.date).toLocaleDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(...session.messages);
    });
 this.chatHistoryGrouped= [];
    this.chatHistoryGrouped = Object.keys(grouped).map(date => ({
      date,
      messages: grouped[date]
    }));
    console.log("data is ", this.chatHistoryGrouped);
    
  }
}

}
