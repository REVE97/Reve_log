export const profile = {
  name: '곽효재',
  birthday: '1997.08.06',
  position: 'Front-end Developer',
  email: 'zxcv9675@naver.com',
  github: 'https://github.com/REVE97',
  blog: 'https://velog.io/@zxcv9675/posts',
  skills: ['Vue', 'React', 'JavaScript', 'TypeScript', 'Java', 'Linux', 'Pinia', 'REST API', 'Vite', 'Playwright', 'Git'],
}

// 회사와 프로젝트를 추가하면 웹 화면과 인쇄 문서에 함께 반영됩니다.
export const experience = [
  {
    id: 'knowledgepoint',
    name: 'KnowledgePoint',
    url: 'https://knowledgepoint.co.kr',
    team: 'Solution Development Team',
    period: '2026.01 — Present',
    projects: [
      {
        id: 'ota',
        period: '2026.01 — 04',
        title: 'OTA · SUMS / VSOC',
        url: 'https://www.tata-daewoo.com/xenLink/xenLink_1',
        summary: '상용차 차량 관리 플랫폼 프론트엔드 개발',
        details: [
          '타타대우모빌리티 XENLINK 연동 차량 관리 플랫폼의 VSOC 파트 프론트엔드 개발 담당',
          'Vue 3 기반 실시간 차량 이벤트 데이터 조회 및 시각화 UI 구현',
          'REST API 연동 및 Pinia를 활용한 차량 이벤트 데이터 상태 관리 구현',
        ],
        skills: ['Vue 3', 'Pinia', 'REST API'],
      },
      {
        id: 'migration',
        period: '2026.04 — 06',
        title: '교육 화상 서비스 마이그레이션',
        summary: 'Vue 버전 업그레이드 및 Webpack · Babel → Vite 전환',
        details: [
          '천재교과서(밀크티아이) · 해법에듀 상용 교육 화상 서비스 솔루션의 프론트엔드 마이그레이션 담당',
          'cocopen · cocosem 등 상용 화상 서비스의 자료 공유, 화이트보드, 화면 공유 기능 개선 및 유지보수',
          '개발 서버 및 TB 서버 · 운영 서버 빌드 시간 개선',
        ],
        links: [
          { label: '밀크티아이', url: 'https://i.milkt.co.kr/' },
          { label: 'cocopen', url: 'https://cocopen.net' },
          { label: 'cocosem', url: 'https://sem.cococall.net/' },
        ],
        outcome: { value: '약 94%', label: '빌드 효율 향상' },
        skills: ['Vue', 'Vite', 'Webpack', 'Babel'],
      },
      {
        id: 'testing',
        period: '2026.06 — 07',
        title: '서비스 기능 테스트 자동화',
        url: 'https://velog.io/@zxcv9675/라이브러리-Playwright',
        summary: '상용 화상회의 서비스의 Playwright 기반 E2E 테스트 구축',
        details: [
          '로그인, 화상회의 생성 · 참가, 채팅, API 호출 정상 여부 등 주요 사용자 시나리오 자동 검증',
          '시스템 체크 반복 업무 시간 감소 및 오류 로그 생성 · 시각화 산출물 제공',
        ],
        skills: ['Playwright', 'E2E'],
      },
      {
        id: 'service-info',
        period: '2026.07 — 현재',
        title: '사내 서비스 정보 관리 웹페이지',
        summary: 'Vue 3 기반 서비스 운영 정보 통합 관리',
        details: [
          '천재교과서 · 해법에듀 서비스별 운영 정보를 통합 관리하는 사내 웹페이지 개발',
          '서비스 URL, 서버 IP · 경로, 운영 환경, 브랜치, 저장소 및 배포 정보를 한 화면에서 조회하도록 구성',
          '분산된 서비스 정보를 JSON 데이터로 구조화하여 정보 조회와 유지보수 편의성 개선',
        ],
        skills: ['Vue 3', 'JSON'],
      },
    ],
  },
]
