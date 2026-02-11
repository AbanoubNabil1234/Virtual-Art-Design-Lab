import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-design-concepts',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="content-container animate-fade-in-up" style="direction: rtl; font-family: 'Noto Kufi Arabic', Arial, sans-serif; padding: 2rem;">
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 2rem; border-bottom: 2px solid #6b4226; padding-bottom: 0.5rem; display: inline-block;">
        مفاهيم التصميم (Design Concepts)
      </h2>
      
      <div style="font-size: 1.2rem; line-height: 2; color: #444; max-width: 900px;">
        تعرف بأنها مجموعة المعارف والمفاهيم الأساسية المرتبطة بالتصميم في مادة التربية الفنية، والتي تشمل (مثل: الخط، الشكل، اللون، التوازن، التناسب، الإيقاع، الوحدة)، والمحددة في قائمة أعدتها الباحث، ويُقاس مستوى اكتسابها لدى طلاب المرحلة الثانوية من خلال الاختبار التحصيلي المعد لهذا الغرض قبل وبعد تطبيق المعمل الافتراضي.
      </div>
    </div>
  `
})
export class DesignConceptsComponent { }
