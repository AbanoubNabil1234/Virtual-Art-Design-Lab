import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-virtual-lab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-8 animate-fade-in-up">
      <div *ngIf="pageData">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 border-b-4 border-primary pb-2 inline-block">
            {{ pageData.title }}
        </h2>
        
        <div class="text-lg md:text-xl leading-relaxed text-gray-700 max-w-4xl">
            {{ pageData.content }}
        </div>
      </div>
    </div>
  `
})
export class VirtualLabComponent {
  private contentService = inject(ContentService);
  pageData = this.contentService.getPage('virtual-lab');
}
