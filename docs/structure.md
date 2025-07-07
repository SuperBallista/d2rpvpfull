# 프로젝트 폴더 구조 및 역할 정리

## 1. 프론트엔드 (Front/)

### 주요 폴더 및 파일 구조

- **calculator-page.html, community-page.html, index.html, new-design.html, ranking-page.html**
  - 각각 계산기, 커뮤니티, 메인, 신규 디자인, 랭킹 페이지의 HTML 파일입니다.
- **package.json, package-lock.json**
  - 프론트엔드 의존성 및 스크립트 관리 파일입니다.
- **public/**
  - 정적 파일(이미지, 아이콘, 파비콘, 약관/개인정보 HTML 등) 저장 폴더입니다.
  - assets/: 아이콘 등 정적 리소스
  - img/: 랭크 이미지 등
  - privacy.html, terms.html: 개인정보처리방침, 이용약관
- **src/**
  - 프론트엔드 Svelte 소스코드가 위치한 폴더입니다.
  - app.css: 전체 스타일시트
  - App.svelte: Svelte 앱의 루트 컴포넌트
  - main.ts: Svelte 앱 진입점
  - store.ts: Svelte 상태 관리
  - vite-env.d.ts: Vite 환경 타입 정의
  - assets/: 아이콘 등 정적 리소스
  - components/: Svelte 컴포넌트 모음
    - babapkadmin.svelte, Boardlist.svelte 등: 각 기능별 UI 컴포넌트
    - calculater/: 계산기 관련 컴포넌트
    - form/: 로그인, 회원가입, 정보수정 등 폼 관련 컴포넌트
    - custom/: 커스텀 UI 컴포넌트 및 설정(json 등)
  - svelte.config.js, tsconfig.json, tsconfig.node.json, vite.config.ts: Svelte, TypeScript, Vite 설정 파일
- **README.md**
  - 프론트엔드 개발 및 사용법 안내 파일

### 폴더별 주요 역할

- **public/**: 정적 리소스(이미지, 아이콘, HTML 등) 제공
- **src/assets/**: 프론트엔드에서 사용하는 아이콘 등 리소스
- **src/components/**: 화면을 구성하는 Svelte 컴포넌트들
  - **calculater/**: 점수 계산, 시뮬레이션 등 계산기 관련 컴포넌트
  - **form/**: 로그인, 회원가입, 비밀번호 변경 등 폼 관련 컴포넌트
  - **custom/**: 커스텀 UI 요소(예: 메시지 박스, 로딩 스피너 등)
- **src/main.ts**: Svelte 앱의 진입점
- **src/App.svelte**: 앱의 루트 컴포넌트
- **src/store.ts**: 전역 상태 관리

---

## 2. 백엔드 (Server/)

### 주요 폴더 및 파일 구조

- **front/**
  - 빌드된 프론트엔드 정적 파일(아이콘, 이미지, HTML 등) 제공 폴더입니다.
- **package.json, package-lock.json**
  - 백엔드 의존성 및 스크립트 관리 파일입니다.
- **src/**
  - NestJS 기반 백엔드 소스코드가 위치한 폴더입니다.
  - admin-score/: 관리자 점수 관리 관련 모듈
  - app.module.ts: 최상위 앱 모듈
  - auth/: 인증(로그인, 소셜 로그인 등) 관련 모듈
    - google-auth/, kakao-auth/: 구글/카카오 소셜 로그인
    - google.strategy.ts, kakao.strategy.ts: 소셜 로그인 전략
  - board/: 게시판 관련 모듈
  - calculate/: 점수 계산 관련 모듈
  - calendar/: 캘린더(일정) 관련 모듈
  - clan/: 클랜(길드) 관련 모듈
  - cloudinary/: 이미지 업로드(Cloudinary 연동) 관련 모듈
  - config/: 상수 등 설정 파일
  - connect/: 계정 연동 관련 모듈
  - cookie-and-header/: 쿠키 및 헤더 처리 미들웨어
  - csrf/: CSRF 보안 미들웨어
  - entities/: 데이터베이스 엔티티(테이블 구조) 정의
  - event/: 이벤트 관련 모듈
  - get-nickname/: 닉네임 조회 관련 모듈
  - guard/: 인증/권한 관련 데코레이터 및 가드
  - jwt/: JWT 발급 및 검증 관련 모듈
  - jwt-auth/: JWT 인증 미들웨어
  - rank/: 랭킹 관련 모듈
  - record/: 기록 관련 모듈
  - reset-pw/: 비밀번호 초기화 관련 모듈
  - rooms/: 방(게임방 등) 관련 모듈
  - user/: 사용자 데코레이터
  - userdata/: 사용자 데이터 관련 모듈
  - utils/: 유틸리티 함수
  - main.ts: NestJS 앱 진입점
- **test/**
  - E2E(엔드투엔드) 테스트 코드
- **README.md**
  - 백엔드 개발 및 사용법 안내 파일
- **nest-cli.json, tsconfig*.json**
  - NestJS, TypeScript 설정 파일

### 폴더별 주요 역할

- **src/admin-score/**: 관리자 점수 관리 API
- **src/auth/**: 인증 및 소셜 로그인(Google, Kakao)
- **src/board/**: 게시판 API
- **src/calculate/**: 점수 계산 API
- **src/calendar/**: 일정/캘린더 API
- **src/clan/**: 클랜(길드) 관련 API
- **src/cloudinary/**: 이미지 업로드 및 관리
- **src/config/**: 상수, 환경설정
- **src/connect/**: 계정 연동 기능
- **src/cookie-and-header/**: 쿠키/헤더 처리 미들웨어
- **src/csrf/**: CSRF 보안 미들웨어
- **src/entities/**: DB 테이블 구조(Entity)
- **src/event/**: 이벤트 관련 API
- **src/get-nickname/**: 닉네임 조회 API
- **src/guard/**: 인증/권한 가드 및 데코레이터
- **src/jwt/**: JWT 발급/검증
- **src/jwt-auth/**: JWT 인증 미들웨어
- **src/rank/**: 랭킹 API
- **src/record/**: 기록 API
- **src/reset-pw/**: 비밀번호 초기화 API
- **src/rooms/**: 방(게임방 등) API
- **src/userdata/**: 사용자 데이터 API
- **src/utils/**: 유틸리티 함수
- **src/main.ts**: NestJS 앱 진입점

---

이 문서는 프로젝트의 전체 폴더 구조와 각 폴더/파일의 주요 역할을 한눈에 파악할 수 있도록 정리한 것입니다. 각 기능별 상세 설명이 필요하다면 docs 폴더 내에 추가 문서를 작성할 수 있습니다. 