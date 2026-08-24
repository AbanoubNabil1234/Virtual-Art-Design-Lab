import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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

      <a routerLink="/definition/virtual-lab" routerLinkActive="active" class="sidebar-btn">تعريف المعمل الافتراضي</a>
      <a routerLink="/definition/concepts" routerLinkActive="active" class="sidebar-btn">مفاهيم التصميم</a>
      <a routerLink="/definition/skills" routerLinkActive="active" class="sidebar-btn">مهارات التصميم</a>
      
      <!-- 2. Achievement & Performance Tests Hub -->
      <a routerLink="/tests" routerLinkActive="active" class="sidebar-btn">الاختبارات</a>

      <!-- 4. Lessons List -->
      <button class="sidebar-btn flex justify-between items-center w-full" 
              (click)="toggleLessons()"
              [class.active]="showLessons()">
        <span>قائمـــة الــدروس (الفتح المتسلسل)</span>
        <span class="material-icons transition-transform duration-300" [class.rotate-180]="showLessons()">
          expand_more
        </span>
      </button>

      <div *ngIf="showLessons()" class="lessons-container">
        <button *ngFor="let mod of modules"
                (click)="onModuleClick(mod.id)"
                data-sound="lessonOpen"
                class="sidebar-btn-sub w-full text-right flex items-center justify-between transition-colors"
                [class.opacity-60]="!moduleService.isModuleUnlocked(mod.id)">
          <div class="flex items-center gap-1.5 overflow-hidden">
            <span class="material-icons text-sm opacity-50 flex-shrink-0">article</span>
            <span class="truncate text-xs font-bold">{{ mod.titleAr }}</span>
          </div>

          <div class="flex items-center gap-1 flex-shrink-0">
            <span *ngIf="moduleService.getModuleProgress(mod.id)?.completed"
                  class="material-icons text-xs text-emerald-400" title="تم اجتياز اختبار الدرس">check_circle</span>
            <span *ngIf="!moduleService.isModuleUnlocked(mod.id)"
                  class="material-icons text-xs text-amber-400" title="درس مغلق">lock</span>
          </div>
        </button>
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
  private router = inject(Router);

  modules = this.moduleService.getModules();
  showLessons = signal(false);

  toggleLessons() {
    this.showLessons.update(value => !value);
  }

  onModuleClick(moduleId: string) {
    if (this.moduleService.isModuleUnlocked(moduleId)) {
      this.router.navigate(['/module', moduleId]);
    } else {
      const reason = this.moduleService.getModuleLockReason(moduleId);
      alert(`🔒 هذا الدرس مغلق حالياً!\n\n${reason}`);
    }
  }
}
