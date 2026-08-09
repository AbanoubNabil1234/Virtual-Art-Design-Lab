import { AfterViewInit, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModuleService } from '../../core/services/module.service';
import { ButtonSoundService } from '../../core/services/button-sound.service';
import type { ModuleSlideDeck } from '../../core/models/module.model';

type LessonWindow = 'slides' | 'video';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (module(); as mod) {
      <div class="lesson-page">
        <div class="lesson-hero" [class.opened]="opened()">
          <div class="lesson-copy">
            <span class="lesson-kicker">{{ mod.titleAr }}</span>
            <h1>{{ mod.titleAr }}</h1>
            <p>{{ mod.descriptionAr }}</p>
          </div>

          <div class="lesson-stat">
            @if (activeWindow() === 'video') {
              <span class="material-icons">movie</span>
              <small>فيديو الدرس</small>
            } @else {
              <span>{{ currentPage() }}</span>
              <small>من {{ totalSlides() }}</small>
            }
          </div>
        </div>

        @if (hasSlides() || hasVideo()) {
          <div class="lesson-window-switcher">
            @for (deck of slideDecks(); track deck.id) {
              <button
                type="button"
                class="window-switch"
                data-sound="select"
                [class.active]="isActiveDeck(deck.id)"
                (click)="setActiveDeck(deck.id)">
                <span class="material-icons">slideshow</span>
                <span class="window-switch-text">
                  <strong>{{ deck.titleAr }}</strong>
                  <small>{{ deck.subtitleAr }}</small>
                </span>
              </button>
            }

            @if (hasVideo()) {
              <button
                type="button"
                class="window-switch"
                data-sound="select"
                [class.active]="activeWindow() === 'video'"
                (click)="setActiveWindow('video')">
                <span class="material-icons">smart_display</span>
                <span class="window-switch-text">
                  <strong>فيديو الدرس</strong>
                  <small>{{ mod.videoName || 'فيديو تطبيقي' }}</small>
                </span>
              </button>
            }
          </div>
        }

        @if (hasSlides() && activeWindow() === 'slides') {
          @if (activeDeck(); as deck) {
            <section class="slide-player" [class.lesson-opened]="opened()">
              <div class="player-top">
                <div class="player-title">
                  <span class="material-icons">auto_awesome_motion</span>
                  <div>
                    <strong>{{ deck.fileName }}</strong>
                    <small>{{ deck.subtitleAr }}</small>
                  </div>
                </div>

                <div class="player-count">
                  <span>شريحة</span>
                  <strong>{{ currentPage() }}</strong>
                  <span class="player-count-total">/ {{ totalSlides() }}</span>
                </div>
              </div>

              <div class="progress-track">
                <span [style.width.%]="progressPercent()"></span>
              </div>

              <div class="stage-wrap">
                <button
                  type="button"
                  class="stage-nav stage-nav-right"
                  data-sound="prev"
                  (click)="prevSlide()"
                  [disabled]="safeIndex() === 0"
                  aria-label="الشريحة السابقة">
                  <span class="material-icons">chevron_right</span>
                </button>

                <div class="slide-stage" [class.stage-pulse]="animationFlip()">
                  @if (animationFlip()) {
                    <img
                      class="slide-image"
                      [class.enter-next]="slideDirection() === 'next'"
                      [class.enter-prev]="slideDirection() === 'prev'"
                      [src]="currentSlide()"
                      [alt]="'شريحة رقم ' + currentPage()">
                  } @else {
                    <img
                      class="slide-image"
                      [class.enter-next]="slideDirection() === 'next'"
                      [class.enter-prev]="slideDirection() === 'prev'"
                      [src]="currentSlide()"
                      [alt]="'شريحة رقم ' + currentPage()">
                  }
                </div>

                <button
                  type="button"
                  class="stage-nav stage-nav-left"
                  data-sound="next"
                  (click)="nextSlide()"
                  [disabled]="safeIndex() === totalSlides() - 1"
                  aria-label="الشريحة التالية">
                  <span class="material-icons">chevron_left</span>
                </button>
              </div>

              <div class="thumbs-strip">
                @for (slide of currentSlides(); track slide; let i = $index) {
                  <button
                    type="button"
                    class="thumb"
                    data-sound="select"
                    [class.active]="safeIndex() === i"
                    (click)="goToSlide(i)">
                    <img [src]="slide" [alt]="'مصغر شريحة ' + (i + 1)">
                    <span>{{ i + 1 }}</span>
                  </button>
                }
              </div>
            </section>
          }
        }

        @if (hasVideo() && activeWindow() === 'video') {
          <section class="slide-player video-player" [class.lesson-opened]="opened()">
            <div class="player-top">
              <div class="player-title">
                <span class="material-icons">movie</span>
                <div>
                  <strong>{{ mod.videoName || 'فيديو الدرس' }}</strong>
                  <small>فيديو تطبيقي داخل المعمل الافتراضي</small>
                </div>
              </div>

              <div class="player-count">
                <span>جاهز للتشغيل</span>
                <strong>
                  <span class="material-icons">play_arrow</span>
                </strong>
              </div>
            </div>

            <div class="video-stage">
              <video
                class="lesson-video"
                controls
                preload="metadata"
                [poster]="posterUrl()">
                <source [src]="mod.videoUrl" type="video/mp4">
                المتصفح لا يدعم تشغيل الفيديو.
              </video>
            </div>
          </section>
        }

        @if (!hasSlides() && !hasVideo()) {
          <div class="empty-lesson">
            لا توجد ملفات مرفقة بهذا الدرس.
          </div>
        }
      </div>
    } @else {
      <div class="empty-lesson">
        جاري التحميل...
      </div>
    }
  `,
  styles: [`
    .lesson-page {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .lesson-hero {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-height: 9rem;
      padding: 1.2rem;
      overflow: hidden;
      border: 1px solid #c7d7e3;
      background:
        linear-gradient(135deg, rgba(14, 55, 83, 0.92), rgba(7, 116, 142, 0.82)),
        radial-gradient(circle at 20% 20%, rgba(0, 209, 255, 0.35), transparent 34%);
      color: white;
      box-shadow: 0 18px 36px rgba(19, 65, 88, 0.22);
      animation: lessonHeroIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .lesson-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px),
        linear-gradient(0deg, rgba(255,255,255,0.11) 1px, transparent 1px);
      background-size: 42px 42px;
      opacity: 0.5;
      pointer-events: none;
    }

    .lesson-hero::after {
      content: '';
      position: absolute;
      inset: -40% -20%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent);
      transform: translateX(-70%) rotate(-10deg);
      animation: heroSweep 1.25s ease-out 0.15s both;
      pointer-events: none;
    }

    .lesson-copy,
    .lesson-stat {
      position: relative;
      z-index: 1;
    }

    .lesson-kicker {
      display: inline-flex;
      margin-bottom: 0.5rem;
      padding: 0.25rem 0.65rem;
      border: 1px solid rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.12);
      font-weight: 800;
      font-size: 0.78rem;
    }

    .lesson-copy h1 {
      margin: 0;
      font-size: 1.65rem;
      font-weight: 900;
      line-height: 1.35;
    }

    .lesson-copy p {
      max-width: 42rem;
      margin: 0.55rem 0 0;
      color: rgba(255,255,255,0.86);
      font-weight: 600;
      line-height: 1.8;
    }

    .lesson-stat {
      min-width: 5.6rem;
      text-align: center;
      padding: 0.8rem;
      border: 1px solid rgba(255,255,255,0.28);
      background: rgba(0,0,0,0.18);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
    }

    .lesson-stat span {
      display: block;
      font-size: 2rem;
      font-weight: 900;
      line-height: 1;
    }

    .lesson-stat small {
      display: block;
      margin-top: 0.3rem;
      color: rgba(255,255,255,0.78);
      font-weight: 800;
    }

    .lesson-window-switcher {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.35rem;
      border: 1px solid #d4e1e7;
      background:
        linear-gradient(120deg, rgba(255,255,255,0.96), rgba(237,244,247,0.88)),
        radial-gradient(circle at 15% 30%, rgba(255, 204, 77, 0.22), transparent 30%);
      box-shadow: 0 12px 28px rgba(28, 64, 82, 0.12);
      animation: playerOpen 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
    }

    .window-switch {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      min-width: 11rem;
      border: 1px solid #c7d7e3;
      padding: 0.7rem 0.9rem;
      color: #16364a;
      background: #fff;
      font-weight: 900;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.6);
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .window-switch:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(28, 64, 82, 0.14);
    }

    .window-switch.active {
      border-color: transparent;
      color: #fff;
      background: linear-gradient(145deg, #16364a, #0784aa);
      box-shadow: 0 14px 28px rgba(7, 132, 170, 0.22);
    }

    .window-switch .material-icons {
      font-size: 1.35rem;
    }

    .window-switch-text {
      display: grid;
      gap: 0.1rem;
      text-align: start;
    }

    .window-switch-text strong,
    .window-switch-text small {
      display: block;
    }

    .window-switch-text small {
      color: #647987;
      font-size: 0.72rem;
      font-weight: 800;
    }

    .window-switch.active .window-switch-text small {
      color: rgba(255,255,255,0.78);
    }

    .slide-player {
      overflow: hidden;
      border: 1px solid #d4e1e7;
      background:
        radial-gradient(circle at 8% 10%, rgba(0, 195, 255, 0.12), transparent 26%),
        linear-gradient(180deg, #f7fbfd 0%, #edf4f7 100%);
      box-shadow: 0 18px 42px rgba(28, 64, 82, 0.16);
      animation: playerOpen 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
    }

    .player-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.95rem 1rem;
      border-bottom: 1px solid #d7e4ea;
      background: rgba(255,255,255,0.9);
    }

    .player-title {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      color: #16364a;
    }

    .player-title .material-icons {
      color: #0784aa;
      font-size: 1.9rem;
    }

    .player-title strong,
    .player-title small {
      display: block;
    }

    .player-title small {
      color: #647987;
      font-weight: 700;
      margin-top: 0.1rem;
    }

    .player-count {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: #16364a;
      font-weight: 800;
      white-space: nowrap;
    }

    .player-count strong {
      min-width: 2.3rem;
      height: 2.3rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #16364a;
      color: #fff;
      border-radius: 0.55rem;
      transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease;
    }

    .player-count-total {
      color: #647987;
      font-weight: 800;
    }

    .player-count strong .material-icons {
      font-size: 1.55rem;
    }

    .progress-track {
      height: 0.42rem;
      background: #dce8ee;
      overflow: hidden;
    }

    .progress-track span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #00b4d8, #ff3d9a, #ffcc4d);
      transition: width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .stage-wrap {
      position: relative;
      padding: 1.1rem;
    }

    .slide-stage {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 55vh;
      perspective: 1400px;
    }

    .slide-stage::before {
      content: '';
      position: absolute;
      inset: 7% 5%;
      background: radial-gradient(circle, rgba(0, 137, 184, 0.16), transparent 64%);
      filter: blur(18px);
      opacity: 0.85;
      pointer-events: none;
    }

    .slide-image {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1160px;
      aspect-ratio: 16 / 9;
      object-fit: contain;
      background: #fff;
      box-shadow:
        0 22px 48px rgba(22, 54, 74, 0.24),
        0 0 0 1px rgba(18, 64, 92, 0.12);
      transform-origin: center;
    }

    .slide-image.enter-next {
      animation: slideInNext 0.62s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .slide-image.enter-prev {
      animation: slideInPrev 0.62s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .stage-nav {
      position: absolute;
      top: 50%;
      z-index: 3;
      width: 3.2rem;
      height: 3.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      color: #fff;
      background: linear-gradient(145deg, #16364a, #0784aa);
      box-shadow: 0 14px 28px rgba(15, 68, 92, 0.25);
      transform: translateY(-50%);
    }

    .stage-nav:not(:disabled):hover {
      filter: brightness(1.08);
    }

    .stage-nav:disabled {
      opacity: 0.36;
      cursor: not-allowed;
    }

    .stage-nav .material-icons {
      font-size: 2rem;
    }

    .stage-nav-right {
      right: 1.4rem;
    }

    .stage-nav-left {
      left: 1.4rem;
    }

    .thumbs-strip {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding: 0.9rem 1rem 1.1rem;
      border-top: 1px solid #d7e4ea;
      background: rgba(255,255,255,0.76);
    }

    .thumb {
      min-width: 8rem;
      padding: 0.35rem;
      border: 2px solid transparent;
      background: #fff;
      color: #16364a;
      font-weight: 900;
      box-shadow: 0 6px 16px rgba(28, 64, 82, 0.08);
    }

    .thumb img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      display: block;
    }

    .thumb span {
      display: block;
      padding-top: 0.25rem;
      font-size: 0.8rem;
    }

    .thumb.active {
      border-color: #0784aa;
      box-shadow: 0 10px 24px rgba(7, 132, 170, 0.22);
      transform: translateY(-2px);
    }

    .video-player {
      background:
        radial-gradient(circle at 80% 8%, rgba(255, 61, 154, 0.12), transparent 28%),
        linear-gradient(180deg, #fdfbf7 0%, #edf4f7 100%);
    }

    .video-stage {
      position: relative;
      padding: 1.15rem;
      background:
        linear-gradient(135deg, rgba(22, 54, 74, 0.08), transparent),
        radial-gradient(circle at center, rgba(7, 132, 170, 0.14), transparent 62%);
    }

    .video-stage::before {
      content: '';
      position: absolute;
      inset: 1.15rem;
      border: 1px solid rgba(255,255,255,0.65);
      pointer-events: none;
      box-shadow: inset 0 0 24px rgba(255,255,255,0.5);
    }

    .lesson-video {
      position: relative;
      z-index: 1;
      display: block;
      width: 100%;
      max-width: 1160px;
      margin: 0 auto;
      aspect-ratio: 16 / 9;
      object-fit: contain;
      background: #0c1720;
      box-shadow:
        0 22px 48px rgba(22, 54, 74, 0.24),
        0 0 0 1px rgba(18, 64, 92, 0.12);
      animation: videoReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .empty-lesson {
      text-align: center;
      padding: 4rem 0;
      color: #647987;
      font-weight: 800;
    }

    @keyframes lessonHeroIn {
      from {
        opacity: 0;
        transform: translateY(1rem) scale(0.98);
        clip-path: inset(0 50% 0 50%);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        clip-path: inset(0 0 0 0);
      }
    }

    @keyframes heroSweep {
      from {
        transform: translateX(-70%) rotate(-10deg);
      }
      to {
        transform: translateX(70%) rotate(-10deg);
      }
    }

    @keyframes playerOpen {
      from {
        opacity: 0;
        transform: translateY(1.2rem) scale(0.96);
        filter: blur(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes slideInNext {
      from {
        opacity: 0;
        transform: translateX(-4rem) rotateY(12deg) scale(0.96);
        filter: blur(6px);
      }
      to {
        opacity: 1;
        transform: translateX(0) rotateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes slideInPrev {
      from {
        opacity: 0;
        transform: translateX(4rem) rotateY(-12deg) scale(0.96);
        filter: blur(6px);
      }
      to {
        opacity: 1;
        transform: translateX(0) rotateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes videoReveal {
      from {
        opacity: 0;
        transform: translateY(1rem) scale(0.985);
        filter: saturate(0.65) blur(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: saturate(1) blur(0);
      }
    }

    @media (max-width: 768px) {
      .lesson-hero,
      .player-top {
        align-items: flex-start;
        flex-direction: column;
      }

      .lesson-copy h1 {
        font-size: 1.25rem;
      }

      .lesson-window-switcher {
        flex-direction: column;
      }

      .window-switch {
        width: 100%;
      }

      .stage-wrap,
      .video-stage {
        padding: 0.8rem;
      }

      .video-stage::before {
        inset: 0.8rem;
      }

      .slide-stage {
        min-height: auto;
      }

      .stage-nav {
        width: 2.65rem;
        height: 2.65rem;
      }

      .stage-nav-right {
        right: 0.65rem;
      }

      .stage-nav-left {
        left: 0.65rem;
      }

      .thumb {
        min-width: 6.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .lesson-hero,
      .lesson-hero::after,
      .lesson-window-switcher,
      .slide-player,
      .slide-image.enter-next,
      .slide-image.enter-prev,
      .lesson-video {
        animation: none;
      }
    }
  `]
})
export class ModulePageComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly moduleService = inject(ModuleService);
  private readonly buttonSound = inject(ButtonSoundService);

  private readonly paramId = toSignal(this.route.paramMap);

  currentIndex = signal(0);
  slideDirection = signal<'next' | 'prev'>('next');
  animationFlip = signal(true);
  opened = signal(false);
  activeWindow = signal<LessonWindow>('slides');
  activeDeckId = signal<string | null>(null);

  module = computed(() => {
    const id = this.paramId()?.get('id');
    return id ? this.moduleService.getModuleById(id) : undefined;
  });

  slideDecks = computed<ModuleSlideDeck[]>(() => {
    const module = this.module();
    if (!module) return [];
    if (module.slideDecks?.length) return module.slideDecks;
    if (!module.slides?.length) return [];

    return [
      {
        id: 'main',
        titleAr: 'ملف الدرس',
        subtitleAr: 'عرض تفاعلي للدرس',
        fileName: module.titleEn === 'Blueprint to Canvas' ? 'Blueprint_to_Canvas.pptx' : 'ملف الدرس',
        slides: module.slides
      }
    ];
  });

  activeDeck = computed(() => {
    const decks = this.slideDecks();
    const selectedDeckId = this.activeDeckId();
    return decks.find((deck) => deck.id === selectedDeckId) ?? decks[0];
  });

  currentSlides = computed(() => this.activeDeck()?.slides ?? []);
  hasSlides = computed(() => this.slideDecks().some((deck) => deck.slides.length > 0));
  hasVideo = computed(() => Boolean(this.module()?.videoUrl));
  totalSlides = computed(() => this.currentSlides().length);
  safeIndex = computed(() => {
    const total = this.totalSlides();
    if (!total) return 0;
    return Math.min(this.currentIndex(), total - 1);
  });
  currentPage = computed(() => this.totalSlides() ? this.safeIndex() + 1 : 0);
  progressPercent = computed(() => {
    const total = this.totalSlides();
    return total ? ((this.safeIndex() + 1) / total) * 100 : 0;
  });
  posterUrl = computed(() => this.module()?.posterUrl ?? this.slideDecks()[0]?.slides[0] ?? '');

  private readonly resetOnModuleChange = effect(() => {
    this.paramId()?.get('id');
    this.currentIndex.set(0);
    this.activeDeckId.set(null);
    this.activeWindow.set('slides');
  }, { allowSignalWrites: true });

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.hasSlides() && this.hasVideo()) {
        this.activeWindow.set('video');
      }

      this.opened.set(true);
      this.buttonSound.play('lessonOpen');
    }, 120);
  }

  currentSlide(): string {
    return this.currentSlides()[this.safeIndex()] ?? '';
  }

  isActiveDeck(deckId: string): boolean {
    return this.activeWindow() === 'slides' && this.activeDeck()?.id === deckId;
  }

  setActiveDeck(deckId: string): void {
    this.activeDeckId.set(deckId);
    this.activeWindow.set('slides');
    this.currentIndex.set(0);
    this.animationFlip.update((value) => !value);
  }

  setActiveWindow(windowName: LessonWindow): void {
    this.activeWindow.set(windowName);
  }

  nextSlide(): void {
    if (this.safeIndex() >= this.totalSlides() - 1) return;
    this.slideDirection.set('next');
    this.currentIndex.set(this.safeIndex() + 1);
    this.animationFlip.update((value) => !value);
  }

  prevSlide(): void {
    if (this.safeIndex() <= 0) return;
    this.slideDirection.set('prev');
    this.currentIndex.set(this.safeIndex() - 1);
    this.animationFlip.update((value) => !value);
  }

  goToSlide(index: number): void {
    const total = this.totalSlides();
    const nextIndex = Math.max(0, Math.min(index, total - 1));
    if (nextIndex === this.safeIndex()) return;
    this.slideDirection.set(nextIndex > this.safeIndex() ? 'next' : 'prev');
    this.currentIndex.set(nextIndex);
    this.animationFlip.update((value) => !value);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.activeWindow() !== 'slides') return;

    if (event.key === 'ArrowLeft') {
      this.nextSlide();
    }
    if (event.key === 'ArrowRight') {
      this.prevSlide();
    }
  }
}
