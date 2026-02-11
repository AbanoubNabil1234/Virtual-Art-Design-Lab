import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ForumService } from '../../core/services/forum.service';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="forum-container animate-fade-in">
      
      <!-- Forum Header -->
      <div class="forum-header">
        <div class="logo-area">
          <a routerLink="/" class="home-icon" title="الرئيسية">
            <span class="material-icons">home</span>
          </a>
          <span class="material-icons forum-icon">forum</span>
          <h1>الــمــنــتــدى</h1>
        </div>
        <div class="search-box">
          <span class="material-icons">search</span>
          <input type="text" placeholder="ابحث هنا..." [(ngModel)]="searchQuery">
        </div>
        <button class="add-topic-btn" (click)="showNewTopicModal = true">
          <span class="material-icons">add_circle</span>
          إضافة موضوع
        </button>
      </div>

      <!-- Topics Table -->
      <div class="forum-table-wrapper">
        <table class="forum-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-title">عنوان الموضوع</th>
              <th class="col-author">بواسطة</th>
              <th class="col-date">التاريخ</th>
              <th class="col-stats">المشاهدات</th>
              <th class="col-stats">الردود</th>
              <th class="col-last">آخر مشاركة</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let topic of filteredTopics()" class="topic-row">
              <td class="col-icon">
                <span class="material-icons pinned" *ngIf="topic.isPinned">push_pin</span>
                <span class="material-icons" *ngIf="!topic.isPinned">description</span>
              </td>
              <td class="col-title">
                <a [routerLink]="['/forum', topic.id]" class="topic-link">{{ topic.title }}</a>
              </td>
              <td class="col-author">
                <div class="author-info">
                  <span class="material-icons">person</span>
                  {{ topic.author }}
                </div>
              </td>
              <td class="col-date">{{ topic.date }}</td>
              <td class="col-stats">{{ topic.views }}</td>
              <td class="col-stats">{{ topic.replies.length }}</td>
              <td class="col-last">{{ topic.date }}</td> <!-- Simplification -->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Stats -->
      <div class="forum-footer">
        <div class="stat-item">
            <span class="material-icons">topic</span>
            عدد المواضيع: {{ forumService.getTopics()().length }}
        </div>
      </div>

      <!-- New Topic Modal -->
      <div class="modal-overlay" *ngIf="showNewTopicModal" (click)="showNewTopicModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
            <h2>موضوع جديد</h2>
            <input type="text" placeholder="عنوان الموضوع" [(ngModel)]="newTopicTitle" class="input-field">
            <input type="text" placeholder="الاسم" [(ngModel)]="newTopicAuthor" class="input-field">
            <textarea placeholder="المحتوى..." [(ngModel)]="newTopicContent" class="textarea-field"></textarea>
            <div class="modal-actions">
                <button (click)="addTopic()" class="btn-primary">نشر</button>
                <button (click)="showNewTopicModal = false" class="btn-secondary">إلغاء</button>
            </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .forum-container {
      padding: 20px;
      background: #fdfdfd;
      min-height: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Header */
    .forum-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(to bottom, #dce4ec, #c8d3e0);
      padding: 15px 20px;
      border-radius: 8px 8px 0 0;
      border: 1px solid #b5c3d3;
      margin-bottom: 0;
    }

    .logo-area {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #2c3e50;
    }
    .home-icon {
        color: #7f8c8d;
        text-decoration: none;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: color 0.2s;
    }
    .home-icon:hover { color: #e74c3c; }
    .forum-icon { font-size: 32px; color: #34495e; }
    h1 { margin: 0; font-size: 1.5rem; color: #2c3e50; font-weight: bold; }

    .search-box {
        display: flex;
        align-items: center;
        background: white;
        padding: 5px 10px;
        border-radius: 20px;
        border: 1px solid #ccc;
        width: 300px;
    }
    .search-box input { border: none; outline: none; width: 100%; margin-right: 5px; }

    .add-topic-btn {
        background: #3498db;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: bold;
    }
    .add-topic-btn:hover { background: #2980b9; }

    /* Table */
    .forum-table-wrapper {
        border: 1px solid #b5c3d3;
        border-top: none;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .forum-table {
        width: 100%;
        border-collapse: collapse;
    }

    .forum-table th {
        background: #ecf0f1;
        padding: 12px;
        text-align: right;
        color: #555;
        font-weight: bold;
        border-bottom: 2px solid #ddd;
    }

    .forum-table td {
        padding: 12px;
        border-bottom: 1px solid #eee;
        color: #333;
    }

    .topic-row:hover { background: #f9f9f9; }

    .col-icon { width: 40px; text-align: center; }
    .col-title { font-weight: bold; font-size: 1.05rem; }
    .topic-link { text-decoration: none; color: #2c3e50; transition: color 0.2s; }
    .topic-link:hover { color: #3498db; text-decoration: underline; }

    .author-info { display: flex; align-items: center; gap: 5px; font-size: 0.9rem; color: #7f8c8d; }
    .col-date, .col-last { font-size: 0.85rem; color: #95a5a6; dir: ltr; }
    .col-stats { text-align: center; font-weight: bold; color: #2c3e50; }

    .pinned { color: #e67e22; transform: rotate(45deg); }

    /* Footer */
    .forum-footer {
        padding: 15px;
        background: #ecf0f1;
        border: 1px solid #b5c3d3;
        border-top: none;
        border-radius: 0 0 8px 8px;
        color: #555;
    }

    /* Modal */
    .modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex; justify-content: center; align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background: white; padding: 25px; border-radius: 8px; width: 500px;
        display: flex; flex-direction: column; gap: 15px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .input-field { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .textarea-field { padding: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 150px; resize: vertical; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .btn-primary { background: #3498db; color: white; padding: 8px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-secondary { background: #95a5a6; color: white; padding: 8px 20px; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class ForumComponent {
  forumService = inject(ForumService);
  searchQuery = '';

  showNewTopicModal = false;
  newTopicTitle = '';
  newTopicAuthor = '';
  newTopicContent = '';

  filteredTopics() {
    const query = this.searchQuery.toLowerCase();
    return this.forumService.getTopics()().filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.author.toLowerCase().includes(query)
    );
  }

  addTopic() {
    if (this.newTopicTitle && this.newTopicAuthor) {
      this.forumService.addTopic(this.newTopicTitle, this.newTopicAuthor, this.newTopicContent);
      this.showNewTopicModal = false;
      this.newTopicTitle = '';
      this.newTopicAuthor = '';
      this.newTopicContent = '';
    }
  }
}
