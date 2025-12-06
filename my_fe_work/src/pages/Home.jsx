import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import apiClient from '../utils/axiosConfig'
import axios from 'axios'
import GNB from '../components/GNB'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  const { user, refreshAccessToken, accessToken } = useAuth()
  const [testResult, setTestResult] = useState(null)
  const [isTesting, setIsTesting] = useState(false)

  /**
   * Refresh Token 테스트 함수
   * 
   * 백엔드의 /refresh 엔드포인트를 직접 호출하여 테스트합니다.
   * 쿠키에서 Refresh Token을 자동으로 읽어서 전송합니다.
   */
  const testRefreshToken = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      console.log('=== Refresh Token 테스트 시작 ===')
      console.log('현재 Access Token:', accessToken?.substring(0, 50) + '...')
      console.log('쿠키 확인:', document.cookie)

      // Refresh Token을 사용하여 새 Access Token 요청
      // 쿠키에서 자동으로 Refresh Token이 전송됩니다
      const response = await axios.post('/api/refresh', undefined, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // 쿠키 전송을 위해 필요
      })

      console.log('Refresh API 응답:', response.data)

      if (response.data.success) {
        const newAccessToken = response.data.data?.accessToken || response.data.accessToken
        const userInfo = response.data.data?.user

        setTestResult({
          success: true,
          message: 'Refresh Token 갱신 성공!',
          oldToken: accessToken?.substring(0, 50) + '...',
          newToken: newAccessToken?.substring(0, 50) + '...',
          user: userInfo,
          fullResponse: response.data
        })

        console.log('새 Access Token:', newAccessToken)
        console.log('사용자 정보:', userInfo)
      } else {
        throw new Error(response.data.message || '토큰 갱신에 실패했습니다.')
      }
    } catch (error) {
      console.error('Refresh Token 테스트 실패:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '토큰 갱신에 실패했습니다.'
      
      setTestResult({
        success: false,
        message: errorMessage,
        error: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        }
      })
    } finally {
      setIsTesting(false)
    }
  }

  /**
   * AuthContext의 refreshAccessToken 함수 테스트
   */
  const testAuthContextRefresh = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      console.log('=== AuthContext refreshAccessToken 테스트 시작 ===')
      const newToken = await refreshAccessToken()
      
      setTestResult({
        success: true,
        message: 'AuthContext refreshAccessToken 성공!',
        newToken: newToken?.substring(0, 50) + '...'
      })
    } catch (error) {
      console.error('AuthContext refreshAccessToken 테스트 실패:', error)
      setTestResult({
        success: false,
        message: error.message || '토큰 갱신에 실패했습니다.',
        error: error
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <>
      <GNB />
      <div className="home-container">
        <h1>Home 페이지</h1>
        {user && (
          <p>환영합니다, {user.name || user.email}님!</p>
        )}
        
        {/* Refresh Token 테스트 섹션 */}
        <div className="refresh-test-section">
          <h2>Refresh Token 테스트</h2>
          <div className="test-buttons">
            <button 
              onClick={testRefreshToken}
              disabled={isTesting}
              className="test-button"
            >
              {isTesting ? '테스트 중...' : 'Refresh API 직접 테스트'}
            </button>
            <button 
              onClick={testAuthContextRefresh}
              disabled={isTesting}
              className="test-button"
            >
              {isTesting ? '테스트 중...' : 'AuthContext refresh 테스트'}
            </button>
          </div>

          {/* 테스트 결과 표시 */}
          {testResult && (
            <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
              <h3>{testResult.success ? '✓ 성공' : '✗ 실패'}</h3>
              <p><strong>메시지:</strong> {testResult.message}</p>
              
              {testResult.success && (
                <>
                  {testResult.oldToken && (
                    <p><strong>이전 토큰:</strong> {testResult.oldToken}</p>
                  )}
                  {testResult.newToken && (
                    <p><strong>새 토큰:</strong> {testResult.newToken}</p>
                  )}
                  {testResult.user && (
                    <p><strong>사용자 정보:</strong> {JSON.stringify(testResult.user, null, 2)}</p>
                  )}
                </>
              )}
              
              {testResult.error && (
                <div className="error-details">
                  <p><strong>에러 상태:</strong> {testResult.error.status}</p>
                  <p><strong>에러 메시지:</strong> {testResult.error.message}</p>
                  {testResult.error.data && (
                    <pre>{JSON.stringify(testResult.error.data, null, 2)}</pre>
                  )}
                </div>
              )}
              
              <details>
                <summary>전체 응답 보기</summary>
                <pre>{JSON.stringify(testResult.fullResponse || testResult, null, 2)}</pre>
              </details>
            </div>
          )}

          {/* 현재 상태 정보 */}
          <div className="current-status">
            <h3>현재 상태</h3>
            <p><strong>Access Token:</strong> {accessToken ? accessToken.substring(0, 50) + '...' : '없음'}</p>
            <p><strong>사용자:</strong> {user ? `${user.name || user.email} (ID: ${user.id})` : '없음'}</p>
            <p><strong>쿠키:</strong> {document.cookie || '쿠키 없음'}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home

