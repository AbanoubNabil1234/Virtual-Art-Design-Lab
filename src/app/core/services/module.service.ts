import { Injectable } from '@angular/core';
import { DesignModule } from '../models/module.model';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    private modules: DesignModule[] = [
        {
            id: 'digital-point',
            titleAr: '1. النقطة الرقمية وأنواعها',
            titleEn: 'Digital Point & Types',
            descriptionAr: 'التعرف على النقطة الرقمية وأنواعها في التصميم.',
            topics: [],
            iconName: 'lens'
        },
        {
            id: 'composition-points',
            titleAr: '2. بناء التكوين باستخدام النقاط',
            titleEn: 'Composition with Points',
            descriptionAr: 'كيفية بناء تكوين فني متكامل باستخدام النقاط.',
            topics: [],
            iconName: 'grain'
        },
        {
            id: 'simple-lines',
            titleAr: '3. رسم الخطوط البسيطة وغير المستقيمة',
            titleEn: 'Simple & Curved Lines',
            descriptionAr: 'رسم وتوظيف الخطوط البسيطة وغير المستقيمة.',
            topics: [],
            iconName: 'timeline'
        },
        {
            id: 'complex-lines',
            titleAr: '4. استخدام الخطوط المركبة في التكوين الفني',
            titleEn: 'Complex Lines in Composition',
            descriptionAr: 'توظيف الخطوط المركبة لإنشاء تكوينات فنية.',
            topics: [],
            iconName: 'Gesture'
        },
        {
            id: 'shapes-organic',
            titleAr: '5. تشكيل الأشكال الهندسية والعضوية',
            titleEn: 'Geometric & Organic Shapes',
            descriptionAr: 'رسم وتشكيل الأشكال الهندسية والعضوية.',
            topics: [],
            iconName: 'category'
        },
        {
            id: 'size-proportion',
            titleAr: '6. التحكم بالحجم والتناسب في التصميم الرقمي',
            titleEn: 'Size & Proportion',
            descriptionAr: 'مبادئ التحكم بالحجم والتناسب في التصميم.',
            topics: [],
            iconName: 'aspect_ratio'
        },
        {
            id: 'texture-digital',
            titleAr: '7. استكشاف الملمس وتطبيقه رقمياً',
            titleEn: 'Digital Texture',
            descriptionAr: 'كيفية إنشاء وتطبيق الملامس رقمياً.',
            topics: [],
            iconName: 'texture'
        },
        {
            id: 'color-mixing',
            titleAr: '8. دمج الألوان الأساسية والثانوية في العمل الفني',
            titleEn: 'Mixing Primary & Secondary Colors',
            descriptionAr: 'أساسيات دمج الألوان الأساسية والثانوية.',
            topics: [],
            iconName: 'palette'
        },
        {
            id: 'digital-lighting',
            titleAr: '9. تطبيق الإضاءة في التصميم الرقمي',
            titleEn: 'Digital Lighting',
            descriptionAr: 'تقنيات توزيع الإضاءة والظلال رقمياً.',
            topics: [],
            iconName: 'light_mode'
        },
        {
            id: 'harmony-contrast',
            titleAr: '10. تحقيق الانسجام والتباين اللوني',
            titleEn: 'Harmony & Contrast',
            descriptionAr: 'تحقيق التوازن بين الانسجام والتباين اللوني.',
            topics: [],
            iconName: 'contrast'
        },
        {
            id: 'repetition-rhythm',
            titleAr: '11. استخدام التكرار والإيقاع في التصميم',
            titleEn: 'Repetition & Rhythm',
            descriptionAr: 'توظيف التكرار لخلق إيقاع بصري.',
            topics: [],
            iconName: 'repeat'
        },
        {
            id: 'variety-gradation',
            titleAr: '12. تطبيق التنوع والتدرج البصري',
            titleEn: 'Variety & Gradation',
            descriptionAr: 'إضافة التنوع والتدرج للعناصر البصرية.',
            topics: [],
            iconName: 'linear_scale'
        },
        {
            id: 'directional-principles',
            titleAr: '13. توظيف الأسس الاتجاهية في التكوين الرقمي',
            titleEn: 'Directional Principles',
            descriptionAr: 'استخدام الاتجاهات لتوجيه عين المشاهد.',
            topics: [],
            iconName: 'navigation'
        },
        {
            id: 'balance-focal',
            titleAr: '14. تطبيق الأسس التركيزية لتحقيق التوازن البصري',
            titleEn: 'Focal Points for Balance',
            descriptionAr: 'خلق نقاط تركيز لتحقيق التوازن.',
            topics: [],
            iconName: 'center_focus_strong'
        },
        {
            id: 'unity-harmony',
            titleAr: '15. الأسس المركبة: الوحدة والانسجام والتناسب',
            titleEn: 'Composite Principles: Unity',
            descriptionAr: 'الجمع بين الوحدة والانسجام والتناسب.',
            topics: [],
            iconName: 'dashboard'
        },
        {
            id: 'design-interrelationships',
            titleAr: '16. مقابلات التصميم: العلاقة بين الشكل والأرضية والزمان والمكان',
            titleEn: 'Design Interrelationships',
            descriptionAr: 'دراسة العلاقات بين الشكل، الأرضية، الزمان، والمكان.',
            topics: [],
            iconName: 'layers'
        },
        {
            id: 'design-values',
            titleAr: '17. تطبيق قيم التصميم: الجمالية والوظيفية والأخلاقية',
            titleEn: 'Design Values',
            descriptionAr: 'تطبيق القيم الجمالية، الوظيفية، والأخلاقية.',
            topics: [],
            iconName: 'stars'
        },
        {
            id: 'production-integration',
            titleAr: '18. إنتاج التصميم الرقمي: دمج النقاط والخطوط والأشكال',
            titleEn: 'Digital Production: Integration',
            descriptionAr: 'إنتاج تصميم بدمج النقاط، الخطوط، والأشكال.',
            topics: [],
            iconName: 'build'
        },
        {
            id: 'artwork-development',
            titleAr: '19. تطوير عمل فني رقمي متكامل',
            titleEn: 'Developing Complete Artwork',
            descriptionAr: 'مراحل تطوير عمل فني رقمي متكامل.',
            topics: [],
            iconName: 'brush'
        },
        {
            id: 'project-presentation',
            titleAr: '20. عرض المشروع وتحليل التصميم الرقمي',
            titleEn: 'Project Presentation & Analysis',
            descriptionAr: 'عرض المشروع النهائي وتحليل التصميم نقدياً.',
            topics: [],
            iconName: 'present_to_all'
        }
    ];

    getModules(): DesignModule[] {
        return this.modules;
    }

    getModuleById(id: string): DesignModule | undefined {
        return this.modules.find(m => m.id === id);
    }
}
