import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-general-goals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col py-8 px-6 home-content" style="direction: rtl; font-family: 'Noto Kufi Arabic', Arial, sans-serif;">
      
      <div *ngIf="pageData">
        <h1 class="animate-fade-in-up" style="font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 2rem; border-bottom: 2px solid #ddd; padding-bottom: 1rem;">
            {{ pageData.title }}
        </h1>

        <div class="animate-fade-in-up delay-100 goal-content" [innerHTML]="pageData.content"></div>

        <div class="animate-fade-in-up delay-200" style="margin-top: 2rem; text-align: center;">
            <div style="font-size: 1rem; color: #555; margin-bottom: 8px;">إعــداد الباحث</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #1a1a1a;">أحمد عدنان ياسين</div>
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
