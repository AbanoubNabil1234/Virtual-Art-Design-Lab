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
        <div class="flex items-center justify-between mb-4 px-2">
          <span class="text-white font-bold text-lg">اللـوحـــة</span>
          <button (click)="isDrawerOpen.set(false)" 
                  class="text-gray-400 hover:text-white text-2xl" 
                  aria-label="إغلاق">&times;</button>
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
