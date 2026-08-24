import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonSoundService } from '../../core/services/button-sound.service';
import { TestsService, TestType, TEST_DURATION_SECONDS, TestResult } from '../../core/services/tests.service';
import { Question } from '../../core/data/tests-data';

@Component({
  selector: 'app-test-runner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './test-runner.component.html',
  styles: [`
    .question-card {
      background: #fff;
      border: 1.5px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: clamp(1rem, 3vw, 1.5rem);
      margin-bottom: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    .question-card.answered {
      border-color: #cbd5e1;
    }
    .question-card.unanswered-highlight {
      border-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
    }
    .option-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0.5rem 0;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      cursor: pointer;
      border: 1.5px solid #e5e7eb;
      background: #fff;
    }
    .option-row:hover {
      background: rgba(107, 66, 38, 0.05);
      border-color: rgba(107, 66, 38, 0.3);
    }
    .option-row.selected {
      background: #fbf5ef;
      border-color: #6b4226;
      box-shadow: 0 2px 4px rgba(107, 66, 38, 0.1);
    }
    .score-display {
      font-size: clamp(1.75rem, 5vw, 2.75rem);
      color: #059669;
      font-weight: 900;
      margin: 1.25rem 0;
    }
    .review-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      padding: 1.25rem;
      text-align: right;
    }
    .review-option {
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 0.75rem 0.9rem;
      background: #fff;
      transition: all 0.2s;
    }
    .review-option.correct {
      background: #ecfdf5;
      border-color: #22c55e;
    }
    .review-option.wrong {
      background: #fef2f2;
      border-color: #ef4444;
    }
    .sticky-timer-bar {
      position: sticky;
      top: 0.5rem;
      z-index: 40;
      backdrop-filter: blur(12px);
    }
    .timer-warning {
      animation: pulse-danger 1.5s infinite;
    }
    @keyframes pulse-danger {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    .page-pill {
      position: relative;
    }
    .page-pill-badge {
      position: absolute;
      top: -4px;
      left: -4px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: bold;
    }
  `]
})
export class TestRunnerComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly buttonSound = inject(ButtonSoundService);
  readonly testsService = inject(TestsService);

  testType = signal<TestType>('pre');
  step = signal<'intro' | 'exam' | 'result'>('intro');

  questions = signal<Question[]>([]);
  selectedAnswers = signal<Record<number, string>>({});
  currentPage = signal<number>(0);

  // 45-minute countdown timer
  remainingSeconds = signal<number>(TEST_DURATION_SECONDS);
  private timerInterval: any = null;
  timeExpiredNotice = signal(false);

  // Validation modal state
  showUnansweredModal = signal(false);
  attemptedSubmit = signal(false);

  // Expose Math to template
  readonly Math = Math;

  // Result metrics
  testResult = signal<TestResult | null>(null);

  readonly pageRanges = [
    { start: 0, end: 6 },
    { start: 6, end: 14 },
    { start: 14, end: 21 },
    { start: 21, end: 28 },
    { start: 28, end: 39 },
    { start: 39, end: 45 }
  ];

  get visibleQuestions(): Question[] {
    const range = this.pageRanges[this.currentPage()];
    return this.questions().slice(range.start, range.end);
  }

  get totalPages(): number {
    return this.pageRanges.length;
  }

  readonly answeredCount = computed(() => {
    return Object.keys(this.selectedAnswers()).length;
  });

  readonly unansweredCount = computed(() => {
    const total = this.questions().length || 45;
    return total - this.answeredCount();
  });

  readonly unansweredQuestionIds = computed(() => {
    const answers = this.selectedAnswers();
    return this.questions()
      .filter((q) => !answers[q.id])
      .map((q) => q.id);
  });

  readonly progressPercentage = computed(() => {
    const total = this.questions().length || 45;
    return Math.round((this.answeredCount() / total) * 100);
  });

  readonly formattedTimer = computed(() => {
    const totalSec = this.remainingSeconds();
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mStr}:${sStr}`;
  });

  readonly isTimerLow = computed(() => this.remainingSeconds() <= 300); // < 5 mins
  readonly isTimerMedium = computed(() => this.remainingSeconds() > 300 && this.remainingSeconds() <= 600); // < 10 mins

  get testTitle(): string {
    return this.testType() === 'pre' ? 'الاختبار التحصيلي القبلي (أ)' : 'الاختبار التحصيلي البعدي (ب)';
  }

  get testSubtitle(): string {
    return this.testType() === 'pre'
      ? 'القياس القبلي للمفاهيم المعرفية في التصميم الفني'
      : 'القياس البعدي للمفاهيم المعرفية في التصميم الفني';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const typeParam = params.get('type') as TestType;
      const resolvedType: TestType = typeParam === 'post' ? 'post' : 'pre';
      this.testType.set(resolvedType);
      this.initializeTest();
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private initializeTest(): void {
    this.questions.set(this.testsService.getQuestions());

    // Check if post-test is locked
    if (this.testType() === 'post' && !this.testsService.isPostUnlocked()) {
      return; // Will show lock view
    }

    const savedResult = this.testsService.getTestResult(this.testType());
    if (savedResult && savedResult.completed) {
      this.testResult.set(savedResult);
      this.selectedAnswers.set({ ...savedResult.answers });
      this.step.set('result');
      return;
    }

    // Check if there was an in-progress session
    const inProgress = this.testsService.getInProgress(this.testType());
    if (inProgress) {
      this.selectedAnswers.set({ ...inProgress.answers });
      this.remainingSeconds.set(inProgress.remainingSeconds);
      this.currentPage.set(inProgress.currentPage || 0);
      if (Object.keys(inProgress.answers).length > 0 || inProgress.remainingSeconds < TEST_DURATION_SECONDS) {
        this.step.set('exam');
        this.startTimer();
      } else {
        this.step.set('intro');
      }
    } else {
      this.step.set('intro');
    }
  }

  startExam(): void {
    this.step.set('exam');
    this.startTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const current = this.remainingSeconds();
      if (current <= 1) {
        this.remainingSeconds.set(0);
        this.stopTimer();
        this.handleTimeExpired();
      } else {
        const next = current - 1;
        this.remainingSeconds.set(next);

        if (next % 5 === 0) {
          this.testsService.saveInProgress(
            this.testType(),
            this.selectedAnswers(),
            next,
            this.currentPage()
          );
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  selectOption(questionId: number, option: string): void {
    const updated = { ...this.selectedAnswers(), [questionId]: option };
    this.selectedAnswers.set(updated);
    this.testsService.saveInProgress(
      this.testType(),
      updated,
      this.remainingSeconds(),
      this.currentPage()
    );
  }

  isOptionSelected(questionId: number, option: string): boolean {
    return this.selectedAnswers()[questionId] === option;
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update((p) => p + 1);
      this.testsService.saveInProgress(
        this.testType(),
        this.selectedAnswers(),
        this.remainingSeconds(),
        this.currentPage()
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      this.testsService.saveInProgress(
        this.testType(),
        this.selectedAnswers(),
        this.remainingSeconds(),
        this.currentPage()
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  jumpToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.currentPage.set(pageIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  jumpToQuestion(questionId: number): void {
    this.showUnansweredModal.set(false);
    // Find page containing questionId
    const pageIdx = this.pageRanges.findIndex((range) => questionId > range.start && questionId <= range.end);
    if (pageIdx !== -1) {
      this.currentPage.set(pageIdx);
    }
    setTimeout(() => {
      const el = document.getElementById(`q_card_${questionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }

  jumpToFirstUnanswered(): void {
    const unanswered = this.unansweredQuestionIds();
    if (unanswered.length > 0) {
      this.jumpToQuestion(unanswered[0]);
    }
  }

  isQuestionAnswered(questionId: number): boolean {
    return !!this.selectedAnswers()[questionId];
  }

  isPageComplete(pageIndex: number): boolean {
    const range = this.pageRanges[pageIndex];
    const pageQuestions = this.questions().slice(range.start, range.end);
    const answers = this.selectedAnswers();
    return pageQuestions.every((q) => !!answers[q.id]);
  }

  getPageUnansweredCount(pageIndex: number): number {
    const range = this.pageRanges[pageIndex];
    const pageQuestions = this.questions().slice(range.start, range.end);
    const answers = this.selectedAnswers();
    return pageQuestions.filter((q) => !answers[q.id]).length;
  }

  private handleTimeExpired(): void {
    this.timeExpiredNotice.set(true);
    setTimeout(() => {
      this.submitExam(true);
    }, 1500);
  }

  confirmSubmit(): void {
    this.attemptedSubmit.set(true);
    const unanswered = this.unansweredCount();

    if (unanswered > 0) {
      // Must answer all questions to submit!
      this.showUnansweredModal.set(true);
      return;
    }

    this.submitExam(false);
  }

  closeUnansweredModal(): void {
    this.showUnansweredModal.set(false);
  }

  submitExam(autoTimeout: boolean = false): void {
    this.stopTimer();

    const timeSpent = TEST_DURATION_SECONDS - this.remainingSeconds();
    const result = this.testsService.submitTest(
      this.testType(),
      this.selectedAnswers(),
      timeSpent > 0 ? timeSpent : TEST_DURATION_SECONDS
    );

    this.testResult.set(result);
    this.step.set('result');
    this.showUnansweredModal.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.buttonSound.play('success'), 200);
  }

  restartExam(): void {
    if (confirm('هل أنت متأكد من رغبتك في إعادة أداء الاختبار؟ سيتم تصفير الإجابات والبدء من جديد.')) {
      this.testsService.resetTest(this.testType());
      this.selectedAnswers.set({});
      this.remainingSeconds.set(TEST_DURATION_SECONDS);
      this.currentPage.set(0);
      this.testResult.set(null);
      this.attemptedSubmit.set(false);
      this.showUnansweredModal.set(false);
      this.step.set('intro');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Review helper functions
  isQuestionCorrect(q: Question): boolean {
    const selected = this.selectedAnswers()[q.id];
    return this.testsService.isAnswerCorrect(q.id, selected);
  }

  isOptionCorrect(q: Question, option: string): boolean {
    return this.testsService.getOptionLetter(option) === this.testsService.getCorrectLetter(q.id);
  }

  formatTimeSpent(seconds: number | undefined): string {
    if (!seconds) return '45 دقيقة';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} ثانية`;
    return `${m} دقيقة و ${s} ثانية`;
  }
}
