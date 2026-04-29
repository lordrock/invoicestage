export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}