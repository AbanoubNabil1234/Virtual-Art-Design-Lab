import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonSoundService } from '../../core/services/button-sound.service';

interface PerformanceTask {
  id: number;
  text: string;
  skills: string[];
  completed: boolean;
}

@Component({
  selector: 'app-performance-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8">

      <div *ngIf="step() === 'intro'" class="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm animate-fade-in-up">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">اختبار (ب)</h2>
          <h3 class="text-lg text-gray-600 font-semibold">اختبار الجانب الأدائي في مهارات التصميم لطلاب المرحلة الثانوية</h3>
        </div>

        <div class="space-y-8 text-right leading-relaxed text-gray-800">
          <div>
            <h4 class="font-bold text-secondary border-r-4 border-secondary pr-3 mb-3 text-xl">هدف الاختبار:</h4>
            <p class="text-lg">
              يهدف هذا الاختبار إلى قياس مستوى إتقانك لمهارات التصميم الرقمي باستخدام بيئة المعمل الافتراضي،
              والمطلوب تنفيذ المهام التصميمية الآتية باستخدام أدوات وبرامج المعمل الافتراضي، ويراعى عند التنفيذ:
            </p>
            <ul class="list-disc list-inside space-y-2 pr-2 mt-4 text-lg">
              <li>توظيف عناصر التصميم الرقمية: النقطة، الخط، الشكل، اللون، الملمس، الإضاءة، والفراغ.</li>
              <li>مراعاة أسس التصميم: الاتزان، الإيقاع، التناسب، الوحدة، التباين، والتوكيد.</li>
              <li>يُسمح باستخدام الأدوات الرقمية المتاحة داخل المعمل الافتراضي فقط.</li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-secondary border-r-4 border-secondary pr-3 mb-3 text-xl">تعليمات الاختبار:</h4>
            <p class="text-lg mb-4">عزيزي الطالب / عزيزتي الطالبة يرجى قراءة التعليمات التالية بعناية قبل البدء في الإجابة:</p>
            <ul class="list-decimal list-inside space-y-3 pr-2 text-lg">
              <li>يتكون هذا الاختبار من مجموعة من المهام العملية التي تقيس مهارات التصميم الرقمي.</li>
              <li>يرجى قراءة كل مهمة بعناية وتنفيذ التصميم المطلوب باستخدام أدوات المعمل الافتراضي فقط.</li>
              <li>يجب توظيف جميع العناصر التصميمية الرقمية المطلوبة في كل مهمة، مع الالتزام بأسس التصميم.</li>
              <li>يتم تقييم كل مهمة حسب: جودة التطبيق الفني، الالتزام بالعناصر، الالتزام بأسس التصميم، والإبداع.</li>
              <li>لا تترك أي مهمة دون تنفيذ.</li>
              <li>زمن الاختبار 100 دقيقة بمعدل 10 دقائق لكل مهمة.</li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 text-center">
          <h3 class="text-xl font-bold text-secondary mb-6">مع تمنياتنا لك بالتوفيق</h3>
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500 mb-1">إعداد الباحث</p>
            <p class="text-xl font-bold text-gray-900">أحمد عدنان ياسين</p>
          </div>
          <button class="btn-action mt-10 text-lg" data-sound="start" (click)="startExam()">
            <span>ابدأ الاختبار</span>
            <span class="material-icons">rocket_launch</span>
          </button>
        </div>
      </div>

      <div *ngIf="step() === 'exam'" class="animate-fade-in">
        <div class="bg-white border-2 border-primary/20 rounded-lg p-5 mb-8 shadow-sm text-center">
          <h2 class="text-xl font-bold text-gray-900 leading-tight">قائمة المهام الأدائية: قم بتنفيذ المهام التالية ثم ضع علامة عند الانتهاء</h2>
        </div>

        <div class="space-y-5">
          <div *ngFor="let task of visibleTasks" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex gap-4">
              <div class="flex-shrink-0 bg-secondary/10 text-secondary w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                {{task.id}}
              </div>

              <div class="flex-grow text-right">
                <p class="text-lg text-gray-900 leading-relaxed mb-4 font-semibold">{{task.text}}</p>

                <div class="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
                  <p class="text-sm font-bold text-gray-700 mb-3">المهارات المرتبطة بالمهمة:</p>
                  <ul class="list-disc list-inside space-y-2 text-gray-700">
                    <li *ngFor="let skill of task.skills">{{skill}}</li>
                  </ul>
                </div>

                <label class="flex items-center gap-3 cursor-pointer group w-fit" data-sound="check">
                  <div class="relative">
                    <input type="checkbox"
                      [(ngModel)]="task.completed"
                      data-sound="check"
                      class="peer hidden">
                    <div class="w-6 h-6 border-2 border-gray-300 rounded peer-checked:bg-green-600 peer-checked:border-green-600 transition-all flex items-center justify-center text-white">
                      <span class="material-icons text-sm scale-0 peer-checked:scale-100 transition-transform">check</span>
                    </div>
                  </div>
                  <span class="text-gray-600 group-hover:text-green-700 transition-colors font-semibold">تم الإنجاز</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-12 py-6 border-t border-gray-100">
          <button [disabled]="currentPage() === 0" (click)="prevPage()"
            data-sound="prev"
            class="btn-primary bg-gray-500 hover:bg-gray-600 disabled:opacity-30 px-6 py-2">
            السابق
          </button>

          <span class="font-bold text-gray-600 text-lg">
            صفحة {{currentPage() + 1}} من {{totalPages}}
          </span>

          <button *ngIf="currentPage() < totalPages - 1" (click)="nextPage()"
            data-sound="next"
            class="btn-primary px-6 py-2">
            التالي
          </button>

          <button *ngIf="currentPage() === totalPages - 1" (click)="submitExam()"
            data-sound="submit"
            class="btn-primary bg-green-600 hover:bg-green-700 px-6 py-2">
            تسليم المهام
          </button>
        </div>
      </div>

      <div *ngIf="step() === 'result'" class="bg-white border border-gray-100 rounded-2xl p-10 shadow-xl text-center animate-scale-in">
        <span class="material-icons text-7xl text-green-500 mb-4">check_circle</span>
        <h2 class="text-3xl font-extrabold text-green-600 mb-2">تم تسليم الاختبار بنجاح</h2>
        <p class="text-lg text-gray-600 mb-8">شكراً لك على إتمام الاختبار الأدائي.</p>

        <div class="score-display">
          المهام المنجزة: {{completedCount()}} / {{tasks().length}}
        </div>

        <p class="text-gray-500 mt-4">تم تسجيل تقدمك في المعمل الافتراضي.</p>

        <button class="btn-primary bg-gray-600 mt-10" data-sound="back" (click)="restartExam()">
          إعادة الاختبار
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
  private readonly buttonSound = inject(ButtonSoundService);

  step = signal<'intro' | 'exam' | 'result'>('intro');
  completedCount = signal<number>(0);
  currentPage = signal<number>(0);
  itemsPerPage = 5;

  tasks = signal<PerformanceTask[]>([
    {
      id: 1,
      text: 'في مساحة الورقة/المعمل الافتراضي، نفذ تصميمًا ابتكاريًا باستخدام النقطة، مع توظيف الألوان والفراغ لتحقيق التوازن والإيقاع.',
      skills: [
        'استخدام النقطة في التصميم رقميًا.',
        'استخدام اللون في النقطة باستخدام أدوات رقمية.',
        'توظيف النقطة في بناء الشكل الخارجي للتصميم الافتراضي.',
        'التنظيم بين النقط داخل مساحة تصميم افتراضية.'
      ],
      completed: false
    },
    {
      id: 2,
      text: 'قم بتنفيذ تصميم تكاملي يوضح العلاقة بين ثلاثة أشكال هندسية (مثلث–مربع–دائرة)، مع التأكيد على القيم الخطية وتحقيق أسس التصميم (الاتزان والإيقاع).',
      skills: [
        'استخدام الأشكال الهندسية رقميًا.',
        'استخدام الخطوط البسيطة رقميًا في تصميم العمل الفني.',
        'استخدام الأسس الاتجاهية في التصميم الرقمي.',
        'استخدام الأسس التركيزية داخل العمل الفني الافتراضي.'
      ],
      completed: false
    },
    {
      id: 3,
      text: 'في مساحة العمل، أنشئ تصميمًا ابتكاريًا باستخدام الأشكال العضوية مستعينًا بالنقطة والخط والمساحة، مع مراعاة أسس التصميم المتنوعة.',
      skills: [
        'استخدام الأشكال العضوية في التصميم الافتراضي.',
        'استخدام الأشكال الطبيعية من خلال النماذج الرقمية.',
        'استخدام الأسس المركبة باستخدام المحاكاة الرقمية.',
        'إيجاد العلاقة بين الشكل والأرضية في التصميم الرقمي.'
      ],
      completed: false
    },
    {
      id: 4,
      text: 'قم بتنفيذ تصميم طبق نجمي هندسي مستوحى من الفن الإسلامي، يحقق عمليات التكرار والحركة الرقمية داخل المعمل الافتراضي.',
      skills: [
        'استخدام التكرار المتناوب رقميًا.',
        'استخدام التكرار المتغير باستخدام أدوات النسخ والتكرار الافتراضي.',
        'استخدام الأشكال الهندسية رقميًا.'
      ],
      completed: false
    },
    {
      id: 5,
      text: 'نفذ تصميمًا ابتكاريًا باستخدام عنصري النقطة والخط، مع التركيز على القيم الملمسية في البناء الفني.',
      skills: [
        'استخدام الخطوط المركبة في تصميم العمل الفني الافتراضي.',
        'إيجاد الملمس في التصميم باستخدام المؤثرات الرقمية.'
      ],
      completed: false
    },
    {
      id: 6,
      text: 'صمّم عملًا فنيًا رقميًا يوضح التدرج واللون المتناغم لتحقيق الانسجام البصري.',
      skills: [
        'استخدام الألوان الأساسية رقميًا.',
        'استخدام الألوان الساخنة والباردة رقميًا.',
        'تحقيق الانسجام اللوني باستخدام أدوات المعمل الافتراضي.'
      ],
      completed: false
    },
    {
      id: 7,
      text: 'قم بتنفيذ تصميم رقمي بسيط يدمج بين الخطوط البسيطة والمنحنية لإظهار الإيقاع والتكرار.',
      skills: [
        'استخدام الخطوط البسيطة رقميًا.',
        'استخدام الخطوط غير المستقيمة.',
        'استخدام التكرار المتناوب رقميًا.'
      ],
      completed: false
    },
    {
      id: 8,
      text: 'صمّم تكوينًا ثلاثي الأبعاد رقميًا يظهر استخدام الضوء والظل لتحقيق الملمس والعمق.',
      skills: [
        'استخدام حجم هندسي منتظم داخل التصميم الافتراضي.',
        'استخدام حجم شبه منتظم باستخدام المحاكاة الرقمية.',
        'استخدام الإضاءة المركزة رقميًا.',
        'استخدام الإضاءة المباشرة في التصميم الافتراضي.',
        'استخدام الإضاءة الموزعة داخل بيئة المحاكاة.',
        'التمييز بين أنواع الملامس داخل العمل الافتراضي.'
      ],
      completed: false
    },
    {
      id: 9,
      text: 'أنشئ تصميمًا رقميًا يعتمد على مزج الألوان الثانوية بطريقة تحقق الانسجام اللوني والتباين البصري.',
      skills: [
        'استخدام الألوان الثانوية في التصميم الافتراضي.',
        'استخدام الألوان الرقمية الجاهزة.',
        'تحقيق التباين اللوني في التصميم الرقمي.'
      ],
      completed: false
    },
    {
      id: 10,
      text: 'قم بتطوير تصميم حر يدمج جميع العناصر التصميمية الأساسية ويحقق أكبر قدر من الإبداع والتنوع والتوازن الرقمي.',
      skills: [
        'استخدام الأشكال الرقمية الجاهزة داخل بيئة العمل الافتراضي.',
        'توظيف عنصري الزمان والمكان داخل التصميم الافتراضي.',
        'دمج عناصر وأسس التصميم في عمل فني متكامل.'
      ],
      completed: false
    }
  ]);

  get visibleTasks() {
    const start = this.currentPage() * this.itemsPerPage;
    return this.tasks().slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.tasks().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update((p) => p + 1);
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      window.scrollTo(0, 0);
    }
  }

  startExam() {
    this.step.set('exam');
    window.scrollTo(0, 0);
  }

  restartExam() {
    this.tasks.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        completed: false
      }))
    );
    this.completedCount.set(0);
    this.currentPage.set(0);
    this.step.set('intro');
    window.scrollTo(0, 0);
  }

  submitExam() {
    const count = this.tasks().filter((task) => task.completed).length;
    this.completedCount.set(count);
    this.step.set('result');
    window.scrollTo(0, 0);
    setTimeout(() => this.buttonSound.play('success'), 200);
  }
}
