export interface LearnSubsection {
  id: string;
  title: string;
  summary?: string;
  sourceIds: string[];
}

export interface LearnSection {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  sourceIds: string[];
  subsections: LearnSubsection[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}
