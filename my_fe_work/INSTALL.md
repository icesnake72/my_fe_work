# 빠른 설치 가이드

## 🚀 프로젝트 시작하기

### 1. 프로젝트 클론 또는 다운로드

```bash
cd my_fe_work
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 표시된 포트)로 접속하세요.

## 📦 설치 명령어 요약

### 전체 설치 (권장)

```bash
npm install
```

### 개별 설치

#### 프로덕션 의존성

```bash
npm install react react-dom react-router-dom axios three @react-three/fiber @react-three/drei @fortawesome/fontawesome-free
```

#### 개발 의존성

```bash
npm install -D vite @vitejs/plugin-react-swc eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals @types/react @types/react-dom
```

## 🔧 필수 요구사항

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상

버전 확인:

```bash
node --version
npm --version
```

## 📝 사용 가능한 스크립트

```bash
# 개발 서버 실행 (Hot Module Replacement 포함)
npm run dev

# 프로덕션 빌드
npm run build

# 코드 린팅 (오류 검사)
npm run lint

# 빌드 결과 미리보기
npm run preview
```

## ⚠️ 문제 해결

### 의존성 설치 오류

```bash
# node_modules와 package-lock.json 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 포트 충돌

개발 서버가 실행 중인 포트가 이미 사용 중인 경우, Vite가 자동으로 다른 포트를 사용합니다.

### 캐시 문제

```bash
# npm 캐시 정리
npm cache clean --force
```

## 📚 상세 정보

더 자세한 정보는 [DEPENDENCIES.md](./DEPENDENCIES.md) 파일을 참조하세요.

