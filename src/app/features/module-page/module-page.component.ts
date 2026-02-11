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
      <div class="py-2">
        
        <!-- Module Title -->
        <div class="text-center mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {{ mod.titleAr }}
          </h1>
          <h2 class="text-sm md:text-base text-gray-500 italic">
            {{ mod.titleEn }}
          </h2>
        </div>

        <!-- Description -->
        <div class="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-6 mb-8 text-base md:text-lg leading-relaxed text-gray-800 shadow-inner">
          {{ mod.descriptionAr }}
        </div>

        <!-- Topics -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-gray-900 mb-4 border-r-4 border-secondary pr-3">
            المحتوى العلمي:
          </h3>
          <ul class="list-disc pr-10 text-base leading-loose text-gray-700">
            @for (topic of mod.topics; track topic) {
              <li>{{ topic }}</li>
            }
          </ul>
        </div>

        <!-- Experiment Steps -->
        @if (mod.experimentSteps) {
          <div class="border-2 border-gray-600 outline outline-2 outline-gray-400 outline-offset-4 rounded-sm p-5 bg-white shadow-sm mb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 border-r-4 border-primary pr-3">
              خطوات التجربة:
            </h3>
            <ol class="list-decimal pr-10 text-base leading-relaxed text-gray-700 space-y-3">
              @for (step of mod.experimentSteps; track step) {
                <li>{{ step }}</li>
              }
            </ol>
            <div class="text-center mt-8">
              <button class="btn-action px-10 py-4 text-base shadow-xl">
                <span>فتح المحاكاة (بدء التجربة)</span>
                <span class="material-icons">rocket_launch</span>
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
