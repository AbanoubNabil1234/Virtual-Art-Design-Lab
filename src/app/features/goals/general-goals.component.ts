import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-goals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col py-8 px-6 home-content" style="direction: rtl; font-family: 'Noto Kufi Arabic', Arial, sans-serif;">
      
      <h1 class="animate-fade-in-up" style="font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 2rem; border-bottom: 2px solid #ddd; padding-bottom: 1rem;">
        أهداف استخدام المعامل الافتراضية في تدريس التربية الفنية
      </h1>

      <ul class="animate-fade-in-up delay-100" style="list-style: none; padding: 0; font-size: 1.1rem; line-height: 2; color: #333;">
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>إتاحة بيئة تعلم تفاعلية قائمة على المحاكاة والتجريب.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تنمية مفاهيم التصميم الفني ومهاراته لدى طلاب المرحلة الثانوية.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تبسيط المفاهيم الفنية المجردة، ودعم التعلم القائم على الممارسة والتجريب الذاتي.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تعزيز دافعية الطلاب نحو التعلم، بما ينعكس إيجابًا على مستوى أدائهم التصميمي واتجاهاتهم نحو مادة التربية الفنية.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>التعرف على البرمجيات التعليمية المتنوعة وكيفية توظيفها في مجال التصميم الفني.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تطوير مهارات حل المشكلات الفنية والإبداعية.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تبسيط المفاهيم الفنية وتقديمها بطريقة مشوقة وجاذبة للطلاب.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>القدرة على ترجمة المفاهيم الفنية إلى واقع ملموس يدركه المتعلم.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>معالجة نقاط ضعف الطلاب وتمكينهم من تطوير مهارات التصميم الفني بشكل فعال.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تعزيز شعور الطلاب بالراحة والاسترخاء أثناء تنفيذ الأنشطة الافتراضية.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تمكين الطلاب من تصميم وتجميع أجزاء التجارب الفنية بأنفسهم للحصول على نتائج إبداعية ذات معنى.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تحسين إجراءات السلامة أثناء تنفيذ التجارب الفنية، مما يسمح بتنفيذ تجارب قد تكون خطرة في المعامل التقليدية.</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span class="material-icons" style="color: #6b4226; margin-left: 10px; font-size: 1.2rem; margin-top: 5px;">fiber_manual_record</span>
          <span>تكوين اتجاهات إيجابية نحو دراسة الفنون وتنمية القدرة على التفكير الاستنتاجي من خلال وضع فرضيات واختبارها عمليًا عبر المحاكاة.</span>
        </li>
      </ul>

      <div class="animate-fade-in-up delay-200" style="margin-top: 2rem; text-align: center;">
         <div style="font-size: 1rem; color: #555; margin-bottom: 8px;">إعــداد الباحث</div>
         <div style="font-size: 1.1rem; font-weight: bold; color: #1a1a1a;">أحمد عدنان ياسين</div>
      </div>
    </div>
  `
})
export class GeneralGoalsComponent { }
