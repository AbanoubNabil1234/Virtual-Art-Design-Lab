import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-design-concepts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-container animate-fade-in-up" style="direction: rtl; font-family: 'Noto Kufi Arabic', Arial, sans-serif; padding: 2rem;">
      <div *ngIf="pageData" class="page-content">
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 2rem; border-bottom: 2px solid #6b4226; padding-bottom: 0.5rem; display: inline-block;">
            {{ pageData.title }}
        </h2>
        
        <div style="font-size: 1.2rem; line-height: 2; color: #444; max-width: 900px;">
            {{ pageData.content }}
        </div>
      </div>
    </div>
  `
})
export class DesignConceptsComponent {
  private contentService = inject(ContentService);
  pageData = this.contentService.getPage('design-concepts');
}
