import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-design-skills',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="content-container animate-fade-in-up" style="direction: rtl; font-family: 'Noto Kufi Arabic', Arial, sans-serif; padding: 2rem;">
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 2rem; border-bottom: 2px solid #6b4226; padding-bottom: 0.5rem; display: inline-block;">
        مهارات التصميم (Design Skills)
      </h2>
      
      <div style="font-size: 1.2rem; line-height: 2; color: #444; max-width: 900px;">
        تعرف بأنها قدرة طلاب المرحلة الثانوية على الأداء العملي لمهام التصميم الفني بكفاءة، والتي تتمثل في توظيف عناصر التصميم وتنظيمها داخل عمل فني متكامل، وتشمل مهارات التخطيط، والتنفيذ، والتعديل، والإخراج الفني، وفق معايير محددة في بطاقة ملاحظة أعدتها الباحث، ويتم قياسها قبل وبعد تطبيق المعمل الافتراضي.
      </div>
    </div>
  `
})
export class DesignSkillsComponent { }
