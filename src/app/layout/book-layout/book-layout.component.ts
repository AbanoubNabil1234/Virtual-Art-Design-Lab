import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-book-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
    <app-header (toggleMenu)="isDrawerOpen.set(!isDrawerOpen())"></app-header>

    <!-- Book on a desk -->
    <div class="book-wrapper">
      <div class="book">

        <!-- LEFT PAGE = Content -->
        <main class="page-left-content">
          <div class="page-left-inner">
            <div class="content-frame">
              <router-outlet></router-outlet>
            </div>
          </div>
        </main>

        <!-- SPINE -->
        <div class="spine"></div>

        <!-- RIGHT PAGE = Sidebar -->
        <aside class="page-right-sidebar">
          <app-sidebar></app-sidebar>
        </aside>

      </div>
    </div>

    <!-- Mobile Drawer -->
    <div *ngIf="isDrawerOpen()" class="drawer-overlay" (click)="isDrawerOpen.set(false)">
      <div class="drawer-panel" (click)="$event.stopPropagation()">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:4px 8px;">
          <span style="color:#ddd;font-weight:700;font-size:1rem;">القائمة</span>
          <button (click)="isDrawerOpen.set(false)" style="color:#aaa;font-size:1.4rem;cursor:pointer;background:none;border:none;">✕</button>
        </div>
        <app-sidebar></app-sidebar>
      </div>
    </div>
  `,
    styles: []
})
export class BookLayoutComponent {
    isDrawerOpen = signal(false);
}
