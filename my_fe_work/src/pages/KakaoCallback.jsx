/**
 * KakaoCallback 컴포넌트
 * 
 * 카카오 로그인 콜백을 처리하는 페이지 컴포넌트입니다.
 * 백엔드에서 카카오 인증 후 이 페이지로 리다이렉트되며,
 * URL 파라미터나 쿼리 스트링에서 토큰 정보를 받아 처리합니다.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import apiClient from '../utils/axiosConfig'
import GNB from '../components/GNB'
import Footer from '../components/Footer'
import './KakaoCallback.css'

function KakaoCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()
  const [status, setStatus] = useState('processing') // 'processing', 'success', 'error'
  const [message, setMessage] = useState('카카오 로그인 처리 중...')

  useEffect(() => {
    /**
     * 카카오 로그인 콜백 처리
     * 
     * 백엔드에서 카카오 인증 후 이 페이지로 리다이렉트되면,
     * URL에서 accessToken을 추출하여 처리합니다.
     * 
     * 처리 방식:
     * 1. URL에 accessToken이 직접 전달된 경우:
     *    a. accessToken을 임시로 sessionStorage에 저장
     *    b. /me API를 호출하여 사용자 정보 조회 (interceptor가 자동으로 Authorization 헤더 추가)
     *    c. 받은 사용자 정보와 토큰을 함께 저장
     * 2. URL에 code가 있는 경우: 백엔드 API를 호출하여 토큰 받기
     * 3. 에러가 있는 경우: 에러 처리
     */
    const handleKakaoCallback = async () => {
      try {
        // URL에서 파라미터 추출
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')

        // 에러가 있는 경우
        if (error) {
          setStatus('error')
          setMessage('카카오 로그인이 취소되었습니다.')
          setTimeout(() => {
            navigate('/login')
          }, 2000)
          return
        }

        // URL에 accessToken이 직접 전달된 경우 (백엔드가 쿼리 파라미터로 전달)
        if (accessToken) {
          try {
            // 1. /me API를 호출하여 사용자 정보 가져오기
            // 명시적으로 Authorization 헤더에 accessToken 추가
            // (loginWithToken 호출 전이므로 interceptor가 아직 토큰을 모름)
            const userResponse = await apiClient.get('/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })

            if (!userResponse.data || !userResponse.data.success) {
              throw new Error(userResponse.data?.message || '사용자 정보를 가져올 수 없습니다.')
            }

            const user = userResponse.data.data

            // 2. 토큰과 사용자 정보 저장 (loginWithToken이 메모리와 state 모두 업데이트)
            loginWithToken({
              accessToken,
              refreshToken: refreshToken || null,
              user: user
            })

            setStatus('success')
            setMessage('카카오 로그인 성공!')
            
            setTimeout(() => {
              navigate('/home')
            }, 1500)
            return
          } catch (tokenError) {
            console.error('토큰 처리 실패:', tokenError)
            throw tokenError
          }
        }

        // code가 있는 경우 백엔드 API를 호출하여 토큰 받기
        if (code) {
          try {
            // 백엔드의 카카오 콜백 엔드포인트 호출
            // vite proxy를 통해 /api/auth/kakao/callback이 http://localhost:9080/auth/kakao/callback으로 전달됨
            const response = await apiClient.get('/auth/kakao/callback', {
              params: { code },
              withCredentials: true // 쿠키 전송을 위해 필요
            })

            if (response.data && response.data.success) {
              const { accessToken: token, refreshToken: refresh, user } = response.data.data

              // 토큰 저장
              loginWithToken({
                accessToken: token,
                refreshToken: refresh || null, // 웹에서는 쿠키로 전송되므로 null일 수 있음
                user
              })

              setStatus('success')
              setMessage('카카오 로그인 성공!')
              
              setTimeout(() => {
                navigate('/home')
              }, 1500)
              return
            } else {
              throw new Error(response.data?.message || '카카오 로그인에 실패했습니다.')
            }
          } catch (apiError) {
            console.error('카카오 콜백 API 호출 실패:', apiError)
            
            // 네트워크 에러가 아닌 경우 응답 데이터 확인
            if (apiError.response) {
              const errorData = apiError.response.data
              throw new Error(errorData?.message || '카카오 로그인에 실패했습니다.')
            }
            throw apiError
          }
        }

        // code도 토큰도 없는 경우
        throw new Error('카카오 로그인 정보를 받을 수 없습니다. 다시 시도해주세요.')
      } catch (error) {
        console.error('카카오 로그인 콜백 처리 실패:', error)
        setStatus('error')
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            '카카오 로그인에 실패했습니다.'
        setMessage(errorMessage)
        
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    }

    handleKakaoCallback()
  }, [searchParams, navigate, loginWithToken])

  return (
    <>
      <GNB />
      <div className="kakao-callback-container">
        <div className="kakao-callback-card">
          {status === 'processing' && (
            <>
              <div className="spinner"></div>
              <h2>{message}</h2>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2>{message}</h2>
              <p>잠시 후 홈 페이지로 이동합니다...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="error-icon">✗</div>
              <h2>{message}</h2>
              <p>잠시 후 로그인 페이지로 이동합니다...</p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default KakaoCallback
