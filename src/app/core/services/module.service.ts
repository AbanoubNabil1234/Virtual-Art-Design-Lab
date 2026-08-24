import { Injectable, computed, effect, signal } from '@angular/core';
import { DesignModule } from '../models/module.model';

export interface ModuleProgress {
  completed: boolean;
  score: number;
  totalQuestions: number;
  completedAt?: string;
}

export type ModuleProgressState = Record<string, ModuleProgress>;

export const MODULE_CATEGORY_MAP: Record<string, string> = {
  'blueprint-to-canvas': 'الدرس الأول: التصميم الفني ومفاهيمه الأساسية',
  'lesson-two-design-elements': 'الدرس الثاني: عناصر التصميم',
  'lesson-three-design-operations': 'الدرس الثالث: عمليات التصميم',
  'lesson-four-design-principles': 'الدرس الرابع: أسس التصميم',
  'lesson-five-structural-principles': 'الدرس الخامس: الأسس الإنشائية للتصميم',
  'lesson-six-digital-design': 'الدرس السادس: التصميم الرقمي'
};

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    private readonly STORAGE_KEY = 'virtual_art_lab_modules_progress_v1';

    readonly progressState = signal<ModuleProgressState>(this.loadProgressFromStorage());

    private readonly modules: DesignModule[] = [
        {
            id: 'blueprint-to-canvas',
            titleAr: '1. الدرس الأول: التصميم الفني',
            titleEn: 'Blueprint to Canvas',
            descriptionAr: 'مفاهيم التصميم الفني الأساسية، وأدواته، ووظائفه من خلال عرض تفاعلي مصور.',
            topics: [
                'مفهوم التصميم الفني.',
                'أدوات وعناصر بناء التصميم.',
                'وظائف التصميم وتطبيقاته داخل المعمل الافتراضي.'
            ],
            iconName: 'architecture',
            slides: Array.from(
                { length: 11 },
                (_, index) => `assets/lesson-blueprint-slides/image${index + 1}.png`
            ),
            videoUrl: 'assets/lesson-blueprint-video/lesson-one-demo.mp4',
            videoName: 'فيديو الدرس الأول: التصميم الفني',
            posterUrl: 'assets/lesson-blueprint-slides/image1.png'
        },
        {
            id: 'lesson-two-design-elements',
            titleAr: '2. الدرس الثاني: عناصر التصميم',
            titleEn: 'Design Elements',
            descriptionAr: 'استكشاف عناصر التصميم الفني وبنائها داخل العمل الرقمي من خلال عروض تفاعلية وملخص مصور وفيديو تطبيقي.',
            topics: [
                'النقطة والخط كلبنات أولية في بناء التصميم.',
                'الشكل والملمس واللون داخل التكوين الفني.',
                'ملخص تطبيقي يربط عناصر التصميم بإنتاج العمل الفني.'
            ],
            iconName: 'category',
            slideDecks: [
                {
                    id: 'part-1',
                    titleAr: 'الدرس الثاني 1',
                    subtitleAr: 'عناصر التصميم - الجزء الأول',
                    fileName: 'الدرس الثاني 1.pptx',
                    slides: this.numberedSlides('assets/lesson-two/part-1', 10)
                },
                {
                    id: 'part-2',
                    titleAr: 'الدرس الثاني 2',
                    subtitleAr: 'عناصر التصميم - الجزء الثاني',
                    fileName: 'الدرس الثاني 2.pptx',
                    slides: this.numberedSlides('assets/lesson-two/part-2', 10)
                },
                {
                    id: 'part-3',
                    titleAr: 'الدرس الثاني 3',
                    subtitleAr: 'عناصر التصميم - اللون',
                    fileName: 'الدرس الثاني 3.pptx',
                    slides: this.numberedSlides('assets/lesson-two/part-3', 8)
                },
                {
                    id: 'summary',
                    titleAr: 'ملخص الدرس الثاني',
                    subtitleAr: 'تلخيص بصري سريع لعناصر التصميم',
                    fileName: 'ملخص الدرس الثاني.pptx',
                    slides: this.numberedSlides('assets/lesson-two/summary', 12)
                }
            ],
            videoUrl: 'assets/lesson-two/video/lesson-two-demo.mp4',
            videoName: 'فيديو الدرس الثاني: عناصر التصميم',
            posterUrl: 'assets/lesson-two/part-1/slide-01.png'
        },
        {
            id: 'lesson-three-design-operations',
            titleAr: '3. الدرس الثالث: عمليات التصميم',
            titleEn: 'Design Operations',
            descriptionAr: 'التعرف على عمليات التصميم الفني وتطبيقاتها الرقمية من خلال عروض تفاعلية وملخص بصري وفيديو تطبيقي.',
            topics: [
                'مفهوم عمليات التصميم ودورها في بناء العمل الفني.',
                'توظيف التكرار والتنوع والتدرج داخل التصميم الرقمي.',
                'تحليل العلاقات البصرية التي تمنح التصميم إيقاعًا واتزانًا ووضوحًا.'
            ],
            iconName: 'schema',
            slideDecks: [
                {
                    id: 'part-1',
                    titleAr: 'الدرس الثالث 1',
                    subtitleAr: 'عمليات التصميم - الجزء الأول',
                    fileName: 'الدرس الثالث 1.pptx',
                    slides: this.numberedSlides('assets/lesson-three/part-1', 10)
                },
                {
                    id: 'part-2',
                    titleAr: 'الدرس الثالث 2',
                    subtitleAr: 'عمليات التصميم - الجزء الثاني',
                    fileName: 'الدرس الثالث 2.pptx',
                    slides: this.numberedSlides('assets/lesson-three/part-2', 6)
                },
                {
                    id: 'summary',
                    titleAr: 'ملخص الدرس الثالث',
                    subtitleAr: 'التكرار والتنوع والتدرج في التصميم الرقمي',
                    fileName: 'ملخص الدرس الثالث.pptx',
                    slides: this.numberedSlides('assets/lesson-three/summary', 15)
                }
            ],
            videoUrl: 'assets/lesson-three/video/lesson-three-demo.mp4',
            videoName: 'فيديو الدرس الثالث: عمليات التصميم',
            posterUrl: 'assets/lesson-three/part-1/slide-01.png'
        },
        {
            id: 'lesson-four-design-principles',
            titleAr: '4. الدرس الرابع: أسس التصميم',
            titleEn: 'Design Principles',
            descriptionAr: 'دراسة أسس التصميم وعلاقاتها البصرية التي تساعد على تنظيم العمل الفني وتحقيق الاتزان والوضوح.',
            topics: [
                'مفهوم أسس التصميم ودورها في بناء التكوين.',
                'تطبيق العلاقات البصرية داخل العمل الرقمي.',
                'تلخيص الأسس وربطها بتحليل التصميم الفني.'
            ],
            iconName: 'architecture',
            slideDecks: [
                {
                    id: 'part-1',
                    titleAr: 'الدرس الرابع 1',
                    subtitleAr: 'أسس التصميم - الجزء الأول',
                    fileName: 'الدرس الرابع 1.pptx',
                    slides: this.numberedSlides('assets/lesson-four/part-1', 10)
                },
                {
                    id: 'part-2',
                    titleAr: 'الدرس الرابع 2',
                    subtitleAr: 'أسس التصميم - الجزء الثاني',
                    fileName: 'الدرس الرابع 2.pptx',
                    slides: this.numberedSlides('assets/lesson-four/part-2', 10)
                },
                {
                    id: 'summary',
                    titleAr: 'ملخص الدرس الرابع',
                    subtitleAr: 'مراجعة مركزة لأسس التصميم',
                    fileName: 'ملخص الدرس الرابع.pptx',
                    slides: this.numberedSlides('assets/lesson-four/summary', 14)
                }
            ],
            videoUrl: 'assets/lesson-four/video/lesson-four-demo.mp4',
            videoName: 'فيديو الدرس الرابع: أسس التصميم',
            posterUrl: 'assets/lesson-four/part-1/slide-01.png'
        },
        {
            id: 'lesson-five-structural-principles',
            titleAr: '5. الدرس الخامس: الأسس الإنشائية للتصميم',
            titleEn: 'Structural Principles',
            descriptionAr: 'التعرف على الأسس الإنشائية للتصميم وكيفية استخدامها لبناء تكوين فني مترابط داخل العمل الرقمي.',
            topics: [
                'تحديد الأسس الإنشائية داخل التصميم.',
                'بناء العلاقات بين العناصر لتحقيق التنظيم البصري.',
                'تطبيق الأسس الإنشائية في إنتاج تصميم رقمي متكامل.'
            ],
            iconName: 'dashboard',
            slideDecks: [
                {
                    id: 'part-1',
                    titleAr: 'الدرس الخامس 1',
                    subtitleAr: 'الأسس الإنشائية - الجزء الأول',
                    fileName: 'الدرس الخامس 1.pptx',
                    slides: this.numberedSlides('assets/lesson-five/part-1', 10)
                },
                {
                    id: 'part-2',
                    titleAr: 'الدرس الخامس 2',
                    subtitleAr: 'الأسس الإنشائية - الجزء الثاني',
                    fileName: 'الدرس الخامس 2.pptx',
                    slides: this.numberedSlides('assets/lesson-five/part-2', 10)
                },
                {
                    id: 'summary',
                    titleAr: 'ملخص الدرس الخامس',
                    subtitleAr: 'تلخيص الأسس الإنشائية للتصميم',
                    fileName: 'ملخص الدرس الخامس.pptx',
                    slides: this.numberedSlides('assets/lesson-five/summary', 15)
                }
            ],
            videoUrl: 'assets/lesson-five/video/lesson-five-demo.mp4',
            videoName: 'فيديو الدرس الخامس: الأسس الإنشائية للتصميم',
            posterUrl: 'assets/lesson-five/part-1/slide-01.png'
        },
        {
            id: 'lesson-six-digital-design',
            titleAr: '6. الدرس السادس: التصميم الرقمي',
            titleEn: 'Digital Design',
            descriptionAr: 'تطبيق مفاهيم التصميم الرقمي وإنتاج أعمال فنية رقمية تعتمد على العناصر والأسس والعمليات التصميمية.',
            topics: [
                'مفهوم التصميم الرقمي وأدواته.',
                'تطبيق عناصر وأسُس التصميم داخل البيئة الرقمية.',
                'إنتاج عمل رقمي متكامل وتحليل مكوناته البصرية.'
            ],
            iconName: 'draw',
            slideDecks: [
                {
                    id: 'part-1',
                    titleAr: 'الدرس السادس 1',
                    subtitleAr: 'التصميم الرقمي - الجزء الأول',
                    fileName: 'الدرس السادس 1.pptx',
                    slides: this.numberedSlides('assets/lesson-six/part-1', 10)
                },
                {
                    id: 'part-2',
                    titleAr: 'الدرس السادس 2',
                    subtitleAr: 'التصميم الرقمي - الجزء الثاني',
                    fileName: 'الدرس السادس 2.pptx',
                    slides: this.numberedSlides('assets/lesson-six/part-2', 9)
                },
                {
                    id: 'summary',
                    titleAr: 'ملخص الدرس السادس',
                    subtitleAr: 'تلخيص تطبيقات التصميم الرقمي',
                    fileName: 'ملخص الدرس السادس.pptx',
                    slides: this.numberedSlides('assets/lesson-six/summary', 15)
                }
            ],
            videoUrl: 'assets/lesson-six/video/lesson-six-demo.mp4',
            videoName: 'فيديو الدرس السادس: التصميم الرقمي',
            posterUrl: 'assets/lesson-six/part-1/slide-01.png'
        }
    ];

    constructor() {
        effect(() => {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progressState()));
            } catch (e) {
                console.error('Failed to save module progress:', e);
            }
        });
    }

    private loadProgressFromStorage(): ModuleProgressState {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load module progress:', e);
        }
        return {};
    }

    private numberedSlides(folder: string, count: number): string[] {
        return Array.from(
            { length: count },
            (_, index) => `${folder}/slide-${String(index + 1).padStart(2, '0')}.png`
        );
    }

    getModules(): DesignModule[] {
        return this.modules;
    }

    getModuleById(id: string): DesignModule | undefined {
        return this.modules.find((module) => module.id === id);
    }

    getCategoryForModule(moduleId: string): string {
        return MODULE_CATEGORY_MAP[moduleId] || '';
    }

    /**
     * Check if a module is unlocked.
     * First module ('blueprint-to-canvas') is always unlocked.
     * Subsequent modules require the previous module to be completed.
     */
    isModuleUnlocked(moduleId: string): boolean {
        const index = this.modules.findIndex((m) => m.id === moduleId);
        if (index <= 0) return true; // First module is unlocked
        const prevModule = this.modules[index - 1];
        const prevProgress = this.progressState()[prevModule.id];
        return !!prevProgress && prevProgress.completed;
    }

    getModuleLockReason(moduleId: string): string {
        if (this.isModuleUnlocked(moduleId)) return '';
        const index = this.modules.findIndex((m) => m.id === moduleId);
        if (index > 0) {
            const prevModule = this.modules[index - 1];
            return `يلزم دراسة وإجابة أسئلة "${prevModule.titleAr}" أولاً لفتح هذا الدرس.`;
        }
        return 'هذا الدرس مغلق حالياً.';
    }

    getModuleProgress(moduleId: string): ModuleProgress | null {
        return this.progressState()[moduleId] || null;
    }

    setModuleCompleted(moduleId: string, score: number, totalQuestions: number): { unlockedNext: boolean; nextModule: DesignModule | null } {
        let unlockedNext = false;
        let nextModule: DesignModule | null = null;

        const index = this.modules.findIndex((m) => m.id === moduleId);
        if (index >= 0 && index < this.modules.length - 1) {
            unlockedNext = true;
            nextModule = this.modules[index + 1];
        }

        this.progressState.update((state) => ({
            ...state,
            [moduleId]: {
                completed: true,
                score,
                totalQuestions,
                completedAt: new Date().toISOString()
            }
        }));

        return { unlockedNext, nextModule };
    }

    getNextModule(moduleId: string): DesignModule | null {
        const index = this.modules.findIndex((m) => m.id === moduleId);
        if (index >= 0 && index < this.modules.length - 1) {
            return this.modules[index + 1];
        }
        return null;
    }
}
