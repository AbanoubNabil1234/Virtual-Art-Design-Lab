import { Component, inject } from '@angular/core';
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

      <!-- 4. Lessons List -->
      <div class="sidebar-label">قائمـــة الــدروس</div>
      <a *ngFor="let mod of modules"
         [routerLink]="['/module', mod.id]"
         routerLinkActive="active"
         class="sidebar-btn">
        {{ mod.titleAr }}
      </a>

      <!-- 5. Post-Achievement Test (Reuse pre-test) -->
      <a routerLink="/pre-test" class="sidebar-btn">الاختبار التحصيلي البعدي</a>
      
      <!-- 6. Post-Skill Test (Reuse pre-test) -->
      <a routerLink="/pre-test" class="sidebar-btn">الاختبار المهاري البعدي</a>
      
      <!-- 7. Try It Yourself (The Lab) -->
      <a routerLink="/lab" class="sidebar-btn">جرب بنفسك</a>

      <!-- 8. Notepad -->
      <a href="#" class="sidebar-btn">المفكره (ملاحظات)</a>

      <!-- 9. Question Bank (Calendar/Activities placeholder) -->
      <a href="#" class="sidebar-btn">بنك الاسئلة (التقويم)</a>
    </div>
  `,
  styles: []
})
export class SidebarComponent {
  moduleService = inject(ModuleService);
  modules = this.moduleService.getModules();
}
