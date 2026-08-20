import type { Meeting, Study, Work } from '../types/content';
import type { Person } from '../types/common';

const authors: Person[] = [
  {
    name: '노정석',
    slug: 'chester-roh',
    role: '작성자',
    bio: 'AI, 스타트업, 기술 트렌드를 깊이 있게 해설합니다.'
  },
  {
    name: '최승준',
    slug: 'seungjoon-choi',
    role: '작성자',
    bio: '복잡한 기술과 철학을 쉽게 풀어내는 대화형 진행자입니다.'
  },
  {
    name: '김성현',
    slug: 'seonghyun-kim',
    role: '작성자',
    bio: '모델, 인프라, 산업 구조를 구조적으로 짚습니다.'
  }
];

export const sampleStudies: Study[] = [
  {
    _id: 'study-110',
    _type: 'study',
    title: 'AI와 정렬',
    slug: 'ai-and-alignment',
    coverImage:
      'https://images.unsplash.com/photo-1675557009875-436f5f5b4d45?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-08-18',
    authors: [authors[0], authors[1]],
    tags: ['정렬', '보안', '에이전트'],
    body: `## 이번 스터디에서 다루는 내용\n\nAI 모델 출시 속도가 빨라지면서, 연구·제품화·보안 이슈가 한 번에 겹치는 상황이 잦아졌습니다. 이번 스터디에서는 모델 출시 가속, 정렬 문제, 보안 침입 사례를 하나의 흐름으로 묶어 해석합니다.\n\n### 핵심 포인트\n\n- 모델 출시 주기의 급격한 단축\n- 에이전트 환경에서의 권한 상승과 보안 취약점\n- RL 기반 보상 해킹과 오정렬의 구조적 문제\n\n이 템플릿은 이런 형태의 긴 스터디 노트와 관련 링크를 손쉽게 관리할 수 있도록 설계했습니다.`
  },
  {
    _id: 'study-109',
    _type: 'study',
    title: '지금은 인퍼런스의 시대',
    slug: 'age-of-inference',
    coverImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-08-16',
    authors: [authors[0], authors[1]],
    tags: ['인퍼런스', 'GPU', '데이터센터'],
    body: `인퍼런스 서버 운영과 prefill/decode 분리 구조, 그리고 초고속 토큰 생성이 만드는 사용자 경험 변화를 다룹니다.`
  },
  {
    _id: 'study-108',
    _type: 'study',
    title: '실리콘 포토닉스와 AI 데이터센터의 다음 병목',
    slug: 'silicon-photonics-next-bottleneck',
    coverImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-08-08',
    authors: [authors[0], authors[2]],
    tags: ['반도체', '포토닉스', '데이터센터'],
    body: `구리 인터커넥트의 한계와 광 연결의 가능성을 산업 관점에서 정리합니다.`
  }
];

export const sampleWorks: Work[] = [
  {
    _id: 'work-1',
    _type: 'work',
    title: '디스틸레이션 전쟁: 추론을 훔치는 창, 워터마크라는 방패',
    slug: 'distillation-war-2026',
    coverImage:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-08-14',
    authors: [authors[0]],
    tags: ['AI 정책', '보안', 'Anthropic'],
    body: `같은 주에 두 사건이 겹쳤습니다. 하나는 숨겨진 리즈닝 트레이스를 탈취하는 연구, 다른 하나는 생성물 워터마킹 전략이었습니다.\n\n이 글은 기술적 메커니즘뿐 아니라 산업적 함의까지 함께 정리하기 위한 작업형 포맷 예시입니다.`
  },
  {
    _id: 'work-2',
    _type: 'work',
    title: '오픈 웨이트 서한 일주일',
    slug: 'open-weights-letter-2026',
    coverImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-07-31',
    authors: [authors[1]],
    tags: ['오픈웨이트', '정책', 'NVIDIA'],
    body: `서한의 실제 내용과 서명하지 않은 회사들의 포지션을 원문 기반으로 정리합니다.\n\n기업 서명 수의 급증보다 더 중요한 것은 누가 끝까지 서명하지 않았는가입니다. 이 기록은 그런 비교 분석에 적합한 카드 구조를 보여줍니다.`
  },
  {
    _id: 'work-3',
    _type: 'work',
    title: 'Hugging Face 보안 사고와 새 모델 전쟁',
    slug: 'hugging-face-kimi-k3-qwen-claude-opus-5',
    coverImage:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-07-25',
    authors: [authors[2]],
    tags: ['Hugging Face', 'Kimi K3', 'Claude Opus 5'],
    body: `보안 사고의 공식 발표와 동시에 벌어진 새 모델 경쟁을 발표 노트 형식으로 정리합니다.\n\n발표, 링크, 인용, 주석이 많은 작업형 콘텐츠를 위해 본문 가독성과 메타 태그 영역을 분리했습니다.`
  }
];

export const sampleMeetings: Meeting[] = [
  {
    _id: 'meeting-1',
    _type: 'meeting',
    title: '실리콘밸리 20대 VC Nikhil Suresh',
    slug: 'nikhil-suresh-interview',
    coverImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-07-20',
    participants: [
      {
        name: 'Nikhil Suresh',
        slug: 'nikhil-suresh',
        role: 'Striker Venture Partners'
      }
    ],
    tags: ['VC', '피지컬 AI', '바이오'],
    body: `휴먼 데이터 시장, verifier와 eval의 경제성, 피지컬 AI와 바이오, 그리고 한국의 기회를 묻는 회의 기록입니다.\n\n실리콘밸리 특집의 핵심 소스였던 대화를 회의형 포맷으로 정리한 예시입니다.`
  }
];
