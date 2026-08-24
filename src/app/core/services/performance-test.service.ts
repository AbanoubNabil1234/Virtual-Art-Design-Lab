import { Injectable, computed, effect, signal } from '@angular/core';

export interface PerformanceTask {
  id: number;
  text: string;
  skills: string[];
  exampleTitle: string;
  exampleDescription: string;
  recommendedTools: string[];
  exampleSvg: string;
  completed: boolean;
  remainingSeconds: number; // 10 minutes = 600 seconds
  timeSpentSeconds: number;
  completedAt?: string;
}

export interface PerformanceTestStorageState {
  tasks: PerformanceTask[];
  activeTaskId: number | null;
  step: 'intro' | 'exam' | 'result';
}

export const TASK_DEFAULT_DURATION = 10 * 60; // 10 minutes = 600 seconds

export const DEFAULT_PERFORMANCE_TASKS: Omit<PerformanceTask, 'completed' | 'remainingSeconds' | 'timeSpentSeconds'>[] = [
  {
    id: 1,
    text: 'في مساحة الورقة/المعمل الافتراضي، نفذ تصميمًا ابتكاريًا باستخدام النقطة، مع توظيف الألوان والفراغ لتحقيق التوازن والإيقاع.',
    skills: [
      'استخدام النقطة في التصميم رقميًا.',
      'استخدام اللون في النقطة باستخدام أدوات رقمية.',
      'توظيف النقطة في بناء الشكل الخارجي للتصميم الافتراضي.',
      'التنظيم بين النقط داخل مساحة تصميم افتراضية.'
    ],
    exampleTitle: 'مثال توضيحي: التشكيل بالنقط والتجمع البصري',
    exampleDescription: 'استخدم أداة البخاخ (S) والقلم (P) بأحجام متنوعة لإنشاء تجمعات نقطية دائرية متدرجة الكثافة من المركز نحو الخرج لتحقيق الاتزان والتناغم اللوني.',
    recommendedTools: ['بخاخ (S)', 'قلم (P)', 'قطارة (I)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fdfbf7" rx="10"/>
      <circle cx="100" cy="75" r="50" fill="none" stroke="#6b4226" stroke-dasharray="2 4" stroke-opacity="0.3"/>
      <!-- Stippling dots around center -->
      <g fill="#6b4226">
        <circle cx="100" cy="75" r="6"/><circle cx="108" cy="70" r="4"/><circle cx="92" cy="80" r="5"/>
        <circle cx="115" cy="82" r="3"/><circle cx="85" cy="68" r="4"/><circle cx="100" cy="55" r="3.5"/>
        <circle cx="100" cy="95" r="4"/><circle cx="120" cy="65" r="2.5"/><circle cx="80" cy="85" r="3"/>
      </g>
      <g fill="#d97706">
        <circle cx="125" cy="75" r="4"/><circle cx="75" cy="75" r="3.5"/><circle cx="100" cy="40" r="3"/>
        <circle cx="100" cy="110" r="3.5"/><circle cx="135" cy="90" r="2.5"/><circle cx="65" cy="60" r="3"/>
      </g>
      <g fill="#059669">
        <circle cx="140" cy="60" r="2"/><circle cx="60" cy="90" r="2.5"/><circle cx="110" cy="120" r="2"/>
        <circle cx="90" cy="30" r="2.5"/><circle cx="150" cy="80" r="1.5"/><circle cx="50" cy="70" r="2"/>
      </g>
    </svg>`
  },
  {
    id: 2,
    text: 'قم بتنفيذ تصميم تكاملي يوضح العلاقة بين ثلاثة أشكال هندسية (مثلث–مربع–دائرة)، مع التأكيد على القيم الخطية وتحقيق أسس التصميم (الاتزان والإيقاع).',
    skills: [
      'استخدام الأشكال الهندسية رقميًا.',
      'استخدام الخطوط البسيطة رقميًا في تصميم العمل الفني.',
      'استخدام الأسس الاتجاهية في التصميم الرقمي.',
      'استخدام الأسس التركيزية داخل العمل الفني الافتراضي.'
    ],
    exampleTitle: 'مثال توضيحي: التداخل والتكامل بين الأشكال 3 (مربع–مثلث–دائرة)',
    exampleDescription: 'استخدم أدوات الأشكال (المربع، الدائرة، المثلث) لعمل تداخل بين الأشكال مع التلوين المتباين واستخدام الخطوط الأفقية والرأسية لتأكيد الاتزان.',
    recommendedTools: ['مربع', 'دائرة', 'مثلث', 'تعبئة (F)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#f8fafc" rx="10"/>
      <!-- Square -->
      <rect x="45" y="45" width="65" height="65" fill="#3b82f6" fill-opacity="0.3" stroke="#1d4ed8" stroke-width="2"/>
      <!-- Circle -->
      <circle cx="120" cy="75" r="38" fill="#ef4444" fill-opacity="0.3" stroke="#b91c1c" stroke-width="2"/>
      <!-- Triangle -->
      <polygon points="100,30 60,110 140,110" fill="#f59e0b" fill-opacity="0.3" stroke="#d97706" stroke-width="2"/>
      <!-- Linear accent -->
      <line x1="20" y1="75" x2="180" y2="75" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
    </svg>`
  },
  {
    id: 3,
    text: 'في مساحة العمل، أنشئ تصميمًا ابتكاريًا باستخدام الأشكال العضوية مستعينًا بالنقطة والخط والمساحة، مع مراعاة أسس التصميم المتنوعة.',
    skills: [
      'استخدام الأشكال العضوية في التصميم الافتراضي.',
      'استخدام الأشكال الطبيعية من خلال النماذج الرقمية.',
      'استخدام الأسس المركبة باستخدام المحاكاة الرقمية.',
      'إيجاد العلاقة بين الشكل والأرضية في التصميم الرقمي.'
    ],
    exampleTitle: 'مثال توضيحي: الأشكال العضوية والانسيابية',
    exampleDescription: 'قم برسم منحنيات وأشكال ناعمة يشبه أوراق الشجر أو البتلات الحرّة باستخدام أداة القلم الحر ثم ملئها بألوان متناسقة وخلفية تبرز الشكل.',
    recommendedTools: ['قلم (P)', 'تعبئة (F)', 'بخاخ (S)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#f0fdf4" rx="10"/>
      <!-- Organic Blob 1 -->
      <path d="M50,40 C80,20 130,40 120,80 C110,120 60,130 40,90 C30,60 30,50 50,40 Z" fill="#10b981" fill-opacity="0.3" stroke="#047857" stroke-width="2"/>
      <!-- Organic Blob 2 -->
      <path d="M110,60 C140,40 170,70 160,100 C150,130 110,120 100,90 Z" fill="#06b6d4" fill-opacity="0.3" stroke="#0e7490" stroke-width="2"/>
      <!-- Decorative lines and dots -->
      <path d="M40,110 Q100,50 160,110" fill="none" stroke="#047857" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="80" cy="70" r="4" fill="#047857"/>
      <circle cx="130" cy="80" r="3" fill="#0e7490"/>
    </svg>`
  },
  {
    id: 4,
    text: 'قم بتنفيذ تصميم طبق نجمي هندسي مستوحى من الفن الإسلامي، يحقق عمليات التكرار والحركة الرقمية داخل المعمل الافتراضي.',
    skills: [
      'استخدام التكرار المتناوب رقميًا.',
      'استخدام التكرار المتغير باستخدام أدوات النسخ والتكرار الافتراضي.',
      'استخدام الأشكال الهندسية رقميًا.'
    ],
    exampleTitle: 'مثال توضيحي: الزخرفة الهندسية والطبق النجمي الإسلامي',
    exampleDescription: 'استخدم أدوات الخط والمربع أو النجمة لإنشاء وحدة زخرفية نجمية ثمانية وتكرارها بشكل متماثل ودائري للحصول على طبق نجمي هندسي.',
    recommendedTools: ['نجمة', 'خط', 'مربع', 'تعبئة (F)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fffbe6" rx="10"/>
      <!-- Central Star Motif -->
      <g transform="translate(100,75)">
        <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#d97706" stroke-width="2"/>
        <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#d97706" stroke-width="2" transform="rotate(45)"/>
        <circle r="15" fill="#b45309" fill-opacity="0.3" stroke="#92400e" stroke-width="1.5"/>
        <polygon points="0,-38 10,-10 38,0 10,10 0,38 -10,10 -38,0 -10,-10" fill="#f59e0b" fill-opacity="0.4" stroke="#b45309" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 5,
    text: 'نفذ تصميمًا ابتكاريًا باستخدام عنصري النقطة والخط، مع التركيز على القيم الملمسية في البناء الفني.',
    skills: [
      'استخدام الخطوط المركبة في تصميم العمل الفني الافتراضي.',
      'إيجاد الملمس في التصميم باستخدام المؤثرات الرقمية.'
    ],
    exampleTitle: 'مثال توضيحي: الإيهام بالملمس الخشن والناعم عبر الخطوط والنقط',
    exampleDescription: 'دمج الخطوط المتقاطعة (Hatching) والخطوط المنكسرة مع تجمعات نقطية متقاربة لإعطاء إحساس بالملمس السطحي والتأثير الجمالي.',
    recommendedTools: ['خط', 'قلم (P)', 'بخاخ (S)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fafaf9" rx="10"/>
      <!-- Hatching lines block -->
      <g stroke="#44403c" stroke-width="1.5">
        <line x1="30" y1="30" x2="80" y2="80"/><line x1="40" y1="30" x2="90" y2="80"/>
        <line x1="50" y1="30" x2="100" y2="80"/><line x1="60" y1="30" x2="110" y2="80"/>
        <line x1="30" y1="80" x2="80" y2="30"/><line x1="40" y1="80" x2="90" y2="30"/>
        <line x1="50" y1="80" x2="100" y2="30"/><line x1="60" y1="80" x2="110" y2="30"/>
      </g>
      <!-- Stipple texture side -->
      <g fill="#78716c">
        <circle cx="140" cy="40" r="2"/><circle cx="150" cy="45" r="1.5"/><circle cx="135" cy="55" r="2"/>
        <circle cx="160" cy="60" r="1.5"/><circle cx="145" cy="70" r="2"/><circle cx="130" cy="75" r="1.5"/>
        <circle cx="155" cy="85" r="2"/><circle cx="140" cy="95" r="1.5"/><circle cx="165" cy="100" r="2"/>
      </g>
    </svg>`
  },
  {
    id: 6,
    text: 'صمّم عملًا فنيًا رقميًا يوضح التدرج واللون المتناغم لتحقيق الانسجام البصري.',
    skills: [
      'استخدام الألوان الأساسية رقميًا.',
      'استخدام الألوان الساخنة والباردة رقميًا.',
      'تحقيق الانسجام اللوني باستخدام أدوات المعمل الافتراضي.'
    ],
    exampleTitle: 'مثال توضيحي: التدرج اللوني والانسجام البصري',
    exampleDescription: 'استخدام أشرطة أو مساحات لونية متدرجة من الألوان الساخنة (الأحمر والبرتقالي والأصفر) إلى الألوان الباردة (الأزرق والأخضر) لتحقيق الانسجام.',
    recommendedTools: ['تعبئة (F)', 'مربع', 'قطارة (I)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <defs>
        <linearGradient id="warmCoolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="35%" stop-color="#f59e0b"/>
          <stop offset="70%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#warmCoolGrad)" rx="10"/>
      <!-- Concentric translucent rings -->
      <circle cx="100" cy="75" r="45" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.6"/>
      <circle cx="100" cy="75" r="30" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
      <circle cx="100" cy="75" r="15" fill="#ffffff" opacity="0.9"/>
    </svg>`
  },
  {
    id: 7,
    text: 'قم بتنفيذ تصميم رقمي بسيط يدمج بين الخطوط البسيطة والمنحنية لإظهار الإيقاع والتكرار.',
    skills: [
      'استخدام الخطوط البسيطة رقميًا.',
      'استخدام الخطوط غير المستقيمة.',
      'استخدام التكرار المتناوب رقميًا.'
    ],
    exampleTitle: 'مثال توضيحي: إيقاع الخطوط المستقيمة والمنحنية',
    exampleDescription: 'ارسم خطوطاً مستقيمة أفقية ورأسية متوازية تتداخل مع موجات منحنية متكررة لخلق حركة إيقاعية ديناميكية في اللوحة.',
    recommendedTools: ['خط', 'قلم (P)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#f3f4f6" rx="10"/>
      <!-- Parallel straight vertical lines -->
      <g stroke="#64748b" stroke-width="2">
        <line x1="30" y1="20" x2="30" y2="130"/>
        <line x1="70" y1="20" x2="70" y2="130"/>
        <line x1="110" y1="20" x2="110" y2="130"/>
        <line x1="150" y1="20" x2="150" y2="130"/>
      </g>
      <!-- Repeating sine wave curves -->
      <g fill="none" stroke="#0284c7" stroke-width="3">
        <path d="M20,40 Q60,10 100,40 T180,40"/>
        <path d="M20,75 Q60,45 100,75 T180,75"/>
        <path d="M20,110 Q60,80 100,110 T180,110"/>
      </g>
    </svg>`
  },
  {
    id: 8,
    text: 'صمّم تكوينًا ثلاثي الأبعاد رقميًا يظهر استخدام الضوء والظل لتحقيق الملمس والعمق.',
    skills: [
      'استخدام حجم هندسي منتظم داخل التصميم الافتراضي.',
      'استخدام حجم شبه منتظم باستخدام المحاكاة الرقمية.',
      'استخدام الإضاءة المركزة رقميًا.',
      'استخدام الإضاءة المباشرة في التصميم الافتراضي.',
      'استخدام الإضاءة الموزعة داخل بيئة المحاكاة.',
      'التمييز بين أنواع الملامس داخل العمل الافتراضي.'
    ],
    exampleTitle: 'مثال توضيحي: المجسمات ثلاثية الأبعاد والتظليل (الضوء والظل)',
    exampleDescription: 'قم برسم مكعب أو كرة مجسمة باستخدام درجات التظليل الفاتح في اتجاه مصدر الضوء، والظل الغامق في الاتجاه المعاكس مع رسم ظل المجسم على الأرضية.',
    recommendedTools: ['مربع', 'دائرة', 'قلم (P)', 'تعبئة (F)'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#1e293b" rx="10"/>
      <!-- Light source rays -->
      <path d="M20,20 L50,50" stroke="#fde047" stroke-width="2" stroke-dasharray="3 3"/>
      <circle cx="15" cy="15" r="8" fill="#facc15"/>
      
      <!-- Cast shadow ground -->
      <ellipse cx="115" cy="120" rx="45" ry="12" fill="#0f172a" opacity="0.8"/>
      
      <!-- 3D Sphere with radial gradient shadow -->
      <defs>
        <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#38bdf8"/>
          <stop offset="85%" stop-color="#0369a1"/>
          <stop offset="100%" stop-color="#0c4a6e"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="80" r="40" fill="url(#sphereGrad)"/>
    </svg>`
  },
  {
    id: 9,
    text: 'أنشئ تصميمًا رقميًا يعتمد على مزج الألوان الثانوية بطريقة تحقق الانسجام اللوني والتباين البصري.',
    skills: [
      'استخدام الألوان الثانوية في التصميم الافتراضي.',
      'استخدام الألوان الرقمية الجاهزة.',
      'تحقيق التباين اللوني في التصميم الرقمي.'
    ],
    exampleTitle: 'مثال توضيحي: الألوان الثانوية (الأخضر–البرتقالي–البنفسجي)',
    exampleDescription: 'استخدم الألوان الثانوية الثلاثة في تكوين فني متوازن يعتمد على التضاد والانسجام لإظهار قوة وقيمة الألوان المشتقة.',
    recommendedTools: ['تعبئة (F)', 'قطارة (I)', 'مربع'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#fafafa" rx="10"/>
      <!-- Green Block -->
      <rect x="25" y="25" width="70" height="100" fill="#10b981" rx="8"/>
      <!-- Orange Block -->
      <rect x="105" y="25" width="70" height="45" fill="#f97316" rx="8"/>
      <!-- Purple Block -->
      <rect x="105" y="80" width="70" height="45" fill="#8b5cf6" rx="8"/>
      <!-- Overlap accents -->
      <circle cx="100" cy="75" r="20" fill="#ffffff" opacity="0.9"/>
      <path d="M90,75 L110,75" stroke="#1e293b" stroke-width="3"/>
    </svg>`
  },
  {
    id: 10,
    text: 'قم بتطوير تصميم حر يدمج جميع العناصر التصميمية الأساسية ويحقق أكبر قدر من الإبداع والتنوع والتوازن الرقمي.',
    skills: [
      'استخدام الأشكال الرقمية الجاهزة داخل بيئة العمل الافتراضي.',
      'توظيف عنصري الزمان والمكان داخل التصميم الافتراضي.',
      'دمج عناصر وأسس التصميم في عمل فني متكامل.'
    ],
    exampleTitle: 'مثال توضيحي: التكوين الشامل والابتكار الحر',
    exampleDescription: 'دمج شامل وعالي الإبداع بين النقاط، والخطوط، والأشكال الهندسية والعضوية، مع التدرج اللوني والظل لإخراج لوحة فنية رقمية متكاملة.',
    recommendedTools: ['جميع أدوات المعمل المتاحة 🎨'],
    exampleSvg: `<svg viewBox="0 0 200 150" class="w-full h-full">
      <rect width="200" height="150" fill="#111827" rx="10"/>
      <!-- Abstract creative combination -->
      <circle cx="60" cy="60" r="35" fill="#ec4899" opacity="0.6"/>
      <rect x="80" y="40" width="70" height="70" fill="#6366f1" opacity="0.5" transform="rotate(15 115 75)"/>
      <polygon points="150,20 180,80 120,80" fill="#10b981" opacity="0.6"/>
      <path d="M20,130 Q100,60 180,130" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <g fill="#ffffff">
        <circle cx="60" cy="60" r="4"/><circle cx="140" cy="110" r="3"/><circle cx="160" cy="40" r="2.5"/>
      </g>
    </svg>`
  }
];

@Injectable({
  providedIn: 'root'
})
export class PerformanceTestService {
  private readonly STORAGE_KEY = 'virtual_art_lab_performance_test_v1';

  readonly tasks = signal<PerformanceTask[]>(this.getInitialTasks());
  readonly activeTaskId = signal<number | null>(null);
  readonly step = signal<'intro' | 'exam' | 'result'>('intro');

  readonly activeTask = computed(() => {
    const id = this.activeTaskId();
    if (!id) return null;
    return this.tasks().find((t) => t.id === id) ?? null;
  });

  readonly completedCount = computed(() => {
    return this.tasks().filter((t) => t.completed).length;
  });

  readonly isAllCompleted = computed(() => {
    return this.completedCount() === this.tasks().length;
  });

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const stateToSave: PerformanceTestStorageState = {
        tasks: this.tasks(),
        activeTaskId: this.activeTaskId(),
        step: this.step()
      };
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save performance test state:', e);
      }
    });
  }

  private getInitialTasks(): PerformanceTask[] {
    return DEFAULT_PERFORMANCE_TASKS.map((t) => ({
      ...t,
      completed: false,
      remainingSeconds: TASK_DEFAULT_DURATION,
      timeSpentSeconds: 0
    }));
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed: PerformanceTestStorageState = JSON.parse(saved);
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          // Merge saved completion with default SVG & descriptions
          const merged = DEFAULT_PERFORMANCE_TASKS.map((def) => {
            const savedTask = parsed.tasks.find((st) => st.id === def.id);
            return {
              ...def,
              completed: savedTask ? savedTask.completed : false,
              remainingSeconds: savedTask ? savedTask.remainingSeconds : TASK_DEFAULT_DURATION,
              timeSpentSeconds: savedTask ? savedTask.timeSpentSeconds : 0,
              completedAt: savedTask ? savedTask.completedAt : undefined
            };
          });
          this.tasks.set(merged);
        }
        if (parsed.activeTaskId !== undefined) {
          this.activeTaskId.set(parsed.activeTaskId);
        }
        if (parsed.step) {
          this.step.set(parsed.step);
        }
      }
    } catch (e) {
      console.error('Failed to load performance test state:', e);
    }
  }

  /**
   * Check if a task is unlocked.
   * Task 1 is unlocked by default.
   * Task N (N > 1) requires Task N-1 to be completed.
   */
  isTaskUnlocked(taskId: number): boolean {
    if (taskId <= 1) return true;
    const previousTask = this.tasks().find((t) => t.id === taskId - 1);
    return !!previousTask && previousTask.completed;
  }

  getTaskLockReason(taskId: number): string {
    if (this.isTaskUnlocked(taskId)) return '';
    return `يلزم إنجاز المهمة رقم ${taskId - 1} أولاً لفتح هذه المهمة.`;
  }

  setActiveTask(id: number | null): boolean {
    if (id !== null && !this.isTaskUnlocked(id)) {
      alert(`🔒 المهمة ${id} مغلقة حالياً!\n\nيلزم إنجاز المهمة ${id - 1} أولاً حتى تفتح هذه المهمة.`);
      return false;
    }
    this.activeTaskId.set(id);
    return true;
  }

  toggleTaskCompleted(id: number): { unlockedNext: boolean; nextTaskId: number | null } {
    let unlockedNext = false;
    let nextTaskId: number | null = null;

    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted && id < tasks.length) {
            unlockedNext = true;
            nextTaskId = id + 1;
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );

    return { unlockedNext, nextTaskId };
  }

  setTaskCompleted(id: number, completed: boolean = true): { unlockedNext: boolean; nextTaskId: number | null } {
    let unlockedNext = false;
    let nextTaskId: number | null = null;

    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          if (completed && !task.completed && id < tasks.length) {
            unlockedNext = true;
            nextTaskId = id + 1;
          }
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );

    return { unlockedNext, nextTaskId };
  }

  updateTaskTime(id: number, remainingSeconds: number): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          const spent = Math.max(0, TASK_DEFAULT_DURATION - remainingSeconds);
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
    this.step.set('intro');
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mStr = m < 10 ? `0${m}` : `${m}`;
    const sStr = s < 10 ? `0${s}` : `${s}`;
    return `${mStr}:${sStr}`;
  }
}
