import { Injectable } from '@angular/core';
import { ChatHistoryEntry } from '../../model/chat-history-modae';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() { }
 private selectedEntrySubject = new BehaviorSubject<ChatHistoryEntry | null>(null);
  selectedEntry$ = this.selectedEntrySubject.asObservable();

 selectEntry(entry: ChatHistoryEntry) {
    // Emit a cloned object to ensure change detection
    this.selectedEntrySubject.next({
      ...entry,
      userMessage: { ...entry.userMessage },
      botResponse: entry.botResponse ? { ...entry.botResponse } : undefined
    });
  }



}
