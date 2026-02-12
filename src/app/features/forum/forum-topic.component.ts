import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ForumService, Topic } from '../../core/services/forum.service';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-forum-topic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50/50">
      <app-header></app-header>
      
      <main class="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in" *ngIf="topic()">
        
        <!-- Breadcrumb & Actions -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <nav class="flex items-center gap-2 text-sm font-bold">
            <a routerLink="/forum" class="text-gray-400 hover:text-primary transition-colors">المنتدى</a>
            <span class="material-icons text-xs text-gray-300 rtl-flip">arrow_back</span>
            <span class="text-gray-900 truncate max-w-[200px]">{{ topic()?.title }}</span>
          </nav>
          
          <a routerLink="/forum" class="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1 transition-colors">
            <span class="material-icons text-sm">keyboard_return</span>
            <span>العودة لقائمة المواضيع</span>
          </a>
        </div>

        <!-- Main Topic Card -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10 transition-shadow hover:shadow-md">
          <div class="bg-gradient-to-r from-secondary/5 to-transparent p-6 md:p-8 border-b border-gray-100">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">منشور أصلي</span>
              <span class="text-xs text-gray-400 font-medium">{{ topic()?.date }}</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">
              {{ topic()?.title }}
            </h1>
            
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 shadow-inner">
                <span class="material-icons text-2xl">person</span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-gray-900 leading-none mb-1">{{ topic()?.author }}</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase">ناشر الموضوع</span>
              </div>
            </div>
          </div>
          
          <div class="p-6 md:p-8">
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium">
              <p>مرحباً بجميع الزملاء، أود طرح هذا الموضوع للنقاش حول مهارات التصميم الرقمي في بيئة المعمل الافتراضي...</p>
              <p class="mt-4">بانتظار تفاعلكم وآرائكم القيمة.</p>
            </div>
            
            <div class="mt-10 flex items-center gap-6 pt-6 border-t border-gray-50">
              <div class="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <span class="material-icons text-xl">favorite_border</span>
                <span class="text-sm font-bold">إعجاب</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors cursor-pointer">
                <span class="material-icons text-xl">share</span>
                <span class="text-sm font-bold">مشاركة</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Replies Section -->
        <div class="space-y-6 mb-12">
          <div class="flex items-center gap-3 mb-6">
            <h3 class="text-xl font-black text-gray-900">التعليقات والردود</h3>
            <span class="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">{{ topic()?.replies?.length }} نقاش</span>
          </div>

          <div *ngFor="let reply of topic()?.replies; let i = index" 
               class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 animate-fade-in"
               [style.animation-delay]="i * 0.1 + 's'">
            <div class="flex-shrink-0 hidden sm:block">
              <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                <span class="material-icons">face</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-3">
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span class="font-bold text-gray-900 text-sm">{{ reply.author }}</span>
                  <span class="text-[10px] text-gray-300 font-bold">• {{ reply.date }}</span>
                </div>
                <span class="text-[10px] font-bold text-gray-200">#{{ reply.id }}</span>
              </div>
              <div class="text-gray-600 text-[15px] leading-relaxed font-medium">
                {{ reply.content }}
              </div>
              <div class="mt-4 flex gap-4">
                <button class="text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-wider transition-colors">إعجاب</button>
                <button class="text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-wider transition-colors">رد</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Reply Form -->
        <div id="reply-form" class="bg-white rounded-3xl shadow-xl border border-gray-100 mb-20 overflow-hidden">
          <div class="bg-gray-900 p-6 text-white flex items-center gap-3">
            <span class="material-icons text-primary/80">reply</span>
            <h3 class="text-lg font-bold">إضافة مشاركة جديدة</h3>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 mr-1 uppercase">اسم المشارك</label>
                <div class="relative">
                  <span class="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">person_outline</span>
                  <input type="text" [(ngModel)]="replyAuthor" placeholder="اكتب اسمك هنا..." class="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700">
                </div>
              </div>
              <div class="hidden sm:block"></div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="text-xs font-black text-gray-400 uppercase">نص المشاركة</label>
                <div class="flex gap-2">
                  <span class="material-icons text-base text-gray-300 cursor-pointer hover:text-primary transition-colors">format_bold</span>
                  <span class="material-icons text-base text-gray-300 cursor-pointer hover:text-primary transition-colors">format_italic</span>
                  <span class="material-icons text-base text-gray-300 cursor-pointer hover:text-primary transition-colors">image</span>
                </div>
              </div>
              <textarea [(ngModel)]="replyContent" 
                        placeholder="اكتب ردك أو استفسارك باحترافية..." 
                        class="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 min-h-[150px] resize-none"></textarea>
            </div>

            <div class="flex justify-end pt-4 border-t border-gray-50">
              <button (click)="addReply()" class="btn-action px-10 shadow-lg py-4">
                <span class="material-icons">send</span>
                <span>إرسال الرد الآن</span>
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }
    .prose p {
      margin-top: 1.25em;
      margin-bottom: 1.25em;
    }
  `]
})
export class ForumTopicComponent {
  route = inject(ActivatedRoute);
  forumService = inject(ForumService);

  topicId = Number(this.route.snapshot.paramMap.get('id'));
  topic = computed(() => this.forumService.getTopic(this.topicId));

  replyAuthor = '';
  replyContent = '';

  addReply() {
    if (this.replyAuthor && this.replyContent) {
      this.forumService.addReply(this.topicId, this.replyAuthor, this.replyContent);
      this.replyContent = '';
    }
  }
}
