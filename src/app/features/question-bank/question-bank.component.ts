import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBankService, Question } from '../../core/services/question-bank.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-question-bank',
    standalone: true,
    imports: [CommonModule, HeaderComponent, RouterLink],
    template: `
    <app-header></app-header>
    <div class="qb-container animate-fade-in">
        
        <!-- Categories View -->
        <div class="categories-view" *ngIf="!selectedCategory()">
            <h2 class="page-title">بنك الأسئلة (التقويم)</h2>
            <div class="categories-grid">
                <div class="category-card" *ngFor="let cat of categories" (click)="selectCategory(cat)">
                    <div class="cat-icon">
                        <span class="material-icons">school</span>
                    </div>
                    <h3>{{ cat }}</h3>
                    <p>{{ getQuestionCount(cat) }} أسئلة</p>
                </div>
                <div class="category-card all-cat" (click)="selectCategory('الكل')">
                    <div class="cat-icon">
                        <span class="material-icons">library_books</span>
                    </div>
                    <h3>جميع الأسئلة</h3>
                    <p>{{ questions().length }} أسئلة</p>
                </div>
            </div>
        </div>

        <!-- Quiz View -->
        <div class="quiz-view" *ngIf="selectedCategory()">
            <div class="quiz-header">
                <button (click)="selectedCategory.set(null)" class="back-btn">
                    <span class="material-icons">arrow_forward</span>
                    عودة للتصنيفات
                </button>
                <h2>{{ selectedCategory() }}</h2>
                <div class="score-display" *ngIf="isFinished">
                    النتيجة: {{ score }}/{{ activeQuestions().length }}
                </div>
            </div>

            <div class="questions-list">
                <div class="question-card" *ngFor="let q of activeQuestions(); let i = index">
                    <div class="q-header">
                        <span class="q-num">سؤال {{ i + 1 }}</span>
                        <span class="q-type" *ngIf="q.type === 'mcq'">اختيار من متعدد</span>
                        <span class="q-type" *ngIf="q.type === 'true-false'">صواب / خطأ</span>
                    </div>
                    
                    <p class="q-text">{{ q.text }}</p>

                    <div class="options-container">
                        <!-- MCQ Options -->
                        <ng-container *ngIf="q.type === 'mcq'">
                            <button *ngFor="let opt of q.options" 
                                    class="option-btn"
                                    [class.selected]="userAnswers[q.id] === opt"
                                    [class.correct]="isSubmitted && opt === q.correctAnswer"
                                    [class.incorrect]="isSubmitted && userAnswers[q.id] === opt && opt !== q.correctAnswer"
                                    [disabled]="isSubmitted"
                                    (click)="answer(q.id, opt)">
                                {{ opt }}
                                <span class="material-icons status-icon" *ngIf="isSubmitted && opt === q.correctAnswer">check_circle</span>
                                <span class="material-icons status-icon" *ngIf="isSubmitted && userAnswers[q.id] === opt && opt !== q.correctAnswer">cancel</span>
                            </button>
                        </ng-container>

                        <!-- True/False Options -->
                        <ng-container *ngIf="q.type === 'true-false'">
                            <button class="option-btn"
                                    [class.selected]="userAnswers[q.id] === true"
                                    [class.correct]="isSubmitted && q.correctAnswer === true"
                                    [class.incorrect]="isSubmitted && userAnswers[q.id] === true && q.correctAnswer !== true"
                                    [disabled]="isSubmitted"
                                    (click)="answer(q.id, true)">
                                صواب
                            </button>
                            <button class="option-btn"
                                    [class.selected]="userAnswers[q.id] === false"
                                    [class.correct]="isSubmitted && q.correctAnswer === false"
                                    [class.incorrect]="isSubmitted && userAnswers[q.id] === false && q.correctAnswer !== false"
                                    [disabled]="isSubmitted"
                                    (click)="answer(q.id, false)">
                                خطأ
                            </button>
                        </ng-container>
                    </div>

                    <div class="explanation" *ngIf="isSubmitted">
                        <strong>التفسير:</strong> {{ q.explanation }}
                    </div>
                </div>
            </div>

            <div class="action-footer" *ngIf="!isSubmitted">
                <button (click)="submitQuiz()" class="submit-btn" [disabled]="Object.keys(userAnswers).length !== activeQuestions().length">
                    تسليم الإجابات
                </button>
            </div>
             <div class="action-footer" *ngIf="isSubmitted">
                <button (click)="resetQuiz()" class="reset-btn">
                    إعادة المحاولة
                </button>
            </div>
        </div>

    </div>
  `,
    styles: [`
    .qb-container {
        padding: 30px;
        background: #fdfdfd;
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .page-title {
        color: #2c3e50;
        text-align: center;
        margin-bottom: 40px;
        font-size: 2rem;
        position: relative;
    }
    .page-title::after {
        content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
        width: 60px; height: 4px; background: #3498db; border-radius: 2px;
    }

    /* Categories Grid */
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .category-card {
        background: white;
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    .category-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-color: #3498db; }
    
    .cat-icon {
        width: 60px; height: 60px;
        background: #eaf2f8;
        color: #3498db;
        border-radius: 50%;
        display: flex; justify-content: center; align-items: center;
        margin: 0 auto 15px;
        font-size: 24px;
    }
    .all-cat .cat-icon { background: #fef9e7; color: #f1c40f; }

    .category-card h3 { margin: 0 0 10px; color: #2c3e50; }
    .category-card p { margin: 0; color: #7f8c8d; font-size: 0.9rem; }

    /* Quiz View */
    .quiz-view { max-width: 800px; margin: 0 auto; }

    .quiz-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 30px;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
    }
    
    .back-btn {
        background: none; border: none; cursor: pointer;
        display: flex; align-items: center; gap: 5px;
        color: #7f8c8d; font-size: 1rem; font-weight: bold;
    }
    .back-btn:hover { color: #2c3e50; }

    .score-display {
        background: #27ae60; color: white;
        padding: 5px 15px; border-radius: 20px; font-weight: bold;
    }

    .question-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 25px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }

    .q-header {
        display: flex; justify-content: space-between;
        margin-bottom: 15px;
        font-size: 0.85rem; color: #95a5a6;
    }
    .q-num { font-weight: bold; color: #3498db; }
    .q-text { font-size: 1.2rem; color: #2c3e50; margin-bottom: 25px; line-height: 1.5; }

    .options-container { display: flex; flex-direction: column; gap: 10px; }

    .option-btn {
        padding: 15px;
        border: 2px solid #ecf0f1;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        text-align: right;
        transition: all 0.2s;
        position: relative;
        display: flex; justify-content: space-between; align-items: center;
    }
    .option-btn:hover:not([disabled]) { border-color: #bdc3c7; background: #f9f9f9; }
    
    .option-btn.selected { border-color: #3498db; background: #ebf5fb; color: #2980b9; font-weight: bold; }
    
    .option-btn.correct { border-color: #27ae60; background: #eafaf1; color: #27ae60; }
    .option-btn.incorrect { border-color: #e74c3c; background: #fdedec; color: #c0392b; }

    .explanation {
        margin-top: 20px;
        padding: 15px;
        background: #fdfefe;
        border-right: 4px solid #f1c40f;
        color: #555;
        font-size: 0.95rem;
    }

    .action-footer { text-align: center; margin-top: 30px; padding-bottom: 50px; }
    .submit-btn, .reset-btn {
        background: #3498db; color: white;
        border: none; padding: 12px 40px; border-radius: 30px;
        font-size: 1.1rem; cursor: pointer;
        box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
        transition: transform 0.2s;
    }
    .submit-btn:hover, .reset-btn:hover { transform: translateY(-2px); background: #2980b9; }
    .submit-btn:disabled { background: #bdc3c7; cursor: not-allowed; transform: none; box-shadow: none; }
    .reset-btn { background: #2c3e50; }
  `]
})
export class QuestionBankComponent {
    qbService = inject(QuestionBankService);
    questions = this.qbService.getQuestions();
    categories = this.qbService.getCategories();

    selectedCategory = signal<string | null>(null);
    activeQuestions = signal<Question[]>([]);

    userAnswers: { [key: number]: any } = {};
    isFinished = false;
    isSubmitted = false;
    score = 0;

    Object = Object; // For template access

    getQuestionCount(category: string) {
        return this.questions().filter(q => q.category === category).length;
    }

    selectCategory(category: string) {
        this.selectedCategory.set(category);
        this.activeQuestions.set(this.qbService.getQuestionsByCategory(category));
        this.resetQuizState();
    }

    answer(qId: number, value: any) {
        if (this.isSubmitted) return;
        this.userAnswers[qId] = value;
    }

    submitQuiz() {
        this.isSubmitted = true;
        this.score = 0;
        this.activeQuestions().forEach(q => {
            if (this.userAnswers[q.id] === q.correctAnswer) {
                this.score++;
            }
        });
    }

    resetQuiz() {
        this.resetQuizState();
    }

    private resetQuizState() {
        this.userAnswers = {};
        this.isSubmitted = false;
        this.score = 0;
    }
}
