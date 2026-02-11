import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-8 home-content" style="direction: rtl;">
      
      <h1 class="animate-fade-in-up" style="font-size: 1.8rem; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; font-family: 'Noto Kufi Arabic', Arial, sans-serif;">
        المعمل الافتراضي للتصميم في التربية الفنية – المرحلة الثانوية
      </h1>

      <p class="animate-fade-in-up delay-100" style="
        font-size: 1.1rem; 
        color: #444; 
        max-width: 800px; 
        line-height: 1.8; 
        margin-bottom: 32px; 
        font-family: 'Noto Kufi Arabic', Arial, sans-serif;
        padding: 0 1rem;
      ">
        مرحباً بك في المعمل الافتراضي للتربية الفنية. صُممت هذه البيئة التفاعلية لمساعدتك على فهم مفاهيم التصميم الفني وتنمية مهاراتك العملية من خلال الأنشطة الافتراضية والتجارب التطبيقية.
      </p>
      
      <div class="animate-fade-in-up delay-200">
        <a href="#" class="btn-primary" style="margin-bottom: 40px;">
          ابدأ التجربة الآن
          <span class="material-icons" style="margin-right: 8px; font-size: 1.2rem;">arrow_back</span>
        </a>
      </div>

      <h2 class="animate-fade-in-up delay-300" style="font-size: 1.2rem; color: #333; margin-bottom: 32px; font-family: 'Noto Kufi Arabic', Arial, sans-serif;">
        للطلاب
      </h2>

      <div class="animate-fade-in-up delay-300">
        <p style="font-size: 1rem; color: #555; margin-bottom: 8px;">إعــداد الباحث</p>
        <p style="font-size: 1.1rem; font-weight: 600; color: #1a1a1a; margin-bottom: 40px;">أحمد عدنان ياسين</p>
      </div>

      <!-- Framed Image Placeholder (matching reference) -->
      <div class="animate-scale-in delay-300" style="
        width: 200px;
        height: 220px;
        border: 3px solid #555;
        outline: 2px solid #999;
        outline-offset: 3px;
        background: #e8e8e8;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      ">
        <span class="material-icons" style="font-size: 64px; color: #aaa;">person</span>
      </div>

    </div>
  `
})
export class HomeComponent { }
