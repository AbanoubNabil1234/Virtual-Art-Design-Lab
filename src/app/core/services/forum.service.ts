import { Injectable, signal } from '@angular/core';

export interface Reply {
    id: number;
    author: string;
    content: string;
    date: string;
    avatar?: string;
}

export interface Topic {
    id: number;
    lessonNumber: string;
    title: string;
    author: string;
    date: string;
    views: number;
    replies: Reply[];
    isPinned: boolean;
    content: string;
    prompts: string[];
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ForumService {
    private topics = signal<Topic[]>([
        {
            id: 1,
            lessonNumber: 'الدرس الأول',
            title: 'التصميم الفني ومفاهيمه الأساسية',
            author: 'إدارة المعمل',
            date: '2026-08-09 10:00:00',
            views: 0,
            isPinned: false,
            content: 'مساحة نقاش خاصة بمفهوم التصميم الفني وأهمية الجمع بين الجمال والوظيفة وطريقة إنتاج عمل فني متقن.',
            prompts: [
                'ما الفرق بين التصميم والرسم العشوائي؟',
                'كيف تؤثر الوظيفة العملية في نجاح المنتج الفني؟',
                'اذكر مثالًا لتصميم زخرفي يحقق قيمة جمالية واضحة.'
            ],
            replies: []
        },
        {
            id: 2,
            lessonNumber: 'الدرس الثاني',
            title: 'عناصر التصميم',
            author: 'إدارة المعمل',
            date: '2026-08-09 10:10:00',
            views: 0,
            isPinned: false,
            content: 'مساحة نقاش خاصة بعناصر التصميم مثل النقطة والخط والشكل واللون والملمس داخل التصميم الرقمي.',
            prompts: [
                'كيف تتحول النقطة إلى خط ثم إلى شكل؟',
                'ما دور اللون في جذب الانتباه ونقل الإحساس؟',
                'اختر عنصرًا من عناصر التصميم واشرح استخدامه داخل المعمل الافتراضي.'
            ],
            replies: []
        },
        {
            id: 3,
            lessonNumber: 'الدرس الثالث',
            title: 'عمليات التصميم',
            author: 'إدارة المعمل',
            date: '2026-08-09 10:20:00',
            views: 0,
            isPinned: false,
            content: 'مساحة نقاش خاصة بعمليات التصميم: التكرار، التنوع، التدرج، والإيقاع ودورها في تنظيم العمل الفني.',
            prompts: [
                'متى يكون التكرار مفيدًا ومتى يصبح رتيبًا؟',
                'كيف يمنع التنوع الملل البصري؟',
                'صمم مثالًا بسيطًا يوضح التدرج في الحجم أو اللون.'
            ],
            replies: []
        },
        {
            id: 4,
            lessonNumber: 'الدرس الرابع',
            title: 'أسس التصميم',
            author: 'إدارة المعمل',
            date: '2026-08-09 10:30:00',
            views: 0,
            isPinned: false,
            content: 'مساحة نقاش خاصة بأسس التصميم التي تحقق الاتزان والوحدة والتناسب والوضوح البصري.',
            prompts: [
                'كيف يساعد الاتزان على راحة عين المشاهد؟',
                'ما علاقة الوحدة بنجاح التصميم؟',
                'اذكر موقفًا يحتاج فيه المصمم إلى استخدام التباين بوضوح.'
            ],
            replies: []
        },
        {
            id: 5,
            lessonNumber: 'الدرس الخامس',
            title: 'الأسس الإنشائية للتصميم',
            author: 'إدارة المعمل',
            date: '2026-08-09 10:40:00',
            views: 0,
            isPinned: false,
            content: 'مساحة نقاش خاصة بعلاقة الشكل بالأرضية والزمان والمكان والقيم الجمالية والوظيفية والأخلاقية.',
            prompts: [
                'لماذا لا يظهر الشكل بوضوح دون أرضية مناسبة؟',
                'كيف يمكن التعبير عن الزمان والمكان داخل تصميم رقمي؟',
                'ما الفرق بين القيمة الجمالية والقيمة الوظيفية؟'
            ],
            replies: []
        },
        {
            id: 6,
            lessonNumber: 'الدرس السادس',
            title: 'التصميم الرقمي',
            author: 'إدارة المعمل',
            date: '2026-08-09 10:50:00',
            views: 0,
            isPinned: false,
            content: 'مساحة نقاش خاصة بالتصميم الرقمي والبكسل والخط والشكل واللون والحركة الرقمية داخل المعمل الافتراضي.',
            prompts: [
                'ما أهمية البكسل في بناء الصورة الرقمية؟',
                'كيف تساعد الحركة الرقمية على توضيح المعلومات؟',
                'ما ميزة التجريب داخل المعمل الافتراضي مقارنة بالخامات التقليدية؟'
            ],
            replies: []
        }
    ]);

    getTopics() {
        return this.topics;
    }

    getTopic(id: number) {
        return this.topics().find((topic) => topic.id === id);
    }

    addReply(topicId: number, author: string, content: string) {
        this.topics.update((list) => {
            const topic = list.find((item) => item.id === topicId);
            if (topic) {
                topic.replies.push({
                    id: topic.replies.length + 1,
                    author,
                    content,
                    date: new Date().toISOString().slice(0, 19).replace('T', ' ')
                });
            }
            return [...list];
        });
    }
}
