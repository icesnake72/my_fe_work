/**
 * Login 컴포넌트
 * 
 * 사용자 로그인을 처리하는 페이지 컴포넌트입니다.
 * 이메일과 비밀번호를 입력받아 서버에 인증 요청을 보내고,
 * 성공 시 Access Token과 Refresh Token을 안전하게 저장한 후 홈 페이지로 이동합니다.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  
  // 로그인 방식 선택 화면 표시 여부를 관리하는 상태입니다.
  // false: 로그인 방식 선택 화면 표시 (이메일 로그인 / 카카오 로그인)
  // true: 이메일/비밀번호 입력 폼 표시
  const [showLoginForm, setShowLoginForm] = useState(false)
  
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
   * handleKakaoLogin 함수
   * 
   * 카카오 로그인 버튼 클릭 시 호출되는 함수입니다.
   * 백엔드의 카카오 로그인 엔드포인트로 리다이렉트합니다.
   * 
   * 플로우:
   * 1. 프론트엔드: 카카오 로그인 시작
   *    → window.location.href = 'http://localhost:9080/auth/kakao/login'
   *    (vite proxy를 통해 /api/auth/kakao/login이 http://localhost:9080/auth/kakao/login으로 전달됨)
   */
  const handleKakaoLogin = () => {
    // vite proxy를 통해 /api/auth/kakao/login이 http://localhost:9080/auth/kakao/login으로 전달됨
    window.location.href = '/api/auth/kakao/login'
  }

  /**
   * handleEmailLogin 함수
   * 
   * 이메일 로그인 버튼 클릭 시 호출되는 함수입니다.
   * 이메일/비밀번호 입력 폼을 표시합니다.
   */
  const handleEmailLogin = () => {
    setShowLoginForm(true)
  }

  /**
   * handleBackToChoice 함수
   * 
   * 로그인 방식 선택 화면으로 돌아가는 함수입니다.
   */
  const handleBackToChoice = () => {
    setShowLoginForm(false)
    // 폼 데이터 초기화
    setFormData({ email: '', password: '' })
    setErrors({})
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
   * 4. AuthContext의 login 함수를 호출합니다.
   * 5. 성공 시 홈 페이지로 이동합니다.
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
        // AuthContext의 login 함수를 호출하여 로그인을 시도합니다.
        // 이 함수는 내부적으로 API를 호출하고 토큰을 저장합니다.
        await login(formData.email, formData.password)
        
        // 로그인 성공 메시지 표시
        alert('로그인 성공!')
        
        // 로그인 성공 후 홈 페이지로 이동합니다.
        navigate('/home')
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 정보를 출력합니다 (개발 중 디버깅용)
        console.error('로그인 실패:', error)
        
        // 에러 메시지 표시
        alert(error.message || '로그인에 실패했습니다.')
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
   * showLoginForm 상태에 따라 로그인 방식 선택 화면 또는 이메일/비밀번호 입력 폼을 표시합니다.
   * Fragment(<>)를 사용하여 여러 요소를 그룹화합니다.
   */
  return (
    <>
      {/* 전역 네비게이션 바 컴포넌트 */}
      <GNB />
      
      {/* 로그인 컨테이너 */}
      <div className="login-container">
        {/* 로그인 카드 (반투명 배경, 블러 효과) */}
        <div className="login-card">
          {!showLoginForm ? (
            /* 로그인 방식 선택 화면 */
            <>
              <h1>로그인</h1>
              <p className="login-choice-description">로그인 방식을 선택해주세요</p>
              
              <div className="login-choice-buttons">
                {/* 이메일 로그인 버튼 */}
                <button
                  type="button"
                  className="email-login-choice-button"
                  onClick={handleEmailLogin}
                >
                  <i className="fas fa-envelope"></i>
                  <span>이메일로 로그인</span>
                </button>

                {/* 카카오 로그인 버튼 */}
                <button
                  type="button"
                  className="kakao-login-choice-button"
                  onClick={handleKakaoLogin}
                >
                  <i className="fas fa-comment"></i>
                  <span>카카오로 로그인</span>
                </button>
              </div>

              {/* 회원가입 링크 컨테이너 */}
              <div className="signup-link-container">
                <span>계정이 없으신가요? </span>
                <Link to="/signup" className="signup-link">
                  회원가입
                  <i className="fas fa-user-plus"></i>
                </Link>
              </div>

              {/* 홈으로 돌아가기 링크 컨테이너 */}
              <div className="home-link-container">
                <Link to="/home" className="home-link">
                  <i className="fas fa-home"></i>
                  홈으로 돌아가기
                </Link>
              </div>
            </>
          ) : (
            /* 이메일/비밀번호 입력 폼 */
            <>
              <div className="login-form-header">
                <button
                  type="button"
                  className="back-button"
                  onClick={handleBackToChoice}
                  aria-label="뒤로가기"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <h1>이메일 로그인</h1>
              </div>
              
              {/* 로그인 폼 */}
              <form onSubmit={handleSubmit} className="login-form">
                {/* 이메일 입력 필드 그룹 */}
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* 비밀번호 입력 필드 그룹 */}
                <div className="form-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                {/* 버튼 그룹 */}
                <div className="button-group">
                  <button 
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? '처리 중...' : '로그인'}
                  </button>
                </div>

                {/* 회원가입 링크 컨테이너 */}
                <div className="signup-link-container">
                  <span>계정이 없으신가요? </span>
                  <Link to="/signup" className="signup-link">
                    회원가입
                    <i className="fas fa-user-plus"></i>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      
      {/* 전역 푸터 컴포넌트 */}
      <Footer />
    </>
  )
}

export default Login

