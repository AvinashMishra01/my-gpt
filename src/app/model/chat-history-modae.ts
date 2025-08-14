

export interface ChatMessage {
  from: 'user' | 'bot';
  output: OutputBlock[];
  timestamp: string;
}

export interface ChatSession {
  date: string;  // e.g. "2025-08-13"
  messages: ChatMessage[];
}

export interface OutputBlock {
  type: 'markdown' | 'code' | 'image' | 'table'  | 'slides';
  from?:string;
  content?: string;  
  language?: string;      
  headers?: string[]; 
  rows?: string[][];  
}


export interface ChatHistoryEntry {
  userMessage: ChatMessage;
  botResponse?: ChatMessage;
}

export interface ChatHistorySession {
  date: string; // YYYY-MM-DD
  messages: ChatHistoryEntry[];
}