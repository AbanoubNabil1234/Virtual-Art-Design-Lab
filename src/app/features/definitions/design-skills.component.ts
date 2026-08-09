import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

interface DesignSkillGroup {
  title: string;
  skills: string[];
}

@Component({
  selector: 'app-design-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skills-page p-4 md:p-8 animate-fade-in-up">
      <div *ngIf="pageData">
        <h2 class="page-title">
          {{ pageData.title }}
        </h2>

        <p class="page-lead">
          قائمة مهارات التصميم اللازمة لطلاب المرحلة الثانوية في مادة التربية الفنية
        </p>

        <div class="skills-list">
          <article
            *ngFor="let group of skillGroups; let i = index"
            class="skill-card"
            [class.open]="openIndex() === i">

            <button
              type="button"
              class="skill-header"
              data-sound="select"
              (click)="toggle(i)"
              [attr.aria-expanded]="openIndex() === i">
              <span class="skill-index">{{ i + 1 }}</span>
              <span class="skill-name">{{ group.title }}</span>
              <span class="material-icons skill-chevron" aria-hidden="true">
                {{ openIndex() === i ? 'expand_less' : 'expand_more' }}
              </span>
            </button>

            <div class="skill-body" *ngIf="openIndex() === i">
              <ol class="skill-items">
                <li *ngFor="let skill of group.skills; let si = index" class="skill-item">
                  <span class="skill-bullet">{{ si + 1 }}</span>
                  <span class="skill-text">{{ skill }}</span>
                </li>
              </ol>
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

    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      max-width: 56rem;
    }

    .skill-card {
      background: #fff;
      border: 1px solid #e7e0d6;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(60, 40, 20, 0.06);
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .skill-card.open {
      border-color: rgba(107, 66, 38, 0.35);
      box-shadow: 0 10px 28px rgba(107, 66, 38, 0.12);
    }

    .skill-header {
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

    .skill-header:hover {
      background: linear-gradient(135deg, #f3ebe2 0%, #fffaf5 100%);
    }

    .skill-index {
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

    .skill-name {
      flex: 1;
      font-size: clamp(1.05rem, 2.4vw, 1.25rem);
      font-weight: 800;
    }

    .skill-chevron {
      color: var(--color-primary, #6b4226);
      font-size: 1.6rem;
    }

    .skill-body {
      padding: 0 1.15rem 1.25rem;
      border-top: 1px solid #efe7dc;
      animation: skillReveal 0.28s ease;
    }

    @keyframes skillReveal {
      from {
        opacity: 0;
        transform: translateY(-0.4rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .skill-items {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .skill-item {
      display: flex;
      align-items: flex-start;
      gap: 0.7rem;
      padding: 0.7rem 0.85rem;
      border-radius: 0.7rem;
      border: 1px solid #ebe4da;
      background: #fff;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .skill-item:hover {
      border-color: rgba(107, 66, 38, 0.35);
      background: #fffaf4;
    }

    .skill-bullet {
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

    .skill-text {
      color: #2a2a2a;
      line-height: 1.75;
      font-size: clamp(0.9rem, 2vw, 1rem);
      font-weight: 600;
    }

    @media (prefers-reduced-motion: reduce) {
      .skill-body {
        animation: none;
      }
    }
  `]
})
export class DesignSkillsComponent {
  private contentService = inject(ContentService);
  pageData = this.contentService.getPage('design-skills');
  openIndex = signal<number | null>(0);

  readonly skillGroups: DesignSkillGroup[] = [
    {
      title: 'مهارات استخدام النقطة في التصميم الرقمي',
      skills: [
        'مهارة استخدام النقطة في التصميم رقمياً.',
        'مهارة استخدام أنواع النقاط رقمياً.',
        'مهارة توظيف النقطة في بناء الشكل الخارجي للتصميم الافتراضي.',
        'مهارة الترتيب البصري للنقط داخل مساحة تصميم افتراضية.'
      ]
    },
    {
      title: 'مهارات استخدام الخط في التصميم الفني',
      skills: [
        'مهارة استخدام الخطوط البسيطة أفقياً في تصميم العمل الفني.',
        'مهارة استخدام الخطوط غير المستقيمة.',
        'مهارة استخدام الخطوط المركبة في تصميم العمل الفني الرقمي.'
      ]
    },
    {
      title: 'مهارات استخدام الشكل في التصميم الافتراضي',
      skills: [
        'مهارة استخدام الأشكال الهندسية رقمياً.',
        'مهارة استخدام الأشكال العضوية في التصميم الافتراضي.',
        'مهارة استخدام الأشكال الطبيعية من خلال النماذج الرقمية.',
        'مهارة استخدام الأشكال الرقمية إيجاد وحدة بنية العمل الافتراضي.'
      ]
    },
    {
      title: 'مهارات استخدام الحجم والكتلة في التصميم',
      skills: [
        'مهارة استخدام حجم هندسي منتظم داخل التصميم الافتراضي.',
        'مهارة استخدام حجم شبه منتظم باستخدام المحاكاة الرقمية.',
        'مهارة إيجاد الملمس في التصميم باستخدام المؤثرات الرقمية.',
        'مهارة التمييز بين أنواع الملامس داخل العمل الافتراضي.'
      ]
    },
    {
      title: 'مهارات توظيف الإضاءة الرقمية',
      skills: [
        'مهارة استخدام الإضاءة المركزة رقمياً.',
        'مهارة استخدام الإضاءة المباشرة في التصميم الافتراضي.',
        'مهارة استخدام الإضاءة الموزعة داخل بيئة المحاكاة.'
      ]
    },
    {
      title: 'مهارات استخدام اللون في التصميم الرقمي',
      skills: [
        'مهارة استخدام الألوان الأساسية رقمياً.',
        'مهارة استخدام الألوان الرقمية بإتقان.',
        'مهارة إيجاد الألوان الثانوية في التصميم الافتراضي.',
        'مهارة استخدام الألوان الساخنة والباردة رقمياً.',
        'مهارة تحقيق الانسجام اللوني باستخدام أدوات المعمل الافتراضي.'
      ]
    },
    {
      title: 'مهارات التكرار والإيقاع البصري',
      skills: [
        'مهارة الثبات اللوني في التصميم الرقمي.',
        'مهارة استخدام التكرار المنتظم لونياً.',
        'مهارة استخدام التكرار المتغير باستخدام أدوات النسخ والتكرار الافتراضي.'
      ]
    },
    {
      title: 'مهارات الأسس الإنشائية للتصميم',
      skills: [
        'مهارة استخدام الأسس الإنشائية في التصميم الرقمي.',
        'مهارة استخدام الأسس المركزية داخل العمل الفني الافتراضي.',
        'مهارة إيجاد العلاقات بين الشكل والأرضية في التصميم الرقمي.',
        'مهارة توظيف عنصري الزمان والمكان داخل التصميم الافتراضي.'
      ]
    }
  ];

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
