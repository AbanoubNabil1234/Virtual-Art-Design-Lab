import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { TestsService } from './tests.service';
import { PerformanceTestService } from './performance-test.service';
import { ModuleService } from './module.service';
import { NotepadService } from './notepad.service';

export interface StudentProfile {
  fullName: string;
  studentId: string;
  academicGroup: string;
  avatarUrl: string;
  educationalVision: string;
  specialization?: string;
  academicYear?: string;
  supervisorName?: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface PortfolioArtwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Base64 Data URL
  createdAt: string;
  source: 'lab' | 'upload';
  category?: string;
}

export interface PortfolioBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'academic' | 'cognitive' | 'skill' | 'creative';
}

export interface PortfolioExportData {
  version: string;
  exportedAt: string;
  profile: StudentProfile;
  artworks: PortfolioArtwork[];
  tests: {
    pre: any;
    post: any;
    learningGainPct: number;
  };
  modulesProgress: Record<string, any>;
  performanceTasks: any[];
  notesCount: number;
}

const DEFAULT_PROFILE: StudentProfile = {
  fullName: 'أحمد محمود السعيد',
  studentId: '2026-ART-010',
  academicGroup: 'الصف الثاني الثانوي - المجموعة (أ)',
  avatarUrl: 'assets/portfolio/avatar-default.svg',
  educationalVision: 'السعي لاكتساب وتنمية المفاهيم والمهارات الفنية الإبداعية والتطبيقية في التصميم وبناء التكوينات التشكيلية الرقمية عبر المعمل الافتراضي.',
  specialization: 'التربية الفنية - المرحلة الثانوية',
  academicYear: 'العام الدراسي 2025 - 2026',
  supervisorName: 'إشراف الباحث: أ. أحمد عدنان ياسين',
  createdAt: new Date().toISOString(),
  lastUpdatedAt: new Date().toISOString()
};

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly PROFILE_STORAGE_KEY = 'virtual_art_lab_student_profile_v1';
  private readonly ARTWORKS_FALLBACK_KEY = 'virtual_art_lab_artworks_fallback_v1';
  private readonly DB_NAME = 'VirtualArtLabPortfolioDB';
  private readonly STORE_NAME = 'artworks';

  private testsService = inject(TestsService);
  private perfService = inject(PerformanceTestService);
  private moduleService = inject(ModuleService);
  private notepadService = inject(NotepadService);

  // Reactive State
  readonly profile = signal<StudentProfile>(this.loadProfileFromStorage());
  readonly artworks = signal<PortfolioArtwork[]>([]);
  readonly isDbReady = signal<boolean>(false);

  // Computed Integrations
  readonly preTest = computed(() => this.testsService.preTest());
  readonly postTest = computed(() => this.testsService.postTest());

  readonly cognitiveStats = computed(() => {
    const pre = this.preTest();
    const post = this.postTest();
    const preScore = pre.score || 0;
    const postScore = post.score || 0;
    const gain = post.completed ? Math.max(0, postScore - preScore) : 0;
    return {
      preCompleted: pre.completed,
      preScore,
      preDate: pre.completedAt,
      postCompleted: post.completed,
      postScore,
      postDate: post.completedAt,
      gain,
      hasGrowth: gain > 0
    };
  });

  readonly modulesStats = computed(() => {
    const state = this.moduleService.progressState();
    const allModules = this.moduleService.getModules();
    const totalCount = allModules.length;
    let completedCount = 0;

    const list = allModules.map(m => {
      const prog = state[m.id];
      const isDone = !!prog?.completed;
      if (isDone) completedCount++;
      return {
        id: m.id,
        title: m.titleAr,
        completed: isDone,
        score: prog?.score || 0,
        totalQuestions: prog?.totalQuestions || 0,
        completedAt: prog?.completedAt
      };
    });

    const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      totalCount,
      completedCount,
      completionPct,
      list
    };
  });

  readonly performanceStats = computed(() => {
    const tasks = this.perfService.tasks();
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const totalTimeSpentSeconds = tasks.reduce((sum, t) => sum + (t.timeSpentSeconds || 0), 0);
    const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      totalCount,
      completedCount,
      completionPct,
      totalTimeSpentSeconds,
      tasks
    };
  });

  readonly notesCount = computed(() => this.notepadService.notes().length);
  readonly notes = computed(() => this.notepadService.notes());

  // Achievement Badges dynamically calculated
  readonly badges = computed<PortfolioBadge[]>(() => {
    const profile = this.profile();
    const cog = this.cognitiveStats();
    const mod = this.modulesStats();
    const perf = this.performanceStats();
    const arts = this.artworks();

    return [
      {
        id: 'academic_identity',
        title: 'الهوية الأكاديمية',
        description: 'استكمال بيانات الطالب والرؤية التعليمية في ملف الإنجاز.',
        icon: 'badge',
        category: 'academic',
        unlocked: !!profile.fullName && profile.fullName !== DEFAULT_PROFILE.fullName
      },
      {
        id: 'pre_test_explorer',
        title: 'المستكشف المعرفي',
        description: 'إتمام جلسة الاختبار القبلي وقياس المعارف السابقة.',
        icon: 'psychology',
        category: 'cognitive',
        unlocked: cog.preCompleted,
        unlockedAt: cog.preDate
      },
      {
        id: 'post_test_master',
        title: 'إتقان مفاهيم التصميم',
        description: 'إتمام الاختبار البعدي بدرجة 80% أو أعلى.',
        icon: 'military_tech',
        category: 'cognitive',
        unlocked: cog.postCompleted && cog.postScore >= 80,
        unlockedAt: cog.postDate
      },
      {
        id: 'learning_growth',
        title: 'قفزة التميز المعرفي',
        description: 'تحقيق نمو معرفي وتطور ملحوظ بين الاختبارين القبلي والبعدي.',
        icon: 'trending_up',
        category: 'cognitive',
        unlocked: cog.gain >= 15
      },
      {
        id: 'modules_hero',
        title: 'سيد الموديولات التعليمية',
        description: 'إتمام واجتياز اختبارات جميع دروس المعمل التعليمية.',
        icon: 'school',
        category: 'academic',
        unlocked: mod.completedCount === mod.totalCount && mod.totalCount > 0
      },
      {
        id: 'first_canvas',
        title: 'فنان المعمل الرقمي',
        description: 'إنتاج وتوثيق أول عمل فني من المعمل الافتراضي في ملف الإنجاز.',
        icon: 'palette',
        category: 'creative',
        unlocked: arts.length >= 1
      },
      {
        id: 'creative_gallery',
        title: 'معرض الإبداع التشكيلي',
        description: 'حفظ 3 أعمال وتصميمات فنية أو أكثر داخل ملف الإنجاز.',
        icon: 'collections',
        category: 'creative',
        unlocked: arts.length >= 3
      },
      {
        id: 'skill_performer',
        title: 'المتقن المهاري',
        description: 'إنجاز مهام الأداء المهاري العملية بنجاح داخل المعمل.',
        icon: 'handyman',
        category: 'skill',
        unlocked: perf.completedCount >= 2
      },
      {
        id: 'reflective_mind',
        title: 'المفكر المتأمل',
        description: 'تدوين الملاحظات والأفكار النقدية في مفكرة المعمل.',
        icon: 'edit_note',
        category: 'creative',
        unlocked: this.notesCount() >= 2
      },
      {
        id: 'ultimate_designer',
        title: 'المصمم الافتراضي الشامل',
        description: 'استيفاء كافة مسارات المعمل (المعرفية، المهارية، والإنتاج الفني).',
        icon: 'workspace_premium',
        category: 'academic',
        unlocked: cog.postCompleted && mod.completionPct >= 70 && perf.completedCount >= 2 && arts.length >= 2
      }
    ];
  });

  readonly unlockedBadgesCount = computed(() => this.badges().filter(b => b.unlocked).length);

  // Overall Completion Percentage (Weighted)
  readonly overallCompletionScore = computed<number>(() => {
    let score = 0;
    const cog = this.cognitiveStats();
    const mod = this.modulesStats();
    const perf = this.performanceStats();
    const arts = this.artworks();

    // Profile completion: 10%
    if (this.profile().fullName) score += 10;
    // Pre-test completion: 10%
    if (cog.preCompleted) score += 10;
    // Modules progress: 30%
    score += Math.round(mod.completionPct * 0.30);
    // Skill performance tasks: 20%
    score += Math.round(perf.completionPct * 0.20);
    // Post-test: 20%
    if (cog.postCompleted) score += 20;
    // Artworks (at least 1 artwork = 5%, 2+ = 10%)
    if (arts.length >= 2) score += 10;
    else if (arts.length === 1) score += 5;

    return Math.min(100, Math.max(0, score));
  });

  constructor() {
    this.initDatabase();

    // Auto-save profile changes
    effect(() => {
      const p = this.profile();
      try {
        localStorage.setItem(this.PROFILE_STORAGE_KEY, JSON.stringify(p));
      } catch (err) {
        console.warn('Failed to save profile to localStorage', err);
      }
    });
  }

  // --- Profile Management ---
  private loadProfileFromStorage(): StudentProfile {
    try {
      const saved = localStorage.getItem(this.PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName === 'طالب معمل التصميم الافتراضي') {
          parsed.fullName = DEFAULT_PROFILE.fullName;
          parsed.academicGroup = DEFAULT_PROFILE.academicGroup;
          parsed.supervisorName = DEFAULT_PROFILE.supervisorName;
          parsed.specialization = DEFAULT_PROFILE.specialization;
          parsed.educationalVision = DEFAULT_PROFILE.educationalVision;
        }
        // Auto-migrate old "الجامعي" references to "الدراسي"
        if (parsed.academicYear && parsed.academicYear.includes('الجامعي')) {
          parsed.academicYear = parsed.academicYear.replace(/الجامعي/g, 'الدراسي');
        }
        if (!parsed.academicYear) {
          parsed.academicYear = DEFAULT_PROFILE.academicYear;
        }
        const profile = { ...DEFAULT_PROFILE, ...parsed };
        try {
          localStorage.setItem(this.PROFILE_STORAGE_KEY, JSON.stringify(profile));
        } catch {}
        return profile;
      }
    } catch (e) {
      console.error('Error loading portfolio profile:', e);
    }
    return { ...DEFAULT_PROFILE };
  }

  updateProfile(updates: Partial<StudentProfile>) {
    this.profile.update(current => ({
      ...current,
      ...updates,
      lastUpdatedAt: new Date().toISOString()
    }));
  }

  // --- IndexedDB Artwork Storage ---
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported'));
        return;
      }
      const request = window.indexedDB.open(this.DB_NAME, 1);

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async initDatabase() {
    try {
      const db = await this.openDB();
      db.close();
      this.isDbReady.set(true);
      await this.loadArtworks();
    } catch (err) {
      console.warn('IndexedDB unavailable, using localStorage fallback', err);
      this.loadArtworksFromFallback();
    }
  }

  async loadArtworks(): Promise<PortfolioArtwork[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const list: PortfolioArtwork[] = req.result || [];
          // Sort descending by date
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.artworks.set(list);
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      return this.loadArtworksFromFallback();
    }
  }

  async addArtwork(artwork: Omit<PortfolioArtwork, 'id' | 'createdAt'>): Promise<PortfolioArtwork> {
    const newArt: PortfolioArtwork = {
      ...artwork,
      id: 'art_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };

    try {
      const db = await this.openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.put(newArt);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      await this.loadArtworks();
    } catch (err) {
      // Fallback
      const current = this.artworks();
      const updated = [newArt, ...current];
      this.artworks.set(updated);
      this.saveArtworksToFallback(updated);
    }

    return newArt;
  }

  async updateArtwork(id: string, updates: Partial<PortfolioArtwork>): Promise<void> {
    const item = this.artworks().find(a => a.id === id);
    if (!item) return;

    const updatedItem = { ...item, ...updates };

    try {
      const db = await this.openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.put(updatedItem);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      await this.loadArtworks();
    } catch (err) {
      const updatedList = this.artworks().map(a => a.id === id ? updatedItem : a);
      this.artworks.set(updatedList);
      this.saveArtworksToFallback(updatedList);
    }
  }

  async deleteArtwork(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      await this.loadArtworks();
    } catch (err) {
      const updatedList = this.artworks().filter(a => a.id !== id);
      this.artworks.set(updatedList);
      this.saveArtworksToFallback(updatedList);
    }
  }

  private loadArtworksFromFallback(): PortfolioArtwork[] {
    try {
      const saved = localStorage.getItem(this.ARTWORKS_FALLBACK_KEY);
      if (saved) {
        const list: PortfolioArtwork[] = JSON.parse(saved);
        this.artworks.set(list);
        return list;
      }
    } catch (e) {
      console.warn('Failed to load fallback artworks', e);
    }
    return [];
  }

  private saveArtworksToFallback(list: PortfolioArtwork[]) {
    try {
      localStorage.setItem(this.ARTWORKS_FALLBACK_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage quota exceeded in fallback storage', e);
    }
  }

  // --- Export & Import ---
  generateExportData(): PortfolioExportData {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.profile(),
      artworks: this.artworks(),
      tests: {
        pre: this.preTest(),
        post: this.postTest(),
        learningGainPct: this.cognitiveStats().gain
      },
      modulesProgress: this.moduleService.progressState(),
      performanceTasks: this.perfService.tasks(),
      notesCount: this.notesCount()
    };
  }

  exportPortfolioFile() {
    const data = this.generateExportData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const studentNameClean = (this.profile().fullName || 'طالب').replace(/\s+/g, '_');
    const filename = `ملف_انجاز_${studentNameClean}_${new Date().toISOString().slice(0, 10)}.labportfolio`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async importPortfolioFile(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const text = await file.text();
      const parsed: PortfolioExportData = JSON.parse(text);

      if (!parsed.profile || !parsed.version) {
        return { success: false, message: 'صيغة الملف غير صالحة أو تالفة.' };
      }

      // Update Profile
      if (parsed.profile) {
        if (parsed.profile.academicYear && parsed.profile.academicYear.includes('الجامعي')) {
          parsed.profile.academicYear = parsed.profile.academicYear.replace(/الجامعي/g, 'الدراسي');
        }
        this.profile.set(parsed.profile);
      }

      // Import Artworks into IndexedDB
      if (Array.isArray(parsed.artworks)) {
        for (const art of parsed.artworks) {
          try {
            await this.addArtwork({
              title: art.title || 'لوحة فنية مستوردة',
              description: art.description || '',
              imageUrl: art.imageUrl,
              source: art.source || 'upload',
              category: art.category || 'أعمال التصميم'
            });
          } catch (e) {
            console.error('Error importing artwork:', e);
          }
        }
      }

      return {
        success: true,
        message: `تم استيراد ملف الإنجاز بنجاح للطالب: ${parsed.profile.fullName}`
      };
    } catch (err: any) {
      return { success: false, message: 'حدث خطأ أثناء قراءة الملف: ' + (err.message || 'خطأ غير متوقع') };
    }
  }

  // --- Official PDF / Print Action ---
  printOfficialReport() {
    window.print();
  }
}
