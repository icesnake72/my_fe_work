/**
 * Signup 컴포넌트
 * 
 * 사용자 회원가입을 처리하는 페이지 컴포넌트입니다.
 * 이메일, 비밀번호, 비밀번호 확인, 이름을 입력받아 서버에 회원가입 요청을 보냅니다.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.css'
import GNB from '../components/GNB'
import Footer from '../components/Footer'
import './Signup.css'

function Signup() {
  // React Router의 useNavigate 훅을 사용하여 페이지 이동 기능을 가져옵니다.
  const navigate = useNavigate()
  
  // 폼 데이터를 관리하는 상태입니다.
  // 회원가입에 필요한 모든 필드의 값을 저장합니다.
  const [formData, setFormData] = useState({
    email: '',           // 사용자 이메일 주소
    password: '',        // 사용자 비밀번호
    confirmPassword: '', // 비밀번호 확인 (비밀번호 일치 검증용)
    username: ''         // 사용자 이름
  })
  
  // 폼 유효성 검사 에러 메시지를 저장하는 상태입니다.
  // 각 필드별로 에러 메시지를 객체 형태로 저장합니다.
  const [errors, setErrors] = useState({})
  
  // API 요청 중인지 여부를 나타내는 로딩 상태입니다.
  const [isLoading, setIsLoading] = useState(false)

  /**
   * handleChange 함수
   * 
   * 입력 필드의 값이 변경될 때 호출되는 이벤트 핸들러입니다.
   * 
   * @param {Event} e - 입력 필드의 변경 이벤트 객체
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 해당 필드에 에러가 있다면 에러를 초기화합니다.
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * validateForm 함수
   * 
   * 폼의 유효성을 검사하는 함수입니다.
   * 
   * @returns {boolean} - 모든 검증을 통과하면 true, 그렇지 않으면 false
   * 
   * 검증 규칙:
   * 1. 이메일: 필수 입력, 올바른 이메일 형식
   * 2. 비밀번호: 필수 입력, 최소 8자 이상
   * 3. 비밀번호 확인: 필수 입력, 비밀번호와 일치해야 함
   * 4. 이름: 필수 입력
   */
  const validateForm = () => {
    const newErrors = {}

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.'
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    // 이름 검증
    if (!formData.username) {
      newErrors.username = '이름을 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * handleSubmit 함수
   * 
   * 폼 제출 시 호출되는 비동기 함수입니다.
   * 
   * @param {Event} e - 폼 제출 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        // 서버에 회원가입 API 요청을 보냅니다.
        const response = await axios.post('/api/signup', {
          email: formData.email,
          password: formData.password,
          username: formData.username
          // confirmPassword는 서버로 전송하지 않습니다 (클라이언트 측 검증용)
        })
        
        console.log('회원가입 성공:', response.data)
        // 회원가입 성공 페이지로 이동합니다.
        navigate('/signup-success')
      } catch (error) {
        console.error('회원가입 실패:', error)
        
        // 에러 타입에 따라 적절한 메시지를 표시합니다.
        if (error.response) {
          const errorMessage = error.response.data?.message || error.response.data?.error || '회원가입에 실패했습니다.'
          alert(errorMessage)
        } else if (error.request) {
          alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.')
        } else {
          alert('회원가입 요청 중 오류가 발생했습니다.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <GNB />
      <div className="signup-container">
        <div className="signup-card">
          <h1>회원가입</h1>
          <form onSubmit={handleSubmit} className="signup-form">
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

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요 (최소 8자)"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="button-group">
              <button type="submit" className="signup-button" disabled={isLoading}>
                {isLoading ? '처리 중...' : '회원가입'}
              </button>
            </div>

            <div className="login-link-container">
              <span>이미 회원이신가요? </span>
              <Link to="/login" className="login-link">
                로그인하세요
                <i className="fas fa-sign-in-alt"></i>
              </Link>
            </div>

            <div className="home-link-container">
              <Link to="/home" className="home-link">
                <i className="fas fa-home"></i>
                홈으로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Signup

