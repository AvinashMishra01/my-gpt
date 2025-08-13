import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private http : HttpClient) { }
private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
   getData(userMessage:string = "give the tabe of 2, 4 and 5 ")
   {
       const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    };

    return this.http.post(this.apiUrl, body);
  }
   }



