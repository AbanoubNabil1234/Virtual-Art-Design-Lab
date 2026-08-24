import { AfterViewInit, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModuleService } from '../../core/services/module.service';
import { QuestionBankService, Question } from '../../core/services/question-bank.service';
import { ButtonSoundService } from '../../core/services/button-sound.service';
import type { ModuleSlideDeck } from '../../core/models/module.model';

type LessonWindow = 'slides' | 'video';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (module(); as mod) {
      <div class="lesson-page">

        <!-- LOCKED LESSON OVERLAY (IF ACCESSING A LOCKED MODULE) -->
        @if (!isUnlocked()) {
          <div class="max-w-2xl mx-auto my-12 p-8 bg-white border-2 border-amber-400 rounded-3xl shadow-xl text-center animate-scale-in">
            <span class="material-icons text-7xl text-amber-600 mb-3">lock</span>
            <h2 class="text-2xl font-black text-gray-900 mb-2">هذا الدرس مغلق حالياً 🔒</h2>
            <p class="text-base text-gray-600 mb-6 leading-relaxed">
              {{ moduleService.getModuleLockReason(mod.id) }}
            </p>

            <div class="flex flex-wrap justify-center gap-3">
              <a routerLink="/" class="btn-primary bg-amber-800 hover:bg-amber-900 px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                <span class="material-icons text-base">home</span>
                الرئيسية
              </a>
            </div>
          </div>
        } @else {

          <!-- UNLOCKED NEXT MODULE TOAST BANNER -->
          @if (unlockedToastMessage()) {
            <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-emerald-300 font-bold text-sm md:text-base flex items-center gap-3 animate-bounce">
              <span class="material-icons text-2xl text-emerald-200">lock_open</span>
              <span>{{ unlockedToastMessage() }}</span>
              <button (click)="unlockedToastMessage.set(null)" class="text-xs bg-emerald-800 hover:bg-emerald-900 px-2 py-1 rounded-lg">✕</button>
            </div>
          }

          <!-- LESSON HERO -->
          <div class="lesson-hero" [class.opened]="opened()">
            <div class="lesson-copy">
              <span class="lesson-kicker">{{ mod.titleAr }}</span>
              <h1>{{ mod.titleAr }}</h1>
              <p>{{ mod.descriptionAr }}</p>

              @if (moduleProgress(); as prog) {
                <div class="mt-3 inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full border border-emerald-300">
                  <span class="material-icons text-base text-emerald-700">check_circle</span>
                  <span>تم اجتياز الاختبار (النتيجة: {{ prog.score }} / {{ prog.totalQuestions }})</span>
                </div>
              }
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

          <!-- WINDOW SWITCHER (SLIDES / VIDEO) -->
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

          <!-- SLIDE PLAYER -->
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

                  <div class="stage-viewport" (click)="nextSlide()">
                    <img [src]="activeSlideUrl()" [alt]="mod.titleAr" class="stage-image" />
                  </div>

                  <button
                    type="button"
                    class="stage-nav stage-nav-left"
                    data-sound="next"
                    (click)="nextSlide()"
                    [disabled]="safeIndex() >= totalSlides() - 1"
                    aria-label="الشريحة التالية">
                    <span class="material-icons">chevron_left</span>
                  </button>
                </div>

                <div class="player-controls">
                  <button
                    type="button"
                    class="btn-control"
                    data-sound="prev"
                    (click)="prevSlide()"
                    [disabled]="safeIndex() === 0">
                    <span class="material-icons">arrow_forward</span>
                    السابقة
                  </button>

                  <!-- THE ONE SINGLE QUIZ BUTTON -->
                  <button
                    type="button"
                    class="btn-quiz-single"
                    data-sound="click"
                    (click)="openQuizModal()">
                    <span class="material-icons text-base">quiz</span>
                    <span>{{ moduleProgress()?.completed ? 'عرض نتيجة وإجابات الاختبار 📝' : 'دخول اختبار وتقويم الدرس 📝' }}</span>
                  </button>

                  <button
                    type="button"
                    class="btn-control primary"
                    data-sound="next"
                    (click)="nextSlide()"
                    [disabled]="safeIndex() >= totalSlides() - 1">
                    التالية
                    <span class="material-icons">arrow_back</span>
                  </button>
                </div>
              </section>
            }
          }

          <!-- VIDEO PLAYER -->
          @if (hasVideo() && activeWindow() === 'video') {
            <section class="video-player-wrap border-2 border-amber-900/20 rounded-3xl p-4 bg-white shadow-md my-6 text-center">
              <h3 class="text-lg font-bold text-gray-900 mb-3 text-right flex items-center gap-2">
                <span class="material-icons text-amber-700">smart_display</span>
                {{ mod.videoName || 'فيديو شرح وتطبيق الدرس' }}
              </h3>
              <video [src]="mod.videoUrl" controls [poster]="mod.posterUrl" class="w-full rounded-2xl shadow-sm max-h-[500px] mb-4">
                متصفحك لا يدعم تشغيل الفيديو.
              </video>

              <!-- THE ONE SINGLE QUIZ BUTTON UNDER VIDEO -->
              <button
                type="button"
                class="btn-quiz-single"
                data-sound="click"
                (click)="openQuizModal()">
                <span class="material-icons text-base">quiz</span>
                <span>{{ moduleProgress()?.completed ? 'عرض نتيجة وإجابات الاختبار 📝' : 'دخول اختبار وتقويم الدرس 📝' }}</span>
              </button>
            </section>
          }

          <!-- DEDICATED QUIZ MODAL / DIALOG (يفتح عند الضغط على الزر الوحيد) -->
          @if (showQuizModal()) {
            <div class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fade-in">
              
              <div class="bg-white border-2 border-amber-900/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl text-right relative my-auto">
                
                <!-- Close Button -->
                <button
                  type="button"
                  (click)="closeQuizModal()"
                  class="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-base transition-colors z-10">
                  ✕
                </button>

                <!-- Modal Header -->
                <div class="border-b border-gray-200 pb-4 mb-6">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-200 mb-2">
                    <span class="material-icons text-sm">quiz</span>
                    بنك أسئلة الدرس
                  </div>
                  <h2 class="text-2xl font-black text-gray-900 m-0">اختبار وتقويم الدرس: {{ mod.titleAr }}</h2>
                  <p class="text-xs text-gray-500 m-0 mt-1">أجب على جميع الأسئلة ثم اضغط تسليم الاختبار لفتح الدرس التالي</p>

                  @if (isQuizSubmitted()) {
                    <div class="mt-3 bg-emerald-50 border-2 border-emerald-300 px-4 py-2 rounded-xl inline-flex items-center gap-3">
                      <span class="text-xs text-emerald-800 font-bold">النتيجة النهائية:</span>
                      <span class="text-xl font-black text-emerald-700">{{ quizScore() }} / {{ lessonQuestions().length }}</span>
                    </div>
                  }
                </div>

                <!-- QUESTIONS LIST -->
                <div class="space-y-6">
                  @for (q of lessonQuestions(); track q.id; let i = $index) {
                    <div class="question-card border-2 rounded-2xl p-5 transition-all"
                         [class.border-gray-200]="!isQuizSubmitted()"
                         [class.border-emerald-300]="isQuizSubmitted() && isAnswerCorrect(q)"
                         [class.border-red-300]="isQuizSubmitted() && !isAnswerCorrect(q)">
                      
                      <div class="flex justify-between items-center mb-3">
                        <span class="px-3 py-1 bg-amber-900 text-white font-bold text-xs rounded-lg">
                          السؤال {{ i + 1 }} من {{ lessonQuestions().length }}
                        </span>

                        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full"
                              [class.bg-amber-100]="q.type === 'mcq'"
                              [class.text-amber-800]="q.type === 'mcq'"
                              [class.bg-blue-100]="q.type === 'true-false'"
                              [class.text-blue-800]="q.type === 'true-false'">
                          {{ q.type === 'mcq' ? 'اختيار من متعدد' : 'صواب / خطأ' }}
                        </span>
                      </div>

                      <p class="text-base font-bold text-gray-900 leading-relaxed mb-4">{{ q.text }}</p>

                      <!-- OPTIONS -->
                      <div class="options-grid space-y-2">
                        @if (q.type === 'mcq') {
                          @for (opt of q.options; track opt) {
                            <button
                              type="button"
                              class="option-btn text-right w-full p-3.5 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-between"
                              [class.border-amber-700]="userAnswers[q.id] === opt && !isQuizSubmitted()"
                              [class.bg-amber-50]="userAnswers[q.id] === opt && !isQuizSubmitted()"
                              [class.border-emerald-600]="isQuizSubmitted() && opt === q.correctAnswer"
                              [class.bg-emerald-50]="isQuizSubmitted() && opt === q.correctAnswer"
                              [class.text-emerald-900]="isQuizSubmitted() && opt === q.correctAnswer"
                              [class.border-red-500]="isQuizSubmitted() && userAnswers[q.id] === opt && opt !== q.correctAnswer"
                              [class.bg-red-50]="isQuizSubmitted() && userAnswers[q.id] === opt && opt !== q.correctAnswer"
                              [disabled]="isQuizSubmitted()"
                              (click)="selectAnswer(q.id, opt)">
                              <span>{{ opt }}</span>
                              @if (isQuizSubmitted() && opt === q.correctAnswer) {
                                <span class="material-icons text-emerald-600 text-lg">check_circle</span>
                              }
                              @if (isQuizSubmitted() && userAnswers[q.id] === opt && opt !== q.correctAnswer) {
                                <span class="material-icons text-red-500 text-lg">cancel</span>
                              }
                            </button>
                          }
                        } @else if (q.type === 'true-false') {
                          <div class="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              class="option-btn p-3.5 rounded-xl border-2 font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
                              [class.border-amber-700]="userAnswers[q.id] === true && !isQuizSubmitted()"
                              [class.bg-amber-50]="userAnswers[q.id] === true && !isQuizSubmitted()"
                              [class.border-emerald-600]="isQuizSubmitted() && q.correctAnswer === true"
                              [class.bg-emerald-50]="isQuizSubmitted() && q.correctAnswer === true"
                              [class.text-emerald-900]="isQuizSubmitted() && q.correctAnswer === true"
                              [class.border-red-500]="isQuizSubmitted() && userAnswers[q.id] === true && q.correctAnswer !== true"
                              [class.bg-red-50]="isQuizSubmitted() && userAnswers[q.id] === true && q.correctAnswer !== true"
                              [disabled]="isQuizSubmitted()"
                              (click)="selectAnswer(q.id, true)">
                              <span>صواب (صح)</span>
                              @if (isQuizSubmitted() && q.correctAnswer === true) {
                                <span class="material-icons text-emerald-600 text-base">check_circle</span>
                              }
                            </button>

                            <button
                              type="button"
                              class="option-btn p-3.5 rounded-xl border-2 font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
                              [class.border-amber-700]="userAnswers[q.id] === false && !isQuizSubmitted()"
                              [class.bg-amber-50]="userAnswers[q.id] === false && !isQuizSubmitted()"
                              [class.border-emerald-600]="isQuizSubmitted() && q.correctAnswer === false"
                              [class.bg-emerald-50]="isQuizSubmitted() && q.correctAnswer === false"
                              [class.text-emerald-900]="isQuizSubmitted() && q.correctAnswer === false"
                              [class.border-red-500]="isQuizSubmitted() && userAnswers[q.id] === false && q.correctAnswer !== false"
                              [class.bg-red-50]="isQuizSubmitted() && userAnswers[q.id] === false && q.correctAnswer !== false"
                              [disabled]="isQuizSubmitted()"
                              (click)="selectAnswer(q.id, false)">
                              <span>خطأ (خطأ)</span>
                              @if (isQuizSubmitted() && q.correctAnswer === false) {
                                <span class="material-icons text-emerald-600 text-base">check_circle</span>
                              }
                            </button>
                          </div>
                        }
                      </div>

                      <!-- EXPLANATION FEEDBACK -->
                      @if (isQuizSubmitted() && q.explanation) {
                        <div class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold flex items-start gap-2">
                          <span class="material-icons text-base text-amber-700 flex-shrink-0">lightbulb</span>
                          <div>
                            <span class="block mb-0.5 text-amber-950 font-black">الشرح والتفسير العلمي:</span>
                            <span>{{ q.explanation }}</span>
                          </div>
                        </div>
                      }

                    </div>
                  }
                </div>

                <!-- MODAL ACTIONS -->
                <div class="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  @if (!isQuizSubmitted()) {
                    <button
                      type="button"
                      class="btn-primary bg-amber-900 hover:bg-amber-950 px-8 py-3 text-base font-black shadow-lg"
                      data-sound="submit"
                      (click)="submitQuiz(mod.id)">
                      تسليم اختبار الدرس وتأكيد الإنجاز 📝
                    </button>
                  } @else {
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm border border-gray-300"
                        (click)="resetQuiz()">
                        إعادة محاولة الاختبار
                      </button>
                    </div>

                    @if (nextModule(); as nextMod) {
                      <button
                        type="button"
                        class="btn-primary bg-emerald-700 hover:bg-emerald-800 px-8 py-3 text-base font-black shadow-lg flex items-center gap-2 animate-pulse"
                        (click)="navigateToNextModule(nextMod.id)">
                        <span>الانتقال إلى {{ nextMod.titleAr }} 🚀</span>
                        <span class="material-icons text-lg">arrow_back</span>
                      </button>
                    } @else {
                      <a routerLink="/question-bank" (click)="closeQuizModal()" class="btn-primary bg-emerald-700 hover:bg-emerald-800 px-8 py-3 text-base font-black shadow-lg">
                        تهانينا! أكملت جميع الدروس — الذهاب لبنك الأسئلة 🏆
                      </a>
                    }
                  }
                </div>

              </div>
            </div>
          }

        }
      </div>
    }
  `,
  styles: [`
    .lesson-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .lesson-hero {
      background: linear-gradient(135deg, #4a2c11 0%, #2b180a 100%);
      color: white;
      padding: 2.5rem;
      border-radius: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      text-align: right;
    }
    .lesson-hero.opened {
      border-right: 6px solid #27ae60;
    }
    .lesson-kicker {
      display: inline-block;
      font-size: 0.85rem;
      font-weight: 700;
      color: #f1c40f;
      margin-bottom: 0.5rem;
    }
    .lesson-hero h1 {
      font-size: 1.8rem;
      font-weight: 900;
      margin: 0 0 0.5rem 0;
    }
    .lesson-hero p {
      font-size: 0.95rem;
      color: #d0c0b0;
      margin: 0;
      max-width: 700px;
    }
    .lesson-stat {
      background: rgba(255,255,255,0.1);
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      text-align: center;
      backdrop-filter: blur(5px);
    }
    .lesson-stat span {
      display: block;
      font-size: 1.8rem;
      font-weight: 900;
      color: #f1c40f;
    }
    .lesson-stat small {
      font-size: 0.75rem;
      color: #ccc;
    }
    .lesson-window-switcher {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    .window-switch {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 1rem;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: right;
      flex-shrink: 0;
    }
    .window-switch:hover {
      border-color: #6b4226;
      background: #fdfbf7;
    }
    .window-switch.active {
      border-color: #6b4226;
      background: #6b4226;
      color: white;
    }
    .window-switch.active small {
      color: #e0d0c0;
    }
    .window-switch-text {
      display: flex;
      flex-direction: column;
    }
    .window-switch-text strong {
      font-size: 0.9rem;
    }
    .window-switch-text small {
      font-size: 0.75rem;
      color: #666;
    }
    .slide-player {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      overflow: hidden;
      border: 1px solid #eaeaea;
    }
    .player-top {
      padding: 1.25rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafafa;
      border-bottom: 1px solid #eee;
    }
    .player-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-align: right;
    }
    .player-title .material-icons {
      color: #6b4226;
    }
    .player-title strong {
      display: block;
      font-size: 0.95rem;
    }
    .player-title small {
      color: #777;
      font-size: 0.8rem;
    }
    .player-count {
      font-size: 0.9rem;
      color: #555;
    }
    .player-count strong {
      font-size: 1.2rem;
      color: #6b4226;
      margin: 0 0.2rem;
    }
    .progress-track {
      height: 4px;
      background: #eee;
      width: 100%;
    }
    .progress-track span {
      display: block;
      height: 100%;
      background: #6b4226;
      transition: width 0.3s ease;
    }
    .stage-wrap {
      position: relative;
      background: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 450px;
    }
    .stage-viewport {
      width: 100%;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
    .stage-image {
      max-width: 100%;
      max-height: 650px;
      object-fit: contain;
    }
    .stage-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 10;
    }
    .stage-nav:hover:not(:disabled) {
      background: rgba(107, 66, 38, 0.9);
      scale: 1.1;
    }
    .stage-nav:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    .stage-nav-right { right: 1.5rem; }
    .stage-nav-left { left: 1.5rem; }
    .player-controls {
      padding: 1.25rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      background: #fafafa;
      border-top: 1px solid #eee;
    }
    .btn-control {
      background: white;
      border: 1px solid #ccc;
      border-radius: 0.75rem;
      padding: 0.6rem 1.25rem;
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-control:hover:not(:disabled) {
      background: #eee;
    }
    .btn-control.primary {
      background: #6b4226;
      color: white;
      border-color: #6b4226;
    }
    .btn-control.primary:hover:not(:disabled) {
      background: #52321c;
    }
    .btn-control:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-quiz-single {
      background: #d97706;
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 0.65rem 1.4rem;
      font-weight: 900;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
      transition: all 0.2s ease;
    }
    .btn-quiz-single:hover {
      background: #b45309;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(180, 83, 9, 0.4);
    }
  `]
})
export class ModulePageComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly moduleService = inject(ModuleService);
  private questionBankService = inject(QuestionBankService);
  private buttonSound = inject(ButtonSoundService);

  private routeParam = toSignal(this.route.paramMap);

  opened = signal(false);
  activeWindow = signal<LessonWindow>('slides');
  activeDeckId = signal<string>('part-1');

  slideIndex = signal(0);

  // Modal Quiz state for current lesson
  showQuizModal = signal(false);
  userAnswers: Record<number, string | boolean> = {};
  isQuizSubmitted = signal(false);
  quizScore = signal(0);
  unlockedToastMessage = signal<string | null>(null);

  module = computed(() => {
    const params = this.routeParam();
    const id = params?.get('id') || 'blueprint-to-canvas';
    return this.moduleService.getModuleById(id);
  });

  isUnlocked = computed(() => {
    const mod = this.module();
    if (!mod) return true;
    return this.moduleService.isModuleUnlocked(mod.id);
  });

  moduleProgress = computed(() => {
    const mod = this.module();
    if (!mod) return null;
    return this.moduleService.getModuleProgress(mod.id);
  });

  lessonQuestions = computed<Question[]>(() => {
    const mod = this.module();
    if (!mod) return [];
    const cat = this.moduleService.getCategoryForModule(mod.id);
    return this.questionBankService.getQuestionsByCategory(cat);
  });

  nextModule = computed(() => {
    const mod = this.module();
    if (!mod) return null;
    return this.moduleService.getNextModule(mod.id);
  });

  slideDecks = computed<ModuleSlideDeck[]>(() => {
    const m = this.module();
    if (!m) return [];

    if (m.slideDecks && m.slideDecks.length > 0) {
      return m.slideDecks;
    }

    if (m.slides && m.slides.length > 0) {
      return [
        {
          id: 'default',
          titleAr: 'العرض التقديمي للدرس',
          subtitleAr: m.descriptionAr || '',
          fileName: m.titleAr,
          slides: m.slides
        }
      ];
    }

    return [];
  });

  activeDeck = computed<ModuleSlideDeck | undefined>(() => {
    const decks = this.slideDecks();
    if (decks.length === 0) return undefined;
    const match = decks.find((d) => d.id === this.activeDeckId());
    return match || decks[0];
  });

  hasSlides = computed(() => this.slideDecks().length > 0);
  hasVideo = computed(() => !!this.module()?.videoUrl);

  totalSlides = computed(() => this.activeDeck()?.slides.length || 0);

  safeIndex = computed(() => {
    const total = this.totalSlides();
    if (total === 0) return 0;
    const current = this.slideIndex();
    return Math.min(Math.max(current, 0), total - 1);
  });

  currentPage = computed(() => (this.totalSlides() > 0 ? this.safeIndex() + 1 : 0));

  progressPercent = computed(() => {
    const total = this.totalSlides();
    if (total <= 1) return 100;
    return (this.safeIndex() / (total - 1)) * 100;
  });

  activeSlideUrl = computed(() => {
    const deck = this.activeDeck();
    if (!deck || deck.slides.length === 0) return '';
    return deck.slides[this.safeIndex()] || '';
  });

  constructor() {
    effect(
      () => {
        const decks = this.slideDecks();
        if (decks.length > 0 && !decks.some((d) => d.id === this.activeDeckId())) {
          this.activeDeckId.set(decks[0].id);
        }
      },
      { allowSignalWrites: true }
    );

    // Reset quiz modal when route/module changes
    effect(
      () => {
        const mod = this.module();
        if (mod) {
          this.slideIndex.set(0);
          this.showQuizModal.set(false);
          this.userAnswers = {};
          this.isQuizSubmitted.set(false);
          this.quizScore.set(0);

          // Restore saved quiz result if already completed
          const prog = this.moduleService.getModuleProgress(mod.id);
          if (prog && prog.completed) {
            this.isQuizSubmitted.set(true);
            this.quizScore.set(prog.score);
          }
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => this.opened.set(true), 150);
  }

  setActiveWindow(window: LessonWindow) {
    this.activeWindow.set(window);
  }

  setActiveDeck(deckId: string) {
    this.activeDeckId.set(deckId);
    this.activeWindow.set('slides');
    this.slideIndex.set(0);
  }

  isActiveDeck(deckId: string): boolean {
    return this.activeWindow() === 'slides' && this.activeDeckId() === deckId;
  }

  nextSlide() {
    if (this.safeIndex() < this.totalSlides() - 1) {
      this.slideIndex.update((i) => i + 1);
    }
  }

  prevSlide() {
    if (this.safeIndex() > 0) {
      this.slideIndex.update((i) => i - 1);
    }
  }

  openQuizModal(): void {
    this.buttonSound.play('start');
    this.showQuizModal.set(true);
  }

  closeQuizModal(): void {
    this.buttonSound.play('back');
    this.showQuizModal.set(false);
  }

  selectAnswer(questionId: number, answer: string | boolean): void {
    if (this.isQuizSubmitted()) return;
    this.userAnswers[questionId] = answer;
  }

  isAnswerCorrect(q: Question): boolean {
    return this.userAnswers[q.id] === q.correctAnswer;
  }

  submitQuiz(moduleId: string): void {
    const questions = this.lessonQuestions();
    if (questions.length === 0) return;

    // Check if all questions answered
    const unanswered = questions.filter((q) => this.userAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(`⚠️ عذراً، يرجى الإجابة على جميع أسئلة الدرس الـ (${questions.length}) قبل التسليم!\n\nيتبقى لديك ${unanswered.length} سؤال بدون إجابة.`);
      return;
    }

    // Calculate score
    let score = 0;
    for (const q of questions) {
      if (this.userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    }

    this.quizScore.set(score);
    this.isQuizSubmitted.set(true);
    this.buttonSound.play('success');

    // Save completion and unlock next module
    const res = this.moduleService.setModuleCompleted(moduleId, score, questions.length);

    if (res.unlockedNext && res.nextModule) {
      this.unlockedToastMessage.set(`🎉 ممتاز جداً! تم اجتياز اختبار الدرس بنجاح، وتم فتح ${res.nextModule.titleAr} بنجاح!`);
      setTimeout(() => this.unlockedToastMessage.set(null), 6000);
    }
  }

  resetQuiz(): void {
    this.userAnswers = {};
    this.isQuizSubmitted.set(false);
    this.quizScore.set(0);
  }

  navigateToNextModule(nextModuleId: string): void {
    this.showQuizModal.set(false);
    this.router.navigate(['/module', nextModuleId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.showQuizModal()) return;
    if (this.activeWindow() !== 'slides') return;
    if (event.key === 'ArrowRight') {
      this.prevSlide();
    } else if (event.key === 'ArrowLeft' || event.key === 'Space') {
      this.nextSlide();
    }
  }
}
