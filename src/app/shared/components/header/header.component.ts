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
    <div class="site-header">
      <div class="header-inner">
        <div class="flex items-center justify-between">
          <div>
            <div class="header-title">المعمل الافتراضي للتصميم في التربية الفنية – المرحلة الثانوية</div>
            <div class="header-user">Virtual Art Design Lab</div>
          </div>
          <button (click)="toggleMenu.emit()" class="md:hidden p-2" style="color:#888; background:none; border:none; cursor:pointer;" aria-label="فتح القائمة">
            <span class="material-icons" style="font-size:28px;">menu</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sub Navigation Bar (tab strip like reference) -->
    <div class="sub-nav">
      <a routerLink="/" class="active-tab">الرئيسية</a>
      <a href="#">التعليمات</a>
      <a routerLink="/lab">جرب بنفسك (المعمل الافتراضي)</a>
      <a routerLink="/chat-room" routerLinkActive="active-tab">غرفة الحوار</a>
      <a routerLink="/email" routerLinkActive="active-tab">البريد الإلكتروني</a>
      <a routerLink="/forum" routerLinkActive="active-tab">المنتدى</a>
      <a (click)="showSearch.set(true)" style="display:flex;align-items:center;gap:4px;cursor:pointer;">
        <span class="material-icons" style="font-size:14px;">search</span>
        ابحث هنا
      </a>
    </div>

    <app-global-search *ngIf="showSearch()" (close)="showSearch.set(false)"></app-global-search>
  `,
  styles: []
})
export class HeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();
  showSearch = signal(false);
}
