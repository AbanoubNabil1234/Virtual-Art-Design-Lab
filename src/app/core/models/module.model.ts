export interface ModuleSlideDeck {
    id: string;
    titleAr: string;
    subtitleAr: string;
    fileName: string;
    slides: string[];
}

export interface DesignModule {
    id: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    topics: string[];
    iconName: string;
    experimentSteps?: string[];
    slides?: string[];
    slideDecks?: ModuleSlideDeck[];
    videoUrl?: string;
    videoName?: string;
    posterUrl?: string;
}
