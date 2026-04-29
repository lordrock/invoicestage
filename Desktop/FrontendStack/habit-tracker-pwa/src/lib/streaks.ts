function subtractDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function calculateCurrentStreak(
  completions: string[],
  today: string = getTodayIsoDate()
): number {
  if (completions.length === 0) {
    return 0;
  }

  const uniqueCompletions = Array.from(new Set(completions)).sort();

  if (!uniqueCompletions.includes(today)) {
    return 0;
  }

  let streak = 0;
  let currentDate = today;

  while (uniqueCompletions.includes(currentDate)) {
    streak += 1;
    currentDate = subtractDays(today, streak);
  }

  return streak;
}