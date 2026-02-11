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
            category: 'البوابات المنطقية',
            text: 'ما هي البوابة التي تعطي مخرج 1 فقط إذا كان كلا المدخلين 1؟',
            type: 'mcq',
            options: ['AND', 'OR', 'NOT', 'XOR'],
            correctAnswer: 'AND',
            explanation: 'بوابة AND تتطلب أن تكون جميع المداخل (True/1) لتعطي مخرج (True/1).'
        },
        {
            id: 2,
            category: 'البوابات المنطقية',
            text: 'بوابة NOT تعكس قيمة المدخل.',
            type: 'true-false',
            correctAnswer: true,
            explanation: 'نعم، بوابة NOT (العاكس) تقوم بقلب القيمة؛ إذا دخل 1 يخرج 0 والعكس.'
        },
        {
            id: 3,
            category: 'تصميم الدوائر',
            text: 'أي من الرموز التالية يمثل مصدر الجهد؟',
            type: 'mcq',
            options: ['مقاومة', 'بطارية', 'مكثف', 'أرضي'],
            correctAnswer: 'بطارية',
            explanation: 'البطارية هي مصدر الجهد المستمر في الدوائر الإلكترونية.'
        },
        {
            id: 4,
            category: 'تصميم الدوائر',
            text: 'يمكن توصيل السلك بأي نقطة في الدائرة.',
            type: 'true-false',
            correctAnswer: false,
            explanation: 'يجب توصيل الأسلاك بنقاط التوصيل (Pins) أو المكونات لضمان سريان التيار.'
        },
        {
            id: 5,
            category: 'مفاهيم عامة',
            text: 'وحدة قياس المقاومة هي:',
            type: 'mcq',
            options: ['فولت', 'أمبير', 'أوم', 'واط'],
            correctAnswer: 'أوم',
            explanation: 'الأوم (Ohm) هي وحدة قياس المقاومة الكهربائية.'
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
