export function formatDate(input: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(input));
}

export function joinNames(names: { name: string }[] = []) {
  return names.map((item) => item.name).join(', ');
}
