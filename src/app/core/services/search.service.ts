import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';
import { ContentService } from './content.service';
import { QuestionBankService } from './question-bank.service';
import { NotepadService } from './notepad.service';
import { ForumService } from './forum.service';

export interface SearchResult {
    title: string;
    description: string;
    type: 'صفحات الكتاب' | 'المنتدى' | 'المفكرة' | 'بنك الأسئلة';
    route: string;
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private contentService = inject(ContentService);
    private qbService = inject(QuestionBankService);
    private notepadService = inject(NotepadService);
    private forumService = inject(ForumService);

    search(query: string): Observable<SearchResult[]> {
        if (!query.trim()) return of([]);

        const q = query.toLowerCase();

        // 1. Content Pages
        const contentResults = this.contentService.searchContent(q).map(p => ({
            title: p.title,
            description: p.content.substring(0, 100) + '...',
            type: 'صفحات الكتاب' as const,
            route: p.route
        }));

        // 2. Question Bank
        const qbResults = this.qbService.getQuestions()().filter(quest =>
            quest.text.includes(q) || quest.category.includes(q)
        ).map(quest => ({
            title: `سؤال: ${quest.category}`,
            description: quest.text.substring(0, 100) + '...',
            type: 'بنك الأسئلة' as const,
            route: '/question-bank'
        }));

        // 3. Notepad
        const noteResults = this.notepadService.notes().filter(n =>
            (n.title && n.title.includes(q)) || n.content.includes(q)
        ).map(n => ({
            title: n.title || 'ملاحظة بدون عنوان',
            description: n.content.substring(0, 100) + '...',
            type: 'المفكرة' as const,
            route: '/notepad' //Ideally route to specific note if possible
        }));

        // 4. Forum (Assuming sync for now or mock)
        const topicResults = this.forumService.getTopics()().filter(t =>
            t.title.includes(q) || t.author.includes(q)
        ).map(t => ({
            title: t.title,
            description: `بواسطة ${t.author}`,
            type: 'المنتدى' as const,
            route: `/forum/${t.id}`
        }));

        // Combine all
        return of([
            ...contentResults,
            ...qbResults,
            ...noteResults,
            ...topicResults
        ]);
    }
}
