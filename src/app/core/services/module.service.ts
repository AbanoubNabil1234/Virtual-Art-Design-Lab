import { Injectable } from '@angular/core';
import { DesignModule } from '../models/module.model';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    private modules: DesignModule[] = [
        {
            id: 'design-elements',
            titleAr: 'عناصر التصميم',
            titleEn: 'Design Elements',
            descriptionAr: 'المكونات الأساسية لبناء أي عمل فني وهي: النقطة، الخط، الشكل، الحجم، الملمس، واللون.',
            topics: ['النقطة', 'الخط', 'الشكل', 'الحجم', 'الملمس', 'اللون'],
            iconName: 'category'
        },
        {
            id: 'design-principles',
            titleAr: 'أسس التصميم',
            titleEn: 'Design Principles',
            descriptionAr: 'القواعد التي تنظم استخدام عناصر التصميم لتحقيق الجمال والوظيفية في العمل الفني.',
            topics: ['التوازن', 'الإيقاع', 'السيادة', 'الوحدة', 'التناسب'],
            iconName: 'balance'
        },
        {
            id: 'digital-design',
            titleAr: 'التصميم الرقمي',
            titleEn: 'Digital Design',
            descriptionAr: 'استخدام التقنيات الحديثة والبرمجيات في إنتاج وتعديل الصور والأشكال والرسومات.',
            topics: ['الرسوم المتجهة', 'الصور النقطية', 'أدوات التصميم', 'صيغ الملفات'],
            iconName: 'computer'
        },
        {
            id: 'color-theory',
            titleAr: 'نظرية اللون',
            titleEn: 'Color Theory',
            descriptionAr: 'دراسة الألوان وعلاقاتها ببعضها البعض وتأثيراتها النفسية والبصرية.',
            topics: ['عجلة الألوان', 'الألوان الأساسية', 'الألوان الثانوية', 'التكامل اللوني'],
            iconName: 'palette'
        },
        {
            id: 'virtual-lab',
            titleAr: 'المعمل الافتراضي',
            titleEn: 'Virtual Lab',
            descriptionAr: 'بيئة تفاعلية لتطبيق مهارات التصميم الفني بشكل عملي ومحاكاة التجارب الفنية.',
            topics: ['واجهة البرنامج', 'أدوات الرسم', 'تطبيق التأثيرات'],
            iconName: 'science'
        }
    ];

    getModules(): DesignModule[] {
        return this.modules;
    }

    getModuleById(id: string): DesignModule | undefined {
        return this.modules.find(m => m.id === id);
    }
}
