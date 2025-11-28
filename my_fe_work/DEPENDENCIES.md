# 프로젝트 의존성 가이드

이 문서는 프로젝트에 필요한 모든 의존성과 설치 방법을 설명합니다.

## 📦 의존성 목록

### 프로덕션 의존성 (Production Dependencies)

프로덕션 환경에서 실행되는 애플리케이션에 필요한 패키지입니다.

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `react` | ^19.2.0 | React 라이브러리 (UI 프레임워크) |
| `react-dom` | ^19.2.0 | React DOM 렌더링 (브라우저용) |
| `react-router-dom` | ^7.9.6 | 클라이언트 사이드 라우팅 (페이지 네비게이션) |
| `axios` | ^1.13.2 | HTTP 클라이언트 (API 요청) |
| `three` | ^0.181.2 | 3D 그래픽 라이브러리 (3D 도형 렌더링) |
| `@react-three/fiber` | ^9.4.0 | Three.js를 React 컴포넌트로 사용하기 위한 라이브러리 |
| `@react-three/drei` | ^10.7.7 | Three.js 유틸리티 및 헬퍼 함수 모음 |
| `@fortawesome/fontawesome-free` | ^7.1.0 | Font Awesome 아이콘 라이브러리 |

### 개발 의존성 (Development Dependencies)

개발 환경에서만 필요한 도구 및 패키지입니다.

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `vite` | ^7.2.4 | 빌드 도구 및 개발 서버 |
| `@vitejs/plugin-react-swc` | ^4.2.2 | Vite용 React 플러그인 (SWC 컴파일러 사용) |
| `eslint` | ^9.39.1 | JavaScript/React 코드 린터 |
| `@eslint/js` | ^9.39.1 | ESLint JavaScript 설정 |
| `eslint-plugin-react-hooks` | ^7.0.1 | React Hooks 린터 규칙 |
| `eslint-plugin-react-refresh` | ^0.4.24 | React Fast Refresh 린터 규칙 |
| `globals` | ^16.5.0 | ESLint 글로벌 변수 설정 |
| `@types/react` | ^19.2.5 | React TypeScript 타입 정의 (타입 체크용) |
| `@types/react-dom` | ^19.2.3 | React DOM TypeScript 타입 정의 |

## 🚀 설치 방법

### 전체 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
npm install
```

또는

```bash
npm ci
```

> **참고**: `npm ci`는 `package-lock.json`을 기반으로 정확한 버전을 설치하므로 CI/CD 환경에서 권장됩니다.

### 개별 패키지 설치

특정 패키지만 설치하려면:

#### 프로덕션 의존성

```bash
# React 핵심 라이브러리
npm install react react-dom

# 라우팅
npm install react-router-dom

# HTTP 클라이언트
npm install axios

# 3D 그래픽 라이브러리
npm install three @react-three/fiber @react-three/drei

# 아이콘 라이브러리
npm install @fortawesome/fontawesome-free
```

#### 개발 의존성

```bash
# 빌드 도구
npm install -D vite @vitejs/plugin-react-swc

# 린터
npm install -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals

# TypeScript 타입 정의
npm install -D @types/react @types/react-dom
```

### 한 번에 설치 (권장)

모든 의존성을 한 번에 설치하는 명령어:

```bash
# 프로덕션 의존성
npm install react react-dom react-router-dom axios three @react-three/fiber @react-three/drei @fortawesome/fontawesome-free

# 개발 의존성
npm install -D vite @vitejs/plugin-react-swc eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals @types/react @types/react-dom
```

## 📋 각 의존성 상세 설명

### React 관련

- **react**: 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리
- **react-dom**: React 컴포넌트를 DOM에 렌더링하는 라이브러리
- **react-router-dom**: 단일 페이지 애플리케이션(SPA)에서 클라이언트 사이드 라우팅을 제공

### HTTP 통신

- **axios**: Promise 기반의 HTTP 클라이언트로, RESTful API와 통신할 때 사용

### 3D 그래픽

- **three**: 웹에서 3D 그래픽을 렌더링하기 위한 JavaScript 라이브러리
- **@react-three/fiber**: Three.js를 React 컴포넌트로 사용할 수 있게 해주는 라이브러리
- **@react-three/drei**: Three.js 작업을 쉽게 해주는 유틸리티 및 헬퍼 함수 모음

### UI/UX

- **@fortawesome/fontawesome-free**: 다양한 아이콘을 제공하는 라이브러리

### 빌드 도구

- **vite**: 빠른 개발 서버와 빌드 도구
- **@vitejs/plugin-react-swc**: Vite에서 React를 사용하기 위한 플러그인 (SWC 컴파일러 사용)

### 코드 품질

- **eslint**: JavaScript/React 코드의 오류와 잠재적 문제를 찾아주는 린터
- **eslint-plugin-react-hooks**: React Hooks 규칙을 검사하는 플러그인
- **eslint-plugin-react-refresh**: React Fast Refresh와 호환되는 코드인지 검사

## 🔧 프로젝트 설정 파일

### package.json

프로젝트의 메타데이터와 의존성 정보를 포함합니다.

### vite.config.js

Vite 빌드 도구 설정 파일입니다. 현재 설정:
- React 플러그인 사용
- `/api` 경로를 `http://127.0.0.1:9080`으로 프록시 설정

### eslint.config.js

ESLint 린터 설정 파일입니다.

## 📝 스크립트 명령어

`package.json`에 정의된 스크립트:

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 코드 린팅
npm run lint

# 빌드 결과 미리보기
npm run preview
```

## ⚠️ 주의사항

1. **Node.js 버전**: Node.js 18 이상이 필요합니다.
2. **npm 버전**: npm 9 이상을 권장합니다.
3. **의존성 충돌**: 설치 중 의존성 충돌이 발생하면 `package-lock.json`을 삭제하고 다시 설치하세요:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🔄 의존성 업데이트

### 특정 패키지 업데이트

```bash
# 최신 버전으로 업데이트
npm update <package-name>

# 최신 버전 확인
npm outdated
```

### 모든 의존성 업데이트

```bash
# npm-check-updates 사용 (권장)
npx npm-check-updates -u
npm install
```

## 📚 추가 리소스

- [React 공식 문서](https://react.dev/)
- [React Router 문서](https://reactrouter.com/)
- [Three.js 문서](https://threejs.org/)
- [Vite 문서](https://vite.dev/)
- [Axios 문서](https://axios-http.com/)

---

**마지막 업데이트**: 2024년

