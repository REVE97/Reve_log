<template>
  <section class="resume-section">
    <table class="resume-table">
      <thead>
        <tr>
          <th>Profile_</th>
          <th>Position_</th>
          <th>Contact_</th>
        </tr>
      </thead>
      <tbody>
        <tr class="profile-row">
          <td>
            <strong>곽효재</strong>
            <span>1997.08.06</span>
          </td>
          <td>
            <strong>Front-end Developer</strong>
          </td>
          <td>
            <strong>zxcv9675@naver.com</strong>
          </td>
        </tr>
        
        <!-- KnowledgePoint 경력 기술서 파트 -->
        <tr class="career-row">
          <td rowspan="3" class="company-cell">
            <a 
              href="https://knowledgepoint.co.kr" 
              class="company-name"
              target="_blank"
            >
              KnowledgePoint
            </a>
            <span>Solution Development Team</span>
            <span>2026 - Present</span>
          </td>

          <td>
            <strong>OTA - SUMS / VSOC</strong>
            <span>2026.01 - 2026.04</span>
          </td>

          <td>
            <ul>
              <li>타타대우모빌리티 상용차 차량 관리 플랫폼 VSOC 파트 프론트엔드 개발 담당</li>
              <li>Vue3 기반 실시간 차량 이벤트 데이터 조회 및 시각화 UI 구현</li>
              <li>REST API 연동 및 Pinia를 활용한 차량 이벤트 데이터 상태 관리 구현</li>
            </ul>
          </td>
        </tr>
        
        <tr class="career-row">
          <td>
            <a
              href="https://cococall.net"
              target="_blank"
            >
            Migration
          </a>
            <span>2026.04 - Present</span>
          </td>

          <td>
            <ul>
              <li>천재교과서 · 해법에듀 상용 교육 화상 서비스 솔루션의 프론트엔드 마이그레이션 담당</li>
              <li>
                <a
                  href="https://cocopen.net"
                  target="_blank"
                >cocopen</a>
                ·
                <a
                  href="https://cococall.net"
                  target="_blank"
                >cococall</a>
                등 상용 화상 서비스의 자료 공유, 화이트보드, 화면 공유 기능 개선 및 유지보수
              </li>
              <li>Vue 프로젝트 버전 업그레이드와 Webpack + Babel 기반 빌드 구조를 Vite 기반 구조로 전환</li>
              <li>개발 서버 및 TB 서버 · 운영 서버 빌드 시간 개선을 통해 빌드 효율 약 94% 향상</li>
            </ul>
          </td>
        </tr>

        <tr class="career-row">
          <td>
            <a href="#">서비스 기능 테스트 자동화 도입</a>
            <span>2026.06 - Present</span>
          </td>

          <td>
            <ul>
              <li>여러 상용 화상 서비스 · 관리자 페이지에 대한 기능 정상 테스트 자동화 시스템 도입</li>
              <li>Vue 프레임워크 및 Playwright 라이브러리 활용</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>