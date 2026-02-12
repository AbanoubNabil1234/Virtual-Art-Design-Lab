import { Injectable, signal } from '@angular/core';

export interface Reply {
    id: number;
    author: string;
    content: string;
    date: string;
    avatar?: string;
}

export interface Topic {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
    replies: Reply[];
    isPinned: boolean;
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ForumService {
    private topics = signal<Topic[]>([
        {
            id: 1,
            title: 'أسس التصميم في الفن الرقمي: التوازن والإيقاع',
            author: 'أحمد عدنان ياسين',
            date: '2024-02-12 10:30:00',
            views: 45,
            isPinned: true,
            replies: [
                {
                    id: 1,
                    author: 'المعلم محمد أحمد',
                    content: 'موضوع رائع يا أحمد. التوازن هو أساس أي عمل فني ناجح، خاصة في البيئة الرقمية.',
                    date: '2024-02-12 11:00:00'
                }
            ],
            avatar: 'assets/avatars/admin.png'
        },
        {
            id: 2,
            title: 'استخدام النقطة والخط كعناصر تكوين في المعمل الافتراضي',
            author: 'خالد (طالب)',
            date: '2024-02-11 15:15:04',
            views: 32,
            isPinned: true,
            replies: [],
            avatar: 'assets/avatars/student1.png'
        },
        {
            id: 3,
            title: 'كيفية تحقيق الانسجام اللوني في التصميمات الرقمية؟',
            author: 'سارة محمد',
            date: '2024-02-10 09:13:39',
            views: 28,
            isPinned: false,
            replies: [],
            avatar: 'assets/avatars/student2.png'
        },
        {
            id: 4,
            title: 'تطبيقات الفن التشكيلي المعاصر باستخدام الأدوات الرقمية',
            author: 'أستاذة ليلى علي',
            date: '2024-02-09 14:12:39',
            views: 56,
            isPinned: false,
            replies: [],
            avatar: 'assets/avatars/teacher1.png'
        },
        {
            id: 5,
            title: 'الفرق بين الأشكال العضوية والهندسية في التصميم الاستكشافي',
            author: 'يوسف حسن',
            date: '2024-02-08 12:11:52',
            views: 19,
            isPinned: false,
            replies: [],
            avatar: 'assets/avatars/student3.png'
        }
    ]);

    getTopics() {
        return this.topics;
    }

    getTopic(id: number) {
        return this.topics().find(t => t.id === id);
    }

    addTopic(title: string, author: string, content: string) {
        const newTopic: Topic = {
            id: this.topics().length + 1,
            title,
            author,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            views: 0,
            isPinned: false,
            replies: [] // In a real app, content would be separate or first post
        };
        // For simplicity, we ignore content field in the list, but effectively it's the title/desc
        this.topics.update(list => [newTopic, ...list]);
    }

    addReply(topicId: number, author: string, content: string) {
        this.topics.update(list => {
            const topic = list.find(t => t.id === topicId);
            if (topic) {
                topic.replies.push({
                    id: topic.replies.length + 1,
                    author,
                    content,
                    date: new Date().toISOString().slice(0, 19).replace('T', ' ')
                });
            }
            return [...list];
        });
    }
}
