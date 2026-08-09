import { Component, ElementRef, ViewChild, AfterViewInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type Tool = 'pen' | 'eraser' | 'fill' | 'text' | 'spray' | 'picker' | 'rect' | 'circle' | 'line' | 'triangle' | 'star' | 'arrow' | 'diamond' | 'hexagon';

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

      <!-- Left Toolbar -->
      <div class="floating-toolbar animate-slide-in-left">
        <a routerLink="/" class="tool-btn home-btn" title="الرئيسية">
          <span class="material-icons">home</span>
        </a>
        
        <div class="divider"></div>

        <!-- Main Tools -->
        <button class="tool-btn" [class.active]="activeTool() === 'pen'" (click)="setTool('pen')" title="قلم (P)">
          <span class="material-icons">edit</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'spray'" (click)="setTool('spray')" title="بخاخ (S)">
            <span class="material-icons">grain</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'eraser'" (click)="setTool('eraser')" title="ممحاة (E)">
          <span class="material-icons">auto_fix_high</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'fill'" (click)="setTool('fill')" title="تعبئة (F)">
          <span class="material-icons">format_color_fill</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'text'" (click)="setTool('text')" title="نص (T)">
            <span class="material-icons">text_fields</span>
        </button>
        <button class="tool-btn" [class.active]="activeTool() === 'picker'" (click)="setTool('picker')" title="قطارة (I)">
            <span class="material-icons">colorize</span>
        </button>

        <div class="divider"></div>

        <!-- Shapes Group -->
        <div class="shapes-grid">
            <button class="tool-btn mini" [class.active]="activeTool() === 'rect'" (click)="setTool('rect')" title="مربع">
                <span class="material-icons">crop_square</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'circle'" (click)="setTool('circle')" title="دائرة">
                <span class="material-icons">radio_button_unchecked</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'triangle'" (click)="setTool('triangle')" title="مثلث">
                <span class="material-icons">change_history</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'star'" (click)="setTool('star')" title="نجمة">
                <span class="material-icons">star_border</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'diamond'" (click)="setTool('diamond')" title="معين">
                <span class="material-icons">square</span> <!-- Diamond shape via css rotate? using fallback icon -->
            </button>
             <button class="tool-btn mini" [class.active]="activeTool() === 'hexagon'" (click)="setTool('hexagon')" title="مسدس">
                <span class="material-icons">hexagon</span>
            </button>
            <button class="tool-btn mini" [class.active]="activeTool() === 'arrow'" (click)="setTool('arrow')" title="سهم">
                <span class="material-icons">arrow_forward</span>
            </button>
             <button class="tool-btn mini" [class.active]="activeTool() === 'line'" (click)="setTool('line')" title="خط">
                <span class="material-icons">horizontal_rule</span>
            </button>
        </div>
        
        <div class="divider"></div>

        <button class="tool-btn" (click)="fileInput.click()" title="إدراج صورة">
            <span class="material-icons">add_photo_alternate</span>
        </button>
        <input #fileInput type="file" (change)="handleImage($event)" accept="image/*" style="display:none">

      </div>

      <!-- Properties Bar -->
      <div class="floating-props animate-slide-in-down">
         <div class="prop-group">
            <input type="color" [(ngModel)]="fillColor" (change)="updateContext()" title="Color">
            <span class="color-preview" [style.background]="fillColor"></span>
         </div>
         
         <div class="prop-group">
             <span class="material-icons small-icon">line_weight</span>
             <input type="range" min="1" max="50" [(ngModel)]="strokeSize" (change)="updateContext()" title="Size">
             <span class="value-badge">{{ strokeSize }}px</span>
         </div>

         <div class="divider-vertical"></div>

         <button class="tool-btn" (click)="toggleGrid()" [class.active]="showGrid" title="Grid">
             <span class="material-icons">grid_on</span>
         </button>
         
         <div class="divider-vertical"></div>

         <button class="tool-btn action" (click)="undo()" [disabled]="historyStep <= 0" title="Undo (Ctrl+Z)">
             <span class="material-icons">undo</span>
         </button>
         <button class="tool-btn action" (click)="clearCanvas()" title="Clear">
             <span class="material-icons">delete</span>
         </button>
         <button class="tool-btn action" (click)="saveCanvas()" title="Save">
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
        color: #ecf0f1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .tool-btn.mini {
        width: 32px;
        height: 32px;
    }
    .tool-btn.mini .material-icons { font-size: 18px; }

    .tool-btn:hover { background: rgba(255,255,255,0.2); }
    .tool-btn.active { background: #3498db; color: white; box-shadow: 0 0 10px rgba(52, 152, 219, 0.6); }

    .home-btn { background: #e74c3c; }
    .home-btn:hover { background: #c0392b; }

    .divider { height: 1px; background: rgba(255,255,255,0.15); margin: 4px 0; }

    .floating-props {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 8px 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 100;
    }

    .prop-group { display: flex; align-items: center; gap: 8px; position: relative; }

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
export class LabComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('textInput') textInputRef!: ElementRef<HTMLInputElement>;

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

  ngAfterViewInit() { this.initCanvas(); }

  initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    this.resizeCanvas();
    this.updateContext();
    this.saveHistory();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(tempCanvas, 0, 0);
    this.updateContext();
    if (this.history.length === 0) this.clearCanvas();
  }

  updateContext() {
    if (!this.ctx) return;
    this.ctx.strokeStyle = this.fillColor;
    this.ctx.fillStyle = this.fillColor;
    this.ctx.lineWidth = this.strokeSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    if (this.activeTool() === 'eraser') this.ctx.strokeStyle = '#ffffff';
  }

  setTool(tool: Tool) {
    this.activeTool.set(tool);
    this.isTyping = false;
    this.updateContext();
  }

  toggleGrid() { this.showGrid = !this.showGrid; }

  // --- Drawing Handlers ---
  startDrawing(e: MouseEvent) {
    if (this.activeTool() === 'text') return this.startText(e);
    if (this.activeTool() === 'fill') return this.fill(e);
    if (this.activeTool() === 'picker') return this.pickColor(e);

    this.isDrawing = true;
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];

    if (['rect', 'circle', 'line', 'triangle', 'star', 'arrow', 'diamond', 'hexagon'].includes(this.activeTool())) {
      this.snapshot = this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    } else if (this.activeTool() === 'spray') {
      this.spray(e);
      this.sprayInterval = setInterval(() => this.spray(e), 20);
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
    }
  }

  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    if (this.activeTool() === 'spray') {
      [this.lastX, this.lastY] = [e.offsetX, e.offsetY]; // Update pos for interval
      return;
    }

    if (['pen', 'eraser'].includes(this.activeTool())) {
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    } else {
      // Shapes
      this.ctx.putImageData(this.snapshot!, 0, 0);
      this.ctx.beginPath();
      this.drawShape(e);
      this.ctx.stroke();
    }
  }

  drawShape(e: MouseEvent) {
    const tool = this.activeTool();
    const startX = this.lastX;
    const startY = this.lastY;
    const endX = e.offsetX;
    const endY = e.offsetY;
    const w = endX - startX;
    const h = endY - startY;

    if (tool === 'rect') this.ctx.rect(startX, startY, w, h);
    else if (tool === 'circle') {
      const r = Math.sqrt(w * w + h * h);
      this.ctx.arc(startX, startY, r, 0, 2 * Math.PI);
    }
    else if (tool === 'line') {
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
    }
    else if (tool === 'triangle') {
      this.ctx.moveTo(startX + w / 2, startY);       // Top
      this.ctx.lineTo(startX, startY + h);         // Bottom Left
      this.ctx.lineTo(startX + w, startY + h);     // Bottom Right
      this.ctx.closePath();
    }
    else if (tool === 'arrow') {
      const headlen = 15; // length of head in pixels
      const angle = Math.atan2(endY - startY, endX - startX);
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
      this.ctx.moveTo(endX, endY);
      this.ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
    }
    else if (tool === 'diamond') {
      this.ctx.moveTo(startX + w / 2, startY);
      this.ctx.lineTo(startX + w, startY + h / 2);
      this.ctx.lineTo(startX + w / 2, startY + h);
      this.ctx.lineTo(startX, startY + h / 2);
      this.ctx.closePath();
    }
    else if (tool === 'star') this.drawPoly(startX + w / 2, startY + h / 2, 5, Math.max(Math.abs(w), Math.abs(h)) / 2, 0.5);
    else if (tool === 'hexagon') this.drawPoly(startX + w / 2, startY + h / 2, 6, Math.max(Math.abs(w), Math.abs(h)) / 2, 0);
  }

  drawPoly(x: number, y: number, p: number, r: number, inset: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    for (let i = 0; i < p; i++) {
      this.ctx.lineTo(0, 0 - r);
      this.ctx.rotate(Math.PI / p);
      if (inset > 0) {
        this.ctx.lineTo(0, 0 - (r * inset));
        this.ctx.rotate(Math.PI / p);
      } else {
        this.ctx.rotate(Math.PI / p);
      }
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }

  stopDrawing() {
    if (this.sprayInterval) clearInterval(this.sprayInterval);
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();
    this.saveHistory();
  }

  // --- Tools Logic ---
  spray(e: MouseEvent) {
    const radius = this.strokeSize * 2;
    const density = 20;

    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 2;
      const offsetY = (Math.random() - 0.5) * radius * 2;
      if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
        this.ctx.fillRect(this.lastX + offsetX, this.lastY + offsetY, 1, 1);
      }
    }
  }

  pickColor(e: MouseEvent) {
    const data = this.ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    const hex = '#' + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
    this.fillColor = hex;
    this.setTool('pen'); // Switch back to pen
  }

  handleImage(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          // Center image
          const x = (this.canvasRef.nativeElement.width - img.width) / 2;
          const y = (this.canvasRef.nativeElement.height - img.height) / 2;
          this.ctx.drawImage(img, Math.max(0, x), Math.max(0, y));
          this.saveHistory();
        };
        img.src = evt.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Text, Fill, History, Clear, Save (Same as before)
  startText(e: MouseEvent) {
    if (this.isTyping) { this.finishText(); return; }
    this.isTyping = true;
    this.textX = e.offsetX;
    this.textY = e.offsetY;
    setTimeout(() => { if (this.textInputRef) this.textInputRef.nativeElement.focus(); });
  }

  finishText() {
    if (!this.isTyping) return;
    const input = this.textInputRef.nativeElement;
    if (input.value.trim()) {
      this.ctx.font = `${this.strokeSize * 2}px sans-serif`;
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fillText(input.value, this.textX, this.textY + (this.strokeSize * 2));
      this.saveHistory();
    }
    input.value = '';
    this.isTyping = false;
  }

  fill(e: MouseEvent) {
    // (Scanning logic same as previous implementation)
    const x = Math.floor(e.offsetX);
    const y = Math.floor(e.offsetY);
    const width = this.canvasRef.nativeElement.width;
    const height = this.canvasRef.nativeElement.height;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const targetIdx = (y * width + x) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];
    const fillR = parseInt(this.fillColor.slice(1, 3), 16);
    const fillG = parseInt(this.fillColor.slice(3, 5), 16);
    const fillB = parseInt(this.fillColor.slice(5, 7), 16);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      let pixelIdx = (cy * width + cx) * 4;
      let y1 = cy;
      while (y1 >= 0 && data[pixelIdx] === targetR && data[pixelIdx + 1] === targetG && data[pixelIdx + 2] === targetB) {
        y1--; pixelIdx -= width * 4;
      }
      y1++;
      let spanLeft = false; let spanRight = false;
      while (y1 < height && data[(y1 * width + cx) * 4] === targetR && data[(y1 * width + cx) * 4 + 1] === targetG && data[(y1 * width + cx) * 4 + 2] === targetB) {
        const idx = (y1 * width + cx) * 4;
        data[idx] = fillR; data[idx + 1] = fillG; data[idx + 2] = fillB; data[idx + 3] = 255;
        if (cx > 0) {
          if (data[idx - 4] === targetR && data[idx - 3] === targetG && data[idx - 2] === targetB) {
            if (!spanLeft) { stack.push([cx - 1, y1]); spanLeft = true; }
          } else if (spanLeft) spanLeft = false;
        }
        if (cx < width - 1) {
          if (data[idx + 4] === targetR && data[idx + 5] === targetG && data[idx + 6] === targetB) {
            if (!spanRight) { stack.push([cx + 1, y1]); spanRight = true; }
          } else if (spanRight) spanRight = false;
        }
        y1++;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.saveHistory();
  }

  saveHistory() {
    if (this.history.length > 20) { this.history.shift(); this.historyStep--; }
    if (this.historyStep < this.history.length - 1) this.history = this.history.slice(0, this.historyStep + 1);
    this.history.push(this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height));
    this.historyStep++;
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      this.ctx.putImageData(this.history[this.historyStep], 0, 0);
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.saveHistory();
  }

  saveCanvas() {
    const link = document.createElement('a');
    link.download = 'art-studio.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }
}
