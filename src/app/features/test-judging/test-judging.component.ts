import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface QuestionRow {
  id: number;
  text: string;
  options: string[]; // Options a,b,c,d
  linguistic: string; // 'مناسبة' | 'غير مناسبة' (mapped to 's' / 'n')
  belonging: string;  // 'منتمية' | 'غير منتمية' (mapped to 'b' / 'n')
  amendment: string;
}

@Component({
  selector: 'app-test-judging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-judging.component.html',
  styles: [`
    .judging-container {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm; /* Reduced padding for better fit */
      margin: 20px auto;
      background: white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      direction: rtl;
      font-family: 'Noto Kufi Arabic', Arial, sans-serif;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
      font-weight: 800;
      color: #1a1a1a;
      font-size: 1.2rem;
    }
    .judging-table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      font-size: 0.8rem; /* Smaller font for A4 density */
    }
    .judging-table th, .judging-table td {
      border: 1px solid #000;
      padding: 4px;
      text-align: center;
      vertical-align: middle;
    }
    .judging-table th {
      background-color: #5d4037;
      color: #fff;
      font-weight: bold;
    }
    /* Sub-header text */
    .sub-th {
      font-size: 0.75rem;
    }
    /* Question cell */
    .q-cell {
      text-align: right !important;
      vertical-align: top !important;
      padding: 6px;
    }
    .q-text {
      font-weight: bold;
      margin-bottom: 4px;
      display: block;
    }
    .q-option {
      display: block;
      margin-bottom: 2px;
      color: #333;
    }
    textarea {
      width: 95%;
      height: 60px;
      resize: none;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 0.8rem;
    }
  `]
})
export class TestJudgingComponent {

