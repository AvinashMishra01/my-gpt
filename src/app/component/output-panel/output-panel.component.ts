import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
export interface OutputBlock {
  type: 'markdown' | 'code' | 'image' | 'table';
  from?:string;
  content?: string;  
  language?: string;      
  headers?: string[]; 
  rows?: string[][];  
}
   @Component({
  selector: 'app-output-panel',
  imports: [CommonModule],
  templateUrl: './output-panel.component.html',
  styleUrl: './output-panel.component.css'
})
export class OutputPanelComponent implements OnInit {

  @Input() responseData : OutputBlock[]=[]


  outputData :OutputBlock[]=[]

constructor(private sanitizer: DomSanitizer){}

async ngOnInit() {
  console.log("data is ", this.responseData);
 this.outputData = this.responseData;
   if (this.responseData) {
      this.outputData = Array.isArray(this.responseData) ? this.responseData : [this.responseData];
    }
    marked.setOptions({
      gfm: true,
      breaks: true
    });
}

renderMarkdown(mdText: string): SafeHtml {
    const html = marked.parse(mdText, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


}
