/**
 * useAuth 커스텀 훅
 * 
 * AuthContext를 사용하기 위한 커스텀 훅입니다.
 * 
 * ## 왜 커스텀 훅이 필요한가?
 * 
 * React Context를 사용할 때, 직접 `useContext(AuthContext)`를 사용할 수도 있습니다.
 * 하지만 커스텀 훅을 만드는 것이 더 좋은 이유:
 * 
 * 1. **에러 처리 중앙화**
 *    - AuthProvider 외부에서 사용 시 명확한 에러 메시지 제공
 *    - 각 컴포넌트마다 에러 체크 코드를 작성할 필요 없음
 * 
 * 2. **코드 재사용성과 일관성**
 *    - 모든 컴포넌트에서 동일한 방식으로 인증 상태에 접근
 *    - 나중에 로직이 변경되어도 한 곳만 수정하면 됨
 * 
 * 3. **타입 안정성 (TypeScript 사용 시)**
 *    - 반환 타입을 명확히 정의 가능
 *    - IDE 자동완성 지원
 * 
 * 4. **가독성 향상**
 *    - `useAuth()`가 `useContext(AuthContext)`보다 의미가 명확함
 *    - 코드를 읽는 사람이 무엇을 하는지 쉽게 이해 가능
 * 
 * ## 사용 예시
 * 
 * ```jsx
 * // ❌ 직접 useContext 사용 (권장하지 않음)
 * const context = useContext(AuthContext)
 * if (!context) {
 *   throw new Error('AuthProvider가 필요합니다')
 * }
 * const { user, login } = context
 * 
 * // ✅ useAuth 커스텀 훅 사용 (권장)
 * const { user, login } = useAuth()
 * ```
 * 
 * ## AuthProvider와의 관계
 * 
 * - **AuthProvider**: 인증 상태를 관리하고 하위 컴포넌트에 제공하는 Provider 컴포넌트
 *   - 상태 관리 (accessToken, user, isLoading)
 *   - 인증 관련 함수 제공 (login, logout, refreshAccessToken 등)
 * 
 * - **useAuth**: AuthProvider가 제공한 상태와 함수를 사용하기 위한 커스텀 훅
 *   - AuthContext에서 값을 가져옴
 *   - 에러 처리 및 검증
 * 
 * @returns {Object} - 인증 관련 상태와 함수들을 포함한 객체
 * @throws {Error} - AuthProvider 외부에서 사용 시 에러 발생
 * 
 * 반환값:
 * - accessToken: 현재 Access Token (string | null)
 * - user: 현재 사용자 정보 (Object | null)
 * - isLoading: 초기 로딩 상태 (boolean)
 * - login: 로그인 함수
 * - loginWithToken: 토큰으로 로그인 함수
 * - logout: 로그아웃 함수
 * - refreshAccessToken: Access Token 갱신 함수
 * - isAuthenticated: 인증 여부 (boolean)
 */
import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

export const useAuth = () => {
  // useContext를 사용하여 AuthContext의 현재 값을 가져옵니다.
  const context = useContext(AuthContext)
  
  // Context가 null인 경우 (AuthProvider 외부에서 사용한 경우) 에러를 발생시킵니다.
  // 이는 개발자가 실수로 AuthProvider 없이 useAuth를 사용했을 때 빠르게 발견할 수 있게 해줍니다.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

