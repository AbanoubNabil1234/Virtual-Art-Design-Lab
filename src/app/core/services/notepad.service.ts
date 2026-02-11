import { Injectable, signal, effect } from '@angular/core';

export interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotepadService {
    private STORAGE_KEY = 'physics_lab_notes';
    notes = signal<Note[]>([]);
    activeNoteId = signal<string | null>(null);

    constructor() {
        this.loadNotes();

        // Auto-save effect
        effect(() => {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes()));
        });
    }

    private loadNotes() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            this.notes.set(JSON.parse(saved));
        } else {
            // Default welcome note
            this.addNote('مرحباً بك في المفكرة', 'هنا يمكنك تدوين ملاحظاتك وأفكارك حول التجارب والدروس.\n\n- اضغط على "ملاحظة جديدة" للبدء.\n- سيتم حفظ كل شيء تلقائياً.');
        }
    }

    getNotes() {
        return this.notes;
    }

    getActiveNote() {
        return this.notes().find(n => n.id === this.activeNoteId());
    }

    setActiveNote(id: string) {
        this.activeNoteId.set(id);
    }

    addNote(title: string = 'ملاحظة جديدة', content: string = '') {
        const newNote: Note = {
            id: Date.now().toString(),
            title,
            content,
            updatedAt: new Date().toISOString()
        };
        this.notes.update(notes => [newNote, ...notes]);
        this.activeNoteId.set(newNote.id);
    }

    updateNote(id: string, title: string, content: string) {
        this.notes.update(notes =>
            notes.map(n => n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n)
        );
    }

    deleteNote(id: string) {
        this.notes.update(notes => notes.filter(n => n.id !== id));
        if (this.activeNoteId() === id) {
            this.activeNoteId.set(null);
        }
    }
}
