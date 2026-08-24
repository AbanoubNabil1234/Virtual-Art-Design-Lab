import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonSoundService } from '../../core/services/button-sound.service';
import { PerformanceTestService, PerformanceTask } from '../../core/services/performance-test.service';

@Component({
  selector: 'app-performance-test',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">

      <!-- SUCCESS TOAST BANNER WHEN A NEW TASK UNLOCKS -->
      <div *ngIf="unlockedToastMessage()"
           class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-emerald-400 font-bold text-sm md:text-base flex items-center gap-3 animate-bounce">
        <span class="material-icons text-2xl text-emerald-200">lock_open</span>
        <span>{{ unlockedToastMessage() }}</span>
        <button (click)="unlockedToastMessage.set(null)" class="text-xs bg-emerald-800 hover:bg-emerald-900 px-2 py-1 rounded-lg">✕</button>
      </div>

      <!-- STEP 1: INTRO -->
      <div *ngIf="step() === 'intro'" class="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm animate-fade-in-up">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/10 text-amber-900 font-bold text-xs rounded-full border border-amber-900/20 mb-3">
            <span class="material-icons text-base">palette</span>
            منظومة الأداء والتطبيق العملي
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">الاختبار الأدائي (ب)</h2>
          <h3 class="text-lg text-gray-600 font-semibold">قياس المهارات التطبيقية مع نظام الإنجاز المتسلسل للمهام</h3>
        </div>

        <!-- Meta Summary Bar -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <div class="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
            <span class="material-icons text-amber-600 text-xl block mb-1">format_list_bulleted</span>
            <div class="text-xs text-gray-500 font-bold">عدد المهام</div>
            <div class="text-sm font-black text-gray-800">10 مهام عملي</div>
          </div>
          <div class="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
            <span class="material-icons text-blue-600 text-xl block mb-1">timer</span>
            <div class="text-xs text-gray-500 font-bold">وقت المهمة الواحدة</div>
            <div class="text-sm font-black text-gray-800">10 دقائق (إجمالي 100 دقيقة)</div>
          </div>
          <div class="col-span-2 md:col-span-1 bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
            <span class="material-icons text-emerald-600 text-xl block mb-1">lock_clock</span>
            <div class="text-xs text-gray-500 font-bold">نظام الفتح</div>
            <div class="text-sm font-black text-emerald-700">فتح متسلسل عند إنجاز كل مهمة</div>
          </div>
        </div>

        <div class="space-y-6 text-right leading-relaxed text-gray-800">
          <div>
            <h4 class="font-bold text-amber-900 border-r-4 border-amber-900 pr-3 mb-2 text-lg">هدف الاختبار:</h4>
            <p class="text-base text-gray-700">
              يهدف هذا الاختبار إلى قياس مستوى إتقانك لمهارات التصميم الرقمي باستخدام بيئة المعمل الافتراضي،
              والمطلوب تنفيذ المهام التصميمية بالتتابع والتسلسل، ويراعى عند التنفيذ:
            </p>
            <ul class="list-disc list-inside space-y-2 pr-2 mt-3 text-sm md:text-base text-gray-700">
              <li>توظيف عناصر التصميم الرقمية: النقطة، الخط، الشكل، اللون، الملمس، الإضاءة، والفراغ.</li>
              <li>مراعاة أسس التصميم: الاتزان، الإيقاع، التناسب، الوحدة، التباين، والتوكيد.</li>
              <li><strong>نظام الفتح المتسلسل:</strong> تفتح المهمة الأولى تلقائياً، يلزم إنجاز كل مهمة لفتح المهمة التالية مباشرة.</li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-amber-900 border-r-4 border-amber-900 pr-3 mb-2 text-lg">تعليمات الإنجاز:</h4>
            <ul class="list-decimal list-inside space-y-2 pr-2 text-sm md:text-base text-gray-700">
              <li>ابدأ بالمهمة الأولى واضغط على زر <strong>"تنفيذ المهمة في المعمل 🎨"</strong>.</li>
              <li>يظهر النموذج التوضيحي والمؤقت (10 دقائق) بالمعمل، وعند الانتهاء اضغط <strong>"تم إنجاز المهمة ✓"</strong> لتنفتح المهمة التالية فوراً.</li>
              <li>لا يمكنك الانتقال لمهمة قادمة حتى يتم إنجاز وتأكيد إتمام المهمة السابقة.</li>
            </ul>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-200 text-center">
          <h3 class="text-lg font-bold text-gray-700 mb-2">مع تمنياتنا لك بالتوفيق والتميز</h3>
          <div class="flex flex-col items-center mb-6">
            <p class="text-xs text-gray-500 mb-0.5">إعداد الباحث</p>
            <p class="text-base font-bold text-gray-900">أحمد عدنان ياسين</p>
          </div>
          <button class="btn-action text-base px-8 py-3 font-black shadow-lg" data-sound="start" (click)="startExam()">
            <span>ابدأ الاختبار الأدائي</span>
            <span class="material-icons">rocket_launch</span>
          </button>
        </div>
      </div>

      <!-- STEP 2: TASKS LIST -->
      <div *ngIf="step() === 'exam'" class="animate-fade-in">

        <div class="bg-white border-2 border-amber-900/20 rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-right">
          <div>
            <h2 class="text-xl font-black text-gray-900 m-0">قائمة المهام الأدائية والمتتابعة</h2>
            <p class="text-xs text-gray-500 m-0 mt-1">يلزم إنجاز كل مهمة بترتيب لفتح المهمة التي تليها تلقائياً</p>
          </div>

          <div class="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
            <span class="material-icons text-amber-700 text-xl">check_circle</span>
            <div class="text-right">
              <span class="text-[10px] text-gray-500 font-bold block">إجمالي المهام المنجزة</span>
              <span class="text-lg font-black text-amber-900">{{ completedCount() }} / {{ tasks().length }}</span>
            </div>
          </div>
        </div>

        <!-- Tasks Items Grid -->
        <div class="space-y-6">
          <div *ngFor="let task of visibleTasks"
               class="bg-white border-2 rounded-2xl p-5 shadow-sm transition-all text-right overflow-hidden relative"
               [class.border-emerald-400]="task.completed"
               [class.bg-emerald-50]="task.completed"
               [class.border-amber-400]="isUnlocked(task.id) && !task.completed"
               [class.border-gray-200]="!isUnlocked(task.id)"
               [class.opacity-60]="!isUnlocked(task.id)"
               [class.bg-gray-100]="!isUnlocked(task.id)">

            <!-- LOCKED OVERLAY BADGE IF NOT UNLOCKED -->
            <div *ngIf="!isUnlocked(task.id)"
                 class="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md z-10">
              <span class="material-icons text-sm text-amber-400">lock</span>
              <span>مغلقة - يلزم إنجاز المهمة {{ task.id - 1 }}</span>
            </div>

            <div class="flex flex-col lg:flex-row gap-5 items-start justify-between">
              
              <!-- Task details -->
              <div class="flex gap-3 items-start flex-1">
                <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-sm"
                     [class.bg-emerald-600]="task.completed"
                     [class.text-white]="task.completed"
                     [class.bg-amber-900]="isUnlocked(task.id) && !task.completed"
                     [class.text-white]="isUnlocked(task.id) && !task.completed"
                     [class.bg-gray-400]="!isUnlocked(task.id)"
                     [class.text-white]="!isUnlocked(task.id)">
                  {{ task.id }}
                </div>

                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <h3 class="text-base md:text-lg font-bold text-gray-900 leading-snug m-0">المهمة {{ task.id }}</h3>
                    
                    <span *ngIf="task.completed" class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span class="material-icons text-xs">check_circle</span>
                      تم الإنجاز
                    </span>

                    <span *ngIf="isUnlocked(task.id) && !task.completed" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <span class="material-icons text-xs">lock_open</span>
                      متاحة للتنفيذ (10 دقائق)
                    </span>

                    <span *ngIf="!isUnlocked(task.id)" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1">
                      <span class="material-icons text-xs">lock</span>
                      مغلقة حالياً
                    </span>
                  </div>

                  <p class="text-sm md:text-base text-gray-800 leading-relaxed font-semibold mb-3">{{ task.text }}</p>

                  <!-- Lock Warning Banner -->
                  <div *ngIf="!isUnlocked(task.id)"
                       class="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 text-xs text-amber-900 font-bold flex items-center gap-2">
                    <span class="material-icons text-sm text-amber-700">info</span>
                    <span>{{ perfService.getTaskLockReason(task.id) }}</span>
                  </div>

                  <!-- Skills List -->
                  <div class="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-3">
                    <p class="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                      <span class="material-icons text-sm text-amber-700">stars</span>
                      المهارات المطلوبة:
                    </p>
                    <ul class="list-disc list-inside space-y-0.5 text-xs text-gray-700 pr-1">
                      <li *ngFor="let skill of task.skills">{{ skill }}</li>
                    </ul>
                  </div>

                  <!-- Recommended Tools -->
                  <div class="flex items-center gap-2 flex-wrap mb-2">
                    <span class="text-xs font-bold text-gray-500">الأدوات المقترحة:</span>
                    <span *ngFor="let tool of task.recommendedTools"
                          class="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg border border-amber-200">
                      {{ tool }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Visual SVG Sample Diagram Card -->
              <div class="w-full lg:w-48 bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex flex-col items-center text-center flex-shrink-0">
                <div class="text-[11px] font-black text-amber-900 mb-2 flex items-center gap-1">
                  <span class="material-icons text-xs">image</span>
                  <span>مثال وتكوين توضيحي</span>
                </div>

                <div class="w-full h-32 rounded-lg overflow-hidden bg-white border border-amber-200 shadow-inner flex items-center justify-center p-1"
                     [innerHTML]="getSafeSvg(task.exampleSvg)">
                </div>

                <p class="text-[10px] text-gray-600 mt-2 m-0 leading-tight font-semibold">
                  {{ task.exampleTitle }}
                </p>
              </div>

            </div>

            <!-- Action Buttons -->
            <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button (click)="openTaskInLab(task.id)"
                      [disabled]="!isUnlocked(task.id)"
                      class="btn-primary text-xs md:text-sm px-5 py-2.5 shadow-md flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      [class.bg-emerald-700]="isUnlocked(task.id)"
                      [class.hover:bg-emerald-800]="isUnlocked(task.id)"
                      [class.bg-gray-400]="!isUnlocked(task.id)">
                <span class="material-icons text-base">{{ isUnlocked(task.id) ? 'palette' : 'lock' }}</span>
                <span>{{ isUnlocked(task.id) ? ('تنفيذ المهمة ' + task.id + ' في المعمل الافتراضي 🎨') : 'المهمة مغلقة' }}</span>
              </button>

              <button (click)="toggleTaskCompleted(task.id)"
                      [disabled]="!isUnlocked(task.id)"
                      class="px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      [class.bg-emerald-100]="task.completed"
                      [class.text-emerald-800]="task.completed"
                      [class.border-emerald-300]="task.completed"
                      [class.bg-gray-100]="!task.completed"
                      [class.text-gray-700]="!task.completed"
                      [class.border-gray-300]="!task.completed">
                <span class="material-icons text-sm">{{ task.completed ? 'check_box' : 'check_box_outline_blank' }}</span>
                <span>{{ task.completed ? 'مكتملة (تحويل لغير مكتملة)' : 'تحديد كـ مكتملة' }}</span>
              </button>
            </div>

          </div>
        </div>

        <!-- PAGINATION BAR -->
        <div class="flex justify-between items-center mt-8 py-5 border-t border-gray-200">
          <button [disabled]="currentPage() === 0" (click)="prevPage()"
                  data-sound="prev"
                  class="btn-primary bg-gray-500 hover:bg-gray-600 disabled:opacity-30 px-5 py-2 text-sm flex items-center gap-1">
            <span class="material-icons text-sm">arrow_forward</span>
            الصفحة السابقة
          </button>

          <span class="font-bold text-gray-600 text-sm md:text-base">
            صفحة {{ currentPage() + 1 }} من {{ totalPages }}
          </span>

          <button *ngIf="currentPage() < totalPages - 1" (click)="nextPage()"
                  data-sound="next"
                  class="btn-primary px-5 py-2 text-sm flex items-center gap-1">
            الصفحة التالية
            <span class="material-icons text-sm">arrow_back</span>
          </button>

          <button *ngIf="currentPage() === totalPages - 1" (click)="submitExam()"
                  data-sound="submit"
                  class="btn-primary bg-emerald-600 hover:bg-emerald-700 px-6 py-2 text-sm font-black shadow-lg">
            تسليم كافة المهام
          </button>
        </div>
      </div>

      <!-- STEP 3: RESULT -->
      <div *ngIf="step() === 'result'" class="bg-white border-2 border-emerald-300 rounded-3xl p-8 md:p-12 shadow-xl text-center animate-scale-in">
        <span class="material-icons text-7xl text-emerald-500 mb-4">check_circle</span>
        <h2 class="text-3xl font-black text-emerald-800 mb-2">تم تسليم الاختبار الأدائي بنجاح!</h2>
        <p class="text-base text-gray-600 mb-6">تم تسجيل نتائج إنجازك في المعمل الافتراضي بنجاح.</p>

        <div class="score-display my-4">
          المهام المنجزة: {{ completedCount() }} / {{ tasks().length }}
        </div>

        <div class="flex flex-wrap justify-center gap-3 mt-8">
          <a routerLink="/lab" class="btn-primary bg-emerald-700 hover:bg-emerald-800 px-6 py-2.5 flex items-center gap-2">
            <span class="material-icons text-base">palette</span>
            الذهاب للمعمل الافتراضي
          </a>

          <button class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors border border-gray-300"
                  data-sound="back" (click)="restartExam()">
            إعادة أداء الاختبار
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .score-display {
      font-size: clamp(2rem, 8vw, 2.5rem);
      color: #059669;
      font-weight: 900;
      margin: 1.5rem 0;
    }
  `]
})
export class PerformanceTestComponent implements OnInit {
  private readonly buttonSound = inject(ButtonSoundService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  readonly perfService = inject(PerformanceTestService);

  currentPage = signal<number>(0);
  itemsPerPage = 5;
  unlockedToastMessage = signal<string | null>(null);

  get step() {
    return this.perfService.step;
  }

  get tasks() {
    return this.perfService.tasks;
  }

  get completedCount() {
    return this.perfService.completedCount;
  }

  get visibleTasks(): PerformanceTask[] {
    const start = this.currentPage() * this.itemsPerPage;
    return this.tasks().slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.tasks().length / this.itemsPerPage);
  }

  ngOnInit(): void {}

  isUnlocked(taskId: number): boolean {
    return this.perfService.isTaskUnlocked(taskId);
  }

  getSafeSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  openTaskInLab(taskId: number): void {
    if (this.perfService.setActiveTask(taskId)) {
      this.router.navigate(['/lab']);
    }
  }

  toggleTaskCompleted(taskId: number): void {
    const res = this.perfService.toggleTaskCompleted(taskId);
    if (res.unlockedNext && res.nextTaskId) {
      this.buttonSound.play('success');
      this.unlockedToastMessage.set(`🎉 أحسنت! تم إنجاز المهمة ${taskId} وفتح المهمة ${res.nextTaskId} بنجاح!`);
      setTimeout(() => this.unlockedToastMessage.set(null), 5000);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  startExam(): void {
    this.perfService.step.set('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  restartExam(): void {
    if (confirm('هل أنت متأكد من رغبتك في إعادة أداء الاختبار الأدائي وتصفير المهام؟')) {
      this.perfService.resetAllTasks();
      this.currentPage.set(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  submitExam(): void {
    this.perfService.step.set('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.buttonSound.play('success'), 200);
  }
}
