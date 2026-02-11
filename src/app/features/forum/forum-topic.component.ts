import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ForumService, Topic } from '../../core/services/forum.service';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-forum-topic',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
    template: `
    <app-header></app-header>
    <div class="topic-container animate-fade-in" *ngIf="topic()">
        
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a routerLink="/" title="الرئيسية"><span class="material-icons" style="font-size: 1.1rem; vertical-align: middle;">home</span></a>
        <span class="separator">/</span>
        <a routerLink="/forum">المنتدى</a>
        <span class="separator">/</span>
        <span class="current">{{ topic()?.title }}</span>
      </div>

      <!-- Main Topic Post -->
      <div class="post-card main-post">
        <div class="post-header">
            <h1 class="post-title">{{ topic()?.title }}</h1>
            <span class="post-date">{{ topic()?.date }}</span>
        </div>
        <div class="post-body">
            <div class="user-sidebar">
                <div class="avatar-placeholder">
                    <span class="material-icons">person</span>
                </div>
                <div class="username">{{ topic()?.author }}</div>
                <div class="user-role">عضو</div>
            </div>
            <div class="post-content">
                <p>محتوى الموضوع الافتراضي...</p>
                <div class="attachments" *ngIf="topic()?.id === 1">
                    <span class="material-icons">attachment</span>
                    <span>ملف مرفق: TruthTable.pdf</span>
                </div>
            </div>
        </div>
      </div>

      <!-- Replies -->
      <div class="reply-card" *ngFor="let reply of topic()?.replies">
        <div class="post-header reply-header">
            <span class="reply-id">#{{ reply.id }}</span>
            <span class="post-date">{{ reply.date }}</span>
        </div>
        <div class="post-body">
            <div class="user-sidebar">
                <div class="avatar-placeholder">
                    <span class="material-icons">person</span>
                </div>
                <div class="username">{{ reply.author }}</div>
            </div>
            <div class="post-content">
                {{ reply.content }}
            </div>
        </div>
      </div>

      <!-- Reply Form -->
      <div class="reply-form">
        <h3>إضافة رد سريع</h3>
        <div class="editor-toolbar">
            <button class="tool-btn"><span class="material-icons">format_bold</span></button>
            <button class="tool-btn"><span class="material-icons">format_italic</span></button>
            <button class="tool-btn"><span class="material-icons">format_underline</span></button>
            <span class="divider"></span>
            <button class="tool-btn"><span class="material-icons">format_align_right</span></button>
            <button class="tool-btn"><span class="material-icons">format_align_center</span></button>
            <button class="tool-btn"><span class="material-icons">format_align_left</span></button>
            <span class="divider"></span>
            <button class="tool-btn"><span class="material-icons">image</span></button>
            <button class="tool-btn"><span class="material-icons">link</span></button>
        </div>
        <textarea [(ngModel)]="replyContent" placeholder="اكتب ردك هنا..."></textarea>
        <div class="form-actions">
            <input type="text" [(ngModel)]="replyAuthor" placeholder="الاسم" class="author-input">
            <button (click)="addReply()" class="btn-submit">إرسال الرد</button>
        </div>
      </div>

    </div>
  `,
    styles: [`
    .topic-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .breadcrumb {
        margin-bottom: 20px;
        color: #7f8c8d;
        font-size: 0.95rem;
    }
    .breadcrumb a { text-decoration: none; color: #3498db; }
    .breadcrumb .separator { margin: 0 5px; }
    .breadcrumb .current { color: #2c3e50; font-weight: bold; }

    /* Post Card */
    .post-card, .reply-card {
        background: white;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .main-post { border-top: 4px solid #3498db; }

    .post-header {
        background: #ecf0f1;
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .reply-header { background: #f9f9f9; }

    .post-title { margin: 0; font-size: 1.2rem; color: #2c3e50; }
    .post-date { font-size: 0.85rem; color: #7f8c8d; dir: ltr; }

    .post-body { display: flex; min-height: 150px; }

    .user-sidebar {
        width: 180px;
        background: #fdfdfd;
        border-left: 1px solid #eee;
        padding: 15px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .avatar-placeholder {
        width: 60px; height: 60px;
        background: #bdc3c7;
        border-radius: 50%;
        display: flex; justify-content: center; align-items: center;
        color: white;
    }
    .username { color: #2980b9; font-weight: bold; font-size: 0.95rem; }
    .user-role { font-size: 0.8rem; background: #95a5a6; color: white; padding: 2px 8px; border-radius: 10px; }

    .post-content {
        flex: 1;
        padding: 20px;
        line-height: 1.6;
        color: #333;
    }

    .attachments {
        margin-top: 20px;
        padding: 10px;
        background: #fff8e1;
        border: 1px dashed #f1c40f;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.9rem;
        color: #d35400;
    }

    /* Reply Form */
    .reply-form {
        background: white;
        border: 1px solid #dcdcdc;
        padding: 20px;
        border-radius: 4px;
    }
    
    .editor-toolbar {
        background: #ecf0f1;
        padding: 5px;
        border: 1px solid #ddd;
        border-bottom: none;
        display: flex;
        gap: 2px;
    }
    .tool-btn {
        background: white; border: 1px solid #ccc; cursor: pointer;
        width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;
    }
    .tool-btn:hover { background: #e0e0e0; }
    
    textarea {
        width: 100%;
        height: 120px;
        border: 1px solid #ddd;
        padding: 10px;
        resize: vertical;
        font-family: inherit;
    }

    .form-actions {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    
    .author-input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 200px;
    }

    .btn-submit {
        background: #27ae60;
        color: white;
        border: none;
        padding: 8px 25px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    .btn-submit:hover { background: #219150; }
  `]
})
export class ForumTopicComponent {
    route = inject(ActivatedRoute);
    forumService = inject(ForumService);

    topicId = Number(this.route.snapshot.paramMap.get('id'));
    topic = computed(() => this.forumService.getTopic(this.topicId));

    replyAuthor = '';
    replyContent = '';

    addReply() {
        if (this.replyAuthor && this.replyContent) {
            this.forumService.addReply(this.topicId, this.replyAuthor, this.replyContent);
            this.replyContent = '';
        }
    }
}
