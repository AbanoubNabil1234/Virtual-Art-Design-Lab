import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col gap-[5px]">
      <!-- 0. Cover Page -->
      <a routerLink="/cover" class="sidebar-btn">الغلاف (الرئيسية)</a>

      <!-- 1. General Objectives -->
      <a routerLink="/general-goals" class="sidebar-btn">الأهداف العامـــة</a>

      <!-- Basic Concepts -->
      <div class="sidebar-label" style="margin-top: 4px;">مصطلحات أساسية</div>
      <a routerLink="/definition/virtual-lab" class="sidebar-btn">المعمل الافتراضي</a>
      <a routerLink="/definition/concepts" class="sidebar-btn">مفاهيم التصميم</a>
      <a routerLink="/definition/skills" class="sidebar-btn">مهارات التصميم</a>
      
      <!-- 2. Pre-Achievement Test -->
      <a routerLink="/pre-test" class="sidebar-btn">الاختبار التحصيلي القبلي</a>
      
      <!-- 3. Performance Test (Test B) -->
      <a routerLink="/performance-test" class="sidebar-btn">الاختبار الأدائي (ب)</a>

      <!-- 4. Lessons List (Dropdown) -->
      <div class="sidebar-label" 
           (click)="toggleLessons()" 
           style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
        <span>قائمـــة الــدروس</span>
        <span class="material-icons" style="font-size: 1.2rem;">
          {{ showLessons() ? 'expand_less' : 'expand_more' }}
        </span>
      </div>

      <div *ngIf="showLessons()" class="lessons-container" style="padding-right: 10px; border-right: 2px solid #ddd; margin-right: 5px;">
        <a *ngFor="let mod of modules"
           [routerLink]="['/module', mod.id]"
           routerLinkActive="active"
           class="sidebar-btn"
           style="font-size: 0.9rem; padding: 8px 10px;">
          {{ mod.titleAr }}
        </a>
      </div>

      <!-- 5. Post-Achievement Test (Reuse pre-test) -->
      <a routerLink="/pre-test" class="sidebar-btn">الاختبار التحصيلي البعدي</a>
      
      <!-- 6. Post-Skill Test (Reuse pre-test) -->
      <a routerLink="/pre-test" class="sidebar-btn">الاختبار المهاري البعدي</a>
      
      <!-- 7. Try It Yourself (The Lab) -->
      <a routerLink="/lab" class="sidebar-btn">جرب بنفسك</a>

      <!-- 8. Forum (Moved here for visibility) -->
      <a routerLink="/forum" class="sidebar-btn">المنتدى</a>

      <!-- 9. Notepad -->
      <a routerLink="/notepad" class="sidebar-btn">المفكره (ملاحظات)</a>
      
      <!-- 9. Question Bank -->
      <a routerLink="/question-bank" class="sidebar-btn">بنك الاسئلة (التقويم)</a>
    </div>
  `,
  styles: [`
    .lessons-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: expand 0.3s ease-out;
    }
    @keyframes expand {
      from { opacity: 0; transform: translateY(-10px); }
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
