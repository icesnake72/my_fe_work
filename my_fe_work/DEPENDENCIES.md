# 프로젝트 의존성 설치 가이드

> 이 프로젝트를 구동하기 위해 필요한 패키지들의 설치 가이드입니다.
> Vite는 이미 설치했다고 가정합니다.

---

## 📋 목차

1. [필수 의존성](#필수-의존성)
2. [선택적 의존성](#선택적-의존성)
3. [개발 의존성](#개발-의존성)
4. [설치하지 않아도 되는 것](#설치하지-않아도-되는-것)
5. [빠른 설치 가이드](#빠른-설치-가이드)

---

## 필수 의존성

반드시 설치해야 하는 패키지들입니다.

### 1. **react** & **react-dom**

```bash
npm install react react-dom
```

- **이유**: React 애플리케이션의 핵심 라이브러리
- **사용 위치**: 모든 컴포넌트에서 사용
- **버전**: `^19.2.0` (현재 프로젝트 기준)

### 2. **react-router-dom**

```bash
npm install react-router-dom
```

- **이유**: 클라이언트 사이드 라우팅을 위해 필요
- **사용 위치**:
  - `App.jsx`: `BrowserRouter`, `Routes`, `Route`
  - `Login.jsx`, `GNB.jsx` 등: `Link`, `useNavigate`, `useSearchParams`, `useLocation`
- **버전**: `^7.9.6` (현재 프로젝트 기준)

### 3. **axios**

```bash
npm install axios
```

- **이유**: HTTP 클라이언트 (API 호출)
- **사용 위치**:
  - `utils/axiosConfig.js`: API 클라이언트 설정 및 인터셉터
  - `pages/Home.jsx`, `pages/Signup.jsx`: 직접 API 호출
  - `contexts/AuthProvider.jsx`: 인증 관련 API 호출
- **버전**: `^1.13.2` (현재 프로젝트 기준)

### 4. **@fortawesome/fontawesome-free**

```bash
npm install @fortawesome/fontawesome-free
```

- **이유**: 아이콘 사용을 위해 필요
- **사용 위치**: `pages/Login.jsx`에서 아이콘 표시
- **버전**: `^7.1.0` (현재 프로젝트 기준)

---

## 선택적 의존성

기능에 따라 선택적으로 설치할 수 있는 패키지들입니다.

### 5. **@react-three/fiber**, **@react-three/drei**, **three**

```bash
npm install @react-three/fiber @react-three/drei three
```

- **이유**: 3D 그래픽 렌더링 (Welcome 페이지의 장식용)
- **사용 위치**: `components/FloatingShapes.jsx`에서만 사용
- **설치 여부**: 
  - ✅ Welcome 페이지의 3D 애니메이션이 필요하면 설치
  - ❌ 단순한 UI만 필요하면 제거 가능 (FloatingShapes 컴포넌트 제거 필요)
- **버전**: 
  - `@react-three/fiber`: `^9.4.0`
  - `@react-three/drei`: `^10.7.7`
  - `three`: `^0.181.2`

---

## 개발 의존성

개발 환경에서 필요한 패키지들입니다.

### 6. **@vitejs/plugin-react-swc**

```bash
npm install -D @vitejs/plugin-react-swc
```

- **이유**: Vite에서 React를 사용하기 위한 플러그인
- **사용 위치**: `vite.config.js`에서 사용
- **참고**: Vite를 설치했다면 이것도 반드시 필요합니다.
- **버전**: `^4.2.2` (현재 프로젝트 기준)

### 7. **ESLint 관련** (선택)

```bash
npm install -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

- **이유**: 코드 린팅 (코드 품질 검사)
- **설치 여부**: 
  - ✅ 코드 품질 검사가 필요하면 설치
  - ❌ 린팅이 필요 없으면 생략 가능
- **버전**:
  - `eslint`: `^9.39.1`
  - `@eslint/js`: `^9.39.1`
  - `eslint-plugin-react-hooks`: `^7.0.1`
  - `eslint-plugin-react-refresh`: `^0.4.24`
  - `globals`: `^16.5.0`

---

## 설치하지 않아도 되는 것

### TypeScript 관련

- `@types/react`
- `@types/react-dom`

**이유**: 이 프로젝트는 JavaScript를 사용합니다 (`.jsx` 파일). TypeScript를 사용하지 않으므로 타입 정의 파일이 필요 없습니다.

---

## 빠른 설치 가이드

### 최소 설치 (필수만)

프로젝트의 핵심 기능만 사용하려면 다음만 설치하면 됩니다:

```bash
# 필수 의존성
npm install react react-dom react-router-dom axios @fortawesome/fontawesome-free

# Vite React 플러그인 (Vite 사용 시 필수)
npm install -D @vitejs/plugin-react-swc
```

### 전체 설치 (권장)

모든 기능을 사용하려면 다음을 설치하세요:

```bash
# 필수 의존성
npm install react react-dom react-router-dom axios @fortawesome/fontawesome-free

# 선택적 의존성 (3D 그래픽 사용 시)
npm install @react-three/fiber @react-three/drei three

# 개발 의존성
npm install -D @vitejs/plugin-react-swc eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

### 한 번에 설치

```bash
npm install react react-dom react-router-dom axios @fortawesome/fontawesome-free @react-three/fiber @react-three/drei three

npm install -D @vitejs/plugin-react-swc eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

---

## 의존성 요약표

| 패키지 | 필수 여부 | 용도 | 설치 명령어 |
|--------|----------|------|------------|
| `react` | ✅ 필수 | React 핵심 라이브러리 | `npm install react react-dom` |
| `react-dom` | ✅ 필수 | React DOM 렌더링 | `npm install react react-dom` |
| `react-router-dom` | ✅ 필수 | 클라이언트 사이드 라우팅 | `npm install react-router-dom` |
| `axios` | ✅ 필수 | HTTP 클라이언트 | `npm install axios` |
| `@fortawesome/fontawesome-free` | ✅ 필수 | 아이콘 | `npm install @fortawesome/fontawesome-free` |
| `@react-three/fiber` | ⚠️ 선택 | 3D 그래픽 (React Three Fiber) | `npm install @react-three/fiber` |
| `@react-three/drei` | ⚠️ 선택 | 3D 그래픽 헬퍼 | `npm install @react-three/drei` |
| `three` | ⚠️ 선택 | 3D 그래픽 라이브러리 | `npm install three` |
| `@vitejs/plugin-react-swc` | ✅ 필수 | Vite React 플러그인 | `npm install -D @vitejs/plugin-react-swc` |
| ESLint 관련 | ⚠️ 선택 | 코드 품질 검사 | `npm install -D eslint ...` |

---

## 설치 후 확인

설치가 완료되면 다음 명령어로 프로젝트를 실행할 수 있습니다:

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 Vite가 지정한 포트)로 접속하여 확인하세요.

---

## 문제 해결

### 패키지 설치 오류

만약 패키지 설치 중 오류가 발생하면:

1. **node_modules 폴더 삭제 후 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **npm 캐시 클리어**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Node.js 버전 확인**
   - 권장: Node.js 18.x 이상
   - 확인: `node --version`

### Vite 관련 오류

Vite가 제대로 작동하지 않으면:

1. **Vite 설치 확인**
   ```bash
   npm list vite
   ```

2. **Vite React 플러그인 확인**
   ```bash
   npm list @vitejs/plugin-react-swc
   ```

---

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [React Router 공식 문서](https://reactrouter.com/)
- [Axios 공식 문서](https://axios-http.com/)
- [Vite 공식 문서](https://vite.dev/)
- [Font Awesome 공식 문서](https://fontawesome.com/)

---

**마지막 업데이트**: 2025년 1월
