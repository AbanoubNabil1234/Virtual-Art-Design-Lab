import { Injectable, signal } from '@angular/core';

export interface ContentPage {
    id: string;
    title: string;
    content: string; // Plain text or HTML for search
    route: string;
    category: 'تعريفات' | 'اهداف' | 'مفاهيم';
}

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private pages = signal<ContentPage[]>([
        {
            id: 'virtual-lab',
            title: 'المعمل الافتراضي (Virtual Lab)',
            content: 'هو بيئة تعلم وتعليم افتراضية تستهدف تنمية مهارات العمل المعملي لدى الطلاب، تقع هذه البيئة على أحد المواقع بشبكة الإنترنت، وتضم أدوات تحاكي التجهيزات الموجودة بالمعمل الحقيقي. المعمل الافتراضي هو بيئة تفاعلية تسمح بإجراء التجارب ومحاكاة الواقع.',
            route: '/definition/virtual-lab',
            category: 'تعريفات'
        },
        {
            id: 'design-skills',
            title: 'مهارات التصميم (Design Skills)',
            content: 'تعرف بأنها قدرة طلاب المرحلة الثانوية على الأداء العملي لمهام التصميم الفني بكفاءة، والتي تتمثل في توظيف عناصر التصميم وتنظيمها داخل عمل فني متكامل، وتشمل مهارات التخطيط، والتنفيذ، والتعديل، والإخراج الفني.',
            route: '/definition/skills',
            category: 'تعريفات'
        },
        {
            id: 'design-concepts',
            title: 'مفاهيم التصميم (Design Concepts)',
            content: 'هي مجموعة من المصطلحات والمفاهيم الأساسية التي يعتمد عليها المصمم في بناء تكويناته الفنية، مثل: النقطة، الخط، الشكل، الملمس، اللون، الفراغ. هذه المفاهيم تشكل اللغة البصرية التي يستخدمها الفنان للتعبير عن أفكاره.',
            route: '/definition/concepts',
            category: 'مفاهيم'
        },
        {
            id: 'general-goals',
            title: 'الأهداف العامة',
            content: '1. تنمية مهارات التصميم الفني لدى طلاب المرحلة الثانوية. 2. تعزيز القدرة على استخدام الأدوات الرقمية في التصميم. 3. توفير بيئة آمنة وتفاعلية للتجريب الفني. 4. تشجيع التفكير الإبداعي وحل المشكلات التصميمية.',
            route: '/general-goals',
            category: 'اهداف'
        }
    ]);

    getPages() {
        return this.pages;
    }

    getPage(id: string) {
        return this.pages().find(p => p.id === id);
    }

    searchContent(query: string) {
        const q = query.toLowerCase();
        return this.pages().filter(p =>
            p.title.includes(q) || p.content.includes(q)
        );
    }
}
