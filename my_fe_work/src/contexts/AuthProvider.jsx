/**
 * AuthProvider 컴포넌트
 * 
 * 인증 상태를 관리하고 하위 컴포넌트에 제공하는 Provider 컴포넌트입니다.
 * Access Token과 사용자 정보를 메모리에 저장하여 보안을 강화하고,
 * 새로고침 시 sessionStorage에서 복원할 수 있도록 합니다.
 * 
 * ## AuthProvider와 useAuth의 관계
 * 
 * ### AuthProvider (이 컴포넌트)
 * - **역할**: 인증 상태를 관리하고 제공하는 Provider
 * - **하는 일**:
 *   - 인증 상태 관리 (accessToken, user, isLoading)
 *   - 인증 관련 함수 구현 (login, logout, refreshAccessToken 등)
 *   - 하위 컴포넌트에 상태와 함수 제공
 * 
 * ### useAuth (커스텀 훅)
 * - **역할**: AuthProvider가 제공한 상태와 함수를 사용하기 위한 훅
 * - **하는 일**:
 *   - AuthContext에서 값을 가져옴
 *   - AuthProvider 외부에서 사용 시 에러 처리
 * 
 * ### 사용 예시
 * 
 * ```jsx
 * // 1. App을 AuthProvider로 감싸기 (main.jsx)
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * // 2. 컴포넌트에서 useAuth 사용
 * function Login() {
 *   const { login, user } = useAuth()  // ← useAuth 훅 사용
 *   // ...
 * }
 * ```
 * 
 * ### 왜 두 개가 필요한가?
 * 
 * - **AuthProvider**: 상태를 "제공"하는 역할 (Provider 패턴)
 * - **useAuth**: 상태를 "사용"하는 역할 (커스텀 훅 패턴)
 * 
 * 직접 `useContext(AuthContext)`를 사용할 수도 있지만,
 * `useAuth()` 커스텀 훅을 사용하면:
 * - 에러 처리가 자동으로 됨
 * - 코드가 더 읽기 쉬움
 * - 일관성 있는 API 제공
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthContext } from './AuthContext'
import apiClient from '../utils/axiosConfig'
import { setAccessToken, clearAccessToken, addTokenChangeListener } from '../utils/tokenStorage'

/**
 * AuthProvider 컴포넌트
 * 
 * 인증 상태를 관리하고 하위 컴포넌트에 제공하는 Provider 컴포넌트입니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.children - 하위 컴포넌트들
 * 
 * 주요 기능:
 * 1. Access Token을 메모리(React State + 모듈 변수)에만 저장하여 XSS 공격에 대한 보안을 강화합니다.
 * 2. 새로고침 시 Refresh Token으로 자동 재인증합니다.
 * 3. 로그인/로그아웃 기능을 제공합니다.
 * 
 * ## 보안 개선
 * 
 * ### 변경 사항
 * - ❌ 이전: Access Token을 sessionStorage에 저장 (XSS 공격에 취약)
 * - ✅ 현재: Access Token을 메모리에만 저장 (XSS 공격에 상대적으로 안전)
 * 
 * ### 새로고침 시 동작
 * - Access Token은 메모리에만 있어서 새로고침 시 사라짐
 * - Refresh Token(쿠키)으로 자동 재인증하여 새 Access Token 획득
 */
