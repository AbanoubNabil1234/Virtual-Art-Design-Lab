import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PerformanceTestService } from '../../core/services/performance-test.service';
import { ButtonSoundService } from '../../core/services/button-sound.service';

type Tool = 'pen' | 'eraser' | 'fill' | 'text' | 'spray' | 'picker' | 'rect' | 'circle' | 'line' | 'triangle' | 'star' | 'arrow' | 'diamond' | 'hexagon';

interface ToolDoc {
  name: string;
  shortcut?: string;
  icon: string;
  category: 'رسم وتلوين' | 'أشكال هندسية' | 'تحكم وتصدير';
  description: string;
  usageTip: string;
}

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="lab-container">
      
      <!-- Canvas Layer -->
      <canvas #canvas class="main-canvas"
              (mousedown)="startDrawing($event)" 
              (mousemove)="draw($event)" 
              (mouseup)="stopDrawing()" 
              (mouseleave)="stopDrawing()"></canvas>

      <!-- Grid Overlay -->
      <div class="grid-overlay" *ngIf="showGrid" [style.pointer-events]="'none'"></div>

      <!-- LIVE FLOATING TOOLTIP ON EVERY SINGLE TOOL BUTTON -->
      <div *ngIf="hoveredToolDoc()"
           class="fixed z-[200] bg-gray-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-amber-500/40 backdrop-blur-md max-w-xs pointer-events-none text-right animate-fade-in"
           [style.left.px]="tooltipX"
           [style.top.px]="tooltipY">
        <div class="flex items-center gap-2 mb-1 border-b border-gray-700/60 pb-1.5">
          <span class="material-icons text-amber-400 text-base">{{ hoveredToolDoc()?.icon }}</span>
          <span class="font-bold text-xs text-amber-300">{{ hoveredToolDoc()?.name }}</span>
          <span *ngIf="hoveredToolDoc()?.shortcut" class="px-1.5 py-0.5 bg-amber-900 text-amber-200 font-mono text-[10px] rounded font-bold mr-auto border border-amber-700">
            {{ hoveredToolDoc()?.shortcut }}
          </span>
        </div>
        <p class="text-[11px] text-gray-200 m-0 mb-1 leading-relaxed">{{ hoveredToolDoc()?.description }}</p>
        <p class="text-[10px] text-amber-300 font-bold m-0 flex items-center gap-1">
          <span>💡</span>
          <span>{{ hoveredToolDoc()?.usageTip }}</span>
        </p>
      </div>

      <!-- ACTIVE PERFORMANCE TASK OVERLAY / DRAWER -->
      <div *ngIf="perfService.activeTask()" class="lab-task-overlay animate-fade-in">
        
        <!-- COLLAPSED COMPACT BAR -->
        <div *ngIf="isTaskCollapsed()" class="flex items-center gap-3 bg-amber-900 text-white px-4 py-2 rounded-2xl shadow-xl border border-amber-500/30 backdrop-blur">
          <span class="material-icons text-amber-400 text-base">palette</span>
          <span class="font-bold text-xs">المهمة {{ perfService.activeTask()?.id }}: {{ perfService.activeTask()?.text?.substring(0, 35) }}...</span>
          <span class="px-2 py-0.5 bg-amber-950 text-amber-300 font-mono text-xs rounded-lg border border-amber-700 font-black">
            {{ perfService.formatTime(perfService.activeTask()?.remainingSeconds || 600) }}
          </span>
          <button (click)="isTaskCollapsed.set(false)" class="text-xs bg-amber-800 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg border border-amber-600 font-bold">
            التفاصيل والمثال 🖼️
          </button>
        </div>

        <!-- EXPANDED ACTIVE TASK PANEL -->
        <div *ngIf="!isTaskCollapsed()" class="bg-white/95 backdrop-blur-md border-2 border-amber-900/30 rounded-2xl p-4 text-right shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-center justify-between gap-2 border-b border-gray-200 pb-2.5 mb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-amber-900 text-white font-black text-xs flex items-center justify-center">
                {{ perfService.activeTask()?.id }}
              </span>
              <h4 class="font-black text-gray-900 text-sm m-0">المهمة الأدائية {{ perfService.activeTask()?.id }}</h4>
            </div>

            <!-- Timer -->
            <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg font-mono text-xs font-black">
              <span class="material-icons text-sm text-amber-700">timer</span>
              <span>{{ perfService.formatTime(perfService.activeTask()?.remainingSeconds || 600) }}</span>
            </div>
          </div>

          <!-- Task Text -->
          <p class="text-xs md:text-sm font-bold text-gray-900 leading-relaxed mb-3">
            {{ perfService.activeTask()?.text }}
          </p>

          <!-- VISUAL EXAMPLE BOX (SVG + Description) -->
          <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-3">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-black text-amber-900 flex items-center gap-1">
                <span class="material-icons text-sm">image</span>
                {{ perfService.activeTask()?.exampleTitle }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center mb-2">
              <!-- SVG Preview Box -->
              <div class="w-full h-28 bg-white rounded-lg border border-amber-200 p-1 flex items-center justify-center shadow-inner"
                   [innerHTML]="getSafeSvg(perfService.activeTask()?.exampleSvg || '')">
              </div>

              <!-- Description & Guide -->
              <div class="sm:col-span-2 text-right">
                <p class="text-[11px] text-gray-700 leading-relaxed m-0 mb-2">
                  {{ perfService.activeTask()?.exampleDescription }}
                </p>
                <!-- Recommended Tools badges -->
                <div class="flex items-center gap-1 flex-wrap">
                  <span class="text-[10px] text-gray-500 font-bold">الأدوات:</span>
                  <span *ngFor="let t of perfService.activeTask()?.recommendedTools"
                        class="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded border border-amber-200">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2 mb-2 text-[11px] text-emerald-900 font-bold flex items-center gap-1.5">
              <span class="material-icons text-sm text-emerald-700">auto_fix_high</span>
              <span>تم رسم النموذج التوضيحي على اللوحة تلقائياً — يمكنك الآن التعديل والتلوين فوقه!</span>
            </div>

            <button (click)="drawGuideOnCanvas(true)" class="w-full py-1.5 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm">
              <span class="material-icons text-sm">refresh</span>
              <span>إعادة رسم وتجهيز الشكل التوضيحي للبدء بالتعديل 🔄</span>
            </button>
          </div>

          <!-- UNLOCKED NEXT TASK CELEBRATION BANNER -->
          <div *ngIf="nextUnlockedTaskId()"
               class="bg-emerald-600 text-white rounded-xl p-3 mb-3 text-xs font-bold shadow-lg animate-bounce flex flex-col gap-2 text-right">
            <div class="flex items-center gap-1.5">
              <span class="material-icons text-base">lock_open</span>
              <span>ممتاز جداً! تم تسليم المهمة وفتح المهمة {{ nextUnlockedTaskId() }} بنجاح 🎉</span>
            </div>
            <button (click)="goToNextTask()" class="w-full py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1 shadow-sm">
              <span>الانتقال لتنفيذ المهمة {{ nextUnlockedTaskId() }} مباشرة 🚀</span>
              <span class="material-icons text-sm">arrow_back</span>
            </button>
          </div>

          <!-- Skills list -->
          <div class="bg-gray-50 border border-gray-100 rounded-xl p-2.5 mb-3 text-[11px]">
            <span class="font-bold text-gray-700 block mb-1">المهارات المطلوبة:</span>
            <ul class="list-disc list-inside space-y-0.5 text-gray-600 pr-1">
              <li *ngFor="let s of perfService.activeTask()?.skills">{{ s }}</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <button (click)="markTaskCompleted()" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
              <span class="material-icons text-sm">check_circle</span>
              <span>{{ perfService.activeTask()?.completed ? 'تم الإنجاز ✓' : 'تحديد كـ مكتملة ✓' }}</span>
            </button>

            <button (click)="isTaskCollapsed.set(true)" class="text-xs text-gray-600 hover:text-gray-900 font-bold">
              طي 🔼
            </button>

            <button (click)="returnToPerfTest()" class="text-xs text-amber-900 font-bold hover:underline flex items-center gap-0.5">
              <span>العودة للمهام 🔙</span>
            </button>
          </div>
        </div>

      </div>

      <!-- TOOLS GUIDE MODAL -->
      <div *ngIf="showToolsGuideModal()"
           class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-amber-900/20 text-right animate-scale-in">
          
          <div class="flex justify-between items-center pb-4 border-b border-gray-200 mb-5">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-xl bg-amber-900 text-white flex items-center justify-center font-bold">
                <span class="material-icons">help_outline</span>
              </div>
              <div>
                <h3 class="text-xl font-black text-gray-900 m-0">دليل وشرح أدوات المعمل الافتراضي</h3>
                <p class="text-xs text-gray-500 m-0">شرح وظيفة واختصار كل أداة في بيئة التصميم</p>
              </div>
            </div>

            <button (click)="showToolsGuideModal.set(false)"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold">
              ✕
            </button>
          </div>

          <!-- Tools List by Category -->
          <div class="space-y-6">
            
            <!-- Category 1: Drawing & Color -->
            <div>
              <h4 class="text-sm font-black text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border-r-4 border-amber-800 mb-3">
                🎨 1. أدوات الرسم والتلوين الأساسية
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div *ngFor="let doc of drawingToolsDoc" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-right">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-amber-900 text-lg">{{ doc.icon }}</span>
                    <span class="font-bold text-sm text-gray-900">{{ doc.name }}</span>
                    <span *ngIf="doc.shortcut" class="px-1.5 py-0.5 bg-gray-200 text-gray-700 font-mono text-[10px] rounded font-bold mr-auto">
                      {{ doc.shortcut }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-700 m-0 mb-1 leading-relaxed">{{ doc.description }}</p>
                  <p class="text-[11px] text-amber-800 font-bold m-0">💡 طريقة الاستخدام: {{ doc.usageTip }}</p>
                </div>
              </div>
            </div>

            <!-- Category 2: Geometric & Decorative Shapes -->
            <div>
              <h4 class="text-sm font-black text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border-r-4 border-amber-800 mb-3">
                📐 2. الأشكال الهندسية والزخرفية
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div *ngFor="let doc of shapeToolsDoc" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-right">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-amber-900 text-lg">{{ doc.icon }}</span>
                    <span class="font-bold text-sm text-gray-900">{{ doc.name }}</span>
                  </div>
                  <p class="text-xs text-gray-700 m-0 mb-1 leading-relaxed">{{ doc.description }}</p>
                  <p class="text-[11px] text-amber-800 font-bold m-0">💡 طريقة الاستخدام: {{ doc.usageTip }}</p>
                </div>
              </div>
            </div>

            <!-- Category 3: Controls & Properties -->
            <div>
              <h4 class="text-sm font-black text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border-r-4 border-amber-800 mb-3">
                ⚙️ 3. أدوات التحكم والتعديل والتصدير
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div *ngFor="let doc of controlToolsDoc" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-right">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-icons text-amber-900 text-lg">{{ doc.icon }}</span>
                    <span class="font-bold text-sm text-gray-900">{{ doc.name }}</span>
                    <span *ngIf="doc.shortcut" class="px-1.5 py-0.5 bg-gray-200 text-gray-700 font-mono text-[10px] rounded font-bold mr-auto">
                      {{ doc.shortcut }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-700 m-0 mb-1 leading-relaxed">{{ doc.description }}</p>
                  <p class="text-[11px] text-amber-800 font-bold m-0">💡 طريقة الاستخدام: {{ doc.usageTip }}</p>
                </div>
              </div>
            </div>

          </div>

          <div class="mt-6 pt-4 border-t border-gray-200 text-center">
            <button (click)="showToolsGuideModal.set(false)"
                    class="btn-primary px-8 py-2 text-sm font-black shadow-md">
              فهمت، العودة للرسم
            </button>
          </div>

        </div>
      </div>

      <!-- Left Toolbar -->
      <div class="floating-toolbar animate-slide-in-left">
        <a routerLink="/" class="tool-btn home-btn"
           (mouseenter)="onToolHover($event, 'home')" (mouseleave)="onToolLeave()" title="الرئيسية">
          <span class="material-icons">home</span>
        </a>

        <!-- Guide Help Button -->
        <button class="tool-btn help-btn bg-amber-600 hover:bg-amber-700"
                (mouseenter)="onToolHover($event, 'help')" (mouseleave)="onToolLeave()"
                (click)="showToolsGuideModal.set(true)" title="شرح ودليل الأدوات">
          <span class="material-icons text-amber-200">help_outline</span>
        </button>
        
        <div class="divider"></div>

        <!-- Main Tools -->
        <button class="tool-btn" [class.active]="activeTool() === 'pen'"
                (mouseenter)="onToolHover($event, 'pen')" (mouseleave)="onToolLeave()"
                (click)="setTool('pen')" title="قلم (P)">
          <span class="material-icons">edit</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'spray'"
                (mouseenter)="onToolHover($event, 'spray')" (mouseleave)="onToolLeave()"
                (click)="setTool('spray')" title="بخاخ (S)">
            <span class="material-icons">grain</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'eraser'"
                (mouseenter)="onToolHover($event, 'eraser')" (mouseleave)="onToolLeave()"
                (click)="setTool('eraser')" title="ممحاة (E)">
          <span class="material-icons">auto_fix_high</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'fill'"
                (mouseenter)="onToolHover($event, 'fill')" (mouseleave)="onToolLeave()"
                (click)="setTool('fill')" title="تعبئة (F)">
          <span class="material-icons">format_color_fill</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'text'"
                (mouseenter)="onToolHover($event, 'text')" (mouseleave)="onToolLeave()"
                (click)="setTool('text')" title="نص (T)">
            <span class="material-icons">text_fields</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'picker'"
                (mouseenter)="onToolHover($event, 'picker')" (mouseleave)="onToolLeave()"
                (click)="setTool('picker')" title="قطارة (I)">
            <span class="material-icons">colorize</span>
        </button>

        <div class="divider"></div>

        <!-- Shapes Group -->
        <div class="shapes-grid">
            <button class="tool-btn mini" [class.active]="activeTool() === 'rect'"
                    (mouseenter)="onToolHover($event, 'rect')" (mouseleave)="onToolLeave()"
                    (click)="setTool('rect')" title="مربع">
                <span class="material-icons">crop_square</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'circle'"
                    (mouseenter)="onToolHover($event, 'circle')" (mouseleave)="onToolLeave()"
                    (click)="setTool('circle')" title="دائرة">
                <span class="material-icons">radio_button_unchecked</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'triangle'"
                    (mouseenter)="onToolHover($event, 'triangle')" (mouseleave)="onToolLeave()"
                    (click)="setTool('triangle')" title="مثلث">
                <span class="material-icons">change_history</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'star'"
                    (mouseenter)="onToolHover($event, 'star')" (mouseleave)="onToolLeave()"
                    (click)="setTool('star')" title="نجمة">
                <span class="material-icons">star_border</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'diamond'"
                    (mouseenter)="onToolHover($event, 'diamond')" (mouseleave)="onToolLeave()"
                    (click)="setTool('diamond')" title="معين">
                <span class="material-icons">square</span>
            </button>
             <button class="tool-btn mini" [class.active]="activeTool() === 'hexagon'"
                    (mouseenter)="onToolHover($event, 'hexagon')" (mouseleave)="onToolLeave()"
                    (click)="setTool('hexagon')" title="مسدس">
                <span class="material-icons">hexagon</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'arrow'"
                    (mouseenter)="onToolHover($event, 'arrow')" (mouseleave)="onToolLeave()"
                    (click)="setTool('arrow')" title="سهم">
                <span class="material-icons">arrow_forward</span>
            </button>
             <button class="tool-btn mini" [class.active]="activeTool() === 'line'"
                    (mouseenter)="onToolHover($event, 'line')" (mouseleave)="onToolLeave()"
                    (click)="setTool('line')" title="خط">
                <span class="material-icons">horizontal_rule</span>
            </button>
        </div>
        
        <div class="divider"></div>

        <button class="tool-btn" (mouseenter)="onToolHover($event, 'image')" (mouseleave)="onToolLeave()"
                (click)="fileInput.click()" title="إدراج صورة">
            <span class="material-icons">add_photo_alternate</span>
        </button>
        <input #fileInput type="file" (change)="handleImage($event)" accept="image/*" style="display:none">

      </div>

      <!-- Properties Bar -->
      <div class="floating-props animate-slide-in-down">
         <div class="prop-group" (mouseenter)="onToolHover($event, 'color', 'top')" (mouseleave)="onToolLeave()">
            <input type="color" [(ngModel)]="fillColor" (change)="updateContext()" title="Color">
            <span class="color-preview" [style.background]="fillColor"></span>
         </div>
         
         <div class="prop-group" (mouseenter)="onToolHover($event, 'strokeSize', 'top')" (mouseleave)="onToolLeave()">
             <span class="material-icons small-icon">line_weight</span>
             <input type="range" min="1" max="50" [(ngModel)]="strokeSize" (change)="updateContext()" title="Size">
             <span class="value-badge">{{ strokeSize }}px</span>
         </div>

         <div class="divider-vertical"></div>

         <!-- Guide button in prop bar -->
         <button class="tool-btn action text-amber-900"
                 (mouseenter)="onToolHover($event, 'help', 'top')" (mouseleave)="onToolLeave()"
                 (click)="showToolsGuideModal.set(true)" title="شرح الأدوات">
             <span class="material-icons">help_outline</span>
         </button>

         <button class="tool-btn" (mouseenter)="onToolHover($event, 'grid', 'top')" (mouseleave)="onToolLeave()"
                 (click)="toggleGrid()" [class.active]="showGrid" title="Grid">
             <span class="material-icons">grid_on</span>
         </button>
         
         <div class="divider-vertical"></div>

         <button class="tool-btn action" (mouseenter)="onToolHover($event, 'undo', 'top')" (mouseleave)="onToolLeave()"
                 (click)="undo()" [disabled]="historyStep <= 0" title="Undo (Ctrl+Z)">
             <span class="material-icons">undo</span>
         </button>
         <button class="tool-btn action" (mouseenter)="onToolHover($event, 'clear', 'top')" (mouseleave)="onToolLeave()"
                 (click)="clearCanvas()" title="Clear">
             <span class="material-icons">delete</span>
         </button>
         <button class="tool-btn action" (mouseenter)="onToolHover($event, 'save', 'top')" (mouseleave)="onToolLeave()"
                 (click)="saveCanvas()" title="Save">
             <span class="material-icons">save_alt</span>
         </button>
      </div>

      <input #textInput type="text" 
             class="text-input-overlay"
             [style.left.px]="textX" 
             [style.top.px]="textY"
             [style.color]="fillColor"
             [style.font-size.px]="strokeSize * 2"
             *ngIf="isTyping"
             (blur)="finishText()"
             (keydown.enter)="finishText()"
             autofocus>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: #f0f2f5;
    }

    .lab-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .lab-task-overlay {
      position: absolute;
      top: 15px;
      right: 20px;
      z-index: 120;
    }

    .main-canvas {
      position: absolute;
      top: 0; left: 0;
      z-index: 1;
      cursor: crosshair;
      touch-action: none;
    }

    .grid-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 0;
        background-size: 20px 20px;
        background-image:
            linear-gradient(to right, #e0e0e0 1px, transparent 1px),
            linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
    }

    .floating-toolbar {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(44, 62, 80, 0.95);
        backdrop-filter: blur(10px);
        padding: 12px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.25);
        z-index: 100;
        border: 1px solid rgba(255,255,255,0.1);
        max-height: 90vh;
        overflow-y: auto;
    }

    .shapes-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
    }

    .tool-btn {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        border: none;
        background: rgba(255,255,255,0.08);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    }
    .tool-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
    .tool-btn.active { background: #3498db; color: white; box-shadow: 0 0 12px rgba(52, 152, 219, 0.6); }
    .tool-btn.home-btn { background: #e74c3c; }
    .tool-btn.home-btn:hover { background: #c0392b; }
    .tool-btn.mini { width: 34px; height: 34px; border-radius: 8px; }
    .tool-btn.mini .material-icons { font-size: 18px; }

    .divider { height: 1px; background: rgba(255,255,255,0.1); margin: 2px 0; }

    .floating-props {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 8px 16px;
        border-radius: 30px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 100;
    }

    .prop-group { display: flex; align-items: center; gap: 8px; position: relative; }
    .small-icon { font-size: 18px; color: #666; }

    input[type="range"] { width: 80px; accent-color: #3498db; }
    input[type="color"] { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2; }
    .color-preview {
        width: 28px; height: 28px; border-radius: 50%; border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s;
    }
    .prop-group:hover .color-preview { transform: scale(1.1); }

    .value-badge { font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
    .tool-btn.action { color: #555; background: transparent; }
    .tool-btn.action:hover { background: #f0f0f0; color: #333; }
    .divider-vertical { width: 1px; height: 25px; background: #ddd; }

    .text-input-overlay {
        position: absolute; background: transparent; border: 1px dashed #3498db;
        outline: none; padding: 0; margin: 0; z-index: 50; font-family: inherit; min-width: 100px;
    }

    @keyframes slideInLeft { from { transform: translate(-100%, -50%); opacity: 0; } to { transform: translate(0, -50%); opacity: 1; } }
    .animate-slide-in-left { animation: slideInLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    @keyframes slideInDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    .animate-slide-in-down { animation: slideInDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  `]
})
export class LabComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('textInput') textInputRef!: ElementRef<HTMLInputElement>;

  readonly perfService = inject(PerformanceTestService);
  private readonly buttonSound = inject(ButtonSoundService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  isTaskCollapsed = signal(false);
  showToolsGuideModal = signal(false);
  
  // Hover Tooltip signals & positions
  hoveredToolDoc = signal<ToolDoc | null>(null);
  tooltipX = 80;
  tooltipY = 100;

  private taskTimerInterval: any = null;
  private ctx!: CanvasRenderingContext2D;

  activeTool = signal<Tool>('pen');
  fillColor = '#000000';
  strokeSize = 5;
  isDrawing = false;
  showGrid = false;

  isTyping = false;
  textX = 0;
  textY = 0;

  history: ImageData[] = [];
  historyStep = -1;

  lastX = 0;
  lastY = 0;
  snapshot: ImageData | null = null;
  sprayInterval: any;

  readonly allToolsDocMap: Record<string, ToolDoc> = {
    home: {
      name: 'الصفحة الرئيسية',
      icon: 'home',
      category: 'تحكم وتصدير',
      description: 'العودة للصفحة الرئيسية لمختبر التربية الفنية.',
      usageTip: 'انقر للعودة للقائمة الرئيسية للمشروع.'
    },
    help: {
      name: 'دليل الأدوات الشامل',
      icon: 'help_outline',
      category: 'تحكم وتصدير',
      description: 'استعراض شرح جميع أدوات وتطبيقات المعمل الرقمي.',
      usageTip: 'انقر لفتح نافذة الشرح التفاعلية المفصلة.'
    },
    pen: {
      name: 'القلم (Pen)',
      shortcut: 'P',
      icon: 'edit',
      category: 'رسم وتلوين',
      description: 'أداة الرسم الحر الأساسية لرسم الخطوط الناعمة والتفاصيل بدقة عالية.',
      usageTip: 'انقر واسحب على اللوحة للرسم، واستخدم شريط السمك للتكبير والتصغير.'
    },
    spray: {
      name: 'البخاخ (Spray)',
      shortcut: 'S',
      icon: 'grain',
      category: 'رسم وتلوين',
      description: 'أداة رش اللون بأسلوب التظليل النقطي ورذاذ الألوان لمنح إحساس بالملمس الرقمي.',
      usageTip: 'اضغط مع السحب لتشكيل تجمعات نقطية متدرجة الكثافة.'
    },
    eraser: {
      name: 'الممحاة (Eraser)',
      shortcut: 'E',
      icon: 'auto_fix_high',
      category: 'رسم وتلوين',
      description: 'مسح وحذف الزوائد والأجزاء الخاطئة وإعادتها للون الأبيض النقي.',
      usageTip: 'استخدم مؤشر الحجم لتكبير الممحاة ومسح المساحات الكبيرة بسرعة.'
    },
    fill: {
      name: 'أداة التعبئة (Fill)',
      shortcut: 'F',
      icon: 'format_color_fill',
      category: 'رسم وتلوين',
      description: 'سكب وتلوين المساحات والأشكال المغلقة بالكامل بنقرة واحدة.',
      usageTip: 'تأكد أن الشكل مغلق تماماً قبل الضغط للتعبئة لمنع تسرب اللون للوحة.'
    },
    text: {
      name: 'أداة النص (Text)',
      shortcut: 'T',
      icon: 'text_fields',
      category: 'رسم وتلوين',
      description: 'إضافة وتدوين النصوص والرموز والكتابة المباشرة بالخط العربي على اللوحة.',
      usageTip: 'اضغط على المكان المطلوب واكتب النص ثم اضغط Enter للتثبيت.'
    },
    picker: {
      name: 'القطارة (Color Picker)',
      shortcut: 'I',
      icon: 'colorize',
      category: 'رسم وتلوين',
      description: 'التقاط واستخلاص درجة اللون الموجودة في أي نقطة باللوحة لاستخدامها مجدداً.',
      usageTip: 'انقر على أي لون باللوحة وسيتم اختياره كـ لون نَشِط تلقائياً.'
    },
    rect: {
      name: 'المربع (Rectangle)',
      icon: 'crop_square',
      category: 'أشكال هندسية',
      description: 'رسم مستطيلات ومربعات هندسية منتظمة ذات حدود واضحة.',
      usageTip: 'اسحب القلم لتحديد طول وعرض المربع المطلوب.'
    },
    circle: {
      name: 'الدائرة (Circle)',
      icon: 'radio_button_unchecked',
      category: 'أشكال هندسية',
      description: 'رسم دوائر وأشكال بيضاوية منتظمة بدقة.',
      usageTip: 'حدد المركز واسحب للخارج لتكبير نصف قطر الدائرة.'
    },
    triangle: {
      name: 'المثلث (Triangle)',
      icon: 'change_history',
      category: 'أشكال هندسية',
      description: 'رسم مثلثات هندسية متوازية ومجسمات ثلاثية الأضلاع.',
      usageTip: 'تفيد في بناء الأسس التركيزية والتكوينات الإنشائية.'
    },
    star: {
      name: 'النجمة (Star)',
      icon: 'star_border',
      category: 'أشكال هندسية',
      description: 'رسم نجوم زخرفية خماسية ومتناظرة.',
      usageTip: 'تُستخدم في ابتكار الأطباق النجمية والزخارف الإسلامية.'
    },
    diamond: {
      name: 'المعين (Diamond)',
      icon: 'square',
      category: 'أشكال هندسية',
      description: 'رسم أشكال المعين والوحدات الزخرفية المائلة.',
      usageTip: 'تفيد في التكرار المتناوب والمتغير باللوحة.'
    },
    hexagon: {
      name: 'الشكل المسدس (Hexagon)',
      icon: 'hexagon',
      category: 'أشكال هندسية',
      description: 'رسم أشكال سداسية الأضلاع متكاملة.',
      usageTip: 'مناسبة لبناء التكوينات الهندسة وتكرار خلايا الزخرفة.'
    },
    arrow: {
      name: 'السهم (Arrow)',
      icon: 'arrow_forward',
      category: 'أشكال هندسية',
      description: 'رسم أسهم اتجاهية لتأكيد الحركة والإيقاع في التصميم.',
      usageTip: 'اسحب من بداية السهم نحو اتجاه الإشارة المطلوب.'
    },
    line: {
      name: 'الخط المستقيم (Line)',
      icon: 'horizontal_rule',
      category: 'أشكال هندسية',
      description: 'رسم خطوط مستقيمة ودقيقة بأي زاوية أو اتجاه.',
      usageTip: 'تُستخدم لعمل شبكات التظليل (Hatching) والتقسيمات الخطية.'
    },
    image: {
      name: 'إدراج صورة خارجية',
      icon: 'add_photo_alternate',
      category: 'تحكم وتصدير',
      description: 'جلب وإدراج صور رقمية من حاسوبك إلى مساحة اللوحة للتعديل عليها.',
      usageTip: 'اضغط واختر الصورة من جهازك لإدراجها فوراً على اللوحة.'
    },
    color: {
      name: 'منتقي الألوان (Color Wheel)',
      icon: 'palette',
      category: 'تحكم وتصدير',
      description: 'اختيار وتخصيص درجات الألوان الأساسية، الثانوية، الساخنة، والباردة.',
      usageTip: 'اضغط على مربع اللون في الشريط العلوي لاختيار درجة اللون بدقة.'
    },
    strokeSize: {
      name: 'حجم وسمك الأداة (Line Weight)',
      icon: 'line_weight',
      category: 'تحكم وتصدير',
      description: 'التحكم في سمك وحجم أدوات الرسم والأشكال من 1px إلى 50px.',
      usageTip: 'حرك الشريط الانزلاقي لتحديد السمك المطلوب.'
    },
    grid: {
      name: 'شبكة التوجيه (Grid)',
      icon: 'grid_on',
      category: 'تحكم وتصدير',
      description: 'إظهار شبكة مربعات شفافة مساعدة لضبط القياسات والتوازيات.',
      usageTip: 'اضغط للتبديل بين إظهار وإخفاء الشبكة.'
    },
    undo: {
      name: 'التراجع (Undo)',
      shortcut: 'Ctrl+Z',
      icon: 'undo',
      category: 'تحكم وتصدير',
      description: 'التراجع عن الخاطوات والرسمات الأخيرة خطوة بخطوة.',
      usageTip: 'يمكنك استخدام اختصار المفاتيح Ctrl+Z للتراجع السريع.'
    },
    clear: {
      name: 'مسح اللوحة (Clear)',
      icon: 'delete',
      category: 'تحكم وتصدير',
      description: 'تفريغ وتنظيف اللوحة بالكامل والبدء من جديد.',
      usageTip: 'استخدمها عندما تريد بدء تصميم جديد كلياً.'
    },
    save: {
      name: 'حفظ الصورة (Save)',
      icon: 'save_alt',
      category: 'تحكم وتصدير',
      description: 'تصدير وحفظ عملك الفني كصورة PNG عالية الجودة على جهازك.',
      usageTip: 'اضغط لحفظ وتنزيل اللوحة على جهاز الكمبيوتر.'
    }
  };

  readonly drawingToolsDoc: ToolDoc[] = [
    this.allToolsDocMap['pen'],
    this.allToolsDocMap['spray'],
    this.allToolsDocMap['eraser'],
    this.allToolsDocMap['fill'],
    this.allToolsDocMap['text'],
    this.allToolsDocMap['picker']
  ];

  readonly shapeToolsDoc: ToolDoc[] = [
    this.allToolsDocMap['rect'],
    this.allToolsDocMap['circle'],
    this.allToolsDocMap['triangle'],
    this.allToolsDocMap['star'],
    this.allToolsDocMap['diamond'],
    this.allToolsDocMap['hexagon'],
    this.allToolsDocMap['arrow'],
    this.allToolsDocMap['line']
  ];

  readonly controlToolsDoc: ToolDoc[] = [
    this.allToolsDocMap['color'],
    this.allToolsDocMap['strokeSize'],
    this.allToolsDocMap['grid'],
    this.allToolsDocMap['undo'],
    this.allToolsDocMap['clear'],
    this.allToolsDocMap['save'],
    this.allToolsDocMap['image']
  ];

  ngOnInit(): void {
    this.startTaskTimer();
  }

  ngOnDestroy(): void {
    this.stopTaskTimer();
  }

  getSafeSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  onToolHover(event: MouseEvent, toolKey: string, positionSide: 'left' | 'top' = 'left'): void {
    const doc = this.allToolsDocMap[toolKey];
    if (doc) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      if (positionSide === 'left') {
        this.tooltipX = rect.right + 12;
        this.tooltipY = Math.max(10, rect.top - 10);
      } else {
        this.tooltipX = Math.max(10, rect.left - 50);
        this.tooltipY = rect.bottom + 12;
      }
      this.hoveredToolDoc.set(doc);
    }
  }

  onToolLeave(): void {
    this.hoveredToolDoc.set(null);
  }

  private startTaskTimer(): void {
    this.stopTaskTimer();
    this.taskTimerInterval = setInterval(() => {
      const active = this.perfService.activeTask();
      if (active && !active.completed) {
        if (active.remainingSeconds > 0) {
          this.perfService.updateTaskTime(active.id, active.remainingSeconds - 1);
        }
      }
    }, 1000);
  }

  private stopTaskTimer(): void {
    if (this.taskTimerInterval) {
      clearInterval(this.taskTimerInterval);
      this.taskTimerInterval = null;
    }
  }

  nextUnlockedTaskId = signal<number | null>(null);

  markTaskCompleted(): void {
    const active = this.perfService.activeTask();
    if (active) {
      const res = this.perfService.setTaskCompleted(active.id, true);
      this.buttonSound.play('success');
      if (res.unlockedNext && res.nextTaskId) {
        this.nextUnlockedTaskId.set(res.nextTaskId);
      }
    }
  }

  goToNextTask(): void {
    const nextId = this.nextUnlockedTaskId();
    if (nextId) {
      if (this.perfService.setActiveTask(nextId)) {
        this.nextUnlockedTaskId.set(null);
        setTimeout(() => {
          this.drawGuideOnCanvas(true);
        }, 100);
      }
    }
  }

  returnToPerfTest(): void {
    this.router.navigate(['/performance-test']);
  }

  drawGuideOnCanvas(playSound: boolean = false): void {
    const active = this.perfService.activeTask();
    if (!active || !this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    this.ctx.save();
    this.ctx.lineWidth = 2.5;

    switch (active.id) {
      case 1: // Stippling dots sample
        this.ctx.strokeStyle = '#6b4226';
        this.ctx.fillStyle = '#d97706';
        // Outer balance ring
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 90, 0, Math.PI * 2);
        this.ctx.setLineDash([4, 6]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        // Center dots
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const rad = Math.random() * 85;
          const r = Math.random() * 6 + 2;
          this.ctx.fillStyle = i % 3 === 0 ? '#d97706' : (i % 3 === 1 ? '#059669' : '#6b4226');
          this.ctx.beginPath();
          this.ctx.arc(cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad, r, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;

      case 2: // Triangle, square, circle
        // Square
        this.ctx.strokeStyle = '#1d4ed8';
        this.ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        this.ctx.fillRect(cx - 100, cy - 70, 90, 90);
        this.ctx.strokeRect(cx - 100, cy - 70, 90, 90);
        // Circle
        this.ctx.strokeStyle = '#b91c1c';
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        this.ctx.beginPath();
        this.ctx.arc(cx + 45, cy, 50, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        // Triangle
        this.ctx.strokeStyle = '#d97706';
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 80);
        this.ctx.lineTo(cx - 60, cy + 50);
        this.ctx.lineTo(cx + 60, cy + 50);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        break;

      case 3: // Organic blobs
        this.ctx.strokeStyle = '#047857';
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 90, cy - 50);
        this.ctx.bezierCurveTo(cx - 30, cy - 110, cx + 90, cy - 70, cx + 70, cy + 30);
        this.ctx.bezierCurveTo(cx + 50, cy + 100, cx - 70, cy + 110, cx - 90, cy - 50);
        this.ctx.fill();
        this.ctx.stroke();
        break;

      case 4: // Islamic 8-star motif
        this.ctx.strokeStyle = '#b45309';
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        this.ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          const r = i % 2 === 0 ? 80 : 40;
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          if (i === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        break;

      case 5: // Hatching texture lines
        this.ctx.strokeStyle = '#44403c';
        for (let i = -70; i <= 70; i += 14) {
          this.ctx.beginPath();
          this.ctx.moveTo(cx + i, cy - 70);
          this.ctx.lineTo(cx + i + 45, cy + 70);
          this.ctx.stroke();
        }
        break;

      case 6: // Warm-cool gradient blocks
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        this.ctx.fillRect(cx - 120, cy - 60, 60, 120);
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        this.ctx.fillRect(cx - 60, cy - 60, 60, 120);
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        this.ctx.fillRect(cx, cy - 60, 60, 120);
        this.ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        this.ctx.fillRect(cx + 60, cy - 60, 60, 120);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(cx - 120, cy - 60, 240, 120);
        break;

      case 7: // Sine wave & parallel lines
        this.ctx.strokeStyle = '#0284c7';
        this.ctx.beginPath();
        for (let x = -140; x <= 140; x += 5) {
          const y = Math.sin(x / 20) * 35;
          if (x === -140) this.ctx.moveTo(cx + x, cy + y);
          else this.ctx.lineTo(cx + x, cy + y);
        }
        this.ctx.stroke();
        break;

      case 8: // 3D Sphere & Shadow
        // Cast shadow
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(cx + 25, cy + 60, 60, 15, 0, 0, Math.PI * 2);
        this.ctx.fill();
        // Sphere outline
        this.ctx.strokeStyle = '#0369a1';
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 55, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        break;

      case 9: // Secondary colors blocks
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        this.ctx.fillRect(cx - 100, cy - 50, 65, 100);
        this.ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
        this.ctx.fillRect(cx - 30, cy - 50, 65, 48);
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        this.ctx.fillRect(cx - 30, cy + 2, 65, 48);
        break;

      case 10: // Full creative stencil
        this.ctx.strokeStyle = '#ec4899';
        this.ctx.beginPath();
        this.ctx.arc(cx - 45, cy - 20, 40, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.strokeRect(cx, cy - 40, 70, 70);
        this.ctx.strokeStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.moveTo(cx + 80, cy - 30);
        this.ctx.lineTo(cx + 120, cy + 50);
        this.ctx.lineTo(cx + 40, cy + 50);
        this.ctx.closePath();
        this.ctx.stroke();
        break;

      default:
        this.ctx.strokeStyle = '#3498db';
        this.ctx.strokeRect(cx - 120, cy - 90, 240, 180);
        break;
    }

    this.ctx.restore();
    this.saveState();
    if (playSound) {
      this.buttonSound.play('click');
    }
  }

  @HostListener('window:resize') onResize() { this.resizeCanvas(); }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') this.undo();
    if (event.key === 'Escape') this.stopDrawing();

    const keyMap: { [key: string]: Tool } = {
      'p': 'pen', 'e': 'eraser', 'f': 'fill', 't': 'text', 's': 'spray', 'i': 'picker'
    };
    if (keyMap[event.key.toLowerCase()]) this.setTool(keyMap[event.key.toLowerCase()]);
  }

  ngAfterViewInit() {
    this.initCanvas();
    if (this.perfService.activeTask()) {
      setTimeout(() => {
        this.drawGuideOnCanvas(false);
      }, 150);
    } else {
      this.saveState();
    }
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    this.resizeCanvas();
    this.updateContext();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const tempImageData = this.ctx ? this.ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (tempImageData) {
      this.ctx.putImageData(tempImageData, 0, 0);
    }
    this.updateContext();
  }

  updateContext() {
    if (!this.ctx) return;
    this.ctx.strokeStyle = this.activeTool() === 'eraser' ? '#ffffff' : this.fillColor;
    this.ctx.fillStyle = this.fillColor;
    this.ctx.lineWidth = this.strokeSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  setTool(tool: Tool) {
    this.activeTool.set(tool);
    this.updateContext();
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  startDrawing(e: MouseEvent) {
    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;

    this.snapshot = this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    if (this.activeTool() === 'fill') {
      this.floodFill(Math.floor(this.lastX), Math.floor(this.lastY), this.fillColor);
      this.saveState();
      this.isDrawing = false;
      return;
    }

    if (this.activeTool() === 'picker') {
      this.pickColor(Math.floor(this.lastX), Math.floor(this.lastY));
      this.isDrawing = false;
      return;
    }

    if (this.activeTool() === 'text') {
      this.textX = e.clientX;
      this.textY = e.clientY;
      this.isTyping = true;
      this.isDrawing = false;
      return;
    }

    if (this.activeTool() === 'spray') {
      this.sprayInterval = setInterval(() => this.drawSpray(this.lastX, this.lastY), 20);
      return;
    }

    if (['pen', 'eraser'].includes(this.activeTool())) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
    }
  }

  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (['pen', 'eraser'].includes(this.activeTool())) {
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
    } else if (this.activeTool() === 'spray') {
      this.lastX = currentX;
      this.lastY = currentY;
    } else {
      if (this.snapshot) {
        this.ctx.putImageData(this.snapshot, 0, 0);
      }
      this.drawShape(this.activeTool(), this.lastX, this.lastY, currentX, currentY);
    }
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    if (this.sprayInterval) clearInterval(this.sprayInterval);
    this.saveState();
  }

  private drawSpray(x: number, y: number) {
    const density = this.strokeSize * 2;
    for (let i = 0; i < density; i++) {
      const offset = (Math.random() - 0.5) * this.strokeSize * 3;
      const angle = Math.random() * Math.PI * 2;
      this.ctx.fillRect(x + Math.cos(angle) * offset, y + Math.sin(angle) * offset, 1, 1);
    }
  }

  private drawShape(tool: Tool, x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    const width = x2 - x1;
    const height = y2 - y1;

    switch (tool) {
      case 'rect':
        this.ctx.strokeRect(x1, y1, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(width * width + height * height);
        this.ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
      case 'line':
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        break;
      case 'triangle':
        this.ctx.moveTo(x1 + width / 2, y1);
        this.ctx.lineTo(x1, y2);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      case 'star':
        this.drawStar(x1, y1, 5, Math.abs(width), Math.abs(width) / 2);
        break;
      case 'arrow':
        this.drawArrow(x1, y1, x2, y2);
        break;
      case 'diamond':
        this.ctx.moveTo(x1 + width / 2, y1);
        this.ctx.lineTo(x2, y1 + height / 2);
        this.ctx.lineTo(x1 + width / 2, y2);
        this.ctx.lineTo(x1, y1 + height / 2);
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      case 'hexagon':
        this.drawPolygon(x1, y1, 6, Math.abs(width));
        break;
    }
  }

  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawArrow(fromx: number, fromy: number, tox: number, toy: number) {
    const headlen = 15;
    const angle = Math.atan2(toy - fromy, tox - fromx);
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }

  private drawPolygon(cx: number, cy: number, sides: number, radius: number) {
    if (sides < 3) return;
    const a = (Math.PI * 2) / sides;
    this.ctx.moveTo(cx + radius * Math.cos(0), cy + radius * Math.sin(0));
    for (let i = 1; i < sides; i++) {
      this.ctx.lineTo(cx + radius * Math.cos(a * i), cy + radius * Math.sin(a * i));
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  finishText() {
    if (!this.isTyping) return;
    const input = this.textInputRef.nativeElement;
    const text = input.value;
    if (text) {
      this.ctx.font = `${this.strokeSize * 2}px sans-serif`;
      this.ctx.fillStyle = this.fillColor;
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.ctx.fillText(text, this.textX - rect.left, this.textY - rect.top + (this.strokeSize * 2));
      this.saveState();
    }
    this.isTyping = false;
  }

  handleImage(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 50, 50, img.width > 500 ? 500 : img.width, img.height > 500 ? 500 : img.height);
          this.saveState();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private floodFill(startX: number, startY: number, fillColorHex: string) {
    const canvas = this.canvasRef.nativeElement;
    const imgData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const r = parseInt(fillColorHex.slice(1, 3), 16);
    const g = parseInt(fillColorHex.slice(3, 5), 16);
    const b = parseInt(fillColorHex.slice(5, 7), 16);

    const startPos = (startY * canvas.width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    if (startR === r && startG === g && startB === b) return;

    const pixelStack = [[startX, startY]];

    while (pixelStack.length) {
      const newPos = pixelStack.pop()!;
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * canvas.width + x) * 4;

      while (y-- >= 0 && matchStartColor(pixelPos)) {
        pixelPos -= canvas.width * 4;
      }
      pixelPos += canvas.width * 4;
      y++;

      let reachLeft = false;
      let reachRight = false;

      while (y++ < canvas.height - 1 && matchStartColor(pixelPos)) {
        colorPixel(pixelPos);

        if (x > 0) {
          if (matchStartColor(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < canvas.width - 1) {
          if (matchStartColor(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        pixelPos += canvas.width * 4;
      }
    }

    this.ctx.putImageData(imgData, 0, 0);

    function matchStartColor(pos: number) {
      return data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB;
    }

    function colorPixel(pos: number) {
      data[pos] = r;
      data[pos + 1] = g;
      data[pos + 2] = b;
      data[pos + 3] = 255;
    }
  }

  private pickColor(x: number, y: number) {
    const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    this.fillColor = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
    this.updateContext();
  }

  saveState() {
    this.historyStep++;
    if (this.historyStep < this.history.length) {
      this.history.length = this.historyStep;
    }
    const canvas = this.canvasRef.nativeElement;
    this.history.push(this.ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      this.ctx.putImageData(this.history[this.historyStep], 0, 0);
    }
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.saveState();
  }

  saveCanvas() {
    const link = document.createElement('a');
    link.download = `lab-artwork-${Date.now()}.png`;
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }
}
