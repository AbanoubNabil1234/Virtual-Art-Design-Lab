import { Injectable, computed, effect, signal } from '@angular/core';

export interface LessonPracticalTask {
  id: number;
  lessonId: string;
  lessonNumber: number;
  lessonTitle: string;
  question: string;
  skills: string[];
  exampleTitle: string;
  exampleDescription: string;
  recommendedTools: string[];
  exampleSvg: string;
  posterImage?: string;
  completed: boolean;
  remainingSeconds: number; // 10 minutes = 600 seconds
  timeSpentSeconds: number;
  completedAt?: string;
}

export interface LessonPracticalStorageState {
  tasks: { id: number; completed: boolean; completedAt?: string; remainingSeconds: number; timeSpentSeconds: number }[];
  activeTaskId: number | null;
}

export const LESSON_PRACTICAL_DEFAULT_DURATION = 10 * 60; // 10 minutes

export const DEFAULT_LESSON_PRACTICAL_TASKS: Omit<LessonPracticalTask, 'completed' | 'remainingSeconds' | 'timeSpentSeconds'>[] = [
  {
    id: 1,
    lessonId: 'blueprint-to-canvas',
    lessonNumber: 1,
    lessonTitle: 'الدرس الأول: التصميم الفني ومفاهيمه الأساسية',
    question: 'صمّم غلاف كتاب رقمي مبسط داخل المعمل الافتراضي يوازن بوضوح بين القيمة الجمالية الفنية والوظيفة العملية للغلاف',
    skills: [
      'الموازنة الواضحة بين القيمة الجمالية الفنية والوظيفة العملية للغلاف.',
      'تنظيم الهيكل البصري للغلاف الرقمي (العنوان، اسم المؤلف، الإطار، والشكل الرمزي).',
      'توظيف التوزيع اللوني والخطوط لبناء رسالة بصرية واضحة وجذابة.'
    ],
    exampleTitle: 'مثال توضيحي: تصميم غلاف كتاب رقمي (توازن جمالي ووظيفي)',
    exampleDescription: 'استخدم أداة المستطيل/المربع لرسم إطار الغلاف، وأداة النص (T) لكتابة عنوان الكتاب واسم المؤلف، مع إضافة رمز فني معبر وألوان متناسقة تبرز الغلاف.',
    recommendedTools: ['مستطيل/مربع', 'نص (T)', 'تعبئة (F)', 'خط'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fdfbf7" rx="10"/>
      <!-- Book Cover Outer Frame -->
      <rect x="35" y="12" width="130" height="126" rx="6" fill="#f8fafc" stroke="#6b4226" stroke-width="2.5"/>
      <!-- Book Spine Indicator -->
      <rect x="35" y="12" width="14" height="126" rx="3" fill="#6b4226" opacity="0.85"/>
      <!-- Decorative Header Band -->
      <rect x="54" y="24" width="96" height="20" rx="3" fill="#d97706" opacity="0.2"/>
      <rect x="60" y="29" width="60" height="4" rx="2" fill="#d97706"/>
      <rect x="60" y="36" width="40" height="3" rx="1.5" fill="#6b4226" opacity="0.6"/>
      <!-- Central Aesthetic Emblem (Geometric & Artful balance) -->
      <circle cx="102" cy="72" r="20" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
      <polygon points="102,58 112,78 92,78" fill="#d97706" opacity="0.5"/>
      <circle cx="102" cy="72" r="7" fill="#6b4226"/>
      <!-- Author / Functional Subtitle line -->
      <rect x="66" y="104" width="70" height="3.5" rx="1.5" fill="#475569"/>
      <rect x="76" y="112" width="50" height="2.5" rx="1" fill="#94a3b8"/>
    </svg>`
  },
  {
    id: 2,
    lessonId: 'lesson-two-design-elements',
    lessonNumber: 2,
    lessonTitle: 'الدرس الثاني: عناصر التصميم',
    question: 'أنشئ تكوينًا متوازنًا داخل مساحة المعمل الافتراضي باستخدام ثلاثة أشكال هندسية مختلفة (مثلث، مربع، دائرة) دون تداخل بينها',
    skills: [
      'توظيف الأشكال الهندسية الأساسية (مثلث، مربع، دائرة) في الفراغ الرقمي.',
      'تحقيق الاتزان البصري المتناغم دون تداخل أو تقاطع بين الأشكال.',
      'التحكم في المسافات البينية والفراغات الإيجابية والسلبية.'
    ],
    exampleTitle: 'مثال توضيحي: تكوين متوازن بثلاثة أشكال هندسية دون تداخل',
    exampleDescription: 'قم برسم مربع ومثلث ودائرة بأحجام متناسقة وألوان متباينة في مواقع متوازنة داخل اللوحة، مع الحفاظ على مسافة فاصلة واضحة بين كل شكل والآخر دون أي تقاطع.',
    recommendedTools: ['مربع', 'مثلث', 'دائرة', 'تعبئة (F)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#f8fafc" rx="10"/>
      <!-- Balanced Non-overlapping shapes -->
      <!-- 1. Square (Left) -->
      <rect x="25" y="45" width="50" height="50" rx="4" fill="#3b82f6" fill-opacity="0.25" stroke="#1d4ed8" stroke-width="2.5"/>
      <!-- 2. Triangle (Center-Top) -->
      <polygon points="105,25 78,85 132,85" fill="#f59e0b" fill-opacity="0.25" stroke="#d97706" stroke-width="2.5"/>
      <!-- 3. Circle (Right-Bottom) -->
      <circle cx="158" cy="80" r="28" fill="#10b981" fill-opacity="0.25" stroke="#059669" stroke-width="2.5"/>
      <!-- Balance lines / visual weights without touching -->
      <circle cx="105" cy="115" r="3" fill="#64748b"/>
      <line x1="40" y1="125" x2="170" y2="125" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3"/>
    </svg>`
  },
  {
    id: 3,
    lessonId: 'lesson-three-design-operations',
    lessonNumber: 3,
    lessonTitle: 'الدرس الثالث: عمليات التصميم',
    question: 'طبّق عملية التكرار المتناوب داخل المعمل الافتراضي لإنشاء خلفية زخرفية مبسطة بالتناوب بين عنصرين هندسيين مختلفين (مربع ثم دائرة) بالتوالي',
    skills: [
      'تطبيق مفهوم التكرار المتناوب (Alternating Repetition) في التصميم الرقمي.',
      'إنشاء إيقاع بصري منتظم بتوالي (مربع ثم دائرة بالتناوب).',
      'بناء خلفيات ووحدات زخرفية متسلسلة بدقة وانسيابية في المعمل الافتراضي.'
    ],
    exampleTitle: 'مثال توضيحي: التكرار المتناوب (مربع ثم دائرة بالتوالي)',
    exampleDescription: 'استخدم أداة المربع والدائرة لإنشاء سلسلة أفقية أو شبكة زخرفية متناوبة (مربع ← دائرة ← مربع ← دائرة...) بألوان متبادلة لإبراز الإيقاع والتكرار.',
    recommendedTools: ['مربع', 'دائرة', 'تعبئة (F)', 'خط'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fffbe6" rx="10"/>
      <!-- Repeating alternating pattern background: Square -> Circle -> Square -> Circle -->
      <g transform="translate(10, 20)">
        <rect x="10" y="8" width="24" height="24" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="58" cy="20" r="12" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
        <rect x="88" y="8" width="24" height="24" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="136" cy="20" r="12" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
        <rect x="164" y="8" width="16" height="24" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
      </g>
      <g transform="translate(10, 60)">
        <circle cx="22" cy="20" r="12" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
        <rect x="46" y="8" width="24" height="24" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="100" cy="20" r="12" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
        <rect x="124" y="8" width="24" height="24" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="172" cy="20" r="12" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
      </g>
      <!-- Repetition indicator arrow -->
      <path d="M30,128 L170,128" stroke="#78350f" stroke-width="2" stroke-dasharray="4 3"/>
      <polygon points="175,128 168,124 168,132" fill="#78350f"/>
    </svg>`
  },
  {
    id: 4,
    lessonId: 'lesson-four-design-principles',
    lessonNumber: 4,
    lessonTitle: 'الدرس الرابع: أسس التصميم',
    question: 'وظّف أداة المحاذاة (Align) في المعمل الافتراضي لترتيب أربعة نصوص إرشادية في خطوط أفقية متوازية تمامًا دون تداخل',
    skills: [
      'توظيف أداة المحاذاة (Align) لتحقيق الانضباط التكويني.',
      'ترتيب 4 نصوص إرشادية في خطوط أفقية متوازية تماماً.',
      'ضبط المسافات الرأسية والأفقية لمنع تداخل النصوص.'
    ],
    exampleTitle: 'مثال توضيحي: محاذاة أفقية متوازية لـ 4 نصوص إرشادية',
    exampleDescription: 'قم بتفعيل أداة المحاذاة (Align) واستخدام أداة النص (T) لكتابة 4 عبارات أو نصوص إرشادية وترتيبها على خطوط أفقية متوازية تماماً دون تداخل.',
    recommendedTools: ['نص (T)', 'أداة المحاذاة (Align)', 'شبكة الإرشاد (Grid)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#f1f5f9" rx="10"/>
      <!-- 4 Parallel horizontal alignment guide lines -->
      <line x1="20" y1="28" x2="180" y2="28" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3"/>
      <line x1="20" y1="58" x2="180" y2="58" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3"/>
      <line x1="20" y1="88" x2="180" y2="88" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3"/>
      <line x1="20" y1="118" x2="180" y2="118" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3"/>
      <!-- 4 Aligned Text Blocks -->
      <g fill="#1e293b">
        <rect x="30" y="20" width="8" height="8" rx="2" fill="#3b82f6"/>
        <rect x="44" y="22" width="90" height="6" rx="2" fill="#1e293b"/>
        <rect x="30" y="50" width="8" height="8" rx="2" fill="#3b82f6"/>
        <rect x="44" y="52" width="110" height="6" rx="2" fill="#1e293b"/>
        <rect x="30" y="80" width="8" height="8" rx="2" fill="#3b82f6"/>
        <rect x="44" y="82" width="75" height="6" rx="2" fill="#1e293b"/>
        <rect x="30" y="110" width="8" height="8" rx="2" fill="#3b82f6"/>
        <rect x="44" y="112" width="100" height="6" rx="2" fill="#1e293b"/>
      </g>
      <!-- Align icon indicator -->
      <rect x="162" y="60" width="16" height="24" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="166" y1="66" x2="174" y2="66" stroke="#1d4ed8" stroke-width="1.5"/>
      <line x1="166" y1="72" x2="174" y2="72" stroke="#1d4ed8" stroke-width="1.5"/>
      <line x1="166" y1="78" x2="174" y2="78" stroke="#1d4ed8" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 5,
    lessonId: 'lesson-five-structural-principles',
    lessonNumber: 5,
    lessonTitle: 'الدرس الخامس: الأسس الإنشائية للتصميم',
    question: 'عدّل تصميم الملصق الرقمي المعروض أمامك في المعمل الافتراضي بتغيير لون خلفيته (الأرضية) ليتباين بوضوح مع العنصر الرئيسي (الشكل) لزيادة وضوح الرسالة البصرية',
    skills: [
      'إدراك وتعديل العلاقة الإنشائية بين الشكل والأرضية (Figure & Ground).',
      'تحقيق التباين اللوني والضوئي لإبراز العنصر الرئيسي (القارب والنباتات).',
      'زيادة وضوح الرسالة البصرية من خلال المعالجة الرقمية للخلفية.'
    ],
    exampleTitle: 'مثال توضيحي: تعديل لون أرضية الملصق الرقمي لزيادة التباين',
    exampleDescription: 'تم إدراج ملصق القارب المائي على اللوحة. لاحظ أن لون الخلفية الحالي يتقارب مع ألوان القارب؛ استخدم أداة التعبئة (F) أو منتقي الألوان لتغيير لون الخلفية إلى لون متباين (كالأزرق السماوي أو لون مائي متباين) لزيادة وضوح الرسالة البصرية.',
    recommendedTools: ['تعبئة (F)', 'منتقي الألوان', 'قطارة (I)'],
    posterImage: 'assets/performance-tasks/lesson-5-poster.png',
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <!-- Left half: Original low-contrast yellow background -->
      <rect x="10" y="10" width="88" height="130" rx="6" fill="#b68d29"/>
      <!-- Right half: Modified high-contrast blue background -->
      <rect x="102" y="10" width="88" height="130" rx="6" fill="#38bdf8"/>
      <!-- Left Boat (Low Contrast) -->
      <g transform="translate(18, 55) scale(0.35)">
        <path d="M10,25 C40,40 160,40 190,15 L200,20 C170,55 30,55 0,28 Z" fill="#5c3818"/>
      </g>
      <!-- Right Boat (High Contrast) -->
      <g transform="translate(110, 55) scale(0.35)">
        <path d="M10,25 C40,40 160,40 190,15 L200,20 C170,55 30,55 0,28 Z" fill="#5c3818" stroke="#ffffff" stroke-width="2"/>
      </g>
      <!-- Reeds at bottom -->
      <g stroke="#1b4318" stroke-width="2">
        <line x1="25" y1="140" x2="25" y2="105"/>
        <line x1="45" y1="140" x2="50" y2="100"/>
        <line x1="75" y1="140" x2="70" y2="108"/>
        <line x1="120" y1="140" x2="120" y2="105"/>
        <line x1="140" y1="140" x2="145" y2="100"/>
        <line x1="170" y1="140" x2="165" y2="108"/>
      </g>
      <ellipse cx="25" cy="103" rx="2.5" ry="6" fill="#1b4318"/>
      <ellipse cx="50" cy="98" rx="2.5" ry="6" fill="#1b4318"/>
      <ellipse cx="120" cy="103" rx="2.5" ry="6" fill="#1b4318"/>
      <ellipse cx="145" cy="98" rx="2.5" ry="6" fill="#1b4318"/>
      <!-- Comparison arrow -->
      <circle cx="99" cy="75" r="10" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="95" y="79" font-size="12" font-weight="bold" fill="#0f172a">→</text>
    </svg>`
  },
  {
    id: 6,
    lessonId: 'lesson-six-digital-design',
    lessonNumber: 6,
    lessonTitle: 'الدرس السادس: التصميم الرقمي',
    question: 'وظّف أداة الرسم بالنقاط الرقمية داخل المعمل الافتراضي لبناء الحدود الخارجية لشكل زخرفي مبسط، مع المحافظة على وضوح الشكل ودقة تكوينه.',
    skills: [
      'توظيف أداة الرسم بالنقاط الرقمية (Stippling / Dots).',
      'بناء الحدود والخطوط الخارجية للأشكال الزخرفية بواسطة النقاط المتتابعة.',
      'المحافظة على التناسب والدقة التكوينية للشكل الزخرفي.'
    ],
    exampleTitle: 'مثال توضيحي: بناء الحدود الزخرفية باستخدام النقاط الرقمية',
    exampleDescription: 'استخدم أداة التنقيط الرقمي أو البخاخ بنقرات متتابعة لرسم وتحديد المعالم والحدود الخارجية لشكل زخرفي مبسط (مثل ورقة نباتية أو شكل زخرفي إسلامي) مع الحفاظ على وضوحه ودقة تكوينه.',
    recommendedTools: ['أداة النقاط الرقمية (Dots)', 'بخاخ (S)', 'قلم (P)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fafaf9" rx="10"/>
      <!-- Digital Dot Drawing forming clear decorative flower / leaf outline -->
      <g fill="#047857">
        <circle cx="100" cy="75" r="4"/>
        <circle cx="100" cy="63" r="2.5"/><circle cx="112" cy="75" r="2.5"/><circle cx="100" cy="87" r="2.5"/><circle cx="88" cy="75" r="2.5"/>
        <!-- Petal boundaries formed by dots -->
        <circle cx="100" cy="45" r="3"/><circle cx="107" cy="48" r="2.5"/><circle cx="93" cy="48" r="2.5"/>
        <circle cx="112" cy="55" r="2.5"/><circle cx="88" cy="55" r="2.5"/>
        <circle cx="100" cy="105" r="3"/><circle cx="107" cy="102" r="2.5"/><circle cx="93" cy="102" r="2.5"/>
        <circle cx="112" cy="95" r="2.5"/><circle cx="88" cy="95" r="2.5"/>
        <circle cx="130" cy="75" r="3"/><circle cx="127" cy="68" r="2.5"/><circle cx="127" cy="82" r="2.5"/>
        <circle cx="120" cy="63" r="2.5"/><circle cx="120" cy="87" r="2.5"/>
        <circle cx="70" cy="75" r="3"/><circle cx="73" cy="68" r="2.5"/><circle cx="73" cy="82" r="2.5"/>
        <circle cx="80" cy="63" r="2.5"/><circle cx="80" cy="87" r="2.5"/>
      </g>
      <!-- Stipple indicator -->
      <circle cx="160" cy="35" r="9" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/>
      <circle cx="160" cy="35" r="2.5" fill="#047857"/>
      <text x="135" y="55" font-size="8" font-family="sans-serif" font-weight="bold" fill="#047857">رسم بالنقاط</text>
    </svg>`
  }
];

@Injectable({
  providedIn: 'root'
})
export class LessonPracticalService {
  private readonly STORAGE_KEY = 'virtual_art_lab_lesson_practical_v1';

  readonly tasks = signal<LessonPracticalTask[]>(this.getInitialTasks());
  readonly activeTaskId = signal<number | null>(null);

  readonly activeTask = computed(() => {
    const id = this.activeTaskId();
    if (!id) return null;
    return this.tasks().find((t) => t.id === id) ?? null;
  });

  readonly completedCount = computed(() => {
    return this.tasks().filter((t) => t.completed).length;
  });

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const stateToSave: LessonPracticalStorageState = {
        tasks: this.tasks().map((t) => ({
          id: t.id,
          completed: t.completed,
          completedAt: t.completedAt,
          remainingSeconds: t.remainingSeconds,
          timeSpentSeconds: t.timeSpentSeconds
        })),
        activeTaskId: this.activeTaskId()
      };
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save lesson practical tasks state:', e);
      }
    });
  }

  private getInitialTasks(): LessonPracticalTask[] {
    return DEFAULT_LESSON_PRACTICAL_TASKS.map((t) => ({
      ...t,
      completed: false,
      remainingSeconds: LESSON_PRACTICAL_DEFAULT_DURATION,
      timeSpentSeconds: 0
    }));
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed: LessonPracticalStorageState = JSON.parse(saved);
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          const merged = DEFAULT_LESSON_PRACTICAL_TASKS.map((def) => {
            const savedTask = parsed.tasks.find((st) => st.id === def.id);
            return {
              ...def,
              completed: savedTask ? savedTask.completed : false,
              remainingSeconds: savedTask?.remainingSeconds ?? LESSON_PRACTICAL_DEFAULT_DURATION,
              timeSpentSeconds: savedTask?.timeSpentSeconds ?? 0,
              completedAt: savedTask?.completedAt
            };
          });
          this.tasks.set(merged);
        }
        if (parsed.activeTaskId !== undefined) {
          this.activeTaskId.set(parsed.activeTaskId);
        }
      }
    } catch (e) {
      console.error('Failed to load lesson practical tasks state:', e);
    }
  }

  getTaskByLessonId(lessonId: string): LessonPracticalTask | undefined {
    return this.tasks().find((t) => t.lessonId === lessonId);
  }

  setActiveTask(id: number | null): void {
    this.activeTaskId.set(id);
  }

  setActiveTaskByLessonId(lessonId: string): LessonPracticalTask | undefined {
    const task = this.getTaskByLessonId(lessonId);
    if (task) {
      this.activeTaskId.set(task.id);
    }
    return task;
  }

  setTaskCompleted(id: number, completed: boolean = true): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );
  }

  updateTaskTime(id: number, remainingSeconds: number): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          const spent = Math.max(0, LESSON_PRACTICAL_DEFAULT_DURATION - remainingSeconds);
          return {
            ...task,
            remainingSeconds,
            timeSpentSeconds: spent
          };
        }
        return task;
      })
    );
  }

  resetAllTasks(): void {
    this.tasks.set(this.getInitialTasks());
    this.activeTaskId.set(null);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mStr = m < 10 ? `0${m}` : `${m}`;
    const sStr = s < 10 ? `0${s}` : `${s}`;
    return `${mStr}:${sStr}`;
  }
}
