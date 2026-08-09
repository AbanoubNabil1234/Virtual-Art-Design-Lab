import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService, SearchResult } from '../../../core/services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-global-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="search-overlay" (click)="close.emit()">
      <div class="search-modal" (click)="$event.stopPropagation()" @modalAnimation>
        
        <!-- Search Header -->
        <div class="search-header">
          <span class="material-icons search-icon">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onSearch()" 
            placeholder="ابحث عن موضوع، سؤال، أو ملاحظة..." 
            class="search-input"
            autoFocus>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Search Results -->
        <div class="search-body custom-scrollbar">
          
          <!-- Loading State -->
          <div *ngIf="isLoading" class="state-message">
            <div class="spinner"></div>
            <span>جاري البحث...</span>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && searchQuery && results().length === 0" class="state-message">
            <span class="material-icons big-icon">search_off</span>
            <span>لا توجد نتائج مطابقة لـ "{{searchQuery}}"</span>
          </div>

          <!-- Initial State -->
          <div *ngIf="!searchQuery" class="state-message hint">
            <span class="material-icons big-icon">manage_search</span>
            <span>اكتب ما تبحث عنه للبدء</span>
          </div>

          <!-- Results List -->
          <div *ngIf="results().length > 0" class="results-list">
            <div *ngFor="let result of results()" class="result-item" (click)="navigateTo(result)">
              <div class="result-icon">
                <span class="material-icons" [ngClass]="getIconClass(result.type)">{{ getIcon(result.type) }}</span>
              </div>
              <div class="result-content">
                <div class="result-title">{{ result.title }}</div>
                <div class="result-meta">
                  <span class="result-type">{{ result.type }}</span>
                  <span class="separator">•</span>
                  <span class="result-desc">{{ result.description }}</span>
                </div>
              </div>
              <span class="material-icons arrow-icon">arrow_back_ios_new</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
    styles: [`
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 80px;
    }

    .search-modal {
      width: 90%;
      max-width: 700px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
      animation: slideIn 0.3s ease-out;
    }

    .search-header {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      background: #f8f9fa;
    }

    .search-icon {
      color: #7f8c8d;
      font-size: 24px;
      margin-left: 15px;
    }

    .search-input {
      flex: 1;
      border: none;
      background: none;
      font-size: 1.1rem;
      color: #2c3e50;
      outline: none;
      font-family: inherit;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #95a5a6;
      border-radius: 50%;
      padding: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #e2e6ea;
      color: #e74c3c;
    }

    .search-body {
      flex: 1;
      overflow-y: auto;
      padding: 10px 0;
      min-height: 300px;
    }

    .state-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #95a5a6;
      gap: 10px;
    }

    .big-icon {
      font-size: 48px;
      opacity: 0.5;
    }

    .results-list {
      display: flex;
      flex-direction: column;
    }

    .result-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.2s;
      border-bottom: 1px solid #f5f6fa;
    }

    .result-item:hover {
      background: #f8f9fa;
    }

    .result-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
    }

    .result-icon .material-icons {
      font-size: 20px;
      color: #555;
    }

    .icon-book { color: #3498db !important; }
    .icon-forum { color: #9b59b6 !important; }
    .icon-note { color: #f1c40f !important; }
    .icon-quiz { color: #2ecc71 !important; }

    .result-content {
      flex: 1;
      overflow: hidden;
    }

    .result-title {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-meta {
      display: flex;
      align-items: center;
      font-size: 0.85rem;
      color: #7f8c8d;
    }

    .result-type {
      font-weight: 500;
      color: #34495e;
    }

    .separator { margin: 0 6px; }

    .result-desc {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }

    .arrow-icon {
      font-size: 14px;
      color: #bdc3c7;
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
    animations: [
        trigger('modalAnimation', [
            transition(':enter', [
                style({ transform: 'translateY(-20px)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
            ])
        ])
    ]
})
export class GlobalSearchComponent {
    @Output() close = new EventEmitter<void>();

    private searchService = inject(SearchService);
    private router = inject(Router);

    searchQuery = '';
    results = signal<SearchResult[]>([]);
    isLoading = false;

    onSearch() {
        if (!this.searchQuery.trim()) {
            this.results.set([]);
            return;
        }

        this.isLoading = true;
        this.searchService.search(this.searchQuery).subscribe(res => {
            this.results.set(res);
            this.isLoading = false;
        });
    }

    navigateTo(result: SearchResult) {
        this.router.navigateByUrl(result.route);
        this.close.emit();
    }

    getIcon(type: string): string {
        switch (type) {
            case 'صفحات الكتاب': return 'menu_book';
            case 'المنتدى': return 'forum';
            case 'المفكرة': return 'edit_note';
            case 'بنك الأسئلة': return 'quiz';
            default: return 'search';
        }
    }

    getIconClass(type: string): string {
        switch (type) {
            case 'صفحات الكتاب': return 'icon-book';
            case 'المنتدى': return 'icon-forum';
            case 'المفكرة': return 'icon-note';
            case 'بنك الأسئلة': return 'icon-quiz';
            default: return '';
        }
    }
}
