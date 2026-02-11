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
            title: 'جدول الحقيقة (الصواب) Truth Table لبوابة (أو) OR',
            author: 'م/ السيد محمد السيد',
            date: '2014-03-14 15:21:38',
            views: 6,
            isPinned: true,
            replies: [],
            avatar: 'assets/avatars/admin.png'
        },
        {
            id: 2,
            title: 'الرمز المنطقي لبوابة (أو) OR',
            author: 'م/ السيد محمد السيد',
            date: '2014-03-14 15:15:04',
            views: 4,
            isPinned: true,
            replies: [],
            avatar: 'assets/avatars/admin.png'
        },
        {
            id: 3,
            title: 'جدول الحقيقة (الصواب) Truth Table لبوابة (و) AND',
            author: 'محمد أحمد محمود',
            date: '2014-03-14 15:13:39',
            views: 7,
            isPinned: false,
            replies: [],
            avatar: 'assets/avatars/user1.png'
        },
        {
            id: 4,
            title: 'تنفيذ دائرة إلكترونية لتحقيق جدول الحقيقة لبوابة (و) AND باستخدام المفاتيح',
            author: 'محمد أحمد محمود',
            date: '2014-03-14 15:12:39',
            views: 3,
            isPinned: false,
            replies: [],
            avatar: 'assets/avatars/user1.png'
        },
        {
            id: 5,
            title: 'تمثيل بوابة (و) AND في دائرة كهربية',
            author: 'محمد أحمد محمود',
            date: '2014-03-14 15:11:52',
            views: 5,
            isPinned: false,
            replies: [],
            avatar: 'assets/avatars/user1.png'
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
