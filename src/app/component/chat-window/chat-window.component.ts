import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OutputPanelComponent } from '../output-panel/output-panel.component';
import { ChatServiceService } from '../../service/chat-service.service';

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, CommonModule, OutputPanelComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit {
messages: {from:string, output:any}[] = [
//   {
//     from: 'bot',
//     output: {
//       type: 'text',
//       content: 'Hi! How can I assist you today?'
//     }
//   },
//   {
//     from: 'user',
//     output: {
//       type: 'text',
//       content: 'Can you show me a JavaScript example of a Promise?'
//     }
//   },
//   {
//     from: 'bot',
//     output: {
//       type: 'code',
//       language: 'javascript',
//       content: `const myPromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("Success!");
//   }, 1000);
// });

// myPromise.then(result => console.log(result));`
//     }
//   },
//   {
//     from: 'user',
//     output: {
//       type: 'text',
//       content: 'Do you have a reference table for HTTP status codes?'
//     }
//   },
//   {
//     from: 'bot',
//     output: {
//       type: 'table',
//       content: {
//         headers: ['Code', 'Description'],
//         rows: [
//           ['200', 'OK'],
//           ['404', 'Not Found'],
//           ['500', 'Internal Server Error']
//         ]
//       }
//     }
//   },
//   {
//     from: 'user',
//     output: {
//       type: 'text',
//       content: 'Show me the architecture diagram.'
//     }
//   },
//   {
//     from: 'bot',
//     output: {
//       type: 'image',
//       content: 'https://picsum.photos/id/237/200/300'
//     }
//   },
//   {
//     from: 'user',
//     output: {
//       type: 'text',
//       content: 'Give me a slide summary for REST vs GraphQL.'
//     }
//   },
//   {
//     from: 'bot',
//     output: {
//       type: 'slide',
//       content: [
//         { title: 'REST', points: ['Fixed endpoints', 'Multiple requests'] },
//         { title: 'GraphQL', points: ['Flexible queries', 'Single request'] }
//       ]
//     }
//   }
];

constructor(private service : ChatServiceService){}
  newMessage = '';

  ngOnInit(): void {
    console.log("char component");
    
  }
  
  sendMessage() {
  if (!this.newMessage.trim()) return;

    this.messages.push({
    from: 'user',
    output: [
      { type: 'markdown', content: this.newMessage, from:'user' }
    ]
  });
    this.service.getData(this.newMessage).subscribe({
      next:(res:any)=>{
console.log("succes is ", res);
 const rawContent = res?.choices?.[0]?.message?.content || '';
    const parsedBlocks = this.parseGroqOutput(rawContent);
    console.log("parse data is ",parsedBlocks)
    this.messages.push({
      from: 'bot',
      output: parsedBlocks
    });
   this.newMessage=''
      },
      error:(err:any)=>{
        console.log("erro is ", err)
        
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


}
