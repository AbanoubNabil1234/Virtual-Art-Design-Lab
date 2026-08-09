import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotepadService } from '../../core/services/notepad.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-notepad',
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderComponent, RouterLink],
    template: `
    <app-header></app-header>
    <div class="notepad-container animate-fade-in">
        
        <!-- Sidebar: Notes List -->
        <div class="notes-sidebar">
            <div class="sidebar-header">
                <h2>المفكرة</h2>
                <button (click)="notepadService.addNote()" class="add-btn" title="ملاحظة جديدة">
                    <span class="material-icons">add</span>
                </button>
            </div>
            
            <div class="search-box">
                <span class="material-icons">search</span>
                <input type="text" placeholder="بحث..." [(ngModel)]="searchQuery"> 
            </div>

            <div class="notes-list">
                <div *ngFor="let note of filteredNotes()" 
                     class="note-card" 
                     [class.active]="notepadService.activeNoteId() === note.id"
                     (click)="setActive(note.id)">
                    <div class="note-title">{{ note.title || 'بدون عنوان' }}</div>
                    <div class="note-preview">{{ getPreview(note.content) }}</div>
                    <div class="note-date">{{ note.updatedAt | date:'shortDate' }}</div>
                    <button class="delete-btn" (click)="deleteNote($event, note.id)" title="حذف">
                        <span class="material-icons">delete_outline</span>
                    </button>
                </div>
                
                <div *ngIf="filteredNotes().length === 0" class="empty-state">
                    لا توجد ملاحظات
                </div>
            </div>
        </div>

        <!-- Main: Editor -->
        <div class="editor-area" *ngIf="notepadService.activeNoteId(); else noSelection">
            <div class="editor-header">
                <input type="text" 
                       [ngModel]="activeNote()?.title" 
                       (ngModelChange)="updateTitle($event)" 
                       placeholder="عنوان الملاحظة"
                       class="title-input">
                <div class="save-indicator">
                    <span class="material-icons">cloud_done</span>
                    محفوظ
                </div>
            </div>
            <textarea 
                [ngModel]="activeNote()?.content" 
                (ngModelChange)="updateContent($event)" 
                placeholder="ابدا الكتابة هنا..."
                class="content-editor"></textarea>
        </div>

        <ng-template #noSelection>
            <div class="no-selection">
                <span class="material-icons big-icon">edit_note</span>
                <h3>اختر ملاحظة أو أنشئ واحدة جديدة</h3>
            </div>
        </ng-template>

    </div>
  `,
    styles: [`
    .notepad-container {
        display: flex;
        height: calc(100vh - 120px); /* Adjust based on header height approx */
        background: #fdfdfd;
        overflow: hidden;
    }

    /* Sidebar */
    .notes-sidebar {
        width: 300px;
        background: #f8f9fa;
        border-left: 1px solid #e9ecef;
        display: flex;
        flex-direction: column;
    }

    .sidebar-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .sidebar-header h2 { margin: 0; color: #343a40; font-size: 1.5rem; }

    .add-btn {
        background: #3498db;
        color: white;
        border: none;
        width: 40px; height: 40px;
        border-radius: 50%;
        display: flex; justify-content: center; align-items: center;
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .add-btn:hover { transform: scale(1.1); background: #2980b9; }

    .search-box {
        margin: 0 15px 15px;
        background: white;
        border: 1px solid #ced4da;
        border-radius: 8px;
        padding: 8px;
        display: flex; align-items: center; gap: 5px;
    }
    .search-box input { border: none; outline: none; width: 100%; background: transparent; }
    .search-box .material-icons { color: #adb5bd; }

    .notes-list {
        flex: 1;
        overflow-y: auto;
        padding: 0 10px;
    }

    .note-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s;
    }
    .note-card:hover { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .note-card.active { border-color: #3498db; background: #ebf5fb; }

    .note-title { font-weight: bold; color: #343a40; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left: 20px; }
    .note-preview { font-size: 0.85rem; color: #6c757d; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .note-date { font-size: 0.75rem; color: #adb5bd; }

    .delete-btn {
        position: absolute;
        top: 10px; left: 10px;
        background: none; border: none;
        color: #dc3545;
        opacity: 0;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
    }
    .note-card:hover .delete-btn { opacity: 1; }
    .delete-btn:hover { background: rgba(220, 53, 69, 0.1); }

    .empty-state { text-align: center; color: #adb5bd; padding-top: 50px; }

    /* Editor Area */
    .editor-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: white;
    }

    .editor-header {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f3f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title-input {
        font-size: 1.8rem;
        font-weight: bold;
        border: none;
        outline: none;
        width: 70%;
        color: #343a40;
    }

    .save-indicator {
        display: flex; align-items: center; gap: 5px;
        color: #27ae60; font-size: 0.9rem;
    }

    .content-editor {
        flex: 1;
        border: none;
        resize: none;
        outline: none;
        padding: 30px;
        font-size: 1.1rem;
        line-height: 1.6;
        color: #495057;
        font-family: inherit;
    }

    .no-selection {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #adb5bd;
    }
    .big-icon { font-size: 64px; margin-bottom: 20px; opacity: 0.5; }
  `]
})
export class NotepadComponent {
    notepadService = inject(NotepadService);
    searchQuery = '';

    activeNote = computed(() => this.notepadService.getActiveNote());

    filteredNotes() {
        return this.notepadService.getNotes()().filter(n =>
            n.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            n.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    setActive(id: string) {
        this.notepadService.setActiveNote(id);
    }

    updateTitle(newTitle: string) {
        const activeId = this.notepadService.activeNoteId();
        if (activeId) {
            this.notepadService.updateNote(activeId, newTitle, this.activeNote()!.content);
        }
    }

    updateContent(newContent: string) {
        const activeId = this.notepadService.activeNoteId();
        if (activeId) {
            this.notepadService.updateNote(activeId, this.activeNote()!.title, newContent);
        }
    }

    deleteNote(e: Event, id: string) {
        e.stopPropagation();
        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
            this.notepadService.deleteNote(id);
        }
    }

    getPreview(content: string): string {
        return content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }
}
