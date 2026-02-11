import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
      <a href="#">جرب بنفسك (المعمل الافتراضي)</a>
      <a href="#">غرفة الحوار</a>
      <a href="#">البريد الإلكتروني</a>
      <a href="#">المنتدي</a>
      <a href="#" style="display:flex;align-items:center;gap:4px;">
        <span class="material-icons" style="font-size:14px;">search</span>
        ابحث هنا
      </a>
    </div>
  `,
  styles: []
})
export class HeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();
}
