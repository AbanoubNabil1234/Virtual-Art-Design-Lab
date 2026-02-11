import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-8">
      
      <h1 class="animate-fade-in-up text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
        المعمل الافتراضي للتصميم في التربية الفنية – المرحلة الثانوية
      </h1>

      <p class="animate-fade-in-up delay-100 text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-8 px-6">
        مرحباً بك في المعمل الافتراضي للتربية الفنية. صُممت هذه البيئة التفاعلية لمساعدتك على فهم مفاهيم التصميم الفني وتنمية مهاراتك العملية من خلال الأنشطة الافتراضية والتجارب التطبيقية.
      </p>
      
      <div class="animate-fade-in-up delay-200 mb-10">
        <a routerLink="/lab" class="btn-primary">
          <span>ابدأ التجربة الآن</span>
          <span class="material-icons rtl-flip">arrow_back</span>
        </a>
      </div>

      <h2 class="animate-fade-in-up delay-300 text-xl text-gray-700 mb-8">
        للطلاب
      </h2>

      <div class="animate-fade-in-up delay-300 mb-10">
        <p class="text-sm text-gray-500 mb-1">إعــداد الباحث</p>
        <p class="text-lg font-semibold text-gray-900">أحمد عدنان ياسين</p>
      </div>

      <!-- Framed Image Placeholder -->
      <div class="animate-scale-in delay-300 flex items-center justify-center bg-gray-100 rounded-sm border-2 border-gray-600 outline outline-2 outline-gray-400 outline-offset-4 shadow-xl mb-6"
           style="width: 12.5rem; height: 13.75rem;">
        <span class="material-icons text-7xl text-gray-300">person</span>
      </div>

    </div>
  `
})
export class HomeComponent { }