  questions = signal<QuestionRow[]>([
    {
      id: 1,
      text: 'يقصد بمفهوم التصميم الفني أنه:',
      options: [
        'أ. عملية عشوائية لرسم العناصر الفنية',
        'ب. تنظيم وتوظيف عناصر الفن لتحقيق الجمال فقط',
        'ج. تنظيم وتوظيف عناصر الفن وفق أسس جمالية لإنتاج عمل متكامل',
        'د. استخدام الألوان والخطوط دون تخطيط مسبق'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 2,
      text: 'من أهداف التصميم الفني:',
      options: [
        'أ. تحقيق الجمال فقط دون وظيفة',
        'ب. الدمج بين الجمال والوظيفة',
        'ج. التركيز على اللون دون باقي العناصر',
        'د. إلغاء دور المتلقي في العمل الفني'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 3,
      text: 'أي مما يلي يُعد من عناصر التصميم الأساسية؟',
      options: [
        'أ. التدرج',
        'ب. النقطة',
        'ج. التوازن',
        'د. التوكيد'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 4,
      text: 'النقطة في التصميم تستخدم أساساً في:',
      options: [
        'أ. إحداث الإيقاع فقط',
        'ب. بناء التكوين الفني والتحكم في الاتجاه',
        'ج. إلغاء المساحة',
        'د. تحقيق الوحدة دون تنوع'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 5,
      text: 'أي من الآتي يُعد نوعاً من الخطوط؟',
      options: [
        'أ. خطوط دائرية',
        'ب. خطوط متوازنة',
        'ج. خطوط منحنية',
        'د. خطوط متناظرة'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 6,
      text: 'الشكل في التصميم يمكن أن يكون:',
      options: [
        'أ. هندسي فقط',
        'ب. طبيعي فقط',
        'ج. رقمي فقط',
        'د. هندسي أو طبيعي أو رقمي'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 7,
      text: 'يقصد بالحجم في التصميم:',
      options: [
        'أ. لون الشكل',
        'ب. مساحة الشكل فقط',
        'ج. الأبعاد الثلاثية للشكل',
        'د. نوع الخط المستخدم'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 8,
      text: 'الملمس الرقمي في التصميم يتم تحقيقه من خلال:',
      options: [
        'أ. الخامات الطبيعية فقط',
        'ب. الإضاءة الطبيعية',
        'ج. المؤثرات الرقمية داخل التصميم',
        'د. الورق والألوان اليدوية'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 9,
      text: 'أي مما يلي يُعد من أنواع الألوان؟',
      options: [
        'أ. الألوان المتوازنة',
        'ب. الألوان الساخنة والباردة',
        'ج. الألوان الانسجامية',
        'د. الألوان التركيزية'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 10,
      text: 'يقصد بالتكرار في التصميم:',
      options: [
        'أ. استخدام عنصر واحد مرة واحدة',
        'ب. توزيع العناصر عشوائياً',
        'ج. إعادة استخدام العناصر لتحقيق الإيقاع',
        'د. تكبير حجم العناصر فقط'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 11,
      text: 'التدرج في التصميم يعتمد على:',
      options: [
        'أ. التناقض بين العناصر',
        'ب. الانتقال التدريجي بين الأحجام أو الألوان',
        'ج. التوازن المتماثل',
        'د. التكرار العشوائي'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 12,
      text: 'التنوع في التصميم يهدف إلى:',
      options: [
        'أ. إحداث الملل البصري',
        'ب. إلغاء الوحدة',
        'ج. كسر الرتابة وتحقيق الجذب',
        'د. تقليل عدد العناصر'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 13,
      text: 'التوازن في التصميم يعني:',
      options: [
        'أ. تماثل الألوان فقط',
        'ب. توزيع العناصر بشكل متساوٍ أو غير متساوٍ بصرياً',
        'ج. كثرة التفاصيل',
        'د. استخدام لون واحد'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 14,
      text: 'التباين في التصميم يُستخدم من أجل:',
      options: [
        'أ. إخفاء العناصر',
        'ب. تحقيق التشابه',
        'ج. إبراز العناصر المهمة',
        'د. تقليل التأثير البصري'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 15,
      text: 'الوحدة في التصميم تعني:',
      options: [
        'أ. استخدام عنصر واحد',
        'ب. عدم وجود تنوع',
        'ج. ترابط عناصر التصميم في تكوين متكامل',
        'د. تكرار اللون فقط'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 16,
      text: 'التصميم الرقمي يعتمد أساساً على:',
      options: [
        'أ. الخامات الطبيعية',
        'ب. الأدوات اليدوية',
        'ج. البرمجيات والتقنيات الرقمية',
        'د. الرسم بالقلم فقط'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 17,
      text: 'من عناصر التصميم الرقمي:',
      options: [
        'أ. النقطة اليدوية',
        'ب. الخط التقليدي',
        'ج. الحركة الرقمية',
        'د. الورق المقوى'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 18,
      text: 'يتيح المعمل الافتراضي للطالب:',
      options: [
        'أ. التلقي السلبي فقط',
        'ب. التفاعل والمحاكاة الرقمية',
        'ج. حفظ المعلومات دون تطبيق',
        'د. إلغاء دور التصميم الفني'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 19,
      text: 'من عناصر التصميم (تكملة):',
      options: [
        'أ) التظليل',
        'ب) التدرج',
        'ج) النقطة',
        'د) التبشير'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 20,
      text: 'يُقصد بأسس التصميم:',
      options: [
        'أ. الأدوات المستخدمة في الرسم',
        'ب. القواعد التي تنظم العلاقات بين عناصر التصميم',
        'ج. أنواع الخطوط فقط',
        'د. الأشكال الهندسية الجاهزة'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 21,
      text: 'من الألوان الحيادية التي يمكن استخدامها داخل برامج التصميم الرقمي:',
      options: [
        'أ) البنفسجي',
        'ب) الأحمر',
        'ج) الأزرق',
        'د) الأبيض'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 22,
      text: 'من أسس التصميم التي يُراعى تطبيقها عند بناء تصميم رقمي داخل المعمل الافتراضي:',
      options: [
        'أ) الإيقاع',
        'ب) التناسب',
        'ج) الاتزان',
        'د) كل ما سبق'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 23,
      text: 'التناسب في التصميم الرقمي داخل المعمل الافتراضي يعني:',
      options: [
        'أ) العلاقة القياسية المصممة فقط',
        'ب) مقارنة الأحجام والمساحات والأطوال داخل مساحة العمل الرقمية',
        'ج) النسبة المخططة للمقادير والفواصل فقط',
        'د) (أ، ج) صحيحتان'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 24,
      text: 'قاعدة المتوالية العددية في التصميم (٣٤ - ٥٥ - ٨٩ - ١٤٤) يمكن توظيفها داخل التصميمات الرقمية وفق:',
      options: [
        'أ) النسبة الذهبية',
        'ب) النسبة التوافقية',
        'ج) النسبة العشوائية',
        'د) النسبة المئوية'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 25,
      text: 'النسبة الذهبية في التصميم الافتراضي تعني:',
      options: [
        'أ) مساحة الشكل ومحيطه',
        'ب) جزئين من عرض مضروب في الطول',
        'ج) جزئين من الطول بحيث تتكرر النسبة بين الجزء والكل داخل التكوين الرقمي',
        'د) جزئين من المساحة فقط'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 26,
      text: 'الألوان الأساسية التي تستخدم في التصميم الرقمي هي:',
      options: [
        'أ) بني - أزرق - أسود',
        'ب) بنفسجي - أخضر - برتقالي',
        'ج) أحمر - أصفر - أزرق',
        'د) أصفر - رمادي - بيج'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 27,
      text: 'الألوان التي تنتج من خلط لونين أساسيين تسمى:',
      options: [
        'أ) الألوان الأساسية',
        'ب) الألوان الثانوية',
        'ج) الألوان الأحادية',
        'د) الألوان الحيادية'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 28,
      text: 'يستفاد من القيمة الضوئية للون في:',
      options: [
        'أ) التمييز بين درجة إشراق اللون وبريقه',
        'ب) التحكم في قوة اللون وصفائه عبر أدوات البرنامج',
        'ج) ضبط الإضاءة الافتراضية للتصميم',
        'د) كل ما سبق'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 29,
      text: 'أطول الألوان طولاً موجياً وأكثرها قدرة على الجذب بصرياً في التصميمات الرقمية هو:',
      options: [
        'أ) الأخضر',
        'ب) الأصفر',
        'ج) الأحمر',
        'د) الأزرق'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 30,
      text: 'التكرار (١-٢-١-٢-١) في التصميم يُعد تكراراً:',
      options: [
        'أ) رتيباً',
        'ب) منتظماً',
        'ج) متناوباً',
        'د) عشوائياً'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 31,
      text: 'يقسم دليل القيمة الضوئية المستخدم في ضبط الألوان داخل بيئات التصميم الرقمي إلى:',
      options: [
        'أ) ثلاث درجات',
        'ب) ست درجات',
        'ج) تسع درجات',
        'د) اثنتي عشرة درجة'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 32,
      text: 'تتحلل الضوء الأبيض عند محاكاته إلى:',
      options: [
        'أ) ثلاثة ألوان',
        'ب) خمسة ألوان',
        'ج) سبعة ألوان',
        'د) تسعة ألوان'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 33,
      text: 'التكرار الكامل للعناصر المتماثلة داخل التصميم الرقمي يسمى:',
      options: [
        'أ) تناغم',
        'ب) تنافر',
        'ج) تشابه',
        'د) تماثل'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 34,
      text: 'التشابه في العمل الفني الرقمي يعني:',
      options: [
        'أ) وجود وحدات مشتركة في أكثر من عنصر أو صفة داخل التصميم',
        'ب) وجود وحدات مشتركة في جميع العناصر',
        'ج) عدم وجود وحدات مشتركة',
        'د) كل ما سبق خطأ'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 35,
      text: 'التوازن في التكوين الرقمي هو:',
      options: [
        'أ) تعادل القوى المتعاكسة داخل مساحة التصميم',
        'ب) تغير القوى المتعاكسة',
        'ج) تطابق القوى المتعاكسة',
        'د) تشابه القوى المتعاكسة'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 36,
      text: 'التوازن الذي يكون أقل هدوءاً وأكثر جذباً للاهتمام في التصميم الرقمي هو:',
      options: [
        'أ) التوازن الشكلي',
        'ب) التوازن اللاشكلي',
        'ج) التوازن المتطابق',
        'د) التوازن المتشابه'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 37,
      text: 'شدة اللون في بيئة المعمل الافتراضي تعني:',
      options: [
        'أ) مقدار زهوة اللون ونقائه',
        'ب) كون اللون فاتحاً أو غامقاً',
        'ج) التأثير النفسي للون',
        'د) إدراك العين للون'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 38,
      text: 'يمزج الألوان الأساسية ضوئياً داخل برامج التصميم ينتج اللون:',
      options: [
        'أ) الأخضر',
        'ب) البنفسجي',
        'ج) الأبيض',
        'د) البني'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 39,
      text: 'من متقابلات التصميم:',
      options: [
        'أ) اللون والملمس',
        'ب) التدرج والتنوع',
        'ج) الزمان والمكان',
        'د) السيادة والحركة'
      ],
      linguistic: '', belonging: '', amendment: ''
    },
    {
      id: 40,
      text: 'يتوقف إدراك الأشكال المجسمة بعدة عوامل منها:',
      options: [
        'أ) اختلاف الوظيفة',
        'ب) اختلاف تأثير مادة الشكل',
        'ج) اختلاف تركيب المساحات',
        'د) كل ما سبق'
      ],
      linguistic: '', belonging: '', amendment: ''
    }
  ]);

  currentPage = signal<number>(0);

  // Pagination ranges
  pageRanges = [
    { start: 0, end: 8 },
    { start: 8, end: 17 },
    { start: 17, end: 23 },
    { start: 23, end: 29 },
    { start: 29, end: 35 },
    { start: 35, end: 40 }
  ];

  get visibleQuestions() {
    const range = this.pageRanges[this.currentPage()];
    return this.questions().slice(range.start, range.end);
  }

  get totalPages() {
    return this.pageRanges.length;
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

  saveEvaluation() {
    alert('تم حفظ تقييم المحكم لهذه الصفحة بنجاح!');
  }
}
