import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PortfolioService, PortfolioArtwork, StudentProfile } from '../../core/services/portfolio.service';
import { ButtonSoundService } from '../../core/services/button-sound.service';

type PortfolioTab = 'overview' | 'modules' | 'performance' | 'artworks' | 'badges' | 'notes';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  portfolioService = inject(PortfolioService);
  soundService = inject(ButtonSoundService);

  activeTab = signal<PortfolioTab>('overview');

  // Modals
  showEditProfileModal = signal<boolean>(false);
  showAddArtworkModal = signal<boolean>(false);
  selectedArtwork = signal<PortfolioArtwork | null>(null);

  // Edit Profile Form State
  profileForm: StudentProfile = { ...this.portfolioService.profile() };

  // New Artwork Form State
  newArtworkTitle = '';
  newArtworkDescription = '';
  newArtworkCategory = 'تصميم عناصر تشكيلية';
  newArtworkImageBase64 = '';

  // Import Status Feedback
  importStatus = signal<{ message: string; isError: boolean } | null>(null);

  // Switch Tabs with sound effect
  setTab(tab: PortfolioTab) {
    this.soundService.playClick();
    this.activeTab.set(tab);
  }

  // Profile Edit
  openEditProfile() {
    this.soundService.playClick();
    this.profileForm = { ...this.portfolioService.profile() };
    this.showEditProfileModal.set(true);
  }

  saveProfile() {
    this.soundService.playClick();
    this.portfolioService.updateProfile(this.profileForm);
    this.showEditProfileModal.set(false);
  }

  handleAvatarUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileForm.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Artwork Actions
  openAddArtworkModal() {
    this.soundService.playClick();
    this.newArtworkTitle = '';
    this.newArtworkDescription = '';
    this.newArtworkCategory = 'تصميم عناصر تشكيلية';
    this.newArtworkImageBase64 = '';
    this.showAddArtworkModal.set(true);
  }

  handleArtworkUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newArtworkImageBase64 = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveNewArtwork() {
    if (!this.newArtworkImageBase64 || !this.newArtworkTitle) {
      alert('يرجى اختيار صورة وكتابة عنوان للعمل الفني.');
      return;
    }

    this.soundService.playClick();
    await this.portfolioService.addArtwork({
      title: this.newArtworkTitle,
      description: this.newArtworkDescription,
      category: this.newArtworkCategory,
      imageUrl: this.newArtworkImageBase64,
      source: 'upload'
    });

    this.showAddArtworkModal.set(false);
  }

  viewArtwork(artwork: PortfolioArtwork) {
    this.soundService.playClick();
    this.selectedArtwork.set(artwork);
  }

  async deleteArtwork(id: string) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا العمل الفني من ملف الإنجاز؟')) {
      this.soundService.playClick();
      await this.portfolioService.deleteArtwork(id);
      if (this.selectedArtwork()?.id === id) {
        this.selectedArtwork.set(null);
      }
    }
  }

  // Export / Import
  exportPortfolio() {
    this.soundService.playClick();
    this.portfolioService.exportPortfolioFile();
  }

  triggerImportInput(inputElement: HTMLInputElement) {
    this.soundService.playClick();
    inputElement.click();
  }

  async handleImportFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const res = await this.portfolioService.importPortfolioFile(file);
    this.importStatus.set({
      message: res.message,
      isError: !res.success
    });

    setTimeout(() => {
      this.importStatus.set(null);
    }, 5000);

    // Reset input
    (event.target as HTMLInputElement).value = '';
  }

  printReport() {
    this.soundService.playClick();
    this.portfolioService.printOfficialReport();
  }

  formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} دقيقة و ${secs} ثانية`;
  }

  formatDate(isoDate?: string): string {
    if (!isoDate) return 'لم يحدد بعد';
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return isoDate;
    }
  }
}
