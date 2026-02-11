import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PerformanceTask {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-performance-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8">
    
      <!-- STEP 1: INTRO / INSTRUCTIONS -->
      <div *ngIf="step() === 'intro'" class="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm animate-fade-in-up">
        <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900 mb-2">اختبار (ب)</h2>
            <h3 class="text-lg text-gray-600 font-semibold">اختبار الجانب الأدائي في مهارات التصميم للطلاب المرحلة الثانوية</h3>
        </div>

        <div class="space-y-8 text-right leading-relaxed text-gray-800">
          <div>
            <h4 class="font-bold text-secondary border-r-4 border-secondary pr-3 mb-3 text-xl">هدف الاختبار:</h4>
            <p class="text-lg">
              يهدف هذا الاختبار إلى قياس مستوى إتقانك لمهارات التصميم الرقمي باستخدام بيئة المعمل الافتراضي، والمطلوب تنفيذ المهام التصميمية الآتية باستخدام أدوات وبرامج المعمل الافتراضي.
            </p>
          </div>

          <div>
            <h4 class="font-bold text-secondary border-r-4 border-secondary pr-3 mb-3 text-xl">تعليمات الاختبار:</h4>
            <p class="text-lg mb-4">عزيزي الطالب / عزيزتي الطالبة يرجى قراءة التعليمات التالية بعناية:</p>
            <ul class="list-decimal list-inside space-y-3 pr-2 text-lg">
               <li>يتكون هذا الاختبار من مجموعة من المهام العملية التي تقيس مهارات التصميم الرقمي.</li>
               <li>يرجى قراءة كل مهمة بعناية وتنفيذ التصميم المطلوب باستخدام أدوات المعمل الافتراضي.</li>
               <li>يجب توظيف جميع العناصر التصميمية الرقمية المطلوبة في كل مهمة.</li>
               <li>قم بوضع علامة (✓) أمام المهمة التي قمت بإنجازها.</li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 text-center">
            <h3 class="text-xl font-bold text-secondary mb-6">مع تمنياتنا لك بالتوفيق</h3>
            <div class="flex flex-col items-center">
                <p class="text-sm text-gray-500 mb-1">إعــداد الباحث</p>
                <p class="text-xl font-bold text-gray-900">أحمد عدنان ياسين</p>
            </div>
            <button class="btn-action mt-10 text-lg" (click)="startExam()">
              <span>ابدأ الاختبار</span>
              <span class="material-icons">rocket_launch</span>
            </button>
        </div>
      </div>

      <!-- STEP 2: EXAM (Tasks List) -->
      <div *ngIf="step() === 'exam'" class="animate-fade-in">
        <div class="bg-white border-2 border-primary/20 rounded-lg p-5 mb-8 shadow-sm text-center">
            <h2 class="text-xl font-bold text-gray-900 leading-tight">قائمة المهام الأدائية: قم بتنفيذ المهام التالية ثم ضع علامة (✓) عند الانتهاء:</h2>
        </div>

        <div class="space-y-4">
            <div *ngFor="let task of transformQuestions(visibleTasks)" 
                 class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                 
                 <div class="flex-shrink-0 bg-secondary/10 text-secondary w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                    {{task.id}}
                 </div>

                 <div class="flex-grow">
                    <p class="text-lg text-gray-800 leading-relaxed mb-4">{{task.text}}</p>
                    
                    <label class="flex items-center gap-3 cursor-pointer group w-fit">
                        <div class="relative">
                            <input type="checkbox" 
                                   [(ngModel)]="task.completed"
                                   class="peer hidden">
                            <div class="w-6 h-6 border-2 border-gray-300 rounded peer-checked:bg-green-600 peer-checked:border-green-600 transition-all flex items-center justify-center text-white">
                                <span class="material-icons text-sm scale-0 peer-checked:scale-100 transition-transform">check</span>
                            </div>
                        </div>
                        <span class="text-gray-600 group-hover:text-green-700 transition-colors font-semibold">تم التنقيد</span>
                    </label>
                 </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-12 py-6 border-t border-gray-100">
            <button [disabled]="currentPage() === 0" (click)="prevPage()"
                    class="btn-primary bg-gray-500 hover:bg-gray-600 disabled:opacity-30 px-6 py-2">
                السابق
            </button>
    
            <span class="font-bold text-gray-600 text-lg">
                صفحة {{currentPage() + 1}} من {{totalPages}}
            </span>
    
            <button *ngIf="currentPage() < totalPages - 1" (click)="nextPage()"
                    class="btn-primary px-6 py-2">
                التالي
            </button>
    
            <button *ngIf="currentPage() === totalPages - 1" (click)="submitExam()"
                    class="btn-primary bg-green-600 hover:bg-green-700 px-6 py-2">
                تسليم المهام
            </button>
        </div>
      </div>

      <!-- STEP 3: RESULT -->
      <div *ngIf="step() === 'result'" class="bg-white border border-gray-100 rounded-2xl p-10 shadow-xl text-center animate-scale-in">
        <span class="material-icons text-7xl text-green-500 mb-4">check_circle</span>
        <h2 class="text-3xl font-extrabold text-green-600 mb-2">تم تسليم الاختبار بنجاح</h2>
        <p class="text-lg text-gray-600 mb-8">شكراً لك على إتمام الاختبار الأدائي.</p>

        <div class="score-display">
            المهام المنجزة: {{completedCount()}} / {{tasks().length}}
        </div>

        <p class="text-gray-500 mt-4">تم تسجيل تقدمك في المعمل الافتراضي.</p>

        <button class="btn-primary bg-gray-600 mt-10" (click)="step.set('intro')">
            عودة للصفحة الرئيسية للاختبار
        </button>
      </div>

    </div>
  `,
  styles: [`
    .score-display {
      font-size: clamp(2rem, 8vw, 2.5rem);
      color: #27ae60;
      font-weight: 800;
      margin: 1.5rem 0;
    }
  `]
})
export class PerformanceTestComponent {
  step = signal<'intro' | 'exam' | 'result'>('intro');
  completedCount = signal<number>(0);
  currentPage = signal<number>(0);
  itemsPerPage = 5;

  tasks = signal<PerformanceTask[]>([
    { id: 1, text: "في مساحة الورقة/المعمل الافتراضي، نفذ تصميم ابتكاري باستخدام النقطة، مع توظيف الألوان والفراغ لتحقيق التوازن والإيقاع.", completed: false },
    { id: 2, text: "قم بتنفيذ تصميم تكاملي يوضح العلاقة بين ثلاثة أشكال هندسية (مثلث – مربع – دائرة)، مع التأكيد على القيم الخطية وتحقيق أسس التصميم (الاتزان، الإيقاع).", completed: false },
    { id: 3, text: "في مساحة العمل، أنشئ تصميم ابتكاري باستخدام الأشكال العضوية مستعيناً بالنقطة والخط والمساحة، مع مراعاة أسس التصميم المتنوعة.", completed: false },
    { id: 4, text: "قم بتنفيذ تصميم طبق نجمي هندسي مستوحى من الفن الإسلامي، يحقق عمليات التكرار والحركة الرقمية داخل المعمل الافتراضي.", completed: false },
    { id: 5, text: "نفذ تصميماً ابتكارياً باستخدام عنصري النقطة والخط، مع التركيز على القيم الملمسية في البناء الفني.", completed: false },
    { id: 6, text: "صمّم عملاً فنياً رقمياً يوضح التدرج واللون المتناغم لتحقيق الانسجام البصري.", completed: false },
    { id: 7, text: "قم بتنفيذ تصميم رقمي بسيط يدمج بين الخطوط البسيطة والمنحنية لإظهار الإيقاع والتكرار.", completed: false },
    { id: 8, text: "صمّم تكويناً ثلاثي الأبعاد رقمياً يظهر استخدام الضوء والظل لتحقيق الملمس والعمق.", completed: false },
    { id: 9, text: "أنشئ تصميماً رقمياً يعتمد على مزج الألوان الثانوية بطريقة تحقق الانسجام اللوني والتباين البصري.", completed: false },
    { id: 10, text: "قم بتطوير تصميم حر يدمج جميع العناصر التصميمية الأساسية ويحقق أكبر قدر من الإبداع والتنوع والتوازن الرقمي.", completed: false }
  ]);

  get visibleTasks() {
    const start = this.currentPage() * this.itemsPerPage;
    return this.tasks().slice(start, start + this.itemsPerPage);
  }

  // Helper because *ngFor doesn't like signal arrays directly sometimes without ()
  transformQuestions(q: PerformanceTask[]) { return q; }

  get totalPages() {
    return Math.ceil(this.tasks().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update(p => p + 1);
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      window.scrollTo(0, 0);
    }
  }

  startExam() {
    this.step.set('exam');
    window.scrollTo(0, 0);
  }

  submitExam() {
    const count = this.tasks().filter(t => t.completed).length;
    this.completedCount.set(count);
    this.step.set('result');
    window.scrollTo(0, 0);
  }
}
