import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalSearchComponent } from '../global-search/global-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, GlobalSearchComponent],
  template: `
    <!-- Main Header -->
    <header class="site-header">
      <div class="header-inner">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="header-title">المعمل الافتراضي للتصميم في التربية الفنية – المرحلة الثانوية</h1>
            <div class="header-user">Virtual Art Design Lab</div>
          </div>
          <button (click)="toggleMenu.emit()" 
                  class="md:hidden p-2 text-gray-400 hover:text-white transition-colors" 
                  aria-label="فتح القائمة">
            <span class="material-icons text-3xl">menu</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Sub Navigation Bar -->
    <nav class="sub-nav">
      <a routerLink="/" routerLinkActive="active-tab" [routerLinkActiveOptions]="{exact: true}">الرئيسية</a>
      <a routerLink="/instructions" routerLinkActive="active-tab">التعليمات</a>
      <a routerLink="/lab" routerLinkActive="active-tab">المعمل الافتراضي</a>
      <a routerLink="/chat-room" routerLinkActive="active-tab">غرفة الحوار</a>
      <a routerLink="/email" routerLinkActive="active-tab">البريد الإلكتروني</a>
      <a routerLink="/forum" routerLinkActive="active-tab">المنتدى</a>
      <a (click)="showSearch.set(true)" class="flex items-center gap-1 cursor-pointer">
        <span class="material-icons text-sm">search</span>
        <span>بحث</span>
      </a>
    </nav>

    <app-global-search *ngIf="showSearch()" (close)="showSearch.set(false)"></app-global-search>
  `,
  styles: []
})
export class HeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();
  showSearch = signal(false);
}
