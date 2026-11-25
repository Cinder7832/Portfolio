import type { ReactNode } from "react";

export const CASE_STUDY_CHAPTERS = [
  "showcase",
  "overview",
  "research",
  "experience",
  "process",
  "extras",
  "changelog",
  "reflection",
] as const;

export type CaseStudyChapter = (typeof CASE_STUDY_CHAPTERS)[number];
export type DeepDivePlacement = "experience" | "process" | "extras";

export type CaseStudySectionSlot = {
  label: string;
  content: ReactNode;
};

export type CaseStudyDefinition = {
  projectId: string;
  title: string;
  theme: "cubo" | "everdew" | "rebound" | "ravensdown" | "forgotten-line" | "constructed" | "aztec-temple" | "miro" | "independent-level-project" | "eroded-sands" | "horizon";
  hero: CaseStudySectionSlot;
  sections: Record<CaseStudyChapter, CaseStudySectionSlot>;
  deepDives: Array<{
    id: string;
    label: string;
    placement: DeepDivePlacement;
    content: ReactNode;
  }>;
};

export type CaseStudyNavigationDefinition = Omit<CaseStudyDefinition, "hero" | "sections" | "deepDives"> & {
  hero: Omit<CaseStudySectionSlot, "content">;
  sections: Record<CaseStudyChapter, Omit<CaseStudySectionSlot, "content">>;
  chapters?: readonly CaseStudyChapter[];
  deepDives: Array<Omit<CaseStudyDefinition["deepDives"][number], "content">>;
};
