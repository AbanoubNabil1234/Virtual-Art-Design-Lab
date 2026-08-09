import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonSoundService, UiSound } from './core/services/button-sound.service';

const SOUND_TARGET =
  'button, a.btn-primary, a.btn-action, a.btn-secondary, .tool-btn, .sidebar-btn, .sidebar-btn-sub, .option-btn, .option-row, .submit-btn, .reset-btn, .back-btn, .add-btn, .delete-btn, .close-btn, .home-btn, .category-card, [role="button"], input[type="radio"], input[type="checkbox"], label:has(input[type="radio"]), label:has(input[type="checkbox"]), [data-sound]';

const TEST_ROUTES = ['/pre-test', '/performance-test', '/judging', '/question-bank'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  private readonly buttonSound = inject(ButtonSoundService);
  private readonly router = inject(Router);

  @HostListener('document:pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;

    const el = (event.target as Element | null)?.closest?.(SOUND_TARGET) as
      | HTMLElement
      | null;
    if (!el) return;

    if (
      el instanceof HTMLButtonElement ||
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement
    ) {
      if (el.disabled) return;
    }

    if (el.getAttribute('aria-disabled') === 'true' || el.hasAttribute('disabled')) {
      return;
    }

    this.buttonSound.play(this.resolveSound(el));
  }

  private resolveSound(el: HTMLElement): UiSound {
    const explicit = el.closest('[data-sound]')?.getAttribute('data-sound') as UiSound | null;
    if (explicit) return explicit;

    const onTestPage = TEST_ROUTES.some((path) => this.router.url.startsWith(path));
    if (!onTestPage) return 'click';

    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();

    if (el.matches('input[type="checkbox"]') || el.querySelector?.('input[type="checkbox"]')) {
      return 'check';
    }

    if (
      el.matches('input[type="radio"]') ||
      el.classList.contains('option-row') ||
      el.classList.contains('option-btn') ||
      el.querySelector?.('input[type="radio"]')
    ) {
      return 'select';
    }

    if (el.classList.contains('category-card')) return 'select';
    if (el.classList.contains('submit-btn') || /تسليم|حفظ/.test(text)) return 'submit';
    if (el.classList.contains('reset-btn') || /إعادة/.test(text)) return 'reset';
    if (el.classList.contains('back-btn') || /عودة|السابق|السابقة/.test(text)) {
      return /السابق|السابقة/.test(text) ? 'prev' : 'back';
    }
    if (/التالي|التالية/.test(text)) return 'next';
    if (/ابدأ/.test(text) || el.classList.contains('btn-action')) return 'start';
    if (/تم تسليم|نجاح/.test(text)) return 'success';

    return 'click';
  }
}
