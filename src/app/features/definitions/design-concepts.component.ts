import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

interface DesignConceptRow {
  concept: string;
  definition: string;
  branches: string[];
}

@Component({
  selector: 'app-design-concepts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="concepts-page p-4 md:p-8 animate-fade-in-up">
      <div *ngIf="pageData">
        <h2 class="page-title">
          {{ pageData.title }}
        </h2>
        <p class="page-lead">
          قائمة مفاهيم التصميم اللازمة لطلاب المرحلة الثانوية في مادة التربية الفنية
        </p>

        <div class="concepts-list">
          <article
            *ngFor="let row of concepts; let i = index"
            class="concept-card"
            [class.open]="openIndex() === i">

            <button
              type="button"
              class="concept-header"
              data-sound="select"
              (click)="toggle(i)"
              [attr.aria-expanded]="openIndex() === i">
              <span class="concept-index">{{ i + 1 }}</span>
              <span class="concept-name">{{ row.concept }}</span>
              <span class="material-icons concept-chevron" aria-hidden="true">
                {{ openIndex() === i ? 'expand_less' : 'expand_more' }}
              </span>
            </button>

            <div class="concept-body" *ngIf="openIndex() === i">
              <div class="definition-block">
                <span class="definition-label">التعريف</span>
                <p class="definition-text">{{ row.definition }}</p>
              </div>

              <div class="branches-block">
                <span class="branches-label">يتفرع منه</span>
                <ol class="branches-list">
                  <li
                    *ngFor="let branch of row.branches; let bi = index"
                    class="branch-item"
                    data-sound="select"
                    role="button"
                    tabindex="0">
                    <span class="branch-num">{{ bi + 1 }}</span>
                    <span class="branch-text">{{ branch }}</span>
                  </li>
                </ol>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: clamp(1.4rem, 3vw, 1.9rem);
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 4px solid var(--color-primary, #6b4226);
      display: inline-block;
    }

    .page-lead {
      color: #555;
      font-size: clamp(1rem, 2.2vw, 1.15rem);
      line-height: 1.8;
      margin: 0 0 1.75rem;
      max-width: 48rem;
    }

    .concepts-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      max-width: 56rem;
    }

    .concept-card {
      background: #fff;
      border: 1px solid #e7e0d6;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(60, 40, 20, 0.06);
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .concept-card.open {
      border-color: rgba(107, 66, 38, 0.35);
      box-shadow: 0 10px 28px rgba(107, 66, 38, 0.12);
    }

    .concept-header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem 1.15rem;
      background: linear-gradient(135deg, #faf6f1 0%, #fff 100%);
      border: none;
      cursor: pointer;
      text-align: right;
      color: #1a1a1a;
      font-family: inherit;
    }

    .concept-header:hover {
      background: linear-gradient(135deg, #f3ebe2 0%, #fffaf5 100%);
    }

    .concept-index {
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      background: var(--color-primary, #6b4226);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      flex-shrink: 0;
      font-size: 0.95rem;
    }

    .concept-name {
      flex: 1;
      font-size: clamp(1.05rem, 2.4vw, 1.25rem);
      font-weight: 800;
    }

    .concept-chevron {
      color: var(--color-primary, #6b4226);
      font-size: 1.6rem;
    }

    .concept-body {
      padding: 0 1.15rem 1.25rem;
      border-top: 1px solid #efe7dc;
      animation: conceptReveal 0.28s ease;
    }

    @keyframes conceptReveal {
      from {
        opacity: 0;
        transform: translateY(-0.4rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .definition-block {
      margin-top: 1rem;
      background: #faf7f2;
      border-radius: 0.75rem;
      padding: 0.9rem 1rem;
    }

    .definition-label,
    .branches-label {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--color-primary, #6b4226);
      margin-bottom: 0.45rem;
      letter-spacing: 0.02em;
    }

    .definition-text {
      margin: 0;
      color: #333;
      line-height: 1.9;
      font-size: clamp(0.95rem, 2vw, 1.05rem);
      font-weight: 600;
    }

    .branches-block {
      margin-top: 1rem;
    }

    .branches-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .branch-item {
      display: flex;
      align-items: flex-start;
      gap: 0.7rem;
      padding: 0.7rem 0.85rem;
      border-radius: 0.7rem;
      border: 1px solid #ebe4da;
      background: #fff;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .branch-item:hover {
      border-color: rgba(107, 66, 38, 0.35);
      background: #fffaf4;
    }

    .branch-num {
      width: 1.55rem;
      height: 1.55rem;
      border-radius: 0.4rem;
      background: rgba(107, 66, 38, 0.12);
      color: var(--color-primary, #6b4226);
      font-weight: 800;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    .branch-text {
      color: #2a2a2a;
      line-height: 1.75;
      font-size: clamp(0.9rem, 2vw, 1rem);
      font-weight: 600;
    }

    @media (prefers-reduced-motion: reduce) {
      .concept-body {
        animation: none;
      }
    }
  `],
})
export class DesignConceptsComponent {
  private contentService = inject(ContentService);
  pageData = this.contentService.getPage('design-concepts');
  openIndex = signal<number | null>(0);

  readonly concepts: DesignConceptRow[] = [
    {
      concept: 'التصميم الفني',
      definition:
        'عملية لتنظيم وتوظيف عناصر الفن المختلفة وفق أسس جمالية محددة بهدف إنتاج عمل فني متكامل يجمع بين الجمال والوظيفة ويتفرع منه:',
      branches: [
        'مفهوم التصميم.',
        'أهمية التصميم.',
        'التصميم الرقمي.',
        'موضوع التصميم.',
        'طريقة التصميم.',
        'وظيفة التصميم.',
        'التصميم الزخرفي.',
      ],
    },
    {
      concept: 'عناصر التصميم',
      definition:
        'مجموعة من المكونات البصرية التي يتم توظيفها رقميًا داخل التصميم الافتراضي، بهدف بناء التكوين الفني وتحقيق التأثير البصري والجمالي ويتفرع منه:',
      branches: [
        'النقطة: (نوع النقطة، مساحة النقطة، لون النقطة، النقطة الرقمية).',
        'الخط: (الخطوط البسيطة (أفقية – رأسية – مائلة)، خطوط غير مستقيمة (منحنية – مقوسة – انسيابية)، الخطوط المركبة).',
        'الشكل: (أشكال هندسية، أشكال رقمية، أشكال طبيعية، أشكال عضوية).',
        'الحجم: (هندسي منتظم، شبه منتظم، التناسب).',
        'الملمس: (مفهوم الملمس، درجة الملمس (ناعم – خشن – منتظم – غير منتظم)، نوع الملمس (حقيقي – رقمي – طبيعي)).',
        'الإضاءة: (نوع الإضاءة، أشكال الإضاءة).',
        'اللون: (الدلالة اللونية (أصل اللون – شدة اللون)، الألوان الحيادية، الألوان الساخنة والباردة، الألوان المتكاملة، الألوان الرقمية).',
      ],
    },
    {
      concept: 'عمليات التصميم',
      definition:
        'إجراءات وأساليب رقمية تستخدم داخل المعمل الافتراضي لتنظيم عناصر التصميم وتوزيعها بطريقة تحقق الإيقاع البصري والتوازن والتنوع ويتفرع منه:',
      branches: [
        'التكرار (المتغير، المتناوب).',
        'التنوع (التغير والتنغيم الإيقاعي).',
        'التدرج (الإيقاع، الإيقاع المتزايد والمتناقص).',
      ],
    },
    {
      concept: 'أسس التصميم',
      definition:
        'مجموعة من المبادئ التنظيمية التي تحكم توظيف عناصر التصميم رقميًا داخل المعمل الافتراضي بما يضمن تحقيق التوازن والانسجام ويتفرع منه:',
      branches: [
        'الأسس الاتجاهية (التوازي، التتابع، الإشباع).',
        'الأسس التركيزية (التباين، التوكيد).',
        'الأسس المركبة (التناسب، الانسجام، الاتزان، الوحدة).',
      ],
    },
    {
      concept: 'الأسس الإنشائية للتصميم',
      definition:
        'إطار مفاهيمي ينظم بناء التصميم الافتراضي من حيث العلاقات البصرية والقيم الجمالية والوظيفية، ويظهر التفاعل بين عناصر التصميم ويتفرع منه:',
      branches: [
        'مقابلات التصميم (الشكل والأرضية، الزمان والمكان).',
        'قيم التصميم (وظيفية، جمالية، أخلاقية).',
      ],
    },
    {
      concept: 'التصميم الرقمي',
      definition:
        'استخدام التقنيات الرقمية والبرمجيات الحاسوبية في إنتاج وتصميم الأعمال الفنية بما يتيح التفاعل، والمحاكاة الافتراضية داخل بيئات رقمية ويتفرع منه:',
      branches: [
        'النقطة الرقمية.',
        'الخط الرقمي.',
        'الشكل الرقمي.',
        'اللون الرقمي.',
        'الحركة الرقمية.',
      ],
    },
  ];

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
