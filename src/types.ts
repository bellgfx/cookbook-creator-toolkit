export interface Recipe {
  id: string;
  title: string;
  desc: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  category: string;
  detailLevel: "basic" | "detailed" | "full";
  dietTags: string[];
  sectionLabel: string;
  ingredients: {
    amount: string;
    unit: string;
    name: string;
    note: string;
    flagged: boolean;
  }[];
  steps: string[];
  chefTip: string;
  storageNote: string;
  variationNote: string;
  allergyNote: string;
  nutritionNote: string;
  calories?: string;
}

export interface TitleSuggestion {
  title: string;
  subtitle: string;
  why: string;
}

export interface NicheAnalysis {
  primaryNiche: string;
  amazonCategories: string[];
  keywords: string[];
  strengths: string[];
  suggestions: string[];
}

export interface DesignRecommendation {
  styleName: string;
  styleTagline: string;
  reasoning: string;
  palette: { hex: string; use: string }[];
  headingFont: string;
  bodyFont: string;
  fontReasoning: string;
  coverConcept: string;
  canvaTips: string[];
  elementsToSearch: string[];
  moodWords: string[];
}

export interface GlobalState {
  // Meta
  authorName: string;
  title: string;
  motivation: string;
  motivationText: string;
  audience: string[];
  audienceText: string;
  themes: string[];
  themeText: string;
  angles: string[];
  angleText: string;
  scale: string;
  formats: string[];
  finalNotes: string;

  // AI Cache
  aiTitles: TitleSuggestion[];
  nicheAnalysis: NicheAnalysis | null;

  // Module 2 Dietary
  primaryBadge: string | null;
  primaryType: string;
  secondaryBadges: { label: string; type: string }[];
  customBadges: string[];
  orderedBadges: { label: string; type: string }[];

  // Module 3 Visual Design
  selectedStyleId: string | null;
  aiDesignRecommendation: DesignRecommendation | null;

  // Module 5 Recipes
  recipes: Recipe[];
  currentRecipeDraft: Recipe | null;

  // Module 4 & 6 Checklists
  canvaChecklistState: Record<number, boolean>;
  publishingChecklistState: Record<number, boolean>;
  marketingChecklistState: Record<number, boolean>;

  // Cover Art Studio Customization
  coverTitle?: string;
  coverSubtitle?: string;
  coverAuthor?: string;
  coverTemplate?: string;
  coverBackground?: string;
  coverPrimaryColor?: string;
  coverSecondaryColor?: string;
  coverFontPairing?: string;
  coverIconType?: string;
  coverPageCount?: number;
}
