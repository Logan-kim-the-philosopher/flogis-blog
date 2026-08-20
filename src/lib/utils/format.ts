export function formatDate(input?: string) {
  const date = input ? new Date(input) : null;

  if (!date || Number.isNaN(date.valueOf())) {
    return '날짜 미정';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function joinNames(names: { name: string }[] = [], fallback = '이름 미정') {
  const joined = names.map((item) => item.name).filter(Boolean).join(', ');
  return joined || fallback;
}
