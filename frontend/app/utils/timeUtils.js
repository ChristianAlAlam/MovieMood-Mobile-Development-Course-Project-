/**
 * Convert minutes to readable format (e.g., 142 → "2h 22min")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return "N/A";

  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
};

/**
 * Calculate time left based on duration (in minutes) and progress (0-1)
 */
export const calculateTimeLeft = (durationInMinutes, progress) => {
  // Check only for null or undefined, not 0
  if (durationInMinutes == null || progress == null) {
    return "Continue watching";
  }

  const remainingMinutes = Math.round(durationInMinutes * (1 - progress));

  if (remainingMinutes <= 0) return "Almost done";
  if (remainingMinutes < 60) return `${remainingMinutes} min left`;

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;

  return mins > 0 ? `${hours}h ${mins}m left` : `${hours}h left`;
};
