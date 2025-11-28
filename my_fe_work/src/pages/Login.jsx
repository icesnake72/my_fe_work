/**
 * Login 컴포넌트
 * 
 * 사용자 로그인을 처리하는 페이지 컴포넌트입니다.
 * 이메일과 비밀번호를 입력받아 서버에 인증 요청을 보내고,
 * 성공 시 Access Token과 Refresh Token을 안전하게 저장한 후 홈 페이지로 이동합니다.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.css'
import { useAuth } from '../contexts/useAuth'
import GNB from '../components/GNB'
import Footer from '../components/Footer'
import './Login.css'

function Login() {
  // React Router의 useNavigate 훅을 사용하여 페이지 이동 기능을 가져옵니다.
  const navigate = useNavigate()
  
  // AuthContext에서 login 함수를 가져옵니다.
  // 이 함수는 로그인 성공 시 토큰을 안전하게 저장하는 역할을 합니다.
  const { login } = useAuth()
  
  // 폼 데이터를 관리하는 상태입니다.
  // email과 password 필드의 값을 저장합니다.
  const [formData, setFormData] = useState({
    email: '',      // 사용자 이메일 주소
    password: ''    // 사용자 비밀번호
  })
  
  // 폼 유효성 검사 에러 메시지를 저장하는 상태입니다.
  // 각 필드별로 에러 메시지를 객체 형태로 저장합니다.
  // 예: { email: '이메일을 입력해주세요.', password: '비밀번호를 입력해주세요.' }
  const [errors, setErrors] = useState({})
  
  // API 요청 중인지 여부를 나타내는 로딩 상태입니다.
  // true일 때 버튼을 비활성화하고 '처리 중...' 텍스트를 표시합니다.
  const [isLoading, setIsLoading] = useState(false)

  /**
   * handleChange 함수
   * 
   * 입력 필드의 값이 변경될 때 호출되는 이벤트 핸들러입니다.
   * 
   * @param {Event} e - 입력 필드의 변경 이벤트 객체
   * 
   * 동작 과정:
   * 1. 이벤트에서 name(필드명)과 value(입력값)를 추출합니다.
   * 2. formData 상태를 업데이트하여 해당 필드의 값을 변경합니다.
   * 3. 해당 필드에 에러가 있다면 에러를 초기화합니다.
   *    (사용자가 입력을 시작하면 에러 메시지를 제거하여 UX를 개선합니다)
   */
  const handleChange = (e) => {
    // 이벤트 객체에서 입력 필드의 name 속성과 value 속성을 구조 분해 할당으로 추출합니다.
    const { name, value } = e.target
    
    // 이전 formData 상태를 복사하고, 변경된 필드만 업데이트합니다.
    // 함수형 업데이트를 사용하여 최신 상태를 보장합니다.
    setFormData(prev => ({
      ...prev,      // 이전 상태의 모든 필드를 복사
      [name]: value // 변경된 필드만 새로운 값으로 업데이트
    }))
    
    // 해당 필드에 에러가 있는 경우 에러를 초기화합니다.
    // 사용자가 입력을 시작하면 에러 메시지를 제거하여 더 나은 사용자 경험을 제공합니다.
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,      // 이전 에러 상태를 복사
        [name]: ''    // 해당 필드의 에러를 빈 문자열로 초기화
      }))
    }
  }

  /**
   * validateForm 함수
   * 
   * 폼의 유효성을 검사하는 함수입니다.
   * 각 필드에 대한 검증 규칙을 적용하고 에러 메시지를 생성합니다.
   * 
   * @returns {boolean} - 모든 검증을 통과하면 true, 그렇지 않으면 false를 반환합니다.
   * 
   * 검증 규칙:
   * 1. 이메일: 필수 입력, 올바른 이메일 형식 (정규식: /\S+@\S+\.\S+/)
   * 2. 비밀번호: 필수 입력
   */
  const validateForm = () => {
    // 새로운 에러 객체를 생성합니다.
    const newErrors = {}

    // 이메일 필드 검증
    if (!formData.email) {
      // 이메일이 비어있는 경우
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // 이메일 형식이 올바르지 않은 경우
      // 정규식 설명: \S+ (공백이 아닌 문자 1개 이상) @ \S+ . \S+
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    // 비밀번호 필드 검증
    if (!formData.password) {
      // 비밀번호가 비어있는 경우
      newErrors.password = '비밀번호를 입력해주세요.'
    }

    // 검증된 에러를 상태에 저장합니다.
    setErrors(newErrors)
    
    // 에러 객체의 키 개수가 0이면 검증 통과, 그렇지 않으면 실패
    return Object.keys(newErrors).length === 0
  }

  /**
   * handleSubmit 함수
   * 
   * 폼 제출 시 호출되는 비동기 함수입니다.
   * 폼 유효성 검사를 수행하고, 통과하면 서버에 로그인 요청을 보냅니다.
   * 
   * @param {Event} e - 폼 제출 이벤트 객체
   * 
   * 처리 과정:
   * 1. 기본 폼 제출 동작을 방지합니다 (페이지 새로고침 방지)
   * 2. 폼 유효성 검사를 수행합니다.
   * 3. 검증 통과 시 로딩 상태를 true로 설정합니다.
   * 4. 서버에 POST 요청을 보냅니다.
   * 5. 성공 시 토큰을 저장하고 홈 페이지로 이동합니다.
   * 6. 실패 시 에러 메시지를 표시합니다.
   * 7. finally 블록에서 로딩 상태를 false로 설정합니다.
   */
  const handleSubmit = async (e) => {
    // 기본 폼 제출 동작을 방지합니다 (페이지 새로고침 방지)
    e.preventDefault()
    
    // 폼 유효성 검사를 수행합니다.
    if (validateForm()) {
      // 검증 통과 시 로딩 상태를 활성화합니다.
      setIsLoading(true)
      
      try {
        // 서버에 로그인 API 요청을 보냅니다.
        // axios.post는 Promise를 반환하므로 await를 사용하여 응답을 기다립니다.
        const response = await axios.post('/api/login', {
          email: formData.email,        // 사용자가 입력한 이메일
          password: formData.password    // 사용자가 입력한 비밀번호
        })
        
        // 성공 응답을 콘솔에 출력합니다 (개발 중 디버깅용)
        console.log('로그인 성공:', response.data)
        
        // API 응답 구조: { success: true, message: "로그인 성공", data: { accessToken, refreshToken, user } }
        // 실제 토큰과 사용자 정보는 data 객체 안에 중첩되어 있습니다.
        const responseData = response.data.data
        
        // AuthContext의 login 함수를 호출하여 토큰을 안전하게 저장합니다.
        // Access Token은 메모리(React Context)에 저장되어 XSS 공격에 덜 취약합니다.
        // Refresh Token은 sessionStorage에 저장됩니다.
        login({
          accessToken: responseData.accessToken,    // JWT Access Token (짧은 만료 시간)
          refreshToken: responseData.refreshToken,  // JWT Refresh Token (긴 만료 시간)
          user: responseData.user                   // 사용자 정보 객체 (id, email, name, role 등)
        })
        
        // 서버에서 전달한 성공 메시지를 사용자에게 표시합니다.
        alert(response.data.message || '로그인 성공!')
        
        // 로그인 성공 후 홈 페이지로 이동합니다.
        navigate('/home')
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 정보를 출력합니다 (개발 중 디버깅용)
        console.error('로그인 실패:', error)
        
        // 에러 타입에 따라 적절한 메시지를 표시합니다.
        if (error.response) {
          // 서버에서 응답이 온 경우 (예: 400, 401, 500 등 HTTP 에러 상태 코드)
          // 에러 응답 구조는 다양할 수 있습니다: { message, error } 또는 { data: { message } }
          const errorData = error.response.data
          
          // 여러 가능한 경로에서 에러 메시지를 추출합니다.
          // 옵셔널 체이닝(?.)을 사용하여 안전하게 접근합니다.
          const errorMessage = errorData?.message || 
                              errorData?.error || 
                              errorData?.data?.message || 
                              '로그인에 실패했습니다.'
          alert(errorMessage)
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우 (네트워크 오류, 서버 다운 등)
          alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.')
        } else {
          // 요청 설정 중 에러가 발생한 경우 (요청 설정 오류)
          alert('로그인 요청 중 오류가 발생했습니다.')
        }
      } finally {
        // 성공 또는 실패와 관계없이 항상 실행되는 블록입니다.
        // 로딩 상태를 비활성화하여 버튼을 다시 활성화합니다.
        setIsLoading(false)
      }
    }
  }

  /**
   * 컴포넌트 렌더링
   * 
   * 로그인 폼과 관련 링크를 포함한 UI를 반환합니다.
   * Fragment(<>)를 사용하여 여러 요소를 그룹화합니다.
   */
  return (
    <>
      {/* 전역 네비게이션 바 컴포넌트 */}
      <GNB />
      
      {/* 로그인 폼을 감싸는 컨테이너 */}
      <div className="login-container">
        {/* 로그인 카드 (반투명 배경, 블러 효과) */}
        <div className="login-card">
          {/* 페이지 제목 */}
          <h1>로그인</h1>
          
          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* 이메일 입력 필드 그룹 */}
            <div className="form-group">
              <input
                type="email"                    // HTML5 이메일 타입 (모바일에서 적절한 키보드 표시)
                id="email"                      // label과 연결을 위한 고유 ID
                name="email"                    // 폼 데이터의 키 이름 (handleChange에서 사용)
                value={formData.email}          // 제어 컴포넌트: React 상태와 동기화
                onChange={handleChange}         // 입력 변경 시 호출되는 핸들러
                placeholder="이메일을 입력하세요" // 입력 필드 안내 텍스트
                className={errors.email ? 'error' : ''} // 에러가 있으면 'error' 클래스 추가
              />
              {/* 에러 메시지 표시: errors.email이 존재할 때만 렌더링 */}
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* 비밀번호 입력 필드 그룹 */}
            <div className="form-group">
              <input
                type="password"                 // 비밀번호 타입 (입력값이 마스킹됨)
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                className={errors.password ? 'error' : ''}
              />
              {/* 에러 메시지 표시 */}
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* 버튼 그룹 */}
            <div className="button-group">
              <button 
                type="submit"                    // 폼 제출 버튼
                className="login-button"        // 스타일링을 위한 클래스
                disabled={isLoading}             // 로딩 중일 때 버튼 비활성화
              >
                {/* 로딩 중이면 '처리 중...', 아니면 '로그인' 텍스트 표시 */}
                {isLoading ? '처리 중...' : '로그인'}
              </button>
            </div>

            {/* 회원가입 링크 컨테이너 */}
            <div className="signup-link-container">
              <span>계정이 없으신가요? </span>
              {/* React Router의 Link 컴포넌트: 클라이언트 사이드 라우팅 */}
              <Link to="/signup" className="signup-link">
                회원가입
                {/* Font Awesome 아이콘: 사용자 추가 아이콘 */}
                <i className="fas fa-user-plus"></i>
              </Link>
            </div>

            {/* 홈으로 돌아가기 링크 컨테이너 */}
            <div className="home-link-container">
              <Link to="/home" className="home-link">
                {/* Font Awesome 아이콘: 홈 아이콘 */}
                <i className="fas fa-home"></i>
                홈으로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* 전역 푸터 컴포넌트 */}
      <Footer />
    </>
  )
}

export default Login

