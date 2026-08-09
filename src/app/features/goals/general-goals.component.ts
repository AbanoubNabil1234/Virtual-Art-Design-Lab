import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-general-goals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col py-8 px-6 max-w-full overflow-hidden">
      
      <div *ngIf="pageData">
        <h1 class="animate-fade-in-up text-3xl font-extrabold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">
            {{ pageData.title }}
        </h1>

        <div class="animate-fade-in-up delay-100 goal-content" [innerHTML]="pageData.content"></div>

        <div class="animate-fade-in-up delay-200 mt-8 text-center bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <div class="text-sm text-gray-500 mb-1">إعــداد الباحث</div>
            <div class="text-lg font-bold text-gray-900">أحمد عدنان ياسين</div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    ::ng-deep .goal-content ul {
        list-style: none; padding: 0; font-size: 1.1rem; line-height: 2; color: #333;
    }
    ::ng-deep .goal-content li {
        margin-bottom: 12px; display: flex; align-items: flex-start;
    }
    ::ng-deep .goal-content li::before {
        content: 'fiber_manual_record';
        font-family: 'Material Icons';
        color: #6b4226;
        margin-left: 10px;
        font-size: 1.2rem;
        margin-top: 5px;
    }
  `]
})
export class GeneralGoalsComponent {
  private contentService = inject(ContentService);
  pageData = this.contentService.getPage('general-goals');
}
