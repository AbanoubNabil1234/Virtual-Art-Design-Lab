import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-instructions',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in-up">
      
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          دليل إرشادات الاستخدام
        </h1>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          عزيزي الطالب، يوضح لك هذا الدليل كيفية الاستفادة القصوى من المعمل الافتراضي والكتاب الرقمي لتحقيق أفضل النتائج التعليمية.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Digital Book Section -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-transform hover:scale-[1.01]">
          <div class="bg-gradient-to-r from-secondary to-secondary-dark p-6 text-white flex items-center gap-4">
            <span class="material-icons text-4xl text-accent">auto_stories</span>
            <h2 class="text-2xl font-bold">أولاً: دليل الكتاب الرقمي</h2>
          </div>
          <div class="p-8 flex-1 space-y-6">
            <div class="flex gap-4 items-start">
              <span class="bg-blue-50 text-secondary p-2 rounded-xl material-icons">navigation</span>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">التنقل بين الصفحات</h3>
                <p class="text-gray-600 text-sm">استخدم القائمة الجانبية اليمنى للوصول السريع إلى الوحدات والدروس المختلفة.</p>
              </div>
            </div>
            
            <div class="flex gap-4 items-start">
              <span class="bg-blue-50 text-secondary p-2 rounded-xl material-icons">checklist_rtl</span>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">الاختبارات والتقييم</h3>
                <p class="text-gray-600 text-sm">ابدأ بالاختبار القبلي لتحديد مستواك، وقم بحل الاختبارات الأدائية بعد كل درس.</p>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <span class="bg-blue-50 text-secondary p-2 rounded-xl material-icons">edit_note</span>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">الملاحظات الشخصية</h3>
                <p class="text-gray-600 text-sm">استخدم مفكرة الملاحظات لتدوين الأفكار الهامة أثناء الدراسة.</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
            <a routerLink="/cover" class="btn-primary w-full shadow-lg">التوجه لغلاف الكتاب</a>
          </div>
        </div>

        <!-- Virtual Lab Section -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-transform hover:scale-[1.01]">
          <div class="bg-gradient-to-r from-primary to-primary-light p-6 text-white flex items-center gap-4">
            <span class="material-icons text-4xl text-accent">science</span>
            <h2 class="text-2xl font-bold">ثانياً: دليل المعمل الافتراضي</h2>
          </div>
          <div class="p-8 flex-1 space-y-6">
            <div class="flex gap-4 items-start">
              <span class="bg-orange-50 text-primary p-2 rounded-xl material-icons">construction</span>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">الأدوات الرقمية</h3>
                <p class="text-gray-600 text-sm">تعرف على أدوات التصميم داخل المعمل واستخدمها لتنفيذ التجارب والمهام المطلوبة.</p>
              </div>
            </div>
            
            <div class="flex gap-4 items-start">
              <span class="bg-orange-50 text-primary p-2 rounded-xl material-icons">forum</span>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">التواصل والحوار</h3>
                <p class="text-gray-600 text-sm">شارك في غرفة الحوار والمنتدى لمناقشة زملائك ومعلمك في مهارات التصميم.</p>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <span class="bg-orange-50 text-primary p-2 rounded-xl material-icons">mail</span>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">البريد الداخلي</h3>
                <p class="text-gray-600 text-sm">استخدم البريد الإلكتروني لإرسال استفساراتك للمعلم واستلام التغذية الراجعة.</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
            <a routerLink="/lab" class="btn-action w-full shadow-lg">دخول المعمل الآن</a>
          </div>
        </div>

      </div>

      <!-- Quick Tips Section -->
      <div class="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <span class="material-icons text-9xl">info</span>
        </div>
        <div class="relative z-10 max-w-3xl">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span class="material-icons text-accent">lightbulb</span>
            نصائح هامة للنجاح
          </h2>
          <ul class="space-y-4 text-gray-300 text-lg list-disc pr-6">
            <li>اتبع الخطوات المتسلسلة في تنفيذ التجارب لضمان دقة العمل.</li>
            <li>راجع المصطلحات الأساسية ومفاهيم التصميم قبل البدء بالمهام العملية.</li>
            <li>لا تتردد في طلب المساعدة عبر غرفة الحوار إذا واجهت أي صعوبة تقنية.</li>
            <li>احرص على تسليم جميع المهام الأدائية في وقتها المحدد للتقييم الصحيح.</li>
          </ul>
        </div>
      </div>

    </div>
  `,
    styles: [`
    :host {
      display: block;
      min-height: 100%;
      background-color: #f8fafc;
    }
  `]
})
export class InstructionsComponent { }
