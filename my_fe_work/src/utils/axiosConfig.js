/**
 * axiosConfig 모듈
 * 
 * axios 인스턴스를 생성하고 인터셉터를 설정하여
 * 모든 API 요청에 Access Token을 자동으로 추가하고,
 * 401 에러 발생 시 Refresh Token으로 자동 갱신을 시도합니다.
 * 
 * ## 보안 개선
 * 
 * Access Token은 메모리에만 저장하여 XSS 공격에 대한 보안을 강화했습니다.
 * sessionStorage 대신 메모리 변수를 사용합니다.
 */
import axios from 'axios'
import { getAccessToken, setAccessToken } from './tokenStorage'

/**
 * axios 인스턴스 생성
 * 
 * 기본 설정이 적용된 axios 인스턴스를 생성합니다.
 * 이 인스턴스를 사용하여 모든 API 요청을 보냅니다.
 * 
 * 설정:
 * - baseURL: '/api' - 모든 요청의 기본 URL (Vite proxy를 통해 백엔드로 전달됨)
 * - headers: 기본 헤더 설정 (Content-Type: application/json)
 */
const apiClient = axios.create({
  baseURL: '/api',  // 모든 요청의 기본 경로
  headers: {
    'Content-Type': 'application/json'  // JSON 형식의 데이터를 전송함을 명시
  },
  withCredentials: true // 쿠키 전송을 위해 필요 (Refresh Token이 쿠키로 전송되는 경우)
})

/**
 * 요청 인터셉터
 * 
 * 모든 API 요청이 전송되기 전에 실행됩니다.
 * 메모리에서 Access Token을 가져와 Authorization 헤더에 자동으로 추가합니다.
 * 
 * 동작 과정:
 * 1. 메모리에서 Access Token을 가져옵니다 (XSS 공격에 상대적으로 안전).
 * 2. 토큰이 존재하면 'Bearer {token}' 형식으로 Authorization 헤더에 추가합니다.
 * 3. 수정된 config 객체를 반환하여 요청을 계속 진행합니다.
 * 
 * 보안 개선:
 * - sessionStorage 대신 메모리 변수를 사용하여 XSS 공격에 대한 보안 강화
 * - 인터셉터는 React Context에 접근할 수 없으므로 모듈 레벨 변수 사용
 */
