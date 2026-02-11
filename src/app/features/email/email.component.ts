import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-gray-50 animate-fade-in shadow-xl rounded-lg overflow-hidden border border-gray-200">
      <!-- Header -->
      <div class="bg-gray-900 text-white px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-primary">
        <div class="flex items-center gap-3">
          <span class="material-icons text-primary text-3xl">public</span>
          <h1 class="text-xl font-bold">البريد الإلكتروني</h1>
        </div>
        <div class="flex items-center gap-3 text-sm text-gray-400">
          <span>مرحباً: أحمد عدنان ياسين</span>
          <span class="material-icons text-2xl">account_circle</span>
        </div>
      </div>

      <!-- Top Navigation Tabs -->
      <div class="bg-gray-800 flex flex-wrap px-2 md:px-6">
        <button *ngFor="let tab of tabs" 
                (click)="activeTab = tab.id"
                class="flex items-center gap-2 px-4 py-4 text-sm md:text-base font-semibold transition-all border-b-4"
                [class.text-white]="activeTab === tab.id"
                [class.border-primary]="activeTab === tab.id"
                [class.bg-gray-700]="activeTab === tab.id"
                [class.text-gray-400]="activeTab !== tab.id"
                [class.border-transparent]="activeTab !== tab.id"
                [class.hover:text-white]="activeTab !== tab.id">
          <span class="material-icons text-lg">{{tab.icon}}</span>
          <span>{{tab.label}}</span>
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8">
        <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
          
          <!-- Compose View -->
          <div class="p-6 md:p-8 flex-1" *ngIf="activeTab === 'compose'">
            <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 class="text-2xl font-bold text-gray-800">رسالة جديدة</h2>
              <div class="flex gap-2">
                <button class="btn-primary py-2 px-6 flex items-center gap-2">
                  <span class="material-icons text-sm">send</span>
                  إرسال
                </button>
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  <span class="material-icons text-sm">save</span>
                  حفظ
                </button>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <label class="w-20 font-bold text-gray-600">إلى:</label>
                <select class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  <option>اختر المرسل إليه...</option>
                  <option>المعلم (Teacher)</option>
                  <option>زميل 1</option>
                  <option>زميل 2</option>
                </select>
              </div>

              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <label class="w-20 font-bold text-gray-600">الموضوع:</label>
                <input type="text" placeholder="أدخل عنوان الموضوع" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              </div>

              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <label class="w-20 font-bold text-gray-600">المرفقات:</label>
                <div class="flex-1 flex items-center gap-3">
                  <button class="bg-white border-2 border-dashed border-gray-300 hover:border-primary text-gray-500 hover:text-primary px-4 py-2 rounded-lg transition-all text-sm font-semibold">
                    + رفع ملف
                  </button>
                  <span class="text-xs text-gray-400">لم يتم اختيار ملف</span>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                 <div class="bg-gray-50 p-2 border-b border-gray-200 flex flex-wrap gap-4 text-gray-500">
                    <span class="material-icons cursor-pointer hover:text-primary">format_bold</span>
                    <span class="material-icons cursor-pointer hover:text-primary">format_italic</span>
                    <span class="material-icons cursor-pointer hover:text-primary">format_underlined</span>
                    <div class="w-px h-6 bg-gray-300 mx-1"></div>
                    <span class="material-icons cursor-pointer hover:text-primary">format_align_right</span>
                    <span class="material-icons cursor-pointer hover:text-primary">format_align_center</span>
                    <span class="material-icons cursor-pointer hover:text-primary">format_align_left</span>
                  </div>
                  <textarea placeholder="اكتب نص الرسالة هنا..." class="flex-1 p-4 min-h-[250px] outline-none resize-y text-lg"></textarea>
              </div>
            </div>
          </div>

          <!-- List Views (Inbox, Sent, Drafts) -->
          <div class="flex-1 flex flex-col justify-center items-center p-12 text-center" *ngIf="activeTab !== 'compose'">
            <div class="bg-gray-100 p-8 rounded-full mb-6">
              <span class="material-icons text-6xl text-gray-300">
                {{activeTab === 'inbox' ? 'inbox' : activeTab === 'sent' ? 'send' : 'drafts'}}
              </span>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">
              {{activeTab === 'inbox' ? 'صندوق الوارد فارغ' : activeTab === 'sent' ? 'لا توجد رسائل مرسلة' : 'لا توجد مسودات'}}
            </h3>
            <p class="text-gray-500 max-w-xs">لا توجد رسائل لعرضها حالياً في هذا القسم.</p>
          </div>

        </div>
      </div>
      
      <div class="text-center py-4 border-t border-gray-200 text-gray-400 text-sm bg-white">
        &copy; 2026 جميع الحقوق محفوظة - المعمل الافتراضي
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class EmailComponent {
  activeTab: 'compose' | 'inbox' | 'sent' | 'drafts' = 'compose';
  tabs = [
    { id: 'compose', label: 'إنشاء رسالة', icon: 'edit' },
    { id: 'inbox', label: 'الوارد', icon: 'inbox' },
    { id: 'sent', label: 'الصادر', icon: 'send' },
    { id: 'drafts', label: 'مسودة', icon: 'drafts' }
  ] as const;
}
