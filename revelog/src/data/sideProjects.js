import bandiaryHome from '../assets/projects/bandiary-home.jpeg'
import bandiaryPlace from '../assets/projects/bandiary-place.jpeg'
import bandiarySchedule from '../assets/projects/bandiary-schedule.jpeg'
import bandiaryMusic from '../assets/projects/bandiary-musicsheet.jpeg'
import bandiaryNotice from '../assets/projects/bandiary-notice.jpeg'
import bandiaryQrCode from '../assets/projects/bandiary-qrcode.png'
import moaShowcase from '../assets/projects/moa-showcase.png'

// 동일한 구조의 프로젝트를 추가하면 본문과 사이드바 목차에 함께 반영됩니다.
export const sideProjects = [
  {
    id: 'bandiary',
    name: 'Bandiary',
    subtitle: '밴드 활동을 기록하고 관리하는 올인원 모바일 다이어리',
    period: '2026.06 — Update',
    github: 'https://github.com/REVE97/Band_diary',
    demo: {
      url: 'https://band-diary.vercel.app',
      qrCode: bandiaryQrCode,
      username: 'test',
      password: '1234',
    },
    skills: ['React', 'JavaScript', 'Supabase', 'Vercel', 'PWA'],
    screens: [
      { src: bandiaryHome, label: '활동 기록' },
      { src: bandiaryPlace, label: '장소 관리' },
      { src: bandiaryMusic, label: '악보 공유' },
      { src: bandiarySchedule, label: '일정 관리' },
      { src: bandiaryNotice, label: '공지 · 메모' },
    ],
    overview: [
      '밴드 활동에 필요한 기록과 정보를 한곳에 모았습니다.',
      '사진 · 영상 · 오디오부터 장소, 악보, 일정까지 연결하는 모바일 다이어리 서비스입니다.',
    ],
    overviewHighlight:
      '현재 실제 사용자를 대상으로 베타 서비스를 운영하며, 사용자 피드백을 수집하고 개선 사항을 반영하고 있습니다.',
    features: [
      {
        icon: 'media',
        title: '활동 기록',
        description: '사진 · 영상 · 오디오를 저장하고 카드 형태로 기록합니다.',
      },
      {
        icon: 'map',
        title: '장소 관리',
        description: '합주실과 주변 맛집 정보를 기록하고 지도에서 확인합니다.',
      },
      {
        icon: 'music',
        title: '악보 공유',
        description: '세션별 악보를 한곳에 저장하고 미리보기와 다운로드로 공유합니다.',
      },
      {
        icon: 'calendar',
        title: '일정 관리',
        description: '합주 · 공연 · 회의 일정을 캘린더에서 함께 관리합니다.',
      },
      {
        icon: 'notice',
        title: '공지 · 메모',
        description: '중요 공지와 메모를 확인하고 제목으로 검색합니다.',
      },
    ],
    implementation: [
      {
        icon: 'data',
        title: '데이터와 콘텐츠',
        details: [
          'Supabase 기반으로 별도 백엔드 API 서버 없이 데이터 송수신',
          '미디어 파일 변환 · 최적화 및 카드 형식 시각화',
        ],
      },
      {
        icon: 'map',
        title: '지도와 문서',
        details: [
          '카카오맵 API로 장소 · 위치 정보 시각화 및 카카오 지도 앱 연동',
          'Pdfjs · Fullcalendar 기반 문서와 일정 표시 및 다운로드',
        ],
      },
      {
        icon: 'deploy',
        title: '배포와 운영',
        details: [
          'GitHub Actions 기반 CI/CD 구성', 
          'Vercel 프론트엔드 배포 및 PWA 제공'
        ],
      },
    ],
  },
  {
    id: 'moa',
    name: 'MOA',
    subtitle: '예약부터 정산, 기록까지 연결하는 전자지갑 기반 올인원 여행 서비스',
    period: '2025.07 — 2025.08',
    github: 'https://github.com/KB-PJT-15-4',
    skills: ['Vue', 'TypeScript', 'Tailwind CSS', 'Figma', 'Firebase'],
    showcase: { src: moaShowcase, label: 'MOA · 예약, 전자지갑, 여행 기록 화면' },
    overview: [
      'MOA (Memories Of All)는 여행의 모든 과정을 하나의 플랫폼에서 관리하는 서비스입니다.',
      '교통 · 숙소 · 식당 예약부터 정산과 여행 기록까지, 여행에 필요한 경험을 전자지갑과 연결합니다.',
    ],
    features: [
      {
        icon: 'calendar',
        title: '통합 예약',
        description: '여행 일정을 생성하고 교통 · 숙소 · 식당을 예약하며 QR 예약권을 확인합니다.',
      },
      {
        icon: 'media',
        title: '여행 기록',
        description: '함께 여행한 사람들과 이미지와 댓글을 공유하는 아카이빙 경험을 제공합니다.',
      },
      {
        icon: 'notice',
        title: '증명서 관리',
        description: '주민등록증 · 운전면허증 등 여행에 필요한 증명서를 앱에 통합해 관리합니다.',
      },
    ],
    implementation: [
      {
        icon: 'data',
        title: '구조와 데이터',
        details: [
          '선언적인 공통 컴포넌트와 FSD 디자인 패턴으로 페이지 구성',
          'REST API를 통해 백엔드 데이터를 가공해 화면에 표시',
        ],
      },
      {
        icon: 'notice',
        title: '인증과 개인정보',
        details: [
          'RTR을 통한 토큰 관리',
          'AES-256 암호화 및 필요한 시점에만 복호화하는 On-demand 로직 구현',
        ],
      },
      {
        icon: 'media',
        title: '알림과 미디어',
        details: ['FCM을 활용한 사용자 알림', 'Firebase Storage 이미지 저장 및 CDN을 통한 제공'],
      },
      {
        icon: 'deploy',
        title: '협업과 배포',
        details: [
          'Figma로 페이지별 와이어프레임 공유',
          'GitHub Actions 기반 CI/CD 및 Vercel · PWA 배포',
        ],
      },
    ],
  },
]
