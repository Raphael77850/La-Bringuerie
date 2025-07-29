// Fonctions utilitaires pour la gestion des dates et heures
export function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export function extractTimeFromDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function combineDateTime(date: string, time: string): string {
  if (!date || !time) return "";
  return `${date}T${time}:00`;
}
