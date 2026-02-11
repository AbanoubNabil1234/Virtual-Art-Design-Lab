import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-virtual-lab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="content-container animate-fade-in-up" style="direction: rtl; font-family: 'Noto Kufi Arabic', Arial, sans-serif; padding: 2rem;">
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 2rem; border-bottom: 2px solid #6b4226; padding-bottom: 0.5rem; display: inline-block;">
        المعمل الافتراضي (Virtual Lab)
      </h2>
      
      <div style="font-size: 1.2rem; line-height: 2; color: #444; max-width: 900px;">
        يمكن تعريف المعمل الافتراضي بأنه بيئة تعليمية رقمية تفاعلية من تصميم الباحث، تُستخدم في تدريس التربية الفنية لطلاب المرحلة الثانوية، وتُحاكي مواقف التعلم الواقعية المرتبطة بعمليات التصميم الفني، من خلال مجموعة من الأنشطة والتطبيقات الافتراضية التي تتيح للطلاب ممارسة مهارات التصميم، والتجريب، والتعديل، والتكرار داخل بيئة آمنة، ويتم قياس أثرها في تنمية مفاهيم ومهارات التصميم لدى الطلاب من خلال أدوات الدراسة. ومعالجة المواقف اللغوية، والقدرة على تفسير الأفكار بطرق متعددة، وإنتاج حلول أو تعبيرات متنوعة.
      </div>
    </div>
  `
})
export class VirtualLabComponent { }
