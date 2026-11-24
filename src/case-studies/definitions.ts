import type { CaseStudyNavigationDefinition } from "./types";

const sharedLabels = {
  showcase: { label: "Showcase" },
  overview: { label: "Overview" },
  research: { label: "Research" },
  experience: { label: "Gameplay" },
  process: { label: "Process" },
  extras: { label: "Extras" },
  changelog: { label: "Changelog" },
  reflection: { label: "Reflection" },
} as const;

export const caseStudyDefinitions = {
  cubo: {
    projectId: "cubo",
    title: "Cubo",
    theme: "cubo",
    hero: { label: "Cubo introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "cubo-bosses", label: "Bosses", placement: "extras" },
      { id: "cubo-progression", label: "Progression", placement: "extras" },
      { id: "cubo-interface", label: "Interface", placement: "extras" },
      { id: "cubo-workflow", label: "Workflow", placement: "extras" },
    ],
  },
  everdew: {
    projectId: "everdew",
    title: "Everdew",
    theme: "everdew",
    hero: { label: "Everdew introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "everdew-management", label: "Project management", placement: "extras" },
      { id: "everdew-promotion", label: "Promotion", placement: "extras" },
    ],
  },
} as const satisfies Record<string, CaseStudyNavigationDefinition>;

export type PublishedCaseStudyId = keyof typeof caseStudyDefinitions;

export const isPublishedCaseStudyId = (id: string): id is PublishedCaseStudyId => id in caseStudyDefinitions;