export const AuthProvider = ({ children }) => {
  /**
   * Access Token 상태
   * 
   * Access Token은 메모리(React State + 모듈 변수)에만 저장됩니다.
   * sessionStorage를 사용하지 않아 XSS 공격에 대한 보안이 강화되었습니다.
   * 
   * 보안:
   * - XSS 공격에 상대적으로 안전 (JavaScript로 직접 접근 어려움)
   * - 새로고침 시 자동으로 사라짐 (Refresh Token으로 재인증)
   * - 탭 간 공유되지 않음 (각 탭이 독립적으로 인증)
   */
  const [accessToken, setAccessTokenState] = useState(() => {
    // 초기값은 null (새로고침 시 Refresh Token으로 재인증)
    return null
  })
  
  // setAccessTokenState 함수의 최신 참조를 유지하기 위한 ref
  const setAccessTokenStateRef = useRef(setAccessTokenState)
  
  // setAccessTokenState가 변경될 때마다 ref 업데이트
  useEffect(() => {
    setAccessTokenStateRef.current = setAccessTokenState
  }, [setAccessTokenState])
  
  // React state → 모듈 변수 동기화 (단방향)
  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken)
    } else {
      clearAccessToken()
    }
  }, [accessToken])
  
  // 모듈 변수 → React state 동기화 (양방향 동기화 완성)
  // axios interceptor에서 토큰을 갱신할 때 React state도 업데이트되도록 함
  useEffect(() => {
    const removeListener = addTokenChangeListener((newToken) => {
      // 모듈 변수가 변경되었을 때 React state도 업데이트
      // ref를 사용하여 항상 최신 setAccessTokenState 함수 참조
      // 현재 state와 다를 때만 업데이트하여 무한 루프 방지
      setAccessTokenStateRef.current((currentToken) => {
        if (currentToken !== newToken) {
          return newToken
        }
        return currentToken
      })
    })
    
    // 컴포넌트 언마운트 시 리스너 제거
    return removeListener
  }, []) // 마운트 시 한 번만 실행 (ref를 사용하므로 의존성 불필요)
  
  /**
   * 사용자 정보 상태
   * 
   * 현재 로그인한 사용자의 정보를 저장합니다.
   * useState의 lazy initialization을 사용하여 초기값을 sessionStorage에서 가져옵니다.
   * 일반적으로 { id, email, name, role } 등의 속성을 포함합니다.
   */
  const [user, setUser] = useState(() => {
    // useState의 lazy initialization: 함수를 전달하면 첫 렌더링 시에만 실행됩니다.
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse user data:', e)
        return null
      }
    }
    return null
  })
  
  /**
   * 초기 로딩 상태
   * 
   * 컴포넌트가 마운트될 때 Refresh Token으로 재인증하는 동안 true로 설정됩니다.
   */
  const [isLoading, setIsLoading] = useState(true)

  /**
   * refreshAccessToken 함수
   * 
   * Refresh Token을 사용하여 Access Token을 갱신합니다.
   * 웹 브라우저에서는 쿠키에서 자동으로 Refresh Token을 읽습니다.
   * 
   * @returns {Promise<string>} - 새로운 Access Token 반환
   * @throws {Error} - Refresh Token이 만료되었거나 유효하지 않은 경우
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      // 웹 브라우저에서는 쿠키에서 자동으로 Refresh Token을 읽으므로 요청 바디 없음
      // 모바일의 경우 sessionStorage에서 refreshToken을 가져와서 보내야 함
      const refreshToken = sessionStorage.getItem('refreshToken')
      
      const response = await apiClient.post('/refresh', 
        refreshToken ? { refreshToken } : undefined
      )

      if (response.data.success) {
        const newAccessToken = response.data.data.accessToken
        
        // 새 Access Token을 메모리에 저장 (React State + 모듈 변수)
        setAccessTokenState(newAccessToken)
        
        return newAccessToken
      } else {
        throw new Error(response.data.message || '토큰 갱신에 실패했습니다.')
      }
    } catch (error) {
      // Refresh Token도 만료된 경우 로그아웃 처리
      setAccessTokenState(null)
      setUser(null)
      throw error
    }
  }, [])

  /**
   * 컴포넌트 마운트 시 실행되는 Effect
   * 
   * 새로고침 시 Refresh Token으로 자동 재인증을 시도합니다.
   * Access Token은 메모리에만 저장되므로 새로고침 시 사라지지만,
   * Refresh Token(쿠키)으로 새 Access Token을 받아옵니다.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Refresh Token이 있는지 확인 (쿠키 또는 sessionStorage)
        const refreshToken = sessionStorage.getItem('refreshToken')
        const hasRefreshCookie = document.cookie.includes('refreshToken')
        
        // Refresh Token이 있으면 자동 재인증 시도
        if (refreshToken || hasRefreshCookie) {
          try {
            await refreshAccessToken()
            // refreshAccessToken이 성공하면 accessToken 상태가 자동으로 업데이트됨
          } catch (error) {
            // Refresh Token이 만료되었거나 유효하지 않은 경우
            console.log('자동 재인증 실패:', error)
            // 상태는 이미 null로 유지됨
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('인증 초기화 실패:', error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()
  }, [refreshAccessToken]) // refreshAccessToken이 변경될 때마다 실행 (하지만 useCallback으로 안정적)

  /**
   * 사용자 정보 변경 시 실행되는 Effect
   * 
   * 사용자 정보는 새로고침 시 복원을 위해 sessionStorage에 저장합니다.
   * (사용자 정보는 Access Token보다 덜 민감한 정보이므로)
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
   * login 함수 (API 호출)
   * 
   * 이메일과 비밀번호로 로그인을 시도하고, 성공 시 토큰을 저장합니다.
   * 
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<Object>} - 로그인 성공 시 사용자 정보 반환
   * @throws {Error} - 로그인 실패 시 에러 발생
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password
      })

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data
        
        // Access Token을 메모리(React State + 모듈 변수)에 저장합니다.
        setAccessTokenState(accessToken)
        
        // 사용자 정보를 메모리에 저장합니다.
        setUser(user)
        
        // Refresh Token은 sessionStorage에 저장합니다.
        // 웹에서는 쿠키로 자동 전송되지만, 응답에 포함된 경우 저장
        if (refreshToken) {
          sessionStorage.setItem('refreshToken', refreshToken)
        }
        
        return { user, accessToken }
      } else {
        throw new Error(response.data.message || '로그인에 실패했습니다.')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '로그인에 실패했습니다.'
      throw new Error(errorMessage)
    }
  }, [])

  /**
   * loginWithToken 함수
   * 
   * 이미 받은 토큰 데이터를 저장하는 함수입니다.
   * 카카오 로그인 등 외부에서 토큰을 받은 경우 사용합니다.
   * 
   * @param {Object} tokenData - 토큰 데이터 객체
   * @param {string} tokenData.accessToken - JWT Access Token
   * @param {string} tokenData.refreshToken - JWT Refresh Token (선택)
   * @param {Object} tokenData.user - 사용자 정보 객체
   */
  const loginWithToken = useCallback((tokenData) => {
    // Access Token을 메모리(React State + 모듈 변수)에 저장합니다.
    setAccessTokenState(tokenData.accessToken)
    
    // 사용자 정보를 메모리에 저장합니다.
    setUser(tokenData.user)
    
    // Refresh Token은 sessionStorage에 저장합니다.
    if (tokenData.refreshToken) {
      sessionStorage.setItem('refreshToken', tokenData.refreshToken)
    }
  }, [])

  /**
   * logout 함수 (API 호출)
   * 
   * 서버에 로그아웃 요청을 보내고, 로컬 저장소를 정리합니다.
   * 
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      // 서버에 로그아웃 요청 (Access Token이 자동으로 헤더에 추가됨)
      await apiClient.post('/logout')
    } catch (error) {
      // 서버 요청 실패해도 로컬 정리는 수행
      console.error('로그아웃 요청 실패:', error)
    } finally {
      // 메모리에서 Access Token 제거
      setAccessTokenState(null)
      
      // 메모리에서 사용자 정보 제거
      setUser(null)
      
      // sessionStorage에서 Refresh Token과 사용자 정보 제거
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('user')
    }
  }, [])


  /**
   * Context에 제공할 값 객체
   * 
   * 하위 컴포넌트에서 useAuth() 훅을 통해 접근할 수 있는 값들입니다.
   */
  const value = {
    accessToken,              // 현재 Access Token
    user,                     // 현재 사용자 정보
    isLoading,                // 초기 로딩 상태
    login,                    // 로그인 함수 (API 호출)
    loginWithToken,           // 토큰으로 로그인 함수
    logout,                   // 로그아웃 함수 (API 호출)
    refreshAccessToken,       // Access Token 갱신 함수
    isAuthenticated: !!accessToken  // 인증 여부 (accessToken이 존재하면 true)
  }

  // AuthContext.Provider로 하위 컴포넌트들을 감싸고 value를 제공합니다.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

