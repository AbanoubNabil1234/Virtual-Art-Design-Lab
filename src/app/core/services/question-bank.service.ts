import { Injectable, signal } from '@angular/core';

export interface Question {
    id: number;
    category: string;
    text: string;
    type: 'mcq' | 'true-false';
    options?: string[]; // For MCQ
    correctAnswer: any;
    explanation: string;
}

@Injectable({
    providedIn: 'root'
})
export class QuestionBankService {
    private questions = signal<Question[]>([
        {
            id: 1,
            category: 'عناصر التصميم',
            text: 'تعتبر ........ أبسط عناصر التصميم، وهي بداية لأي تكوين فني.',
            type: 'mcq',
            options: ['الخط', 'النقطة', 'المساحة', 'الحجم'],
            correctAnswer: 'النقطة',
            explanation: 'النقطة هي العنصر الأول والأبسط في بناء أي عمل فني، ومنها تبدأ بقية العناصر.'
        },
        {
            id: 2,
            category: 'عناصر التصميم',
            text: 'الخط هو الأداة الرئيسية للتعبير عن الحركة والاتجاه في العمل الفني.',
            type: 'true-false',
            correctAnswer: true,
            explanation: 'نعم، الخط يحدد المسارات ويوحي بالاتجاه والحركة داخل التصميم.'
        },
        {
            id: 3,
            category: 'أسس التصميم',
            text: 'يقصد بـ ........ توزيع العناصر في مساحة العمل لتحقيق الراحة البصرية.',
            type: 'mcq',
            options: ['التكرار', 'التوازن', 'التدرج', 'التباين'],
            correctAnswer: 'التوازن',
            explanation: 'التوازن هو التعادل البصري بين عناصر التصميم لتحقيق الاستقرار النفسي للمشاهد.'
        },
        {
            id: 4,
            category: 'أسس التصميم',
            text: 'يتحقق الإيقاع في التصميم من خلال التكرار المنتظم للعناصر.',
            type: 'true-false',
            correctAnswer: true,
            explanation: 'التكرار هو أحد أهم الوسائل لتحقيق الإيقاع البصري في الفنون التشكيلية.'
        },
        {
            id: 5,
            category: 'الألوان',
            text: 'أي من الألوان التالية يعتبر من الألوان الأساسية؟',
            type: 'mcq',
            options: ['الأخضر', 'البرتقالي', 'الأحمر', 'البنفسجي'],
            correctAnswer: 'الأحمر',
            explanation: 'الألوان الأساسية هي الأحمر والأصفر والأزرق، ولا يمكن الحصول عليها من خلط ألوان أخرى.'
        },
        {
            id: 6,
            category: 'التصميم الرقمي',
            text: 'يستخدم المعمل الافتراضي أدوات رقمية لمحاكاة الواقع في إنتاج العمل الفني.',
            type: 'true-false',
            correctAnswer: true,
            explanation: 'توفر المعامل الافتراضية بيئة تفاعلية تحاكي الأدوات التقليدية بتقنيات رقمية متقدمة.'
        },
        {
            id: 7,
            category: 'الألوان',
            text: 'يؤدي خلط اللونين الأحمر والأزرق إلى إنتاج اللون:',
            type: 'mcq',
            options: ['الأخضر', 'البرتقالي', 'البنفسجي', 'البني'],
            correctAnswer: 'البنفسجي',
            explanation: 'اللون البنفسجي هو لون ثانوي ينتج عن خلط الأحمر والأزرق بنسب متساوية.'
        },
        {
            id: 8,
            category: 'التصميم الرقمي',
            text: 'تعتبر وحدة بناء الصورة الرقمية هي:',
            type: 'mcq',
            options: ['البوصة', 'البكسل (Pixel)', 'المتر', 'النقطة اليدوية'],
            correctAnswer: 'البكسل (Pixel)',
            explanation: 'البكسل هو أصغر مربع لوني تتكون منه الصور الرقمية (Raster images).'
        }
    ]);

    getQuestions() {
        return this.questions;
    }

    getCategories() {
        return [...new Set(this.questions().map(q => q.category))];
    }

    getQuestionsByCategory(category: string) {
        if (category === 'الكل') return this.questions();
        return this.questions().filter(q => q.category === category);
    }
}
