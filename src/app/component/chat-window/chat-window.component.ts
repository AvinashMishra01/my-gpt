import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OutputPanelComponent } from '../output-panel/output-panel.component';
import { ChatServiceService } from '../../service/chat-service.service';
import { ChatMessage, ChatSession, OutputBlock,ChatHistorySession } from '../../model/chat-history-modae';
import { HistoryService } from '../../service/history-Service/history.service';

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, CommonModule, OutputPanelComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit {
messages: ChatMessage[] = []
chatHistory: ChatHistorySession[] = [];

constructor(private service : ChatServiceService, private chatHistoryService: HistoryService,private cdr: ChangeDetectorRef,){}
  newMessage = '';
 loader:boolean=false;
   @ViewChild('chatContainer') private chatContainer!: ElementRef;



   private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  ngOnInit(): void {



    console.log("char component");
       this.chatHistoryService.selectedEntry$.subscribe(entry => {
      if (entry) {
        // Replace messages array completely to trigger change detection
        const newMessages = [entry.userMessage];
        if (entry.botResponse) newMessages.push(entry.botResponse);
        this.messages = [...newMessages];

        // If using OnPush
        this.cdr.markForCheck();
      }
    });
  }

    // if (entry) {
    //   this.messages=[]
    //   // Create a new array to trigger change detection
    //   const newMessages = [entry.userMessage];
    //   if (entry.botResponse) {
    //     newMessages.push(entry.botResponse);
    //   }
    //   this.messages = [...newMessages]; // important: spread into a new array
    // }
 
  
  sendMessage() {
  if (!this.newMessage.trim()) return;

  this.loader=true;
      const userMessage: ChatMessage = {
      from: 'user',
       output: [
      { type: 'markdown', content: this.newMessage, from:'user' }
    ],
      timestamp: new Date().toISOString()
    };
  //   this.messages.push({
  //   from: 'user',
  //   output: [
  //     { type: 'markdown', content: this.newMessage, from:'user' }
  //   ],
  //   timestamp: new Date()
  // });
    // this.saveToHistory(userMessage);
    this.messages.push(userMessage)
    this.newMessage = "";
    this.service.getData(userMessage.output[0].content).subscribe({
      next:(res:any)=>{
        this.loader=false;
console.log("succes is ", res);
 const rawContent = res?.choices?.[0]?.message?.content || '';
    const parsedBlocks = this.parseGroqOutput(rawContent);
    console.log("parse data is ",parsedBlocks)
         const botMessage: ChatMessage = {
        from: 'bot',
        output: parsedBlocks as OutputBlock[],
        timestamp: new Date().toISOString()
      };
    this.messages.push(botMessage);
        // Save **both** messages to history
      this.saveToHistory(userMessage,botMessage);
      this.newMessage=''
 
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);



      },
      error:(err:any)=>{
        console.log("erro is ", err)
        this.loader=false;
    this.newMessage = "";
      }
    })
  
  }


  parseGroqOutput(rawContent: string) {
    const blocks: any[] = [];

    // Code block regex
    const codeFenceRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeFenceRegex.exec(rawContent)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        const textPart = rawContent.slice(lastIndex, match.index).trim();
        if (textPart) this.pushMarkdownOrTable(blocks, textPart);
      }

      // Code block
      blocks.push({ type: 'code', content: match[2], language: match[1] || 'plaintext' });
      lastIndex = codeFenceRegex.lastIndex;
    }

    // Remaining text
    if (lastIndex < rawContent.length) {
      const textPart = rawContent.slice(lastIndex).trim();
      if (textPart) this.pushMarkdownOrTable(blocks, textPart);
    }

    return blocks;
  }

  pushMarkdownOrTable(blocks: any[], text: string) {
    if (text.includes('|') && text.includes('---')) {
      const table = this.parseMarkdownTable(text);
      if (table) {
        blocks.push(table);
        return;
      }
    }
    // Image markdown
    const imgMatch = /!\[.*?\]\((.*?)\)/.exec(text);
    if (imgMatch) {
      blocks.push({ type: 'image', content: imgMatch[1] });
      return;
    }
    // Default markdown
    blocks.push({ type: 'markdown', content: text });
  }

  parseMarkdownTable(markdown: string) {
    const lines = markdown.trim().split('\n');
    if (lines.length < 2) return null;

    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line =>
      line.split('|').map(cell => cell.trim()).filter(Boolean)
    );

    return { type: 'table', headers, rows };
  }

  saveToHistory(userMsg: ChatMessage, botMsg?: ChatMessage) {
  const dateKey = userMsg.timestamp.split('T')[0];// "YYYY-MM-DD"
  let session = this.chatHistory.find(s => s.date === dateKey);

  const historyStr = localStorage.getItem('chatHistory');
  let chatHistory: ChatHistorySession[] = historyStr ? JSON.parse(historyStr) : [];


  if (!session) {
    session = { date: userMsg.timestamp, messages: [] };
   chatHistory.push(session);
  }
 session.messages.push({
    userMessage: userMsg,
    botResponse: botMsg
  });

  // persist
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  this.chatHistory=chatHistory
}


}
