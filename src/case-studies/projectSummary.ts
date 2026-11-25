import { projects } from "../data";

export function projectSummary(id: string, fallback: string) {
  return projects.find((project) => project.id === id)?.summary ?? fallback;
}
