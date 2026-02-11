import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from '../../core/services/module.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (module(); as mod) {
      <div style="direction: rtl; padding: 8px 0;">
        
        <!-- Module Title -->
        <h1 style="font-size: 1.6rem; font-weight: 700; color: #1a1a1a; text-align: center; margin-bottom: 6px; font-family: 'Noto Kufi Arabic', Arial, sans-serif;">
          {{ mod.titleAr }}
        </h1>
        <h2 style="font-size: 0.95rem; color: #777; text-align: center; margin-bottom: 24px; font-style: italic;">
          {{ mod.titleEn }}
        </h2>

        <!-- Description -->
        <div style="
          background: #f8f8f8;
          border: 2px solid #bbb;
          padding: 16px 20px;
          margin-bottom: 24px;
          font-size: 0.95rem;
          line-height: 1.8;
          color: #333;
        ">
          {{ mod.descriptionAr }}
        </div>

        <!-- Topics -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; border-right: 4px solid #3a3a55; padding-right: 10px;">
            المحتوى العلمي:
          </h3>
          <ul style="list-style: disc; padding-right: 24px; font-size: 0.9rem; line-height: 2; color: #333;">
            @for (topic of mod.topics; track topic) {
              <li>{{ topic }}</li>
            }
          </ul>
        </div>

        <!-- Experiment Steps -->
        @if (mod.experimentSteps) {
          <div style="
            border: 3px solid #555;
            outline: 2px solid #999;
            outline-offset: 3px;
            padding: 20px;
            background: #fafafa;
          ">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin-bottom: 14px; border-right: 4px solid #c9a84c; padding-right: 10px;">
              خطوات التجربة:
            </h3>
            <ol style="list-style: decimal; padding-right: 24px; font-size: 0.9rem; line-height: 2.2; color: #333;">
              @for (step of mod.experimentSteps; track step) {
                <li>{{ step }}</li>
              }
            </ol>
            <div style="text-align: center; margin-top: 20px;">
              <button style="
                padding: 8px 28px;
                background: linear-gradient(to bottom, #555577, #3d3d55);
                border: 2px outset #777;
                border-radius: 4px;
                color: #ddd;
                font-family: 'Noto Kufi Arabic', Arial, sans-serif;
                font-weight: 700;
                font-size: 0.85rem;
                cursor: pointer;
              ">
                فتح المحاكاة
              </button>
            </div>
          </div>
        }

      </div>
    } @else {
      <div style="text-align: center; padding: 60px 0; color: #999;">
        جاري التحميل...
      </div>
    }
  `
})
export class ModulePageComponent {
  private route = inject(ActivatedRoute);
  private moduleService = inject(ModuleService);

  private paramId = toSignal(this.route.paramMap);

  module = computed(() => {
    const id = this.paramId()?.get('id');
    return id ? this.moduleService.getModuleById(id) : undefined;
  });
}
