/**
 * App 컴포넌트
 * 
 * 애플리케이션의 메인 컴포넌트입니다.
 * React Router를 사용하여 클라이언트 사이드 라우팅을 설정합니다.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Signup from './pages/Signup'
import SignupSuccess from './pages/SignupSuccess'
import Login from './pages/Login'
import KakaoCallback from './pages/KakaoCallback'
import './App.css'

/**
 * App 함수 컴포넌트
 * 
 * BrowserRouter로 애플리케이션을 감싸고,
 * Routes와 Route를 사용하여 URL 경로에 따라 다른 컴포넌트를 렌더링합니다.
 * 
 * 라우팅 구조:
 * - "/" → Welcome 페이지 (초기 진입 페이지)
 * - "/home" → Home 페이지 (메인 콘텐츠 페이지)
 * - "/signup" → Signup 페이지 (회원가입 페이지)
 * - "/signup-success" → SignupSuccess 페이지 (회원가입 성공 페이지)
 * - "/login" → Login 페이지 (로그인 페이지)
 */
function App() {  
  return (
    // BrowserRouter: HTML5 History API를 사용하여 클라이언트 사이드 라우팅을 제공
    <BrowserRouter>
      {/* Routes: 여러 Route를 그룹화하는 컨테이너 */}
      <Routes>
        {/* Route: 특정 경로와 컴포넌트를 매핑 */}
        {/* "/" 경로: Welcome 페이지를 렌더링 */}
        <Route path="/" element={<Welcome />} />
        
        {/* "/home" 경로: Home 페이지를 렌더링 */}
        <Route path="/home" element={<Home />} />
        
        {/* "/signup" 경로: Signup 페이지를 렌더링 */}
        <Route path="/signup" element={<Signup />} />
        
        {/* "/signup-success" 경로: SignupSuccess 페이지를 렌더링 */}
        <Route path="/signup-success" element={<SignupSuccess />} />
        
        {/* "/login" 경로: Login 페이지를 렌더링 */}
        <Route path="/login" element={<Login />} />
        
        {/* "/auth/kakao/callback" 경로: 카카오 로그인 콜백 페이지를 렌더링 */}
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        
        {/* "/oauth/callback" 경로: OAuth 콜백 페이지 (카카오 로그인 포함) */}
        <Route path="/oauth/callback" element={<KakaoCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
