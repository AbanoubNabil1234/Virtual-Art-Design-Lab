import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  sender: string;
  role: 'teacher' | 'student' | 'self' | 'system';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-gray-100 animate-fade-in chat-wrapper">
      
      <!-- Configuration View -->
      <div class="flex-1 flex justify-center items-center bg-gradient-to-br from-[#2c3e50] to-[#4ca1af] p-4" *ngIf="isConfiguring">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
           <div class="bg-gray-900 text-white p-6 flex items-center gap-3">
             <span class="material-icons text-primary">settings</span>
             <h2 class="text-xl font-bold">إعدادات غرفة الحوار</h2>
           </div>
           
           <div class="p-8 space-y-5">
             <div class="flex justify-between items-center text-gray-700 font-bold">
               <label>لون خلفية الغرفة</label>
               <input type="color" [(ngModel)]="roomConfig.roomBgColor" class="w-12 h-8 border-none cursor-pointer rounded overflow-hidden">
             </div>

             <div class="flex justify-between items-center text-gray-700 font-bold">
               <label>لون خلفية الرسائل</label>
               <input type="color" [(ngModel)]="roomConfig.msgBgColor" class="w-12 h-8 border-none cursor-pointer rounded overflow-hidden">
             </div>

             <div class="flex justify-between items-center text-gray-700 font-bold">
               <label>لون الخط</label>
               <input type="color" [(ngModel)]="roomConfig.fontColor" class="w-12 h-8 border-none cursor-pointer rounded overflow-hidden">
             </div>

             <div class="flex flex-col gap-2">
               <label class="text-gray-700 font-bold">حجم الخط</label>
               <select [(ngModel)]="roomConfig.fontSize" class="bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary">
                 <option value="0.75rem">صغير</option>
                 <option value="1rem">متوسط</option>
                 <option value="1.25rem">كبير</option>
               </select>
             </div>

             <div class="flex flex-col gap-2">
               <label class="text-gray-700 font-bold">نوع الخط</label>
               <select [(ngModel)]="roomConfig.fontFamily" class="bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary">
                 <option value="'Noto Kufi Arabic', sans-serif">نوتو كوفي (المعلم)</option>
                 <option value="'Segoe UI', sans-serif">Segoe UI</option>
                 <option value="'Tahoma', sans-serif">Tahoma</option>
                 <option value="'Arial', sans-serif">Arial</option>
               </select>
             </div>

             <button class="btn-action w-full mt-4 text-lg py-5" (click)="enterRoom()">
               <span>دخول الغرفة</span>
               <span class="material-icons text-2xl">login</span>
             </button>
           </div>
        </div>
      </div>

      <!-- Chat Room View -->
      <div class="flex-1 max-w-5xl mx-auto w-full md:my-4 md:rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300" 
           *ngIf="!isConfiguring" 
           [style.background-color]="roomConfig.roomBgColor">
        
        <div class="flex-1 flex flex-col bg-white/70 backdrop-blur-sm">
          <!-- Header -->
          <div class="p-4 md:px-8 md:py-4 bg-white/95 border-b border-gray-200 flex justify-between items-center z-10 sticky top-0">
            <div class="flex flex-col">
              <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                غرفة الحوار 
                <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">مباشر</span>
              </h1>
              <p class="hidden sm:block text-sm text-gray-500">الموضوع: مناقشة مهارات التصميم الرقمي</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span>5 متصلين</span>
              </div>
              <button (click)="isConfiguring = true" class="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="خروج للإعدادات">
                <span class="material-icons">logout</span>
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 scrollbar-thin" 
               [style.font-family]="roomConfig.fontFamily" 
               [style.font-size]="roomConfig.fontSize" 
               [style.color]="roomConfig.fontColor">
            
            <div *ngFor="let msg of messages()" 
                 class="flex flex-col"
                 [ngClass]="{
                   'items-center w-full my-4': msg.role === 'system',
                   'items-start': msg.role !== 'self' && msg.role !== 'system',
                   'items-end': msg.role === 'self'
                 }">
              
              <!-- System Message -->
              <div class="bg-gray-800/60 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full shadow-sm border border-white/10" *ngIf="msg.role === 'system'">
                {{ msg.text }}
              </div>

              <!-- Normal Message -->
              <div *ngIf="msg.role !== 'system'" class="flex items-end gap-3 max-w-[85%] md:max-w-[70%] group"
                   [ngClass]="{'flex-row-reverse': msg.role === 'self'}">
                
                <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-md border-2 border-white transition-transform hover:scale-110"
                     [ngClass]="{
                       'bg-purple-600': msg.role === 'teacher',
                       'bg-amber-500': msg.role === 'student',
                       'bg-primary': msg.role === 'self'
                     }">
                  <span class="material-icons text-xl">{{msg.role === 'teacher' ? 'school' : 'person'}}</span>
                </div>
                
                <div class="flex flex-col group" [ngClass]="{'items-end': msg.role === 'self'}">
                  <div class="flex items-center gap-2 mb-1 px-1 opacity-70 text-[0.7rem] font-bold">
                    <span>{{ msg.sender }}</span>
                    <span>•</span>
                    <span>{{ msg.time }}</span>
                  </div>
                  
                  <div class="p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed relative"
                       [class.rounded-br-none]="msg.role !== 'self'"
                       [class.rounded-bl-none]="msg.role === 'self'"
                       [style.background-color]="msg.role === 'self' ? 'var(--color-primary)' : roomConfig.msgBgColor" 
                       [style.color]="msg.role === 'self' ? 'white' : roomConfig.fontColor"
                       [ngClass]="{'border-r-4 border-purple-600': msg.role === 'teacher'}">
                    {{ msg.text }}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Input Area -->
          <div class="p-4 bg-white border-t border-gray-100">
            <div class="flex items-center gap-4 mb-3">
              <button class="text-gray-400 hover:text-amber-500 transition-colors"><span class="material-icons">sentiment_satisfied</span></button>
              <button class="text-gray-400 hover:text-primary transition-colors"><span class="material-icons">attach_file</span></button>
              <button class="text-gray-400 hover:text-primary transition-colors"><span class="material-icons">image</span></button>
            </div>
            <div class="flex gap-3 bg-gray-100 p-1 rounded-full items-center border border-gray-200 focus-within:border-primary focus-within:bg-white transition-all focus-within:shadow-md">
               <input type="text" 
                      [(ngModel)]="newMessage" 
                      (keyup.enter)="sendMessage()"
                      placeholder="اكتب رسالتك هنا..." 
                      class="flex-1 bg-transparent border-none px-5 py-2.5 outline-none font-bold text-gray-700" />
               <button class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-30 disabled:hover:scale-100" 
                       (click)="sendMessage()" [disabled]="!newMessage.trim()">
                 <span class="material-icons text-xl -mr-1">send</span>
               </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.1);
        border-radius: 10px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.2);
    }
    /* Simple scale-in animation */
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in {
      animation: scaleIn 0.3s ease-out;
    }
  `]
})
export class ChatRoomComponent {
  isConfiguring = true; // Start in config mode
  newMessage = '';

  roomConfig = {
    roomBgColor: '#f0f2f5',
    msgBgColor: '#ffffff',
    fontSize: '16px',
    fontFamily: "'Segoe UI', sans-serif",
    fontColor: '#000000'
  };

  // Mock Messages
  // Mock Messages
  messages = signal<ChatMessage[]>([
    { id: 1, sender: 'المعلم محمد أحمد', role: 'teacher', text: 'السلام عليكم ورحمة الله وبركاته. أهلاً بكم في غرفة الحوار.', time: '10:00 ص' },
    { id: 2, sender: 'خالد (طالب)', role: 'student', text: 'وعليكم السلام يا أستاذ. هل يمكننا مناقشة أنواع النقاط الرقمية؟', time: '10:02 ص' },
  ]);

  enterRoom() {
    this.isConfiguring = false;
    // Add system message
    this.messages.update(msgs => [
      ...msgs,
      {
        id: Date.now(),
        sender: 'System',
        role: 'system',
        text: 'دخل أحمد عدنان ياسين إلى الغرفة',
        time: new Date().toLocaleTimeString('ar-EG')
      }
    ]);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Simulate sending (Optimistic UI)
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: 'أحمد عدنان (أنت)',
      role: 'self',
      text: this.newMessage,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.update(msgs => [...msgs, newMsg]);
    this.newMessage = '';

    // Auto-scroll simulation would go here
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    const el = document.querySelector('.messages-area');
    if (el) el.scrollTop = el.scrollHeight;
  }
}