apiClient.interceptors.request.use(
  /**
   * 요청 성공 시 실행되는 함수
   * 
   * @param {Object} config - axios 요청 설정 객체
   * @returns {Object} - 수정된 config 객체
   */
  (config) => {
    // 메모리에서 Access Token을 가져옵니다 (XSS 공격에 상대적으로 안전).
    const token = getAccessToken()
    
    // 토큰이 존재하는 경우 Authorization 헤더에 추가합니다.
    if (token) {
      // Bearer 토큰 형식: 'Bearer {token}'
      // 이는 OAuth 2.0 표준 형식입니다.
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 수정된 config 객체를 반환하여 요청을 계속 진행합니다.
    return config
  },
  /**
   * 요청 에러 시 실행되는 함수
   * 
   * @param {Error} error - 요청 에러 객체
   * @returns {Promise} - 거부된 Promise
   */
  (error) => {
    // 에러를 그대로 전달하여 catch 블록에서 처리할 수 있도록 합니다.
    return Promise.reject(error)
  }
)

/**
 * 응답 인터셉터
 * 
 * 모든 API 응답을 처리하기 전에 실행됩니다.
 * 401 Unauthorized 에러가 발생하면 Refresh Token을 사용하여
 * Access Token을 자동으로 갱신하고 원래 요청을 재시도합니다.
 * 
 * 동작 과정:
 * 1. 응답이 성공이면 그대로 반환합니다.
 * 2. 401 에러가 발생하면:
 *    a. Refresh Token을 사용하여 새 Access Token을 요청합니다.
 *    b. 새 토큰을 받으면 sessionStorage에 저장합니다.
 *    c. 원래 요청의 Authorization 헤더를 새 토큰으로 업데이트합니다.
 *    d. 원래 요청을 재시도합니다.
 * 3. Refresh Token도 만료된 경우 로그아웃 처리하고 로그인 페이지로 이동합니다.
 */
apiClient.interceptors.response.use(
  /**
   * 응답 성공 시 실행되는 함수
   * 
   * @param {Object} response - axios 응답 객체
   * @returns {Object} - 응답 객체를 그대로 반환
   */
  (response) => {
    // 성공한 응답은 그대로 반환합니다.
    return response
  },
  /**
   * 응답 에러 시 실행되는 함수
   * 
   * @param {Error} error - axios 에러 객체
   * @returns {Promise} - 거부된 Promise 또는 재시도된 요청의 Promise
   */
  async (error) => {
    // 원래 요청의 설정 객체를 가져옵니다.
    // 이 객체를 사용하여 나중에 요청을 재시도할 수 있습니다.
    const originalRequest = error.config

    // 401 Unauthorized 에러이고, 아직 재시도하지 않은 경우에만 처리합니다.
    // _retry 플래그를 사용하여 무한 루프를 방지합니다.
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 재시도 플래그를 설정하여 중복 처리 방지
      originalRequest._retry = true

      try {
        // 웹 브라우저에서는 Refresh Token이 쿠키로 자동 전송되므로 요청 바디 없음
        // 모바일의 경우 sessionStorage에서 refreshToken을 가져와서 보내야 함
        const refreshToken = sessionStorage.getItem('refreshToken')
        
        // Refresh Token을 사용하여 새 Access Token을 요청합니다.
        // 일반 axios를 사용하여 인터셉터를 우회합니다 (무한 루프 방지).
        // 쿠키로 전송되는 경우 요청 바디 없음, 모바일인 경우만 요청 바디에 포함
        const requestBody = refreshToken ? { refreshToken } : undefined
        const requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // 쿠키 전송을 위해 필요
        }
        
        console.log('Refresh Token 요청:', {
          hasRefreshTokenInStorage: !!refreshToken,
          hasCookies: document.cookie.includes('refreshToken'),
          requestBody: requestBody ? '있음' : '없음 (쿠키 사용)'
        })
        
        const response = await axios.post('/api/refresh', requestBody, requestConfig)

        // 새 Access Token을 추출합니다.
        // API 가이드에 따르면 응답 구조: { success: true, data: { accessToken, user } }
        const newAccessToken = response.data.data?.accessToken || response.data.accessToken
        
        if (!newAccessToken) {
          throw new Error('토큰 갱신 응답에 Access Token이 없습니다.')
        }
        
        // 새 Access Token을 메모리에 저장합니다 (XSS 공격에 상대적으로 안전).
        setAccessToken(newAccessToken)
        
        // 원래 요청의 Authorization 헤더를 새 토큰으로 업데이트합니다.
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        
        // 업데이트된 설정으로 원래 요청을 재시도합니다.
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh Token도 만료되었거나 유효하지 않은 경우
        // 모든 인증 정보를 제거하고 로그인 페이지로 이동합니다.
        setAccessToken(null) // 메모리에서 Access Token 제거
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('user')
        
        // 로그인 페이지로 강제 이동합니다.
        // window.location.href를 사용하여 전체 페이지를 새로고침합니다.
        window.location.href = '/login'
        
        // 에러를 거부하여 추가 처리를 방지합니다.
        return Promise.reject(refreshError)
      }
    }

    // 401 에러가 아니거나 이미 재시도한 경우 에러를 그대로 전달합니다.
    return Promise.reject(error)
  }
)

/**
 * apiClient 내보내기
 * 
 * 설정된 axios 인스턴스를 다른 모듈에서 사용할 수 있도록 내보냅니다.
 * 이 인스턴스를 사용하면 모든 요청에 자동으로 토큰이 추가되고,
 * 401 에러 시 자동으로 토큰 갱신이 시도됩니다.
 */
export default apiClient



