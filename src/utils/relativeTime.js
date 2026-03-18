// Utility for relative time formatting

const strings = {
  hu: {
    justNow: 'épp most',
    minute: 'perce',
    hour: 'órája',
    day: 'napja',
    unknown: 'ismeretlen idő'
  },
  en: {
    justNow: 'just now',
    minute: 'minutes ago',
    hour: 'hours ago',
    day: 'days ago',
    unknown: 'unknown time'
  }
};

export function getRelativeTime(dateString, lang = 'en') {
  const s = strings[lang] || strings.en;
  if (!dateString) return s.unknown;
  const safeDateString = dateString.replace(' ', 'T').replace(/\+00$/, 'Z');
  const utcDate = new Date(safeDateString);
  const now = new Date();
  const diffMs = now.getTime() - utcDate.getTime();
  if (isNaN(diffMs) || diffMs < 0) return s.justNow;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay > 0) return `${diffDay} ${s.day}`;
  if (diffHour > 0) return `${diffHour} ${s.hour}`;
  if (diffMin > 0) return `${diffMin} ${s.minute}`;
  return s.justNow;
}
