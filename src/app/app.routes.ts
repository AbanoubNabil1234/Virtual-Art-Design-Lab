import { Routes } from '@angular/router';
import { BookLayoutComponent } from './layout/book-layout/book-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: BookLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'module/:id',
                loadComponent: () => import('./features/module-page/module-page.component').then(m => m.ModulePageComponent)
            },
            {
                path: 'cover',
                loadComponent: () => import('./features/cover/cover.component').then(m => m.CoverComponent)
            },
            {
                path: 'general-goals',
                loadComponent: () => import('./features/goals/general-goals.component').then(m => m.GeneralGoalsComponent)
            },
            {
                path: 'definition/virtual-lab',
                loadComponent: () => import('./features/definitions/virtual-lab.component').then(m => m.VirtualLabComponent)
            },
            {
                path: 'definition/concepts',
                loadComponent: () => import('./features/definitions/design-concepts.component').then(m => m.DesignConceptsComponent)
            },
            {
                path: 'definition/skills',
                loadComponent: () => import('./features/definitions/design-skills.component').then(m => m.DesignSkillsComponent)
            },
            {
                path: 'performance-test',
                loadComponent: () => import('./features/performance-test/performance-test.component').then(m => m.PerformanceTestComponent)
            },
            {
                path: 'pre-test',
                loadComponent: () => import('./features/pre-test/pre-test.component').then(m => m.PreTestComponent)
            },
            {
                path: 'judging',
                loadComponent: () => import('./features/test-judging/test-judging.component').then(m => m.TestJudgingComponent)
            },
            {
                path: 'email',
                loadComponent: () => import('./features/email/email.component').then(m => m.EmailComponent)
            },
            {
                path: 'chat-room',
                loadComponent: () => import('./features/chat-room/chat-room.component').then(m => m.ChatRoomComponent)
            }
        ]
    },
    {
        path: 'lab',
        loadComponent: () => import('./features/lab/lab.component').then(m => m.LabComponent)
    },
    {
        path: 'forum',
        loadComponent: () => import('./features/forum/forum.component').then(m => m.ForumComponent)
    },
    {
        path: 'forum/:id',
        loadComponent: () => import('./features/forum/forum-topic.component').then(m => m.ForumTopicComponent)
    },
    {
        path: 'notepad',
        loadComponent: () => import('./features/notepad/notepad.component').then(m => m.NotepadComponent)
    },
    { path: '**', redirectTo: '' }
];
