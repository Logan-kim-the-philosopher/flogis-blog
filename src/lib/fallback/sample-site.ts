import type { SiteSettings } from '../types/site';

export const sampleSiteSettings: SiteSettings = {
  title: "Flogi's Blog",
  description: '스터디, 회의, 작업 기록을 구조적으로 정리하는 개인 지식 아카이브.',
  tagline: '배운 것, 논의한 것, 만들고 있는 것을 차분하게 쌓아가는 기록 공간',
  heroText: 'AI, 제품, 실행 메모를 스터디·회의·작업 세 가지 흐름으로 정리합니다.',
  nav: [
    { label: '스터디', href: '/study' },
    { label: '회의', href: '/meetings' },
    { label: '작업', href: '/work' }
  ],
  socialLinks: [{ label: 'YouTube', href: 'https://www.youtube.com/' }],
  seo: {
    title: "Flogi's Blog",
    description: '스터디, 회의, 작업 기록을 담는 블로그 템플릿',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'
  }
};
