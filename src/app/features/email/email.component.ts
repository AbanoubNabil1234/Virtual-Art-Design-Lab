import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="email-container animate-fade-in">
      <!-- Header -->
      <div class="email-header">
        <div class="header-right">
          <span class="material-icons globe-icon">public</span>
          <h1>البريد الإلكتروني</h1>
        </div>
        <div class="header-left">
          <span>مرحباً: أحمد عدنان ياسين</span>
          <span class="material-icons mail-icon">account_circle</span>
        </div>
      </div>

      <!-- Top Navigation Tabs -->
      <div class="email-nav">
        <button class="nav-item" [class.active]="activeTab === 'compose'" (click)="activeTab = 'compose'">
          <span class="material-icons">edit</span>
          <span>إنشاء رسالة</span>
        </button>
        <button class="nav-item" [class.active]="activeTab === 'inbox'" (click)="activeTab = 'inbox'">
          <span class="material-icons">inbox</span>
          <span>الوارد</span>
        </button>
        <button class="nav-item" [class.active]="activeTab === 'sent'" (click)="activeTab = 'sent'">
          <span class="material-icons">send</span>
          <span>الصادر</span>
        </button>
        <button class="nav-item" [class.active]="activeTab === 'drafts'" (click)="activeTab = 'drafts'">
          <span class="material-icons">drafts</span>
          <span>مسودة</span>
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="email-body">
        <div class="email-content">
          
          <!-- Compose View -->
          <div class="compose-view" *ngIf="activeTab === 'compose'">
            <div class="view-header">
              <h2>رسالة جديدة</h2>
              <div class="toolbar">
                <button class="action-btn send">
                  <span class="material-icons">send</span>
                  إرسال
                </button>
                <button class="action-btn save">
                  <span class="material-icons">save</span>
                  حفظ
                </button>
              </div>
            </div>

            <div class="form-container">
              <div class="form-group">
                <label>إلى:</label>
                <select class="form-control">
                  <option>اختر المرسل إليه...</option>
                  <option>المعلم (Teacher)</option>
                  <option>زميل 1</option>
                  <option>زميل 2</option>
                </select>
              </div>

              <div class="form-group">
                <label>الموضوع:</label>
                <input type="text" class="form-control" placeholder="أدخل عنوان الموضوع">
              </div>

              <div class="form-group">
                <label>المرفقات:</label>
                <div class="file-input-wrapper">
                  <button>رفع ملف</button>
                  <span>لم يتم اختيار ملف</span>
                </div>
              </div>

              <div class="editors-wrapper">
                 <div class="editor-toolbar">
                    <span class="material-icons">format_bold</span>
                    <span class="material-icons">format_italic</span>
                    <span class="material-icons">format_underlined</span>
                    <span class="separator">|</span>
                    <span class="material-icons">format_align_right</span>
                    <span class="material-icons">format_align_center</span>
                    <span class="material-icons">format_align_left</span>
                    <span class="separator">|</span>
                    <span class="material-icons">format_list_bulleted</span>
                    <span class="material-icons">format_list_numbered</span>
                  </div>
                  <textarea class="editor-textarea" placeholder="اكتب نص الرسالة هنا..."></textarea>
              </div>
            </div>
          </div>

          <!-- Inbox View -->
          <div class="inbox-view" *ngIf="activeTab === 'inbox'">
            <div class="empty-state">
              <div class="icon-circle">
                <span class="material-icons">inbox</span>
              </div>
              <h3>صندوق الوارد فارغ</h3>
              <p>لا توجد رسائل جديدة لعرضها حالياً.</p>
            </div>
          </div>

          <!-- Sent View -->
           <div class="inbox-view" *ngIf="activeTab === 'sent'">
            <div class="empty-state">
              <div class="icon-circle">
                <span class="material-icons">send</span>
              </div>
              <h3>لا توجد رسائل مرسلة</h3>
            </div>
          </div>

          <!-- Drafts View -->
           <div class="inbox-view" *ngIf="activeTab === 'drafts'">
            <div class="empty-state">
              <div class="icon-circle">
                <span class="material-icons">drafts</span>
              </div>
              <h3>لا توجد مسودات</h3>
            </div>
          </div>

        </div>
      </div>
      
      <div class="email-footer">
        &copy; 2026 جميع الحقوق محفوظة - المعمل الافتراضي
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      background-color: #f8f9fa;
    }

    .email-container {
      background: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 20px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    /* --- Header --- */
    .email-header {
      background: #1e1e1e; /* Dark professional header */
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #6b4226; /* Accent color from site */
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .header-right h1 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 500;
    }

    .globe-icon { font-size: 1.8rem; color: #6b4226; } /* Accent */
    
    .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        color: #ccc;
    }

    /* --- Top Navigation --- */
    .email-nav {
        background: #2d2d2d;
        display: flex;
        padding: 0 2rem;
        gap: 5px;
    }

    .nav-item {
        background: transparent;
        border: none;
        color: #aaa;
        padding: 15px 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        font-family: inherit;
        border-bottom: 3px solid transparent;
        transition: all 0.3s;
    }

    .nav-item:hover {
        background: rgba(255,255,255,0.05);
        color: white;
    }

    .nav-item.active {
        color: white;
        background: #3a3a3a;
        border-bottom-color: #6b4226; /* Accent */
    }

    .nav-item .material-icons { font-size: 1.2rem; }

    /* --- Body --- */
    .email-body {
        flex: 1;
        background: #f4f6f8;
        padding: 2rem;
        overflow-y: auto;
    }

    .email-content {
        max-width: 1000px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        min-height: 500px;
        display: flex;
        flex-direction: column;
    }

    /* --- Compose --- */
    .compose-view {
        padding: 2rem;
    }

    .view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
    }

    .view-header h2 {
        font-size: 1.5rem;
        color: #333;
        margin: 0;
    }

    .toolbar { display: flex; gap: 10px; }

    .action-btn {
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
    }

    .action-btn.send {
        background: #6b4226; /* Site accent */
        color: white;
    }

    .action-btn.send:hover { background: #5a3720; }

    .action-btn.save {
        background: #e0e0e0;
        color: #333;
    }
    
    .action-btn.save:hover { background: #d0d0d0; }

    .form-container { display: flex; flex-direction: column; gap: 1.5rem; }

    .form-group { display: flex; align-items: center; gap: 1rem; }

    .form-group label {
        width: 80px;
        font-weight: 600;
        color: #555;
    }

    .form-control {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
    }

    .form-control:focus { outline: none; border-color: #6b4226; }

    .file-input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .file-input-wrapper button {
        background: white;
        border: 1px solid #ccc;
        padding: 5px 15px;
        border-radius: 4px;
        cursor: pointer;
    }

    .editors-wrapper {
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 1rem;
    }

    .editor-toolbar {
        background: #f9f9f9;
        padding: 8px 15px;
        border-bottom: 1px solid #ddd;
        display: flex;
        gap: 15px;
        color: #666;
    }

    .editor-toolbar span { cursor: pointer; }
    .editor-toolbar span:hover { color: #000; }

    .editor-textarea {
        width: 100%;
        border: none;
        padding: 20px;
        min-height: 250px;
        font-family: inherit;
        resize: vertical;
        outline: none;
    }

    /* --- Empty States --- */
    .inbox-view {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3rem;
    }

    .empty-state {
        text-align: center;
        color: #777;
    }

    .icon-circle {
        background: #f0f0f0;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem auto;
    }

    .icon-circle .material-icons { font-size: 2.5rem; color: #bbb; }

    /* --- Footer --- */
    .email-footer {
        text-align: center;
        padding: 1rem;
        color: #777;
        font-size: 0.85rem;
        background: white;
        border-top: 1px solid #eee;
    }
  `]
})
export class EmailComponent {
  activeTab: 'compose' | 'inbox' | 'sent' | 'drafts' = 'compose';
}
