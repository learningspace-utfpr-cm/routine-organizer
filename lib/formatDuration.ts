export function formatDuration(seconds: number | null | undefined) {
  if (!Number.isFinite(seconds ?? 0) || seconds === null || seconds === undefined) {
    return "00:00:00";
  }

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(remainingSeconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}
