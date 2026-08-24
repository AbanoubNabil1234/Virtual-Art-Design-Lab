import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestsService } from '../../core/services/tests.service';

@Component({
  selector: 'app-tests-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tests-hub.component.html',
  styles: [`
    .test-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .test-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.15);
    }
    .locked-card {
      filter: grayscale(0.2);
    }
    .locked-card:hover {
      transform: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .pulse-badge {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(1.03); }
    }
  `]
})
export class TestsHubComponent {
  readonly testsService = inject(TestsService);

  preResult = this.testsService.preTest;
  postResult = this.testsService.postTest;
  isPostUnlocked = this.testsService.isPostUnlocked;
  improvement = this.testsService.scoreImprovement;

  get preInProgress() {
    return this.testsService.getInProgress('pre');
  }

  get postInProgress() {
    return this.testsService.getInProgress('post');
  }

  formatTime(seconds: number | undefined): string {
    if (!seconds) return '0 دقيقة';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} ثانية`;
    return `${m} دقيقة و ${s} ثانية`;
  }

  getScorePercentage(score: number, total: number): number {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  }

  getPerformanceRating(score: number, total: number): { label: string; colorClass: string } {
    const pct = this.getScorePercentage(score, total);
    if (pct >= 90) return { label: 'ممتاز جداً 🌟', colorClass: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (pct >= 80) return { label: 'جيد جداً 👏', colorClass: 'text-blue-700 bg-blue-100 border-blue-300' };
    if (pct >= 65) return { label: 'جيد 👍', colorClass: 'text-amber-700 bg-amber-100 border-amber-300' };
    return { label: 'يحتاج لمزيد من المذاكرة 📖', colorClass: 'text-rose-700 bg-rose-100 border-rose-300' };
  }

  confirmReset(type: 'pre' | 'post'): void {
    const testName = type === 'pre' ? 'القبلي (وسيتم إعادة قفل الاختبار البعدي أيضاً)' : 'البعدي';
    if (confirm(`هل أنت متأكد من رغبتك في إعادة تعيين ${testName} والبدء من جديد؟`)) {
      this.testsService.resetTest(type);
    }
  }
}
