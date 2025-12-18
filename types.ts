export type Language = 'en' | 'es';
export type SubjectType = 'couple' | 'family' | 'kids' | 'man' | 'woman';

export interface Translation {
  title: string;
  subtitle: string;
  ctaStart: string;
  uploadTitle: string;
  uploadDesc: string;
  subjectTitle: string; // New
  styleTitle: string;
  customStyleTitle: string;
  customStylePlaceholder: string;
  generateBtn: string;
  downloadBtn: string;
  tryAgainBtn: string;
  affiliate: string;
  donation: string;
  close: string;
  credits: string;
  buyCredits: string;
  subjects: Record<SubjectType, string>; // New
  categories: {
    studio: string;
    global: string;
  };
  modals: {
    affiliateTitle: string;
    affiliateDesc: string;
    affiliateCta: string;
    donationTitle: string;
    donationDesc: string;
    donationCta: string;
    pricingTitle: string;
    pricingDesc: string;
    paymentTitle: string;
    selectMethod: string;
    payWith: string;
    processing: string;
    success: string;
  };
  styles: Record<string, string>;
  voice: {
    start: string;
    stop: string;
    listening: string;
    helperText: string;
  };
  processing: string;
  error: string;
  insufficientCredits: string;
}

export interface StyleOption {
  id: string;
  nameKey: string;
  promptSnippet: string;
  category: 'studio' | 'global';
  imageSrc: string;
  isCustom?: boolean;
}

export interface PricingPackage {
  id: string;
  credits: number;
  price: number;
  label: string;
  popular?: boolean;
}

export interface AppState {
  step: 'landing' | 'upload' | 'subject' | 'style' | 'processing' | 'result';
  language: Language;
  selectedSubjectType: SubjectType | null;
  selectedImage: string | null;
  selectedStyle: StyleOption | null;
  customPrompt: string;
  generatedImage: string | null;
  error: string | null;
  isVoiceActive: boolean;
  activeModal: 'none' | 'affiliate' | 'donation' | 'pricing';
  credits: number;
}