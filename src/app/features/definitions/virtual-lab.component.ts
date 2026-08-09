import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

type ActiveWindow = 'slides' | 'video';

@Component({
  selector: 'app-virtual-lab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="virtual-lab-page p-4 md:p-8 animate-fade-in-up">
      <div *ngIf="pageData">
        <h2 class="page-title">
          {{ pageData.title }}
        </h2>

        <p class="page-lead">
          {{ pageData.content }}
        </p>

        <div class="window-switcher" role="tablist" aria-label="اختيار نافذة العرض">
          <button
            type="button"
            class="switch-btn"
            data-sound="select"
            [class.active]="activeWindow() === 'slides'"
            (click)="setActiveWindow('slides')">
            <span class="material-icons">collections</span>
            نافذة الملف
          </button>

          <button
            type="button"
            class="switch-btn"
            data-sound="select"
            [class.active]="activeWindow() === 'video'"
            (click)="setActiveWindow('video')">
            <span class="material-icons">smart_display</span>
            نافذة الفيديو
          </button>
        </div>

        <section class="media-window" *ngIf="activeWindow() === 'slides'">
          <div class="window-topbar">
            <div class="window-meta">
              <span class="window-badge">ملف العرض</span>
              <span class="window-caption">Virtual_Design_Lab.pptx</span>
            </div>

            <div class="deck-controls">
              <button
                type="button"
                class="nav-btn primary"
                data-sound="next"
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages">
                التالي
              </button>

              <span class="page-indicator">
                صفحة {{ currentPage() }} من {{ totalPages }}
              </span>

              <button
                type="button"
                class="nav-btn"
                data-sound="prev"
                (click)="prevPage()"
                [disabled]="currentPage() === 1">
                السابق
              </button>
            </div>
          </div>

          <div class="viewer-frame">
            <button
              type="button"
              class="image-nav image-nav-right"
              data-sound="prev"
              (click)="prevPage()"
              [disabled]="currentPage() === 1"
              aria-label="الشريحة السابقة">
              <span class="material-icons">chevron_right</span>
            </button>

            <div class="slide-stage">
              <img
                class="slide-image"
                [src]="currentSlide()"
                [alt]="'شريحة رقم ' + currentPage()">
            </div>

            <button
              type="button"
              class="image-nav image-nav-left"
              data-sound="next"
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages"
              aria-label="الشريحة التالية">
              <span class="material-icons">chevron_left</span>
            </button>
          </div>

          <div class="thumbs-row">
            <button
              *ngFor="let slide of slides; let i = index"
              type="button"
              class="thumb-btn"
              data-sound="select"
              [class.active]="currentPage() === i + 1"
              (click)="goToPage(i + 1)">
              <img [src]="slide" [alt]="'مصغر الشريحة ' + (i + 1)">
              <span>{{ i + 1 }}</span>
            </button>
          </div>
        </section>

        <section class="media-window video-window" *ngIf="activeWindow() === 'video'">
          <div class="window-topbar">
            <div class="window-meta">
              <span class="window-badge video">فيديو</span>
              <span class="window-caption">virtual-lab-demo.mp4</span>
            </div>
          </div>

          <div class="video-frame">
            <video
              class="lesson-video"
              controls
              preload="metadata"
              poster="assets/virtual-lab-slides/image1.png">
              <source src="assets/virtual-lab-video/virtual-lab-demo.mp4" type="video/mp4">
              المتصفح لا يدعم تشغيل الفيديو.
            </video>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: clamp(1.4rem, 3vw, 1.9rem);
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 4px solid var(--color-primary, #6b4226);
      display: inline-block;
    }

    .page-lead {
      color: #555;
      font-size: clamp(1rem, 2.2vw, 1.1rem);
      line-height: 1.9;
      margin: 0 0 1.5rem;
      max-width: 56rem;
    }

    .window-switcher {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem;
      margin-bottom: 1rem;
      border: 1px solid #d7e2e8;
      background: #f7fbfd;
      box-shadow: 0 8px 20px rgba(31, 72, 90, 0.08);
    }

    .switch-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      min-height: 2.6rem;
      padding: 0.55rem 0.95rem;
      border: 1px solid transparent;
      background: transparent;
      color: #25465a;
      font-weight: 900;
    }

    .switch-btn .material-icons {
      font-size: 1.25rem;
    }

    .switch-btn.active {
      background: #16364a;
      color: #fff;
      box-shadow: 0 8px 18px rgba(22, 54, 74, 0.18);
    }

    .media-window {
      background: linear-gradient(180deg, #fffefc 0%, #f3f8fb 100%);
      border: 1px solid #d7e2e8;
      box-shadow: 0 14px 34px rgba(22, 54, 74, 0.12);
      overflow: hidden;
      animation: windowEnter 0.38s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .window-topbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.2rem;
      border-bottom: 1px solid #d7e2e8;
      background: rgba(255, 255, 255, 0.92);
    }

    .window-meta {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      flex-wrap: wrap;
    }

    .window-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem 0.75rem;
      background: rgba(22, 54, 74, 0.1);
      color: #16364a;
      font-weight: 900;
      font-size: 0.82rem;
    }

    .window-badge.video {
      background: rgba(7, 132, 170, 0.12);
      color: #0784aa;
    }

    .window-caption {
      color: #5e6c73;
      font-weight: 800;
      font-size: 0.95rem;
    }

    .deck-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .nav-btn {
      border: 1px solid #cbd9df;
      background: #fff;
      color: #25465a;
      padding: 0.62rem 1rem;
      font-weight: 900;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    }

    .nav-btn:hover:not(:disabled) {
      background: #edf7fb;
      border-color: #9ec7d8;
    }

    .nav-btn.primary {
      background: #16364a;
      border-color: #16364a;
      color: #fff;
    }

    .nav-btn.primary:hover:not(:disabled) {
      background: #0784aa;
      border-color: #0784aa;
    }

    .nav-btn:disabled,
    .image-nav:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .page-indicator {
      color: #25465a;
      font-weight: 900;
      font-size: 0.95rem;
    }

    .viewer-frame {
      position: relative;
      padding: 1rem;
      background:
        radial-gradient(circle at top left, rgba(0, 180, 216, 0.12), transparent 28%),
        linear-gradient(180deg, #f4fbfe 0%, #e8f2f7 100%);
    }

    .slide-stage {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
    }

    .slide-image {
      width: 100%;
      max-width: 1120px;
      background: #fff;
      box-shadow: 0 10px 28px rgba(22, 54, 74, 0.16);
      object-fit: contain;
    }

    .image-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3rem;
      height: 3rem;
      border: none;
      background: rgba(22, 54, 74, 0.94);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(22, 54, 74, 0.22);
      z-index: 2;
    }

    .image-nav-left {
      left: 1.25rem;
    }

    .image-nav-right {
      right: 1.25rem;
    }

    .thumbs-row {
      display: flex;
      gap: 0.85rem;
      overflow-x: auto;
      padding: 0.9rem 1rem 1.1rem;
      border-top: 1px solid #d7e2e8;
      background: rgba(255, 255, 255, 0.78);
    }

    .thumb-btn {
      min-width: 110px;
      border: 1px solid #cbd9df;
      background: #fff;
      padding: 0.45rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      align-items: center;
      color: #25465a;
      font-weight: 900;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .thumb-btn img {
      width: 100%;
      box-shadow: inset 0 0 0 1px #e5edf1;
    }

    .thumb-btn.active {
      border-color: #0784aa;
      box-shadow: 0 10px 22px rgba(7, 132, 170, 0.16);
      transform: translateY(-2px);
    }

    .video-window {
      background: #f7fbfd;
    }

    .video-frame {
      padding: 1rem;
      background:
        radial-gradient(circle at 12% 12%, rgba(0, 180, 216, 0.16), transparent 32%),
        linear-gradient(180deg, #eef8fc 0%, #e3edf3 100%);
    }

    .lesson-video {
      display: block;
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      background: #0d1f2b;
      box-shadow: 0 16px 34px rgba(22, 54, 74, 0.22);
      aspect-ratio: 16 / 9;
    }

    @keyframes windowEnter {
      from {
        opacity: 0;
        transform: translateY(0.7rem) scale(0.99);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .window-topbar {
        align-items: flex-start;
      }

      .deck-controls,
      .window-switcher {
        width: 100%;
        justify-content: space-between;
      }

      .switch-btn {
        flex: 1;
      }

      .viewer-frame,
      .video-frame {
        padding: 0.75rem;
      }

      .slide-stage {
        min-height: auto;
      }

      .image-nav {
        width: 2.5rem;
        height: 2.5rem;
      }

      .image-nav-left {
        left: 0.65rem;
      }

      .image-nav-right {
        right: 0.65rem;
      }

      .thumb-btn {
        min-width: 92px;
      }
    }
  `]
})
export class VirtualLabComponent {
  private readonly contentService = inject(ContentService);

  pageData = this.contentService.getPage('virtual-lab');
  activeWindow = signal<ActiveWindow>('slides');
  currentPage = signal(1);
  readonly slides = Array.from({ length: 14 }, (_, index) => `assets/virtual-lab-slides/image${index + 1}.png`);
  readonly totalPages = this.slides.length;

  currentSlide(): string {
    return this.slides[this.currentPage() - 1];
  }

  setActiveWindow(window: ActiveWindow): void {
    this.activeWindow.set(window);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update((page) => page + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }
}
