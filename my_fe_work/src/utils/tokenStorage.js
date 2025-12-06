/**
 * tokenStorage 모듈
 * 
 * Access Token을 메모리에만 저장하여 XSS 공격에 대한 보안을 강화합니다.
 * 
 * ## 보안 고려사항
 * 
 * ### sessionStorage의 위험성
 * - XSS 공격 시 JavaScript로 접근 가능: `sessionStorage.getItem('accessToken')`
 * - 악성 스크립트가 토큰을 탈취할 수 있음
 * 
 * ### 메모리 저장의 장점
 * - JavaScript 변수에만 저장되어 XSS 공격에 상대적으로 안전
 * - 페이지 새로고침 시 자동으로 사라짐
 * - 브라우저 DevTools에서도 직접 접근 어려움
 * 
 * ### 단점과 해결책
 * - 새로고침 시 토큰 손실 → Refresh Token으로 재인증
 * - 탭 간 공유 불가 → 각 탭이 독립적으로 인증 (보안상 오히려 좋음)
 * 
 * ## 동기화 메커니즘
 * 
 * React state와 모듈 변수 간의 양방향 동기화를 위해 리스너 패턴을 사용합니다.
 * - React state → 모듈 변수: useEffect에서 자동 동기화
 * - 모듈 변수 → React state: 리스너 콜백을 통해 동기화
 */
let accessTokenMemory = null
let tokenChangeListeners = []

/**
 * Access Token 변경 리스너를 등록합니다.
 * 
 * @param {Function} listener - 토큰이 변경될 때 호출될 콜백 함수
 * @param {string|null} listener.newToken - 새로운 Access Token (null이면 삭제)
 * @returns {Function} - 리스너 제거 함수
 */
export const addTokenChangeListener = (listener) => {
  tokenChangeListeners.push(listener)
  
  // 리스너 제거 함수 반환
  return () => {
    tokenChangeListeners = tokenChangeListeners.filter(l => l !== listener)
  }
}

/**
 * 모든 리스너에게 토큰 변경을 알립니다.
 * 
 * @param {string|null} newToken - 새로운 Access Token
 */
const notifyTokenChange = (newToken) => {
  tokenChangeListeners.forEach(listener => {
    try {
      listener(newToken)
    } catch (error) {
      console.error('Token change listener error:', error)
    }
  })
}

/**
 * Access Token을 메모리에 저장합니다.
 * 
 * @param {string|null} token - 저장할 Access Token (null이면 삭제)
 */
export const setAccessToken = (token) => {
  const previousToken = accessTokenMemory
  accessTokenMemory = token
  
  // 토큰이 실제로 변경된 경우에만 리스너에게 알림
  if (previousToken !== token) {
    notifyTokenChange(token)
  }
}

/**
 * 메모리에서 Access Token을 가져옵니다.
 * 
 * @returns {string|null} - 저장된 Access Token 또는 null
 */
export const getAccessToken = () => {
  return accessTokenMemory
}

/**
 * 메모리에서 Access Token을 삭제합니다.
 */
export const clearAccessToken = () => {
  if (accessTokenMemory !== null) {
    accessTokenMemory = null
    notifyTokenChange(null)
  }
}
