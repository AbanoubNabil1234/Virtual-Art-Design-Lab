import { Injectable, computed, effect, signal } from '@angular/core';
import { Question, TEST_ANSWER_KEY, TEST_QUESTIONS } from '../data/tests-data';

export type TestType = 'pre' | 'post';

export interface TestResult {
  completed: boolean;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  answers: Record<number, string>;
  completedAt?: string;
  timeSpentSeconds?: number;
}

export interface InProgressData {
  answers: Record<number, string>;
  remainingSeconds: number;
  currentPage: number;
  lastUpdated: number;
}

export interface TestsStorageState {
  pre: TestResult;
  post: TestResult;
  inProgress?: {
    pre?: InProgressData | null;
    post?: InProgressData | null;
  };
}

export const TEST_DURATION_SECONDS = 45 * 60; // 45 minutes = 2700 seconds

const DEFAULT_TEST_RESULT: TestResult = {
  completed: false,
  score: 0,
  totalQuestions: TEST_QUESTIONS.length,
  correctCount: 0,
  wrongCount: 0,
  answers: {}
};

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  private readonly STORAGE_KEY = 'virtual_art_lab_tests_state_v1';

  readonly preTest = signal<TestResult>({ ...DEFAULT_TEST_RESULT });
  readonly postTest = signal<TestResult>({ ...DEFAULT_TEST_RESULT });

  private readonly inProgressState = signal<{
    pre?: InProgressData | null;
    post?: InProgressData | null;
  }>({});

  // Computed properties
  readonly isPostUnlocked = computed(() => this.preTest().completed);
  
  readonly scoreImprovement = computed(() => {
    if (this.preTest().completed && this.postTest().completed) {
      return this.postTest().score - this.preTest().score;
    }
    return null;
  });

  constructor() {
    this.loadFromStorage();

    // Auto-persist when signals change
    effect(() => {
      const stateToSave: TestsStorageState = {
        pre: this.preTest(),
        post: this.postTest(),
        inProgress: this.inProgressState()
      };
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (err) {
        console.error('Failed to save tests state to localStorage:', err);
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed: TestsStorageState = JSON.parse(saved);
        if (parsed.pre) this.preTest.set(parsed.pre);
        if (parsed.post) this.postTest.set(parsed.post);
        if (parsed.inProgress) this.inProgressState.set(parsed.inProgress);
      }
    } catch (err) {
      console.error('Failed to load tests state from localStorage:', err);
    }
  }

  getQuestions(): Question[] {
    return TEST_QUESTIONS.map((q) => ({
      ...q,
      options: [...q.options]
    }));
  }

  getAnswerKey(): Record<number, string> {
    return { ...TEST_ANSWER_KEY };
  }

  getTestResult(type: TestType): TestResult {
    return type === 'pre' ? this.preTest() : this.postTest();
  }

  getInProgress(type: TestType): InProgressData | null {
    const current = this.inProgressState();
    return (type === 'pre' ? current.pre : current.post) ?? null;
  }

  saveInProgress(
    type: TestType,
    answers: Record<number, string>,
    remainingSeconds: number,
    currentPage: number
  ): void {
    const data: InProgressData = {
      answers,
      remainingSeconds,
      currentPage,
      lastUpdated: Date.now()
    };
    this.inProgressState.update((prev) => ({
      ...prev,
      [type]: data
    }));
  }

  clearInProgress(type: TestType): void {
    this.inProgressState.update((prev) => ({
      ...prev,
      [type]: null
    }));
  }

  normalizeLetter(letter: string | undefined): string {
    if (!letter) return '';
    return ['ا', 'أ', 'إ', 'آ'].includes(letter) ? 'أ' : letter;
  }

  getOptionLetter(option: string | undefined): string {
    if (!option) return '';
    return this.normalizeLetter(option.trim().charAt(0));
  }

  getCorrectLetter(questionId: number): string {
    return this.normalizeLetter(TEST_ANSWER_KEY[questionId] ?? '');
  }

  isAnswerCorrect(questionId: number, selectedOption: string | undefined): boolean {
    if (!selectedOption) return false;
    return this.getOptionLetter(selectedOption) === this.getCorrectLetter(questionId);
  }

  submitTest(
    type: TestType,
    answers: Record<number, string>,
    timeSpentSeconds: number
  ): TestResult {
    let correctCount = 0;
    const questions = TEST_QUESTIONS;

    questions.forEach((q) => {
      const selected = answers[q.id];
      if (this.isAnswerCorrect(q.id, selected)) {
        correctCount++;
      }
    });

    const result: TestResult = {
      completed: true,
      score: correctCount,
      totalQuestions: questions.length,
      correctCount,
      wrongCount: questions.length - correctCount,
      answers: { ...answers },
      completedAt: new Date().toISOString(),
      timeSpentSeconds
    };

    if (type === 'pre') {
      this.preTest.set(result);
    } else {
      this.postTest.set(result);
    }

    this.clearInProgress(type);
    return result;
  }

  resetTest(type: TestType): void {
    const emptyResult: TestResult = {
      ...DEFAULT_TEST_RESULT,
      answers: {}
    };

    if (type === 'pre') {
      this.preTest.set(emptyResult);
      // Resetting pre-test also locks and resets post-test to maintain integrity
      this.postTest.set({ ...DEFAULT_TEST_RESULT, answers: {} });
      this.clearInProgress('pre');
      this.clearInProgress('post');
    } else {
      this.postTest.set(emptyResult);
      this.clearInProgress('post');
    }
  }

  resetAllTests(): void {
    this.resetTest('pre');
  }
}
