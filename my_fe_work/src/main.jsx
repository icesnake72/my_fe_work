/**
 * main.jsx
 * 
 * React 애플리케이션의 진입점(Entry Point)입니다.
 * 이 파일은 DOM에 React 컴포넌트를 렌더링하는 역할을 합니다.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthProvider.jsx'

/**
 * React 애플리케이션 렌더링
 * 
 * createRoot를 사용하여 React 18의 새로운 렌더링 방식을 사용합니다.
 * 
 * 구조:
 * 1. StrictMode: 개발 모드에서 잠재적인 문제를 감지하는 React의 개발 도구
 * 2. AuthProvider: 인증 상태를 전역적으로 관리하는 Context Provider
 *    - 모든 하위 컴포넌트에서 useAuth() 훅을 사용할 수 있도록 합니다.
 * 3. App: 메인 애플리케이션 컴포넌트 (라우팅 설정 포함)
 * 
 * 렌더링 순서:
 * - AuthProvider가 가장 바깥쪽에 있어 모든 컴포넌트가 인증 상태에 접근할 수 있습니다.
 * - App 컴포넌트 내부에서 React Router가 페이지 라우팅을 처리합니다.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 인증 상태를 전역적으로 제공하는 Provider */}
    <AuthProvider>
      {/* 메인 애플리케이션 컴포넌트 */}
      <App />
    </AuthProvider>
  </StrictMode>,
)
