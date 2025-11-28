/**
 * AuthProvider 컴포넌트
 * 
 * 인증 상태를 관리하고 하위 컴포넌트에 제공하는 Provider 컴포넌트입니다.
 * Access Token과 사용자 정보를 메모리에 저장하여 보안을 강화하고,
 * 새로고침 시 sessionStorage에서 복원할 수 있도록 합니다.
 */
import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

/**
 * AuthProvider 컴포넌트
 * 
 * 인증 상태를 관리하고 하위 컴포넌트에 제공하는 Provider 컴포넌트입니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.children - 하위 컴포넌트들
 * 
 * 주요 기능:
 * 1. Access Token을 메모리(React State)에 저장하여 XSS 공격에 덜 취약하게 만듭니다.
 * 2. 새로고침 시 sessionStorage에서 토큰을 복원합니다.
 * 3. 토큰 변경 시 sessionStorage에 자동으로 백업합니다.
 * 4. 로그인/로그아웃 기능을 제공합니다.
 */
export const AuthProvider = ({ children }) => {
  /**
   * Access Token 상태
   * 
   * Access Token은 메모리(React State)에 저장됩니다.
   * 이는 localStorage보다 안전한 방법입니다:
   * - XSS 공격에 덜 취약 (JavaScript로 직접 접근 불가)
   * - 탭이 닫히면 자동으로 사라짐 (sessionStorage와 함께 사용)
   * - 새로고침 시 sessionStorage에서 복원 가능
   */
  const [accessToken, setAccessToken] = useState(null)
  
  /**
   * 사용자 정보 상태
   * 
   * 현재 로그인한 사용자의 정보를 저장합니다.
   * 일반적으로 { id, email, name, role } 등의 속성을 포함합니다.
   */
  const [user, setUser] = useState(null)
  
  /**
   * 초기 로딩 상태
   * 
   * 컴포넌트가 마운트될 때 sessionStorage에서 토큰을 복원하는 동안
   * true로 설정되어 로딩 상태를 나타냅니다.
   * 이는 토큰 복원이 완료되기 전에 인증되지 않은 상태로 렌더링되는 것을 방지합니다.
   */
  const [isLoading, setIsLoading] = useState(true)

  /**
   * 컴포넌트 마운트 시 실행되는 Effect
   * 
   * 페이지가 로드되거나 새로고침될 때 sessionStorage에서 저장된 토큰과 사용자 정보를 복원합니다.
   * 
   * 의존성 배열이 비어있으므로 컴포넌트가 마운트될 때 한 번만 실행됩니다.
   */
  useEffect(() => {
    // sessionStorage에서 Access Token을 가져옵니다.
    const storedToken = sessionStorage.getItem('accessToken')
    
    // sessionStorage에서 사용자 정보를 가져옵니다 (JSON 문자열 형태)
    const storedUser = sessionStorage.getItem('user')
    
    // 저장된 토큰이 있으면 상태에 설정합니다.
    if (storedToken) {
      setAccessToken(storedToken)
    }
    
    // 저장된 사용자 정보가 있으면 파싱하여 상태에 설정합니다.
    if (storedUser) {
      try {
        // JSON 문자열을 JavaScript 객체로 변환합니다.
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // JSON 파싱 실패 시 에러를 로그에 출력합니다.
        // 잘못된 형식의 데이터가 저장된 경우를 대비합니다.
        console.error('Failed to parse user data:', e)
      }
    }
    
    // 토큰 복원이 완료되었으므로 로딩 상태를 비활성화합니다.
    setIsLoading(false)
  }, []) // 빈 의존성 배열: 마운트 시 한 번만 실행

  /**
   * Access Token 변경 시 실행되는 Effect
   * 
   * Access Token이 변경될 때마다 sessionStorage에 백업합니다.
   * 이렇게 하면 새로고침 시에도 토큰을 복원할 수 있습니다.
   * 
   * @param {string|null} accessToken - 현재 Access Token
   */
  useEffect(() => {
    if (accessToken) {
      // 토큰이 있으면 sessionStorage에 저장합니다.
      sessionStorage.setItem('accessToken', accessToken)
    } else {
      // 토큰이 null이면 sessionStorage에서 제거합니다 (로그아웃 시).
      sessionStorage.removeItem('accessToken')
    }
  }, [accessToken]) // accessToken이 변경될 때마다 실행

  /**
   * 사용자 정보 변경 시 실행되는 Effect
   * 
   * 사용자 정보가 변경될 때마다 sessionStorage에 백업합니다.
   * 
   * @param {Object|null} user - 현재 사용자 정보
   */
  useEffect(() => {
    if (user) {
      // 사용자 정보가 있으면 JSON 문자열로 변환하여 sessionStorage에 저장합니다.
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      // 사용자 정보가 null이면 sessionStorage에서 제거합니다.
      sessionStorage.removeItem('user')
    }
  }, [user]) // user가 변경될 때마다 실행

  /**
   * login 함수
   * 
   * 로그인 성공 시 호출되는 함수입니다.
   * Access Token과 사용자 정보를 메모리에 저장하고,
   * Refresh Token은 sessionStorage에 저장합니다.
   * 
   * @param {Object} tokenData - 토큰 데이터 객체
   * @param {string} tokenData.accessToken - JWT Access Token
   * @param {string} tokenData.refreshToken - JWT Refresh Token
   * @param {Object} tokenData.user - 사용자 정보 객체
   */
  const login = (tokenData) => {
    // Access Token을 메모리(React State)에 저장합니다.
    // 이는 가장 안전한 방법입니다 (XSS 공격에 덜 취약).
    setAccessToken(tokenData.accessToken)
    
    // 사용자 정보를 메모리에 저장합니다.
    setUser(tokenData.user)
    
    // Refresh Token은 sessionStorage에 저장합니다.
    // 참고: 가장 안전한 방법은 서버에서 httpOnly Cookie로 설정하는 것이지만,
    // 서버 설정이 필요하므로 현재는 sessionStorage를 사용합니다.
    if (tokenData.refreshToken) {
      sessionStorage.setItem('refreshToken', tokenData.refreshToken)
    }
  }

  /**
   * logout 함수
   * 
   * 로그아웃 시 호출되는 함수입니다.
   * 메모리와 sessionStorage에서 모든 인증 정보를 제거합니다.
   */
  const logout = () => {
    // 메모리에서 Access Token 제거
    setAccessToken(null)
    
    // 메모리에서 사용자 정보 제거
    setUser(null)
    
    // sessionStorage에서 모든 인증 관련 데이터 제거
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')
  }

  /**
   * Context에 제공할 값 객체
   * 
   * 하위 컴포넌트에서 useAuth() 훅을 통해 접근할 수 있는 값들입니다.
   */
  const value = {
    accessToken,              // 현재 Access Token
    user,                     // 현재 사용자 정보
    isLoading,                // 초기 로딩 상태
    login,                    // 로그인 함수
    logout,                   // 로그아웃 함수
    isAuthenticated: !!accessToken  // 인증 여부 (accessToken이 존재하면 true)
  }

  // AuthContext.Provider로 하위 컴포넌트들을 감싸고 value를 제공합니다.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

