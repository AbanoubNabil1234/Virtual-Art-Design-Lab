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
    <div class="exam-container">
    
      <!-- STEP 1: INTRO / INSTRUCTIONS -->
      <div *ngIf="step() === 'intro'" class="instruction-card animate-fade-in-up">
        <h2 style="color: #1a1a1a; margin-bottom: 0.5rem;">اختبار (ب)</h2>
        <h3 style="color: #555; margin-bottom: 2rem;">اختبار الجانب الأدائي في مهارات التصميم للطلاب المرحلة الثانوية</h3>

        <div style="text-align: right; margin: 2rem 0; line-height: 1.8;">
          <h4 style="font-weight: bold; color: #6b4226; margin-bottom: 10px; font-size: 1.1rem;">هدف الاختبار:</h4>
          <p style="color: #444; margin-bottom: 1.5rem;">
            يهدف هذا الاختبار إلى قياس مستوى إتقانك لمهارات التصميم الرقمي باستخدام بيئة المعمل الافتراضي، والمطلوب تنفيذ المهام التصميمية الآتية باستخدام أدوات وبرامج المعمل الافتراضي.
          </p>

          <h4 style="font-weight: bold; color: #6b4226; margin-bottom: 10px; font-size: 1.1rem;">تعليمات الاختبار:</h4>
          <p style="margin-bottom: 0.5rem;">عزيزي الطالب / عزيزتي الطالبة يرجى قراءة التعليمات التالية بعناية:</p>
          <ul style="list-style-type: none; padding-right: 0; color: #555;">
             <li style="margin-bottom: 8px;">1. يتكون هذا الاختبار من مجموعة من المهام العملية التي تقيس مهارات التصميم الرقمي.</li>
             <li style="margin-bottom: 8px;">2. يرجى قراءة كل مهمة بعناية وتنفيذ التصميم المطلوب باستخدام أدوات المعمل الافتراضي.</li>
             <li style="margin-bottom: 8px;">3. يجب توظيف جميع العناصر التصميمية الرقمية المطلوبة في كل مهمة.</li>
             <li style="margin-bottom: 8px;">4. قم بوضع علامة (✓) أمام المهمة التي قمت بإنجازها.</li>
          </ul>
        </div>

        <div style="margin-top: 2rem;">
            <h3 style="color: #6b4226;">مع تمنياتنا لك بالتوفيق</h3>
            <div style="text-align: center; margin-top: 1rem;">
                <p style="font-size: 1rem; color: #555; margin-bottom: 5px;">إعــداد الباحث</p>
                <p style="font-weight: bold; font-size: 1.1rem; color: #777;">أحمد عدنان ياسين</p>
            </div>
        </div>

        <button class="btn-start hover-scale" (click)="startExam()">ابدأ الاختبار</button>
      </div>

      <!-- STEP 2: EXAM (Tasks List) -->
      <div *ngIf="step() === 'exam'" class="animate-fade-in-up">
        <div class="instruction-card" style="margin-bottom: 20px; padding: 1rem; text-align: right;">
            <h2 style="margin: 0; font-size: 1.2rem; color: #333;">قائمة المهام الأدائية: قم بتنفيذ المهام التالية ثم ضع علامة (✓) عند الانتهاء:</h2>
        </div>

        <!-- A4 Paper Container -->
        <div style="
            width: 100%;
            max-width: 100%;
            min-height: 297mm;
            padding: 5mm; 
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            direction: rtl;
            font-family: 'Noto Kufi Arabic', Arial, sans-serif;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        ">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #444; background: #5d4037; color: white; padding: 12px; width: 50px; text-align: center;">م</th>
                        <th style="border: 1px solid #444; background: #5d4037; color: white; padding: 12px; text-align: right;">المهمة الأدائية المطلوبة</th>
                        <th style="border: 1px solid #444; background: #5d4037; color: white; padding: 12px; width: 100px; text-align: center;">حالة التنفيذ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let task of transformQuestions(visibleTasks)">
                         <td style="border: 1px solid #444; padding: 15px; text-align: center; vertical-align: top; font-weight: bold; background: #fdfdfd;">
                            {{task.id}}
                         </td>
                         <td style="border: 1px solid #444; padding: 15px; text-align: right; vertical-align: top; line-height: 1.8; color: #333;">
                            {{task.text}}
                         </td>
                         <td style="border: 1px solid #444; padding: 15px; vertical-align: middle; text-align: center; background: #fffbe6;">
                            <div style="display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" 
                                       [(ngModel)]="task.completed"
                                       style="width: 24px; height: 24px; cursor: pointer; accent-color: #27ae60;">
                            </div>
                         </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 2rem;">
                <button [disabled]="currentPage() === 0" (click)="prevPage()"
                    [style.opacity]="currentPage() === 0 ? 0.5 : 1"
                    style="padding: 10px 24px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    السابق
                </button>
        
                <span style="font-weight: bold; color: #333;">
                    صفحة {{currentPage() + 1}} من {{totalPages}}
                </span>
        
                <button *ngIf="currentPage() < totalPages - 1" (click)="nextPage()"
                    style="padding: 10px 24px; background: #6b4226; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    التالي
                </button>
        
                <button *ngIf="currentPage() === totalPages - 1" (click)="submitExam()"
                    style="padding: 10px 24px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    تسليم المهام
                </button>
            </div>
        </div>
      </div>

      <!-- STEP 3: RESULT -->
      <div *ngIf="step() === 'result'" class="instruction-card animate-scale-in">
        <span class="material-icons" style="font-size: 64px; color: #27ae60; margin-bottom: 1rem;">check_circle</span>
        <h2 style="color: #27ae60;">تم تسليم الاختبار بنجاح</h2>
        <p style="font-size: 1.1rem; color: #555;">شكراً لك على إتمام الاختبار الأدائي.</p>

        <div class="score-display">
            المهام المنجزة: {{completedCount()}} / {{tasks().length}}
        </div>

        <p style="color: #777;">تم تسجيل تقدمك في المعمل الافتراضي.</p>

        <button class="btn-start" (click)="step.set('intro')" style="margin-top: 2rem; background: #666;">
            عودة للصفحة الرئيسية للاختبار
        </button>
      </div>

    </div>
  `,
  styles: [`
    .exam-container {
      padding: 2rem;
      direction: rtl;
      font-family: 'Noto Kufi Arabic', Arial, sans-serif;
      color: #1a1a1a;
      max-width: 900px;
      margin: 0 auto;
    }
    .instruction-card {
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .btn-start {
      background: #6b4226;
      color: white;
      padding: 12px 32px;
      border-radius: 4px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    .btn-start:hover {
      background: #5d3a20;
    }
    .score-display {
      font-size: 2rem;
      color: #27ae60;
      font-weight: bold;
      margin: 1rem 0;
    }
    .hover-scale:hover {
        transform: scale(1.05);
    }
    /* Animations */
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
    .animate-scale-in { animation: scaleIn 0.3s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
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
