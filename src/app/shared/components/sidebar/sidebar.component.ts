import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      <!-- 0. Cover Page -->
      <a routerLink="/cover" routerLinkActive="active" class="sidebar-btn">الغلاف (الرئيسية)</a>

      <!-- 1. General Objectives -->
      <a routerLink="/general-goals" routerLinkActive="active" class="sidebar-btn">الأهداف العامـــة</a>

      <!-- Basic Concepts -->
      <div class="sidebar-label">مصطلحات أساسية</div>
      <a routerLink="/definition/virtual-lab" routerLinkActive="active" class="sidebar-btn">المعمل الافتراضي</a>
      <a routerLink="/definition/concepts" routerLinkActive="active" class="sidebar-btn">مفاهيم التصميم</a>
      <a routerLink="/definition/skills" routerLinkActive="active" class="sidebar-btn">مهارات التصميم</a>
      
      <!-- 2. Pre-Achievement Test -->
      <a routerLink="/pre-test" routerLinkActive="active" class="sidebar-btn">الاختبار التحصيلي القبلي</a>
      
      <!-- 3. Performance Test -->
      <a routerLink="/performance-test" routerLinkActive="active" class="sidebar-btn">الاختبار الأدائي (ب)</a>

      <!-- 4. Lessons List -->
      <button class="sidebar-btn flex justify-between items-center w-full" 
              (click)="toggleLessons()"
              [class.active]="showLessons()">
        <span>قائمـــة الــدروس</span>
        <span class="material-icons transition-transform duration-300" [class.rotate-180]="showLessons()">
          expand_more
        </span>
      </button>

      <div *ngIf="showLessons()" class="lessons-container">
        <a *ngFor="let mod of modules"
           [routerLink]="['/module', mod.id]"
           routerLinkActive="active"
           class="sidebar-btn-sub">
          <span class="material-icons text-sm opacity-50 ml-2">article</span>
          {{ mod.titleAr }}
        </a>
      </div>

      <!-- Tests & Utilities -->
      <a routerLink="/lab" routerLinkActive="active" class="sidebar-btn">المعمل الافتراضي</a>
      <a routerLink="/forum" routerLinkActive="active" class="sidebar-btn">المنتدى</a>
      <a routerLink="/notepad" routerLinkActive="active" class="sidebar-btn">الملاحظات</a>
      <a routerLink="/question-bank" routerLinkActive="active" class="sidebar-btn">بنك الاسئلة</a>
    </div>
  `,
  styles: [`
    .lessons-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-right: 0.625rem;
      border-right: 2px solid rgba(255,255,255,0.1);
      margin-right: 0.3125rem;
      animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-0.5rem); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SidebarComponent {
  moduleService = inject(ModuleService);
  modules = this.moduleService.getModules();

  // Signal for toggling lessons list
  showLessons = signal(false);

  toggleLessons() {
    this.showLessons.update(value => !value);
  }
}
