import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { OutputBlock } from '../../model/chat-history-modae';

   @Component({
  selector: 'app-output-panel',
  imports: [CommonModule,FormsModule,MonacoEditorModule],
  templateUrl: './output-panel.component.html',
  styleUrl: './output-panel.component.css'
})
export class OutputPanelComponent implements OnInit {

  @Input() responseData : OutputBlock[]=[]
  outputData :OutputBlock[]=[]
 previewHtml: string = ''; 


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

    runCode(code: string) {
    this.previewHtml = code;
  }


}
