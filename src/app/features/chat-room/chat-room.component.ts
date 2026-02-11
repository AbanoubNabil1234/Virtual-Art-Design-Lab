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
    <div class="chat-wrapper animate-fade-in">
      
      <!-- Configuration View -->
      <div class="config-view" *ngIf="isConfiguring">
        <div class="config-card">
           <div class="config-header">
             <span class="material-icons">settings</span>
             <h2>إعدادات غرفة الحوار</h2>
           </div>
           
           <div class="config-body">
             <div class="form-group">
               <label>لون خلفية الغرفة</label>
               <input type="color" [(ngModel)]="roomConfig.roomBgColor">
             </div>

             <div class="form-group">
               <label>لون خلفية الرسائل</label>
               <input type="color" [(ngModel)]="roomConfig.msgBgColor">
             </div>

             <div class="form-group">
               <label>لون الخط</label>
               <input type="color" [(ngModel)]="roomConfig.fontColor">
             </div>

             <div class="form-group">
               <label>حجم الخط</label>
               <select [(ngModel)]="roomConfig.fontSize">
                 <option value="12px">صغير</option>
                 <option value="16px">متوسط</option>
                 <option value="20px">كبير</option>
               </select>
             </div>

             <div class="form-group">
               <label>نوع الخط</label>
               <select [(ngModel)]="roomConfig.fontFamily">
                 <option value="'Segoe UI', sans-serif">Segoe UI</option>
                 <option value="'Tahoma', sans-serif">Tahoma</option>
                 <option value="'Arial', sans-serif">Arial</option>
                 <option value="'Courier New', monospace">Courier New</option>
               </select>
             </div>

             <button class="enter-btn" (click)="enterRoom()">
               دخول الغرفة
               <span class="material-icons">login</span>
             </button>
           </div>
        </div>
      </div>

      <!-- Chat Room View -->
      <div class="chat-container" *ngIf="!isConfiguring" [style.background-color]="roomConfig.roomBgColor">
        <div class="chat-main">
          <!-- Header -->
          <div class="chat-header">
            <div class="header-info">
              <h1>غرفة الحوار <span class="badge">مباشر</span></h1>
              <p>الموضوع: مناقشة مهارات التصميم الرقمي</p>
            </div>
            <div class="header-actions">
              <button (click)="isConfiguring = true" class="exit-btn" title="خروج للإعدادات">
                <span class="material-icons">logout</span>
              </button>
              <span class="online-count">
                <span class="dot"></span>
                5 متصلين
              </span>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="messages-area" [style.font-family]="roomConfig.fontFamily" [style.font-size]="roomConfig.fontSize" [style.color]="roomConfig.fontColor">
            <div class="message-group" *ngFor="let msg of messages()">
              
              <div class="message" [ngClass]="{'self': msg.role === 'self', 'teacher': msg.role === 'teacher', 'student': msg.role === 'student', 'system': msg.role === 'system'}">
                
                <!-- System Message -->
                <div class="system-msg" *ngIf="msg.role === 'system'">
                   {{ msg.text }}
                </div>

                <!-- Normal Message -->
                <ng-container *ngIf="msg.role !== 'system'">
                  <div class="avatar">
                    <span class="material-icons" *ngIf="msg.role === 'teacher'">school</span>
                    <span class="material-icons" *ngIf="msg.role !== 'teacher'">person</span>
                  </div>
                  
                  <div class="msg-content">
                    <div class="msg-header">
                      <span class="sender">{{ msg.sender }}</span>
                      <span class="time">{{ msg.time }}</span>
                    </div>
                    <div class="bubble" [style.background-color]="msg.role === 'self' ? '#2980b9' : roomConfig.msgBgColor" 
                         [style.color]="msg.role === 'self' ? 'white' : roomConfig.fontColor">
                      {{ msg.text }}
                    </div>
                  </div>
                </ng-container>

              </div>

            </div>
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <div class="toolbar">
              <button class="tool-btn"><span class="material-icons">sentiment_satisfied</span></button>
              <button class="tool-btn"><span class="material-icons">attach_file</span></button>
              <button class="tool-btn"><span class="material-icons">image</span></button>
            </div>
            <div class="input-wrapper">
               <input type="text" 
                      [(ngModel)]="newMessage" 
                      (keyup.enter)="sendMessage()"
                      placeholder="اكتب رسالتك هنا..." 
                      class="chat-input" />
               <button class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim()">
                 <span class="material-icons">send</span>
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
      background: #f0f2f5;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .chat-wrapper { height: 100%; }

    /* --- Config View --- */
    .config-view {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #2c3e50, #4ca1af);
    }

    .config-card {
        background: white;
        padding: 0;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        width: 400px;
        overflow: hidden;
    }

    .config-header {
        background: #2c3e50;
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .config-header h2 { margin: 0; font-size: 1.2rem; }

    .config-body { padding: 25px; display: flex; flex-direction: column; gap: 15px; }

    .form-group { display: flex; justify-content: space-between; align-items: center; }
    .form-group label { font-weight: bold; color: #555; }
    
    input[type="color"] {
        width: 50px;
        height: 30px;
        border: none;
        cursor: pointer;
    }

    select {
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .enter-btn {
        margin-top: 20px;
        background: #27ae60;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        transition: transform 0.1s;
    }
    .enter-btn:hover { background: #219150; }
    .enter-btn:active { transform: scale(0.98); }

    /* --- Chat Room View --- */
    .chat-container {
      max-width: 1000px;
      margin: 20px auto;
      height: calc(100% - 40px);
      background: white; /* Default fallback */
      border-radius: 12px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.1);
      display: flex;
      overflow: hidden;
      direction: rtl;
      transition: background-color 0.3s;
    }

    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: rgba(255,255,255,0.7); /* Overlay for readability if bg is dark */
    }

    /* Header */
    .chat-header {
      padding: 15px 25px;
      background: rgba(255,255,255,0.95);
      border-bottom: 1px solid rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .header-info h1 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge {
      background: #e74c3c;
      color: white;
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: normal;
    }

    .header-info p {
      margin: 5px 0 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .header-actions { display: flex; align-items: center; gap: 10px; }
    
    .exit-btn {
        background: none;
        border: none;
        color: #e74c3c;
        cursor: pointer;
    }

    .online-count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #27ae60;
      font-weight: bold;
      font-size: 0.9rem;
      background: #eafaf1;
      padding: 5px 12px;
      border-radius: 20px;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: #27ae60;
      border-radius: 50%;
    }

    /* Messages */
    .messages-area {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    }

    .message {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      align-items: flex-end;
    }
    
    .message.system {
        justify-content: center;
        width: 100%;
        margin-bottom: 30px;
    }
    
    .system-msg {
        background: rgba(0,0,0,0.5);
        color: white;
        padding: 5px 20px;
        border-radius: 15px;
        font-size: 0.9rem;
    }

    .message.self {
      flex-direction: row-reverse;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .message.teacher .avatar { background: #8e44ad; } /* Teacher color */
    .message.student .avatar { background: #f39c12; } /* Student color */
    .message.self .avatar { background: #2980b9; } /* Self color */

    .msg-content {
      max-width: 70%;
    }

    .msg-header {
      font-size: 0.8rem;
      color: inherit;
      opacity: 0.8;
      margin-bottom: 4px;
      display: flex;
      gap: 10px;
    }
    
    .message.self .msg-header { justify-content: flex-end; }

    .bubble {
      padding: 12px 16px;
      border-radius: 12px;
      border-top-right-radius: 2px;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,0.1);
      line-height: 1.5;
      position: relative;
    }

    .message.self .bubble {
      border-radius: 12px;
      border-top-left-radius: 2px;
      border-top-right-radius: 12px;
    }
    
    .message.teacher .bubble {
        border-left: 3px solid #8e44ad;
        background: #faf5fb;
    }

    /* Input Area */
    .input-area {
      padding: 15px 25px;
      background: white;
      border-top: 1px solid #eee;
    }

    .toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .tool-btn {
      background: none;
      border: none;
      color: #95a5a6;
      cursor: pointer;
      padding: 5px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    
    .tool-btn:hover { background: #f0f2f5; color: #34495e; }

    .input-wrapper {
        display: flex;
        gap: 10px;
        background: #f0f2f5;
        padding: 5px;
        border-radius: 30px;
        border: 1px solid #e0e0e0;
        transition: border 0.2s, box-shadow 0.2s;
    }

    .input-wrapper:focus-within {
        border-color: #2980b9;
        box-shadow: 0 0 0 3px rgba(41, 128, 185, 0.1);
        background: white;
    }

    .chat-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 10px 15px;
      outline: none;
      font-family: inherit;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #2980b9;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.1s;
    }

    .send-btn:hover { background: #3498db; }
    .send-btn:active { transform: scale(0.95); }
    .send-btn:disabled { background: #ccc; cursor: not-allowed; }
    
    .send-btn .material-icons { 
        font-size: 1.2rem; 
        margin-right: -2px; /* Visual correction for send icon */
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
