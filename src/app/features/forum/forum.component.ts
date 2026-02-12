import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ForumService } from '../../core/services/forum.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50/50">
      <app-header></app-header>
      <main class="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
        
        <!-- Forum Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center text-white shadow-lg">
              <span class="material-icons text-3xl">forum</span>
            </div>
            <div>
              <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">المنتدى التعليمي</h1>
              <p class="text-gray-500 font-medium">تبادل الخبرات والأفكار في مهارات التصميم</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative group">
              <span class="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input type="text" 
                     placeholder="ابحث عن موضوع..." 
                     [(ngModel)]="searchQuery"
                     class="w-full sm:w-64 pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
            </div>
            <button class="btn-action shadow-lg" (click)="showNewTopicModal = true">
              <span class="material-icons">add_circle</span>
              <span>إضافة موضوع جديد</span>
            </button>
          </div>
        </div>

        <!-- Topics Grid -->
        <div class="grid grid-cols-1 gap-4">
          <div *ngFor="let topic of filteredTopics()" 
               class="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6">
            
            <!-- Selection/Icon Section -->
            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-primary/5 transition-colors">
              <span class="material-icons" [class.text-amber-500]="topic.isPinned" [class.text-gray-400]="!topic.isPinned">
                {{ topic.isPinned ? 'push_pin' : 'chat_bubble_outline' }}
              </span>
            </div>

            <!-- Content Section -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span *ngIf="topic.isPinned" class="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">مثبت</span>
                <span class="text-xs text-gray-400 font-medium">{{ topic.date }}</span>
              </div>
              <h2 class="text-xl font-bold text-gray-800 mb-2 truncate">
                <a [routerLink]="['/forum', topic.id]" class="hover:text-primary transition-colors">
                  {{ topic.title }}
                </a>
              </h2>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1.5 font-medium">
                  <span class="material-icons text-sm">person</span>
                  {{ topic.author }}
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="material-icons text-sm">visibility</span>
                  {{ topic.views }} مشاهدة
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="material-icons text-sm">comment</span>
                  {{ topic.replies.length }} ردود
                </div>
              </div>
            </div>

            <!-- Action Section (Desktop) -->
            <div class="hidden md:flex flex-col items-end gap-2">
              <a [routerLink]="['/forum', topic.id]" class="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                <span>عرض النقاش</span>
                <span class="material-icons text-sm rtl-flip">arrow_back</span>
              </a>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredTopics().length === 0" class="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span class="material-icons text-6xl text-gray-200 mb-4">search_off</span>
            <p class="text-gray-500 font-bold text-lg">لم يتم العثور على مواضيع تطابق بحثك</p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 flex items-center justify-between text-sm text-gray-400 font-medium">
          <p>إجمالي المواضيع المتاحة: {{ forumService.getTopics()().length }}</p>
          <p>© معمل التصميم الافتراضي - 2024</p>
        </div>
      </main>

      <!-- New Topic Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in" *ngIf="showNewTopicModal" (click)="showNewTopicModal = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
            <div class="bg-gradient-to-r from-secondary to-secondary-dark p-6 text-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-icons">add_comment</span>
                <h2 class="text-xl font-bold">بدء نقاش جديد</h2>
              </div>
              <button (click)="showNewTopicModal = false" class="hover:rotate-90 transition-transform">
                <span class="material-icons">close</span>
              </button>
            </div>
            
            <div class="p-8 space-y-5">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 mr-1">عنوان الموضوع</label>
                <input type="text" placeholder="ماذا يدور في ذهنك؟" [(ngModel)]="newTopicTitle" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium">
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 mr-1">الاسم الكريم</label>
                <input type="text" placeholder="اسمك الذي سيظهر للجميع" [(ngModel)]="newTopicAuthor" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium">
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 mr-1">التفاصيل</label>
                <textarea placeholder="اشرح فكرتك أو اطرح سؤالك هنا بالتفصيل..." [(ngModel)]="newTopicContent" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium min-h-[120px] resize-none"></textarea>
              </div>

              <div class="flex gap-4 pt-4">
                <button (click)="addTopic()" class="btn-action flex-1 shadow-lg py-4">
                  <span class="material-icons">publish</span>
                  <span>نشر الموضوع</span>
                </button>
                <button (click)="showNewTopicModal = false" class="btn-secondary px-8">إلغاء</button>
              </div>
            </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }
  `]
})
export class ForumComponent {
  forumService = inject(ForumService);
  searchQuery = '';

  showNewTopicModal = false;
  newTopicTitle = '';
  newTopicAuthor = '';
  newTopicContent = '';

  filteredTopics() {
    const query = this.searchQuery.toLowerCase();
    return this.forumService.getTopics()().filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.author.toLowerCase().includes(query)
    );
  }

  addTopic() {
    if (this.newTopicTitle && this.newTopicAuthor) {
      this.forumService.addTopic(this.newTopicTitle, this.newTopicAuthor, this.newTopicContent);
      this.showNewTopicModal = false;
      this.newTopicTitle = '';
      this.newTopicAuthor = '';
      this.newTopicContent = '';
    }
  }
}
