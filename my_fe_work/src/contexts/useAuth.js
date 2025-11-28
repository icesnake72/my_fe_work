/**
 * useAuth 커스텀 훅
 * 
 * AuthContext를 사용하기 위한 커스텀 훅입니다.
 * 이 훅을 사용하면 AuthProvider 내부의 컴포넌트에서만 인증 상태에 접근할 수 있습니다.
 * 
 * @returns {Object} - 인증 관련 상태와 함수들을 포함한 객체
 * @throws {Error} - AuthProvider 외부에서 사용 시 에러 발생
 * 
 * 반환값:
 * - accessToken: 현재 Access Token (string | null)
 * - user: 현재 사용자 정보 (Object | null)
 * - isLoading: 초기 로딩 상태 (boolean)
 * - login: 로그인 함수
 * - logout: 로그아웃 함수
 * - isAuthenticated: 인증 여부 (boolean)
 */
import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

export const useAuth = () => {
  // useContext를 사용하여 AuthContext의 현재 값을 가져옵니다.
  const context = useContext(AuthContext)
  
  // Context가 null인 경우 (AuthProvider 외부에서 사용한 경우) 에러를 발생시킵니다.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

