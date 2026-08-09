import { Component, inject } from '@angular/core';
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
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center text-white shadow-lg">
              <span class="material-icons text-3xl">forum</span>
            </div>
            <div>
              <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">المنتدى التعليمي</h1>
              <p class="text-gray-500 font-medium">منتدى مخصص لنقاش الدروس الستة فقط</p>
            </div>
          </div>

          <div class="relative group">
            <span class="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="ابحث عن درس..."
              [(ngModel)]="searchQuery"
              class="w-full sm:w-64 pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div
            *ngFor="let topic of filteredTopics()"
            class="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6">

            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-primary/5 transition-colors">
              <span class="material-icons text-gray-400">chat_bubble_outline</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {{ topic.lessonNumber }}
                </span>
                <span class="text-xs text-gray-400 font-medium">{{ topic.date }}</span>
              </div>

              <h2 class="text-xl font-bold text-gray-800 mb-2 truncate">
                <a [routerLink]="['/forum', topic.id]" class="hover:text-primary transition-colors">
                  {{ topic.title }}
                </a>
              </h2>

              <p class="text-sm text-gray-500 font-medium line-clamp-2 mb-3">
                {{ topic.content }}
              </p>

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

            <div class="hidden md:flex flex-col items-end gap-2">
              <a [routerLink]="['/forum', topic.id]" class="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all" data-sound="select">
                <span>عرض النقاش</span>
                <span class="material-icons text-sm rtl-flip">arrow_back</span>
              </a>
            </div>
          </div>

          <div *ngIf="filteredTopics().length === 0" class="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span class="material-icons text-6xl text-gray-200 mb-4">search_off</span>
            <p class="text-gray-500 font-bold text-lg">لم يتم العثور على درس يطابق بحثك</p>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between text-sm text-gray-400 font-medium">
          <p>إجمالي المواضيع المتاحة: {{ forumService.getTopics()().length }}</p>
        </div>
      </main>
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

  filteredTopics() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.forumService.getTopics()();

    return this.forumService.getTopics()().filter((topic) =>
      topic.title.toLowerCase().includes(query) ||
      topic.lessonNumber.toLowerCase().includes(query) ||
      topic.content.toLowerCase().includes(query)
    );
  }
}
